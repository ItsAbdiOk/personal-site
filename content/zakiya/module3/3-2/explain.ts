import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.2. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  distance: { label: "distance", body: "How far along the **path** something travelled, ignoring direction. A scalar. Two 50 m lengths of a pool = 100 m." },
  displacement: { label: "displacement", body: "The **straight-line** distance from the start to where the object is now, **in a stated direction**. A vector. Swim there and back: 0 m." },
  s: { label: "$s$", body: "**Displacement**, in metres (m). It has a direction, so it can be negative (e.g. back past the start)." },
  x: { label: "$x$", body: "**Distance** travelled along the path, in metres. The textbook uses x for distance and s for displacement." },
  speed: { label: "speed", body: "How fast, with **no direction**. A scalar. Average speed = distance ÷ time." },
  velocity: { label: "velocity", body: "Speed **in a direction**. A vector. It is the ==rate of change of displacement==: v = Δs ÷ Δt." },
  v: { label: "$v$", body: "**Velocity** in m s⁻¹. In this topic it can also be negative, which just means it points the other way." },
  scalar: { label: "scalar", body: "A quantity with **size (magnitude) only**, no direction. Distance, speed, time, mass, energy." },
  vector: { label: "vector", body: "A quantity with ==both magnitude and direction==. Displacement, velocity, acceleration, force." },
  magnitude: { label: "magnitude", body: "The **size** of a quantity, ignoring its direction. The magnitude of −4.0 m s⁻¹ is 4.0 m s⁻¹." },
  delta: { label: "Δ", body: "**Delta**, a Greek capital D. It means \"change in\": Δs = final displacement − starting displacement." },
  "delta-s": { label: "$\\Delta s$", body: "**Change in displacement**: where it ended up minus where it started. Harrogate to Leeds: 21 km south." },
  "delta-t": { label: "$\\Delta t$", body: "**Time taken** (change in time), in seconds. 37 min = 37 × 60 = 2220 s." },
  "delta-x": { label: "$\\Delta x$", body: "**Distance travelled** along the path. Harrogate to Leeds by road: 24 km." },
  "avg-velocity": { label: "average velocity", body: "Change in displacement ÷ time taken. Only start and finish matter, not the route." },
  "avg-speed": { label: "average speed", body: "Total distance ÷ total time. The whole route counts. Always ≥ the size of the average velocity." },
  "inst-velocity": { label: "instantaneous velocity", body: "The velocity **at one moment**. On a curved s–t graph, it is the gradient of the tangent at that time." },
  ms: { label: "m s⁻¹", body: "**Metres per second**, the SI unit of speed and velocity. Same as m/s; s⁻¹ means \"per second\"." },
  "x60": { label: "× 60", body: "There are 60 seconds in a minute, so minutes × 60 = seconds. Physics formulas want SI units: m and s." },
  "km-m": { label: "× 1000", body: "1 km = 1000 m, so 24 km = 24 000 m. Convert before dividing by seconds." },
  "st-graph": { label: "s–t graph", body: "**Displacement–time graph**: displacement up the side (y-axis), time along the bottom (x-axis)." },
  gradient: { label: "gradient", body: "How **steep** a line is: change up the side ÷ change along the bottom (Δy ÷ Δx). On an s–t graph that is Δs ÷ Δt = velocity." },
  tangent: { label: "tangent", body: "A straight line drawn with a ruler that **just touches** a curve at one point and has the same steepness as the curve there." },
  chord: { label: "chord", body: "A straight line joining **two points** on a curve. Its gradient is the **average** velocity between them, not the velocity at either point." },
  stationary: { label: "stationary", body: "**Not moving**: displacement stays the same, so the s–t graph is flat and the velocity is 0." },
  "neg-v": { label: "negative velocity", body: "Moving in the **opposite** direction to the one you called positive. −4.0 m s⁻¹ = 4.0 m s⁻¹ backwards." },
  "rate-of-change": { label: "rate of change", body: "How much something changes **per unit time** (here: per second). Velocity is the rate of change of displacement." },
  "delta-v": { label: "$\\Delta v$", body: "**Change in velocity** = final velocity − initial velocity, keeping the signs. +5.0 to −3.0 is a change of −8.0 m s⁻¹." },
  u: { label: "$u$", body: "**Initial velocity** (at the start). Signs matter: choose one direction as +." },
  "sign-convention": { label: "sign convention", body: "Pick one direction to be **positive** (e.g. towards the wall) before you start. Anything the other way gets a minus sign." },
};

export default explain;
