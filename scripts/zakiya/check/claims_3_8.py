"""Numerical claims in the 3.8 Projectile motion guide, each recomputed with physics.py.

Record kinds:
  value    : fn() -> number; compare with `claimed` at shown_sf / shown_dp. Optional `alt`
             (fn using the rounded intermediates printed in the guide) explains ROUNDING.
  bool     : fn() -> True if the stated relationship holds.
  mcq      : fn() -> number; `options` (numbers), `correct_index`; the option equal to the
             computed value at the option's precision must be the keyed one.
  window   : `value` +/- `tol_pct`; every entry of `tests` [(label, fn or number)] must fall inside.
  unchecked: `reason` says why it cannot be expressed with the library.
Only physics.py does physics; lambdas here add plain arithmetic (differences, ratios, scale factors).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
Q = "content/zakiya/module3/3-8-projectile-motion.ts"
SA = "content/zakiya/module3/3-8/sections-a.ts"
SB = "content/zakiya/module3/3-8/sections-b.ts"
SC = "content/zakiya/module3/3-8/sections-c.ts"
F0 = "content/zakiya/module3/3-8/figures.ts"
FA = "content/zakiya/module3/3-8/figures-a.ts"
FB = "content/zakiya/module3/3-8/figures-b.ts"
FC = "content/zakiya/module3/3-8/figures-c.ts"
SH = "components/zakiya/ShadowSim.tsx"
PS = "components/zakiya/ProjectileSim.tsx"


# ---------- shared scenarios ----------
def cannon_t():
    return P.fall_time(44.1)


def kick():
    return P.projectile(15, 30)


def arrow_vy():
    return P.suvat_v_from_s(0, G, 29.4)


def stone_t():
    uy = P.components(12, 30)[1]
    return max(P.suvat_t_from_s(uy, -G, -20))


def r5():
    return P.projectile(15.0, 90 - 78.0, 1.80)  # 78.0 deg to vertical = 12.0 deg to horizontal


def r7():
    return P.projectile(22.0, 35.0)


def r8():
    return P.projectile(2400, 80.0)


def r6_v():
    return P.speed_from_ke(P.spring_energy(240, 0.050), 0.012)


C = []


def v(id, where, quote, fn, claimed, sf=None, dp=None, inputs=None, alt=None, note=""):
    C.append(dict(kind="value", id=id, where=where, quote=quote, fn=fn, claimed=claimed,
                  shown_sf=sf, shown_dp=dp, inputs=inputs or {}, alt=alt, note=note))


def b(id, where, quote, fn, inputs=None, note=""):
    C.append(dict(kind="bool", id=id, where=where, quote=quote, fn=fn, claimed=True, inputs=inputs or {}, note=note))


def w(id, where, quote, value, tol_pct, tests, note=""):
    C.append(dict(kind="window", id=id, where=where, quote=quote, value=value, tol_pct=tol_pct, tests=tests, note=note))


def mcq(id, where, quote, fn, options, correct_index, dp, note=""):
    C.append(dict(kind="mcq", id=id, where=where, quote=quote, fn=fn, options=options,
                  correct_index=correct_index, shown_dp=dp, note=note))


def u(id, where, quote, reason):
    C.append(dict(kind="unchecked", id=id, where=where, quote=quote, reason=reason))


# ====================================================================
# Questions
# ====================================================================
# pm-r1
r1_ratio = lambda: P.kinetic_energy(1, P.components(1, 40)[0]) / P.kinetic_energy(1, 1)
v("r1-ke", f"{Q} pm-r1 modelAnswer", "cos^2 40 x E = 0.587E", r1_ratio, 0.587, dp=3)
mcq("r1-mcq", f"{Q} pm-r1 options/correctIndex", "options 0/0.41E/0.59E/0.77E, key C", r1_ratio,
    [0, 0.41, 0.59, 0.77], 2, dp=2)
v("r1-d", f"{Q} pm-r1 commonMistakes", "D 0.77E = cos 40 unsquared", lambda: P.components(1, 40)[0], 0.77, dp=2)
v("r1-b", f"{Q} pm-r1 commonMistakes", "B 0.41E = sin^2 40",
  lambda: P.kinetic_energy(1, P.components(1, 40)[1]) / P.kinetic_energy(1, 1), 0.41, dp=2)
u("r2-mcq", f"{Q} pm-r2", "resultant force direction, key C", "non-numeric vector-direction MCQ")
u("r3-mcq", f"{Q} pm-r3", "weightless sensor, key B", "non-numeric conceptual MCQ")

# pm-r4 dog-ball launcher: 9.0 m/s horizontally from 1.25 m
r4_t = lambda: P.fall_time(1.25)
v("r4a", f"{Q} pm-r4(a) answer/modelAnswer", "t = sqrt(2x1.25/9.81) = 0.505 s", r4_t, 0.505, sf=3)
w("r4a-tol", f"{Q} pm-r4(a) answer", "0.505 s +/- 2%", 0.505, 2, [("computed", r4_t)])
v("r4a-ms", f"{Q} pm-r4(a) markScheme", "A1 0.50 s", r4_t, 0.50, sf=2)
v("r4a-noh", f"{Q} pm-r4(a) commonMistakes", "forgetting the 1/2 gives 0.357 s", lambda: P.fall_time(1.25 / 2), 0.357, sf=3,
  note="sqrt(h/g) == fall_time(h/2)")
v("r4b", f"{Q} pm-r4(b) modelAnswer", "x = 9.0 x 0.505 = 4.54 m", lambda: P.projectile(9.0, 0, 1.25)["R"], 4.54, sf=3)
b("r4b-zone", f"{Q} pm-r4(b)", "4.0 < 4.54 < 4.8", lambda: 4.0 < P.projectile(9.0, 0, 1.25)["R"] < 4.8)
b("r4c", f"{Q} pm-r4(c)", "time unchanged at 12.0 m/s (still 0.505 s)",
  lambda: abs(P.projectile(12.0, 0, 1.25)["T"] - P.projectile(9.0, 0, 1.25)["T"]) < 1e-12)
r4d = lambda: P.projectile(12.0, 0, 1.25)["R"]
v("r4d", f"{Q} pm-r4(d) answer/modelAnswer", "x = 12.0 x 0.505 = 6.06 m", r4d, 6.06, sf=3)
w("r4d-tol", f"{Q} pm-r4(d) answer", "6.06 m +/- 2%", 6.06, 2, [("computed", r4d)])
v("r4d-ms", f"{Q} pm-r4(d) markScheme", "B1 6.1 m", r4d, 6.1, sf=2)
b("r4d-past", f"{Q} pm-r4(d)", "past the zone (> 4.8 m)", lambda: r4d() > 4.8)

# pm-r5 throw at 78.0 deg to vertical, 15.0 m/s, 1.80 m, 0.145 kg
r5_uy = lambda: r5()["uy"]
v("r5a", f"{Q} pm-r5(a) answer/modelAnswer", "15.0 cos 78.0 = 3.12 m/s", r5_uy, 3.12, sf=3)
v("r5a-ms", f"{Q} pm-r5(a) markScheme", "(= 3.119)", r5_uy, 3.119, sf=4)
w("r5a-tol", f"{Q} pm-r5(a) answer", "3.12 +/- 1%", 3.12, 1, [("computed", r5_uy)])
v("r5a-sin78", f"{Q} pm-r5(a) commonMistakes", "sin 78.0 gives 14.7 m/s", lambda: r5()["ux"], 14.7, sf=3)
r5_vy = lambda: P.suvat_v_from_s(r5_uy(), G, 1.80)
v("r5b-v2", f"{Q} pm-r5(b) modelAnswer/markScheme", "v^2 = 3.12^2 + 2x9.81x1.80 = 45.0", lambda: r5_vy() ** 2, 45.0, sf=3,
  alt=("u rounded to 3.12 first", lambda: P.suvat_v_from_s(3.12, G, 1.80) ** 2))
v("r5b", f"{Q} pm-r5(b) answer/modelAnswer", "v = sqrt 45.0 = 6.71 m/s", r5_vy, 6.71, sf=3)
v("r5b-lib", f"{Q} pm-r5(b)", "6.71 (cross-check via projectile() vy_land)", lambda: -r5()["vy_land"], 6.71, sf=3)
w("r5b-tol", f"{Q} pm-r5(b) answer", "6.71 +/- 1%", 6.71, 1, [("computed", r5_vy)])
v("r5c-uh", f"{Q} pm-r5(c) modelAnswer", "u_H = 15.0 sin 78.0 = 14.67", lambda: r5()["ux"], 14.67, sf=4)
v("r5c-v2", f"{Q} pm-r5(c) modelAnswer/markScheme", "v^2 = 14.67^2 + 6.71^2 = 260", lambda: r5()["v_land"] ** 2, 260, sf=3)
r5_ke = lambda: P.kinetic_energy(0.145, r5()["v_land"])
v("r5c", f"{Q} pm-r5(c) answer/modelAnswer", "KE = 18.9 J (route 1)", r5_ke, 18.9, sf=3)
v("r5c-ms19", f"{Q} pm-r5(c) markScheme", "ALLOW 19 J", r5_ke, 19, sf=2)
w("r5c-tol", f"{Q} pm-r5(c) answer", "18.9 J +/- 2%", 18.9, 2, [("computed", r5_ke)])
v("r5c-ke0", f"{Q} pm-r5(c) route 2", "KE at release = 1/2 x 0.145 x 15.0^2 = 16.3 J", lambda: P.kinetic_energy(0.145, 15.0), 16.3, sf=3)
v("r5c-gpe", f"{Q} pm-r5(c) route 2", "GPE lost = 0.145 x 9.81 x 1.80 = 2.56 J", lambda: P.weight(0.145) * 1.80, 2.56, sf=3)
v("r5c-r2", f"{Q} pm-r5(c) route 2", "16.3 + 2.56 = 18.9 J",
  lambda: P.kinetic_energy(0.145, 15.0) + P.weight(0.145) * 1.80, 18.9, sf=3)
v("r5c-vert", f"{Q} pm-r5(c) markScheme/commonMistakes", "Not 3.3 J (vertical component only)",
  lambda: P.kinetic_energy(0.145, r5_vy()), 3.3, sf=2)
r5_ang = lambda: r5()["angle_land_deg"]
v("r5d", f"{Q} pm-r5(d) answer/modelAnswer", "tan^-1(6.71/14.67) = 24.6 deg", r5_ang, 24.6, sf=3)
v("r5d-ms", f"{Q} pm-r5(d) markScheme", "A1 25 deg", r5_ang, 25, sf=2)
w("r5d-tol", f"{Q} pm-r5(d) answer", "24.6 +/- 2%", 24.6, 2, [("computed", r5_ang)])
v("r5d-inv", f"{Q} pm-r5(d) commonMistakes", "inverting gives 65.4 deg", lambda: 90 - r5_ang(), 65.4, sf=3)
v("r5d-ms65", f"{Q} pm-r5(d) markScheme", "Not 65 deg (angle to vertical)", lambda: 90 - r5_ang(), 65, sf=2)

# pm-r6 spring launcher
r6_e = lambda: P.spring_energy(240, 0.050)
v("r6a", f"{Q} pm-r6(a) answer/modelAnswer", "1/2 x 240 x 0.050^2 = 0.30 J", r6_e, 0.30, sf=2)
w("r6a-tol", f"{Q} pm-r6(a) answer", "0.3 J +/- 1%", 0.3, 1, [("computed", r6_e)])
v("r6a-pot", f"{Q} pm-r6(a) commonMistakes", "x = 5.0 (cm) gives 3000 J", lambda: P.spring_energy(240, 5.0), 3000, sf=2)
v("r6b-v2", f"{Q} pm-r6(b) modelAnswer", "v^2 = 50", lambda: r6_v() ** 2, 50, sf=2)
v("r6b", f"{Q} pm-r6(b) answer/modelAnswer", "v = 7.07 m/s", r6_v, 7.07, sf=3)
w("r6b-tol", f"{Q} pm-r6(b) answer", "7.07 +/- 1%", 7.07, 1, [("computed", r6_v)])
r6_t = lambda: P.fall_time(0.95)
v("r6c-t", f"{Q} pm-r6(c) modelAnswer", "t = 0.440 s", r6_t, 0.440, sf=3)
v("r6c-tms", f"{Q} pm-r6(c) markScheme", "C1 t = 0.44 s", r6_t, 0.44, sf=2)
r6_R = lambda: P.projectile(r6_v(), 0, 0.95)["R"]
v("r6c", f"{Q} pm-r6(c) answer/modelAnswer", "R = 7.07 x 0.440 = 3.11 m", r6_R, 3.11, sf=3)
v("r6c-ms", f"{Q} pm-r6(c) markScheme", "A1 3.1 m", r6_R, 3.1, sf=2)
w("r6c-tol", f"{Q} pm-r6(c) answer", "3.11 +/- 2%", 3.11, 2, [("computed", r6_R)])
v("r6c-7", f"{Q} pm-r6(c) markScheme", "7 m/s -> 3.08 m (low end)", lambda: P.projectile(7.0, 0, 0.95)["R"], 3.08, sf=3)
v("r6c-71", f"{Q} pm-r6(c) markScheme", "7.1 m/s -> 3.12 m (high end)", lambda: P.projectile(7.1, 0, 0.95)["R"], 3.12, sf=3)

# pm-r7 long pass
v("r7b-uv", f"{Q} pm-r7(b) modelAnswer/markScheme", "u_V = 22.0 sin 35.0 = 12.6", lambda: r7()["uy"], 12.6, sf=3)
r7_tp = lambda: r7()["t_peak"]
v("r7b", f"{Q} pm-r7(b) answer/modelAnswer", "t = 1.29 s", r7_tp, 1.29, sf=3)
w("r7b-tol", f"{Q} pm-r7(b) answer", "1.29 +/- 1%", 1.29, 1, [("computed", r7_tp)])
v("r7c-vh", f"{Q} pm-r7(c) modelAnswer", "22.0 cos 35.0 = 18.0", lambda: r7()["ux"], 18.0, sf=3)
r7_ke = lambda: P.kinetic_energy(0.43, r7()["ux"])
v("r7c", f"{Q} pm-r7(c) answer/modelAnswer", "KE = 1/2 x 0.43 x 18.0^2 = 69.8 J", r7_ke, 69.8, sf=3)
v("r7c-ms", f"{Q} pm-r7(c) markScheme", "A1 70 J", r7_ke, 70, sf=2)
w("r7c-tol", f"{Q} pm-r7(c) answer", "69.8 +/- 2%", 69.8, 2, [("computed", r7_ke)])
v("r7c-104", f"{Q} pm-r7(c) markScheme/commonMistakes", "Not 104 J (22.0 used)", lambda: P.kinetic_energy(0.43, 22.0), 104, sf=3)
v("r7c-34", f"{Q} pm-r7(c) markScheme/commonMistakes", "Not 34 J (vertical component)", lambda: P.kinetic_energy(0.43, r7()["uy"]), 34, sf=2)
v("r7d-tp", f"{Q} pm-r7(d) modelAnswer", "2 x 1.286", r7_tp, 1.286, sf=4)
v("r7d-T", f"{Q} pm-r7(d) modelAnswer/markScheme", "time of flight = 2.57 s", lambda: r7()["T"], 2.57, sf=3)
v("r7d-T4", f"{Q} pm-r7(d) modelAnswer", "18.02 x 2.573 (T)", lambda: r7()["T"], 2.573, sf=4)
v("r7d-ux4", f"{Q} pm-r7(d) modelAnswer", "18.02 x 2.573 (ux)", lambda: r7()["ux"], 18.02, sf=4)
v("r7d-R", f"{Q} pm-r7(d) modelAnswer/markScheme", "Range = 46.4 m", lambda: r7()["R"], 46.4, sf=3)
r7_miss = lambda: 50.0 - r7()["R"]
v("r7d", f"{Q} pm-r7(d) modelAnswer/markScheme", "50.0 - 46.4 = 3.6 m short", r7_miss, 3.6, sf=2)
v("r7d-ans", f"{Q} pm-r7(d) answer.value", "3.64 m", r7_miss, 3.64, sf=3)
w("r7d-tol", f"{Q} pm-r7(d) answer", "3.64 +/- 3%", 3.64, 3, [("computed", r7_miss)])
b("r7d-13", f"{Q} pm-r7(d) markScheme/commonMistakes", "t = 1.3 s (2.6 s) gives 3.1-3.2 m",
  lambda: 3.1 <= P.round_sf(50.0 - r7()["ux"] * 2.6, 2) <= 3.2, note="50 - ux x 2.6 = 3.14")
v("r7d-top", f"{Q} pm-r7(d) commonMistakes", "time to top only: range 23 m", lambda: r7()["ux"] * r7_tp(), 23, sf=2)
v("r7d-top27", f"{Q} pm-r7(d) commonMistakes", "misses by 27 m", lambda: 50.0 - r7()["ux"] * r7_tp(), 27, sf=2)

# pm-r8 gun launch
r8_uy_km = lambda: r8()["uy"] / 1000
v("r8a", f"{Q} pm-r8(a) answer/modelAnswer", "2.40 sin 80.0 = 2.364 km/s", r8_uy_km, 2.364, sf=4)
w("r8a-tol", f"{Q} pm-r8(a) answer", "2.364 +/- 0.5%", 2.364, 0.5, [("computed", r8_uy_km)])
v("r8a-ms", f"{Q} pm-r8(a) modelAnswer", "(2364 m/s)", lambda: r8()["uy"], 2364, sf=4)
v("r8a-cos", f"{Q} pm-r8(a) commonMistakes", "cos 80.0 gives 0.417 km/s", lambda: r8()["ux"] / 1000, 0.417, sf=3)
r8_H = lambda: r8()["h_max"] / 1000
v("r8b", f"{Q} pm-r8(b) answer/modelAnswer", "H = 285 km", r8_H, 285, sf=3)
v("r8b-m", f"{Q} pm-r8(b) modelAnswer", "2.85 x 10^5 m", lambda: r8()["h_max"], 2.85e5, sf=3)
v("r8b-ms", f"{Q} pm-r8(b) markScheme", "A1 2.8 x 10^5 m", lambda: r8()["h_max"], 2.8e5, sf=2,
  note="2.847e5 to 2 s.f. is 2.8e5")
w("r8b-tol", f"{Q} pm-r8(b) answer", "285 km +/- 2%", 285, 2, [("computed", r8_H)])
v("r8b-cos", f"{Q} pm-r8(b) markScheme", "Not 8.9 km (cos 80.0 used)", lambda: P.projectile(2400, 10.0)["h_max"] / 1000, 8.9, sf=2)
v("r8b-unit", f"{Q} pm-r8(b) commonMistakes", "2.364 km/s with g in m/s^2 gives 0.285",
  lambda: P.projectile(2.40, 80.0)["h_max"], 0.285, sf=3, note="projectile() fed u in km/s")
r8_top = lambda: P.magnitude(*P.velocity(2400, 80.0, r8()["t_peak"]))
v("r8c", f"{Q} pm-r8(c) answer/modelAnswer", "2400 cos 80.0 = 417 m/s", r8_top, 417, sf=3)
v("r8c-ms", f"{Q} pm-r8(c) markScheme", "allow 420", r8_top, 420, sf=2)
w("r8c-tol", f"{Q} pm-r8(c) answer", "417 +/- 2%", 417, 2, [("computed", r8_top)])
for cid, qt in [("r8e-g", "g = 9.81 x (6400/6685)^2 = 8.99 m/s^2"), ("r8e-pct", "about 8% smaller"),
                ("r8e-ratio", "ratio ~ 0.92"), ("r8e-unsq", "6400/6685 without squaring (0.957)")]:
    u(cid, f"{Q} pm-r8(e)", qt, "inverse-square g(r) is not in physics.py")
v("r8e-r", f"{Q} pm-r8(e) modelAnswer", "r = 6400 + H = 6685 km", lambda: 6400 + r8_H(), 6685, sf=4)

# ====================================================================
# Past papers (stored answers vs the official answers in projectile-pastpapers.md)
# ====================================================================
PP = f"{Q} pastPapers"
mcq("pp16", f"{PP} pp-h156-01-2016-q18", "answer C (0.75K of 0/0.25K/0.75K/0.87K)",
    lambda: P.kinetic_energy(1, P.components(1, 30)[0]) / P.kinetic_energy(1, 1), [0, 0.25, 0.75, 0.87], 2, dp=2)

pp23 = lambda: 3.6 * 0.58
v("pp23", f"{PP} pp-h156-01-2023-q24b", "2.09 m (= 3.6 x 0.58; official 2.09)", pp23, 2.09, sf=3)
w("pp23-tol", f"{PP} pp-h156-01-2023-q24b", "2.09 +/- 1%", 2.09, 1, [("computed 2.088", pp23), ("official", 2.09)])

pp22_gpe = lambda: P.weight(0.16) * 2.5
pp22_v = lambda: P.suvat_v_from_s(0, G, 2.5)
pp22_ke = lambda: P.kinetic_energy(0.16, 12) + pp22_gpe()
pp22_ang = lambda: P.angle_to_horizontal_deg(12, pp22_v())
v("pp22-ai", f"{PP} pp-h156-02-2022-q4 a(i)", "3.92 J (official 3.9)", pp22_gpe, 3.92, sf=3)
w("pp22-ai-tol", f"{PP} pp-h156-02-2022-q4 a(i)", "3.92 +/- 2%", 3.92, 2, [("computed", pp22_gpe), ("official", 3.9)])
v("pp22-aii", f"{PP} pp-h156-02-2022-q4 a(ii)", "7.0 m/s", pp22_v, 7.0, sf=2)
w("pp22-aii-tol", f"{PP} pp-h156-02-2022-q4 a(ii)", "7.0 +/- 1%", 7.0, 1, [("computed", pp22_v), ("official", 7.0)])
v("pp22-bi", f"{PP} pp-h156-02-2022-q4 b(i)", "8.52 m (12 x 0.71 given)", lambda: 12 * 0.71, 8.52, sf=3)
w("pp22-bi-tol", f"{PP} pp-h156-02-2022-q4 b(i)", "8.52 +/- 1.5%", 8.52, 1.5,
  [("12 x 0.71", lambda: 12 * 0.71), ("12 x fall_time(2.5)", lambda: P.projectile(12, 0, 2.5)["R"]), ("official", 8.5)])
v("pp22-bii", f"{PP} pp-h156-02-2022-q4 b(ii)", "15.4 J", pp22_ke, 15.4, sf=3)
w("pp22-bii-tol", f"{PP} pp-h156-02-2022-q4 b(ii)", "15.4 +/- 3%", 15.4, 3,
  [("computed", pp22_ke), ("via v_land", lambda: P.kinetic_energy(0.16, P.projectile(12, 0, 2.5)["v_land"])),
   ("official 15", 15), ("MS route 2 (13.9 m/s)", lambda: P.kinetic_energy(0.16, 13.9))])
v("pp22-biii", f"{PP} pp-h156-02-2022-q4 b(iii)", "30 deg", pp22_ang, 30, sf=2)
w("pp22-biii-tol", f"{PP} pp-h156-02-2022-q4 b(iii)", "30 +/- 2.5%", 30, 2.5, [("computed", pp22_ang), ("official", 30)])

pp22b_e = lambda: P.spring_energy(500, 0.060)
pp22b_v = lambda: P.speed_from_ke(pp22b_e(), 0.030)
pp22b_R = lambda: P.projectile(pp22b_v(), 0, 1.5)["R"]
v("pp22b-i", f"{PP} pp-h556-01-2022-q16b b(i)", "0.9 J", pp22b_e, 0.9, sf=1)
w("pp22b-i-tol", f"{PP} pp-h556-01-2022-q16b b(i)", "0.9 +/- 3%", 0.9, 3, [("computed", pp22b_e), ("official 0.90", 0.90)])
v("pp22b-ii", f"{PP} pp-h556-01-2022-q16b b(ii)", "7.7 m/s", pp22b_v, 7.7, sf=2)
w("pp22b-ii-tol", f"{PP} pp-h556-01-2022-q16b b(ii)", "7.7 +/- 2%", 7.7, 2, [("computed", pp22b_v), ("official", 7.7)])
v("pp22b-iii", f"{PP} pp-h556-01-2022-q16b b(iii)", "4.28 m", pp22b_R, 4.28, sf=3)
v("pp22b-t", f"{PP} pp-h556-01-2022-q16b explanation", "MS t = 0.55 s from 1.5 = 1/2 g t^2", lambda: P.fall_time(1.5), 0.55, sf=2)
w("pp22b-iii-tol", f"{PP} pp-h556-01-2022-q16b b(iii)", "4.28 +/- 6% (scheme allows 4.2-4.5)", 4.28, 6,
  [("computed", pp22b_R), ("official 4.2", 4.2), ("MS 4.4", 4.4), ("MS 4.5", 4.5),
   ("8 m/s", lambda: P.projectile(8, 0, 1.5)["R"]), ("8.2 m/s", lambda: P.projectile(8.2, 0, 1.5)["R"])])

pp20 = lambda: P.projectile(68, 11)
v("pp20-b", f"{PP} pp-h556-01-2020-q18 b", "1.32 s", lambda: pp20()["t_peak"], 1.32, sf=3)
w("pp20-b-tol", f"{PP} pp-h556-01-2020-q18 b", "1.32 +/- 2%", 1.32, 2, [("computed", lambda: pp20()["t_peak"]), ("official", 1.32)])
v("pp20-c", f"{PP} pp-h556-01-2020-q18 c", "86.6 m (miss distance)", lambda: pp20()["R"] - 90, 86.6, sf=3)
w("pp20-c-tol", f"{PP} pp-h556-01-2020-q18 c", "86.6 +/- 3.6% must cover MS answers 84 / 86 / 87", 86.6, 3.6,
  [("computed", lambda: pp20()["R"] - 90), ("official 84 (T = 2.6 s)", 84), ("MS 86", 86), ("MS 87", 87),
   ("T = 2.6 s computed", lambda: pp20()["ux"] * 2.6 - 90)])

pp23b_t = lambda: P.fall_time(17)
pp23b_s = lambda: 0.82 * 10.26 * pp23b_t()
v("pp23b-i", f"{PP} pp-h556-01-2023-q17b b(i)", "1.86 s", pp23b_t, 1.86, sf=3)
w("pp23b-i-tol", f"{PP} pp-h556-01-2023-q17b b(i)", "1.86 +/- 3%", 1.86, 3, [("computed", pp23b_t), ("official 1.9", 1.9)])
v("pp23b-ii", f"{PP} pp-h556-01-2023-q17b b(ii)", "15.7 m (r w = 0.82 x 10.26)", pp23b_s, 15.7, sf=3)
w("pp23b-ii-tol", f"{PP} pp-h556-01-2023-q17b b(ii)", "15.7 +/- 5.5% must cover MS 14.9-16.0 and 15.2", 15.7, 5.5,
  [("computed", pp23b_s), ("MS low 14.9", 14.9), ("MS high 16.0", 16.0), ("stem data 15.2", lambda: 0.8 * 10 * pp23b_t())],
  note="window 14.84-16.56 is wider than the MS range at the top end (accepts up to 16.5)")

pp25_t = lambda: P.fall_time(2500)
pp25_vy = lambda: P.suvat_v(0, G, pp25_t())
pp25_v = lambda: P.magnitude(220, pp25_vy())
pp25_ang = lambda: 90 - P.angle_to_horizontal_deg(220, pp25_vy())
v("pp25-aii", f"{PP} pp-h556-01-2025-q17 a(ii)", "22.6 s", pp25_t, 22.6, sf=3)
w("pp25-aii-tol", f"{PP} pp-h556-01-2025-q17 a(ii)", "22.6 +/- 2%", 22.6, 2, [("computed", pp25_t), ("official", 22.6)])
v("pp25-v", f"{PP} pp-h556-01-2025-q17 a(iii) speed", "312 m/s", pp25_v, 312, sf=3)
w("pp25-v-tol", f"{PP} pp-h556-01-2025-q17 a(iii) speed", "312 +/- 1.3% must cover MS 310-315", 312, 1.3,
  [("computed", pp25_v), ("MS 310", 310), ("MS 315", 315)])
v("pp25-ang", f"{PP} pp-h556-01-2025-q17 a(iii) angle", "44.8 deg to vertical", pp25_ang, 44.8, sf=3)
w("pp25-ang-tol", f"{PP} pp-h556-01-2025-q17 a(iii) angle", "44.8 +/- 1.8% must cover MS 44-45", 44.8, 1.8,
  [("computed", pp25_ang), ("MS low 44", 44.0), ("MS high 45", 45.0),
   ("t = 23 s route", lambda: 90 - P.angle_to_horizontal_deg(220, P.suvat_v(0, G, 23)))])
u("pp25-bi", f"{PP} pp-h556-01-2025-q17 b(i)", "0.997 +/- 0.2% (official (6400/6410)^2 = 0.997)",
  "inverse-square g(r) not in physics.py; stored 0.997 matches the official answer text")

pp24_vB = lambda: P.components(3100, 75)[1]
pp24_H = lambda: (P.suvat_s(0, pp24_vB() / 50, 50) + P.projectile(3100, 75)["h_max"]) / 1000
v("pp24", f"{PP} pp-h556-03-2024-q3b H", "530 km (AB 74.9 km + BC 457 km)", pp24_H, 530, sf=2)
w("pp24-tol", f"{PP} pp-h556-03-2024-q3b H", "530 +/- 3%", 530, 3, [("computed", pp24_H), ("official ~530", 530)])
v("pp24-ab", f"{PP} pp-h556-03-2024-q3b (official working)", "AB = 74.9 km",
  lambda: P.suvat_s(0, pp24_vB() / 50, 50) / 1000, 74.9, sf=3)
v("pp24-bc", f"{PP} pp-h556-03-2024-q3b (official working)", "BC = 457 km", lambda: P.projectile(3100, 75)["h_max"] / 1000, 457, sf=3)

# ====================================================================
# Flashcards
# ====================================================================
b("fc10", f"{Q} pm-fc-10", "velocity at top is horizontal, = u cos theta",
  lambda: abs(P.velocity(15, 30, kick()["t_peak"])[1]) < 1e-12 and P.velocity(15, 30, kick()["t_peak"])[0] == kick()["ux"])
b("fc17", f"{Q} pm-fc-17", "landing speed = launch speed on flat ground",
  lambda: all(abs(P.projectile(uu, th)["v_land"] - uu) < 1e-9 for uu, th in [(15, 30), (22, 35), (7, 70)]))

# ====================================================================
# Sections
# ====================================================================
v("sa-cb-t", f"{SA} independence text", "fall gives t = 3.00 s", cannon_t, 3.00, sf=3)
v("sa-cb-x", f"{SA} independence text", "304 x 3.00 = 912 m", lambda: P.projectile(304, 0, 44.1)["R"], 912, sf=3)
v("sa-kick-ux", f"{SA} resolving text/equation note", "15 cos 30 = 13.0", lambda: kick()["ux"], 13.0, sf=3)
v("sa-kick-uy", f"{SA} resolving text/equation note", "15 sin 30 = 7.5", lambda: kick()["uy"], 7.5, sf=2)
v("sb-cos90", f"{SB} horizontal-launch text", "304 x cos 90 = 0 (uy)", lambda: P.components(304, 0)[1], 0, dp=0)
v("sb-cb-t2", f"{SB} worked: cannonball", "t^2 = 2 x 44.1 / 9.81 = 8.991", lambda: cannon_t() ** 2, 8.991, sf=4)
v("sb-cb-t", f"{SB} worked: cannonball", "t = sqrt 8.991 = 3.00 s", cannon_t, 3.00, sf=3)
v("sb-cb-x", f"{SB} worked: cannonball", "304 x 3.00 = 912 m", lambda: 304 * cannon_t(), 912, sf=3)
b("sb-cb-drop", f"{SB} horizontal-launch text", "dropped cannonball also lands after 3.00 s",
  lambda: abs(P.projectile(304, 0, 44.1)["T"] - P.fall_time(44.1)) < 1e-12)
v("sb-ar-vy2", f"{SB} worked: arrow", "vy^2 = 2 x 9.81 x 29.4 = 576.8", lambda: arrow_vy() ** 2, 576.8, sf=4)
v("sb-ar-vy", f"{SB} worked: arrow / text", "vy = 24.0 m/s", arrow_vy, 24.0, sf=3)
v("sb-ar-vy-lib", f"{SB} worked: arrow", "24.0 (cross-check projectile())", lambda: -P.projectile(49.2, 0, 29.4)["vy_land"], 24.0, sf=3)
v("sb-ar-v", f"{SB} worked: arrow / text", "v = sqrt(49.2^2 + 24.0^2) = 54.7 m/s", lambda: P.projectile(49.2, 0, 29.4)["v_land"], 54.7, sf=3,
  alt=("vy rounded to 24.0", lambda: P.magnitude(49.2, 24.0)))
v("sb-ar-ang", f"{SB} worked: arrow / text", "tan^-1(24.0/49.2) = 26.0 deg", lambda: P.projectile(49.2, 0, 29.4)["angle_land_deg"], 26.0, sf=3)
v("sb-ar-vert", f"{SB} warning", "angle to vertical 64.0 deg", lambda: 90 - P.projectile(49.2, 0, 29.4)["angle_land_deg"], 64.0, sf=3)
v("sb-k-tp", f"{SB} angled-launch text", "used up by gravity in 0.76 s", lambda: kick()["t_peak"], 0.76, sf=2)
v("sb-k-T", f"{SB} angled-launch text / worked", "time of flight 1.53 s", lambda: kick()["T"], 1.53, sf=3)
v("sb-k-T4", f"{SB} worked: kick (b)", "13.0 x 1.529", lambda: kick()["T"], 1.529, sf=4)
v("sb-k-T-suvat", f"{SB} worked: kick (a)", "(-7.5 - 7.5)/(-9.81) = 1.53 s",
  lambda: max(P.suvat_t_from_s(kick()["uy"], -G, 0)), 1.53, sf=3)
v("sb-k-R", f"{SB} worked: kick (b)", "range = 19.9 m", lambda: kick()["R"], 19.9, sf=3)
v("sb-k-R2", f"{SB} angled-launch text / worked", "about 20 m (2 s.f.)", lambda: kick()["R"], 20, sf=2)
v("sb-k-uy2", f"{SB} worked: kick (c)", "s = 56.25 / 19.62 (uy^2 = 56.25)", lambda: kick()["uy"] ** 2, 56.25, sf=4)
v("sb-k-H", f"{SB} worked: kick (c)", "max height 2.87 m", lambda: kick()["h_max"], 2.87, sf=3)
v("sb-k-H2", f"{SB} worked: kick answer", "max height 2.9 m", lambda: kick()["h_max"], 2.9, sf=2)
v("sb-k-15", f"{SB} warning", "rounding t to 1.5 s gives 19.5 m", lambda: kick()["ux"] * 1.5, 19.5, sf=3)
b("sb-k-sym", f"{SB} list", "flat ground: T = 2 x time to top",
  lambda: abs(kick()["T"] - 2 * kick()["t_peak"]) < 1e-12)
st_ux = lambda: P.components(12, 30)[0]
v("sc-ux", f"{SC} worked: stone", "ux = 12 cos 30 = 10.39", st_ux, 10.39, sf=4)
v("sc-uy", f"{SC} worked: stone", "uy = 12 sin 30 = 6.00", lambda: P.components(12, 30)[1], 6.00, sf=3)
v("sc-36", f"{SC} worked: stone", "36.0 (= uy^2)", lambda: P.components(12, 30)[1] ** 2, 36.0, sf=3)
v("sc-392", f"{SC} worked: stone", "392.4 (= 4 x 4.905 x 20)", lambda: P.suvat_v_from_s(0, -G, -20) ** 2, 392.4, sf=4)
v("sc-sqrt", f"{SC} worked: stone", "sqrt(36.0 + 392.4) = 20.70", lambda: P.suvat_v_from_s(P.components(12, 30)[1], -G, -20), 20.70, sf=4)
v("sc-t", f"{SC} worked: stone", "t = 2.72 s", stone_t, 2.72, sf=3)
v("sc-t-lib", f"{SC} worked: stone", "2.72 s (cross-check projectile h0=20)", lambda: P.projectile(12, 30, 20)["T"], 2.72, sf=3)
v("sc-t4", f"{SC} worked: stone", "10.39 x 2.721", stone_t, 2.721, sf=4)
b("sc-neg", f"{SC} worked: stone", "other root is negative", lambda: min(P.suvat_t_from_s(P.components(12, 30)[1], -G, -20)) < 0)
v("sc-x", f"{SC} worked: stone", "x = 28.3 m", lambda: P.projectile(12, 30, 20)["R"], 28.3, sf=3)
v("sc-ans-t", f"{SC} worked: stone answer", "2.7 s", stone_t, 2.7, sf=2)
v("sc-ans-x", f"{SC} worked: stone answer", "28 m", lambda: P.projectile(12, 30, 20)["R"], 28, sf=2)
v("sc-tp", f"{SC} no-quadratic text", "6.00 / 9.81 = 0.612 s", lambda: P.projectile(12, 30, 20)["t_peak"], 0.612, sf=3)
v("sc-hp", f"{SC} no-quadratic text", "rising 1.83 m", lambda: P.projectile(12, 30, 20)["h_max"], 1.83, sf=3)
v("sc-drop", f"{SC} no-quadratic text", "20 + 1.83 = 21.83 m", lambda: 20 + P.projectile(12, 30, 20)["h_max"], 21.83, sf=4)
v("sc-fall", f"{SC} no-quadratic text", "falls 21.83 m in 2.110 s", lambda: P.fall_time(20 + P.projectile(12, 30, 20)["h_max"]), 2.110, sf=4)
v("sc-sum", f"{SC} no-quadratic text", "0.612 + 2.110 = 2.72 s",
  lambda: P.projectile(12, 30, 20)["t_peak"] + P.fall_time(20 + P.projectile(12, 30, 20)["h_max"]), 2.72, sf=3)
v("sc-frame15", f"{SC} practical text", "frame 15 = 15/30 = 0.5 s", lambda: P.time_from_frames(15, 30), 0.5, sf=1)
v("sc-gy", f"{SC} practical equation", "gradient g/2 -> g = 2 x gradient", lambda: P.g_from_y_t2_gradient(G / 2), 9.81, sf=3)

# ====================================================================
# Figures
# ====================================================================
s1 = lambda n: P.suvat_s(0, G, n) / P.suvat_s(0, G, 1)  # fall-distance ratio (n^2)
for n, y in zip(range(1, 7), [35.8, 53.2, 82.2, 122.8, 175, 238.8]):
    v(f"f0-strobe-{n}", f"{F0} svgStrobe", f"flash {n} at y = {y} (30 + 5.8 n^2)", (lambda n=n: 30 + 5.8 * s1(n)), y, dp=1)
for n, y in zip(range(1, 4), [54, 96, 166]):
    v(f"fa-g-dot{n}", f"{FA} svgGravityEachSecond", f"dot {n} at y = {y} (40 + 14 n^2)", (lambda n=n: 40 + 14 * s1(n)), y, dp=0)
for n, L in zip(range(1, 4), [20, 40, 60]):
    v(f"fa-g-arr{n}", f"{FA} svgGravityEachSecond", f"downward arrow {L} px (prop. to v)",
      (lambda n=n: 20 * P.suvat_v(0, G, n) / P.suvat_v(0, G, 1)), L, dp=0)
v("fa-g-981", f"{FA} svgGravityEachSecond", "+9.81 each second", lambda: P.suvat_v(0, G, 2) - P.suvat_v(0, G, 1), 9.81, sf=3)
v("fa-cb-t", f"{FA} svgCannonball/svgToolkitColumns", "t = ? -> 3.00 s", cannon_t, 3.00, sf=3)
v("fa-cb-x", f"{FA} svgCannonball/svgToolkitColumns", "? -> 912 m", lambda: P.projectile(304, 0, 44.1)["R"], 912, sf=3)
v("fa-k-ux", f"{FA} svgComponentsKey / {F0} svgComponents", "13.0 m/s", lambda: kick()["ux"], 13.0, sf=3)
v("fa-k-uy", f"{FA} svgComponentsKey / {F0} svgComponents", "7.5 m/s", lambda: kick()["uy"], 7.5, sf=2)
v("fa-k-arrow", f"{FA} svgComponentsKey / {F0} svgComponents", "hypotenuse (40,180)->(238,65.6) at 30 deg",
  lambda: P.angle_to_horizontal_deg(238 - 40, 180 - 65.6), 30, dp=0)
v("fa-k-arcx", f"{FA}/{F0} svgComponents arc", "arc end x 74.64 (40 + 40 cos 30)", lambda: 40 + P.components(40, 30)[0], 74.64, dp=2)
v("fa-k-arcy", f"{FA}/{F0} svgComponents arc", "arc end y 160 (180 - 40 sin 30)", lambda: 180 - P.components(40, 30)[1], 160, dp=0)
v("fa-ratio", f"{SB} worked: cannonball caption ({FB} figCannonSteps)", "912 m is about 20 times the cliff height",
  lambda: P.projectile(304, 0, 44.1)["R"] / 44.1, 20, sf=1)
for lab, frac, y in [("1/4", 0.25, 87.5), ("3/4", 0.75, 87.5)]:
    v(f"f0-vec-y{frac}", f"{F0} svgVectors", f"point at {lab}T drawn at y = {y} (200 - 150 y/h)",
      (lambda frac=frac: 200 - 150 * P.position(15, 30, frac * kick()["T"])[1] / kick()["h_max"]), y, dp=1)
v("f0-vec-up", f"{F0} svgVectors / {FB} svgVectorsB", "3.75 up at T/4", lambda: P.velocity(15, 30, kick()["T"] / 4)[1], 3.75, sf=3)
v("f0-vec-dn", f"{F0} svgVectors / {FB} svgVectorsB", "3.75 down at 3T/4", lambda: -P.velocity(15, 30, 0.75 * kick()["T"])[1], 3.75, sf=3)
for nm, (x, y) in {"f0-imp": (40, 40), "fb-imp": (20, 60)}.items():
    v(f"{nm}-arcx", f"{F0 if nm == 'f0-imp' else FB} svgImpact arc", f"arc end x at 26.0 deg (r 45)",
      (lambda x=x: x + P.components(45, 26.0)[0]), x + 40.45, dp=2)
    v(f"{nm}-arcy", f"{F0 if nm == 'f0-imp' else FB} svgImpact arc", f"arc end y at 26.0 deg (r 45)",
      (lambda y=y: y + P.components(45, 26.0)[1]), y + 19.73, dp=2)
v("fb-imp-vy", f"{FB} svgImpactB", "24.0 m/s -> 96 px (to scale, 4 px per m/s)", lambda: 4 * arrow_vy(), 96, sf=2)
v("fb-imp-hyp", f"{FB} svgImpactB comment", "hypotenuse 219.0 px (= 54.7 x 4)", lambda: P.magnitude(196.8, 96), 219.0, dp=1,
  alt=("54.7 rounded first, x 4", lambda: 4 * 54.7), note="drawn line (20,60)->(216.8,156) is 219.0 px; only the comment is off")
v("fb-imp-ang", f"{FB} svgImpactB", "triangle drawn at 26.0 deg", lambda: P.angle_to_horizontal_deg(196.8, 96), 26.0, sf=3)
v("fb-ar-v", f"{FB} svgArrowSetup", "v = ? -> 54.7 m/s at 26.0", lambda: P.projectile(49.2, 0, 29.4)["v_land"], 54.7, sf=3)
v("fb-ar-vy", f"{FB} svgArrowSetup", "vy = ? -> 24.0 m/s", arrow_vy, 24.0, sf=3)
v("fb-ar-dash", f"{FB} svgArrowSetup", "landing arrow drawn at 26.0 deg ((300,170)->(345,192))",
  lambda: P.angle_to_horizontal_deg(45, 22), 26, dp=0)
v("fb-vb-vx", f"{FB} svgVectorsB", "13.0 -> 52 px", lambda: 4 * kick()["ux"], 52, dp=0)
v("fb-vb-vy", f"{FB} svgVectorsB", "7.5 -> 30 px", lambda: 4 * kick()["uy"], 30, dp=0)
v("fb-vb-vq", f"{FB} svgVectorsB", "3.75 -> 15 px", lambda: 4 * P.velocity(15, 30, kick()["T"] / 4)[1], 15, dp=0)
v("fb-vb-y", f"{FB} svgVectorsB", "points at T/4, 3T/4 drawn at y = 90 (210 - 160 y/h)",
  lambda: 210 - 160 * P.position(15, 30, kick()["T"] / 4)[1] / kick()["h_max"], 90, dp=0)
v("fb-rs-x", f"{FB} svgResolveB", "13.0 -> 155.9 px (12 px per m/s)", lambda: 12 * kick()["ux"], 155.9, dp=1)
v("fb-rs-y", f"{FB} svgResolveB", "7.5 -> 90 px", lambda: 12 * kick()["uy"], 90, dp=0)
v("fb-rs-h", f"{FB} svgResolveB", "15 -> 180 px hypotenuse", lambda: P.magnitude(155.9, 90), 180, dp=0)
v("fb-rs-arcx", f"{FB} svgResolveB arc", "arc end x 64.64", lambda: 30 + P.components(40, 30)[0], 64.64, dp=2)
v("fb-kk-T", f"{FB} svgKickAnswers", "t = ? -> 1.53 s", lambda: kick()["T"], 1.53, sf=3)
v("fb-kk-H", f"{FB} svgKickAnswers", "? -> 2.87 m", lambda: kick()["h_max"], 2.87, sf=3)
v("fb-kk-tp", f"{FB} svgKickAnswers", "0.76 s to the top", lambda: kick()["t_peak"], 0.76, sf=2)
v("fb-kk-R", f"{FB} svgKickAnswers", "13.0 x 1.53 = 19.9 m", lambda: kick()["R"], 19.9, sf=3)
v("fb-kk-sc", f"{FB} svgKickAnswers comment", "15.1 px per m (range 300 px)", lambda: 300 / kick()["R"], 15.1, sf=3)
v("fb-kk-Hpx", f"{FB} svgKickAnswers comment", "max height 2.87 m -> 43.3 px", lambda: 15.1 * kick()["h_max"], 43.3, dp=1)
v("fb-kk-peak", f"{FB} svgKickAnswers", "peak dot at y = 106.7", lambda: 150 - 15.1 * kick()["h_max"], 106.7, dp=1)
v("fb-kk-ctrl", f"{FB} svgKickAnswers", "Bezier control y = 63.4 (apex = half control height)",
  lambda: 150 - 2 * 15.1 * kick()["h_max"], 63.4, dp=1)
v("fb-kk-tan", f"{FB} svgKickAnswers", "launch tangent = 30 deg (path)", lambda: P.angle_to_horizontal_deg(150, 150 - 63.4), 30, dp=0)
v("fb-kk-arr", f"{FB} svgKickAnswers", "launch arrow (30,150)->(64.6,130) at 30 deg", lambda: P.angle_to_horizontal_deg(34.6, 20), 30, dp=0)
v("fc-l-ux", f"{FC} svgCliffLaunch", "10.39 m/s = 12 cos 30", st_ux, 10.39, sf=4)
v("fc-l-uy", f"{FC} svgCliffLaunch", "6.00 m/s", lambda: P.components(12, 30)[1], 6.00, sf=3)
v("fc-l-arrow", f"{FC} svgCliffLaunch", "launch arrow (40,150)->(188,64.6) drawn at the labelled 30 deg",
  lambda: P.angle_to_horizontal_deg(188 - 40, 150 - 64.6), 30, dp=0,
  note="arc (74.6,130) is at 30 deg but the arrow is drawn at 26.6 deg; components 148 px : 73 px are not 10.39 : 6.00")
v("fc-l-arcx", f"{FC} svgCliffLaunch arc", "arc end x 74.6", lambda: 40 + P.components(40, 30)[0], 74.6, dp=1)
v("fc-TF", f"{FC} code constant TF", "TF = 2.7215", stone_t, 2.7215, sf=5)
v("fc-land", f"{FC} code LAND_X", "28.28 m", lambda: P.projectile(12, 30, 20)["R"], 28.28, sf=4)
v("fc-peak", f"{FC} code PEAK_Y", "1.8349 m", lambda: P.projectile(12, 30, 20)["h_max"], 1.8349, sf=5)
v("fc-after-t", f"{FC} svgCliffAfter", "t = 2.72 s", stone_t, 2.72, sf=3)
v("fc-after-x", f"{FC} svgCliffAfter", "x = 28.3 m", lambda: P.projectile(12, 30, 20)["R"], 28.3, sf=3)
v("fc-split-1", f"{FC} svgCliffSplit", "1 1.83 m", lambda: P.projectile(12, 30, 20)["h_max"], 1.83, sf=3)
v("fc-split-2", f"{FC} svgCliffSplit", "2 0.612 s", lambda: P.projectile(12, 30, 20)["t_peak"], 0.612, sf=3)
v("fc-split-3", f"{FC} svgCliffSplit", "3 21.83 m", lambda: 20 + P.projectile(12, 30, 20)["h_max"], 21.83, sf=4)
v("fc-split-4", f"{FC} svgCliffSplit", "4 2.110 s", lambda: P.fall_time(20 + P.projectile(12, 30, 20)["h_max"]), 2.110, sf=4)
v("fc-split-sum", f"{FC} svgCliffSplit", "2 + 4 = 2.72 s",
  lambda: P.projectile(12, 30, 20)["t_peak"] + P.fall_time(20 + P.projectile(12, 30, 20)["h_max"]), 2.72, sf=3)
v("fc-vid-gap", f"{FC} svgVideoFrames", "1/30 s ~ 0.033 s", lambda: P.time_from_frames(1, 30), 0.033, sf=2)
v("fc-vid-15", f"{FC} svgVideoFrames", "15 / 30 = 0.5 s", lambda: P.time_from_frames(15, 30), 0.5, sf=1)
u("fc-vid-dots", f"{FC} svgVideoFrames", "grey trail dots (x 18..48 then 56; y 42,43,46,51,58,66,75,86)",
  "schematic, not claimed to scale; x steps are not equal (5 then 8) and y is not prop. to n^2")
v("fc-yt2-1", f"{FC} svgYvsT2", "gradient-triangle corner (120,119.4) on the line", lambda: 170 - 130 * (120 - 50) / 180, 119.4, dp=1)
v("fc-yt2-2", f"{FC} svgYvsT2", "gradient-triangle corner (190,68.9) on the line", lambda: 170 - 130 * (190 - 50) / 180, 68.9, dp=1)

# ====================================================================
# Sims
# ====================================================================
v("sh-ux", f"{SH} comment", "UX 13.0 m/s", lambda: kick()["ux"], 13.0, sf=3)
v("sh-uy", f"{SH} comment", "UY 7.5 m/s", lambda: kick()["uy"], 7.5, sf=2)
v("sh-T", f"{SH} comment", "T 1.53 s", lambda: kick()["T"], 1.53, sf=3)
v("sh-R", f"{SH} comment", "R 19.9 m", lambda: kick()["R"], 19.9, sf=3)
v("sh-H", f"{SH} comment", "H 2.87 m", lambda: kick()["h_max"], 2.87, sf=3)
b("ps-45", f"{SB} projectile-sim caption ({PS})", "45 deg gives the biggest range on flat ground (5-25 m/s, 0-85 deg)",
  lambda: all(max(range(0, 86), key=lambda a: P.projectile(sp, a)["R"]) == 45 for sp in range(5, 26)))
b("ps-3060", f"{SB} projectile-sim caption ({PS})", "30 and 60 deg land in the same place",
  lambda: all(abs(P.projectile(sp, 30)["R"] - P.projectile(sp, 60)["R"]) < 1e-9 for sp in range(5, 26)))

CLAIMS = C
