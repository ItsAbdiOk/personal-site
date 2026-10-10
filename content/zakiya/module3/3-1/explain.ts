import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.1. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  v: { label: "$v$", body: "**Speed** (in this topic). Car example: 2500 m in 82 s gives v = 30 m s⁻¹." },
  x: { label: "$x$", body: "**Distance** travelled along the path, in metres. The textbook uses x for distance." },
  t: { label: "$t$", body: "**Time** in seconds. Always convert minutes and hours to seconds first." },
  delta: { label: "$\\Delta$", body: "**Delta**, Greek capital D. It means **change in**: Δt = later time − earlier time." },
  dx: { label: "$\\Delta x$", body: "**Change in distance**: how far it went. On Figure 2: 1400 − 400 = 1000 m." },
  dt: { label: "$\\Delta t$", body: "**Change in time**: how long it took. On Figure 2: 70 − 20 = 50 s." },
  ms: { label: "m s⁻¹", body: "**Metres per second**, the SI unit of speed. s⁻¹ means \"per second\" (÷ s). Same as m/s." },
  avg: { label: "average speed", body: "**Total distance ÷ total time** for the whole trip. 3800 m in 170 s = 22 m s⁻¹, even though the speed changed on the way." },
  inst: { label: "instantaneous speed", body: "The speed at **one moment**, i.e. over a very short time. It's what a speedometer shows. On a graph: the gradient of the tangent." },
  gradient: { label: "gradient", body: "**Steepness** of a line: rise ÷ run = Δy ÷ Δx (here Δx (distance) ÷ Δt (time)). On a distance–time graph, gradient = speed." },
  tangent: { label: "tangent", body: "A straight line that **just touches** a curve at one point, with the same steepness as the curve there. Draw it with a ruler." },
  constant: { label: "constant speed", body: "Same distance every second. 20 m s⁻¹ means 20 m in the 1st second, 20 m in the 2nd, and so on." },
  scalar: { label: "scalar", body: "A quantity with **size only**, no direction. Speed and distance are scalars; velocity and displacement (3.2) are vectors." },
  km: { label: "km → m", body: "**× 1000**. 2.5 km = 2500 m." },
  min: { label: "min → s", body: "**× 60**. 1 min 22 s = 60 + 22 = 82 s." },
  kmh: { label: "km/h → m/s", body: "**÷ 3.6**, because 1000 m ÷ 3600 s = 1/3.6. 72 km/h ÷ 3.6 = 20 m/s." },
  si: { label: "SI units", body: "The standard units physics uses: metres (m), seconds (s), kilograms (kg). Answers in m s⁻¹ need m and s." },
  rearrange: { label: "distance = speed × time", body: "Same equation, rearranged: multiply both sides by t. 25 m/s for 120 s → 25 × 120 = 3000 m." },
  triangle: { label: "gradient triangle", body: "A right-angled triangle drawn on the line: its height is Δx, its base is Δt. Make it **more than half** the line long for accuracy." },
  sf: { label: "2 s.f.", body: "**Two significant figures**: keep the first two non-zero digits. 30.49 → 30; 0.334 → 0.33. Match the data in the question." },
};

export default explain;
