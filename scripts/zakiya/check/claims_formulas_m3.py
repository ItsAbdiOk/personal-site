"""Numerical claims in the Module 3 formula sheet (content/zakiya/formulas/module3.ts), recomputed with physics.py.

Same record kinds as claims_3_8.py. Run: python run_checks.py --claims claims_formulas_m3
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as P  # noqa: E402

G = P.G
F = "content/zakiya/formulas/module3.ts"
C = []


def v(id, where, quote, fn, claimed, sf=None, dp=None, alt=None, note=""):
    C.append(dict(kind="value", id=id, where=where, quote=quote, fn=fn, claimed=claimed,
                  shown_sf=sf, shown_dp=dp, inputs={}, alt=alt, note=note))


def b(id, where, quote, fn, note=""):
    C.append(dict(kind="bool", id=id, where=where, quote=quote, fn=fn, claimed=True, inputs={}, note=note))


kick = lambda: P.projectile(15, 30)

# v = u + at : kick time of flight (textbook p. 42-43)
v("vuat-t", f"{F} suvat-v-u-at", "t = (-7.5 - 7.5) / -9.81 = 1.53 s", lambda: P.suvat_t_from_s(7.5, -G, 0)[-1], 1.53, sf=3)
v("vuat-t-T", f"{F} suvat-v-u-at", "1.53 s matches full projectile flight time", lambda: kick()["T"], 1.53, sf=3)
b("vuat-v", f"{F} suvat-v-u-at", "landing vy = -7.5 m/s", lambda: abs(P.suvat_v(7.5, -G, 15 / G) + 7.5) < 1e-9)
v("vuat-R", f"{F} suvat-v-u-at", "13.0 x 1.53 = about 20 m", lambda: kick()["R"], 20, sf=2, alt=("13.0 x 1.53", lambda: 13.0 * 1.53))
v("vuat-R-rounded", f"{F} suvat-v-u-at", "13.0 x 1.53 (rounded inputs) about 20 m", lambda: 13.0 * 1.53, 20, sf=2)

# s = 1/2(u+v)t : kick max height (ours)
v("savg-tpeak", f"{F} suvat-s-avg", "time to top 7.5 / 9.81 = 0.765 s", lambda: kick()["t_peak"], 0.765, sf=3)
v("savg-avg", f"{F} suvat-s-avg", "1/2 (7.5 + 0) = 3.75 m/s", lambda: 0.5 * (kick()["uy"] + 0), 3.75, sf=3)
v("savg-s", f"{F} suvat-s-avg", "s = 3.75 x 0.765 = 2.87 m", lambda: kick()["h_max"], 2.87, sf=3,
  alt=("3.75 x 0.765", lambda: 3.75 * 0.765))
v("savg-s-rounded", f"{F} suvat-s-avg", "3.75 x 0.765 (shown working) = 2.87", lambda: 3.75 * 0.765, 2.87, sf=3)

# s = ut + 1/2 at^2 : cannonball time (textbook p. 40-41)
v("sut-t2", f"{F} suvat-s-ut", "t^2 = 2 x 44.1 / 9.81 = 8.99 s^2", lambda: P.fall_time(44.1) ** 2, 8.99, sf=3)
v("sut-t", f"{F} suvat-s-ut", "t = 3.00 s", lambda: P.suvat_t_from_s(0, G, 44.1)[-1], 3.00, sf=3)

# v^2 = u^2 + 2as : arrow vy (textbook p. 42)
v("v2-v2", f"{F} suvat-v2", "v^2 = 2 x 9.81 x 29.4 = 577", lambda: P.suvat_v_from_s(0, G, 29.4) ** 2, 577, sf=3)
v("v2-v", f"{F} suvat-v2", "v = 24.0 m/s", lambda: P.suvat_v_from_s(0, G, 29.4), 24.0, sf=3)

# components : kick (textbook p. 42-43)
v("comp-ux", f"{F} proj-components", "ux = 15 cos 30 = 13.0", lambda: P.components(15, 30)[0], 13.0, sf=3)
v("comp-uy", f"{F} proj-components", "uy = 15 sin 30 = 7.5", lambda: P.components(15, 30)[1], 7.5, sf=2)

# x = vx t : cannonball (textbook p. 40-41)
v("range-x", f"{F} proj-range", "x = 304 x 3.00 = 912 m", lambda: P.projectile(304, 0, 44.1)["R"], 912, sf=3,
  alt=("304 x 3.00", lambda: 304 * 3.00))
v("range-x-rounded", f"{F} proj-range", "304 x 3.00 (shown working) = 912", lambda: 304 * 3.00, 912, sf=3)

# t = sqrt(2h/g) : cannonball (textbook p. 40-41)
v("fall-inside", f"{F} proj-fall-time", "2 x 44.1 / 9.81 = 8.99", lambda: 2 * 44.1 / G, 8.99, sf=3)
v("fall-t", f"{F} proj-fall-time", "t = 3.00 s", lambda: P.fall_time(44.1), 3.00, sf=3)
v("fall-t-proj", f"{F} proj-fall-time", "3.00 s = flight time of projectile(304, 0 deg, 44.1 m)", lambda: P.projectile(304, 0, 44.1)["T"], 3.00, sf=3)

# v = sqrt(vx^2 + vy^2) : arrow (textbook p. 42)
v("speed-vx2", f"{F} proj-speed", "49.2^2 = 2420.64", lambda: 49.2 ** 2, 2420.64, dp=2)
v("speed-vy2", f"{F} proj-speed", "24.0^2 = 576", lambda: 24.0 ** 2, 576, dp=0)
v("speed-sum", f"{F} proj-speed", "2420.64 + 576 = 2996.64", lambda: 49.2 ** 2 + 24.0 ** 2, 2996.64, dp=2)
v("speed-v", f"{F} proj-speed", "v = 54.7 m/s (rounded vy 24.0)", lambda: P.magnitude(49.2, 24.0), 54.7, sf=3)
v("speed-v-exact", f"{F} proj-speed", "v = 54.7 m/s (unrounded)", lambda: P.projectile(49.2, 0, 29.4)["v_land"], 54.7, sf=3)
b("speed-not-add", f"{F} proj-speed notes", "49.2 + 24.0 = 73.2 (wrong method)", lambda: abs(49.2 + 24.0 - 73.2) < 1e-9)

# theta = tan^-1(vy/vx) : arrow (textbook p. 42)
v("angle-ratio", f"{F} proj-angle", "24.0 / 49.2 = 0.488", lambda: 24.0 / 49.2, 0.488, sf=3)
v("angle-theta", f"{F} proj-angle", "theta = 26.0 deg", lambda: P.angle_to_horizontal_deg(49.2, 24.0), 26.0, sf=3)
v("angle-theta-exact", f"{F} proj-angle", "theta = 26.0 deg (unrounded)", lambda: P.projectile(49.2, 0, 29.4)["angle_land_deg"], 26.0, sf=3)

# explain-map numbers
v("ex-tan", f"{F} explain.tan-inv", "tan^-1(0.488) = 26.0", lambda: P.angle_to_horizontal_deg(1, 0.488), 26.0, sf=3)

CLAIMS = C
