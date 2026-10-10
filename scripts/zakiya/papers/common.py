"""Shared helpers for the past-paper sorting pipeline (stdlib only, deterministic)."""
import json, os, re, glob

Z = "/Users/abdi/Downloads/Zakiya A-Level Physics/"
OUT = Z + "11 Sorted by topic (generated)/"
CACHE = OUT + "_cache/"
LINES = CACHE + "lines/"
HERE = os.path.dirname(os.path.abspath(__file__))
SWIFT_LINES = os.path.join(HERE, "bin", "pdflines")

def rel(p):
    return p[len(Z):] if p.startswith(Z) else p

def lines_cache_path(pdf):
    return LINES + rel(pdf).replace("/", "~") + ".json"

_mem = {}
def load_lines(pdf):
    """Return list of pages; each page = {'w','h','lines':[(x0,y0,x1,y1,text),...]} sorted top-to-bottom."""
    if pdf in _mem:
        return _mem[pdf]
    cp = lines_cache_path(pdf)
    if not os.path.exists(cp):
        import subprocess
        os.makedirs(LINES, exist_ok=True)
        subprocess.run([SWIFT_LINES, pdf, cp], stderr=subprocess.DEVNULL, check=True)
    with open(cp) as f:
        d = json.load(f)
    pages = []
    for p in d["pages"]:
        ls = [tuple(l) for l in p["lines"]]
        rot = False
        # Some specimen PDFs have sideways (landscape) content on a portrait page: map to reading coordinates.
        cand = [l for l in ls if len(l[4]) >= 5 and l[4] not in ("SPECIMEN",)]
        tall = sum(1 for l in cand if (l[3] - l[1]) > 3 * (l[2] - l[0]))
        if cand and tall > 0.6 * len(cand):
            rot = True
            W, H = p["w"], p["h"]
            ls = [(l[1], W - l[2], l[3], W - l[0], l[4]) for l in ls]
            p = dict(p, w=H, h=W)
        ls.sort(key=lambda l: (-round(l[3] / 3), l[0]))
        pages.append({"w": p["w"], "h": p["h"], "lines": ls, "rot": rot})
    _mem[pdf] = pages
    return pages

def paper_pdfs():
    """Yield dicts for every current-spec paper (past papers + SAMs)."""
    out = []
    for f in sorted(glob.glob(Z + "03 Past papers/*/*Question paper.pdf")):
        b = os.path.basename(f)
        m = re.match(r"(AS|A-level) Paper (\d) (June|November|Specimen)( \d{4})? Question paper\.pdf", b)
        level, pn, ser, yr = m.group(1), m.group(2), m.group(3), (m.group(4) or "").strip()
        code = ("H156-0" if level == "AS" else "H556-0") + pn
        series = f"{ser} {yr}".strip()
        out.append(dict(code=code, level=level, paperNo=int(pn), series=series, year=int(yr) if yr else 2015,
                        qp=f, ms=f.replace("Question paper.pdf", "Mark scheme.pdf"),
                        er=(Z + f"04 Examiners reports/{level}/{level} Paper {pn} {series} examiners report.pdf"),
                        kind="past"))
    sam = {"h156 01": "H156-01", "h156 02": "H156-02", "h556 01": "H556-01", "h556 02": "H556-02", "h556 03": "H556-03"}
    for f in sorted(glob.glob(Z + "05 Sample assessment materials/*.pdf")):
        b = os.path.basename(f)
        code = sam[b[:7]]
        out.append(dict(code=code, level="AS" if code[0:4] == "H156" else "A-level", paperNo=int(code[-1]),
                        series="SAM", year=2014, qp=f, ms=f, er=None, kind="sam"))
    return out

def pid(p):
    return f"{p['code']} {p['series']}"
