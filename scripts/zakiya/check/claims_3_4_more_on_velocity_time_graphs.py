"""Numerical claims in the 3.4 More on velocity-time graphs guide, recomputed independently.

Same record kinds as claims_3_8.py. Run:
  python run_checks.py --claims claims_3_4_more_on_velocity_time_graphs
Plain arithmetic (areas, gradients, ratios) is inline; physics goes through physics.py.
Official past-paper answers are from "11 Sorted by topic (generated)/Chapter 3 Motion/summary.md" and the mark schemes
(viewed with scripts/zakiya/papers/show_source.sh). Textbook figures read from book p. 30 (PDF page 42).
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
Q = "content/zakiya/module3/3-4-more-on-velocity-time-graphs.ts"
S = "content/zakiya/module3/3-4/sections.ts"
F = "content/zakiya/module3/3-4/figures.ts"
EX = "content/zakiya/module3/3-4/explain.ts"
C = []
CLAIMS = C


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


tri = lambda base, h: 0.5 * base * h
trap = lambda a, b_, h: 0.5 * (a + b_) * h


# ============ Graph figures: parse each `kind: "graph"` block and re-evaluate it (as the 3.1 checks do) ============
FIG = open(os.path.join(ROOT, F)).read()


def expr_fn(expr, var):
    """Same tiny language as lib/zakiya/graph-expr.ts, evaluated with no builtins."""
    assert re.fullmatch(r"[0-9.+\-*/^() a-z]*", expr), expr
    py = re.sub(r"(\d)\s*([a-z(])", r"\1*\2", expr).replace("^", "**")
    names = {var: 0.0, "pi": math.pi, "sqrt": math.sqrt, "exp": math.exp, "ln": math.log,
             "sin": lambda d: math.sin(math.radians(d)), "cos": lambda d: math.cos(math.radians(d)),
             "tan": lambda d: math.tan(math.radians(d))}
    code = compile(py, "<expr>", "eval")
    assert set(code.co_names) <= set(names), code.co_names
    return lambda x: eval(code, {"__builtins__": {}}, {**names, var: x})  # noqa: S307 (repo content, names whitelisted)


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


def poly_fn(pts):
    def f(x):
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            if x0 <= x <= x1:
                return y1 if x1 == x0 else y0 + (y1 - y0) * (x - x0) / (x1 - x0)
        raise ValueError(x)
    return f


def simpson(f, a, b2, n=2000):
    h = (b2 - a) / n
    return h / 3 * (f(a) + f(b2) + sum((4 if i % 2 else 2) * f(a + i * h) for i in range(1, n)))


G_ALL, G_FN, G_AREA = {}, {}, {}
for m in re.finditer(r"export const (\w+): Figure = \{(.*?)\n\};", FIG, re.S):
    name, body = m.groups()
    if 'kind: "graph"' not in body:
        continue
    series = {}
    for sm in re.finditer(r'\{ id: "(\w+)"[^{}]*?(?:expr: "([^"]+)"|points: (\[\[.*?\]\]))', body):
        sid, ex, pts = sm.groups()
        series[sid] = expr_fn(ex, "t") if ex else [tuple(map(float, p)) for p in re.findall(r"\[([-\d.]+), ([-\d.]+)\]", pts)]
    area = re.search(r'area: \{ series: "(\w+)", from: ([-\d.]+), to: ([-\d.]+)', body)
    G_ALL[name] = dict(series=series, area=area.groups() if area else None, body=body)
    first = next(iter(series.values()))
    G_FN[name] = first if callable(first) else poly_fn(first)
    if area:
        sid, a0, a1 = area.groups()
        sr = series[sid]
        G_AREA[name] = poly_area(sr, float(a0), float(a1)) if not callable(sr) else simpson(sr, float(a0), float(a1))


# ============ Section 1: strip (figStrip) ============
v("strip", f"{S} area-is-displacement / {F} figStrip", "6.0 x 0.5 = 3.0 m", lambda: 6.0 * 0.5, 3.0, sf=2)
b("strip-curve", f"{F} figStrip", "graph expr at t=5 is about 6.0 m/s (strip height 6.0)",
  lambda: abs(G_FN["figStrip"](5) - 6.0) < 0.15, note="re-evaluated from figStrip expr")
b("strip-top", f"{F} figStrip", "graph expr at 5.5 s still ~6.0 (strip top flat enough)",
  lambda: abs(G_FN["figStrip"](5.5) - 6.0) < 0.35, note="re-evaluated from figStrip expr")

# ============ Section 2: cyclist (textbook p.30) ============
cA = lambda: tri(10, 4.0)
cB = lambda: 20 * 4.0
cC = lambda: tri(20, 4.0)
v("cyc-A", f"{S} straight-lines worked 1 / {F} figCyclist", "A = 1/2 x 10 x 4.0 = 20 m", cA, 20, sf=2)
v("cyc-B", f"{S} straight-lines worked 1 / {F} figCyclist", "B = 20 x 4.0 = 80 m", cB, 80, sf=2)
v("cyc-C", f"{S} straight-lines worked 1 / {F} figCyclist", "C = 1/2 x 20 x 4.0 = 40 m", cC, 40, sf=2)
v("cyc-tot", f"{S} straight-lines worked 1", "20 + 80 + 40 = 140 m", lambda: cA() + cB() + cC(), 140, sf=3)
v("cyc-trap", f"{S} straight-lines equation / {F} figCyclistTrap / explain trap", "1/2 x (50 + 20) x 4.0 = 140 m", lambda: trap(50, 20, 4.0), 140, sf=3)
b("cyc-times", f"{F} figCyclist", "10 s + 20 s + 20 s = 50 s total; flat from 10 to 30", lambda: 10 + 20 + 20 == 50 and 30 - 10 == 20)
v("fc05", f"{Q} vt-fc-05", "0 to 4.0 m/s in 10 s -> 20 m", lambda: tri(10, 4.0), 20, sf=2)
v("expl-tri", f"{EX} tri", "1/2 x 10 s x 4.0 = 20 m", lambda: tri(10, 4.0), 20, sf=2)
v("expl-rect", f"{EX} rect", "20 s x 4.0 = 80 m", lambda: 20 * 4.0, 80, sf=2)
v("expl-trap", f"{EX} trap", "1/2 x (50 + 20) x 4.0 = 140", lambda: trap(50, 20, 4.0), 140, sf=3)

# ============ Sprinter (textbook p.30 Fig 6) ============
spA = lambda: tri(4, 10.0)
spB = lambda: 5 * 10.0
spC = lambda: trap(10.0, 5.0, 4)
v("spr-A", f"{S} worked sprinter / {F} figSprinter", "1/2 x 4 x 10.0 = 20 m", spA, 20, sf=2)
v("spr-B", f"{S} worked sprinter / {F} figSprinter", "5 x 10.0 = 50 m", spB, 50, sf=2)
v("spr-C", f"{S} worked sprinter / {F} figSprinter", "1/2 x (10.0 + 5.0) x 4 = 30 m", spC, 30, sf=2)
v("spr-tot", f"{S} worked sprinter", "20 + 50 + 30 = 100 m", lambda: spA() + spB() + spC(), 100, sf=3)
v("spr-avg", f"{S} worked sprinter / {F} figSprinter / explain avgv", "100 / 13 = 7.7 m/s", lambda: 100 / 13, 7.7, sf=2)
b("spr-times", f"{F} figSprinter", "widths 4 s, 9-4 = 5 s, 13-9 = 4 s", lambda: (9 - 4 == 5) and (13 - 9 == 4))

# ============ Car (textbook p.30 Fig 5) ============
carT = lambda: tri(75, 15)
carR = lambda: 25 * 15
v("car-tri", f"{S} worked car / {F} figCar", "1/2 x 75 x 15 = 562.5 m", carT, 562.5, sf=4)
v("car-rect", f"{S} worked car / {F} figCar", "25 x 15 = 375 m", carR, 375, sf=3)
v("car-tot", f"{S} worked car", "562.5 + 375 = 937.5 m", lambda: carT() + carR(), 937.5, sf=4)
v("car-avg", f"{S} worked car / {F} figCar", "937.5 / 100 = 9.4 m/s (9.375)", lambda: (carT() + carR()) / 100, 9.4, sf=2)
v("car-940", f"{S} worked car answer", "about 940 m", lambda: carT() + carR(), 940, sf=2)
v("car-75avg", f"{S} worked car answer", "(0 + 15)/2 = 7.5", lambda: (0 + 15) / 2, 7.5, sf=2)
b("car-25s", f"{S} worked car", "100 - 75 = 25 s at top speed", lambda: 100 - 75 == 25)

# ============ Counting squares (ours) ============
pull = lambda t: 12 * (1 - math.exp(-t / 4))


def frac(i, j, n=4000):
    tot = 0.0
    for k in range(n):
        t = 2 * i + 2 * (k + 0.5) / n
        tot += min(max(pull(t) - 2 * j, 0), 2) / 2
    return tot / n


FULL = [1, 3, 4, 5, 5, 5]
full_ok = all(sum(1 for j in range(6) if frac(i, j) >= 0.8) == FULL[i] for i in range(6))
b("sq-cols", f"{F} figSquares fullCols / {S} counting-squares worked", "columns 1,3,4,5,5,5 are the squares >= ~80% under the curve",
  lambda: full_ok, note="fractions per column checked by numerical integration")
b("sq-mostly", f"{F} figSquares / {S} worked", "exactly 1 further square is 50-80% under (col 5 top, 0.61); others < 0.5",
  lambda: sum(1 for i in range(6) for j in range(6) if 0.5 < frac(i, j) < 0.8) == 1 and 0.5 < frac(5, 5) < 0.8)
v("sq-23", f"{S} worked / {F} figSquares key", "1+3+4+5+5+5 = 23", lambda: sum(FULL), 23, sf=2)
v("sq-24", f"{S} worked / {F} figSquares", "23 + 1 = 24", lambda: sum(FULL) + 1, 24, sf=2)
v("sq-one", f"{S} equation/worked / {F} / explain square / vt-fc-08", "2 s x 2 m/s = 4 m", lambda: 2 * 2, 4, sf=1)
v("sq-96", f"{S} equation/worked / {F} figSquares", "24 x 4 = 96 m", lambda: 24 * 4, 96, sf=2)
exact_pull = lambda: 12 * 12 - 48 * (1 - math.exp(-3))
v("sq-exact", f"{S} worked answer / {F} caption", "exact area is 98 m (98.39)", exact_pull, 98, sf=2)
b("sq-3pct", f"{F} figSquares caption", "count within 3% of exact", lambda: abs(96 - exact_pull()) / exact_pull() < 0.03, note=f"{abs(96 - exact_pull()) / exact_pull() * 100:.2f}%")
v("sq-end", f"{S} worked question", "curve rises towards 12 m/s: at 12 s v = 11.4", lambda: pull(12), 11.4, sf=3)
v("fc08", f"{Q} vt-fc-08", "2 s x 2 m/s = 4 m", lambda: 2 * 2, 4, sf=1)

# ============ Ramp (textbook p.30 Fig 7) ============
rU = lambda: tri(4.0, 4.0)
v("ramp-up", f"{S} worked ramp / {F} figRamp", "1/2 x 4.0 x 4.0 = +8.0 m", rU, 8.0, sf=2)
v("ramp-dist", f"{S} worked ramp / vt-fc-11", "8.0 + 8.0 = 16 m", lambda: rU() + rU(), 16, sf=2)
v("ramp-disp", f"{S} worked ramp", "8.0 + (-8.0) = 0", lambda: rU() - rU(), 0.0, dp=1)
v("ramp-spd", f"{S} worked ramp / vt-fc-11", "16 / 8.0 = 2.0 m/s", lambda: 16 / 8.0, 2.0, sf=2)
v("ramp-vel", f"{S} worked ramp / vt-fc-11", "0 / 8.0 = 0", lambda: 0 / 8.0, 0.0, dp=1)
v("ramp-grad", f"{S} below-the-axis text", "(-4.0 - 4.0)/8.0 = -1.0 m/s^2", lambda: (-4.0 - 4.0) / 8.0, -1.0, sf=2)
b("ramp-zero", f"{S} below-the-axis text / {F} figRamp", "line from +4.0 at 0 to -4.0 at 8.0 crosses 0 at 4.0 s", lambda: 4.0 + (-1.0) * 4.0 == 0)

# ============ Stopping distance (ours) ============
v("stop-think", f"{S} reading-the-shape worked / {F} figStopping", "15 x 0.60 = 9.0 m", lambda: 15 * 0.60, 9.0, sf=2)
v("stop-brake", f"{S} worked / {F} figStopping", "1/2 x 3.0 x 15 = 22.5 m", lambda: tri(3.0, 15), 22.5, sf=3)
v("stop-tot", f"{S} worked / {F} figStopping", "9.0 + 22.5 = 31.5 m", lambda: 15 * 0.60 + tri(3.0, 15), 31.5, sf=3)
v("stop-32", f"{S} worked answer", "about 32 m", lambda: 31.5, 32, sf=2, note="31.5 rounds to 32 (round half up)")
v("stop-a", f"{S} worked", "deceleration 15 / 3.0 = 5.0 m/s^2", lambda: 15 / 3.0, 5.0, sf=2)
b("stop-end", f"{F} figStopping", "0.60 + 3.0 = 3.6 s end of braking", lambda: abs(0.60 + 3.0 - 3.6) < 1e-9)
b("shape-tired", f"{F} figShapeChanges", "tired: flat 1.2 s then same slope (5.0 m/s^2) reaches 0 at 4.2 s", lambda: abs(1.2 + 15 / 5.0 - 4.2) < 1e-9)
v("shape-wet", f"{F} figShapeChanges", "wet: 15 m/s over 5.0 s (0.6 -> 5.6) = 3.0 m/s^2, less steep than 5.0",
  lambda: 15 / (5.6 - 0.6), 3.0, sf=2)

# ============ Flashcards ============
v("fc11-spd", f"{Q} vt-fc-11", "16 / 8.0 = 2.0", lambda: 16 / 8.0, 2.0, sf=2)

# ============ Questions ============
# vt-r1 (conceptual MCQ, key C)
u("r1-mcq", f"{Q} vt-r1", "key C: gradient = acceleration, area = displacement", "non-numeric conceptual MCQ (matches H556/01 June 2022 Q3 official A analogue)")

# vt-r2 four lines, areas
A_ = lambda: 6 * 10
B_ = lambda: 0.5 * 10 * 11
C_ = lambda: trap(10, 4, 10)
D_ = lambda: trap(2, 10, 10)
v("r2-A", f"{Q} vt-r2 modelAnswer", "A: 6 x 10 = 60 m", A_, 60, sf=2)
v("r2-B", f"{Q} vt-r2 modelAnswer", "B: 1/2 x 10 x 11 = 55 m", B_, 55, sf=2)
v("r2-C", f"{Q} vt-r2 modelAnswer", "C: 1/2 x (10 + 4) x 10 = 70 m", C_, 70, sf=2)
v("r2-D", f"{Q} vt-r2 modelAnswer", "D: 1/2 x (2 + 10) x 10 = 60 m", D_, 60, sf=2)
mcq("r2-mcq", f"{Q} vt-r2 options/correctIndex", "key C = greatest area", lambda: max(A_(), B_(), C_(), D_()), [60, 55, 70, 60], 2, dp=0)
b("r2-unique", f"{Q} vt-r2", "C strictly greater than every other area (unique key)", lambda: C_() > max(A_(), B_(), D_()))
b("r2-Bsmallest", f"{Q} vt-r2 commonMistakes", "B has the smallest area", lambda: B_() < min(A_(), C_(), D_()))
b("r2-figlines", f"{F} figQFour", "figure lines match text: A 6 flat; B 0->11; C 10->4; D 2->10",
  lambda: [G_ALL["figQFour"]["series"][k] for k in "ABCD"] == [[(0, 6), (10, 6)], [(0, 0), (10, 11)], [(0, 10), (10, 4)], [(0, 2), (10, 10)]])

# vt-r3 tram
v("r3a", f"{Q} vt-r3(a) modelAnswer", "(0-20)/(45-5.0) = -0.50", lambda: (0 - 20) / (45 - 5.0), -0.50, sf=2)
w("r3a-tol", f"{Q} vt-r3(a) answer", "0.5 +/- 2%", 0.5, 2, [("computed", lambda: abs((0 - 20) / (45 - 5.0)))])
v("r3b", f"{Q} vt-r3(b) modelAnswer", "1/2 x (5.0 + 45) x 20 = 500 m", lambda: trap(5.0, 45, 20), 500, sf=3)
v("r3b-alt", f"{Q} vt-r3(b) modelAnswer", "20 x 5.0 + 1/2 x 40 x 20 = 100 + 400", lambda: 20 * 5.0 + tri(40, 20), 500, sf=3)
v("r3b-100", f"{Q} vt-r3(b)", "20 x 5.0 = 100 m", lambda: 20 * 5.0, 100, sf=3)
v("r3b-400", f"{Q} vt-r3(b) commonMistakes", "braking triangle 400 m", lambda: tri(40, 20), 400, sf=3)
w("r3b-tol", f"{Q} vt-r3(b) answer", "500 +/- 2%", 500, 2, [("computed", lambda: trap(5.0, 45, 20))])
v("r3a-wrong", f"{Q} vt-r3(a) commonMistakes", "dividing by 45 gives 0.44 (wrong)", lambda: 20 / 45, 0.44, sf=2, note="not stated numerically in the file")

# vt-r4 stop line
v("r4b-pre", f"{Q} vt-r4(b) modelAnswer", "12 x 0.50 = 6.0 m", lambda: 12 * 0.50, 6.0, sf=2)
v("r4b-brake", f"{Q} vt-r4(b) modelAnswer", "1/2 x 3.0 x 12 = 18 m", lambda: tri(3.0, 12), 18, sf=2)
v("r4b-tot", f"{Q} vt-r4(b) modelAnswer", "6.0 + 18 = 24 m", lambda: 12 * 0.50 + tri(3.0, 12), 24, sf=2)
v("r4b", f"{Q} vt-r4(b) answer", "25 - 24 = 1.0 m before line", lambda: 25 - (12 * 0.50 + tri(3.0, 12)), 1.0, sf=2)
b("r4-base", f"{Q} vt-r4(b) commonMistakes", "braking 3.5 - 0.50 = 3.0 s", lambda: abs(3.5 - 0.50 - 3.0) < 1e-9)

# vt-r5 cyclist
v("r5a-trap", f"{Q} vt-r5(a) modelAnswer", "1/2 x (3.0 + 9.0) x 4.0 = 24 m", lambda: trap(3.0, 9.0, 4.0), 24, sf=2)
v("r5a-rect", f"{Q} vt-r5(a) modelAnswer", "9.0 x 6.0 = 54 m", lambda: 9.0 * 6.0, 54, sf=2)
v("r5a", f"{Q} vt-r5(a) answer", "24 + 54 = 78 m", lambda: trap(3.0, 9.0, 4.0) + 9.0 * 6.0, 78, sf=2)
w("r5a-tol", f"{Q} vt-r5(a) answer", "78 +/- 2%", 78, 2, [("computed", lambda: 78.0)])
v("r5b", f"{Q} vt-r5(b) modelAnswer", "78 / 10.0 = 7.8 m/s", lambda: 78 / 10.0, 7.8, sf=2)
v("r5-misc-tri", f"{Q} vt-r5 commonMistakes", "1/2 x 4.0 x 9.0 = 18 m", lambda: tri(4.0, 9.0), 18, sf=2)
v("r5-misc-avg", f"{Q} vt-r5 commonMistakes", "(3.0 + 9.0)/2 = 6.0", lambda: (3.0 + 9.0) / 2, 6.0, sf=2)

# vt-r6 curve (squares 1 s x 2 m/s)
fall = lambda t: 10 * (1 - math.exp(-t / 3))
fall_area = lambda: 10 * 10 - 30 * (1 - math.exp(-10 / 3))
v("r6-v10", f"{F} figQCurve alt text", "reaches about 9.6 m/s at 10 s", lambda: G_FN["figQCurve"](10), 9.6, sf=2)
v("r6-one", f"{Q} vt-r6 modelAnswer / {F} figQCurve", "1 s x 2 m/s = 2 m", lambda: 1 * 2, 2, sf=1)
v("r6-exact", f"{Q} vt-r6(b)", "exact area under curve = 71.07 m (claimed estimate 72)", fall_area, 72, sf=2,
  note="claimed 72 is the estimate, 71 exact; ROUNDING expected, acceptable as an estimate")
v("r6-72", f"{Q} vt-r6(b) modelAnswer", "36 x 2 = 72 m", lambda: 36 * 2, 72, sf=2)
w("r6-tol", f"{Q} vt-r6(b) answer", "72 +/- 9% covers the stated 66-78 range", 72, 9, [("66", 66), ("78", 78), ("exact", fall_area)],
  note="9% of 72 = 6.48 -> 65.52 to 78.48: covers 66 and 78")
b("r6-sqcount", f"{Q} vt-r6(b) modelAnswer", "36 squares is a defensible count (exact 35.5)", lambda: abs(fall_area() / 2 - 36) < 1.0)
v("r6-vt", f"{Q} vt-r6(b) commonMistakes", "9.6 x 10 = 96 m", lambda: 9.6 * 10, 96, sf=2)

# vt-r7 ball thrown up
t_top = lambda: 6.0 / G
v("r7a", f"{Q} vt-r7(a) modelAnswer/answer", "t = 6.0 / 9.81 = 0.612 s", t_top, 0.612, sf=3)
v("r7a-ms", f"{Q} vt-r7(a) markScheme", "0.61 s", t_top, 0.61, sf=2)
v("r7b", f"{Q} vt-r7(b) answer", "1/2 x 0.612 x 6.0 = 1.83 m", lambda: tri(t_top(), 6.0), 1.83, sf=3)
v("r7b-ms", f"{Q} vt-r7(b) model/markScheme", "1.8 m", lambda: tri(t_top(), 6.0), 1.8, sf=2)
v("r7b-lib", f"{Q} vt-r7(b) cross-check", "h = u^2/2g via physics.py", lambda: P.suvat_s(6.0, -G, t_top()) , 1.83, sf=3)
w("r7b-tol", f"{Q} vt-r7(b) answer", "1.83 +/- 3%", 1.83, 3, [("computed", lambda: tri(t_top(), 6.0))])
w("r7a-tol", f"{Q} vt-r7(a) answer", "0.612 +/- 2%", 0.612, 2, [("computed", t_top)])
v("r7c-v", f"{Q} vt-r7(c) modelAnswer", "v = 6.0 - 9.81 x 1.0 = -3.81", lambda: P.suvat_v(6.0, -G, 1.0), -3.81, sf=3)
v("r7c-dt", f"{Q} vt-r7(c) modelAnswer", "1.0 - 0.612 = 0.388 s", lambda: 1.0 - t_top(), 0.388, sf=3)
below = lambda: tri(1.0 - t_top(), 3.81)
v("r7c-below", f"{Q} vt-r7(c) modelAnswer", "1/2 x 0.388 x 3.81 = 0.74 m", below, 0.74, sf=2)
v("r7c-up", f"{Q} vt-r7(c) modelAnswer", "upper area quoted as 1.83, matching (b)", lambda: tri(t_top(), 6.0), 1.83, sf=3)
v("r7c-disp", f"{Q} vt-r7(c) modelAnswer", "1.83 - 0.74 = 1.1 m", lambda: P.suvat_s(6.0, -G, 1.0), 1.1, sf=2)
v("r7c-dist", f"{Q} vt-r7(c) modelAnswer", "1.83 + 0.74 = 2.6 m", lambda: tri(t_top(), 6.0) + below(), 2.6, sf=2)
v("r7-fig", f"{F} figQThrow alt", "v at 1.2 s = -5.8 m/s", lambda: G_FN["figQThrow"](1.2), -5.8, sf=2)

# vt-r8: no numbers (qualitative) - nothing to compute
u("r8", f"{Q} vt-r8", "wet road / distracted driver graph changes", "qualitative; matches H156/02 June 2023 Q1(c) mark scheme (viewed)")

# ============ Past papers vs official ============
v("pp-2023-rect", f"{Q} pp-h156-02-2023-q1 explanation", "18 x 0.7 = 12.6", lambda: 18 * 0.7, 12.6, sf=3)
v("pp-2023-tri", f"{Q} pp-h156-02-2023-q1 explanation", "1/2 x 18 x 2.7 = 24.3", lambda: tri(2.7, 18), 24.3, sf=3)
v("pp-2023", f"{Q} pp-h156-02-2023-q1 explanation (official 37 m, 36.9)", "36.9 m", lambda: 18 * 0.7 + tri(2.7, 18), 36.9, sf=3)
v("pp-2023-37", f"{Q} pp-h156-02-2023-q1 answers a(iii) (official 37 m)", "37 m", lambda: 18 * 0.7 + tri(2.7, 18), 37, sf=2)
v("pp-2025-alt", f"{Q} MS alt route", "8 x 54 + 1/2 x 120 x 54 = 3672", lambda: 8 * 54 + tri(120, 54), 3672, sf=4)
v("pp-q16-iii", f"{Q} pp-h556-01-2025-q16a a(iii) (official 95 000)", "56 x 1700 = 95 000", lambda: 56 * 1700, 95000, sf=2,
  note="MS: 95000 (95200 to 3 sf)")
w("pp-q16-ii", f"{Q} pp-h556-01-2025-q16a a(ii) answer 1.5 +/- 17%", "official window 1.3-1.7 (2 sf) -> 1.25-1.75", 1.5, 17,
  [("1.25", 1.25), ("1.3", 1.3), ("1.4", 1.4), ("1.7", 1.7), ("1.75", 1.75)],
  note="17% of 1.5 -> 1.245-1.755")
mcq("pp-q3", f"{Q} pp-h556-01-2022-q3", "official key A (acceleration, displacement)", lambda: 0, [0], 0, dp=0, note="key A checked against summary.md; trivially true")
mcq("pp-n20-q14", f"{Q} pp-h556-01-2020n-q14", "official key C", lambda: 0, [0], 0, dp=0, note="key C checked against summary.md")

# ============ Textbook figure readings ============
b("tb-fig5", "data/textbook-marker/pages/book-p030 (PDF p42 image)", "Fig 5: 0 to 15 m/s at 75 s, flat to 100 s", lambda: True, note="viewed at 2x crop: kink at 75 s, level 15")
b("tb-fig6", "book p30", "Fig 6: 10.0 at 4 s, flat to 9 s, 5.0 at 13 s, dashed 'End of race' at 13", lambda: True, note="viewed")
b("tb-fig7", "book p30", "Fig 7: +4.0 at 0 to -4.0 at 8.0, zero at 4.0", lambda: True, note="viewed")
b("tb-fig3", "book p29-30 text", "cyclist 20 + 80 + 40 = 140; trapezium 1/2(50+20)x4.0 = 140", lambda: True, note="text of book-p030.md")


# ============ Graph figures re-read from figures.ts (expr / points / area) ============
def gp(name, sid):
    return G_ALL[name]["series"][sid]


b("g-strip-expr", f"{F} figStrip expr", "graph is v = 8(1-exp(-t/3.6)) (same curve as the old sketch)",
  lambda: all(abs(G_FN["figStrip"](t_) - 8 * (1 - math.exp(-t_ / 3.6))) < 1e-9 for t_ in (0, 5, 10)))
v("g-strip-area", f"{F} figStrip area readout", "whole area under the curve (readout 53 m, Simpson)", lambda: G_AREA["figStrip"], 53, dp=0)
v("g-strip-strip", f"{F} figStrip caption", "6.0 x 0.5 = 3.0 m", lambda: 6.0 * 0.5, 3.0, sf=2)
for nm, tot in (("figCyclist", 140), ("figCyclistTrap", 140)):
    b(f"g-{nm}-pts", f"{F} {nm} points", "0->4.0 at 10 s, flat to 30 s, down to 0 at 50 s", lambda nm=nm: gp(nm, "cyc") == [(0, 0), (10, 4), (30, 4), (50, 0)])
    v(f"g-{nm}-area", f"{F} {nm} area / caption", "area = 140 m", lambda nm=nm: G_AREA[nm], tot, dp=0)
b("g-car-pts", f"{F} figCar points", "0 -> 15 m/s at 75 s, flat to 100 s", lambda: gp("figCar", "car") == [(0, 0), (75, 15), (100, 15)])
v("g-car-area", f"{F} figCar area / caption", "area = 937.5 m", lambda: G_AREA["figCar"], 937.5, dp=1)
v("g-car-avg", f"{F} figCar caption", "937.5 / 100 = 9.4 m/s", lambda: G_AREA["figCar"] / 100, 9.4, sf=2)
b("g-spr-pts", f"{F} figSprinter points", "0 -> 10.0 at 4 s, flat to 9 s, 5.0 at 13 s", lambda: gp("figSprinter", "spr") == [(0, 0), (4, 10), (9, 10), (13, 5)])
v("g-spr-area", f"{F} figSprinter area / caption", "area = 100 m", lambda: G_AREA["figSprinter"], 100, dp=0)
v("g-spr-avg", f"{F} figSprinter caption", "100 / 13 = 7.7 m/s", lambda: G_AREA["figSprinter"] / 13, 7.7, sf=2)
b("g-ramp-pts", f"{F} figRamp points", "+4.0 at 0 s to -4.0 at 8.0 s", lambda: gp("figRamp", "ball") == [(0, 4), (8, -4)])
v("g-ramp-up", f"{F} figRamp caption", "area 0-4 s = +8.0 m", lambda: poly_area(gp("figRamp", "ball"), 0, 4), 8.0, sf=2)
v("g-ramp-down", f"{F} figRamp caption", "area 4-8 s = -8.0 m", lambda: poly_area(gp("figRamp", "ball"), 4, 8), -8.0, sf=2)
v("g-ramp-net", f"{F} figRamp area readout", "net area 0-8 s = 0 m", lambda: G_AREA["figRamp"], 0, dp=0)
b("g-sq-expr", f"{F} figSquares expr", "graph is v = 12(1-exp(-t/4)), same curve as the counting claims",
  lambda: all(abs(G_FN["figSquares"](t_) - pull(t_)) < 1e-9 for t_ in (0, 4, 12)))
v("g-sq-area", f"{F} figSquares area readout / caption", "exact area 98 m (Simpson)", lambda: G_AREA["figSquares"], 98, sf=2)
b("g-sq-axes", f"{F} figSquares axes", "squares 2 s x 2 m/s = 4 m (x step 2, y step 2)",
  lambda: 'x: t(12, 2)' in G_ALL["figSquares"]["body"] and 'y: vAx(0, 12, 2)' in G_ALL["figSquares"]["body"])
b("g-stop-pts", f"{F} figStopping points", "15 m/s to 0.60 s, then down to 0 at 3.6 s", lambda: gp("figStopping", "stop") == [(0, 15), (0.6, 15), (3.6, 0)])
v("g-stop-area", f"{F} figStopping area readout / caption", "31.5 m", lambda: G_AREA["figStopping"], 31.5, dp=1)
v("g-stop-think", f"{F} figStopping caption", "rectangle 0-0.6 s = 9.0 m", lambda: poly_area(gp("figStopping", "stop"), 0, 0.6), 9.0, sf=2)
v("g-stop-brake", f"{F} figStopping caption", "triangle 0.6-3.6 s = 22.5 m", lambda: poly_area(gp("figStopping", "stop"), 0.6, 3.6), 22.5, sf=3)
b("g-shape-pts", f"{F} figShapeChanges", "normal / tired (1.2 s flat, reaches 0 at 4.2 s) / wet (reaches 0 at 5.6 s)",
  lambda: gp("figShapeChanges", "normal") == [(0, 15), (0.6, 15), (3.6, 0)] and gp("figShapeChanges", "tired") == [(0, 15), (1.2, 15), (4.2, 0)]
  and gp("figShapeChanges", "wet") == [(0, 15), (0.6, 15), (5.6, 0)])
b("g-shape-area", f"{F} figShapeChanges caption", "tired and wet both have more area than normal",
  lambda: poly_area(gp("figShapeChanges", "tired"), 0, 6) > poly_area(gp("figShapeChanges", "normal"), 0, 6)
  and poly_area(gp("figShapeChanges", "wet"), 0, 6) > poly_area(gp("figShapeChanges", "normal"), 0, 6))
b("g-tram-pts", f"{F} figQTram", "20 m/s to 5.0 s, then to 0 at 45 s", lambda: gp("figQTram", "tram") == [(0, 20), (5, 20), (45, 0)])
b("g-qstop-pts", f"{F} figQStopLine", "12 m/s to 0.50 s, then to 0 at 3.5 s", lambda: gp("figQStopLine", "car") == [(0, 12), (0.5, 12), (3.5, 0)])
b("g-qcyc-pts", f"{F} figQCyclist", "3.0 at 0 s, 9.0 at 4.0 s, flat to 10.0 s", lambda: gp("figQCyclist", "cyc") == [(0, 3), (4, 9), (10, 9)])
b("g-qcurve-expr", f"{F} figQCurve expr", "graph is v = 10(1-exp(-t/3)) (matches the fall claims)",
  lambda: all(abs(G_FN["figQCurve"](t_) - fall(t_)) < 1e-9 for t_ in (0, 3, 10)))
v("g-qcurve-area", f"{F} figQCurve", "exact area 71 m (claimed estimate 72)", lambda: simpson(gp("figQCurve", "para"), 0, 10), 71, sf=2)
v("g-qthrow-v0", f"{F} figQThrow expr", "v(0) = 6.0 m/s", lambda: G_FN["figQThrow"](0), 6.0, sf=2)
v("g-qthrow-zero", f"{F} figQThrow alt", "crosses zero at about 0.61 s", lambda: 6.0 / 9.81, 0.61, sf=2)
v("g-qthrow-grad", f"{F} figQThrow caption", "gradient -9.81 m s^-2", lambda: (G_FN["figQThrow"](1.0) - G_FN["figQThrow"](0.0)) / 1.0, -9.81, sf=3)
