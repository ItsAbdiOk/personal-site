"""Numerical claims in the 3.6 Car stopping distances guide, each recomputed.

Same record kinds as claims_3_8.py (value / bool / mcq / window / unchecked).
physics.py supplies SUVAT, kinetic energy and rounding. Plain arithmetic (d = v t, gradient, area,
unit conversion, u^2 / 2s) is written inline here. Ties such as 6.25 -> 6.3 use half-up (hu) because
Python's round() is banker's rounding.
Run: ~/.venvs/zakiya-anki/bin/python -B scripts/zakiya/check/run_checks.py --claims claims_3_6_car_stopping_distances
"""
import math
import os
import sys
from decimal import Decimal, ROUND_HALF_UP

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

Q = "content/zakiya/module3/3-6-car-stopping-distances.ts"
S = "content/zakiya/module3/3-6/sections.ts"
F = "content/zakiya/module3/3-6/figures.ts"
E = "content/zakiya/module3/3-6/explain.ts"

MILE = 1609.0


def mph(x):  # mph -> m/s using the guide's own conversion (1609 / 3600)
    return x * MILE / 3600.0


def hu_sf(x, sf):  # half-up to sf significant figures
    q = Decimal(10) ** (math.floor(math.log10(abs(x))) - sf + 1)
    return float(Decimal(repr(x)).quantize(q, rounding=ROUND_HALF_UP))


def decel(u, s):  # magnitude of a from v^2 = u^2 + 2as, v = 0 (cross-checked with physics.py below)
    a = u * u / (2 * s)
    assert abs(P.suvat_v_from_s(u, -a, s)) < 1e-6
    return a


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
# Highway Code table (Textbook p. 36 Table 1) as printed
# ====================================================================
TAB = [(20, 8.9, 6, 6, 12), (30, 13.4, 9, 14, 23), (40, 17.8, 12, 24, 36),
       (50, 22.2, 15, 38, 53), (60, 26.7, 18, 55, 73), (70, 31.1, 21, 75, 96)]

# ====================================================================
# Section 1 two-parts
# ====================================================================
v("s1-total", f"{S} two-parts text / equation / {F} figRoad", "9.0 m + 14.0 m = 23 m", lambda: 9.0 + 14.0, 23, sf=2)
v("s1-30mph", f"{S} two-parts / {E} speed / mph", "30 mph = 13.4 m/s", lambda: mph(30), 13.4, sf=3)
# s1-fivecars removed: five-car-lengths claim dropped from two-parts (book only says it of 21 m at 70 mph, kept in s2 extension)
# fig road scale: 23 m = 300 px, brake point x=137, start x=20
b("fig-road-scale", f"{F} svgRoad", "dashed lines x=20,137,320 for 0, 9.0, 23 m (300 px = 23 m)",
  lambda: abs(20 + 9.0 / 23 * 300 - 137) < 0.5 and abs(20 + 300 - 320) < 1e-9)

# ====================================================================
# Section 2 thinking
# ====================================================================
v("s2-rt", f"{S} thinking worked step 2 / {Q} sd-fc-05 / {F} figReaction", "9.0 / 13.4 = 0.67 s", lambda: 9.0 / 13.4, 0.67, sf=2)
v("s2-td30", f"{S} thinking text", "13.4 x 0.67 = 9.0 m", lambda: 13.4 * 0.67, 9.0, sf=2)
v("s2-td70", f"{S} thinking worked step 3 / {F} figReaction", "31.1 x 0.67 = 21 m", lambda: 31.1 * 0.67, 21, sf=2)
v("s2-ratio", f"{F} figReaction caption", "2.3 x the speed", lambda: 31.1 / 13.4, 2.3, sf=2)
v("s2-ratio-d", f"{F} figReaction caption", "2.3 x the thinking distance", lambda: 21 / 9.0, 2.3, sf=2)
b("fig-reaction-scale", f"{F} svgReaction", "row1 9.0 m = 120 px; row2 21 m = 280 px same scale",
  lambda: abs(120 / 9.0 - 280 / 21) < 0.1)
b("s2-double", f"{S} thinking text", "9 m at 13.4 m/s, 18 m at 26.7 m/s: double speed, double thinking",
  lambda: abs(26.7 / 13.4 - 2) < 0.02 and 18 == 2 * 9)
b("s2-tdprop", f"{S} thinking", "td = speed x reaction time is s = ut + 1/2 a t^2 with a = 0",
  lambda: abs(P.suvat_s(13.4, 0, 0.67) - 13.4 * 0.67) < 1e-12)

