#!/opt/homebrew/bin/python3.14
"""Step 1a: split every current-spec question paper (past papers + SAMs) into questions/parts,
and the matching mark scheme into per-question entries. Pure rules, no AI.
Output: <OUT>/questions.json  (+ <OUT>/_cache/split_report.txt)"""
import re, json, sys, os, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

PAGE_TOP, PAGE_BOT = 790, 46          # QP content region (portrait, PDF points)

# ---------- generic line helpers ----------
DOTS = re.compile(r"[\.…_․·]{4,}|(?:\. ){6,}")
def clean(t):
    t = t.replace(" ", " ").replace("￼", "")
    t = DOTS.sub(" … ", t)
    return re.sub(r"\s+", " ", t).strip()

QP_NOISE = re.compile(r"^(PMT|SPECIMEN|Turn over|BLANK PAGE|PLEASE DO NOT WRITE ON THIS PAGE|…|\* ?[A-Z0-9]{6,} ?\*)$|^©\s*OCR|^© UCLES|"
                      r"^(H[15]56/\d\d)( .*)?$|^SECTION [A-D]$|^Additional answer space|^Answer all the questions\.?$|"
                      r"^You should spend a maximum|^Write your answer to each question in the box|^END OF QUESTION PAPER|"
                      r"^Copyright Information|^Oxford Cambridge and RSA|^\d{5,}/\d$|^DC \(|^OCR is an exempt|^[A-Z]{2}\d{3,}", re.I)

def qp_content(page, lo=0):
    """content lines of a QP page: (x0,y0,x1,y1,text) with noise removed"""
    out = []
    for (x0, y0, x1, y1, t) in page["lines"]:
        t = clean(t)
        if not t or t == "…":
            continue
        if y0 > 781 and re.fullmatch(r"\d{1,3}|PMT", t):      # header page number / watermark
            continue
        if y0 < 62 and (re.fullmatch(r"\d{1,3}", t) or QP_NOISE.match(t)):
            continue
        if QP_NOISE.match(t):
            continue
        out.append((x0, y0, x1, y1, t))
    return out

QNUM = re.compile(r"^(\d{1,2})(\*?)(?:\s+(\S.*))?$")

def chain(cands, expect_start=1):
    """Greedy +1 chain in reading order; a number may be skipped only if it never appears later
    (e.g. a question withdrawn from the paper)."""
    out, exp = [], expect_start
    for i, c in enumerate(cands):
        if c["n"] == exp:
            out.append(c); exp += 1
        elif exp < c["n"] <= exp + 2 and not any(d["n"] == exp for d in cands[i + 1:]):
            out.append(c); exp = c["n"] + 1
    return out

# ---------- question paper ----------
def split_qp(pages, first, last):
    cands = []
    for pi in range(first, last):
        for (x0, y0, x1, y1, t) in qp_content(pages[pi]):
            if 24 <= x0 <= 66 and y0 < 781:
                m = QNUM.match(t)
                if m and 1 <= int(m.group(1)) <= 40:
                    cands.append(dict(n=int(m.group(1)), page=pi, x0=x0, y0=y0, y1=y1, rest=m.group(3) or "", star=bool(m.group(2))))
    # restrict to the modal x of candidates (question-number gutter)
    if cands:
        mode = collections.Counter(round(c["x0"] / 4) for c in cands).most_common(1)[0][0] * 4
        cands = [c for c in cands if abs(c["x0"] - mode) <= 10]
    ch = chain(cands)
    return ch

PART_L = re.compile(r"^\(([a-z])\)\*?(?:\s+(.*))?$")
PART_R = re.compile(r"^\((i{1,3}|iv|v|vi{1,3}|ix|x)\)\*?(?:\s+(.*))?$")
MARK = re.compile(r"\[(\d{1,2})\]")

