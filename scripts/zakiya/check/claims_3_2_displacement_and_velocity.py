"""Numerical claims in the 3.2 Displacement and velocity guide, recomputed independently.

Same record kinds as claims_3_8.py. Run:
  python run_checks.py --claims claims_3_2_displacement_and_velocity
Physics comes from physics.py (free fall s = 1/2 g t^2, v = g t); plain arithmetic (d / t, gradients,
unit conversions, geometry) is written inline.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
Q = "content/zakiya/module3/3-2-displacement-and-velocity.ts"
S = "content/zakiya/module3/3-2/sections.ts"
F = "content/zakiya/module3/3-2/figures.ts"
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


# ====================================================================
# Section: distance vs displacement (Missy Franklin, textbook p. 24)
# ====================================================================
swim = lambda: 100 / 58.33
v("pool-speed", f"{S} distance-vs-displacement list; {F} figPool", "100 / 58.33 = 1.71 m/s", swim, 1.71, sf=3)
v("pool-vel", f"{S} distance-vs-displacement list; {F} figPool", "0 / 58.33 = 0 m/s", lambda: 0 / 58.33, 0, dp=0)
b("pool-lengths", f"{F} figPool", "2 x 50 m = 100 m", lambda: 2 * 50 == 100)
v("fc06-speed", f"{Q} dv-fc-06", "100 / 58.33 = 1.71 m/s", swim, 1.71, sf=3)

# ====================================================================
# Section: average velocity (Harrogate to Leeds, textbook p. 24)
# ====================================================================
t_hl = lambda: 37 * 60
v("hl-t", f"{S} average-velocity worked; {F} figLeeds; {Q} dv-fc-07", "37 x 60 = 2220 s", t_hl, 2220, sf=4)
v("hl-24km", f"{S} average-velocity worked", "24 km = 24 000 m", lambda: 24 * 1000, 24000, sf=5)
v("hl-21km", f"{S} average-velocity worked", "21 km = 21 000 m", lambda: 21 * 1000, 21000, sf=5)
hl_speed = lambda: 24000 / 2220
v("hl-speed-2sf", f"{S} worked step (a); {F} figLeeds; {Q} dv-fc-07", "24 000 / 2220 = 11 m/s (2 s.f.)", hl_speed, 11, sf=2)
v("hl-speed-3sf", f"{S} worked step (a)", "24 000 / 2220 = 10.8", hl_speed, 10.8, sf=3)
hl_vel = lambda: 21000 / 2220
v("hl-vel-3sf", f"{S} worked step (b)", "21 000 / 2220 = 9.46", hl_vel, 9.46, sf=3)
v("hl-vel-2sf", f"{S} worked step (b); {F} figLeeds; {Q} dv-fc-07", "9.5 m/s due south", hl_vel, 9.5, sf=2)
b("hl-speed>=vel", f"{S} average-velocity tip", "|avg velocity| <= avg speed", lambda: hl_vel() <= hl_speed())
b("hl-roundtrip", f"{S} worked step (c)", "round trip delta s = 0 -> v = 0", lambda: (0 / 4440) == 0)
b("hl-roundtrip-speed", f"{S} worked step (c)", "round-trip avg speed still 11 m/s (48 000 / 4440)",
  lambda: round(48000 / 4440, 0) == 11)

# ====================================================================
# Section: s-t graphs (car, textbook p. 25-26, Figure 3)
# ====================================================================
v("car-intro", f"{S} st-graphs text", "120 m in 20 s = 6.0 m/s", lambda: 120 / 20, 6.0, sf=2)
v("car-v10", f"{S} st-graphs worked; {F} figCar", "(120-0)/(20-0) = 6.0 m/s", lambda: (120 - 0) / (20 - 0), 6.0, sf=2)
v("car-v40", f"{S} st-graphs worked; {F} figCar", "(0-120)/(60-30) = -4.0 m/s", lambda: (0 - 120) / (60 - 30), -4.0, sf=2)
v("car-v40-b", f"{S} st-graphs worked", "-120 / 30 = -4.0", lambda: -120 / 30, -4.0, sf=2)
# figCar pixel geometry: x px = 50 + 4.5 t, y px = 200 - s
b("car-fig-px", f"{F} figCar polyline M50,200 L140,80 L185,80 L320,200",
  "pixels map to (0,0),(20,120),(30,120),(60,0)",
  lambda: [(50 + 4.5 * t, 200 - s) for t, s in [(0, 0), (20, 120), (30, 120), (60, 0)]] == [(50, 200), (140, 80), (185, 80), (320, 200)])
b("car-fig-ticks", f"{F} figCar axes ticks", "x ticks 50..320 step 45 = 0..60 s; y 50 px per 50 m",
  lambda: [50 + 4.5 * t for t in (0, 10, 20, 30, 40, 50, 60)] == [50, 95, 140, 185, 230, 275, 320])

# ====================================================================
# Section: tangents (cyclist, ours): s = 0.75 t^2 (consistent with s(4) = 12, tangent through (2,0))
# ====================================================================
cyc_s = lambda t: 0.75 * t * t
v("cyc-avg-text", f"{S} tangents text", "12 / 4 = 3.0 m/s average", lambda: 12 / 4, 3.0, sf=2)
v("cyc-tan", f"{S} tangents worked; {F} figTangent", "24 / 4.0 = 6.0 m/s", lambda: (24 - 0) / (6.0 - 2.0), 6.0, sf=2)
v("cyc-chord", f"{S} tangents worked; {F} figTangent", "12 / 4.0 = 3.0 m/s", lambda: 12 / 4.0, 3.0, sf=2)
v("cyc-ratio", f"{S} tangents worked", "velocity at 4.0 s is twice the average", lambda: 6.0 / 3.0, 2.0, sf=2)
b("cyc-curve-s4", f"{F} figTangent polyline", "curve passes through (t=4 s, s=12 m): pixel (230,140)",
  lambda: (50 + 45 * 4, 200 - 5 * cyc_s(4)) == (230, 140))
b("cyc-tangent-touch", f"{F} figTangent", "tangent (2,0)->(6,24) has slope 6 = ds/dt of 0.75t^2 at t=4 and passes through (4,12)",
  lambda: abs(2 * 0.75 * 4 - 6) < 1e-9 and abs(12 + 6 * (2 - 4)) < 1e-9)
b("cyc-tangent-px", f"{F} figTangent tangent line 140,200 -> 320,80", "= (2 s,0) -> (6 s,24 m)",
  lambda: [(50 + 45 * 2, 200 - 5 * 0), (50 + 45 * 6, 200 - 5 * 24)] == [(140, 200), (320, 80)])
b("cyc-polyline", f"{F} figTangent polyline points", "13 points follow s = 0.75 t^2 (t every 0.5 s)",
  lambda: all(abs((50 + 45 * t) - x) < 0.06 and abs((200 - 5 * cyc_s(t)) - y) < 0.06 for t, x, y in zip(
      [i * 0.5 for i in range(13)],
      [50, 72.5, 95, 117.5, 140, 162.5, 185, 207.5, 230, 252.5, 275, 297.5, 320],
      [200, 199.1, 196.2, 191.6, 185, 176.6, 166.2, 154.1, 140, 124.1, 106.2, 86.6, 65])))

# ====================================================================
# Section: velocity is a vector (bounce, ours)
# ====================================================================
v("bounce-dv", f"{S} equation; {F} figBounce; {Q} dv-fc-14", "(-3.0) - (+5.0) = -8.0 m/s", lambda: (-3.0) - (+5.0), -8.0, sf=2)
v("bounce-speed-change", f"{S} text; {F} figBounce", "speed only dropped by 2.0", lambda: 5.0 - 3.0, 2.0, sf=2)
v("bounce-add", f"{S} equation note", "5.0 + 3.0 = 8.0", lambda: 5.0 + 3.0, 8.0, sf=2)
v("bounce-fc14", f"{Q} dv-fc-14", "size of change = 8.0", lambda: abs(-3.0 - 5.0), 8.0, sf=2)
v("june19-add", f"{S} examiners (June 2019 Q22(d))", "4.9 + 3.5 = 8.4 m/s", lambda: 4.9 + 3.5, 8.4, sf=2)
v("june19-force-wrong", f"{S} examiners (June 2019 Q22(d))", "44 N from 4.9 - 3.5 (m = 56 g, t = 1.8 ms)",
  lambda: 0.056 * (4.9 - 3.5) / 0.0018, 44, sf=2)
v("june19-force-right", f"{S} examiners (June 2019 Q22(d))", "260 N from 8.4", lambda: 0.056 * 8.4 / 0.0018, 260, sf=2)

# ====================================================================
# Questions
# ====================================================================
# dv-r1 / dv-r2: non-numeric
u("r1-mcq", f"{Q} dv-r1", "scalar/vector table key C (temperature/weight)", "non-numeric: temperature scalar, weight (a force) vector; A,B,D each contain a wrong entry. Checked by reading.")
u("r2-mcq", f"{Q} dv-r2", "all scalars key C (distance, power, work)", "non-numeric: A has displacement, B momentum, D force. Checked by reading.")

# dv-r3 segments (figSegments px: x = 50 + 30 t, y = 200 - 12.5 s)
seg = [(0, 0), (2, 4), (4, 4), (5, 10), (9, 0)]
b("r3-fig-px", f"{F} figSegments path M50,200 L110,150 L170,150 L200,75 L320,200", "vertices (0,0),(2,4),(4,4),(5,10),(9,0)",
  lambda: [(50 + 30 * t, 200 - 12.5 * s) for t, s in seg] == [(50, 200), (110, 150), (170, 150), (200, 75), (320, 200)])
r3_speeds = lambda: [abs(seg[i + 1][1] - seg[i][1]) / (seg[i + 1][0] - seg[i][0]) for i in range(4)]
v("r3-A", f"{Q} dv-r3 modelAnswer", "A: 4 / 2 = 2.0 m/s", lambda: r3_speeds()[0], 2.0, sf=2)
v("r3-B", f"{Q} dv-r3 modelAnswer", "B: 0", lambda: r3_speeds()[1], 0, dp=0)
v("r3-C", f"{Q} dv-r3 modelAnswer", "C: 6 / 1 = 6.0 m/s", lambda: r3_speeds()[2], 6.0, sf=2)
v("r3-D", f"{Q} dv-r3 modelAnswer", "D: 10 / 4 = 2.5 m/s", lambda: r3_speeds()[3], 2.5, sf=2)
b("r3-key", f"{Q} dv-r3 correctIndex 2 (C)", "C is the steepest section", lambda: r3_speeds().index(max(r3_speeds())) == 2)
b("r3-alt-text", f"{F} figSegments alt", "alt text: A 0-4 m 0-2 s; C 4-10 m 4-5 s; D 10-0 m 5-9 s", lambda: seg[1] == (2, 4) and seg[3] == (5, 10) and seg[4] == (9, 0))

# dv-r4 half lap
r4_arc = lambda: math.pi * 30
r4_disp = lambda: 2 * 30
mcq("r4-mcq", f"{Q} dv-r4 options/correctIndex", "0 / 5.0 / 7.9 / 15.7, key B", lambda: r4_disp() / 12,
    [0, 5.0, 7.9, 15.7], 1, dp=1)
v("r4-disp", f"{Q} dv-r4 modelAnswer", "2 x 30 = 60 m", r4_disp, 60, sf=2)
v("r4-vel", f"{Q} dv-r4 modelAnswer", "60 / 12 = 5.0 m/s", lambda: r4_disp() / 12, 5.0, sf=2)
v("r4-arc", f"{Q} dv-r4 commonMistakes", "pi x 30 = 94.2 m", r4_arc, 94.2, sf=3)
v("r4-speed", f"{Q} dv-r4 commonMistakes (C 7.9)", "94.2 / 12 = 7.9 m/s", lambda: r4_arc() / 12, 7.9, sf=2)
v("r4-circ", f"{Q} dv-r4 commonMistakes (D 15.7)", "2 pi x 30 / 12 = 15.7", lambda: 2 * math.pi * 30 / 12, 15.7, sf=3)

# dv-s1 cyclist
v("s1-t", f"{Q} dv-s1(a) modelAnswer", "25 x 60 = 1500 s", lambda: 25 * 60, 1500, sf=4)
s1a = lambda: 6300 / 1500
v("s1a", f"{Q} dv-s1(a) answer/modelAnswer", "6300 / 1500 = 4.2 m/s", s1a, 4.2, sf=2)
w("s1a-tol", f"{Q} dv-s1(a) answer", "4.2 +/- 2%", 4.2, 2, [("computed", s1a)])
s1b = lambda: 4500 / 1500
v("s1b", f"{Q} dv-s1(b) answer/modelAnswer", "4500 / 1500 = 3.0 m/s", s1b, 3.0, sf=2)
w("s1b-tol", f"{Q} dv-s1(b) answer", "3.0 +/- 2%", 3.0, 2, [("computed", s1b)])
v("s1c", f"{Q} dv-s1(c)", "round trip average velocity 0", lambda: (0) / 3000, 0, dp=0)
b("s1c-speed", f"{Q} dv-s1(c) commonMistakes", "round-trip average speed unchanged at 4.2 m/s", lambda: abs(12600 / 3000 - 4.2) < 1e-9)
b("s1-km-min", f"{Q} dv-s1(a) commonMistakes", "6.3 km / 25 min nonsense 'km per minute' conversions: 25 min = 0.4167 h not 0.25",
  lambda: abs(25 / 60 - 0.4167) < 1e-4)

# dv-s2 trolley (figTrolley px: x = 50 + 225 t, y = 200 - 125 s)
tr_s = lambda s: 200 - 125 * s
v("s2a", f"{Q} dv-s2(a) modelAnswer/markScheme", "0.60 / 0.40 = 1.5 m/s", lambda: 0.60 / 0.40, 1.5, sf=2)
b("s2-fig-straight", f"{F} figTrolley polyline start 50,200 -> 140,125", "straight section (0,0)->(0.40 s, 0.60 m)",
  lambda: (50 + 225 * 0.40, tr_s(0.60)) == (140, 125))
b("s2-fig-1.05", f"{F} figTrolley polyline: 1.05 m at 1.0 s", "pixel (275, 68.75~68.8)",
  lambda: (50 + 225 * 1.0, round(tr_s(1.05), 1)) == (275, 68.8))
b("s2-fig-end", f"{F} figTrolley end 320,68.8", "flat to 1.2 s", lambda: 50 + 225 * 1.2 == 320)
b("s2-fig-axis", f"{F} figTrolley y ticks 0/0.3/0.6/0.9/1.2 -> 200/162.5/125/87.5/50", "125 px per metre",
  lambda: [tr_s(s) for s in (0, 0.3, 0.6, 0.9, 1.2)] == [200, 162.5, 125, 87.5, 50])
s2c = lambda: 1.05 / 1.2
v("s2c", f"{Q} dv-s2(c) answer/modelAnswer", "1.05 / 1.2 = 0.875 -> 0.88 m/s", s2c, 0.875, sf=3)
v("s2c-2dp", f"{Q} dv-s2(c) modelAnswer", "0.88 m/s", s2c, 0.88, dp=2, note="0.875 rounds half-up to 0.88")
w("s2c-tol", f"{Q} dv-s2(c) answer", "0.875 +/- 3% includes allow 0.87-0.88", 0.875, 3, [("0.87", 0.87), ("0.88", 0.88), ("computed", s2c)])
v("s2c-mistake", f"{Q} dv-s2(c) commonMistakes", "(1.5 + 0)/2 = 0.75", lambda: (1.5 + 0) / 2, 0.75, sf=2)
b("s2-curve-slope", f"{F} figTrolley", "curve starts with gradient (1.5 m/s) continuous with straight section: first segment slope 9px/11.2px*(0.5556)",
  lambda: abs((125 - 116) / 11.2 * (225 / 125) - 1.5) < 0.2, note="visual continuity only")

# dv-s3 dropped ball, s = 1/2 g t^2
drop_s = lambda t: 0.5 * G * t * t
drop_v = lambda t: G * t
v("s3-s", f"{Q} dv-s3 commonMistakes / figDrop alt", "s at 0.40 s = 0.785 m", lambda: P.suvat_s(0, G, 0.40), 0.785, sf=3)
v("s3-v", f"{Q} dv-s3(a) modelAnswer", "9.81 x 0.40 = 3.92 m/s", lambda: P.suvat_v(0, G, 0.40), 3.92, sf=3)
tan_pts = lambda: ((0.20, drop_s(0.40) + drop_v(0.40) * (0.20 - 0.40)), (0.60, drop_s(0.40) + drop_v(0.40) * (0.60 - 0.40)))
v("s3-tan-lo", f"{Q} dv-s3(a) modelAnswer", "tangent passes (0.20 s, 0 m)", lambda: tan_pts()[0][1], 0, dp=1)
v("s3-tan-hi", f"{Q} dv-s3(a) modelAnswer", "tangent passes (0.60 s, 1.57 m)", lambda: tan_pts()[1][1], 1.57, sf=3)
s3a = lambda: 1.57 / 0.40
v("s3a", f"{Q} dv-s3(a) answer/modelAnswer", "1.57 / 0.40 = 3.9 m/s", s3a, 3.9, sf=2)
w("s3a-tol", f"{Q} dv-s3(a) answer / markScheme", "3.9 +/- 6% covers 3.7-4.1 and exact 3.92", 3.9, 6,
  [("3.7", 3.7), ("4.1", 4.1), ("exact", lambda: drop_v(0.40))])
s3b = lambda: 0.785 / 0.40
v("s3b", f"{Q} dv-s3(b) answer/modelAnswer", "0.785 / 0.40 = 1.96 m/s", s3b, 1.96, sf=3)
v("s3b-ms", f"{Q} dv-s3(b) markScheme", "0.785 / 0.40 = 2.0", s3b, 2.0, sf=2)
w("s3b-tol", f"{Q} dv-s3(b) answer / markScheme", "1.96 +/- 3.5% covers allow 1.9-2.0", 1.96, 3.5, [("1.9", 1.9), ("2.0", 2.0), ("exact", lambda: drop_s(0.40) / 0.40)])
b("s3b-less", f"{Q} dv-s3(b)", "average (1.96) is half the final velocity (3.92)", lambda: abs(drop_s(0.40) / 0.40 * 2 - drop_v(0.40)) < 1e-9)
v("s3c", f"{Q} dv-s3(c) answer/modelAnswer", "-2.8 - 3.92 = -6.72 -> 6.7 m/s", lambda: abs(-2.8 - drop_v(0.40)), 6.7, sf=2)
w("s3c-tol", f"{Q} dv-s3(c) answer", "6.7 +/- 3%", 6.7, 3, [("computed", lambda: abs(-2.8 - drop_v(0.40))), ("ECF 3.9+2.8", lambda: 3.9 + 2.8)])
v("s3c-mistake", f"{Q} dv-s3(c) commonMistakes", "3.9 - 2.8 = 1.1", lambda: 3.9 - 2.8, 1.1, sf=2)
b("s3-fig-P", f"{F} figDrop point P", "pixel (266, 105.8) = (0.40 s, 0.785 m): x = 50 + 540 t, y = 200 - 120 s",
  lambda: (50 + 540 * 0.40, round(200 - 120 * drop_s(0.40), 1)) == (266, 105.8))
b("s3-fig-end", f"{F} figDrop end (320, 52.8); alt text 'about 1.23 m at 0.5 s'", "s(0.5) = 1.226 m",
  lambda: abs(drop_s(0.5) - 1.23) < 0.005 and abs((200 - 120 * drop_s(0.5)) - 52.8) < 0.15)
b("s3-fig-polyline", f"{F} figDrop polyline (21 points every 0.025 s)", "points follow y = 200 - 120 * 4.905 t^2",
  lambda: all(abs((50 + 540 * t) - x) < 0.06 and abs((200 - 120 * drop_s(t)) - y) < 0.06 for t, x, y in zip(
      [i * 0.025 for i in range(21)],
      [50, 63.5, 77, 90.5, 104, 117.5, 131, 144.5, 158, 171.5, 185, 198.5, 212, 225.5, 239, 252.5, 266, 279.5, 293, 306.5, 320],
      [200, 199.6, 198.5, 196.7, 194.1, 190.8, 186.8, 182, 176.5, 170.2, 163.2, 155.5, 147, 137.8, 127.9, 117.2, 105.8, 93.7, 80.8, 67.2, 52.8])))

# ====================================================================
# Past papers: answers vs official (summary.md section 8 / mark schemes via show_source.sh --ms)
# ====================================================================
u("pp-2018-q2", f"{Q} pp-h556-01-2018-q2", "answer B (energy, mass, power)", "MCQ key; official summary.md: B. Matches.")
u("pp-2022-q1", f"{Q} pp-h556-01-2022-q1", "answer D (mass / centripetal force)", "MCQ key; mark scheme image (p10) row 1 = D. Matches.")
u("pp-h156-2018-q1", f"{Q} pp-h156-01-2018-q1", "answer B", "MCQ key; summary.md: B. Matches.")
u("pp-2021n-q1", f"{Q} pp-h556-01-2021n-q1", "answer C", "MCQ key; summary.md: C. Matches.")
v("pp-2017-q21c", f"{Q} pp-h156-01-2017-q21 answer c", "official: s = 0.5 m, t = 0.5 s -> a = 4.0 m/s^2 (s = 1/2 a t^2)", lambda: 2 * 0.5 / 0.5 ** 2, 4.0, sf=2)
v("pp-2017-q21a", f"{Q} pp-h156-01-2017-q21 answer a", "official: KE of 900 g trolley at 2.0 m/s = 1.8 J", lambda: P.kinetic_energy(0.900, 2.0), 1.8, sf=2)
v("pp-2019-q22b", f"{Q} pp-h156-01-2019-q22 answer b", "official: v = sqrt(2 g s), s = 1.23 m -> 4.9 m/s", lambda: P.suvat_v_from_s(0, G, 1.23), 4.9, sf=2)
v("pp-2019-q22b-t", f"{Q} pp-h156-01-2019-q22 answer b", "official alt: v = g t, t = 0.50 s -> 4.9", lambda: G * 0.50, 4.9, sf=2)
w("pp-2019-q22c", f"{Q} pp-h156-01-2019-q22 answer c", "3.5 +/- 9% must cover official 3.20-3.80", 3.5, 9, [("3.20", 3.20), ("3.80", 3.80)])
v("pp-2019-q22d", f"{Q} pp-h156-01-2019-q22 answer d", "F = m dv / t = 0.056 x 8.4 / 1.8 ms = 260 N", lambda: 0.056 * (4.9 + 3.5) / 0.0018, 260, sf=2)
w("pp-2019-q22d-tol", f"{Q} pp-h156-01-2019-q22 answer d", "260 +/- 4% includes official 260 and computed 261", 260, 4,
  [("official", 260), ("computed", lambda: 0.056 * 8.4 / 0.0018)])

CLAIMS = C
