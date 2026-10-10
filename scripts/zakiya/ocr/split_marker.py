#!/opt/homebrew/bin/python3.14
"""Split the Marker markdown into per-book-page files by monotonic alignment to Apple Vision text.
Votes: word-trigrams rare in Apple pages + inline _page_N_ image refs (N+20). DP gives nondecreasing page per line."""
import re, json, sys, collections
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
MD = ROOT/'data/textbook-marker/out/module3-book-p020-119/module3-book-p020-119.md'
OCR = ROOT/'data/textbook-ocr'
OUT = ROOT/'data/textbook-marker/pages'
FIRST, N = 20, 100

def words(s):
    s = re.sub(r'\$[^$]*\$', ' ', s)          # drop latex
    s = re.sub(r'[*_#>`|\\-]', ' ', s)
    return re.findall(r'[a-z]{2,}', s.lower())
def tris(w): return [' '.join(w[i:i+3]) for i in range(len(w)-2)]

apple = []
for k in range(N):
    t = (OCR/f'book-p{FIRST+k:03d}.txt').read_text()
    apple.append(set(tris(words(t))))
idx = collections.defaultdict(set)
for k, s in enumerate(apple):
    for t in s: idx[t].add(k)

lines = MD.read_text().split('\n')
votes = [None]*len(lines)
for i, l in enumerate(lines):
    if not l.strip(): continue
    v = collections.defaultdict(float)
    for t in tris(words(l)):
        ps = idx.get(t)
        if ps and len(ps) <= 3:
            for p in ps: v[p] += 1/len(ps)
    m = re.search(r'_page_(\d+)_', l)
    if m and l.strip().startswith('!['): v[int(m.group(1))] += 3
    if v: votes[i] = v

# DP over lines with votes; nondecreasing page; penalty zero for staying/advancing
idxs = [i for i in range(len(lines)) if votes[i]]
NEG = -1e18
dp = [[0.0]*N for _ in idxs]; bp = [[0]*N for _ in idxs]
for j, i in enumerate(idxs):
    best = 0.0; arg = 0
    for p in range(N):
        prev = dp[j-1] if j else None
        if j:
            if prev[p] > best or p == 0: pass
        # running max over q<=p
    run = NEG; runarg = 0
    for p in range(N):
        if j:
            if dp[j-1][p] > run: run, runarg = dp[j-1][p], p
        else: run, runarg = 0.0, 0
        dp[j][p] = run + votes[i].get(p, 0) - 0.05*0
        bp[j][p] = runarg
p = max(range(N), key=lambda x: dp[-1][x]); assign = {}
for j in range(len(idxs)-1, -1, -1):
    assign[idxs[j]] = p; p = bp[j][p]
# fill unvoted lines: inside a gap between voted lines on different pages, choose the split that
# best matches numbers/words of the two Apple pages; same page -> same page
def toks(s): return set(re.findall(r'\d+\.?\d*|[a-z]{4,}', s.lower()))
atok = [toks((OCR/f'book-p{FIRST+k:03d}.txt').read_text()) for k in range(N)]
page_of = [None]*len(lines)
for i in idxs: page_of[i] = assign[i]
for a, b in zip(idxs, idxs[1:]):
    gap = list(range(a+1, b)); pa, pb = assign[a], assign[b]
    if pa == pb or not gap:
        for i in gap: page_of[i] = pa
        continue
    sc = []
    for i in gap:
        t = toks(lines[i]); sc.append((len(t & atok[pa]), len(t & atok[pb])))
    best, bs = None, 0
    for sp in range(len(gap)+1):
        v = sum(x[0] for x in sc[:sp]) + sum(x[1] for x in sc[sp:])
        if best is None or v > best: best, bs = v, sp
    for n, i in enumerate(gap): page_of[i] = pa if n < bs else pb
for i in range(len(lines)):
    if page_of[i] is None: page_of[i] = assign[idxs[0]] if i < idxs[0] else assign[idxs[-1]]
# confidence
agree = sum(1 for i in idxs if max(votes[i], key=votes[i].get) == assign[i])
near = sum(1 for i in idxs if abs(max(votes[i], key=votes[i].get) - assign[i]) <= 1)
print(f'voted lines {len(idxs)}/{sum(1 for l in lines if l.strip())}; exact agree {agree/len(idxs):.1%}; within 1 page {near/len(idxs):.1%}')
# boundary placement: unvoted lines between two voted lines on different pages -> ambiguous
amb = 0
for a, b in zip(idxs, idxs[1:]):
    if assign[a] != assign[b]: amb += b - a - 1
print('unvoted lines in boundary gaps (ambiguous placement):', amb)
# refine each boundary: choose split maximising lexical/number overlap (window +-25 lines)
def ltoks(l):
    l = re.sub(r'\\[A-Za-z]+', ' ', l)
    return set(re.findall(r'\d+\.?\d*|[A-Za-z]{3,}', l.lower()))
def lscore(i, k):
    l = lines[i]
    m = re.search(r'_page_(\d+)_', l)
    if m and l.strip().startswith('!['): return 4.0 if int(m.group(1)) == k else (-4.0 if int(m.group(1)) == k+1 else 0.0)
    t = ltoks(l)
    if not t: return 0.0
    return len(t & atok[k]) / len(t)
changed = 0
for k in range(N-1):
    ids = [i for i in range(len(lines)) if page_of[i] in (k, k+1)]
    if not ids: continue
    cur = max([i for i in ids if page_of[i] == k] or [ids[0]-1])  # last line of page k
    lo = max(ids[0]-1, cur-25); hi = min(ids[-1], cur+25)
    cand = [i for i in ids if lo <= i <= hi]
    if not cand: continue
    diff = {i: (lscore(i, k) - lscore(i, k+1)) for i in cand}
    # split after position b: lines <=b go to k. maximise sum_{i<=b} diff
    best, bb, run = None, cand[0]-1, 0.0
    for i in [cand[0]-1] + cand:
        if i >= cand[0]: run += diff[i]
        if best is None or run > best + 1e-9: best, bb = run, i
    for i in cand: 
        new = k if i <= bb else k+1
        if page_of[i] != new: page_of[i] = new; changed += 1
print('boundary refinement moved', changed, 'lines')
pages = collections.defaultdict(list)
for i, l in enumerate(lines): pages[page_of[i]].append(l)
OUT.mkdir(parents=True, exist_ok=True)
empty = []
for k in range(N):
    txt = '\n'.join(pages.get(k, [])).strip('\n')
    if not txt.strip(): empty.append(FIRST+k)
    (OUT/f'book-p{FIRST+k:03d}.md').write_text(txt+'\n')
print('empty pages:', empty)
if len(sys.argv) > 1:   # debug: show line scores around boundary after page argv[1]
    K = int(sys.argv[1]) - FIRST
    for i in range(len(lines)):
        if page_of[i] in (K, K+1) and lines[i].strip(): print(page_of[i]+FIRST, i, round(lscore(i, K), 2), round(lscore(i, K+1), 2), lines[i][:50])