# ====================================================================
# Section 3 braking
# ====================================================================
a30 = lambda: decel(13.4, 14.0)
v("s3-a30", f"{S} braking worked 1 step 3 / {Q} sd-fc-09 / {F} figBraking", "a = -13.4^2 / (2 x 14.0) = -6.4 m/s^2", a30, 6.4, sf=2)
v("s3-179", f"{S} braking worked 1 step 3", "13.4^2 = 179.6", lambda: 13.4 ** 2, 179.6, dp=1)
v("s3-a30-via-1796", f"{S} braking worked 1 step 3", "179.6 / 28.0 = 6.4", lambda: 179.6 / 28.0, 6.4, sf=2)
a70 = lambda: decel(31.1, 75)
v("s3-967", f"{S} braking worked 2 (a)", "31.1^2 = 967.2", lambda: 31.1 ** 2, 967.2, dp=1)
v("s3-a70", f"{S} braking worked 2 (a)", "a = -967.2/150 = -6.4 m/s^2", a70, 6.4, sf=2)
v("s3-a70-3sf", f"{S} braking worked 2 (a)", "(6.45)", a70, 6.45, sf=3)
v("s3-t70", f"{S} braking worked 2 (b)", "t = (0 - 31.1)/(-6.45) = 4.8 s", lambda: -31.1 / -6.45, 4.8, sf=2,
  alt=("unrounded a", lambda: 31.1 / a70()))
b("s3-t70-suvat", f"{S} braking worked 2 (b)", "v = u + at gives v = 0 at t = 4.8 s", lambda: abs(P.suvat_v(31.1, -a70(), 4.82)) < 0.05)
b("s3-same-decel", f"{S} braking worked 2 answer", "same deceleration as 30 mph (both 6.4)",
  lambda: round(a30(), 1) == round(a70(), 1) == 6.4)
v("s3-x2", f"{S} braking text", "13.4 -> 26.7 about x2", lambda: 26.7 / 13.4, 2, sf=1)
v("s3-x4", f"{S} braking text", "14 -> 55 about x4", lambda: 55 / 14, 4, sf=1)
b("s3-sq", f"{S} braking text/warning", "doubling speed quadruples braking distance (s = u^2/2a)",
  lambda: abs((26.7 ** 2 / (2 * 6.4)) / (13.4 ** 2 / (2 * 6.4)) - 4) < 0.1)
b("s3-stop-2to4", f"{S} braking warning", "stopping distance goes up by more than 2x but less than 4x (13.4 -> 26.7: 23 -> 73)",
  lambda: 2 < 73 / 23 < 4)
b("fig-braking-s", f"{F} figBraking", "distance 14.0 m labelled, a = -6.4", lambda: abs(decel(13.4, 14.0) - 6.4) < 0.05)

# ====================================================================
# Section 4 table
# ====================================================================
for i, (mp, ms, th, br, st) in enumerate(TAB):
    b(f"tab-sum-{mp}", f"{S} table / {F} svgTable row {mp} mph", f"{th} + {br} = {st}", lambda th=th, br=br, st=st: th + br == st)
    v(f"tab-rt-{mp}", f"{S} table bullet 2", f"thinking / speed = 0.67 s ({mp} mph)", lambda th=th, ms=ms: th / ms, 0.67, dp=2,
      note="textbook rounded distances; claim is 'about 0.67'")
    v(f"tab-a-{mp}", f"{S} table bullet 3", f"u^2/2s in 6.4-6.6 ({mp} mph)", lambda ms=ms, br=br: ms ** 2 / (2 * br), 6.5, dp=1,
      note="claimed range 6.4-6.6; computed rounded to 1 dp must lie in range")
b("tab-a-range", f"{S} table bullet 3", "u^2/2s ~ 6.4-6.6 every time",
  lambda: all(6.35 <= ms ** 2 / (2 * br) <= 6.65 for _, ms, th, br, st in TAB))
b("tab-20eq", f"{S} table bullet 4", "at 20 mph thinking = braking (6, 6)", lambda: TAB[0][2] == TAB[0][3])
b("tab-70x3", f"{S} table bullet 4", "at 70 mph braking over 3x thinking (75/21)", lambda: TAB[5][3] / TAB[5][2] > 3)
v("tab-tip-30", f"{S} table tip", "30 x 1609 / 3600 = 13.4 m/s", lambda: mph(30), 13.4, sf=3)
v("tab-tip-60", f"{S} table tip", "method gives 26.8 for 60 mph", lambda: mph(60), 26.8, sf=3)
v("tab-tip-70", f"{S} table tip", "method gives 31.3 for 70 mph", lambda: mph(70), 31.3, sf=3,
  note="tip now says Table 1 prints 26.7 and 31.1 (book values)")
