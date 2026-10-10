import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.2. Every number is drawn where it lives, with a key underneath:
// value · plain words (bold), then the exam term (muted).
// Colours: --vy for distance / path things, --accent for displacement / velocity things.
// All numbers recomputed in Python.

const head = (id: string, h: number, w = 340) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
    <marker id="${id}-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

const t = (x: number, y: number, s: string, extra = "") =>
  `<text x="${x}" y="${y}" fill="currentColor" stroke="none" ${extra}>${s}</text>`;

// Axes for a graph whose plot area is x 50–320, y 200 (zero) up to 50.
const axes = (xLabel: string, yLabel: string, xTicks: [number, string][], yTicks: [number, string][]) => `
  <g stroke-width="0.6" opacity="0.25">
    ${xTicks.map(([x]) => `<line x1="${x}" y1="50" x2="${x}" y2="200"/>`).join("")}
    ${yTicks.map(([y]) => `<line x1="50" y1="${y}" x2="320" y2="${y}"/>`).join("")}
  </g>
  <line x1="50" y1="200" x2="326" y2="200" stroke-width="1.4"/>
  <line x1="50" y1="200" x2="50" y2="44" stroke-width="1.4"/>
  <g fill="currentColor" stroke="none" font-size="11">
    ${xTicks.map(([x, l]) => `<text x="${x}" y="215" text-anchor="middle">${l}</text>`).join("")}
    ${yTicks.map(([y, l]) => `<text x="44" y="${y + 4}" text-anchor="end">${l}</text>`).join("")}
    <text x="185" y="232" text-anchor="middle">${xLabel}</text>
    <text x="14" y="125" text-anchor="middle" transform="rotate(-90 14 125)">${yLabel}</text>
  </g>`;

// ---------- Missy Franklin, 100 m backstroke (Textbook p. 24) ----------
const svgPool = `${head("d2-pool", 310)}
  <rect x="30" y="34" width="280" height="64" rx="4" stroke-width="1.4" style="fill:var(--muted)" fill-opacity="0.12"/>
  ${t(170, 24, "50 m pool, 2 lengths", 'text-anchor="middle" font-size="12"')}
  <line x1="42" y1="54" x2="298" y2="54" stroke-width="2.4" style="stroke:var(--vy)" marker-end="url(#d2-pool-p)"/>
  <line x1="298" y1="78" x2="42" y2="78" stroke-width="2.4" style="stroke:var(--vy)" marker-end="url(#d2-pool-p)"/>
  <g stroke="none" style="fill:var(--vy)" font-weight="600" font-size="12">
    <text x="170" y="49" text-anchor="middle">length 1: 50 m</text>
    <text x="170" y="93" text-anchor="middle">length 2: 50 m back</text>
  </g>
  <circle cx="36" cy="66" r="6" style="fill:var(--accent)" stroke="none"/>
  ${t(14, 120, "start = finish → 0 m apart", 'font-size="12" font-weight="600" style="fill:var(--accent)"')}
  ${t(240, 120, "58.33 s", 'font-size="12" font-weight="600"')}
  ${key(152, "var(--vy)", "100 m · length of path swum", "distance (scalar)")}
  ${key(186, "var(--accent)", "0 m · start to finish, straight line", "displacement s (vector)")}
  ${key(220, "currentColor", "58.33 s · race time", "time taken Δt")}
  ${key(254, "var(--vy)", "1.71 m/s · 100 ÷ 58.33", "average speed")}
  ${key(288, "var(--accent)", "0 m/s · 0 ÷ 58.33", "average velocity")}
</svg>`;

export const figPool: Figure = {
  kind: "svg",
  svg: svgPool,
  alt: "A 50 metre pool. An arrow goes along the pool for 50 metres and a second arrow comes back 50 metres to the start. Distance 100 metres, displacement 0, time 58.33 seconds, average speed 1.71 metres per second, average velocity 0.",
  caption: "Textbook p. 24. Same race, two answers: 100 m of {{distance}}, 0 m of {{displacement}}.",
};

