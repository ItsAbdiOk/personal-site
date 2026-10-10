import math
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import physics as p


class TextbookTests(unittest.TestCase):
    def test_horizontal_launch(self):
        r = p.projectile(304, 0, 44.1)
        self.assertAlmostEqual(r["T"], 3.00, delta=0.005)
        self.assertAlmostEqual(r["R"], 912, delta=1)

    def test_thrown_horizontally(self):
        r = p.projectile(49.2, 0, 29.4)
        self.assertAlmostEqual(r["v_land"], 54.7, delta=0.05)
        self.assertAlmostEqual(r["angle_land_deg"], 26.0, delta=0.05)

    def test_kick(self):
        r = p.projectile(15, 30)
        self.assertAlmostEqual(r["T"], 1.53, delta=0.005)
        self.assertAlmostEqual(r["R"], 19.9, delta=0.05)
        self.assertAlmostEqual(r["R"], 20, delta=0.2)


class ConsistencyTests(unittest.TestCase):
    def test_symmetry_level_ground(self):
        for u, th in [(15, 30), (20, 45), (7, 80)]:
            r = p.projectile(u, th)
            self.assertAlmostEqual(r["v_land"], u, places=9)
            self.assertAlmostEqual(r["angle_land_deg"], th, places=9)
            self.assertAlmostEqual(r["T"], 2 * r["t_peak"], places=9)

    def test_range_and_position(self):
        for u, th, h0 in [(15, 30, 0), (20, 40, 12), (5, -20, 3)]:
            r = p.projectile(u, th, h0)
            self.assertAlmostEqual(r["R"], r["ux"] * r["T"], places=9)
            x, y = p.position(u, th, r["T"], h0)
            self.assertAlmostEqual(y, 0, places=9)
            self.assertAlmostEqual(x, r["R"], places=9)
            vx, vy = p.velocity(u, th, r["T"])
            self.assertAlmostEqual(vy, r["vy_land"], places=9)

    def test_t_peak_and_hmax(self):
        r = p.projectile(20, 35)
        self.assertAlmostEqual(r["t_peak"], r["uy"] / p.G, places=12)
        self.assertAlmostEqual(r["h_max"], p.position(20, 35, r["t_peak"])[1], places=9)

    def test_quadratic_equals_split_route(self):
        u, th, h0 = 18.0, 25.0, 30.0
        r = p.projectile(u, th, h0)
        _, uy = p.components(u, th)
        top = h0 + uy ** 2 / (2 * p.G)
        t_up = uy / p.G
        t_total = t_up + p.fall_time(top)
        self.assertAlmostEqual(r["T"], t_total, places=9)
        roots = p.suvat_t_from_s(uy, -p.G, -h0)
        self.assertEqual(roots, sorted(roots))
        self.assertAlmostEqual(roots[-1], r["T"], places=9)
        self.assertLess(roots[0], 0)

    def test_energy_conservation(self):
        for u, th, h0 in [(15, 30, 0), (20, 40, 12), (5, -20, 3), (304, 0, 44.1)]:
            m = 2.5
            r = p.projectile(u, th, h0)
            e0 = p.kinetic_energy(m, u) + m * p.G * h0
            e1 = p.kinetic_energy(m, r["v_land"])
            self.assertAlmostEqual(e0, e1, places=6)

    def test_edge_theta_zero(self):
        r = p.projectile(10, 0, 20)
        self.assertEqual(r["t_peak"], 0.0)
        self.assertEqual(r["h_max"], 0.0)
        self.assertAlmostEqual(r["T"], p.fall_time(20), places=12)

    def test_edge_theta_90(self):
        r = p.projectile(10, 90)
        self.assertEqual(r["ux"], 0.0)
        self.assertEqual(r["R"], 0.0)
        self.assertAlmostEqual(r["T"], 20 / p.G, places=12)
        self.assertAlmostEqual(r["h_max"], 100 / (2 * p.G), places=12)
        self.assertAlmostEqual(r["angle_land_deg"], 90.0, places=9)

    def test_downward_launch(self):
        r = p.projectile(10, -30, 5)
        self.assertEqual(r["t_peak"], 0.0)
        self.assertEqual(r["h_max"], 0.0)
        self.assertGreater(r["T"], 0)


class HelperTests(unittest.TestCase):
    def test_suvat(self):
        self.assertAlmostEqual(p.suvat_s(2, 3, 4), 32)
        self.assertAlmostEqual(p.suvat_v(2, 3, 4), 14)
        self.assertAlmostEqual(p.suvat_v_from_s(0, 9.81, 10), math.sqrt(196.2))
        with self.assertRaises(ValueError):
            p.suvat_v_from_s(1, -10, 5)
        self.assertEqual(p.suvat_t_from_s(1, -10, 5), [])

    def test_energy_and_misc(self):
        self.assertAlmostEqual(p.kinetic_energy(2, 3), 9)
        self.assertAlmostEqual(p.speed_from_ke(9, 2), 3)
        self.assertAlmostEqual(p.spring_energy(100, 0.1), 0.5)
        self.assertAlmostEqual(p.weight(2), 19.62)
        self.assertAlmostEqual(p.time_from_frames(30, 60), 0.5)
        self.assertAlmostEqual(p.g_from_y_t2_gradient(4.905), 9.81)
        self.assertAlmostEqual(p.fall_time(44.1), math.sqrt(2 * 44.1 / 9.81))

    def test_rounding(self):
        self.assertEqual(p.round_sf(912.34, 3), 912)
        self.assertEqual(p.round_sf(0.012345, 2), 0.012)
        self.assertEqual(p.round_sf(0, 3), 0.0)
        self.assertEqual(p.round_dp(3.14159, 2), 3.14)

    def test_components_and_angle(self):
        ux, uy = p.components(10, 90)
        self.assertEqual(ux, 0.0)
        self.assertAlmostEqual(uy, 10)
        self.assertAlmostEqual(p.angle_to_horizontal_deg(3, -3), 45)
        self.assertAlmostEqual(p.magnitude(3, 4), 5)


if __name__ == "__main__":
    unittest.main()