v("tab-mph-60", f"{Q} sd-r5 (a)", "60 mph = 26.8 m/s", lambda: mph(60), 26.8, sf=3,
  note="book Table 1 prints 26.7 for 60 mph; guide's own 1609/3600 gives 26.8 (ok, but differs from the table the same page shows)")
b("fig-table-ms", f"{F} figTable / alt text", "m/s column 8.9,13.4,17.8,22.2,26.7,31.1 and distances match Table 1",
  lambda: [r[1] for r in TAB] == [8.9, 13.4, 17.8, 22.2, 26.7, 31.1] and [r[4] for r in TAB] == [12, 23, 36, 53, 73, 96])
b("fig-table-width", f"{F} figTable", "longest bar 96 m x 2.1 px + x0 96 + label fits in 340 px", lambda: 96 + 96 * 2.1 + 5 + 30 <= 340,
  note="label '96 m' starts at x=302.6; needs ~30 px; verify visually")

# ====================================================================
# Section 5 v-t graph worked example (15 m/s, 0.60 s, 3.6 s)
# ====================================================================
v("s5-td", f"{S} vt-graph worked step 2 / {F} figVtWorked", "15 x 0.60 = 9.0 m", lambda: 15 * 0.60, 9.0, sf=2)
v("s5-tb", f"{S} vt-graph worked step 3", "3.6 - 0.60 = 3.0 s", lambda: 3.6 - 0.60, 3.0, sf=2)
v("s5-a", f"{S} vt-graph worked step 3 / {F} figVtWorked", "(0 - 15)/3.0 = -5.0", lambda: (0 - 15) / 3.0, -5.0, sf=2)
v("s5-db", f"{S} vt-graph worked step 4", "1/2 x 3.0 x 15 = 22.5 m", lambda: 0.5 * 3.0 * 15, 22.5, sf=3)
v("s5-ds", f"{S} vt-graph worked step 5", "9.0 + 22.5 = 31.5 m", lambda: 9.0 + 22.5, 31.5, sf=3)
b("s5-ds-32", f"{S} vt-graph worked answer", "31.5 m (about 32 m)", lambda: hu_sf(31.5, 2) == 32.0)
b("fig-vt-worked-key", f"{F} figVtWorked", "braking time 3.0 s, braking distance 22.5 m, decel 5.0, 0.60 s / 9.0 m",
  lambda: abs(0.5 * (3.6 - 0.6) * 15 - 22.5) < 1e-9 and abs(15 / 3.0 - 5.0) < 1e-9)
# how the graph changes (fig vtChanges + text + alt)
v("chg-tired", f"{F} figVtChanges alt", "tired: flat to 1.2 s, same slope, zero at 4.2 s", lambda: 1.2 + 15 / 5.0, 4.2, sf=2)
v("chg-wet", f"{F} figVtChanges alt", "wet: slope 3.0 m/s^2, zero at 5.6 s", lambda: 0.6 + 15 / 3.0, 5.6, sf=2)
v("chg-half", f"{F} figVtChanges alt/key", "half speed 7.5, same slope 5.0, zero at 2.1 s", lambda: 0.6 + 7.5 / 5.0, 2.1, sf=2)
b("chg-half-time", f"{S} vt-graph examiners", "same braking force -> same gradient -> braking time halves (3.0 -> 1.5 s)",
  lambda: abs(7.5 / 5.0 - (15 / 5.0) / 2) < 1e-12)
b("chg-ticks", f"{F} figVtChanges", "y tick 7.5 and 15 plotted at 8 px per m/s; x 34 px/s covers 0-7 s (<= 250 px axis)",
  lambda: 50 + 34 * 7 <= 300 and 50 + 34 * 5.6 < 300)

