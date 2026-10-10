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
b("f5-px", f"{F} figFig5", "points (130,120)=2.0 m/s at 1.0 s, (290,80)=3.0 m/s at 3.0 s at 80px/s, 40px/(m/s), origin (50,200)",
  lambda: (50 + 80 * 1.0 == 130 and 200 - 40 * 2.0 == 120 and 50 + 80 * 3.0 == 290 and 200 - 40 * 3.0 == 80))
v("tan-v4", f"{S} tangent / figTangent", "v(4)=4*4-0.25*16=12", lambda: 4 * 4 - 0.25 * 4 ** 2, 12, sf=2)
v("tan-grad", f"{S} tangent / figTangent", "gradient at 4 s of v=4t-0.25t^2 = 4-0.5*4 = 2.0", lambda: 4 - 0.5 * 4, 2.0, sf=2)
v("tan-rise", f"{S} tangent step", "24-4 = 20", lambda: 24 - 4, 20, sf=2)
v("tan-run", f"{S} tangent step", "10.0-0 = 10.0", lambda: 10.0 - 0, 10.0, sf=3)
v("tan-a", f"{S} tangent / figTangent", "20/10.0 = 2.0", lambda: acc(20, 10.0), 2.0, sf=2)
b("tan-line", f"{S} tangent question", "tangent through (4,12) gradient 2 passes (0,4) and (10,24)",
  lambda: 12 - 2 * 4 == 4 and 12 + 2 * 6 == 24)
b("tan-px", f"{F} figTangent", "origin(50,210) 24px/s 7px/(m/s): tangent (50,182)->(290,42), touch point (146,126)",
  lambda: (210 - 7 * 4 == 182 and 50 + 24 * 10 == 290 and 210 - 7 * 24 == 42 and 50 + 24 * 4 == 146 and 210 - 7 * 12 == 126))
_CURVE = [(50,210),(62,196.4),(74,183.8),(86,171.9),(98,161),(110,150.9),(122,141.8),(134,133.4),(146,126),(158,119.4),(170,113.8),(182,108.9),(194,105),(206,101.9),(218,99.8),(230,98.4),(242,98)]
b("tan-curve-pts", f"{F} figTangent", "all 17 plotted curve points (x=50+24t, y=210-7v) lie on v=4t-0.25t^2 (0.1 px)",
  lambda: all(abs((210 - 7 * (4 * ((x - 50) / 24) - 0.25 * ((x - 50) / 24) ** 2)) - y) < 0.1 for x, y in _CURVE))
v("avg-wrong", f"{S} warning / ac-r6 mistake", "12/4.0 = 3.0 (v/t off a curve) differs from 2.0", lambda: 12 / 4.0, 3.0, sf=2)

# ---------- Section 5: a-t graph ----------
b("at-px-scale", f"{F} figAT", "y-axis linear through 0: 2.0 at y=80 and 0.50 at y=170 (origin y=200)",
  lambda: abs((200 - 170) / 0.50 - (200 - 80) / 2.0) < 1e-6,
  note="60 px per m/s^2")

# ---------------- Questions ----------------
v("r4a", f"{Q} ac-r4 a", "12/20 = 0.60", lambda: acc(12 - 0, 20), 0.60, sf=2)
v("r4b-dt", f"{Q} ac-r4 b", "104-80 = 24", lambda: 104 - 80, 24, sf=2)
v("r4b", f"{Q} ac-r4 b", "-12/24 = -0.50", lambda: acc(-12, 24), -0.50, sf=2)
v("r4b-mistake", f"{Q} ac-r4 b commonMistakes", "12/104 = 0.115", lambda: 12 / 104, 0.115, sf=3)
b("r4-px", f"{F} figTram", "origin(50,190) 2.4px/s 10px/(m/s): corners (98,70),(242,70),(299.6,190)",
  lambda: (50 + 2.4 * 20 == 98 and 190 - 10 * 12 == 70 and 50 + 2.4 * 80 == 242 and abs(50 + 2.4 * 104 - 299.6) < 1e-9))
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
