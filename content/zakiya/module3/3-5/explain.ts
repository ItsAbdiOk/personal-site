import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries for 3.5. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  s: { label: "$s$", body: "**Displacement**: how far it has moved from the start, in a straight line, in a stated direction. Metres (m). Car example: 54 m." },
  u: { label: "$u$", body: "**Initial velocity**: velocity at the start of the bit of motion you're looking at. 'From rest' means u = 0." },
  v: { label: "$v$", body: "**Final velocity**: velocity at the end of that bit of motion. At the top of a throw, v = 0." },
  a: { label: "$a$", body: "**Acceleration**: how much the velocity changes each second, in m s⁻². Must be constant for suvat. Negative if it points against your positive direction." },
  t: { label: "$t$", body: "**Time** taken, in seconds, from the moment the velocity is u to the moment it is v." },
  g: { label: "$g$", body: "**Acceleration of free fall**, 9.81 m s⁻² (on the data sheet). A falling object gains 9.81 m s⁻¹ every second." },
  suvat: { label: "suvat", body: "Nickname for the four **equations of motion** for constant acceleration in a straight line, from the letters s, u, v, a, t. All four are on the data sheet." },
  "v-t-graph": { label: "velocity–time graph", body: "Velocity up the side, time along the bottom. Constant acceleration gives a **straight line**." },
  gradient: { label: "gradient", body: "The **slope** of a graph: rise ÷ run. On a velocity–time graph the gradient is the acceleration. Particle: 8.0 ÷ 2.0 = 4.0 m s⁻²." },
  area: { label: "area under the graph", body: "On a velocity–time graph, the area between the line and the time axis is the **displacement**. Particle: 8 m + 8 m = 16 m." },
  ut: { label: "$ut$", body: "**u × t**: the distance you'd cover if you just kept your starting speed. The rectangle under the graph: 4.0 × 2.0 = 8 m." },
  "half-v-u-t": { label: "$\\tfrac{1}{2}(v-u)t$", body: "The **extra** distance gained by speeding up: the triangle on top, ½ × base × height = ½ × 2.0 × 8.0 = 8 m. Since v − u = at, it equals ½at²." },
  "average-velocity": { label: "average velocity", body: "With constant acceleration, the average velocity is halfway between start and end: ½(u + v). Particle: ½ × (4.0 + 12) = 8.0 m s⁻¹." },
  "s-vt": { label: "$s = vt - \\tfrac{1}{2}at^2$", body: "The fifth suvat equation, the one with no u. In the textbook only, not on the data sheet; you can always use the other four instead." },
  "minus-g": { label: "$a = -9.81$ m s⁻²", body: "Gravity's acceleration written with **up as positive**: gravity points down, so it is negative. The clip loses 9.81 m s⁻¹ of upward speed each second." },
  deceleration: { label: "deceleration", body: "**Slowing down.** A deceleration of 4.0 m s⁻² means a = −4.0 m s⁻² in suvat (if the motion is the positive direction)." },
  "zero-t": { label: "$0 \\times t = 0$", body: "When u = 0 the ut term vanishes completely: 0 × t is **zero**, not t. Then s = ½at²." },
};

export default explain;