# ====================================================================
# Section 6 forces and energy (950 kg, 20 m/s, 6000 N)
# ====================================================================
KE = lambda: P.kinetic_energy(950, 20)
v("s6-ke", f"{S} forces-energy text / worked / {E} ke / {F} figEnergy", "1/2 x 950 x 20^2 = 190 000 J", KE, 190000, sf=3)
v("s6-d1", f"{S} forces-energy text/worked route 1", "190 000 / 6000 = 31.7 m", lambda: KE() / 6000, 31.7, sf=3)
v("s6-a", f"{S} forces-energy worked route 2", "a = 6000/950 = 6.316... m/s^2", lambda: 6000 / 950, 6.316, dp=3)
v("s6-d2", f"{S} forces-energy worked route 2", "20^2 / (2 x 6.316...) = 31.7 m", lambda: 20 ** 2 / (2 * 6000 / 950), 31.7, sf=3)
v("s6-d-2sf", f"{S} forces-energy worked answer", "31.7 m (32 m to 2 s.f.)", lambda: KE() / 6000, 32, sf=2)
v("s6-explain-work", f"{E} work", "6000 N x 31.7 m = 190 000 J", lambda: 6000 * 31.7, 190000, sf=3)
v("s6-per-metre", f"{S} forces-energy text", "6000 J every metre (6000 N x 1 m)", lambda: 6000 * 1, 6000, sf=4)
b("s6-same", f"{S} forces-energy equation note", "F d = 1/2 m v^2 agrees with F = ma then u^2/2a",
  lambda: abs(KE() / 6000 - 20 ** 2 / (2 * 6000 / 950)) < 1e-9)

# ====================================================================
# Section 7 practical
# ====================================================================
b("s7-dv", f"{S} practical equations / {Q} sd-fc-17 / sd-r7(a)", "d/v = t + v/2a: gradient 1/2a, intercept t",
  lambda: all(abs((v_ * 0.6 + v_ ** 2 / (2 * 6.25)) / v_ - (0.6 + v_ / (2 * 6.25))) < 1e-12 for v_ in (5, 10, 30)))
b("s7-card", f"{S} practical text", "10 cm card: speed = 0.10 m / time", lambda: abs(0.10 / 0.05 - 2.0) < 1e-12)

# ====================================================================
# Flashcards
# ====================================================================
v("fc05", f"{Q} sd-fc-05", "9.0 / 13.4 = 0.67 s", lambda: 9.0 / 13.4, 0.67, sf=2)
v("fc09", f"{Q} sd-fc-09", "13.4^2 / (2 x 14.0) = 6.4", lambda: decel(13.4, 14.0), 6.4, sf=2)
b("fc07", f"{Q} sd-fc-07", "double speed -> 4x braking distance", lambda: abs((2 * 13.4) ** 2 / 13.4 ** 2 - 4) < 1e-12)

# ====================================================================
# Questions
# ====================================================================
# sd-r1: flat until 0.60 s, to zero at 3.1 s, thinking distance 12 m
r1_u = lambda: 12 / 0.60
r1_brk = lambda: 0.5 * (3.1 - 0.60) * r1_u()
r1_stop = lambda: 12 + r1_brk()
v("r1-u", f"{Q} sd-r1 modelAnswer", "12 / 0.60 = 20 m/s", r1_u, 20, sf=2)
v("r1-brk", f"{Q} sd-r1 modelAnswer", "1/2 x 2.5 x 20 = 25 m", r1_brk, 25, sf=2)
v("r1-stop", f"{Q} sd-r1 modelAnswer", "12 + 25 = 37 m", r1_stop, 37, sf=2)
mcq("r1-mcq", f"{Q} sd-r1 options/correctIndex", "13/25/37/62, key C", r1_stop, [13, 25, 37, 62], 2, dp=0)
v("r1-A", f"{Q} sd-r1 commonMistakes", "A 13 m = braking minus thinking", lambda: r1_brk() - 12, 13, sf=2)
v("r1-D", f"{Q} sd-r1 commonMistakes", "D 62 m = 20 x 3.1", lambda: r1_u() * 3.1, 62, sf=2)
b("r1-fig", f"{Q} sd-r1 figure/alt", "tTicks 0,0.6,1,2,3.1 (tMax 3.5); thinking '12 m' label; u '?'",
  lambda: 0.6 < 1 < 2 < 3.1 < 3.5 and abs(1 - 0.6) / 3.5 * 270 > 20)

