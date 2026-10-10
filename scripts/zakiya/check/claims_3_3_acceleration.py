"""Numerical claims in the 3.3 Acceleration guide (independent verification), recomputed.
Same record kinds as claims_3_8.py. Plain arithmetic inline; physics.py only for KE / g / rounding.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
Q = "content/zakiya/module3/3-3-acceleration.ts"
S = "content/zakiya/module3/3-3/sections.ts"
F = "content/zakiya/module3/3-3/figures.ts"
C = []


def v(id, where, quote, fn, claimed, sf=None, dp=None, alt=None, note=""):
    C.append(dict(kind="value", id=id, where=where, quote=quote, fn=fn, claimed=claimed,
                  shown_sf=sf, shown_dp=dp, inputs={}, alt=alt, note=note))


def b(id, where, quote, fn, note=""):
    C.append(dict(kind="bool", id=id, where=where, quote=quote, fn=fn, claimed=True, inputs={}, note=note))


def w(id, where, value, tol_pct, tests, note=""):
    C.append(dict(kind="window", id=id, where=where, quote="tolerance window vs official/expected values", value=value, tol_pct=tol_pct, tests=tests, note=note))


def mcq(id, where, quote, fn, options, correct_index, dp, note=""):
    C.append(dict(kind="mcq", id=id, where=where, quote=quote, fn=fn, options=options,
                  correct_index=correct_index, shown_dp=dp, note=note))


def acc(du, dt):
    return du / dt


def page(n):
    return open(os.path.join(ROOT, f"data/textbook-marker/pages/book-p{n:03d}.md")).read()


# ---------------- Section 1: cheetah, definition ----------------
v("cheetah-2s", f"{S} what-is-acceleration text", "after 2 s at 26 m s-1 (13 x 2)", lambda: 13 * 2, 26, sf=2)
v("cheetah-eq", f"{S} equation note", "Cheetah: 26 / 2 = 13 m s-2", lambda: acc(26, 2), 13, sf=2)
b("cheetah-svg", f"{F} figCheetah", "arrows 0/13/26 m/s drawn 0/60/120 px (proportional)", lambda: 60 / 13 == 120 / 26)
b("book-cheetah", f"{S}/{F} cheetah", "textbook p27: 26 m s-1, 13 m s-2",
  lambda: "26\\text{ m s}^{-1}" in page(27) and "13\\text{ m s}^{-2}" in page(27))

# ---------------- Section 2: Bugatti, cyclist, train ----------------
v("kmh", f"{S} Bugatti step1 / explain.kmh / fc-07", "100 km/h / 3.6 = 27.8 m s-1", lambda: 100 / 3.6, 27.8, dp=1)
v("bug-a", f"{S} Bugatti a / figBugatti / fc-08", "27.8/2.46 = 11.3", lambda: acc(27.8, 2.46), 11.3, dp=1)
v("bug-a-unrounded", f"{S} Bugatti a (unrounded v)", "(100/3.6)/2.46 = 11.3", lambda: acc(100 / 3.6, 2.46), 11.3, dp=1)
v("bug-b", f"{S} Bugatti b / figBugatti / explain.decel", "-27.8/2.34 = -11.9", lambda: acc(-27.8, 2.34), -11.9, dp=1)
b("bug-misprint", f"{S} warning", "textbook prints 13.3; 27.8/2.46 != 13.3 and book p27 contains 13.3",
  lambda: abs(acc(27.8, 2.46) - 13.3) > 1 and "13.3\\text{ m s}^{-2}" in page(27))
b("book-bug", f"{S} Bugatti", "textbook p27 numbers 27.8, 2.46, 2.34, -11.9",
  lambda: all(s in page(27) for s in ["27.8", "2.46", "2.34", "-11.9"]))
b("bug-beats", f"{S} warning", "cheetah 13 > Bugatti 11.3 and 11.9", lambda: 13 > 11.3 and 13 > 11.9)
v("cyc", f"{S} cyclist / figCyclistTrain", "8.0/12 = 0.67", lambda: acc(8.0, 12), 0.67, sf=2)
v("train", f"{S} train / figCyclistTrain", "-30/60 = -0.50", lambda: acc(10 - 40, 60), -0.50, sf=2)
v("train-bad-sign", f"{S} warning", "40-10 gives +0.50", lambda: acc(40 - 10, 60), 0.50, sf=2)
b("book-ct", f"{S} cyclist/train", "textbook p28 Q1, Q2 numbers",
  lambda: all(s in page(28) for s in ["8.0 \\text{ m s}^{-1}", "after 12 s", "40 \\text{ m s}^{-1}", "10 \\text{ m s}^{-1}", "over 60 s"]))
b("ct-svg-len", f"{F} figCyclistTrain", "caption 'Arrow length = velocity': 8.0->12px, 40->60px, 10->15px must share a scale",
  lambda: abs(12 / 8.0 - 60 / 40) < 1e-6 and abs(15 / 10 - 60 / 40) < 1e-6,
  note="all arrows at 1.5 px per m/s")

# ---------------- Section 3: Figure 5, tangent ----------------
v("f5-s1", f"{S} two straight sections / figFig5", "2.0/1.0 = 2.0", lambda: acc(2.0 - 0, 1.0), 2.0, sf=2)
v("f5-s2", f"{S} two straight sections / figFig5", "1.0/2.0 = 0.50", lambda: acc(3.0 - 2.0, 3.0 - 1.0), 0.50, sf=2)
v("tan-v4", f"{S} tangent / figTangent", "v(4)=4*4-0.25*16=12", lambda: 4 * 4 - 0.25 * 4 ** 2, 12, sf=2)
v("tan-grad", f"{S} tangent / figTangent", "gradient at 4 s of v=4t-0.25t^2 = 4-0.5*4 = 2.0", lambda: 4 - 0.5 * 4, 2.0, sf=2)
v("tan-rise", f"{S} tangent step", "24-4 = 20", lambda: 24 - 4, 20, sf=2)
v("tan-run", f"{S} tangent step", "10.0-0 = 10.0", lambda: 10.0 - 0, 10.0, sf=3)
v("tan-a", f"{S} tangent / figTangent", "20/10.0 = 2.0", lambda: acc(20, 10.0), 2.0, sf=2)
b("tan-line", f"{S} tangent question", "tangent through (4,12) gradient 2 passes (0,4) and (10,24)",
  lambda: 12 - 2 * 4 == 4 and 12 + 2 * 6 == 24)
v("avg-wrong", f"{S} warning / ac-r6 mistake", "12/4.0 = 3.0 (v/t off a curve) differs from 2.0", lambda: 12 / 4.0, 3.0, sf=2)

# ---------- Section 5: a-t graph ----------
# ---------------- Declarative graphs (components/zakiya/Graph.tsx): re-evaluate their own expr / points ----------
import math  # noqa: E402
import re  # noqa: E402

FIG = open(os.path.join(ROOT, F)).read()


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
    return lambda val: eval(code, {"__builtins__": {}}, {**names, var: val})  # noqa: S307


def g_pts(block):
    sec = re.search(r"series: \[\{.*?points: \[(.*?)\]\s*,\s*colour", block, re.S).group(1)
    return [tuple(map(float, p)) for p in re.findall(r"\[([\d.\-]+), ([\d.\-]+)\]", sec)]


def g_axes(block):
    xmin, xmax = map(float, re.search(r"x: \{[^}]*min: ([\d.\-]+), max: ([\d.\-]+)", block).groups())
    ymin, ymax = map(float, re.search(r"y: \{[^}]*min: ([\d.\-]+), max: ([\d.\-]+)", block).groups())
    return xmin, xmax, ymin, ymax


def interp(pts, t):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x0 <= t <= x1 and x1 > x0:
            return y0 + (y1 - y0) * (t - x0) / (x1 - x0)
    raise ValueError(t)


def g_tri(block, fy, dfy):
    """Graph.tsx triangle: +/- range/3 (rounded to the snap step) either side of tangent.at, clipped to x and y axes."""
    xmin, xmax, ymin, ymax = g_axes(block)
    at = float(re.search(r"tangent: \{[^}]*?at: ([\d.]+)", block, re.S).group(1))
    snap = 10 ** math.floor(math.log10((xmax - xmin) / 20))
    span = max(snap, round((xmax - xmin) / 3 / snap) * snap)
    y0, m = fy(at), dfy(at)
    x1, x2 = max(xmin, at - span), min(xmax, at + span)
    if m:
        xa, xb = at + (ymin - y0) / m, at + (ymax - y0) / m
        x1 = max(x1, math.ceil((min(xa, xb) - 1e-9) / snap) * snap)
        x2 = min(x2, math.floor((max(xa, xb) + 1e-9) / snap) * snap)
    line = lambda t: y0 + m * (t - at)
    return at, m, x1, x2, line(x1), line(x2)


# --- figFig5: points (0,0) (1,2) (3,3); tangent default at 2.0 s on the second section ---
G5 = graph_block("figFig5")
f5 = g_pts(G5)
f5y = lambda t: interp(f5, t)
f5d = lambda t, h=1e-4: (f5y(t + h) - f5y(t - h)) / (2 * h)
b("f5-g-pts", f"{F} figFig5 points", "v-t points (0,0) (1.0,2.0) (3.0,3.0)", lambda: f5 == [(0, 0), (1, 2), (3, 3)])
f5at, f5m, f5x1, f5x2, f5y1, f5y2 = g_tri(G5, f5y, f5d)
v("f5-g-at", f"{F} figFig5 tangent.at", "default tangent in the second section (2.0 s)", lambda: f5at, 2.0, dp=1)
v("f5-g-grad", f"{F} figFig5 readout / caption", "gradient 0.50 m s-2 at default", lambda: f5m, 0.50, sf=2)
v("f5-g-rise", f"{F} figFig5 triangle / caption", "triangle rise 1.0 m s-1", lambda: f5y2 - f5y1, 1.0, dp=1)
v("f5-g-run", f"{F} figFig5 triangle / caption", "triangle run 2.0 s", lambda: f5x2 - f5x1, 2.0, dp=1)
v("f5-g-first", f"{F} figFig5 caption", "first-section gradient (drag) = 2.0 m s-2", lambda: f5d(0.5), 2.0, sf=2)
b("f5-g-max", f"{F} figFig5 / sections", "max acceleration is in the first second", lambda: f5d(0.5) > f5d(2.0))

# --- figTangent: v = 36t/(8+t) (hand-sketched curve, same labelled numbers) ---
GT = graph_block("figTangent")
gt_expr = re.search(r'expr: "([^"]+)"', GT).group(1)
fv = expr_fn(gt_expr, "t")
dfv = lambda t, h=1e-5: (fv(t + h) - fv(t - h)) / (2 * h)
b("tan-g-expr", f"{F} figTangent expr", "graph expr is v = 36t/(8+t)", lambda: all(abs(fv(t) - 36 * t / (8 + t)) < 1e-9 for t in (0, 1.5, 4, 10)))
tat, tm, tx1, tx2, ty1, ty2 = g_tri(GT, fv, dfv)
v("tan-g-at", f"{F} figTangent tangent.at", "tangent starts at t = 4.0 s", lambda: tat, 4.0, dp=1)
v("tan-g-v4", f"{F} figTangent point / worked example", "v(4.0) = 12 m s-1", lambda: fv(tat), 12, sf=2)
v("tan-g-grad", f"{F} figTangent readout / caption", "gradient 2.0 m s-2 at t = 4.0 s", lambda: dfv(tat), 2.0, sf=2)
v("tan-g-y0", f"{F} figTangent triangle", "tangent value at t = 0 is 4 m s-1", lambda: ty1, 4, sf=2)
v("tan-g-y10", f"{F} figTangent triangle", "tangent value at t = 10.0 s is 24 m s-1", lambda: ty2, 24, sf=2)
v("tan-g-rise", f"{F} figTangent triangle / caption", "triangle rise 20 m s-1", lambda: ty2 - ty1, 20, sf=2)
v("tan-g-run", f"{F} figTangent triangle / caption", "triangle run 10.0 s", lambda: tx2 - tx1, 10.0, dp=1)
b("tan-g-below", f"{F} figTangent", "curve lies below its tangent (concave) so the tangent only touches at 4.0 s",
  lambda: all(fv(t) <= tat * 0 + (fv(4) + dfv(4) * (t - 4)) + 1e-9 for t in [i / 10 for i in range(0, 181)]))
b("tan-g-fits", f"{F} figTangent y axis", "whole curve fits the 0-30 axis (v(18) = 24.9)", lambda: fv(g_axes(GT)[1]) <= g_axes(GT)[3])

# --- figAT: a-t steps from the v-t gradients ---
GAT = graph_block("figAT")
at_pts = g_pts(GAT)
b("at-g-pts", f"{F} figAT points", "a-t steps (0,2.0) (1.0,2.0) (1.0,0.50) (3.0,0.50)", lambda: at_pts == [(0, 2), (1, 2), (1, 0.5), (3, 0.5)])
b("at-g-from-vt", f"{F} figAT vs figFig5", "each flat a-t step equals the gradient of the matching v-t section",
  lambda: abs(f5d(0.5) - 2.0) < 1e-9 and abs(f5d(2.0) - 0.5) < 1e-9 and at_pts[0][1] == 2 and at_pts[2][1] == 0.5)

# --- figTram: tram v-t points ---
GTR = graph_block("figTram")
tr = g_pts(GTR)
b("r4-g-pts", f"{F} figTram points", "(0,0) (20,12) (80,12) (104,0)", lambda: tr == [(0, 0), (20, 12), (80, 12), (104, 0)])
trd = lambda t, h=1e-4: (interp(tr, t + h) - interp(tr, t - h)) / (2 * h)
v("r4-g-a", f"{Q} ac-r4 a / figTram", "gradient of first section 0.60 m s-2", lambda: trd(10), 0.60, sf=2)
v("r4-g-b", f"{Q} ac-r4 b / figTram", "gradient of last section -0.50 m s-2", lambda: trd(90), -0.50, sf=2)
v("r4-g-flat", f"{Q} figTram", "middle section flat (0 m s-2)", lambda: trd(50), 0.0, dp=1)

# ---------------- Questions ----------------
v("r4a", f"{Q} ac-r4 a", "12/20 = 0.60", lambda: acc(12 - 0, 20), 0.60, sf=2)
v("r4b-dt", f"{Q} ac-r4 b", "104-80 = 24", lambda: 104 - 80, 24, sf=2)
v("r4b", f"{Q} ac-r4 b", "-12/24 = -0.50", lambda: acc(-12, 24), -0.50, sf=2)
v("r4b-mistake", f"{Q} ac-r4 b commonMistakes", "12/104 = 0.115", lambda: 12 / 104, 0.115, sf=3)
w("r4a-tol", f"{Q} ac-r4 a tolerance", 0.6, 2, [("answer 0.60", 0.60), ("answer 0.6", 0.6)])
w("r4b-tol", f"{Q} ac-r4 b tolerance", 0.5, 2, [("answer 0.50", 0.50)])
v("r5-dt", f"{Q} ac-r5 b", "3.80-0.80 = 3.00", lambda: 3.80 - 0.80, 3.00, sf=3)
v("r5b", f"{Q} ac-r5 b", "-15/3.00 = -5.0", lambda: acc(0 - 15, 3.00), -5.0, sf=2)
v("r5b-mistake", f"{Q} ac-r5 b commonMistakes", "15/3.80 = 3.9", lambda: 15 / 3.80, 3.9, sf=2)
w("r5b-tol", f"{Q} ac-r5 b tolerance", 5.0, 2, [("answer 5.0", 5.0)])
v("r6-grad", f"{Q} ac-r6 b", "(9.9-1.5)/(14.0-0) = 0.60", lambda: acc(9.9 - 1.5, 14.0), 0.60, sf=2)
v("r6-rise", f"{Q} ac-r6 b", "9.9-1.5 = 8.4", lambda: 9.9 - 1.5, 8.4, sf=2)
b("r6-consistent", f"{Q} ac-r6 stem", "tangent y at t=6.0 is 5.1 = v given", lambda: abs(1.5 + 0.6 * 6.0 - 5.1) < 1e-9)
v("r6-mistake", f"{Q} ac-r6 b commonMistakes", "5.1/6.0 = 0.85", lambda: 5.1 / 6.0, 0.85, sf=2)
w("r6-tol", f"{Q} ac-r6 b tolerance", 0.6, 3, [("answer 0.60", 0.60)])
v("r7a", f"{Q} ac-r7 a", "5.4/0.55 = 9.8", lambda: acc(5.4, 0.55), 9.8, sf=2)
v("r7a-82", f"{Q} ac-r7 a modelAnswer", "(9.82)", lambda: acc(5.4, 0.55), 9.82, dp=2)
b("r7a-gt", f"{Q} ac-r7 a", "9.8 rounds to 10 (about 10)", lambda: P.round_sf(acc(5.4, 0.55), 1) == 10)
v("r7b-dv", f"{Q} ac-r7 b", "dv = -4.0-5.4 = -9.4", lambda: -4.0 - 5.4, -9.4, sf=2)
v("r7b", f"{Q} ac-r7 b", "9.4/0.020 = 470", lambda: acc(9.4, 0.020), 470, sf=2)
v("r7b-mistake", f"{Q} ac-r7 b commonMistakes", "1.4/0.020 = 70", lambda: acc(5.4 - 4.0, 0.020), 70, sf=2)
w("r7b-tol", f"{Q} ac-r7 b tolerance", 470, 2, [("470", 470.0)])
mcq("r1-key", f"{Q} ac-r1", "key C = rate of change of velocity (index 2 of 4)", lambda: 2, [0, 1, 2, 3], 2, dp=0)
mcq("r2-key", f"{Q} ac-r2", "key B straight line gradient 9.81 (index 1)", lambda: 1, [0, 1, 2, 3], 1, dp=0)
mcq("r3-key", f"{Q} ac-r3", "key C g at start, 0 at terminal (index 2)", lambda: 2, [0, 1, 2, 3], 2, dp=0)
b("g-val", f"{Q} fc-14 / ac-r2 / ac-r3 / sections", "g = 9.81", lambda: P.G == 9.81)

# ---------------- Past papers vs official mark schemes ----------------
v("pp22-a", f"{Q} pp-h156-01-2022-q21 a", "0.5(4+10)*3 + 10*5 = 71", lambda: 0.5 * (4.0 + 10.0) * 3.0 + 10.0 * 5.0, 71, sf=2)
v("pp22-bi", f"{Q} pp-h156-01-2022-q21 b(i)", "6.0/3.0 = 2.0", lambda: acc(6.0, 3.0), 2.0, sf=2)
import math  # noqa: E402
v("pp22-bii", f"{Q} pp-h156-01-2022-q21 b(ii)", "680cos55 - R = 150*2 -> R = 90", lambda: 680 * math.cos(math.radians(55)) - 150 * 2.0, 90, sf=2)
w("pp22-a-tol", f"{Q} 2022 a tol", 71, 2, [("official 71", 71.0)])
w("pp22-bii-tol", f"{Q} 2022 b(ii) tol", 90, 3, [("official 90", 90.0), ("computed 90.04", 90.04)])
v("pp19-ai", f"{Q} pp-h156-02-2019-q1 a(i)", "4.7/0.48 = 9.8", lambda: acc(4.7, 0.48), 9.8, sf=2, note="MS answer line 9.8")
w("pp19-ai-tol", f"{Q} 2019 a(i) tol", 9.8, 2, [("MS answer line 9.8", 9.8), ("example 9.79", 9.79)])
v("pp19-aii", f"{Q} pp-h156-02-2019-q1 a(ii)", "0.5*0.057*4.7^2 = 0.63", lambda: P.kinetic_energy(0.057, 4.7), 0.63, dp=2)
w("pp19-aii-tol", f"{Q} 2019 a(ii) tol", 0.63, 2, [("official 0.63", 0.63), ("0.6296", 0.629565)])
v("pp19-bi", f"{Q} pp-h156-02-2019-q1 b(i)", "v = sqrt(2*0.8*0.63/0.057) = 4.2", lambda: P.speed_from_ke(0.8 * 0.629565, 0.057), 4.2, sf=2)
v("pp19-biii", f"{Q} pp-h156-02-2019-q1 b(iii)", "0.5*4.2*0.43 = 0.90", lambda: 0.5 * 4.2 * 0.43, 0.90, dp=2)
w("pp19-biii-tol", f"{Q} 2019 b(iii) tol", 0.9, 5, [("official 0.90", 0.90), ("0.903", 0.903)])
w("pp25-aiii-tol", f"{Q} 2025 a(iii) tol", 95000, 2, [("MS 95000", 95000.0), ("MS 95200", 95200.0)])
b("r7a-rejects-10", f"{Q} ac-r7 a tolerance 9.8 +/-2%", "bare 10 rejected (show-that)", lambda: not (9.8*0.98 <= 10 <= 9.8*1.02))
b("pp25-rejects-out", f"{Q} 2025 a(ii) 1.5 +/-14%", "1.2 and 1.8 rejected", lambda: not (1.29 <= 1.2 <= 1.71) and not (1.29 <= 1.8 <= 1.71))

CLAIMS = C
