import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.6. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  stopping: { label: "stopping distance", body: "**Thinking distance + braking distance**: everything from seeing the hazard to standing still. 23 m at 30 mph." },
  thinking: { label: "thinking distance", body: "How far the car goes **before the brakes go on**, still at full speed. 9.0 m at 30 mph." },
  braking: { label: "braking distance", body: "How far the car goes **from brakes on to stopped**. 14.0 m at 30 mph." },
  reaction: { label: "reaction time", body: "Time between **seeing the hazard** and **pressing the brake**. About 0.67 s in the Highway Code. Longer if tired, drunk, on drugs or distracted." },
  hazard: { label: "hazard", body: "Anything that means the driver must stop: a child stepping out, brake lights ahead. The exam word is also **stimulus**." },
  speed: { label: "speed", body: "How fast the car is going, in **m s⁻¹** for calculations (30 mph = 13.4 m s⁻¹). It stays constant during the thinking distance." },
  u: { label: "$u$", body: "**Initial velocity**: the speed when braking starts. In stopping questions it's the car's speed before the hazard." },
  v: { label: "$v$", body: "**Final velocity**. When the car stops, v = 0." },
  a: { label: "$a$", body: "**Acceleration**. When braking it is negative (e.g. −6.4 m s⁻²) because the car is slowing down." },
  s: { label: "$s$", body: "**Displacement**: here, the braking distance in metres." },
  t: { label: "$t$", body: "**Time** in seconds. In the stopping-distance formula d = vt + v²/(2a), t is the reaction time." },
  d: { label: "$d$", body: "**Stopping distance** in metres, when a question uses one letter for it." },
  decel: { label: "deceleration", body: "**Slowing down.** A deceleration of 6.4 m s⁻² means losing 6.4 m s⁻¹ of speed every second. It's the size of a negative acceleration." },
  F: { label: "$F$", body: "**Braking force** in newtons (N): the backwards push from the brakes and road on the car." },
  m: { label: "$m$", body: "**Mass** of the car in kg." },
  ke: { label: "kinetic energy", body: "Energy of movement, **½mv²**. A 950 kg car at 20 m s⁻¹ has 190 000 J. The brakes must remove all of it." },
  work: { label: "work done", body: "**Force × distance** moved along the force. Brakes doing 6000 N over 31.7 m = 190 000 J of work." },
  area: { label: "area under the graph", body: "On a velocity–time graph, **area = distance travelled**. Rectangle = base × height; triangle = ½ × base × height." },
  gradient: { label: "gradient", body: "**Slope** of the line: change in y ÷ change in x. On a velocity–time graph the gradient is the acceleration." },
  prop: { label: "directly proportional", body: "**Double one, double the other.** The graph is a straight line through the origin. Thinking distance ∝ speed." },
  propsq: { label: "proportional to speed²", body: "**Double the speed → four times the distance** (2² = 4). Braking distance ∝ speed² for a constant braking force." },
  mph: { label: "mph", body: "**Miles per hour.** Convert before calculating: 1 mile = 1609 m, 1 hour = 3600 s, so 30 mph = 30 × 1609 ÷ 3600 = 13.4 m s⁻¹." },
  suvat: { label: "SUVAT", body: "The four **equations of motion** for constant acceleration (s, u, v, a, t). All four are on the data sheet." },
  v2eq: { label: "$v^2 = u^2 + 2as$", body: "The SUVAT equation **without time** in it. Use it when you know speeds and distance but not the time." },
  "minus-u2-2s": { label: "$a = -\\dfrac{u^2}{2s}$", body: "$v^2 = u^2 + 2as$ with v = 0, rearranged for a. The minus sign means the car is slowing down." },
  "u2-2a": { label: "$s = \\dfrac{u^2}{2a}$", body: "Braking distance from speed and deceleration (use the size of a). Speed is **squared**, so double speed → 4 × distance." },
  "weight-comp": { label: "component of weight down the slope", body: "On a hill, part of the car's weight (mg sin θ) points **along the road, downhill**. Uphill it helps the brakes; downhill it works against them." },
  intercept: { label: "y-intercept", body: "Where the line crosses the y-axis (x = 0). On a d/v against v graph it's the reaction time." },
  dv: { label: "$d/v$", body: "Stopping distance ÷ speed. Plotting this against v turns the stopping-distance formula into a straight line." },
};

export default explain;