// ---------- Harrogate to Leeds (Textbook p. 24) ----------
const svgLeeds = `${head("d2-hl", 400)}
  <path d="M170,40 C260,70 250,110 190,120 C120,130 90,170 170,200" stroke-width="2.4" stroke-dasharray="1 0" style="stroke:var(--vy)" marker-end="url(#d2-hl-p)"/>
  <line x1="170" y1="40" x2="170" y2="198" stroke-width="2.4" style="stroke:var(--accent)" marker-end="url(#d2-hl-a)"/>
  <circle cx="170" cy="36" r="5" fill="currentColor" stroke="none"/>
  <circle cx="170" cy="206" r="5" fill="currentColor" stroke="none"/>
  ${t(182, 32, "Harrogate", 'font-weight="600"')}
  ${t(182, 222, "Leeds", 'font-weight="600"')}
  ${t(250, 98, "24 km", 'font-weight="600" style="fill:var(--vy)"')}
  ${t(250, 113, "by road", 'font-size="11" style="fill:var(--vy)"')}
  ${t(180, 150, "21 km", 'font-weight="600" style="fill:var(--accent)"')}
  ${t(180, 165, "due south", 'font-size="11" style="fill:var(--accent)"')}
  <line x1="40" y1="70" x2="40" y2="34" stroke-width="1.4" marker-end="url(#d2-hl-c)"/>
  ${t(35, 28, "N", 'font-size="11"')}
  ${t(14, 240, "journey time 37 min × 60 = 2220 s", 'font-size="12"')}
  ${key(270, "var(--vy)", "24 km = 24 000 m · along the road", "distance Δx")}
  ${key(302, "var(--accent)", "21 km = 21 000 m south · straight line", "displacement Δs")}
  ${key(334, "var(--vy)", "11 m/s · 24 000 ÷ 2220", "average speed (no direction)")}
  ${key(366, "var(--accent)", "9.5 m/s due south · 21 000 ÷ 2220", "average velocity (size + direction)")}
</svg>`;

export const figLeeds: Figure = {
  kind: "svg",
  svg: svgLeeds,
  alt: "Harrogate at the top, Leeds below. A winding road between them is 24 km long. A straight arrow from Harrogate to Leeds is 21 km due south. The journey takes 37 minutes, 2220 seconds. Average speed 11 metres per second, average velocity 9.5 metres per second due south.",
  caption: "Textbook p. 24. The road length gives the {{speed}}; the straight arrow gives the {{velocity}}.",
};

// ---------- Shapes of s–t graphs ----------
const mini = (x: number, y: number, path: string, label: string, sub: string, colour = "var(--accent)") => `
  <g transform="translate(${x},${y})">
    <line x1="10" y1="70" x2="150" y2="70" stroke-width="1.2"/>
    <line x1="10" y1="70" x2="10" y2="6" stroke-width="1.2"/>
    <text x="4" y="14" fill="currentColor" stroke="none" font-size="10" text-anchor="end">s</text>
    <text x="150" y="82" fill="currentColor" stroke="none" font-size="10" text-anchor="end">t</text>
    <path d="${path}" stroke-width="2.4" style="stroke:${colour}"/>
    <text x="10" y="98" fill="currentColor" stroke="none" font-size="12" font-weight="600">${label}</text>
    <text x="10" y="113" stroke="none" font-size="11" style="fill:var(--muted)">${sub}</text>
  </g>`;

const svgShapes = `${head("d2-sh", 380)}
  ${mini(8, 4, "M10,40 L150,40", "flat line · not moving", "stationary, v = 0")}
  ${mini(178, 4, "M10,66 L150,14", "straight, uphill", "constant velocity (+)")}
  ${mini(8, 130, "M10,14 L150,66", "downhill · coming back", "constant velocity (−)")}
  ${mini(178, 130, "M10,68 Q110,66 150,10", "curve getting steeper", "speeding up (accelerating)")}
  ${mini(93, 256, "M10,68 Q40,12 150,10", "curve flattening out", "slowing down (decelerating)")}
</svg>`;

