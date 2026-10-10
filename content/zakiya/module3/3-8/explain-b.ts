import type { Explain } from "@/lib/zakiya/types";

// Extra tap-to-explain entries added for sections-b. Core entries (explain-core.ts) win on key clashes, so use new keys.
const explain: Record<string, Explain> = {
  "uy-zero": { label: "u cos 90° = 0", body: "The launch is pointing sideways, which is 90° away from vertical. The vertical share of a speed is speed × cos(angle from vertical), and cos 90° = 0. So a sideways launch gives **no starting up/down speed**." },
  "flight-time": { label: "time of flight", body: "How long the object is **in the air**, from launch to landing, in seconds. You always get it from the **up/down** motion." },
  resultant: { label: "resultant", body: "The **single** velocity you get by combining the sideways and up/down parts. It's the actual speed and direction the object is moving." },
  pythag: { label: "Pythagoras", body: "For a right-angled triangle: long side² = side² + other side². Sideways and up/down velocities are at right angles, so actual speed = √(vₓ² + v~y~²)." },
  "tan-inv": { label: "tan⁻¹", body: "**inverse tan**, the SHIFT + tan button. Give it (opposite ÷ adjacent) and it gives back the **angle**. Here: tan⁻¹(up/down speed ÷ sideways speed) = angle to the horizontal." },
  magnitude: { label: "magnitude", body: "The **size** of a vector, ignoring direction. For velocity, the magnitude is the speed (e.g. 54.7 m s⁻¹)." },
  "impact-angle": { label: "angle to the horizontal", body: "The angle between the direction of motion and the **flat ground**. Always say whether your angle is to the horizontal or the vertical: they add up to 90°." },
  "ke-land": { label: "KE on landing", body: "Kinetic energy = ½ × mass × speed². Use the **actual** (resultant) speed, so v² = vₓ² + v~y~². Using only one component misses some of the energy." },
  resolve: { label: "resolve", body: "Split one angled velocity into a **sideways part** (× cos θ) and an **upward part** (× sin θ) that together do the same job." },
  "max-height": { label: "maximum height", body: "The highest point of the path. There the up/down speed is **zero** for an instant; the sideways speed is still there." },
  symmetric: { label: "symmetric", body: "The way up is a mirror image of the way down: same time, same speeds at the same heights. Only true when it lands at the **same height** it was launched from and there's no air resistance." },
  "range-dist": { label: "range", body: "The **horizontal distance** from launch point to landing point. Range = sideways speed × time of flight." },
};

export default explain;
