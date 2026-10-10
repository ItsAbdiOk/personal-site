#!/opt/homebrew/bin/python3.14
"""Step 1b: split each examiners' report into per-question comments and link them to question records
(by paper code + series + question number). Pure rules. Output: <OUT>/reports.json"""
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from split_questions import clean

HEAD = re.compile(r"^Questions?\s+(\d{1,2})\s*\*?\s*((?:\(\s*[a-z]{1,4}\s*\)\s*)*)\*?$", re.I)
NOISE = re.compile(r"(Examiners.? report$)|^\d+\s*©\s*OCR|^©\s*OCR|^￼$|^Copyright information|^Supporting you|^Contents$|^Would you prefer|^\d+$")
STOP = re.compile(r"^(Copyright information|Supporting you|Need to get in touch|OCR customer support|Looking for a resource)", re.I)

def main():
    questions = json.load(open(OUT + "questions.json"))
    byid = {q["id"]: q for q in questions}
    out, nreports = [], 0
    for p in paper_pdfs():
        if not p["er"] or not os.path.exists(p["er"]): continue
        nreports += 1
        pages = load_lines(p["er"])
        cur, started, stop = None, False, False
        comments = []
        for pi, pg in enumerate(pages):
            for (x0, y0, x1, y1, t) in pg["lines"]:
                t = clean(t)
                if not t: continue
                if STOP.match(t) and started: stop = True; break
                m = HEAD.match(t)
                if m and x0 < 120:
                    started = True
                    part = re.sub(r"\s+", "", m.group(2) or "")
                    cur = dict(n=int(m.group(1)), part=part, lines=[], pages=[pi + 1])
                    comments.append(cur); continue
                if cur is None or NOISE.search(t): continue
                cur["lines"].append(t)
                if pi + 1 not in cur["pages"]: cur["pages"].append(pi + 1)
            if stop: break
        for c in comments:
            qid = f"{p['code']} {p['series']} Q{c['n']}"
            text = "\n".join(c["lines"]).strip()
            out.append(dict(questionId=qid, linked=qid in byid, paper=p["code"], series=p["series"], qnum=c["n"],
                            part=c["part"], pages=c["pages"], pdf=rel(p["er"]), text=text))
    json.dump(out, open(OUT + "reports.json", "w"), ensure_ascii=False, indent=1)
    n = len(out); l = sum(c["linked"] for c in out)
    nonempty = sum(1 for c in out if c["text"])
    qs_with = len({c["questionId"] for c in out if c["linked"]})
    print(f"reports parsed {nreports}; comments {n} (non-empty {nonempty}); linked {l} ({100*l/max(n,1):.1f}%); "
          f"question records with >=1 comment {qs_with}/{len(questions)}")
    bad = sorted({c["questionId"] for c in out if not c["linked"]})
    print("unlinked ids:", bad[:25])

if __name__ == "__main__":
    main()