export const figShapes: Figure = {
  kind: "svg",
  svg: svgShapes,
  alt: "Five small displacement-time graphs: a flat line means stationary; a straight line going up means constant positive velocity; a straight line going down means constant velocity back towards the start; a curve getting steeper means speeding up; a curve flattening out means slowing down.",
  caption: "Read the **steepness**. Steeper = faster. Flat = stopped. Downhill = going back.",
};

// ---------- Car journey s–t graph (Textbook p. 25–26, Figure 3) ----------
export const figCar: Figure = {
  kind: "graph",
  alt: "Displacement-time graph. A straight line rises from 0 to 120 m between 0 and 20 s (gradient 6.0 m/s), stays flat at 120 m from 20 to 30 s (stationary), then falls straight back to 0 at 60 s (gradient −4.0 m/s).",
  caption: "Textbook p. 25–26, Figure 3. Each straight piece has one {{gradient}}, so one {{velocity}}: 120 ÷ 20 = 6.0 m/s, 0 while parked, −120 ÷ 30 = −4.0 m/s.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 60, step: 10 },
  y: { label: "displacement", symbol: "s", unit: "m", min: 0, max: 150, step: 50 },
  series: [{ id: "car", points: [[0, 0], [20, 120], [30, 120], [60, 0]], colour: "accent" }],
  points: [
    { x: 20, y: 120, label: "6.0 m/s up to here" },
    { x: 30, y: 120, label: "0 (parked)" },
    { x: 60, y: 0 },
  ],
};

// ---------- Tangent on a curved s–t graph (ours) ----------
// The old SVG was drawn from s = 0.75 t² (s(4) = 12 m, tangent through (2, 0) and (6, 24)); same formula here.
export const figTangent: Figure = {
  kind: "graph",
  alt: "A displacement-time curve that gets steeper, s = 0.75t², on axes from 0 to 6 s. At t = 4 s, s = 12 m, a tangent touches the curve. A triangle on it runs from 2 s to 6 s (4 s) and up from 0 to 24 m, so its gradient is 24 ÷ 4 = 6.0 m/s, the instantaneous velocity. The touching point can be dragged along the curve.",
  caption: "Our example. The tangent's slope (24 ÷ 4 = 6.0 m/s) is the velocity **at** 4 s; the average over 0–4 s is only 12 ÷ 4 = 3.0 m/s. Drag the dot: the steeper the curve, the greater the velocity.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 6, step: 1 },
  y: { label: "displacement", symbol: "s", unit: "m", min: 0, max: 30, step: 10 },
  series: [{ id: "cyclist", label: "s = 0.75t²", expr: "0.75*t^2", colour: "accent" }],
  tangent: {
    series: "cyclist",
    at: 4,
    draggable: true,
    showTriangle: true,
    readout: { quantity: "velocity", unit: "m s⁻¹", decimals: 1 },
  },
};

// ---------- Bounce: change in velocity (ours) ----------
const svgBounce = `${head("d2-bn", 282)}
  <rect x="300" y="20" width="16" height="130" style="fill:var(--muted)" fill-opacity="0.35" stroke-width="1.2"/>
  ${t(308, 166, "wall", 'text-anchor="middle" font-size="11"')}
  ${t(14, 30, "before (towards wall = +)", 'font-size="11.5"')}
  <circle cx="160" cy="55" r="11" fill="currentColor" stroke="none" opacity="0.8"/>
  <line x1="174" y1="55" x2="286" y2="55" stroke-width="2.6" style="stroke:var(--accent)" marker-end="url(#d2-bn-a)"/>
  ${t(230, 47, "+5.0 m/s", 'text-anchor="middle" font-weight="700" style="fill:var(--accent)"')}
  ${t(14, 100, "after", 'font-size="11.5"')}
  <circle cx="286" cy="125" r="11" fill="currentColor" stroke="none" opacity="0.8"/>
  <line x1="272" y1="125" x2="205" y2="125" stroke-width="2.6" style="stroke:var(--vy)" marker-end="url(#d2-bn-p)"/>
  ${t(238, 117, "−3.0 m/s", 'text-anchor="middle" font-weight="700" style="fill:var(--vy)"')}
  ${t(14, 190, "Δv = −3.0 − (+5.0) = −8.0 m/s  (size 8.0, not 2.0)", 'font-size="12" font-weight="600"')}
  ${key(222, "var(--accent)", "+5.0 m/s · going in", "initial velocity u")}
  ${key(254, "var(--vy)", "−3.0 m/s · coming back out", "final velocity v (opposite direction)")}
</svg>`;

