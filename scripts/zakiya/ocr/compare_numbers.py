#!/opt/homebrew/bin/python3.14
"""Compare numbers per page between Marker (data/textbook-marker/pages) and Apple Vision (data/textbook-ocr)."""
import re, collections, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
MK = ROOT/'data/textbook-marker/pages'
AP = ROOT/'data/textbook-ocr'
REPORT = ROOT/'data/textbook-marker/compare-report.md'
FIRST, N = 20, 100

SUP = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺', '0123456789-+')
UNITS = r'(?:k?m|cm|mm|nm|µm|km|kg|g|mg|s|ms|min|h|hours?|N|kN|J|kJ|W|kW|MW|Hz|kHz|V|A|Pa|kPa|°|K|Ω|C|%|m\s?s|rad|mol|eV|GeV|MeV|degrees|seconds|metres|newtons|joules|watts|kilograms|hours|minutes)\b'
UNIT_AFTER = re.compile(r'^\s*(?:\^?\{?-?\d\}?)?\s*' + UNITS) if False else re.compile(r'^\s*' + UNITS)
CTX_HDR = re.compile(r'worked example|summary questions|practice questions|exam-style|^question|questions?$|test yourself|check your understanding|practical|activity', re.I)

def clean_marker(s):
    s = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', s)
    s = re.sub(r'</?(?:sup|sub|span)[^>]*>', lambda m: '^' if m.group(0).startswith('<sup') else ' ', s)
    s = s.replace('$', ' ')
    s = re.sub(r'\\(?:text|mathrm|textbf|mathbf|mathit|operatorname|boldsymbol)\s*\{([^{}]*)\}', r' \1 ', s)
    s = re.sub(r'\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}', r'\1/\2', s)
    s = re.sub(r'\\(?:left|right|,|;|:|!|quad|qquad)', ' ', s)
    s = s.replace('\\ ', ' ').replace('~', ' ')
    s = s.replace('\\times', '×').replace('\\cdot', '×').replace('\\%', '%').replace('^\\circ', '°').replace('\\circ', '°')
    s = s.replace('\\pm', '±').replace('\\Omega', 'Ω').replace('\\mu', 'µ')
    s = re.sub(r'\\[A-Za-z]+', ' ', s)
    s = s.replace('{', '').replace('}', '') if False else s
    return s

def norm(s):
    s = re.sub(r'\s_\s', ' ', s)
    s = re.sub(r'=\s*-\s+(?=\d)', '= -', s)
    s = re.sub(r'(?<=[=(])\s*-\s+(?=\d)', '-', s)
    s = s.translate(str.maketrans({'−': '-', '–': '-', '—': '-', '\u2009': ' ', '\u202f': ' ', '\u00a0': ' ', '\u2212': '-'}))
    s = re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+', lambda m: '^' + m.group(0).translate(SUP), s)
    # ten powers: mantissa x 10^n  -> mantissa e n
    s = re.sub(r'(\d+(?:\.\d+)?)\s*[×xX*]\s*10\s*\^?\s*\{?\s*([-+]?(?:0|[1-9]\d?))\s*\}?(?!\d)', r'\1e\2', s)
    s = re.sub(r'(?<!\d)10\s*\^\s*\{?\s*([-+]?\d{1,2})\s*\}?', r'1e\1', s)
    # exponents / subscripts on letters: drop
    s = re.sub(r'\^\s*\{[^{}]*\}', '', s)
    s = re.sub(r'\^\s*[-+]?\w', '', s)
    s = re.sub(r'_\s*\{[^{}]*\}', '', s)
    s = re.sub(r'_\w', '', s)
    s = re.sub(r'(?<=[A-Za-zµ°])\s?-\d\b', '', s)     # Apple flattened  ms-1
    s = re.sub(r'(?<=[A-Za-zµ])\d\b', '', s)           # v1, x2, m2 (subscripts/exponent)
    # thousands separators
    s = re.sub(r'\b(\d{1,3})[ ,](\d{3})\b(?!\.\d)', r'\1\2', s)
    # numbering to ignore
    s = re.sub(r'\((?:\d+)\s*marks?\)', ' ', s, flags=re.I)
    s = re.sub(r'\[(?:\d+)\s*marks?\]', ' ', s, flags=re.I)
    s = re.sub(r'\b(?:Figure|Fig\.?|Table|Question|Q|Worked example|Summary question|Chapter|Module|Practical|Activity|Section|Example|Step|Equation|Eq\.?)s?\s*\d+(?:\.\d+)*[a-z]?', ' ', s, flags=re.I)
    s = re.sub(r'\(\d\)\s*$', ' ', s)
    s = re.sub(r'\b(?:MS|PAG|HSW|M|OCR)\s*\d+(?:\.\d+)+', ' ', s)
    s = re.sub(r'\b\d\.\d\.\d+[a-z]?\b', ' ', s)
    return s

NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?')

def extract(lines, is_marker, page):
    """returns list of (num, flags, line)"""
    out = []; ctx = 0
    pagenum_removed = False
    for ln in lines:
        raw = ln
        if is_marker:
            h = re.match(r'#+\s*(.*)', ln)
            if h:
                ctx = 40 if CTX_HDR.search(h.group(1)) else 0
                if re.match(r'\d+\.\d+\s', h.group(1)): continue
            t = clean_marker(ln)
        else:
            t = ln
            if CTX_HDR.search(ln) and len(ln) < 40: ctx = 40
        # drop list numbering at line start
        t = re.sub(r'^\s*(?:[-*•]\s*)?\(?\d{1,2}[.)]\s+', '', t)
        t = re.sub(r'^\s*\d{1,2}\s+(?:[a-z]\s+)?(?=[A-Z])', '', t)
        weak = (not is_marker) and '=' not in t and not re.search(r'[A-Za-z]{3,}', t) and len(re.findall(r'[A-Za-z]', t)) <= 2
        if is_marker:
            kind = 'math' if ('$' in raw) else ('table' if raw.lstrip().startswith('|') else 'text')
        else:
            kind = 'weak' if weak else ('eq' if ('=' in t or ' _ ' in raw) else 'text')
        t = re.sub(r'^\s*#+\s*\d+\.\d+\s', '', t)
        t = re.sub(r'^\s*\d+\.\d+\s+(?=[A-Z])', '', t)
        t = norm(t)
        for m in NUM.finditer(t):
            n = m.group(0); tail = t[m.end():m.end()+14]
            fl = set()
            if '.' in n or 'e' in n: fl.add('decimal')
            eq = ('=' in t) or ('\\frac' in raw)
            if UNIT_AFTER.match(tail) and (not eq or len(n.lstrip('-')) >= 2 or '.' in n): fl.add('unit')
            if ctx > 0 and (len(n.lstrip('-')) >= 2 or 'unit' in fl): fl.add('example')
            if kind == 'table': fl.add('table')
            out.append((n, fl, raw.strip()[:110], kind))
        if ctx > 0: ctx -= 1
    # drop one occurrence of the page number
    pn = str(page)
    for i, (n, fl, l, kd) in enumerate(out):
        if n == pn: del out[i]; break
    return out

