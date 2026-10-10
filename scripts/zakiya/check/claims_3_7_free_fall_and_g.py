"""Numerical claims in the 3.7 Free fall and g guide, each recomputed with physics.py (see claims_3_8.py for the record kinds).
Plain arithmetic (differences, ratios, %, unit conversions, uncertainty rules) is inline; physics goes through physics.py."""
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
Q = "content/zakiya/module3/3-7-free-fall-and-g.ts"
SE = "content/zakiya/module3/3-7/sections.ts"
EX = "content/zakiya/module3/3-7/explain.ts"
FG = "content/zakiya/module3/3-7/figures.ts"
PP = f"{Q} pastPapers"

C = []


def v(id, where, quote, fn, claimed, sf=None, dp=None, inputs=None, alt=None, note=""):
    C.append(dict(kind="value", id=id, where=where, quote=quote, fn=fn, claimed=claimed,
                  shown_sf=sf, shown_dp=dp, inputs=inputs or {}, alt=alt, note=note))


def b(id, where, quote, fn, note=""):
    C.append(dict(kind="bool", id=id, where=where, quote=quote, fn=fn, claimed=True, inputs={}, note=note))


def w(id, where, quote, value, tol_pct, tests, note=""):
    C.append(dict(kind="window", id=id, where=where, quote=quote, value=value, tol_pct=tol_pct, tests=tests, note=note))


def mcq(id, where, quote, fn, options, correct_index, dp, note=""):
    C.append(dict(kind="mcq", id=id, where=where, quote=quote, fn=fn, options=options,
                  correct_index=correct_index, shown_dp=dp, note=note))


def u(id, where, quote, reason):
    C.append(dict(kind="unchecked", id=id, where=where, quote=quote, reason=reason))