def build_qp_records(pages, first, last, starts):
    recs = []
    for k, s in enumerate(starts):
        nxt = starts[k + 1] if k + 1 < len(starts) else None
        text_lines, parts, curlab, cur_letter = [], collections.OrderedDict(), None, None
        content_pages = []
        for pi in range(s["page"], (nxt["page"] if nxt else last - 1) + 1):
            if pi >= last: break
            for (x0, y0, x1, y1, t) in qp_content(pages[pi]):
                if pi == s["page"] and y1 > s["y1"] + 5: continue          # above start
                if nxt and pi == nxt["page"] and y1 <= nxt["y1"] + 5: continue    # at/after next question number
                if re.match(r"^(END OF QUESTION|Copyright)", t): continue
                text_lines.append((pi, y1, t)); 
                if pi not in content_pages: content_pages.append(pi)
        # same-row remainder: the number line itself includes the text after the number
        txt = []
        for (pi, y1, t) in text_lines:
            txt.append(t)
        # drop leading question number
        if txt and txt[0] == str(s["n"]) + ("*" if s["star"] else ""): txt = txt[1:]
        elif txt:
            txt[0] = re.sub(r"^%d\*?\s+" % s["n"], "", txt[0])
        # parts & marks
        lab = ""; total = 0
        for (pi, y1, t) in text_lines:
            m = PART_L.match(t) if True else None
            xx = None
            if m:
                cur_letter = m.group(1); lab = cur_letter; parts.setdefault(lab, 0)
                t2 = m.group(2) or ""
            else:
                m = PART_R.match(t)
                if m and cur_letter:
                    lab = f"{cur_letter}({m.group(1)})"; parts.setdefault(lab, 0); t2 = m.group(2) or ""
                else:
                    t2 = t
            for mm in MARK.finditer(t2):
                v = int(mm.group(1)); total += v
                parts[lab] = parts.get(lab, 0) + v
        recs.append(dict(n=s["n"], star=s["star"], start=dict(page=s["page"] + 1, y=round(s["y1"], 1)),
                         end=(dict(page=nxt["page"] + 1, y=round(nxt["y1"], 1)) if nxt else None),
                         pages=[p + 1 for p in content_pages] or [s["page"] + 1],
                         text="\n".join(txt).strip(),
                         parts=[{"label": k2, "marks": v} for k2, v in parts.items() if k2],
                         marks=total))
    return recs

# ---------- mark scheme ----------
MS_NOISE = re.compile(r"^(PMT|Question|Answer|Marks|Guidance|SECTION [A-D]|Total \d+)$|^H[15]56/\d\d Mark Scheme|^© OCR|^Question Answer Marks Guidance$|^APPENDIX|^PHYSICS A", re.I)

def ms_content(page):
    out = []
    for (x0, y0, x1, y1, t) in page["lines"]:
        t = clean(t)
        if not t or t == "…": continue
        if re.fullmatch(r"\d{1,3}", t) and y0 < 70: continue         # page number
        if y0 > page["h"] - 58: continue                                # running header band
        if t.upper() == "SPECIMEN": continue
        if MS_NOISE.match(t) and not re.match(r"^Total", t): continue
        out.append((x0, y0, x1, y1, t))
    return out

MS_Q = re.compile(r"^(\d{1,2})(\*?)(?:\s+(.*))?$")

def split_ms(pages, first, code=None, ms_path=''):
    start_pg = None
    for pi in range(first, len(pages)):
        txts = [clean(l[4]) for l in pages[pi]["lines"]]
        if any(re.match(r"^Question( Answer( Marks( Guidance)?)?)?$", t) for t in txts) and any(re.match(r"^(Question )?Answer", t) for t in txts):
            start_pg = pi; break
    if start_pg is None: return [], len(pages)
    cands = []
    end_pg = len(pages)
    for pi in range(start_pg, len(pages)):
        hdr = " ".join(clean(l[4]) for l in pages[pi]["lines"][:5])
        mh = re.search(r"(H[15]56/0\d) Mark", hdr, re.I)
        # OCR's H556/01 June 2017 mark scheme has H156/01 running headers by mistake (content is A-level)
        if code == 'H556/01' and mh and mh.group(1) == 'H156/01' and 'A-level Paper 1 June 2017 Mark scheme' in str(ms_path): mh = None
        if code and mh and mh.group(1) != code: continue          # combined AS + A-level mark-scheme PDF
        txts = " ".join(clean(l[4]) for l in pages[pi]["lines"][:6])
        if re.search(r"Summary of updates|APPENDIX|Assessment Objectives Grid|BLANK", txts, re.I) and pi > start_pg and not any(re.fullmatch(r"\d{1,2}", clean(l[4])) and l[0] < 100 for l in pages[pi]["lines"]):
            end_pg = pi; break
        for (x0, y0, x1, y1, t) in pages[pi]["lines"]:
            t = clean(t)
            if x0 < 100 and y0 > 60:
                m = MS_Q.match(t)
                if m and 1 <= int(m.group(1)) <= 40:
                    rest = m.group(3) or ""
                    cands.append(dict(n=int(m.group(1)), page=pi, x0=x0, y0=y0, y1=y1, rest=rest, star=bool(m.group(2))))
    ch = chain(cands)
    return ch, end_pg

