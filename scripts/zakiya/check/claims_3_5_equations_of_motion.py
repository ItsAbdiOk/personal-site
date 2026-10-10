"""Numerical claims in the 3.5 Equations of motion guide, each recomputed with physics.py (g = 9.81).

Same record kinds as claims_3_8.py. Run:
  python run_checks.py --claims claims_3_5_equations_of_motion
Plain arithmetic (differences, ratios, areas, gradients) is inline; physics goes through physics.py.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
Q = "content/zakiya/module3/3-5-equations-of-motion.ts"
S = "content/zakiya/module3/3-5/sections.ts"
F = "content/zakiya/module3/3-5/figures.ts"
EX = "content/zakiya/module3/3-5/explain.ts"
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


# ====================================================================
# Section 1: car from rest (textbook p. 33), figCar
# ====================================================================
car_a = lambda: (12 - 0) / 9.0
v("car-a", f"{S} choosing worked 1 / {F} figCar", "a = 12 / 9.0 = 1.33 m/s^2", car_a, 1.33, sf=3)
car_s = lambda: 0.5 * (0 + 12) * 9.0
v("car-s", f"{S} choosing worked 1 / {F} figCar", "s = 1/2 (0+12) 9.0 = 54 m", car_s, 54, sf=2)
v("car-s2", f"{S} choosing worked 1", "cross-check s = ut + 1/2 a t^2 with a = 12/9", lambda: P.suvat_s(0, 12 / 9.0, 9.0), 54, sf=2)
v("car-avg", f"{S} choosing worked 1 answer", "average speed 6 m/s", lambda: 54 / 9.0, 6, sf=1)
v("fc14-a", f"{Q} em-fc-14", "a = 12 / 9.0 = 1.33", car_a, 1.33, sf=3)
v("fc14-s", f"{Q} em-fc-14", "s = 54 m", car_s, 54, sf=2)

# ====================================================================
# Section 2: derivation graph / particle (textbook p. 33), figDerive
# ====================================================================
d_a = lambda: (12 - 4.0) / 2.0
v("d-gain", f"{S} where-from step 1", "gains 12 - 4.0 = 8.0 m/s", lambda: 12 - 4.0, 8.0, sf=2)
v("d-a", f"{S} where-from / {F} figDerive / {EX} gradient", "a = 8.0 / 2.0 = 4.0 m/s^2", d_a, 4.0, sf=2)
v("d-v", f"{S} where-from eq 1", "12 = 4.0 + 4.0 x 2.0", lambda: P.suvat_v(4.0, 4.0, 2.0), 12, sf=2)
v("d-rect", f"{S} where-from / {F} figDerive / {EX} ut", "ut = 4.0 x 2.0 = 8 m", lambda: 4.0 * 2.0, 8, sf=1)
v("d-tri", f"{S} where-from / {F} figDerive / {EX} half-v-u-t", "1/2 (v-u) t = 1/2 x 8.0 x 2.0 = 8 m", lambda: 0.5 * (12 - 4.0) * 2.0, 8, sf=1)
v("d-s", f"{S} where-from eq 2 / {F} figDerive", "16 = 4.0 x 2.0 + 1/2 x 4.0 x 2.0^2", lambda: P.suvat_s(4.0, 4.0, 2.0), 16, sf=2)
v("d-trap", f"{S} where-from step 3 / eq 3", "1/2 (4.0 + 12) x 2.0 = 16 m", lambda: 0.5 * (4.0 + 12) * 2.0, 16, sf=2)
v("d-avg", f"{S} where-from step 3 / {EX} average-velocity", "average velocity 8.0 m/s", lambda: 0.5 * (4.0 + 12), 8.0, sf=2)
b("d-eq4", f"{S} where-from step 4 / eq 4", "12^2 = 144 and 4.0^2 + 2 x 4.0 x 16 = 16 + 128 = 144",
  lambda: abs(12 ** 2 - 144) < 1e-9 and abs(4.0 ** 2 + 2 * 4.0 * 16 - 144) < 1e-9 and 4.0 ** 2 == 16 and 2 * 4.0 * 16 == 128)
b("d-sum", f"{S} where-from step 2", "total 8 + 8 = 16 m", lambda: 8 + 8 == 16)
b("d-fig-scale", f"{F} figDerive geometry", "y = 210 - 15 v: 4.0 -> 150, 12 -> 30; x 0..2 s -> 50..290",
  lambda: 210 - 15 * 4.0 == 150 and 210 - 15 * 12 == 30 and 50 + 120 * 2 == 290)
b("d-fig-rect", f"{F} figDerive geometry", "rect x50 y150 w240 h60 -> 4.0 x 2.0 tall/wide", lambda: 60 / 15 == 4.0 and 240 / 120 == 2.0)
b("d-fig-slope-px", f"{F} figDerive geometry", "line (50,150)->(290,30) slope = 8.0 m/s over 2.0 s", lambda: (150 - 30) / 15 / ((290 - 50) / 120) == 4.0)
v("d-par-a", f"{S} choosing worked 2", "a = (144 - 16) / 32 = 4.0", lambda: (12 ** 2 - 4.0 ** 2) / (2 * 16), 4.0, sf=2)
v("d-par-eq", f"{S} choosing worked 2", "144 = 16 + 32 a -> check v from a", lambda: P.suvat_v_from_s(4.0, 4.0, 16), 12, sf=2)
v("d-par-t", f"{S} choosing worked 2 answer", "the graph is this particle: it takes 2.0 s", lambda: (12 - 4.0) / 4.0, 2.0, sf=2)

# ====================================================================
# Section 3/5: apple (textbook p. 33-34), figApple
# ====================================================================
v("ap-t2", f"{S} falling worked", "t^2 = 2 x 1.50 / 9.81 = 0.306", lambda: 2 * 1.50 / G, 0.306, sf=3)
v("ap-t", f"{S} falling worked / {F} figApple / equation", "t = 0.553 s", lambda: P.fall_time(1.50), 0.553, sf=3)
v("ap-t-rounded", f"{S} falling worked", "sqrt(0.306) (rounded intermediate)", lambda: math.sqrt(0.306), 0.553, sf=3)

# ====================================================================
# Section 4: paper clip (textbook p. 34), figClip
# ====================================================================
clip_s = lambda: -(6.0 ** 2) / (2 * -G)
v("clip-num", f"{S} signs worked step 4", "36 / 19.62", lambda: 2 * G, 19.62, sf=4)
v("clip-s", f"{S} signs worked / {F} figClip / fc-13", "s = 36 / 19.62 = 1.83 m", clip_s, 1.83, sf=3)
v("clip-s2", f"{S} signs worked answer", "1.8 m to 2 s.f.", clip_s, 1.8, sf=2)
v("clip-s-lib", f"{S} signs worked", "cross-check via projectile() h_max for 6.0 m/s vertical", lambda: P.projectile(6.0, 90)["h_max"], 1.83, sf=3)
v("clip-neg", f"{S} signs warning", "a = +9.81 gives s = -1.83 m", lambda: (0 - 6.0 ** 2) / (2 * G), -1.83, sf=3)
v("fc13", f"{Q} em-fc-13", "0 = 6.0^2 + 2 x (-9.81) s -> 1.83 m", clip_s, 1.83, sf=3)
v("fc13-2sf", f"{Q} em-fc-13", "1.8 m to 2 s.f.", clip_s, 1.8, sf=2)
v("clip-loss", f"{EX} minus-g", "loses 9.81 m/s per second", lambda: P.suvat_v(6.0, -G, 1) - 6.0, -9.81, sf=3)

# Flashcard 16 and examiners block (2019 Q22(d))
v("fc16", f"{Q} em-fc-16", "5.0 + 3.0 = 8.0", lambda: 5.0 + 3.0, 8.0, sf=2)
v("ex-dv", f"{S} signs examiners", "4.9 + 3.5 = 8.4 m/s", lambda: 4.9 + 3.5, 8.4, sf=2)
v("ex-F", f"{S} signs examiners / official 2019 Q22(d)", "F = 260 N (0.056 x 8.4 / 1.8e-3)", lambda: 0.056 * (4.9 + 3.5) / 1.8e-3, 260, sf=2,
  note="m = 0.056 kg, dt = 1.8 ms from examiners report")
v("ex-F-wrong", f"{S} signs examiners / official", "44 N is the wrong answer (4.9 - 3.5)", lambda: 0.056 * (4.9 - 3.5) / 1.8e-3, 44, sf=2)

# ====================================================================
# Section 3: examiners / sayIt / warning numbers
# ====================================================================
v("sy-a", f"{S} choosing sayIt (2018 Q21(b)(i))", "a = (2.5^2 - 1.3^2) / (2 x 1.10) = 2.07 -> official 2.1", lambda: (2.5 ** 2 - 1.3 ** 2) / (2 * 1.10), 2.1, sf=2)
v("w-4.5", f"{S} falling warning", "released 4.5 m, 2.5 m above ground -> s = 2.0 m", lambda: 4.5 - 2.5, 2.0, sf=2)
v("w-v", f"{S} falling warning / official 2025 Q11", "speed = 6.3 m/s (official)", lambda: P.suvat_v_from_s(0, G, 2.0), 6.3, sf=2)
v("w-12.7", f"{S} falling warning / official 2019 Q18", "10.2 cm + 2.50 cm = 12.7 cm", lambda: 10.2 + 2.50, 12.7, sf=3)
v("w-t", f"{S} falling warning / official 2019 Q18", "t = 0.144 s for 0.102 m", lambda: P.fall_time(0.102), 0.144, sf=3)

# ====================================================================
# Questions
# ====================================================================
# em-r1: 6.0 m, 1.5 m above ground
r1 = lambda: P.suvat_v_from_s(0, G, 6.0 - 1.5)
v("r1-s", f"{Q} em-r1 modelAnswer", "fallen 6.0 - 1.5 = 4.5 m", lambda: 6.0 - 1.5, 4.5, sf=2)
v("r1-v2", f"{Q} em-r1 modelAnswer", "v^2 = 2 x 9.81 x 4.5 = 88.3", lambda: r1() ** 2, 88.3, sf=3)
v("r1-v", f"{Q} em-r1 modelAnswer", "v = 9.4 m/s", r1, 9.4, sf=2)
mcq("r1-mcq", f"{Q} em-r1 options/correctIndex", "options 5.4/9.4/10.8/88, key B", r1, [5.4, 9.4, 10.8, 88], 1, dp=1,
    note="D is 88 compared at dp=1 only via v^2 below")
v("r1-C", f"{Q} em-r1 commonMistakes", "C 10.8 = full 6.0 m", lambda: P.suvat_v_from_s(0, G, 6.0), 10.8, sf=3)
v("r1-A", f"{Q} em-r1 commonMistakes", "A 5.4 = 1.5 m fallen", lambda: P.suvat_v_from_s(0, G, 1.5), 5.4, sf=2)
v("r1-D", f"{Q} em-r1 commonMistakes / option D", "D 88 = forgot square root", lambda: r1() ** 2, 88, sf=2)

# em-r2: ball diameter 4.0 cm, bottom 15.0 cm above floor
r2 = lambda: P.fall_time(0.150)
v("r2-t", f"{Q} em-r2 modelAnswer", "t = sqrt(2 x 0.150 / 9.81) = 0.175 s", r2, 0.175, sf=3)
mcq("r2-mcq", f"{Q} em-r2 options/correctIndex", "options 0.124/0.175/0.186/0.197, key B", r2, [0.124, 0.175, 0.186, 0.197], 1, dp=3)
v("r2-D", f"{Q} em-r2 commonMistakes", "D 0.197 s: s = 0.190 m (15.0 + 4.0)", lambda: P.fall_time(0.150 + 0.040), 0.197, sf=3)
v("r2-D-s", f"{Q} em-r2 commonMistakes", "s = 0.190 m", lambda: 0.150 + 0.040, 0.190, sf=3)
v("r2-C", f"{Q} em-r2 commonMistakes", "C 0.186 s: centre height 0.170 m", lambda: P.fall_time(0.150 + 0.020), 0.186, sf=3)
v("r2-C-s", f"{Q} em-r2 commonMistakes", "centre height 0.170 m", lambda: 0.150 + 0.020, 0.170, sf=3)
v("r2-A", f"{Q} em-r2 commonMistakes", "A 0.124 s: forgot the 1/2", lambda: math.sqrt(0.150 / G), 0.124, sf=3)

# em-r3: 6.0 m in second second, from rest
r3_a = lambda: 6.0 / (0.5 * (2 ** 2 - 1 ** 2))
v("r3-a", f"{Q} em-r3 modelAnswer", "1.5 a = 6.0 -> a = 4.0", r3_a, 4.0, sf=2)
v("r3-1.5", f"{Q} em-r3 modelAnswer", "1/2 (2^2 - 1^2) = 1.5", lambda: 0.5 * (2 ** 2 - 1 ** 2), 1.5, sf=2)
r3_third = lambda: P.suvat_s(0, 4.0, 3.0) - P.suvat_s(0, 4.0, 2.0)
v("r3-third", f"{Q} em-r3 modelAnswer", "1/2 x 4.0 x (3^2 - 2^2) = 10 m", r3_third, 10, sf=2)
v("r3-second", f"{Q} em-r3 stem consistency", "second second distance with a = 4.0 is 6.0 m", lambda: P.suvat_s(0, 4.0, 2.0) - P.suvat_s(0, 4.0, 1.0), 6.0, sf=2)
mcq("r3-mcq", f"{Q} em-r3 options/correctIndex", "options 8.0/10/12/18, key B", r3_third, [8, 10, 12, 18], 1, dp=0)
v("r3-D", f"{Q} em-r3 commonMistakes", "D 18 m = total in 3.0 s", lambda: P.suvat_s(0, 4.0, 3.0), 18, sf=2)
v("r3-C", f"{Q} em-r3 commonMistakes", "C 12 m = doubling 6.0 m", lambda: 2 * 6.0, 12, sf=2)
b("r3-ratio", f"{Q} em-r3 commonMistakes", "successive seconds from rest go 1 : 3 : 5",
  lambda: [round(P.suvat_s(0, 4.0, n) - P.suvat_s(0, 4.0, n - 1), 9) / 2.0 for n in (1, 2, 3)] == [1, 3, 5])

# em-r4: X 0.80, Y 2.0, XY 0.90
r4_a = lambda: (2.0 ** 2 - 0.80 ** 2) / (2 * 0.90)
v("r4a-num", f"{Q} em-r4(a) modelAnswer", "4.00 - 0.64 = 3.36 / 1.80", lambda: 2.0 ** 2 - 0.80 ** 2, 3.36, sf=3)
v("r4a", f"{Q} em-r4(a) answer/modelAnswer", "a = 1.87 m/s^2", r4_a, 1.87, sf=3)
v("r4a-ms", f"{Q} em-r4(a) markScheme", "A1 a = 1.9 m/s^2", r4_a, 1.9, sf=2)
w("r4a-tol", f"{Q} em-r4(a) answer", "1.87 +/- 3%", 1.87, 3, [("computed", r4_a)])
v("r4a-lib", f"{Q} em-r4(a)", "cross-check: v from u, a, s", lambda: P.suvat_v_from_s(0.80, r4_a(), 0.90), 2.0, sf=2)
v("r4b-sin", f"{Q} em-r4(b) modelAnswer", "sin theta = 0.190", lambda: r4_a() / G, 0.190, sf=3)
r4_th = lambda: math.degrees(math.asin(r4_a() / G))
v("r4b", f"{Q} em-r4(b) answer/modelAnswer", "theta = 11 deg", r4_th, 11, sf=2)
w("r4b-tol", f"{Q} em-r4(b) answer", "11 +/- 5%", 11, 5, [("computed", r4_th)])
v("r4b-tan", f"{Q} em-r4(b) commonMistakes", "tan^-1(a/g) also gives 11 deg", lambda: math.degrees(math.atan(r4_a() / G)), 11, sf=2)
v("r4b-79", f"{Q} em-r4(b) markScheme/commonMistakes", "cos gives 79 deg", lambda: 90 - r4_th(), 79, sf=2)
r4_t = lambda: 2 * 0.90 / (0.80 + 2.0)
v("r4c-num", f"{Q} em-r4(c) modelAnswer", "t = 1.80 / 2.80", lambda: 2 * 0.90, 1.80, sf=3)
v("r4c", f"{Q} em-r4(c) answer/modelAnswer", "t = 0.643 s", r4_t, 0.643, sf=3)
v("r4c-ms", f"{Q} em-r4(c) markScheme/modelAnswer", "t = 0.64 s", r4_t, 0.64, sf=2)
w("r4c-tol", f"{Q} em-r4(c) answer", "0.643 +/- 3%", 0.643, 3, [("computed", r4_t)])
v("r4c-v", f"{Q} em-r4(c) markScheme (ECF route)", "v = u + at with a = 1.87 gives same t", lambda: (2.0 - 0.80) / r4_a(), 0.643, sf=3)
v("r4c-wrong", f"{Q} em-r4(c) commonMistakes", "0.90 / 2.0 = 0.45 s", lambda: 0.90 / 2.0, 0.45, sf=2)

# em-r5: lift from rest, a = 1.8, rise 6.0
r5_t = lambda: P.suvat_t_from_s(0, 1.8, 6.0)[-1]
r5_v = lambda: P.suvat_v_from_s(0, 1.8, 6.0)
v("r5a-t2", f"{Q} em-r5(a) modelAnswer/markScheme", "t^2 = 6.67", lambda: r5_t() ** 2, 6.67, sf=3)
v("r5a", f"{Q} em-r5(a) answer/modelAnswer", "t = 2.58 s", r5_t, 2.58, sf=3)
v("r5a-ms", f"{Q} em-r5(a) markScheme/modelAnswer", "A1 t = 2.6 s", r5_t, 2.6, sf=2)
w("r5a-tol", f"{Q} em-r5(a) answer", "2.58 +/- 2%", 2.58, 2, [("computed", r5_t)])
v("r5a-v2", f"{Q} em-r5(a) markScheme", "v^2 = 2 x 1.8 x 6.0 = 21.6", lambda: r5_v() ** 2, 21.6, sf=3)
v("r5a-9.81", f"{Q} em-r5(a) commonMistakes", "a = 9.81 gives t = 1.1 s", lambda: P.fall_time(6.0), 1.1, sf=2)
v("r5b", f"{Q} em-r5(b) answer/modelAnswer", "v = 4.65 m/s", r5_v, 4.65, sf=3)
v("r5b-t", f"{Q} em-r5(b) modelAnswer", "v = 1.8 x 2.58 = 4.6", lambda: P.suvat_v(0, 1.8, r5_t()), 4.6, sf=2)
w("r5b-tol", f"{Q} em-r5(b) answer", "4.65 +/- 2%", 4.65, 2, [("computed", r5_v)])
v("r5b-early", f"{Q} em-r5(b) commonMistakes", "rounding t to 2.6 gives 4.68", lambda: 1.8 * 2.6, 4.68, sf=3)
b("r5b-early-2sf", f"{Q} em-r5(b) commonMistakes", "early rounding gives 4.7 at 2 s.f., not 4.6",
  lambda: P.round_sf(1.8 * 2.6, 2) == 4.7 and P.round_sf(r5_v(), 2) == 4.6)

# em-r6: dropped 1.80 m, bounce at 4.0
r6_v = lambda: P.suvat_v_from_s(0, G, 1.80)
v("r6a-v2", f"{Q} em-r6(a) modelAnswer", "v^2 = 35.3", lambda: r6_v() ** 2, 35.3, sf=3)
v("r6a", f"{Q} em-r6(a) modelAnswer/markScheme", "v = 5.94 m/s", r6_v, 5.94, sf=3)
v("r6a-about", f"{Q} em-r6(a) prompt", "about 6 m/s", r6_v, 6, sf=1)
r6_dv = lambda: 4.0 + r6_v()
v("r6b", f"{Q} em-r6(b) answer/modelAnswer", "dv = 4.0 + 5.94 = 9.9 m/s", r6_dv, 9.9, sf=2)
w("r6b-tol", f"{Q} em-r6(b) answer", "9.9 +/- 2%", 9.9, 2, [("computed", r6_dv)])
v("r6b-wrong", f"{Q} em-r6(b) commonMistakes", "5.94 - 4.0 = 1.9", lambda: r6_v() - 4.0, 1.9, sf=2)

# em-r7: A 20 m/s constant; B from rest a = 2.0 for 12 s then constant
r7_vB = lambda: P.suvat_v(0, 2.0, 12)
r7_sB = lambda: P.suvat_s(0, 2.0, 12)
v("r7a-v", f"{Q} em-r7(a) modelAnswer/markScheme", "v = 24 m/s", r7_vB, 24, sf=2)
v("r7a-s", f"{Q} em-r7(b) answer/modelAnswer", "s = 144 m", r7_sB, 144, sf=3)
v("r7a-A", f"{Q} em-r7(a) modelAnswer", "car A at 240 m", lambda: 20 * 12, 240, sf=3)
v("r7a-wrong", f"{Q} em-r7(a) commonMistakes", "24 x 12 = 288", lambda: 24 * 12, 288, sf=3)
r7_t = lambda: (r7_sB() - 24 * 12) / (20 - 24)  # 144 + 24(t-12) = 20t
v("r7b", f"{Q} em-r7(c) answer/modelAnswer", "t = 36 s", r7_t, 36, sf=2)
v("r7b-A", f"{Q} em-r7(c) modelAnswer", "both at 720 m: A = 20 x 36", lambda: 20 * r7_t(), 720, sf=3)
v("r7b-B", f"{Q} em-r7(c) modelAnswer", "both at 720 m: B = 144 + 24 x 24", lambda: r7_sB() + r7_vB() * (r7_t() - 12), 720, sf=3)
b("r7b-sim", f"{Q} em-r7(c)", "brute-force: first t where B >= A is 36 s (B ahead before? A ahead until 36)",
  lambda: all(20 * t / 10 > (P.suvat_s(0, 2.0, t / 10) if t / 10 <= 12 else r7_sB() + 24 * (t / 10 - 12)) - 1e-9 for t in range(1, 360)),
  note="A ahead (or equal) for all 0.1..35.9 s")
b("r7b-gap", f"{Q} em-r7(c)", "at t=12 A (240) ahead of B (144) so B has not yet caught up in the accelerating stage", lambda: 240 > 144)

# em-r8: thrown up at 14 m/s
r8_s = lambda: P.projectile(14, 90)["h_max"]
v("r8a-num", f"{Q} em-r8(a) modelAnswer", "196 / 19.62", lambda: 14 ** 2, 196, sf=3)
v("r8a", f"{Q} em-r8(a) answer/modelAnswer", "s = 9.99 m (3 s.f.)", r8_s, 9.99, sf=3)
v("r8a-2sf", f"{Q} em-r8(a) markScheme", "A1 s = 10 m", r8_s, 10, sf=2)
w("r8a-tol", f"{Q} em-r8(a) answer", "9.99 +/- 2%", 9.99, 2, [("computed", r8_s)])
v("r8a-neg", f"{Q} em-r8(a) commonMistakes", "a = +9.81 gives -10 m", lambda: (0 - 14 ** 2) / (2 * G), -10, sf=2)
r8_v = lambda: P.suvat_v(14, -G, 2.0)
v("r8b", f"{Q} em-r8(b) answer/modelAnswer", "v = -5.62 m/s", r8_v, -5.62, sf=3)
v("r8b-2sf", f"{Q} em-r8(b) modelAnswer/markScheme", "-5.6 m/s", r8_v, -5.6, sf=2)
w("r8b-tol", f"{Q} em-r8(b) answer", "5.62 +/- 2% (magnitude; stored value is -5.62)", 5.62, 2, [("computed |v|", lambda: abs(r8_v()))])
v("r8b-top", f"{Q} em-r8(b) modelAnswer", "reaches top at 1.43 s", lambda: 14 / G, 1.43, sf=3)

# ====================================================================
# Past papers: answers vs official (summary.md / mark schemes)
# ====================================================================
v("pp-2016-q21", f"{Q} pp-h156-01-2016-q21 b(ii)", "t = sqrt(2 x 0.80 / 3.0) = 0.73 s (official)", lambda: math.sqrt(2 * 0.80 / 3.0), 0.73, sf=2)
v("pp-2018-q21-bi", f"{Q} pp-h156-01-2018-q21 b(i)", "a = 2.1 m/s^2 (official, 2.07)", lambda: (2.5 ** 2 - 1.3 ** 2) / (2 * 1.10), 2.1, sf=2)
v("pp-2018-q21-bii", f"{Q} pp-h156-01-2018-q21 b(ii)", "theta = 12 deg (official)", lambda: math.degrees(math.asin(((2.5 ** 2 - 1.3 ** 2) / (2 * 1.10)) / G)), 12, sf=2)
v("pp-2025-q21-bi", f"{Q} pp-h156-01-2025-q21 b(i)", "reading 870 N: m = 700/9.81, F = ma = 2.4 m, reading = 700 + 171", lambda: 700 + (700 / G) * 2.4, 870, sf=2,
  note="official 870 N; examiners report: 71.4 kg, 171.3 N")
v("pp-2025-q21-bii", f"{Q} pp-h156-01-2025-q21 b(ii)", "t = 2.7 s with a = 2.4, s = 8.5 m (MS typo '2 x 2.4 x 8')", lambda: P.suvat_t_from_s(0, 2.4, 8.5)[-1], 2.7, sf=2)
v("pp-2025-q11", f"{Q} pp-h156-01-2025-q11", "B = 6.3 m/s (official)", lambda: P.suvat_v_from_s(0, G, 4.5 - 2.5), 6.3, sf=2)
v("pp-2019-q18", f"{Q} pp-h156-01-2019-q18", "B = 0.144 s (official)", lambda: P.fall_time(0.102), 0.144, sf=3)
v("pp-2017-q12", f"{Q} pp-h556-01-2017-q12", "B = 0.25 m (official): 1/2 g (0.30^2 - 0.20^2)", lambda: 0.5 * G * (0.30 ** 2 - 0.20 ** 2), 0.25, sf=2)
u("pp-keys", f"{Q} pastPapers answers B,B,B", "MCQ keys 2025 Q11, 2019 Q18, H556 2017 Q12 = B",
  "keys read from summary.md official answers (B, B, B) - matched by eye; numbers recomputed above")
