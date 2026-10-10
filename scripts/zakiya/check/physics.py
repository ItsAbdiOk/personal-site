"""Small deterministic physics calculator (A-level mechanics).

Conventions: SI units, up is positive, g = 9.81 m s^-2 acting downward,
no air resistance. Angles in degrees, measured from the horizontal.
Standard library only.
"""
import math

G = 9.81  # m s^-2, magnitude; acts in the -y direction


def components(u, theta_deg):
    """Resolve speed u at theta_deg above horizontal: ux = u cos(theta), uy = u sin(theta)."""
    th = math.radians(theta_deg)
    ux = u * math.cos(th)
    uy = u * math.sin(th)
    # clean float noise at exact right angles
    if theta_deg % 180 == 90:
        ux = 0.0
    if theta_deg % 180 == 0:
        uy = 0.0
    return ux, uy


def magnitude(vx, vy):
    """|v| = sqrt(vx^2 + vy^2)."""
    return math.hypot(vx, vy)


def angle_to_horizontal_deg(vx, vy):
    """Angle to horizontal, always positive: atan(|vy| / |vx|), degrees."""
    return math.degrees(math.atan2(abs(vy), abs(vx)))


def fall_time(h):
    """Time to fall height h >= 0 from rest vertically: h = 1/2 g t^2 -> t = sqrt(2h/g)."""
    if h < 0:
        raise ValueError("h must be >= 0")
    return math.sqrt(2 * h / G)


def suvat_s(u, a, t):
    """s = ut + 1/2 a t^2 (displacement, sign follows u and a)."""
    return u * t + 0.5 * a * t * t


def suvat_v(u, a, t):
    """v = u + at."""
    return u + a * t


def suvat_v_from_s(u, a, s):
    """v^2 = u^2 + 2as; returns the positive root. Raises ValueError if v^2 < 0."""
    v2 = u * u + 2 * a * s
    if v2 < 0:
        raise ValueError("v^2 < 0: no real final speed")
    return math.sqrt(v2)


def suvat_t_from_s(u, a, s):
    """All real roots t of s = ut + 1/2 a t^2, sorted ascending (may include negatives)."""
    if a == 0:
        if u == 0:
            return []
        return [s / u]
    disc = u * u + 2 * a * s
    if disc < 0:
        return []
    r = math.sqrt(disc)
    return sorted({(-u - r) / a, (-u + r) / a}) if r == 0 else sorted([(-u - r) / a, (-u + r) / a])


def projectile(u, theta_deg, h0=0.0):
    """Projectile launched at speed u, theta_deg above horizontal, from height h0 >= 0.

    Up positive, g downward, lands at y = 0. Returns dict: ux, uy, t_peak,
    h_max (above launch point), T (flight time), R (horizontal range),
    vx_land, vy_land (negative = downward), v_land, angle_land_deg (below horizontal).
    """
    if h0 < 0:
        raise ValueError("h0 must be >= 0")
    ux, uy = components(u, theta_deg)
    t_peak = uy / G if uy > 0 else 0.0
    h_max = uy * uy / (2 * G) if uy > 0 else 0.0
    # y = h0 + uy t - 1/2 G t^2 = 0 -> positive root
    T = (uy + math.sqrt(uy * uy + 2 * G * h0)) / G
    R = ux * T
    vx_land = ux
    vy_land = uy - G * T
    return {
        "ux": ux, "uy": uy, "t_peak": t_peak, "h_max": h_max,
        "T": T, "R": R, "vx_land": vx_land, "vy_land": vy_land,
        "v_land": magnitude(vx_land, vy_land),
        "angle_land_deg": angle_to_horizontal_deg(vx_land, vy_land),
    }


def position(u, theta_deg, t, h0=0.0):
    """(x, y) at time t: x = ux t, y = h0 + uy t - 1/2 g t^2."""
    ux, uy = components(u, theta_deg)
    return ux * t, h0 + uy * t - 0.5 * G * t * t


def velocity(u, theta_deg, t):
    """(vx, vy) at time t: vx = ux, vy = uy - g t (up positive)."""
    ux, uy = components(u, theta_deg)
    return ux, uy - G * t


def kinetic_energy(m, v):
    """E_k = 1/2 m v^2."""
    return 0.5 * m * v * v


def speed_from_ke(E, m):
    """v = sqrt(2E/m)."""
    return math.sqrt(2 * E / m)


def spring_energy(k, x):
    """Elastic energy = 1/2 k x^2."""
    return 0.5 * k * x * x


def weight(m):
    """W = m g (newtons, magnitude)."""
    return m * G


def time_from_frames(n_frames, fps):
    """t = n_frames / fps."""
    return n_frames / fps


def g_from_y_t2_gradient(gradient):
    """For y = 1/2 g t^2, graph of y against t^2 has gradient g/2, so g = 2 x gradient."""
    return 2 * gradient


def round_sf(x, sf):
    """Round x to sf significant figures."""
    if x == 0:
        return 0.0
    return round(x, sf - 1 - int(math.floor(math.log10(abs(x)))))


def round_dp(x, dp):
    """Round x to dp decimal places."""
    return round(x, dp)