def build_ms_records(pages, starts, end_pg):
    recs = {}
    for k, s in enumerate(starts):
        nxt = starts[k + 1] if k + 1 < len(starts) else None
        lines, cpages, total, stop_all = [], [], None, False
        stop = (nxt["page"] if nxt else end_pg - 1)
        for pi in range(s["page"], stop + 1):
            if pi >= end_pg: break
            for (x0, y0, x1, y1, t) in ms_content(pages[pi]):
                if pi == s["page"] and y1 > s["y1"] + 4: continue
                if nxt and pi == nxt["page"] and y1 <= nxt["y1"] + 5: continue
                if re.match(r"^(OCR \(Oxford Cambridge|Oxford Cambridge and RSA|Registered (in|Office|Company)|Head office|Summary of updates|Assessment Objectives Grid|Copyright Information|Need to get in touch|Looking for a resource|Please get in touch|We.d like to know)", t):
                    stop_all = True; break
                lines.append(t)
                if pi not in cpages: cpages.append(pi)
            if stop_all: break
        # answer key for MCQ
        key = None
        first = (s["rest"] or "")
        m = re.match(r"^([A-D](?: or [A-D])*)(?:\s+\d)?$", first)
        if m: key = m.group(1)
        else:
            for t in lines[1:3]:
                m = re.match(r"^([A-D](?: or [A-D])*)(?:\s+\d)?$", t)
                if m: key = m.group(1); break
        txt = "\n".join(lines)
        mt = re.search(r"(?:^|\n)total\s*\n?\s*(\d+)\s*$", txt, re.I)
        if mt:
            total = int(mt.group(1)); txt = txt[:mt.start()]
        txt = re.sub(r"^%d\*?\s*" % s["n"], "", txt, count=1).strip()
        recs[s["n"]] = dict(start=dict(page=s["page"] + 1, y=round(s["y1"], 1)),
                            end=(dict(page=nxt["page"] + 1, y=round(nxt["y1"], 1)) if nxt else None),
                            pages=[p + 1 for p in cpages] or [s["page"] + 1], text=txt, key=key, total=total)
    return recs

# ---------- driver ----------
def find_sam_split(pages):
    for pi, p in enumerate(pages):
        for l in p["lines"][:4]:
            if re.match(r"^H[15]56/\d\d Mark Scheme", clean(l[4])):
                return pi
    return len(pages)

def main():
    papers = paper_pdfs()
    allq, report = [], []
    for p in papers:
        qpages = load_lines(p["qp"])
        if p["kind"] == "sam":
            split = find_sam_split(qpages); mpages = qpages; ms_first = split; qlast = split
        else:
            mpages = load_lines(p["ms"]); ms_first = 0; qlast = len(qpages)
        starts = split_qp(qpages, 0, qlast)
        qrecs = build_qp_records(qpages, 0, qlast, starts)
        mstarts, end_pg = split_ms(mpages, ms_first, p['code'].replace('-', '/'), p.get('ms') or '')
        msrecs = build_ms_records(mpages, mstarts, end_pg)
        ms_note = None
        if p["kind"] == "past" and not msrecs:
            ms_note = "mark scheme PDF does not contain this paper's mark scheme (wrong file in source folder)"
        n_mark = sum(r["marks"] for r in qrecs)
        report.append(f"{pid(p):28s} QP q={len(qrecs):2d} marks={n_mark:3d}  MS q={len(msrecs):2d} msTotal={sum((v['total'] or 0) for v in msrecs.values()):3d}")
        for r in qrecs:
            ms = msrecs.get(r["n"])
            is_mcq = r["marks"] <= 1 and (bool(re.search(r"Your answer", r["text"])) or bool(ms and ms["key"]))
            if is_mcq and r["marks"] == 0: r["marks"] = 1
            allq.append(dict(
                id=f"{p['code']} {p['series']} Q{r['n']}", paper=p["code"], paperType=("SAM" if p["kind"] == "sam" else p["level"]),
                paperNo=p["paperNo"], series=p["series"], year=p["year"], qnum=r["n"], isMCQ=is_mcq,
                parts=r["parts"], marks=r["marks"],
                qp=dict(pdf=rel(p["qp"]), pages=r["pages"], start=r["start"], end=r["end"]),
                text=r["text"],
                ms=(dict(pdf=rel(p["ms"]), pages=ms["pages"], start=ms["start"], end=ms["end"], text=ms["text"], key=ms["key"], total=ms["total"]) if ms else None),
                currentSpec=True, msNote=(ms_note if not ms else None)))
    os.makedirs(OUT, exist_ok=True)
    with open(OUT + "questions.json", "w") as f:
        json.dump(allq, f, ensure_ascii=False, indent=1)
    with open(CACHE + "split_report.txt", "w") as f:
        f.write("\n".join(report))
    print("\n".join(report))
    print("TOTAL questions", len(allq), "MCQ", sum(q["isMCQ"] for q in allq),
          "with MS", sum(1 for q in allq if q["ms"]))

if __name__ == "__main__":
    main()
