#!/opt/homebrew/bin/python3.14
"""Step 1e: write per-chapter bundle.md + index.json (tagged questions, newest first, with sources, mark schemes,
examiner comments, keywords fired, PMT links; PMT definitions excerpt + spec statements at the top)."""
import re, json, os, sys, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from spec_module3 import CHAPTERS

DEFS = Z + "08 Definitions (PhysicsAndMathsTutor)/Module 3 Definitions (text).txt"

def definitions():
    sec, cur = {}, None
    for line in open(DEFS):
        line = line.rstrip("\n")
        m = re.match(r"^3\.([1-5]):", line)
        if m: cur = int(m.group(1)) + 2; sec[cur] = []; continue          # 3.1 -> chapter 3 ... 3.5 -> chapter 7
        if cur is None or line.startswith("=== PAGE") or "bit.ly" in line or line.startswith("Definitions and Concepts"): continue
        sec[cur].append(line)
    return {c: "\n".join(v).strip() for c, v in sec.items()}

SER_ORDER = {"November": 1, "June": 2}
def sort_key(q):
    s = q["series"].split()[0]
    return (-q["year"], -SER_ORDER.get(s, 0), q["paper"], q["qnum"])

def main():
    Q = json.load(open(OUT + "questions.json")); T = json.load(open(OUT + "tags.json"))
    R = json.load(open(OUT + "reports.json")); P = json.load(open(OUT + "pmt.json"))
    defs = definitions()
    reps = collections.defaultdict(list)
    for r in R:
        if r["text"]: reps[r["questionId"]].append(r)
    pmt_by_q = collections.defaultdict(list)
    for p in P:
        if p["link"]: pmt_by_q[p["link"]["questionId"]].append(p)
    summary = {}
    for ch, d in CHAPTERS.items():
        folder = OUT + d["title"] + "/"
        os.makedirs(folder, exist_ok=True)
        qs = sorted([q for q in Q if ch in T[q["id"]]["chapters"]], key=sort_key)
        entries = []
        for q in qs:
            hits = T[q["id"]]["hits"][str(ch)]
            e = dict(id=q["id"], paper=q["paper"], paperType=q["paperType"], series=q["series"], qnum=q["qnum"],
                     isMCQ=q["isMCQ"], marks=q["marks"], parts=q["parts"], currentSpec=q["currentSpec"],
                     qp=q["qp"], ms=q["ms"], msNote=q.get("msNote"), text=q["text"],
                     mcqKey=(q["ms"] or {}).get("key") if q["isMCQ"] else None,
                     examinerComments=[dict(part=r["part"], text=r["text"], pdf=r["pdf"], pages=r["pages"]) for r in reps.get(q["id"], [])],
                     keywordsFired=hits, chaptersTagged=T[q["id"]]["chapters"],
                     pmtLinks=[dict(id=p["id"], score=p["link"]["score"], confidence=p["link"]["confidence"], era=p["era"]) for p in pmt_by_q.get(q["id"], [])],
                     showSource=f'scripts/zakiya/papers/show_source.sh "{q["id"]}"')
            entries.append(e)
        pmt_only = [dict(id=p["id"], era=p["era"], status=p["status"], pdf=p["pdf"], pages=p["pages"], text=p["text"],
                         ms=p["ms"], nearest=p.get("nearest")) for p in P
                    if p["chapterFolder"].startswith(f"Chapter {ch}") and not p["link"]]
        idx = dict(chapter=ch, title=d["title"], specSection=d["spec"],
                   specStatements=[dict(code=c, text=t) for c, t in d["statements"]],
                   pmtDefinitions=defs.get(ch, ""), counts=dict(questions=len(entries), mcq=sum(e["isMCQ"] for e in entries),
                   withExaminerComments=sum(1 for e in entries if e["examinerComments"]), withPmtLinks=sum(1 for e in entries if e["pmtLinks"])),
                   questions=entries, pmtOnlyQuestions=pmt_only)
        json.dump(idx, open(folder + "index.json", "w"), ensure_ascii=False, indent=1)
        # ---- markdown
        L = [f"# {d['title']} (OCR H556 spec {d['spec']})", "",
             f"{len(entries)} tagged questions, current spec, newest first. Tags are keyword-based (over-inclusive on purpose): a question may be only partly about this chapter.", "",
             "## Spec statements", ""]
        L += [f"- **{c}** {t}" for c, t in d["statements"]]
        L += ["", "## PMT definitions", "", defs.get(ch, "(none)"), "", "---", ""]
        for e in entries:
            qp, ms = e["qp"], e["ms"]
            L.append(f"## {e['id']} ({e['marks']} mark{'s' if e['marks'] != 1 else ''}{', MCQ' if e['isMCQ'] else ''})")
            L.append("")
            L.append(f"- Question paper: `{qp['pdf']}` p{','.join(map(str, qp['pages']))}")
            if ms: L.append(f"- Mark scheme: `{ms['pdf']}` p{','.join(map(str, ms['pages']))}")
            elif e.get("msNote"): L.append(f"- Mark scheme: none ({e['msNote']})")
            L.append(f"- View: `{e['showSource']}` (add `--ms` for the mark scheme, `--page` for the whole page)")
            if e["parts"]: L.append("- Parts: " + ", ".join(f"({p['label']}) {p['marks']}" for p in e["parts"]))
            other = [c for c in e["chaptersTagged"] if c != ch]
            L.append("- Also tagged: " + (", ".join(f"Ch{c}" for c in other) if other else "none"))
            L.append("- Keywords fired (this chapter): " + "; ".join(f"{h['kw']} [{h['strength']}{'/ms' if h['src']=='ms' else ''}]" for h in e["keywordsFired"]))
            if e["pmtLinks"]: L.append("- PMT links: " + "; ".join(f"{p['id']} ({p['confidence']}{', ' + p['era'] if p['era'].startswith('older') else ''})" for p in e["pmtLinks"]))
            L += ["", "**Question**", "", "```", e["text"], "```", ""]
            if ms:
                L += ["**Mark scheme**" + (f" (answer: {e['mcqKey']})" if e["mcqKey"] else "") , "", "```", ms["text"] or "(see PDF)", "```", ""]
            if e["examinerComments"]:
                L.append("**Examiner comments**"); L.append("")
                for c in e["examinerComments"]:
                    L.append(f"- Part {c['part'] or '(whole)'} (report p{','.join(map(str, c['pages']))}): " + c["text"].replace("\n", " "))
                L.append("")
            L.append("---"); L.append("")
        if pmt_only:
            L += [f"## PMT questions in this chapter's packs with no matching paper question ({len(pmt_only)})", "",
                  "Older OCR spec sets (C, M) and N/O questions that did not match any paper in the folder. Full text in index.json.", ""]
            for p in pmt_only:
                L.append(f"- {p['id']} [{p['status']}] {p['text'][:140].replace(chr(10), ' ')}")
        open(folder + "bundle.md", "w").write("\n".join(L))
        summary[ch] = (len(entries), sum(1 for e in entries if e["examinerComments"]), len(pmt_only))
        print(f"{d['title']}: {len(entries)} questions, {summary[ch][1]} with examiner comments, {len(pmt_only)} PMT-only")

if __name__ == "__main__":
    main()