export const figBounce: Figure = {
  kind: "svg",
  svg: svgBounce,
  alt: "A ball moves towards a wall at plus 5.0 metres per second and bounces back at minus 3.0 metres per second. The change in velocity is minus 3.0 minus 5.0, which is minus 8.0 metres per second.",
  caption: "Our example. Opposite directions → the sizes **add** to give the change in velocity.",
};

// ====================== Question figures ======================

// Greatest-speed MCQ: segments A–D.
export const figSegments: Figure = {
  kind: "graph",
  alt: "Displacement-time graph made of four straight sections. A: 0 to 4 m from 0 to 2 s. B: flat at 4 m from 2 to 4 s. C: 4 m to 10 m from 4 to 5 s. D: 10 m down to 0 from 5 to 9 s.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 9, step: 1 },
  y: { label: "displacement", symbol: "s", unit: "m", min: 0, max: 12, step: 2 },
  series: [{ id: "seg", points: [[0, 0], [2, 4], [4, 4], [5, 10], [9, 0]], colour: "accent" }],
  points: [
    { x: 1, y: 2, label: "A" },
    { x: 3, y: 4, label: "B" },
    { x: 4.5, y: 7, label: "C" },
    { x: 7, y: 5, label: "D" },
  ],
};

// Trolley and buffer (motion sensor). Hand-sketched with no formula: straight to (0.40 s, 0.60 m),
// then a flattening curve to 1.05 m at 1.0 s, then flat. The old curve's points are kept as data.
export const figTrolley: Figure = {
  kind: "graph",
  alt: "Displacement-time graph for a trolley. A straight line from 0 to 0.60 m between 0 and 0.40 s, then a curve that flattens out reaching 1.05 m at 1.0 s, then a flat line at 1.05 m to 1.2 s.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 1.2, step: 0.2 },
  y: { label: "displacement", symbol: "s", unit: "m", min: 0, max: 1.2, step: 0.3 },
  series: [{
    id: "trolley",
    points: [[0, 0], [0.4, 0.6], [0.45, 0.672], [0.5, 0.738], [0.55, 0.797], [0.6, 0.85], [0.65, 0.897], [0.7, 0.938], [0.75, 0.972], [0.8, 1.0], [0.85, 1.022], [0.9, 1.038], [0.95, 1.047], [1.0, 1.05], [1.2, 1.05]],
    colour: "accent",
  }],
  points: [
    { x: 0.4, y: 0.6, label: "hits buffer" },
    { x: 1.0, y: 1.05, label: "1.05 m" },
  ],
};

// Dropped ball: curve s = 4.905 t², point P at 0.40 s, no tangent drawn.
export const figDrop: Figure = {
  kind: "graph",
  alt: "Distance fallen against time for a dropped ball: a curve getting steeper from 0 at 0 s to about 1.23 m at 0.5 s. Point P is on the curve at 0.40 s, 0.785 m.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 0.5, step: 0.1 },
  y: { label: "distance fallen", symbol: "s", unit: "m", min: 0, max: 1.25, step: 0.25 },
  series: [{ id: "ball", expr: "4.905*t^2", colour: "accent" }],
  points: [{ x: 0.4, y: 0.7848, label: "P" }],
};
