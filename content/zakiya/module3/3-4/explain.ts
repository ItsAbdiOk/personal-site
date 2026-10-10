import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.4. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  v: { label: "$v$", body: "**Velocity**: speed in a stated direction, in m s⁻¹. On a v–t graph it's the height of the line." },
  u: { label: "$u$", body: "**Initial velocity**: the velocity at the start of the time you're looking at." },
  t: { label: "$t$", body: "**Time** in seconds. On a v–t graph it runs along the bottom axis." },
  s: { label: "$s$", body: "**Displacement**: how far the object is from where it started, in a stated direction. Unit: m." },
  a: { label: "$a$", body: "**Acceleration**: how much the velocity changes each second, in m s⁻². On a v–t graph it's the gradient." },
  dt: { label: "$\\Delta t$", body: "**A short time interval**, e.g. 0.5 s. Δ (delta) means \"change in\"." },
  "v-dt": { label: "$v\\,\\Delta t$", body: "**Velocity × a short time** = the small distance moved in that time. E.g. 6.0 m s⁻¹ × 0.5 s = 3.0 m. It's also the area of a thin strip under the graph." },
  area: { label: "area under the graph", body: "The space between the line and the time axis. Height (m s⁻¹) × width (s) gives metres, so this area is a **displacement**." },
  "area-units": { label: "(m s⁻¹) × s = m", body: "Why area gives metres: the up axis is in m s⁻¹, the across axis in s. Multiply them and the seconds cancel, leaving **m**." },
  gradient: { label: "gradient", body: "**Steepness** of the line: rise ÷ run. On a v–t graph, change in velocity ÷ time taken = **acceleration**." },
  tri: { label: "½ × base × height", body: "**Area of a right-angled triangle.** It's half the rectangle with the same base and height. E.g. ½ × 10 s × 4.0 m s⁻¹ = 20 m." },
  rect: { label: "base × height", body: "**Area of a rectangle.** On a v–t graph: time × steady velocity. E.g. 20 s × 4.0 m s⁻¹ = 80 m." },
  trap: { label: "½ × (a + b) × h", body: "**Area of a trapezium**: half the sum of the two parallel sides, times the distance between them. E.g. ½ × (50 + 20) × 4.0 = 140." },
  parallel: { label: "parallel sides", body: "The two sides of a trapezium that point the same way. On a v–t graph they're usually the **time lengths** (the flat top and the time axis), or the **two velocities** at each end of a sloping section." },
  square: { label: "area of one square", body: "What one grid square is worth: its **width in s × height in m s⁻¹**. E.g. 2 s × 2 m s⁻¹ = 4 m. Not always 1!" },
  avgv: { label: "average velocity", body: "**Total displacement ÷ total time.** E.g. 100 m in 13 s → 7.7 m s⁻¹. Not the average of the start and end velocities, unless the acceleration is constant." },
  avgspeed: { label: "average speed", body: "**Total distance ÷ total time.** A scalar, so direction doesn't matter and it can't be negative." },
  distance: { label: "distance", body: "**Total ground covered**, ignoring direction (a scalar). From a v–t graph: add the sizes of all the areas, ignoring signs." },
  disp: { label: "displacement", body: "**How far from the start, and which way** (a vector). From a v–t graph: area above the axis counts +, area below counts −." },
  neg: { label: "negative velocity", body: "The line is **below the time axis**: the object is moving the **opposite way** to the direction you called positive." },
  tangent: { label: "tangent", body: "A straight line that just touches a curve at one point, with the same steepness there. Its gradient gives the acceleration at that instant." },
  "half-uv": { label: "$s = \\tfrac{1}{2}(u + v)t$", body: "Data-sheet equation. It's just the **trapezium area** under a straight v–t line from u to v over time t." },
};

export default explain;
