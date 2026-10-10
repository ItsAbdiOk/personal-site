#!/opt/homebrew/bin/python3.14
"""Render the source region of a question (or its mark-scheme entry) as a small JPEG."""
import sys, os, re, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

IMG_DIR = "/private/tmp/claude-501/-Users-abdi/f7d6f394-f350-4af2-bc7f-ce667ecb6daf/scratchpad/source-views/"
CROP = os.path.join(HERE, "bin", "pdfcrop")
WIDTH, QUALITY, MAXH = 1000, 0.6, 2300

def slug(s):
    return re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")

def render(pdf, specs, rot, out_base):
    os.makedirs(IMG_DIR, exist_ok=True)
    args = [CROP, pdf, out_base, str(WIDTH), str(QUALITY), "1" if rot else "0", str(MAXH)] + [f"{p},{t},{b}" for p, t, b in specs]
    r = subprocess.run(args, capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l.endswith(".jpg")]

def bands(pdf, pages, start, end, kind, whole):
    """specs [(page, yTop, yBottom)] in reading coordinates; falls back to whole pages if anything is missing."""
    lp = load_lines(pdf)
    if whole or not start or not pages:
        return [(p, -1, -1) for p in pages or ([start["page"]] if start else [1])], False
    H = lp[pages[0] - 1]["h"]
    top_body = H - 51 if kind == "qp" else None
    specs = []
    for i, p in enumerate(pages):
        if kind == "qp":
            top = (start["y"] + 8) if i == 0 else H - 52
            bot = 44
        else:
            top = (start["y"] + 5) if i == 0 else None
            if top is None:       # continuation page: just below the column-header row
                hdr = [l for l in lp[p - 1]["lines"] if re.match(r"^Question", l[4])]
                top = (min(l[1] for l in hdr) - 2) if hdr else H - 55
            bot = 40
            if not (end and p == end["page"]):      # trim blank space under the last table row of this page
                from split_questions import ms_content
                ys = [l[1] for l in ms_content(lp[p - 1]) if l[1] > 62 and l[1] < top]
                if ys: bot = max(40, min(ys) - 14)
        if end and p == end["page"]:
            bot = end["y"] + 6
        if bot >= top - 15:                  # degenerate -> whole page
            specs.append((p, -1, -1))
        else:
            specs.append((p, round(top, 1), round(bot, 1)))
    return specs, True

def main():
    args = [a for a in sys.argv[1:]]
    if not args:
        print(__doc__); sys.exit(1)
    # raw form: <pdf> <page>
    if len(args) >= 2 and args[0].lower().endswith(".pdf") and args[1].isdigit():
        pdf = args[0] if os.path.isabs(args[0]) else Z + args[0]
        if not os.path.exists(pdf):
            import glob
            hit = glob.glob(Z + "**/" + os.path.basename(args[0]), recursive=True)
            if not hit: print("pdf not found: " + args[0], file=sys.stderr); sys.exit(2)
            pdf = hit[0]
        pg = load_lines(pdf)
        n = int(args[1])
        out = render(pdf, [(n, -1, -1)], pg[n - 1]["rot"], IMG_DIR + "raw_" + slug(os.path.basename(pdf)) + f"_p{n}")
        print("\n".join(out)); return
    whole = "--page" in args
    ms = "--ms" in args
    qid = " ".join(a for a in args if not a.startswith("--")).strip()
    with open(OUT + "questions.json") as f:
        Q = json.load(f)
    rec = next((q for q in Q if q["id"].lower() == qid.lower()), None)
    if not rec:
        print(f"unknown question id: {qid}", file=sys.stderr); sys.exit(2)
    src = rec["ms"] if ms else rec["qp"]
    if not src:
        print("no mark scheme for this question" + (": " + rec["msNote"] if rec.get("msNote") else ""), file=sys.stderr); sys.exit(3)
    pdf = Z + src["pdf"]
    lp = load_lines(pdf)
    rot = lp[src["pages"][0] - 1]["rot"]
    specs, ok = bands(pdf, src["pages"], src["start"], src.get("end"), "ms" if ms else "qp", whole)
    out = render(pdf, specs, rot, IMG_DIR + slug(rec["id"]) + ("_ms" if ms else "_qp") + ("_page" if (whole or not ok) else ""))
    print("\n".join(out))
    print(f"# {'MS' if ms else 'QP'} pages {src['pages']} {'cropped' if ok else 'whole page(s)'}", file=sys.stderr)

if __name__ == "__main__":
    main()