def src(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def g_from_s_t(s, t):
    return 2 * s / (t * t)


# ====================================================================
# Section 1 What is free fall + figDropEachSecond
# ====================================================================
for t, vv, d in [(1, 9.81, 4.91), (2, 19.6, 19.6), (3, 29.4, 44.1)]:
    v(f"s1-v{t}", f"{SE} what-is-free-fall / {FG} figDropEachSecond", f"v after {t} s = {vv} m/s", lambda t=t: P.suvat_v(0, G, t), vv, sf=3)
    v(f"s1-s{t}", f"{SE} suvat-for-falling / {FG} figDropEachSecond", f"s after {t} s = {d} m", lambda t=t: P.suvat_s(0, G, t), d, sf=3)
b("s1-4x", f"{SE} suvat-for-falling text", "double the time, four times the distance", lambda: abs(P.suvat_s(0, G, 2) / P.suvat_s(0, G, 1) - 4) < 1e-9)
v("eq-v2gh", f"{SE} equation v²=2gh words / {EX} v2-2gh", "2.0 m drop: v = 6.3 m/s", lambda: P.suvat_v_from_s(0, G, 2.0), 6.3, sf=2)
v("eq-vgt", f"{SE} equation v=gt words", "2 s of falling gives 19.6 m/s", lambda: P.suvat_v(0, G, 2), 19.6, sf=3)
v("weight-2kg", f"{EX} weight", "2 kg ball weighs 2 x 9.81 = 19.6 N", lambda: P.weight(2), 19.6, sf=3)
v("tfall-1m", f"{SE} trapdoor text / {Q} ff-fc-11", "1.0 m drop takes about 0.45 s", lambda: P.fall_time(1.0), 0.45, sf=2)
v("half-g-1s", f"{EX} half-g-t2", "1/2 x 9.81 x 1^2 = 4.91 m after 1 s", lambda: P.suvat_s(0, G, 1), 4.91, sf=3)

# figDropEachSecond geometry: velocity arrows and dot positions vs physics (pixel lengths read from the SVG)
fig_src = src(FG)
b("fig-drop-vel-arrows-prop", f"{FG} figDropEachSecond", "velocity arrow lengths 18:36:54 px for 9.81:19.6:29.4 m/s",
  lambda: all(abs(L / 18 - k) < 0.05 for L, k in [(18, 1), (36, 2), (54, 3)]) and
  'y1="40" x2="88" y2="58"' in fig_src and 'y1="88" x2="88" y2="124"' in fig_src and 'y1="168" x2="88" y2="222"' in fig_src)
dots = [(24, 0), (40, 1), (88, 2), (168, 3)]


def drop_scale_ratios():
    return [(y - 24) / (P.suvat_s(0, G, t)) for y, t in dots[1:]]


b("fig-drop-dots-to-scale", f"{FG} figDropEachSecond", "dots at y=40, 88, 168 vs 4.91, 19.6, 44.1 m falls (constant px per m)",
  lambda: max(drop_scale_ratios()) / min(drop_scale_ratios()) < 1.05 and all(f'cy="{y}"' in fig_src for y, _ in dots),
  note="about 3.26 px per m, ratio 1 : 4 : 9; caption/alt say drawn to scale")

# ====================================================================
# Section 2 g varies / Baumgartner
# ====================================================================
v("baum-free", f"{SE} g-varies", "9.81 x 50 = 490 m/s", lambda: P.suvat_v(0, G, 50), 490, sf=2, note="490.5 exactly")
v("baum-avg", f"{SE} g-varies", "380 / 50 = 7.6 m/s each second", lambda: 380 / 50, 7.6, sf=2)

# ====================================================================
# Marble (Textbook p. 39 Q2) + figMarble
# ====================================================================
marble = lambda: P.suvat_s(0, G, 2.3)
v("marble-sq", f"{SE} worked marble", "2.3^2 = 5.29", lambda: 2.3 ** 2, 5.29, sf=3)
v("marble-step", f"{SE} worked marble step 3", "H = 1/2 x 9.81 x 5.29 = 25.947 m", marble, 25.947, sf=5)
v("marble-ans", f"{SE} worked marble answer", "H = 26 m (2 s.f.)", marble, 26, sf=2)
v("marble-fig", f"{FG} figMarble label/key/caption", "H = 26 m (25.947 in caption)", marble, 26, sf=2,
  note="text, figure and caption all give 25.947 -> 26 m")

# ====================================================================
# Ball thrown up at 12 m/s + figThrowUp
# ====================================================================
v("up-s2", f"{SE} worked throw-up", "144 / 19.62 = 7.34 m", lambda: 12 ** 2 / (2 * G), 7.34, sf=3)
v("up-h", f"{SE} worked throw-up / {FG} figThrowUp", "max height 7.34 m", lambda: P.projectile(12, 90)["h_max"], 7.34, sf=3)
v("up-t", f"{SE} worked throw-up / {FG} figThrowUp", "t = 12 / 9.81 = 1.22 s", lambda: P.projectile(12, 90)["t_peak"], 1.22, sf=3)
v("up-vtop", f"{SE} worked throw-up", "v = 0 at the top", lambda: P.velocity(12, 90, P.projectile(12, 90)["t_peak"])[1], 0.0, dp=6)
v("up-total", f"{SE} worked throw-up answer", "another 1.22 s to fall back", lambda: P.fall_time(P.projectile(12, 90)["h_max"]), 1.22, sf=3)

# ====================================================================
# Trapdoor: 85.6 cm in 0.421 s (p. 38) + figTrapdoor
# ====================================================================
s_td = 85.6 / 100
v("td-s", f"{SE} worked trapdoor / {FG} figTrapdoor", "85.6 cm = 0.856 m", lambda: 85.6 / 100, 0.856, sf=3)
v("td-t2", f"{SE} worked trapdoor / {EX} t2", "0.421^2 = 0.177 s^2", lambda: 0.421 ** 2, 0.177, sf=3)
v("td-2s", f"{SE} worked trapdoor", "2 x 0.856 = 1.712", lambda: 2 * s_td, 1.712, sf=4)
v("td-step", f"{SE} worked trapdoor step 3", "1.712 / 0.1772 = 9.66 m/s^2 (as written)", lambda: 1.712 / 0.1772, 9.66, sf=3)
v("td-step-note", f"{SE} worked trapdoor step 3", "0.177 would give 9.67", lambda: 1.712 / 0.177, 9.67, sf=3)
v("td-g", f"{SE} worked trapdoor / {Q} ff-fc-07 / {EX} two-s-t2 / {FG} figTrapdoor", "g = 9.66 m/s^2 (textbook prints 9.66)", lambda: g_from_s_t(0.856, 0.421), 9.66, sf=3)
v("td-fall-check", f"{Q} ff-fc-07", "0.856 m in 0.421 s gives 9.66", lambda: g_from_s_t(0.856, 0.421), 9.66, sf=3)

# ====================================================================
# Light-gate / graph: Table 1 (p. 39) + figGraph
# ====================================================================
T1_t = [0.132, 0.165, 0.198, 0.231, 0.264, 0.297, 0.330, 0.363, 0.396, 0.429]
T1_s = [0.085, 0.134, 0.192, 0.262, 0.368, 0.433, 0.534, 0.646, 0.769, 0.903]
good = [i for i in range(10) if i != 4]
fit_g = lambda: 2 * sum(T1_s[i] * T1_t[i] ** 2 for i in good) / sum(T1_t[i] ** 4 for i in good)
v("t1-fit9", f"{SE} graph-method worked answer", "fit of the nine good points gives g = 9.81", fit_g, 9.81, sf=3)
v("t1-fit10", f"{SE} graph-method (info only)", "fit including anomaly (not claimed)", lambda: 2 * sum(s * t ** 2 for s, t in zip(T1_s, T1_t)) / sum(t ** 4 for t in T1_t), 9.84, sf=3,
  note="what a naive fit of all ten would give; page does not claim this")
v("t1-first", f"{SE} graph-method text", "after 0.132 s fallen 0.085 m", lambda: P.suvat_s(0, G, 0.132), 0.085, sf=2)
v("t1-last", f"{SE} graph-method text", "after 0.429 s fallen 0.903 m", lambda: P.suvat_s(0, G, 0.429), 0.903, sf=3)
v("t1-anom-t2", f"{SE} graph-method worked step 1", "t = 0.264 s, t^2 = 0.0697 s^2", lambda: 0.264 ** 2, 0.0697, sf=3)
v("t1-anom-line", f"{SE} graph-method worked step 1 / {EX} anomaly", "line gives 1/2 x 9.81 x 0.0697 = 0.342 m", lambda: P.suvat_s(0, G, 0.264), 0.342, sf=3)
for i in good:
    v(f"t1-pt{i}", f"{FG} figGraph data point t={T1_t[i]}", f"s = {T1_s[i]} m lies on s = 1/2 g t^2", lambda i=i: P.suvat_s(0, G, T1_t[i]), T1_s[i], dp=3)
v("grad-tri", f"{SE} graph-method worked step 2 / {FG} figGraph", "0.883 / 0.180 = 4.906 m/s^2", lambda: 0.883 / 0.180, 4.906, sf=4)
v("grad-line", f"{SE} graph-method worked step 2", "triangle corner (0.180 s^2, 0.883 m) is on the g=9.81 line", lambda: P.suvat_s(0, G, math.sqrt(0.180)), 0.883, sf=3)
v("grad-g", f"{SE} graph-method worked step 3 / {FG} figGraph key", "g = 2 x 4.906 = 9.81 m/s^2 (as written)", lambda: P.g_from_y_t2_gradient(4.906), 9.81, sf=3)
v("grad-pctdiff", f"{SE} graph-method worked step 3", "(9.81 - 9.81) / 9.81 x 100 = 0%", lambda: (9.81 - 9.81) / 9.81 * 100, 0, dp=0,
  note="g = 2 x 4.906 = 9.812 -> 9.81, so 0%")

# figGraph is a declarative graph (components/zakiya/Graph.tsx): re-read its own points / tangent / axes from figures.ts.
def graph_block(name):
    m = re.search(r"export const " + name + r": Figure = \{(.*?)\n\};", fig_src, re.S)
    return m.group(1)


GG = graph_block("figGraph")
gg_line = [tuple(map(float, p)) for p in re.findall(r"\[([\d.]+), ([\d.]+)\]", re.search(r"points: \[(\[.*?\])\]", GG).group(1).join(["[", "]"]))]
gg_at = float(re.search(r"tangent: \{[^}]*?at: ([\d.]+)", GG, re.S).group(1))
gg_xmin, gg_xmax = map(float, re.search(r'x: \{[^}]*min: ([\d.]+), max: ([\d.]+)', GG).groups())
gg_ymin, gg_ymax = map(float, re.search(r'y: \{[^}]*min: ([\d.]+), max: ([\d.]+)', GG).groups())
gg_dots = [(float(a), float(c)) for a, c in re.findall(r"\{ x: ([\d.]+), y: ([\d.]+)", GG)]
gg_slope = (gg_line[1][1] - gg_line[0][1]) / (gg_line[1][0] - gg_line[0][0])
gg_snap = 10 ** math.floor(math.log10((gg_xmax - gg_xmin) / 20))  # Graph.tsx
gg_span = max(gg_snap, round((gg_xmax - gg_xmin) / 3 / gg_snap) * gg_snap)
gg_x1, gg_x2 = max(gg_xmin, gg_at - gg_span), min(gg_xmax, gg_at + gg_span)
gg_y = lambda t2: gg_line[0][1] + gg_slope * (t2 - gg_line[0][0])

b("fig-graph-line", f"{FG} figGraph series", "best-fit line is a straight line through the origin", lambda: gg_line[0] == (0.0, 0.0) and len(gg_line) == 2)
v("fig-graph-grad", f"{FG} figGraph readout / caption", "gradient = 4.906 m s^-2", lambda: gg_slope, 4.906, sf=4)
v("fig-graph-at", f"{FG} figGraph tangent.at", "triangle starts at the origin: at - span = 0 s^2", lambda: gg_x1, 0.0, dp=3)
v("fig-graph-dx", f"{FG} figGraph triangle / caption", "triangle base 0.180 s^2", lambda: gg_x2 - gg_x1, 0.180, sf=3)
v("fig-graph-dy", f"{FG} figGraph triangle / caption", "triangle height 0.883 m", lambda: gg_y(gg_x2) - gg_y(gg_x1), 0.883, sf=3)
v("fig-graph-g", f"{FG} figGraph caption", "g = 2 x gradient = 9.81 m s^-2", lambda: 2 * gg_slope, 9.81, sf=3)
b("fig-graph-fits", f"{FG} figGraph axes", "whole line and tangent triangle fit inside the axes", lambda: gg_y(gg_xmax) <= gg_ymax and gg_y(gg_x2) <= gg_ymax and gg_line[1][0] <= gg_xmax)
b("fig-graph-points", f"{FG} figGraph points", "10 data dots at (t^2, s) from Table 1",
  lambda: len(gg_dots) == 10 and all(abs(x - t * t) < 6e-5 and abs(y - s) < 1e-9 for (x, y), t, s in zip(gg_dots, T1_t, T1_s)))
b("fig-graph-good9", f"{FG} figGraph points", "nine dots lie on the line within 0.01 m",
  lambda: sum(abs(y - gg_y(x)) < 0.01 for x, y in gg_dots) == 9)
v("fig-graph-anom", f"{FG} figGraph anomaly label", "anomaly dot is (0.0697 s^2, 0.368 m)", lambda: gg_dots[4][1], 0.368, sf=3)
v("fig-graph-anom-x", f"{FG} figGraph anomaly label", "anomaly dot t^2 = 0.0697", lambda: gg_dots[4][0], 0.0697, sf=3)
v("fig-graph-anom-off", f"{FG} figGraph anomaly", "anomaly sits above the line (line gives 0.342 m)", lambda: gg_y(gg_dots[4][0]), 0.342, sf=3)

# ====================================================================
# Section 6 accuracy / uncertainty
# ====================================================================
v("pd-text", f"{SE} accuracy-uncertainty text", "10.20 - 9.81 = 0.39 m/s^2", lambda: 10.20 - 9.81, 0.39, sf=2)
v("pd-pct", f"{SE} accuracy-uncertainty / {EX} pct-diff / {Q} ff-fc-14", "0.39 / 9.81 x 100 = 4.0%", lambda: 0.39 / 9.81 * 100, 4.0, sf=2)
v("pd-pct-exact", f"{Q} definitions percentage difference / pp-h556-02-2023-q2", "(10.20 - 9.81)/9.81 = 4%", lambda: (10.20 - 9.81) / 9.81 * 100, 4, sf=1)
b("acc-9.2-vs-9.7", f"{SE} accuracy-uncertainty list", "(9.2 +/- 1.0) less accurate than (9.7 +/- 0.2): 9.2 further from 9.81", lambda: abs(9.2 - 9.81) > abs(9.7 - 9.81))
v("unc-t-g", f"{SE} accuracy-uncertainty / {Q} ff-fc-16", "2% in t -> 4% in g", lambda: 2 * 2, 4, sf=1)
v("unc-fc16", f"{Q} ff-fc-16", "3% in t -> 6% in g", lambda: 2 * 3, 6, sf=1)
v("unc-explain", f"{EX} pct-unc", "+/-0.01 s on 0.50 s is 2%", lambda: 0.01 / 0.50 * 100, 2, sf=1)
v("unc-double-explain", f"{EX} double-unc", "t 2% -> t^2 4%", lambda: 2 * 2, 4, sf=1)
v("accuracy-explain", f"{EX} accuracy", "9.7 more accurate than 9.0", lambda: abs(9.0 - 9.81) - abs(9.7 - 9.81), 0.7, sf=1)
v("fc04-diff", f"{Q} ff-fc-04 / {SE} g-varies", "9.816, 9.825, 9.776 (textbook values)", lambda: 9.825 - 9.776, 0.049, sf=2, note="table values only")

# ====================================================================
# Questions
# ====================================================================
# ff-r1
r1 = lambda: (10.6 - 9.81) / 9.81 * 100
v("r1-diff", f"{Q} ff-r1 modelAnswer", "10.6 - 9.81 = 0.79", lambda: 10.6 - 9.81, 0.79, sf=2)
v("r1-pct", f"{Q} ff-r1 modelAnswer", "0.79 / 9.81 x 100 = 8.05%", r1, 8.05, sf=3,
  alt=("0.79 rounded first", lambda: 0.79 / 9.81 * 100))
mcq("r1-mcq", f"{Q} ff-r1 options/correctIndex", "options 0.08/0.79/7.5/8, key D", r1, [0.08, 0.79, 7.5, 8], 3, dp=0,
    note="computed 8.05 rounds to 8 (0 dp)")
v("r1-C", f"{Q} ff-r1 commonMistakes", "C 7.5%: divides by 10.6", lambda: 0.79 / 10.6 * 100, 7.5, sf=2)
v("r1-A", f"{Q} ff-r1 commonMistakes", "A 0.08%: forgets x100 (0.79/9.81 = 0.0805)", lambda: (10.6 - 9.81) / 9.81, 0.08, sf=1)
v("r1-B", f"{Q} ff-r1 commonMistakes", "B 0.79: the difference", lambda: 10.6 - 9.81, 0.79, sf=2)

# ff-r2
r2_d = [abs(x - 9.81) for x in (10.3, 9.7, 9.4, 9.9)]
v("r2-A", f"{Q} ff-r2 modelAnswer", "A distance 0.49", lambda: r2_d[0], 0.49, sf=2)
v("r2-B", f"{Q} ff-r2 modelAnswer", "B distance 0.11", lambda: r2_d[1], 0.11, sf=2)
v("r2-C", f"{Q} ff-r2 modelAnswer", "C distance 0.41", lambda: r2_d[2], 0.41, sf=2)
v("r2-D", f"{Q} ff-r2 modelAnswer", "D distance 0.09", lambda: r2_d[3], 0.09, sf=2)
b("r2-key", f"{Q} ff-r2 correctIndex", "A (index 0) is furthest from 9.81", lambda: r2_d.index(max(r2_d)) == 0)
b("r2-C-biggest-unc", f"{Q} ff-r2 commonMistakes", "C has the biggest +/- value (0.9)", lambda: max([0.2, 0.1, 0.9, 0.6]) == 0.9)

# ff-r3
r3_g = lambda: 0.040 / (0.5 * (0.175 ** 2 - 0.150 ** 2))
v("r3-diff2", f"{Q} ff-r3 modelAnswer", "0.175^2 - 0.150^2 = 0.008125", lambda: 0.175 ** 2 - 0.150 ** 2, 0.008125, sf=4)
v("r3-2s", f"{Q} ff-r3 modelAnswer", "0.080 / 0.008125", r3_g, 9.846, sf=4)
v("r3-g", f"{Q} ff-r3 modelAnswer", "g = 9.8 m/s^2", r3_g, 9.8, sf=2)
mcq("r3-mcq", f"{Q} ff-r3 options/correctIndex", "2.6/4.9/9.1/9.8 key D", r3_g, [2.6, 4.9, 9.1, 9.8], 3, dp=1)
v("r3-B", f"{Q} ff-r3 commonMistakes", "B 4.9: forgets the 1/2", lambda: 0.040 / (0.175 ** 2 - 0.150 ** 2), 4.9, sf=2)
v("r3-C-speed", f"{Q} ff-r3 commonMistakes", "0.040 / 0.025 = 1.6 m/s", lambda: 0.040 / 0.025, 1.6, sf=2)
v("r3-C", f"{Q} ff-r3 commonMistakes", "C 9.1: 1.6 / 0.175", lambda: (0.040 / 0.025) / 0.175, 9.1, sf=2)
v("r3-A", f"{Q} ff-r3 commonMistakes", "A 2.6: s = 0.040 m, t = 0.175 s", lambda: g_from_s_t(0.040, 0.175), 2.6, sf=2)

# ff-r4
r4 = lambda: g_from_s_t(1.20, 0.502)
v("r4-t2", f"{Q} ff-r4(a) modelAnswer", "0.502^2 = 0.252", lambda: 0.502 ** 2, 0.252, sf=3)
v("r4-a", f"{Q} ff-r4(a) answer/modelAnswer", "g = 9.52 m/s^2", r4, 9.52, sf=3)
v("r4-a-step", f"{Q} ff-r4(a) modelAnswer", "2.40 / 0.252 = 9.52", lambda: 2.40 / 0.252, 9.52, sf=3)
w("r4-a-tol", f"{Q} ff-r4(a) answer", "9.52 +/- 1%", 9.52, 1, [("computed", r4)])
v("r4-a-ms", f"{Q} ff-r4(a) markScheme", "allow 9.5", r4, 9.5, sf=2)
v("r4-no2", f"{Q} ff-r4(a) commonMistakes", "forgetting the 2 gives 4.76", lambda: 1.20 / 0.502 ** 2, 4.76, sf=3)
v("r4-nosq", f"{Q} ff-r4(a) commonMistakes", "not squaring t gives 4.78", lambda: 2 * 1.20 / 0.502, 4.78, sf=3)
b("r4-b", f"{Q} ff-r4(b) stem", "9.52 < 9.81", lambda: r4() < 9.81)
b("r4-t-expected", f"{Q} ff-r4 stem", "ideal fall time of 1.20 m is 0.495 s, so 0.502 s is a plausible delayed time", lambda: 0.495 < 0.502 and abs(P.fall_time(1.20) - 0.4949) < 1e-3)

# ff-r5
r5a = lambda: P.suvat_v_from_s(0, G, 1.80)
v("r5a-v2", f"{Q} ff-r5(a) modelAnswer", "v^2 = 2 x 9.81 x 1.80 = 35.3", lambda: r5a() ** 2, 35.3, sf=3)
v("r5a", f"{Q} ff-r5(a) answer/modelAnswer", "v = 5.94 m/s", r5a, 5.94, sf=3)
w("r5a-tol", f"{Q} ff-r5(a) answer", "5.94 +/- 1.5%", 5.94, 1.5, [("computed", r5a)])
v("r5a-ms", f"{Q} ff-r5(a) markScheme", "allow 5.9", r5a, 5.9, sf=2)
v("r5a-g10", f"{Q} ff-r5(a) commonMistakes", "g = 10 gives 6.0", lambda: math.sqrt(2 * 10 * 1.80), 6.0, sf=2)
mean_t = lambda: (0.58 + 0.63 + 0.57) / 3
v("r5b-mean", f"{Q} ff-r5(b) modelAnswer", "mean t = 0.593 s", mean_t, 0.593, sf=3)
r5b = lambda: g_from_s_t(1.80, mean_t())
v("r5b-g", f"{Q} ff-r5(b) answer/modelAnswer", "g = 10.2 m/s^2", r5b, 10.2, sf=3)
w("r5b-tol", f"{Q} ff-r5(b) answer", "10.2 +/- 2%", 10.2, 2, [("computed", r5b)])
v("r5b-059", f"{Q} ff-r5(b) markScheme", "allow 10.3 from t = 0.59 s", lambda: g_from_s_t(1.80, 0.59), 10.3, sf=3)
v("r5b-06", f"{Q} ff-r5(b) commonMistakes", "rounding mean to 0.6 s gives 10.0", lambda: g_from_s_t(1.80, 0.6), 10.0, sf=3)

# ff-r6
r6g = lambda: 2.0 ** 2 / (2 * 0.200)
v("r6a", f"{Q} ff-r6(a) answer/modelAnswer", "g = 10.0 m/s^2", r6g, 10.0, sf=3)
v("r6a-nosq", f"{Q} ff-r6(a) commonMistakes", "not squaring v gives 5.0", lambda: 2.0 / (2 * 0.200), 5.0, sf=2)
pct = lambda: 2 * (0.1 / 2.0 * 100) + 0.002 / 0.200 * 100
v("r6b-pv", f"{Q} ff-r6(b) modelAnswer", "0.1/2.0 = 5%", lambda: 0.1 / 2.0 * 100, 5, sf=1)
v("r6b-pd", f"{Q} ff-r6(b) modelAnswer", "0.002/0.200 = 1%", lambda: 0.002 / 0.200 * 100, 1, sf=1)
v("r6b-tot", f"{Q} ff-r6(b) modelAnswer", "total 11%", pct, 11, sf=2)
v("r6b-abs", f"{Q} ff-r6(b) answer/modelAnswer", "11% x 10.0 = 1.1", lambda: pct() / 100 * r6g(), 1.1, sf=2)
v("r6b-gmax", f"{Q} ff-r6(b) modelAnswer", "gmax = 2.1^2 / 0.396 = 11.14", lambda: 2.1 ** 2 / (2 * 0.198), 11.14, sf=4)
v("r6b-gmin", f"{Q} ff-r6(b) modelAnswer", "gmin = 1.9^2 / 0.404 = 8.94", lambda: 1.9 ** 2 / (2 * 0.202), 8.94, sf=3)
v("r6b-half", f"{Q} ff-r6(b) modelAnswer", "half the range = 1.1", lambda: (2.1 ** 2 / 0.396 - 1.9 ** 2 / 0.404) / 2, 1.1, sf=2)
w("r6b-tol", f"{Q} ff-r6(b) answer", "1.1 +/- 5%", 1.1, 5, [("percentage method", lambda: pct() / 100 * r6g()), ("range method", lambda: (2.1 ** 2 / 0.396 - 1.9 ** 2 / 0.404) / 2)])

# ff-r7
v("r7a", f"{Q} ff-r7(a) answer/modelAnswer", "0.452^2 = 0.204 s^2", lambda: 0.452 ** 2, 0.204, sf=3)
w("r7a-tol", f"{Q} ff-r7(a) answer", "0.204 +/- 0.3%", 0.204, 0.3, [("computed", lambda: 0.452 ** 2)], note="0.204304 is +0.15%")
r7_grad = lambda: (0.229 - 0.062) / (1.10 - 0.30)
v("r7b-dy", f"{Q} ff-r7(b) modelAnswer", "0.229 - 0.062 = 0.167", lambda: 0.229 - 0.062, 0.167, sf=3)
v("r7b-grad", f"{Q} ff-r7(b) modelAnswer/markScheme", "gradient 0.209 s^2/m", r7_grad, 0.209, sf=3)
r7_g = lambda: 2 / r7_grad()
v("r7b-g-written", f"{Q} ff-r7(b) modelAnswer", "g = 2 / 0.20875 = 9.58 (as written)", lambda: 2 / 0.20875, 9.58, sf=3)
v("r7b-g-rounded", f"{Q} ff-r7(b) modelAnswer", "2 / 0.209 gives 9.57", lambda: 2 / 0.209, 9.57, sf=3)
v("r7b-g", f"{Q} ff-r7(b) answer", "g = 9.58 m/s^2", r7_g, 9.58, sf=3)
w("r7b-tol", f"{Q} ff-r7(b) answer", "9.58 +/- 1.5%", 9.58, 1.5, [("unrounded gradient", r7_g), ("rounded gradient 0.209", lambda: 2 / 0.209)])
v("r7b-ms", f"{Q} ff-r7(b) markScheme", "g = 9.6 (allow 9.5-9.6)", r7_g, 9.6, sf=2)
b("r7b-origin", f"{Q} ff-r7 stem", "line through both points passes (near) the origin", lambda: abs(0.062 - r7_grad() * 0.30) < 0.002)

# ff-r8 / pastpaper g-with-gradient
b("r8-grad-range", f"{PP} pp-h156-02-2024-q3 explanation", "gradient 0.44-0.47 <-> g about 9.5", lambda: 0.44 < math.sqrt(2 / 9.5) < 0.47)
v("r8-grad", f"{PP} pp-h156-02-2024-q3", "g = 9.5 -> gradient sqrt(2/g)", lambda: math.sqrt(2 / 9.5), 0.459, sf=3)
b("pp-q3-g-in-tol", f"{PP} pp-h156-02-2024-q3 answers", "official g about 9.5 lies within 9.5 +/- 4% (trivial)", lambda: 9.5 * 0.96 <= 9.5 <= 9.5 * 1.04,
  note="official gradient range 0.44-0.47 gives g 9.05-10.33; a +/-4% window (9.12-9.88) would reject some marks-worthy student values")

# ====================================================================
# Past papers: stored answers vs official answers (Chapter 3 summary.md / MS)
# ====================================================================
mcq("pp-h556-02-2023-q2", f"{PP} pp-h556-02-2023-q2", "answer C = 4% (official C)", lambda: (10.20 - 9.81) / 9.81 * 100, [2, 3, 4, 5], 2, dp=0,
    note="options not shown in the book; official answer C and 4%; letter C cannot be re-derived without the paper's option list")
b("pp-h156-01-2019-q2", f"{PP} pp-h156-01-2019-q2", "answer A: (9.0+/-1.0) is furthest of 9.0,9.5,9.6,9.7 from 9.81",
  lambda: max(range(4), key=lambda i: abs([9.0, 9.5, 9.6, 9.7][i] - 9.81)) == 0)
pp_q4 = lambda: 0.050 / (0.5 * (0.14 ** 2 - 0.10 ** 2))
v("pp-h556-01-2024-q4", f"{PP} pp-h556-01-2024-q4", "official 5.0 cm, 0.10-0.14 s: g = 10.4 (answer C)", pp_q4, 10.4, sf=3)
pp22 = lambda: (1.4 ** 2 / (2 * 0.100)) * (2 * (0.1 / 1.4 * 100) + 0.002 / 0.100 * 100) / 100
v("pp-h156-01-2021n-q22", f"{PP} pp-h156-01-2021n-q22", "official 1.6 m/s^2 (d=0.100+/-0.002, v=1.4+/-0.1)", pp22, 1.6, sf=2)
w("pp-q22-tol", f"{PP} pp-h156-01-2021n-q22", "1.6 +/- 4%", 1.6, 4, [("percentage method", pp22), ("range method 11.48/8.28", lambda: (11.48 - 8.28) / 2)])
pp24b = lambda: P.suvat_v_from_s(0, G, 2.0)
v("pp-24b", f"{PP} pp-h156-01-2024-q24", "(b) 6.3 m/s from 2.0 m", pp24b, 6.3, sf=2)
w("pp-24b-tol", f"{PP} pp-h156-01-2024-q24", "6.3 +/- 2%", 6.3, 2, [("computed", pp24b)])
pp24c = lambda: g_from_s_t(2.0, 0.63)
v("pp-24c", f"{PP} pp-h156-01-2024-q24", "(c) 10.1 m/s^2 (mean 0.63 s)", pp24c, 10.1, sf=3)
w("pp-24c-tol", f"{PP} pp-h156-01-2024-q24", "10.1 +/- 2%", 10.1, 2, [("official 0.63", pp24c), ("allow 9.97", 9.97), ("allow 10", 10.0)])
b("pp-24-marks", f"{PP} pp-h156-01-2024-q24", "marks: 10 for Q24(b)-(e) = 13 total - 3 for (a)", lambda: 3 + 3 + 2 + 2 == 10 and 'question: "Q24(b)–(e)",\n      marks: 10,' in src(Q),
  note="MS: (a) 3, (b) 3, (c) 3, (d) 2, (e) 2, Total 13; QP labels the speed part (b) (the MS's '(b)(ii)' is a layout quirk)")
mcq("pp-h556-01-2017-q4", f"{PP} pp-h556-01-2017-q4", "answer A: h against v^2 is straight through origin (MS A)", lambda: 0, [0, 1, 2, 3], 0, dp=0,
    note="graph-shape MCQ; official A confirmed from the mark scheme")

# ====================================================================
# Flashcard numerics
# ====================================================================
v("fc07", f"{Q} ff-fc-07", "0.856 m in 0.421 s gives 9.66", lambda: g_from_s_t(0.856, 0.421), 9.66, sf=3)
v("fc14", f"{Q} ff-fc-14", "10.20 vs 9.81 gives 4%", lambda: (10.20 - 9.81) / 9.81 * 100, 4, sf=1)
v("fc03", f"{Q} ff-fc-03", "a = mg / m = g", lambda: (2 * G) / 2, G, sf=3)
v("fc11-reaction", f"{Q} ff-fc-11", "0.2 s of 0.45 s is a big share (44%)", lambda: 0.2 / 0.45 * 100, 44, sf=2)

CLAIMS = C