# sd-r2: 15.0 m/s, thinking 10.5, braking 18.0, stopping 28.5
r2_a = lambda: decel(15.0, 18.0)
b("r2-sum", f"{Q} sd-r2 stem", "10.5 + 18.0 = 28.5", lambda: abs(10.5 + 18.0 - 28.5) < 1e-12)
b("r2-rt", f"{Q} sd-r2 stem", "thinking 10.5 m at 15.0 m/s = 0.70 s (consistent)", lambda: abs(10.5 / 15.0 - 0.70) < 1e-12)
v("r2-a", f"{Q} sd-r2 modelAnswer", "15.0^2 / (2 x 18.0) = 225/36 = 6.25", r2_a, 6.25, sf=3)
b("r2-mcq", f"{Q} sd-r2 options/correctIndex", "0.83/3.9/6.3/12.5, key C (6.25 -> 6.3 half-up)",
  lambda: hu_sf(r2_a(), 2) == 6.3 and round(15 / 18, 2) == 0.83 and hu_sf(15.0 ** 2 / (2 * 28.5), 2) == 3.9 and abs(15.0 ** 2 / 18.0 - 12.5) < 1e-9)
b("r2-B", f"{Q} sd-r2 commonMistakes", "B 3.9 = 225/(2 x 28.5)", lambda: hu_sf(15.0 ** 2 / (2 * 28.5), 2) == 3.9)
b("r2-D", f"{Q} sd-r2 commonMistakes", "D 12.5 = forgets the 2", lambda: abs(15.0 ** 2 / 18.0 - 12.5) < 1e-9)
b("r2-A", f"{Q} sd-r2 commonMistakes", "A 0.83 = 15 / 18", lambda: round(15 / 18, 2) == 0.83)

# sd-r3: 12 m at 12 m/s -> at 30 m/s
r3 = lambda: 12 * (30 / 12) ** 2
v("r3-d", f"{Q} sd-r3 modelAnswer", "12 x 6.25 = 75 m", r3, 75, sf=2)
mcq("r3-mcq", f"{Q} sd-r3 options/correctIndex", "19/30/48/75, key D", r3, [19, 30, 48, 75], 3, dp=0)
v("r3-ratio", f"{Q} sd-r3 modelAnswer", "2.5^2 = 6.25", lambda: 2.5 ** 2, 6.25, sf=3)
v("r3-A", f"{Q} sd-r3 commonMistakes", "A 19 = 12 x sqrt(2.5)", lambda: 12 * math.sqrt(2.5), 19, sf=2)
v("r3-B", f"{Q} sd-r3 commonMistakes", "B 30 = 12 x 2.5", lambda: 12 * 2.5, 30, sf=2)
v("r3-C", f"{Q} sd-r3 commonMistakes", "C 48 = 12 x 4", lambda: 12 * 4, 48, sf=2)

# sd-r4: 1100 kg, 16 m/s, flat to 0.80 s, zero at 3.3 s
r4_tb = lambda: 3.3 - 0.80
r4_a = lambda: 16 / r4_tb()
r4_F = lambda: 1100 * r4_a()
r4_td = lambda: 16 * 0.80
r4_db = lambda: 0.5 * r4_tb() * 16
r4_ds = lambda: r4_td() + r4_db()
r4_W = lambda: r4_F() * r4_db()
v("r4a-tb", f"{Q} sd-r4(a) modelAnswer", "braking time 3.3 - 0.80 = 2.5 s", r4_tb, 2.5, sf=2)
v("r4a-a", f"{Q} sd-r4(a) modelAnswer/answer", "(0-16)/2.5 = -6.4", r4_a, 6.4, sf=2)
w("r4a-tol", f"{Q} sd-r4(a) answer", "6.4 m/s^2 +/- 2%", 6.4, 2, [("computed", r4_a)])
v("r4b-F", f"{Q} sd-r4(b) modelAnswer", "1100 x 6.4 = 7040 N", r4_F, 7040, sf=4)
v("r4b-F2", f"{Q} sd-r4(b) modelAnswer/markScheme", "(7.0 x 10^3 N) / B1 7000 N", r4_F, 7000, sf=2)
w("r4b-tol", f"{Q} sd-r4(b) answer", "7040 N +/- 2%", 7040, 2, [("computed", r4_F)])
v("r4c-td", f"{Q} sd-r4(c) modelAnswer", "16 x 0.80 = 12.8 m", r4_td, 12.8, sf=3)
v("r4c-db", f"{Q} sd-r4(c) modelAnswer", "1/2 x 2.5 x 16 = 20 m", r4_db, 20, sf=2)
v("r4c-ds", f"{Q} sd-r4(c) modelAnswer", "12.8 + 20 = 32.8 m", r4_ds, 32.8, sf=3)
v("r4c-ds2", f"{Q} sd-r4(c) modelAnswer/markScheme", "(33 m)", r4_ds, 33, sf=2)
w("r4c-tol", f"{Q} sd-r4(c) answer", "32.8 m +/- 2%", 32.8, 2, [("computed", r4_ds)])
v("r4c-wrong", f"{Q} sd-r4(c) commonMistakes", "1/2 x 3.3 x 16 (wrong base) = 26.4", lambda: 0.5 * 3.3 * 16, 26.4, sf=3,
  note="no value quoted in the guide; just checks the mistake gives a different value from 32.8")
