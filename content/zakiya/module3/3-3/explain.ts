import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.3 Acceleration. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  a: { label: "$a$", body: "**Acceleration**: how much the velocity changes **each second**. 2.0 m s⁻² means the velocity goes up by 2.0 m s⁻¹ every second." },
  v: { label: "$v$", body: "**Velocity**: speed in a stated direction, in m s⁻¹. In $v = u + at$ it means the **final** velocity." },
  u: { label: "$u$", body: "**Initial velocity**: the velocity at the start of the time you're looking at." },
  t: { label: "$t$", body: "**Time** in seconds." },
  Delta: { label: "$\\Delta$", body: "**Delta**, the Greek capital D. It means **change in**: final value − starting value. Δv = 27.8 − 0 = 27.8 m s⁻¹." },
  Dv: { label: "$\\Delta v$", body: "**Change in velocity** = final velocity − starting velocity. Always final minus start, so slowing down gives a negative number." },
  Dt: { label: "$\\Delta t$", body: "**Time taken** for the change, in seconds. E.g. 2.46 s for the Bugatti to reach 27.8 m s⁻¹." },
  vminusu: { label: "$v - u$", body: "**Final velocity − initial velocity**, the same thing as Δv. Bugatti braking: 0 − 27.8 = −27.8 m s⁻¹." },
  ms2: { label: "m s⁻²", body: "**Metres per second squared**, the unit of acceleration. Read it as \"m s⁻¹ gained every second\": (m s⁻¹) ÷ s = m s⁻²." },
  ms1: { label: "m s⁻¹", body: "**Metres per second**, the unit of speed and velocity." },
  kmh: { label: "km/h → m s⁻¹", body: "To change km/h into m s⁻¹, **divide by 3.6** (1000 m per km ÷ 3600 s per hour). 100 km/h ÷ 3.6 = 27.8 m s⁻¹." },
  vector: { label: "vector", body: "A quantity with **size and direction**. Velocity and acceleration are vectors, so a minus sign means \"the other way\"." },
  decel: { label: "deceleration", body: "A **negative acceleration** when the object is moving forwards: it is **slowing down**. −11.9 m s⁻² is a deceleration of 11.9 m s⁻²." },
  minus: { label: "the minus sign", body: "In a = −11.9 m s⁻², the minus says the acceleration points **backwards**, against the motion. The velocity is getting smaller." },
  magnitude: { label: "magnitude", body: "The **size** of a vector, ignoring its direction (drop the minus sign). The magnitude of −0.50 m s⁻² is 0.50 m s⁻²." },
  vtgraph: { label: "v–t graph", body: "**Velocity–time graph**: velocity up the side (y-axis), time along the bottom (x-axis). Check the axis label: it is easy to mix up with a displacement–time graph." },
  atgraph: { label: "a–t graph", body: "**Acceleration–time graph**: acceleration up the side, time along the bottom. Its height at any time is the gradient of the v–t graph then." },
  grad: { label: "gradient", body: "**Steepness** of a line: rise ÷ run = change in y ÷ change in x. On a v–t graph that is Δv ÷ Δt, which is the acceleration." },
  rise: { label: "rise", body: "How far the line goes **up** between two points on it, read off the y-axis. On a v–t graph it is Δv." },
  run: { label: "run", body: "How far **along** you go between the same two points, read off the x-axis. On a v–t graph it is Δt." },
  tangent: { label: "tangent", body: "A straight line that **just touches** a curve at one point and has the same steepness there. Its gradient gives the acceleration at that instant." },
  instant: { label: "instantaneous acceleration", body: "The acceleration **at one moment**, found from the gradient of the tangent at that time. Different from the average over a long interval." },
  average: { label: "average acceleration", body: "Total Δv ÷ total Δt for the whole interval. It hides any speeding up or slowing down in the middle." },
  g: { label: "$g$", body: "**Acceleration of free fall**, 9.81 m s⁻². A dropped object gains 9.81 m s⁻¹ of downward velocity every second (no air resistance)." },
  terminal: { label: "terminal velocity", body: "The **steady top speed** of a falling object, when air resistance has grown to equal its weight. Acceleration is then zero: the v–t graph goes flat." },
  suvat: { label: "$v = u + at$", body: "One of the four **equations of motion** on the data sheet. Rearranged, it is $a = (v - u) \\div t$, the same as a = Δv/Δt." },
};

export default explain;
