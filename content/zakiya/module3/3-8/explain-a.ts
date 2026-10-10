import type { Explain } from "@/lib/zakiya/types";

// Extra tap-to-explain entries added for sections-a. Core entries (explain-core.ts) win on key clashes, so use new keys.
const explain: Record<string, Explain> = {
  component: { label: "component", body: "The **part** of a speed (or force) that points in one direction. A ball kicked at an angle has a sideways part and an upward part; each is a component." },
  parabola: { label: "parabola", body: "The smooth **arch shape** a thrown ball follows. It's the shape you get when sideways speed stays steady while the up/down speed changes at a steady rate." },
  perpendicular: { label: "perpendicular", body: "At **90°** (a right angle) to each other, like the floor and a wall. Horizontal and vertical are perpendicular." },
  x: { label: "$x$", body: "The **horizontal (sideways) distance** travelled, in metres. When it's measured all the way to landing, it's called the range." },
  hypotenuse: { label: "hypotenuse", body: "The **longest side** of a right-angled triangle, the one opposite the 90° corner. Here it's the actual launch speed." },
  adjacent: { label: "next to the angle", body: "In a right-angled triangle, the side that **touches the angle** θ (and isn't the longest side). cos always gives you this side. With θ measured from the ground, it's the sideways one." },
  signs: { label: "sign convention", body: "Deciding which direction counts as **positive** (e.g. up = +). Anything pointing the other way gets a minus sign: so g becomes a = −9.81 m s⁻², and falling 20 m is s = −20 m." },
};

export default explain;