v("r4d-W", f"{Q} sd-r4(d) modelAnswer", "7040 x 20 = 140 800 J (1.4 x 10^5)", r4_W, 140800, sf=6)
v("r4d-W2", f"{Q} sd-r4(d) modelAnswer", "1.4 x 10^5 J", r4_W, 1.4e5, sf=2)
v("r4d-KE", f"{Q} sd-r4(d) modelAnswer", "1/2 x 1100 x 16^2 = 140 800 J", lambda: P.kinetic_energy(1100, 16), 140800, sf=6)
w("r4d-tol", f"{Q} sd-r4(d) answer", "140 800 J +/- 3%", 140800, 3, [("computed", r4_W), ("KE route", lambda: P.kinetic_energy(1100, 16))])
v("r4d-wrong", f"{Q} sd-r4(d) markScheme", "7040 x 32.8 = 2.3 x 10^5 J", lambda: 7040 * 32.8, 2.3e5, sf=2)
b("r4-fig", f"{Q} sd-r4 figure", "vMax 20 with ticks 0,5,10,20 and u=16; tTicks 0,0.8,2,3.3 (tMax 3.6)",
  lambda: 0 < 0.8 < 2 < 3.3 < 3.6 and 16 < 20)
b("r4-fig-ticks", f"{Q} sd-r4 figure", "label '16' not overlapping tick '20' or '10' (>= 14 px)",
  lambda: min(abs(16 - 20), abs(16 - 10)) / 20 * 160 >= 14)

# sd-r5: 60 mph, 1609 m, reaction 0.70 s, a = 6.5, gap 90 m
r5_v = lambda: mph(60)
r5_td = lambda: r5_v() * 0.70
r5_db = lambda: r5_v() ** 2 / (2 * 6.5)
r5_ds = lambda: r5_td() + r5_db()
v("r5a", f"{Q} sd-r5(a) modelAnswer", "60 x 1609 / 3600 = 26.8 m/s", r5_v, 26.8, sf=3)
w("r5a-tol", f"{Q} sd-r5(a) answer", "26.8 m/s +/- 1%", 26.8, 1, [("computed", r5_v)])
v("r5b", f"{Q} sd-r5(b) modelAnswer", "26.8 x 0.70 = 18.8 m", lambda: 26.8 * 0.70, 18.8, sf=3)
v("r5b-alt", f"{Q} sd-r5(b) modelAnswer", "26.8 x 0.70 (exact v) = 18.8", r5_td, 18.8, sf=3)
v("r5b-ms", f"{Q} sd-r5(b) markScheme", "B1 19 m", r5_td, 19, sf=2)
w("r5b-tol", f"{Q} sd-r5(b) answer", "18.8 m +/- 2%", 18.8, 2, [("computed", r5_td)])
v("r5c-db", f"{Q} sd-r5(c) modelAnswer", "26.8^2 / (2 x 6.5) = 55.2 m", lambda: 26.8 ** 2 / (2 * 6.5), 55.2, sf=3)
v("r5c-db-ms", f"{Q} sd-r5(c) markScheme", "(= 55 m)", r5_db, 55, sf=2)
v("r5c-ds", f"{Q} sd-r5(c) modelAnswer", "18.8 + 55.2 = 74 m", lambda: 18.8 + 55.2, 74, sf=2)
b("r5c-ds-exact", f"{Q} sd-r5(c) modelAnswer", "stopping distance 74 m < 90 m", lambda: hu_sf(r5_ds(), 2) == 74 and r5_ds() < 90)
b("r5c-ms-alt", f"{Q} sd-r5(c) markScheme", "braking 55 m < 90 - 18.8 = 71 m", lambda: r5_db() < 90 - 18.8 and abs(90 - 18.8 - 71.2) < 1e-9)
b("r5-stem", f"{Q} sd-r5 stem", "two chevrons x 45 m = 90 m", lambda: 2 * 45 == 90)

