#!/opt/homebrew/bin/python3.14
"""Step 1d: split PhysicsAndMathsTutor topic-pack questions (Sets N, O current spec; C, M older OCR spec; A skipped)
and link each to the original paper/question by fuzzy text matching (word 3-gram containment, then difflib check).
Output: <OUT>/pmt.json"""
import re, json, os, sys, glob, difflib, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from split_questions import clean, chain

PMT = Z + "06 Topic question packs (PhysicsAndMathsTutor)/"
NOISE = re.compile(r"PhysicsAndMathsTutor|^￼$|^\d+\.\d+ .* - |^Mark scheme [–-]|^Your answer$|^…$", re.I)
QSTART = re.compile(r"^(\d{1,2})(?:\(\w+\))?(?:\.|\s|$)\s*(.*)$")

def toks(t):
    t = t.lower().replace("−", "-").replace("–", "-").replace("’", "'")
    t = re.sub(r"[…]+|\.{3,}", " ", t)
    return re.findall(r"[a-z0-9]+(?:\.[0-9]+)?", t)

def shingles(tk, n=3):
    return {" ".join(tk[i:i + n]) for i in range(max(0, len(tk) - n + 1))}

def split_pack(pdf, ms=False):
    pages = load_lines(pdf)
    cands = []
    for pi, pg in enumerate(pages):
        for (x0, y0, x1, y1, t) in pg["lines"]:
            t = clean(t)
            if not t or y1 > pg["h"] - 12 and "PhysicsAndMathsTutor" in t: continue
            lim = 125 if ms else 78
            if x0 <= lim and y0 > 40:
                m = QSTART.match(t)
                if m and 1 <= int(m.group(1)) <= 60 and not NOISE.search(t):
                    cands.append(dict(n=int(m.group(1)), page=pi, y1=y1, x0=x0))
    if cands:
        mode = collections.Counter(round(c["x0"] / 6) for c in cands).most_common(1)[0][0] * 6
        cands = [c for c in cands if abs(c["x0"] - mode) <= 14]
    st = chain(cands)
    out = []
    for k, s in enumerate(st):
        nxt = st[k + 1] if k + 1 < len(st) else None
        lines, pgs = [], []
        for pi in range(s["page"], (nxt["page"] if nxt else len(pages) - 1) + 1):
            for (x0, y0, x1, y1, t) in pages[pi]["lines"]:
                t = clean(t)
                if not t or NOISE.search(t) or t == "…": continue
                if pi == s["page"] and y1 > s["y1"] + 4: continue
                if nxt and pi == nxt["page"] and y1 <= nxt["y1"] + 4: continue
                lines.append(t)
                if pi + 1 not in pgs: pgs.append(pi + 1)
        out.append(dict(n=s["n"], pages=pgs or [s["page"] + 1], text="\n".join(lines).strip()))
    return out

def main():
    questions = json.load(open(OUT + "questions.json"))
    index = collections.defaultdict(set)
    qsh = []
    for i, q in enumerate(questions):
        sh = shingles(toks(q["text"]))
        qsh.append(sh)
        for s in sh: index[s].add(i)
    recs = []
    for chdir in sorted(glob.glob(PMT + "Chapter *")):
        chname = os.path.basename(chdir)
        for qpdf in sorted(glob.glob(chdir + "/Set * Questions.pdf")):
            m = re.match(r"Set (\w+?)(?: (.+))? Questions\.pdf", os.path.basename(qpdf))
            sett, topic = m.group(1), m.group(2) or ""
            if sett == "A": continue
            era = "older OCR spec" if sett[0] in "CM" else "current spec (OCR H156/H556)"
            mspdf = qpdf.replace("Questions.pdf", "Mark scheme.pdf")
            msq = {r["n"]: r for r in split_pack(mspdf, ms=True)} if os.path.exists(mspdf) else {}
            for r in split_pack(qpdf):
                tk = toks(r["text"]); sh = shingles(tk)
                best, bscore = None, 0.0
                if sh:
                    cnt = collections.Counter()
                    for s in sh:
                        for i in index.get(s, ()): cnt[i] += 1
                    for i, c in cnt.most_common(5):
                        sc = c / len(sh)
                        if sc > bscore: best, bscore = i, sc
                ratio = None
                if best is not None:
                    a = " ".join(tk)[:600]; b = " ".join(toks(questions[best]["text"]))
                    ratio = round(difflib.SequenceMatcher(None, a, b[:3000], autojunk=False).find_longest_match(0, len(a), 0, min(len(b), 3000)).size / max(len(a), 1), 3)
                conf = "high" if bscore >= 0.7 else "medium" if bscore >= 0.4 else None
                near = dict(questionId=questions[best]["id"], score=round(bscore, 3)) if (best is not None and 0.2 <= bscore < 0.4) else None
                link = dict(questionId=questions[best]["id"], score=round(bscore, 3), longestRun=ratio, confidence=conf) if conf else None
                status = ("linked" if link else "unmatched")
                if era == "older OCR spec": status = "older OCR spec" + (" (matches current paper)" if link else " (unmatched)")
                recs.append(dict(id=f"PMT {chname.split(' ')[1]} Set {sett}{(' ' + topic) if topic else ''} Q{r['n']}",
                                 chapterFolder=chname, set=sett, topic=topic, era=era, qnum=r["n"],
                                 pdf=rel(qpdf), pages=r["pages"], text=r["text"],
                                 ms=(dict(pdf=rel(mspdf), text=msq[r["n"]]["text"], pages=msq[r["n"]]["pages"]) if r["n"] in msq else None),
                                 link=link, nearest=near, status=status))
    json.dump(recs, open(OUT + "pmt.json", "w"), ensure_ascii=False, indent=1)
    cur = [r for r in recs if r["era"].startswith("current")]
    old = [r for r in recs if r["era"].startswith("older")]
    lk = sum(1 for r in cur if r["link"]); lo = sum(1 for r in old if r["link"])
    print(f"PMT questions {len(recs)}: current-spec (N/O) {len(cur)}, linked {lk} ({100*lk/max(len(cur),1):.1f}%); "
          f"older-spec (C/M) {len(old)}, matched to a current paper {lo}")
    c = collections.Counter(r["link"]["confidence"] for r in recs if r["link"])
    print("confidence:", dict(c))
    byset = collections.Counter((r["chapterFolder"][:9], r["set"], bool(r["link"])) for r in cur)
    print("N/O per chapter linked/total:", {k: v for k, v in sorted(byset.items())})

if __name__ == "__main__":
    main()
