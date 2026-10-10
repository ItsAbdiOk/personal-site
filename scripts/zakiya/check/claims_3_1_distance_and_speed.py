"""Numerical claims in the 3.1 Distance and speed guide, recomputed independently.

Same record kinds as claims_3_8.py. physics.py has no speed/gradient helper, so the plain arithmetic
(speed = d/t, gradients, unit conversions, 2*pi*r) is written inline; physics.py is used for
round_sf/round_dp via run_checks only.
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402,F401

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
M = "content/zakiya/module3/"
Q = M + "3-1-distance-and-speed.ts"
S = M + "3-1/sections.ts"
F = M + "3-1/figures.ts"
E = M + "3-1/explain.ts"

C = []


def v(id, where, quote, fn, claimed, sf=None, dp=None, alt=None, note=""):
    C.append(dict(kind="value", id=id, where=where, quote=quote, fn=fn, claimed=claimed,
                  shown_sf=sf, shown_dp=dp, inputs={}, alt=alt, note=note))


def b(id, where, quote, fn, note=""):
    C.append(dict(kind="bool", id=id, where=where, quote=quote, fn=fn, claimed=True, inputs={}, note=note))


def w(id, where, quote, value, tol_pct, tests, note=""):
    C.append(dict(kind="window", id=id, where=where, quote=quote, value=value, tol_pct=tol_pct, tests=tests, note=note))


def mcq(id, where, quote, fn, options, correct_index, dp, note=""):
    C.append(dict(kind="mcq", id=id, where=where, quote=quote, fn=fn, options=options,
                  correct_index=correct_index, shown_dp=dp, note=note))


def u(id, where, quote, reason):
    C.append(dict(kind="unchecked", id=id, where=where, quote=quote, reason=reason))


sp = lambda d, t: d / t  # speed = distance / time


# ============ Section 1: average speed, Fine or not ============
v("s1-cam", f"{S} average-speed text", "2500/82 = 30 m (per second)", lambda: sp(2500, 82), 30, sf=2)
v("s1-fine", f"{S} Fine or not step 2", "2500 / 82 = 30.49", lambda: sp(2500, 82), 30.49, dp=2)
v("s1-fine-sf", f"{S} Fine or not step 3", "30 m/s (2 s.f.)", lambda: sp(2500, 82), 30, sf=2)
v("s1-time", f"{S} Fine or not step 1", "1 min 22 s = 82 s", lambda: 60 + 22, 82, dp=0)
v("s1-km", f"{S} Fine or not step 1", "2.5 km = 2500 m", lambda: 2.5 * 1000, 2500, dp=0)
b("s1-limit", f"{S} Fine or not step 4", "30 > 22 so exceeded", lambda: sp(2500, 82) > 22)
v("s1-50mph", f"{Q} pastPaper/def, textbook p22", "50 mph = 22 m/s", lambda: 50 * 1609.344 / 3600, 22, sf=2)
v("s1-fig-fine", f"{F} figFine", "2500 / 82 = 30 m/s", lambda: sp(2500, 82), 30, sf=2)

# ============ Section 2: units ============
v("s2-72kmh", f"{S} units text / {F} figConvert", "72 000 / 3600 = 20 m/s", lambda: 72000 / 3600, 20, sf=2)
v("s2-72div", f"{E} kmh / fc-05", "72 / 3.6 = 20", lambda: 72 / 3.6, 20, sf=2)
v("s2-3600", f"{F} figConvert", "1 h = 60 x 60 = 3600 s", lambda: 60 * 60, 3600, dp=0)
v("s2-36", f"{E} kmh", "1000 m / 3600 s = 1/3.6", lambda: 3600 / 1000, 3.6, dp=1)
v("s2-lorry-d1", f"{S} lorry step 2 / figLorry", "25 x 120 = 3000 m", lambda: 25 * 120, 3000, dp=0)
v("s2-lorry-t1", f"{S} lorry step 1", "2.0 min = 120 s", lambda: 2.0 * 60, 120, dp=0)
v("s2-lorry-D", f"{S} lorry step 3 / figLorry / fc-06", "total 3800 m", lambda: 25 * 120 + 800, 3800, dp=0)
v("s2-lorry-T", f"{S} lorry step 3 / figLorry", "total 170 s", lambda: 120 + 50, 170, dp=0)
v("s2-lorry-v", f"{S} lorry step 4", "3800/170 = 22.35", lambda: sp(3800, 170), 22.35, dp=2)
v("s2-lorry-v2", f"{S} lorry answer / figLorry / explain avg / fc-06", "22 m/s", lambda: sp(3800, 170), 22, sf=2)
v("s2-lorry-16", f"{F} figLorry, {S} lorry answer", "800 m in 50 s = 16 m/s", lambda: sp(800, 50), 16, sf=2)
v("s2-lorry-naive", f"{S} lorry answer / fc-06", "(25 + 16)/2 = 20.5", lambda: (25 + 16) / 2, 20.5, sf=3)
b("s2-lorry-fc06", f"{Q} ds-fc-06", "25 m/s 120 s then 16 m/s 50 s: 3800/170 = 22, not 20.5",
  lambda: round(sp(25 * 120 + 16 * 50, 170)) == 22 and (25 + 16) / 2 == 20.5)
v("s2-pers", f"{S} sayIt", "0.031 km/s = 31 m/s", lambda: 0.031 * 1000, 31, sf=2)

# ============ Section 3: distance-time graph ============
v("s3-fig2-dx", f"{S} text/worked, {E} dx", "1400 - 400 = 1000", lambda: 1400 - 400, 1000, dp=0)
v("s3-fig2-dt", f"{S} worked, {E} dt", "70 - 20 = 50", lambda: 70 - 20, 50, dp=0)
v("s3-fig2-v", f"{S} text/worked/fig", "1000/50 = 20 m/s", lambda: sp(1000, 50), 20, sf=2)
# figGradient scale: t 0..80 -> x 50..310 ; x 0..1600 m -> y 200..40
tx = lambda t: 50 + t * 260 / 80
dy = lambda d: 200 - d * 160 / 1600
v("s3-fg-t20", f"{F} figGradient", "t = 20 at x = 115", lambda: tx(20), 115, dp=1)
v("s3-fg-t70", f"{F} figGradient", "t = 70 at x = 277.5", lambda: tx(70), 277.5, dp=1)
v("s3-fg-d400", f"{F} figGradient", "400 m at y = 160", lambda: dy(400), 160, dp=1)
v("s3-fg-d1400", f"{F} figGradient", "1400 m at y = 60", lambda: dy(1400), 60, dp=1)
v("s3-fg-end", f"{F} figGradient", "line end (310,40) = 1600 m at 80 s -> 20 m/s", lambda: sp(1600, 80), 20, sf=2)

# ============ Section 4: tangent x = 2t^2 ============
x2 = lambda t: 2 * t * t
v("s4-avg", f"{S} instantaneous text", "0-6 s: 72 m", lambda: x2(6), 72, dp=0)
v("s4-avg2", f"{S} instantaneous text", "average 12 m/s", lambda: sp(x2(6), 6), 12, sf=2)
v("s4-x4", f"{S} worked question", "curve passes (4.0, 32)", lambda: x2(4), 32, dp=0)
v("s4-slope", f"{S} text/worked/fig", "instantaneous speed at 4 s = 16 m/s (dx/dt = 4t)", lambda: 4 * 4, 16, sf=2)
v("s4-tan-p1", f"{S} worked", "tangent through (2.0, 0)", lambda: x2(4) + 16 * (2 - 4), 0, dp=0)
v("s4-tan-p2", f"{S} worked", "tangent through (6.0, 64)", lambda: x2(4) + 16 * (6 - 4), 64, dp=0)
v("s4-grad", f"{S} worked", "(64-0)/(6.0-2.0) = 16", lambda: (64 - 0) / (6.0 - 2.0), 16, sf=2)
v("s4-avg-start", f"{S} worked answer", "32/4.0 = 8 m/s", lambda: sp(32, 4.0), 8, sf=1)


def parse_path(name_hint, file_text, nth):
    ds = [d for d in re.findall(r'<path d="(M[^"]+)"', file_text) if len(d) > 100]
    pts = ds[nth].replace("M", "").split(" L")
    return [tuple(map(float, p.split(","))) for p in pts]


FIG = open(os.path.join(ROOT, F)).read()
ptsQ6 = parse_path("q6", FIG, 0)


# figTangent is now a declarative graph (components/zakiya/Graph.tsx): re-evaluate its own expr.
def graph_block(name):
    m = re.search(r"export const " + name + r": Figure = \{(.*?)\n\};", FIG, re.S)
    return m.group(1)


def expr_fn(expr, var):
    """Same tiny language as lib/zakiya/graph-expr.ts, evaluated with no builtins."""
    assert re.fullmatch(r"[0-9.+\-*/^() a-z]*", expr), expr
    py = re.sub(r"(\d)\s*([a-z(])", r"\1*\2", expr).replace("^", "**")
    names = {var: 0.0, "pi": math.pi, "sqrt": math.sqrt, "exp": math.exp, "ln": math.log,
             "sin": lambda d: math.sin(math.radians(d)), "cos": lambda d: math.cos(math.radians(d)),
             "tan": lambda d: math.tan(math.radians(d))}
    code = compile(py, "<expr>", "eval")
    assert set(code.co_names) <= set(names), code.co_names
    return lambda v: eval(code, {"__builtins__": {}}, {**names, var: v})  # noqa: S307 (repo content, names whitelisted)


GT = graph_block("figTangent")
gt_expr = re.search(r'expr: "([^"]+)"', GT).group(1)
gt_at = float(re.search(r"tangent: \{[^}]*?at: ([\d.]+)", GT, re.S).group(1))
gt_xmin, gt_xmax = map(float, re.search(r'x: \{[^}]*min: ([\d.]+), max: ([\d.]+)', GT).groups())
gt_ymax = float(re.search(r'y: \{[^}]*max: ([\d.]+)', GT).group(1))
fx = expr_fn(gt_expr, "t")
dfx = lambda t, h=1e-5: (fx(t + h) - fx(t - h)) / (2 * h)
span = (gt_xmax - gt_xmin) / 3  # Graph.tsx: triangle runs +/- range/3 either side of the touch point
tl = lambda t: fx(gt_at) + dfx(gt_at) * (t - gt_at)
b("s4-g-expr", f"{F} figTangent expr", "graph expr is x = 2t^2 (same curve as the text)", lambda: all(abs(fx(t) - x2(t)) < 1e-9 for t in (0, 1.5, 4, 6)))
v("s4-g-at", f"{F} figTangent tangent.at", "tangent starts at t = 4 s", lambda: gt_at, 4, dp=1)
v("s4-g-x4", f"{F} figTangent", "touch point (4, 32)", lambda: fx(gt_at), 32, dp=0)
v("s4-g-grad", f"{F} figTangent readout / caption", "gradient = 16.0 m s^-1 at t = 4.0 s", lambda: dfx(gt_at), 16.0, dp=1)
v("s4-g-dt", f"{F} figTangent triangle / caption", "triangle run 6.0 - 2.0 = 4.0 s", lambda: min(gt_xmax, gt_at + span) - max(gt_xmin, gt_at - span), 4.0, dp=1)
v("s4-g-x1", f"{F} figTangent triangle", "tangent at t = 2.0 s is 0 m", lambda: tl(gt_at - span), 0, dp=1)
v("s4-g-dx", f"{F} figTangent triangle / caption", "triangle rise 64.0 m", lambda: tl(gt_at + span) - tl(gt_at - span), 64.0, dp=1)
b("s4-g-fits", f"{F} figTangent y axis", "whole curve fits on the 0-80 m axis (x(6) = 72)", lambda: fx(gt_xmax) <= gt_ymax)

# figLorryArea: speed-time polyline, area is exact (trapezia)
GA = graph_block("figLorryArea")
ga_pts = [tuple(map(float, p)) for p in re.findall(r"\[([\d.]+), ([\d.]+)\]", re.search(r"points: \[(.*?)\]\s*,\s*colour", GA, re.S).group(1))]
ga_from, ga_to = map(float, re.search(r"from: ([\d.]+),\s*to: ([\d.]+)", GA).groups())


def poly_area(pts, a, b2):
    tot = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        lo, hi = max(x0, a), min(x1, b2)
        if hi <= lo or x1 == x0:
            continue
        yl = y0 + (y1 - y0) * (lo - x0) / (x1 - x0)
        yh = y0 + (y1 - y0) * (hi - x0) / (x1 - x0)
        tot += (yl + yh) / 2 * (hi - lo)
    return tot


b("s2-g-pts", f"{F} figLorryArea points", "25 m/s for 120 s then 16 m/s to 170 s", lambda: ga_pts == [(0, 25), (120, 25), (120, 16), (170, 16)])
v("s2-g-area", f"{F} figLorryArea readout / caption", "area = 3800 m (25 x 120 + 16 x 50)", lambda: poly_area(ga_pts, ga_from, ga_to), 3800, dp=0)
v("s2-g-sq", f"{F} figLorryArea squares", "one 20 s x 5 m/s square = 100 m", lambda: 20 * 5, 100, dp=0)

# ============ Section 5: drips ============
v("s5-drip", f"{S} spacing text / figDrips key", "5 m per 0.5 s = 10 m/s", lambda: sp(5, 0.5), 10, sf=2)
gaps = lambda xs: [b_ - a for a, b_ in zip(xs, xs[1:])]
b("s5-fig-mid", f"{F} figDrips", "middle row gaps strictly grow", lambda: all(g2 > g1 for g1, g2 in zip(gaps([30, 40, 60, 95, 150, 230]), gaps([30, 40, 60, 95, 150, 230])[1:])))
b("s5-fig-bot", f"{F} figDrips", "bottom row gaps strictly shrink", lambda: all(g2 < g1 for g1, g2 in zip(gaps([30, 95, 150, 190, 215, 230]), gaps([30, 95, 150, 190, 215, 230])[1:])))
b("s5-fig-top2", f"{F} figDrips", "top row gaps equal", lambda: len(set(gaps([30, 90, 150, 210, 270]))) == 1)
b("s5-fig-overlap", f"{F} figDrips/figQDrips", "dot centres >= 10 px apart (r = 4, no overlap)",
  lambda: min(gaps([30, 40, 60, 95, 150, 230]) + gaps([30, 95, 150, 190, 215, 230])) >= 10)

# ============ Questions ============
# ds-r1 MCQ: B equal gaps (figQDrips)
qa, qb, qc, qd = [14, 24, 36, 50, 66, 84], [102, 120, 138, 156], [174, 192, 208, 222, 234, 244], [254, 264, 276, 290, 306, 324]
b("r1-A-grow", f"{Q} ds-r1 / figQDrips", "A gaps grow", lambda: all(y > x for x, y in zip(gaps(qa), gaps(qa)[1:])))
b("r1-B-equal", f"{Q} ds-r1 key B / figQDrips", "B gaps equal", lambda: len(set(gaps(qb))) == 1)
b("r1-C-shrink", f"{Q} ds-r1 / figQDrips", "C gaps shrink", lambda: all(y < x for x, y in zip(gaps(qc), gaps(qc)[1:])))
b("r1-D-grow", f"{Q} ds-r1 / figQDrips", "D gaps grow", lambda: all(y > x for x, y in zip(gaps(qd), gaps(qd)[1:])))
b("r1-overlap", f"{F} figQDrips", "dot centres >= 10 px apart (r = 4)",
  lambda: min(gaps(qa) + gaps(qb) + gaps(qc) + gaps(qd)) >= 10)
b("r1-only-one-const", f"{Q} ds-r1", "exactly one section has constant gaps",
  lambda: [len(set(g)) == 1 for g in map(gaps, [qa, qb, qc, qd])].count(True) == 1)

# ds-r2 runner
r2 = lambda: sp(80 + 180, 60)
mcq("r2-key", f"{Q} ds-r2 options/correctIndex", "260/60 = 4.33 -> B 4.3", r2, [3.3, 4.3, 5.0, 6.0], 1, dp=1)
v("r2-model", f"{Q} ds-r2 modelAnswer", "260 / 60 = 4.33", r2, 4.33, dp=2)
v("r2-s1", f"{Q} ds-r2 modelAnswer", "80/20 = 4.0", lambda: sp(80, 20), 4.0, dp=1)
v("r2-s2", f"{Q} ds-r2 modelAnswer", "180/30 = 6.0", lambda: sp(260 - 80, 30), 6.0, dp=1)
v("r2-d", f"{Q} ds-r2 modelAnswer", "80 + 180 = 260 m (flat 10 s)", lambda: 80 + (260 - 80), 260, dp=0)
v("r2-C", f"{Q} ds-r2 commonMistakes C", "(4+6)/2 = 5.0", lambda: (4 + 6) / 2, 5.0, dp=1)
v("r2-A", f"{Q} ds-r2 commonMistakes A", "(4+6+0)/3 = 3.3", lambda: (4 + 6 + 0) / 3, 3.3, dp=1)
v("r2-time", f"{Q} ds-r2 stem", "20 + 30 + 10 = 60 s", lambda: 20 + 30 + 10, 60, dp=0)

# ds-r3 train
r3 = lambda: sp(2 * math.pi * 0.85, 16)
v("r3-circ", f"{Q} ds-r3 modelAnswer/markScheme", "2 pi x 0.85 = 5.34 m", lambda: 2 * math.pi * 0.85, 5.34, dp=2)
v("r3-v", f"{Q} ds-r3 modelAnswer", "5.34/16 = 0.334", r3, 0.334, sf=3)
v("r3-v2", f"{Q} ds-r3(a) answer", "0.33 m/s", r3, 0.33, sf=2)
w("r3-tol", f"{Q} ds-r3(a) answer", "0.33 +/- 3%", 0.33, 3, [("computed", r3)])
v("r3-cm", f"{Q} ds-r3(a) commonMistakes", "radius in cm gives 33", lambda: sp(2 * math.pi * 85, 16), 33, sf=2)
b("r3-b-keep", f"{Q} ds-r3(b)", "half lap: same speed 0.33", lambda: round(r3(), 2) == 0.33)

# ds-r4 chevrons
v("r4-conv", f"{Q} ds-r4(a)", "90 000 / 3600 = 25", lambda: 90 * 1000 / 3600, 25, sf=2)
v("r4-conv2", f"{Q} ds-r4(a) markScheme", "90 / 3.6 = 25", lambda: 90 / 3.6, 25, sf=2)
r4b = lambda: 45 / 25
v("r4-t", f"{Q} ds-r4(b)", "45/25 = 1.8 s", r4b, 1.8, sf=2)
w("r4-tol", f"{Q} ds-r4(b) answer", "1.8 s +/- 3%", 1.8, 3, [("computed", r4b)])
v("r4-mix", f"{Q} ds-r4(b) commonMistakes", "45/90 = 0.5", lambda: 45 / 90, 0.5, sf=1)

# ds-r5 average-speed camera
v("r5a-v", f"{Q} ds-r5(a) modelAnswer/answer", "3600/150 = 24", lambda: sp(3600, 150), 24, sf=2)
v("r5a-t", f"{Q} ds-r5(a)", "2 min 30 s = 150 s", lambda: 2 * 60 + 30, 150, dp=0)
w("r5a-tol", f"{Q} ds-r5(a) answer", "24 +/- 2%", 24, 2, [("computed", lambda: sp(3600, 150))])
b("r5a-limit", f"{Q} ds-r5(a)", "24 > 22 so broke limit", lambda: sp(3600, 150) > 22)
v("r5a-138", f"{Q} ds-r5(a) commonMistakes", "2.3 min = 138 s", lambda: 2.3 * 60, 138, dp=0)
v("r5b-T", f"{Q} ds-r5(b) modelAnswer", "3600/22 = 163.6 s", lambda: 3600 / 22, 163.6, dp=1)
v("r5b-T-ms", f"{Q} ds-r5(b) markScheme", "(= 164 s)", lambda: 3600 / 22, 164, sf=3)
v("r5b-t1", f"{Q} ds-r5(b) modelAnswer", "1800/31 = 58.1 s", lambda: 1800 / 31, 58.1, dp=1)
v("r5b-t1-ms", f"{Q} ds-r5(b) markScheme", "(= 58 s)", lambda: 1800 / 31, 58, sf=2)
v("r5b-left", f"{Q} ds-r5(b) modelAnswer", "163.6 - 58.1 = 105.6 s", lambda: 3600 / 22 - 1800 / 31, 105.6, dp=1,
  alt=("rounded 163.6 - 58.1", lambda: 163.6 - 58.1))
r5b = lambda: 1800 / (3600 / 22 - 1800 / 31)
v("r5b-v", f"{Q} ds-r5(b) modelAnswer/answer", "1800/105.6 = 17", r5b, 17, sf=2)
w("r5b-tol", f"{Q} ds-r5(b) answer", "17 +/- 3%", 17, 3, [("computed", r5b)])
v("r5b-wrong", f"{Q} ds-r5(b) commonMistakes", "(31+v)/2 = 22 -> v = 13", lambda: 2 * 22 - 31, 13, sf=2)

# ds-r6 cyclist x = 12t - t^2
x6 = lambda t: 12 * t - t * t
v("r6-x3", f"{F} figQTangent/{Q} ds-r6(c)", "27 m at t = 3.0 s", lambda: x6(3), 27, dp=0)
v("r6-slope", f"{Q} ds-r6(b)", "tangent slope at 3 s (12 - 2t) = 6", lambda: 12 - 2 * 3, 6, sf=2)
v("r6-tp1", f"{F} figQTangent", "tangent through (0, 9)", lambda: x6(3) - 6 * 3, 9, dp=0)
v("r6-tp2", f"{F} figQTangent", "tangent through (6.0, 45)", lambda: x6(3) + 6 * 3, 45, dp=0)
r6b = lambda: (45 - 9) / (6.0 - 0)
v("r6b-grad-num", f"{Q} ds-r6(b) modelAnswer", "36/6.0 = 6.0", r6b, 6.0, sf=2)
w("r6b-tol", f"{Q} ds-r6(b) answer/markScheme", "6.0 +/- 8% vs allow 5.5-6.5", 6.0, 8, [("computed", r6b)],
  note="MS allows 5.5-6.5 (+/-8.3%); 8% is slightly stricter, fine")
v("r6c", f"{Q} ds-r6(c)", "36/6.0 = 6.0", lambda: sp(x6(6), 6.0), 6.0, sf=2)
v("r6c-x6", f"{F} figQTangent / ds-r6(c) stem", "36 m in 6.0 s", lambda: x6(6), 36, dp=0)
v("r6-avg3", f"{Q} ds-r6(b) commonMistakes", "27/3.0 = 9", lambda: sp(27, 3.0), 9, sf=1)
b("r6-halfway", f"{Q} ds-r6(c) modelAnswer", "avg speed 6.0 = speed at half-way time (constant decel.)", lambda: sp(x6(6), 6) == 12 - 2 * 3)
# figQTangent scale: t 0..6 -> x 50..300 ; x 0..50 -> y 200..40 (3.2 px/m)
q6 = lambda t: (50 + t * 250 / 6, 200 - x6(t) * 3.2)
b("r6-fig-curve", f"{F} figQTangent path", "25 points on x = 12t - t^2 (within 0.06 px)",
  lambda: len(ptsQ6) == 25 and all(abs(p[0] - q6(i * 0.25)[0]) < 0.06 and abs(p[1] - q6(i * 0.25)[1]) < 0.06 for i, p in enumerate(ptsQ6)))
v("r6-fig-pt", f"{F} figQTangent", "marker at (3, 27) -> y 113.6", lambda: q6(3)[1], 113.6, dp=1)
v("r6-fig-tan0", f"{F} figQTangent", "tangent start (0, 9) -> y 171.2", lambda: 200 - 9 * 3.2, 171.2, dp=1)
v("r6-fig-tan6", f"{F} figQTangent", "tangent end (6, 45) -> y 56", lambda: 200 - 45 * 3.2, 56, dp=1)
v("r6-fig-ytick20", f"{F} figQTangent", "20 m tick y = 136", lambda: 200 - 20 * 3.2, 136, dp=1)
v("r6-fig-ytick40", f"{F} figQTangent", "40 m tick y = 72", lambda: 200 - 40 * 3.2, 72, dp=1)

# ds-r7 ball bearing
t7 = [0, 0.20, 0.40, 0.60, 0.80, 1.00]
x7 = [0, 0.030, 0.086, 0.142, 0.198, 0.254]
v("r7a-1", f"{Q} ds-r7(a) modelAnswer", "0.20-0.40 s: 0.056 m in 0.20 s = 0.28", lambda: sp(x7[2] - x7[1], 0.20), 0.28, sf=2)
v("r7a-d", f"{Q} ds-r7(a)", "0.086 - 0.030 = 0.056 m", lambda: x7[2] - x7[1], 0.056, dp=3)
v("r7a-2", f"{Q} ds-r7(a) modelAnswer", "0.80-1.00 s: 0.056/0.20 = 0.28", lambda: sp(x7[5] - x7[4], 0.20), 0.28, sf=2)
QT = open(os.path.join(ROOT, Q)).read()
r7_rows = re.findall(r'\["([\d.]+)", "([\d.]+)"\]', QT[QT.index('id: "ds-r7"'):QT.index('parts:', QT.index('id: "ds-r7"'))])
b("r7-table", f"{Q} ds-r7 stem table", "table rows match t = 0..1.00 s and x = 0..0.254 m",
  lambda: [(float(a), float(b_)) for a, b_ in r7_rows] == list(zip(t7, x7)))
b("r7a-const", f"{Q} ds-r7 table", "equal 0.056 m each 0.2 s after 0.20 s",
  lambda: len({round(b_ - a, 6) for a, b_ in zip(x7[1:], x7[2:])}) == 1)
v("r7b", f"{Q} ds-r7(b)", "0.254/1.00 = 0.254 -> 0.25", lambda: sp(0.254, 1.00), 0.25, sf=2)
v("r7b-raw", f"{Q} ds-r7(b) answer", "0.254", lambda: sp(0.254, 1.00), 0.254, sf=3)
b("r7c-less", f"{Q} ds-r7(c)", "0.254 < 0.28", lambda: sp(0.254, 1.0) < 0.28)
v("r7c-first", f"{Q} ds-r7(c)", "first 0.20 s: 0.030/0.20 = 0.15", lambda: sp(0.030, 0.20), 0.15, sf=2)
v("r7b-mistake", f"{Q} ds-r7(b) commonMistakes", "0.254 rounds to 0.3 (1 s.f.)", lambda: 0.254, 0.3, dp=1)

# ============ Flashcards ============
v("fc-05", f"{Q} ds-fc-05", "72 km/h = 20 m/s (/3.6)", lambda: 72 / 3.6, 20, sf=2)
v("fc-06", f"{Q} ds-fc-06", "3800/170 = 22", lambda: sp(25 * 120 + 16 * 50, 170), 22, sf=2)
v("fc-06-d", f"{Q} ds-fc-06", "25x120 + 16x50 = 3800 m", lambda: 25 * 120 + 16 * 50, 3800, dp=0)
v("fc-06-naive", f"{Q} ds-fc-06 front", "(25 + 16)/2 = 20.5", lambda: (25 + 16) / 2, 20.5, sf=3)
v("fc-14", f"{Q} ds-fc-14/figDrips", "5 m/0.5 s", lambda: sp(5, 0.5), 10, sf=2)

# ============ Past papers vs official answers (summary.md / MS) ============
v("pp-spec-q21", f"{Q} pp-h156-01-spec-q21 a b(i)", "MS: 2 pi x 0.60 / 20 = 0.19", lambda: sp(2 * math.pi * 0.60, 20), 0.19, sf=2)
w("pp-spec-tol", f"{Q} pp-h156-01-spec-q21", "0.19 +/- 3%", 0.19, 3, [("computed", lambda: sp(2 * math.pi * 0.60, 20))])
v("pp-2024-a", f"{Q} pp-h156-02-2024-q1 a", "MS: 2 pi x 1.19e3 / 4.29e4 = 0.17", lambda: sp(2 * math.pi * 1.19e3, 4.29e4), 0.17, sf=2)
w("pp-2024-tol", f"{Q} pp-h156-02-2024-q1 a", "0.17 +/- 3%", 0.17, 3, [("computed", lambda: sp(2 * math.pi * 1.19e3, 4.29e4))],
  note="exact 0.1743 is only just inside +3% (0.1751)")
v("pp-2024-marks", f"{Q} pp-h156-02-2024-q1 marks", "MS: Q1(a) 2 + Q1(b) 2 = 4", lambda: 2 + 2, 4, dp=0)
v("pp-2023-ai", f"{Q} pp-h556-01-2023-q16a a(i)", "110 x 1000 / 3600 = 31", lambda: 110 * 1000 / 3600, 31, sf=2)
w("pp-2023-ai-tol", f"{Q} pp-h556-01-2023-q16a a(i)", "31 +/- 2% (MS allows 30.55, 30.6)", 31, 2,
  [("exact", lambda: 110 / 3.6), ("MS 30.55", 30.55), ("MS 30.6", 30.6)])
v("pp-2023-aii", f"{Q} pp-h556-01-2023-q16a a(ii)", "40/31 = 1.3", lambda: 40 / 31, 1.3, sf=2)
w("pp-2023-aii-tol", f"{Q} pp-h556-01-2023-q16a a(ii)", "1.3 +/- 4%", 1.3, 4, [("40/31", lambda: 40 / 31), ("40/30.56", lambda: 40 / (110 / 3.6))])
v("pp-2023-marks", f"{Q} pp-h556-01-2023-q16a marks", "a(i) 2 + a(ii) 1 = 3", lambda: 2 + 1, 3, dp=0)
v("pp-2020-a", f"{Q} pp-h156-02-2020n-q5 a", "MS: 20 m/s (stated)", lambda: 20.0, 20, sf=2)
w("pp-2020-c", f"{Q} pp-h156-02-2020n-q5 c", "12 +/- 8.4% must lie within MS range 11.0-13.0", 12, 8.4, [("MS lo", 11.0), ("MS hi", 13.0)])
b("pp-2020-c-tolwide", f"{Q} pp-h156-02-2020n-q5 c", "tolerance 8.4% hugs MS window 11-13 (< 0.1 over each end)", lambda: 10.9 <= 12 * 0.916 <= 11.0 and 13.0 <= 12 * 1.084 <= 13.1)
v("pp-2020-marks", f"{Q} pp-h156-02-2020n-q5 marks", "(a)1 + (b)2 + (c)2 = 5", lambda: 1 + 2 + 2, 5, dp=0)
w("pp-2022-d", f"{Q} pp-h156-02-2022-q1d d(ii)", "1.2 +/- 8.4% vs MS 1.10-1.30", 1.2, 8.4, [("MS lo", 1.10), ("MS hi", 1.30)])
b("pp-2022-d-tolwide", f"{Q} pp-h156-02-2022-q1d d(ii)", "tolerance 8.4% hugs MS window 1.10-1.30 (< 0.01 over each end)", lambda: 1.09 <= 1.2 * 0.916 <= 1.10 and 1.30 <= 1.2 * 1.084 <= 1.31)
v("pp-2019-q5", f"{Q} pp-h556-01-2019-q5 answers C", "MS: C (checked image)", lambda: "ABCD".index("C"), 2, dp=0)

CLAIMS = C