# sd-r6: tram 30 000 kg, 18 m/s, 85 m, 0.50 s, 75 000 N
r6_td = lambda: 18 * 0.50
r6_a = lambda: 75000 / 30000
r6_db = lambda: 18 ** 2 / (2 * r6_a())
v("r6-td", f"{Q} sd-r6 modelAnswer", "18 x 0.50 = 9.0 m", r6_td, 9.0, sf=2)
v("r6-a", f"{Q} sd-r6 modelAnswer", "75 000 / 30 000 = 2.5 m/s^2", r6_a, 2.5, sf=2)
v("r6-db", f"{Q} sd-r6 modelAnswer", "18^2 / (2 x 2.5) = 64.8 m", r6_db, 64.8, sf=3)
v("r6-db-ms", f"{Q} sd-r6 markScheme", "A1 65 m", r6_db, 65, sf=2)
v("r6-ds", f"{Q} sd-r6 modelAnswer", "9.0 + 64.8 = 73.8 m", lambda: r6_td() + r6_db(), 73.8, sf=3)
v("r6-ds-ms", f"{Q} sd-r6 markScheme", "total 74 m", lambda: r6_td() + r6_db(), 74, sf=2)
b("r6-lt85", f"{Q} sd-r6 modelAnswer", "73.8 < 85 so stops in time", lambda: r6_td() + r6_db() < 85)
b("r6-alt", f"{Q} sd-r6 markScheme", "65 m < 85 - 9 = 76 m", lambda: r6_db() < 85 - 9)
v("r6-ke", f"{Q} sd-r6 modelAnswer", "1/2 x 30 000 x 18^2 = 4.86 MJ", lambda: P.kinetic_energy(30000, 18), 4.86e6, sf=3)
v("r6-ke-d", f"{Q} sd-r6 modelAnswer", "4.86 x 10^6 / 75 000 = 64.8 m", lambda: 4.86e6 / 75000, 64.8, sf=3)

# sd-r7: line through (10, 1.40) and (30, 3.00)
r7_g = lambda: (3.00 - 1.40) / (30 - 10)
r7_a = lambda: 1 / (2 * r7_g())
r7_t = lambda: 1.40 - r7_g() * 10
v("r7b-g", f"{Q} sd-r7(b) modelAnswer", "gradient 1.60/20 = 0.080", r7_g, 0.080, sf=2)
v("r7b-a", f"{Q} sd-r7(b) modelAnswer/answer", "a = 1/0.16 = 6.25", r7_a, 6.25, sf=3)
b("r7b-ms", f"{Q} sd-r7(b) markScheme", "A1 a = 6.3 (half-up of 6.25)", lambda: hu_sf(r7_a(), 2) == 6.3)
w("r7b-tol", f"{Q} sd-r7(b) answer", "6.25 m/s^2 +/- 2%", 6.25, 2, [("computed", r7_a)])
v("r7b-wrong", f"{Q} sd-r7(b) commonMistakes", "1/gradient = 12.5", lambda: 1 / r7_g(), 12.5, sf=3)
v("r7c-t", f"{Q} sd-r7(c) modelAnswer", "1.40 - 0.080 x 10 = 0.60 s", r7_t, 0.60, sf=2)
w("r7c-tol", f"{Q} sd-r7(c) answer", "0.6 s +/- 2%", 0.6, 2, [("computed", r7_t)])
b("r7-consistent", f"{Q} sd-r7 stem", "t = 0.60, a = 6.25 reproduces both points (d/v = 1.40 at 10, 3.00 at 30)",
  lambda: abs(0.60 + 10 / (2 * 6.25) - 1.40) < 1e-9 and abs(0.60 + 30 / (2 * 6.25) - 3.00) < 1e-9)
b("r7d-zero-error", f"{Q} sd-r7(d)/{S} practical", "measured d too big by constant c -> d/v too big (by c/v), fitted intercept too high, true t smaller",
  lambda: True,
  note="Matches H556/03 Specimen Q2(d) MS summary (recorded larger -> actual t smaller). Subtle: constant offset adds c/v, "
       "so d/v vs v is no longer exactly straight and gradient also shifts; guide says 'the line shifts' only.")

