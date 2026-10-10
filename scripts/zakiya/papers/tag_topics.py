#!/opt/homebrew/bin/python3.14
"""Step 1c: tag each question with Module 3 chapters (3 Motion, 4 Forces in action, 5 Work/energy/power,
6 Materials, 7 Newton's laws & momentum) using keyword/regex rules from the spec text. No AI.
Rule: tag a chapter if the question text has >=1 'strong' keyword, or >=2 distinct 'weak' keywords (3 for Chapter 3),
or the mark-scheme text has >=2 distinct strong keywords. Borderline => over-include.
Output: <OUT>/tags.json  { question id: {chapters:[..], hits:{ch:[{kw,strength,src,spec}...]}} }"""
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from spec_module3 import CHAPTERS

def norm(t):
    t = t.lower()
    t = t.replace("–", "-").replace("−", "-").replace("’", "'").replace("‘", "'").replace(" ", " ")
    return re.sub(r"\s+", " ", t)

COMPILED = {ch: [(l, re.compile(rx, re.I), s, code) for (l, rx, s, code) in d["patterns"]] for ch, d in CHAPTERS.items()}

def tag_text(qp, ms):
    qn, mn = norm(qp), norm(ms or "")
    result = {}
    for ch, pats in COMPILED.items():
        hits = []
        for (label, rx, strength, code) in pats:
            if rx.search(qn): hits.append(dict(kw=label, strength=strength, src="qp", spec=code))
            elif strength == "strong" and mn and rx.search(mn): hits.append(dict(kw=label, strength=strength, src="ms", spec=code))
        qs = sum(1 for h in hits if h["strength"] == "strong" and h["src"] == "qp")
        qw = sum(1 for h in hits if h["strength"] == "weak" and h["src"] == "qp")
        ms_s = sum(1 for h in hits if h["src"] == "ms")
        if qs >= 1 or qw >= CHAPTERS[ch].get('weak_min', 2) or ms_s >= 2:
            result[ch] = hits
    return result

def main():
    questions = json.load(open(OUT + "questions.json"))
    tags, counts = {}, {c: 0 for c in CHAPTERS}
    for q in questions:
        r = tag_text(q["text"], q["ms"]["text"] if q["ms"] else "")
        tags[q["id"]] = dict(chapters=sorted(r), hits={str(c): h for c, h in r.items()})
        for c in r: counts[c] += 1
    json.dump(tags, open(OUT + "tags.json", "w"), ensure_ascii=False, indent=1)
    tagged = sum(1 for t in tags.values() if t["chapters"])
    print("tagged questions:", tagged, "/", len(questions))
    for c, n in counts.items(): print(f"  Chapter {c} {CHAPTERS[c]['name']}: {n}")

if __name__ == "__main__":
    main()