def main():
    rows = []; flagged = []
    for k in range(N):
        pg = FIRST + k
        mk = extract((MK/f'book-p{pg:03d}.md').read_text().split('\n'), True, pg)
        ap_lines = (AP/f'book-p{pg:03d}.txt').read_text().split('\n')[1:]
        ap = extract(ap_lines, False, pg)
        cm = collections.Counter(x[0] for x in mk); ca = collections.Counter(x[0] for x in ap)
        om = cm - ca; oa = ca - cm
        ca_text = collections.Counter(x[0] for x in ap if x[3] == 'text')
        cm_nm = collections.Counter(x[0] for x in mk if x[3] != 'math')
        oa_rel = ca_text - cm; om_rel = cm_nm - ca
        def detail(counter, src, rel):
            res = []
            for n, c in sorted(counter.items()):
                cands = [x for x in src if x[0] == n]
                good = [x for x in cands if x[3] in ('text', 'table')]
                cands = good if (rel.get(n, 0) > 0 and good) else (cands if rel.get(n, 0) == 0 else cands)
                if rel.get(n, 0) == 0: cands = [x for x in cands if x[3] not in ('text', 'table')] or cands
                # prefer the occurrence with highest evidence (non-weak, non-math)
                cands.sort(key=lambda x: (x[3] in ('weak', 'eq', 'math'), -len(x[1])))
                _, fl, l, kd = cands[0]
                res.append((n, c, fl, l, kd))
            return res
        dm, da = detail(om, mk, om_rel), detail(oa, ap, oa_rel)
        tot = sum(cm.values()) + sum(ca.values())
        score = (sum(om.values()) + sum(oa.values())) / tot if tot else 0
        # flag: data-like number on one side only
        araw = re.sub(r'(?<=\d),(?=\d)', '.', (AP/f'book-p{pg:03d}.txt').read_text())
        mraw = re.sub(r'\s+', ' ', clean_marker((MK/f'book-p{pg:03d}.md').read_text()))
        dm = [(n, c, fl | ({'substr-in-other'} if n.lstrip('-').split('e')[0] in araw else set()), l, kd) for n, c, fl, l, kd in dm]
        da = [(n, c, fl | ({'substr-in-other'} if n.lstrip('-').split('e')[0] in mraw else set()), l, kd) for n, c, fl, l, kd in da]
        dm_ok = [d for d in dm if 'substr-in-other' not in d[2]]; da_ok = [d for d in da if 'substr-in-other' not in d[2]]
        datalike = [d for d in dm_ok if d[2] and d[4] in ('text', 'table')] + [d for d in da_ok if d[2] and d[4] == 'text']
        mdec = [d for d in dm_ok if 'decimal' in d[2] and d[4] == 'math']; adec = [d for d in da_ok if 'decimal' in d[2] and d[4] == 'text']
        if mdec and adec: datalike += mdec + adec
        for a in dm:
            for b in da:
                if 'e' in a[0] and 'e' in b[0] and a[0].split('e')[0] == b[0].split('e')[0] and a[0] != b[0] and b[4] in ('text', 'eq'):
                    datalike += [a, b]; a[2].add('exp-diff'); b[2].add('exp-diff')
        rows.append((pg, len(mk), len(ap), score, dm, da, datalike))
    nfl = 0
    with open(REPORT, 'w') as f:
        f.write('# Marker vs Apple number comparison\n\nScore = (unmatched numbers both sides) / (all numbers both sides). FLAG = a data-like number (decimal, unit next to it, >=2 digits in worked example/question, or table cell) is on one side only. Marker-only numbers inside $math$ and Apple-only numbers on equation lines / figure-tick lines (kinds math/eq/weak) are noise-prone and only flag when a Marker-math decimal AND an Apple decimal both disagree on the same page.\n\n')
        f.write('| page | nM | nA | score | flag |\n|---|---|---|---|---|\n')
        for pg, a, b, s, dm, da, dl in rows:
            f.write(f'| {pg} | {a} | {b} | {s:.2f} | {"FLAG" if dl else ""} |\n'); nfl += bool(dl)
        f.write(f'\nFlagged pages: {nfl}\n\n')
        for pg, a, b, s, dm, da, dl in rows:
            if not (dm or da): continue
            f.write(f'## Page {pg}{"  FLAG" if dl else ""}  (score {s:.2f})\n')
            f.write('Only in Marker:\n' + ''.join(f'- `{n}` x{c} {kd} {sorted(fl) or ""} | {l}\n' for n, c, fl, l, kd in dm) if dm else 'Only in Marker: none\n')
            f.write('Only in Apple:\n' + ''.join(f'- `{n}` x{c} {kd} {sorted(fl) or ""} | {l}\n' for n, c, fl, l, kd in da) if da else 'Only in Apple: none\n')
            f.write('\n')
    print('flagged', nfl, 'of', N)
    print('flagged pages:', [r[0] for r in rows if r[6]])
main()