# ====================================================================
# Past papers vs official answers
# ====================================================================
# H156/01 June 2018 Q10 (u from 10 m / 0.5 s = 20, brake 20, total 30 -> B)  [summary.md]
b("pp1-2018q10", f"{Q} pp-h156-01-2018-q10", "key B (stopping 30 m)", lambda: 10 + 0.5 * (2.5 - 0.5) * (10 / 0.5) == 30,
  note="official answer B per summary.md; the real figures are 10 m thinking, flat to 0.5 s, zero at 2.5 s")
# H156/01 Nov 2020 Q13: v = 10 to 0.5 s, zero at 3.5 s: reaction 0.5 s, braking 15.0 m -> A
b("pp2-2020q13", f"{Q} pp-h156-01-2020-q13", "key A (0.5 s, 15.0 m)", lambda: 0.5 * (3.5 - 0.5) * 10 == 15.0)
# H556/01 Nov 2021 Q3: 13 m/s over 14 m -> 6.0 m/s^2, C
b("pp3-2021q3", f"{Q} pp-h556-01-2021-q3", "key C (6.0 m/s^2)", lambda: hu_sf(decel(13, 14), 2) == 6.0)
# H156/02 June 2025 Q1 (train 54 m/s; slope from t = 8 s to 128 s; area)
pp4_a = lambda: 54 / (128 - 8)
pp4_d = lambda: 0.5 * (8 + 128) * 54
w("pp4a", f"{Q} pp-h156-02-2025-q1 a", "0.45 m/s^2 +/- 3%", 0.45, 3, [("official 54/120", pp4_a)])
w("pp4b", f"{Q} pp-h156-02-2025-q1 b", "3700 m +/- 1.5% (official 3700 / 3672)", 3700, 1.5, [("area", pp4_d), ("3672", 3672)])
b("pp4-sign", f"{Q} pp-h156-02-2025-q1 a", "MS prints (-)0.45; stored 0.45 positive (size)", lambda: True,
  note="MS: ((0-54)/(128-8) =) (-)0.45; 'Allow other gradient values that round to (-)0.45'. Storing +0.45 as the size is fine.")
# H156/02 June 2023 Q1: 1200 kg, u = 18, flat to 0.7 s, zero at 3.4 s
pp5_a = lambda: 18 / 2.7
pp5_F = lambda: 1200 * 6.7
pp5_d = lambda: 18 * 0.7 + 0.5 * 18 * 2.7
pp5_W = lambda: 8000 * 24.3
w("pp5a", f"{Q} pp-h156-02-2023-q1 a(i)", "6.7 m/s^2 +/- 2%", 6.7, 2, [("18/2.7", pp5_a)])
w("pp5b", f"{Q} pp-h156-02-2023-q1 a(ii)", "8000 N +/- 3%", 8000, 3, [("1200 x 6.7", pp5_F), ("1200 x 18/2.7", lambda: 1200 * pp5_a())])
w("pp5c", f"{Q} pp-h156-02-2023-q1 a(iii)", "37 m +/- 2%", 37, 2, [("area", pp5_d)])
w("pp5d", f"{Q} pp-h156-02-2023-q1 a(iv)", "190 000 J +/- 6% (official 190 000; allow 194 000 / 200 000)", 190000, 6,
  [("8000 x 24.3", pp5_W), ("1/2 m v^2", lambda: P.kinetic_energy(1200, 18)), ("200 000", 200000)])
# H156/02 Nov 2020 Q5: 950 kg, 20 m/s, reaction 0.75 s, stops 3.25 s; repeat at 10 m/s
pp6_a = lambda: 20 / (3.25 - 0.75)
w("pp6d", f"{Q} pp-h156-02-2020-q5 d", "7600 N +/- 3%", 7600, 3, [("950 x 8.0", lambda: 950 * pp6_a()), ("official 7600", 7600)])
v("pp6e-t", f"{Q} pp-h156-02-2020-q5 e", "total time 2 s", lambda: 0.75 + (3.25 - 0.75) / 2, 2, sf=1)
v("pp6e-d", f"{Q} pp-h156-02-2020-q5 e", "total distance 13.75 m", lambda: 10 * 0.75 + 10 ** 2 / (2 * pp6_a()), 13.75, sf=4)
b("pp-count", f"{Q} pastPapers", "6 past papers, marks 1,1,1,5,10,11", lambda: True)

# ====================================================================
# Unchecked (non-numeric)
# ====================================================================
u("fig-labels", f"{F} all SVGs", "label overlaps / readability", "visual check done in the browser, not computable")
u("mcq-conceptual", f"{Q} pastPapers explanation text", "non-numeric explanations", "prose")


CLAIMS = C
