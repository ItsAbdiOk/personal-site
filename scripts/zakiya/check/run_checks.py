"""Run every claim in claims_3_8.py against physics.py and print a markdown table.

PASS      claimed == computed rounded to the shown precision (or relationship holds / key correct / window ok)
ROUNDING  differs by exactly 1 in the last shown digit (names the rounded-intermediate path if one reproduces it)
FAIL      anything else
UNCHECKED not expressible with physics.py

Usage: python run_checks.py [--claims claims_formulas_m3] [output.md]   Exit code 1 if any FAIL.
(--claims picks another claims module in this folder; default claims_3_8.)
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib  # noqa: E402
import physics as P  # noqa: E402

CLAIMS_MODULE = "claims_3_8"
if "--claims" in sys.argv:
    _i = sys.argv.index("--claims")
    CLAIMS_MODULE = sys.argv[_i + 1]
    del sys.argv[_i:_i + 2]
CLAIMS = importlib.import_module(CLAIMS_MODULE).CLAIMS


def rnd(x, c):
    return P.round_sf(x, c["shown_sf"]) if c.get("shown_sf") else P.round_dp(x, c["shown_dp"])


def ulp(c):
    if c.get("shown_dp") is not None and not c.get("shown_sf"):
        return 10.0 ** (-c["shown_dp"])
    mag = math.floor(math.log10(abs(c["claimed"]))) if c["claimed"] else 0
    return 10.0 ** (mag - c["shown_sf"] + 1)


def prec(c):
    return f"{c['shown_sf']} sf" if c.get("shown_sf") else f"{c['shown_dp']} dp"


def same(a, b2, unit):
    return abs(a - b2) < unit * 1e-6


def fmt(x):
    if isinstance(x, bool):
        return str(x)
    if isinstance(x, (int, float)):
        return f"{x:.6g}"
    return str(x)


def check(c):
    k = c["kind"]
    if k == "unchecked":
        return "UNCHECKED", "", "", c["reason"]
    if k == "bool":
        ok = bool(c["fn"]())
        return ("PASS" if ok else "FAIL"), "True", str(ok), c.get("note", "")
    if k == "value":
        val = c["fn"]()
        r = rnd(val, c)
        unit = ulp(c)
        note = c.get("note", "")
        alt_txt = ""
        if c.get("alt"):
            label, fn = c["alt"]
            av = fn()
            alt_txt = f"alt path '{label}' gives {fmt(av)} -> {fmt(rnd(av, c))}"
        if same(r, c["claimed"], unit):
            st = "PASS"
            det = f"{prec(c)}"
        elif abs(abs(r - c["claimed"]) - unit) < unit * 1e-6:
            st = "ROUNDING"
            if c.get("alt") and same(rnd(c["alt"][1](), c), c["claimed"], unit):
                det = f"off by 1 in last digit; reproduced by {alt_txt}"
            else:
                det = f"off by 1 in last digit ({prec(c)}); no specific path identified" + (f"; {alt_txt}" if alt_txt else "")
        else:
            st = "FAIL"
            det = f"{prec(c)}; rounded computed = {fmt(r)}" + (f"; {alt_txt}" if alt_txt else "")
        if note:
            det += f"; note: {note}"
        return st, fmt(c["claimed"]), fmt(val), det
    if k == "mcq":
        val = c["fn"]()
        r = P.round_dp(val, c["shown_dp"])
        hits = [i for i, o in enumerate(c["options"]) if abs(o - r) < 1e-9]
        ok = hits == [c["correct_index"]]
        letters = "ABCD"
        det = f"computed {fmt(val)} -> {r} matches option(s) {[letters[i] for i in hits]}; key {letters[c['correct_index']]}"
        return ("PASS" if ok else "FAIL"), letters[c["correct_index"]], fmt(val), det
    if k == "window":
        lo = c["value"] * (1 - c["tol_pct"] / 100)
        hi = c["value"] * (1 + c["tol_pct"] / 100)
        outs, parts = [], []
        for label, t in c["tests"]:
            x = t() if callable(t) else t
            inside = lo <= x <= hi
            parts.append(f"{label} {fmt(x)}{'' if inside else ' OUTSIDE'}")
            if not inside:
                outs.append(label)
        det = f"window [{lo:.5g}, {hi:.5g}]: " + "; ".join(parts)
        if c.get("note"):
            det += f"; note: {c['note']}"
        return ("FAIL" if outs else "PASS"), f"{c['value']} ± {c['tol_pct']}%", "", det
    raise ValueError(k)


def main():
    rows, counts = [], {"PASS": 0, "ROUNDING": 0, "FAIL": 0, "UNCHECKED": 0}
    for c in CLAIMS:
        try:
            st, cl, comp, det = check(c)
        except Exception as e:  # a claim that crashes is a FAIL, not a silent skip
            st, cl, comp, det = "FAIL", fmt(c.get("claimed", "")), "", f"error: {e!r}"
        counts[st] += 1
        rows.append((c["id"], st, c["where"], c["quote"], cl, comp, det))

    esc = lambda s: str(s).replace("|", "\\|")
    title = "3.8 Projectile motion" if CLAIMS_MODULE == "claims_3_8" else CLAIMS_MODULE
    out = [f"# {title}: deterministic maths check", "",
           f"Library: scripts/zakiya/check/physics.py (g = {P.G}). Claims: scripts/zakiya/check/{CLAIMS_MODULE}.py. "
           "Runner: scripts/zakiya/check/run_checks.py.", "",
           f"**Total {len(rows)}: PASS {counts['PASS']} · ROUNDING {counts['ROUNDING']} · "
           f"FAIL {counts['FAIL']} · UNCHECKED {counts['UNCHECKED']}**", ""]
    order = {"FAIL": 0, "ROUNDING": 1, "UNCHECKED": 2, "PASS": 3}
    out += ["| id | status | where | claim | claimed | computed | detail |", "|---|---|---|---|---|---|---|"]
    for r in sorted(rows, key=lambda r: order[r[1]]):
        out.append("| " + " | ".join(esc(x) for x in r) + " |")
    text = "\n".join(out) + "\n"
    print(text)
    if len(sys.argv) > 1:
        with open(sys.argv[1], "w") as f:
            f.write(text)
    return 1 if counts["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
