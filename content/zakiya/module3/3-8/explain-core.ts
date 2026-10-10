import type { Explain } from "@/lib/zakiya/types";

// Tap-to-explain entries shared by every section of 3.8. Key = what goes in {{key}}.
const explain: Record<string, Explain> = {
  vx: { label: "vₓ", body: "The ball's **horizontal (sideways) velocity**. v = velocity, x = the horizontal direction. It stays the same the whole flight." },
  vy: { label: "v~y~", body: "The ball's **vertical (up/down) velocity**. v = velocity, y = the vertical direction. Gravity changes it by 9.81 m s⁻¹ every second." },
  ux: { label: "uₓ", body: "The **starting** horizontal velocity. u always means initial (starting) velocity in SUVAT." },
  uy: { label: "u~y~", body: "The **starting** vertical velocity, the up/down part of the launch speed." },
  u: { label: "u", body: "**Initial velocity**: how fast (and which way) it's moving at the start." },
  theta: { label: "θ", body: "**theta**, the Greek letter used for an angle. Here: the launch angle measured from the horizontal (ground)." },
  g: { label: "g", body: "**Acceleration of free fall**, 9.81 m s⁻². Every second, anything falling freely speeds up downwards by 9.81 m s⁻¹." },
  t: { label: "t", body: "**Time** in seconds. In projectile questions it's the one thing horizontal and vertical motion share." },
  s: { label: "s", body: "**Displacement**: distance in a stated direction. For vertical motion, usually the height fallen or risen." },
  a: { label: "a", body: "**Acceleration**: how fast the velocity changes each second. Vertically it's −g (if up is positive); horizontally it's 0." },
  cos: { label: "cos", body: "**cosine**, a calculator button. Multiply a speed by cos θ to get the part of it that lies **along** the angle's base line, here the sideways part." },
  sin: { label: "sin", body: "**sine**, a calculator button. Multiply a speed by sin θ to get the part of it that lies **across** the base line, here the upward part." },
  gcos90: { label: "g cos 90°", body: "How much of gravity's pull points **sideways**. Gravity points straight down, at 90° to sideways, and cos 90° = 0, so gravity has **no sideways pull**. That's why vₓ never changes." },
  suvat: { label: "SUVAT", body: "The four **equations of motion** for constant acceleration, named after the letters s, u, v, a, t. All four are on the data sheet." },
};

export default explain;
