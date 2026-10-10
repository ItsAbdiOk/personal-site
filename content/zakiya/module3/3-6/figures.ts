import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.6. Every number is drawn where it lives, with a key underneath:
// "value · plain words" (bold), exam term (muted). All numbers rechecked in Python.
// Colours: --vx (orange) = thinking, --vy (purple) = braking, --accent = whole stopping distance.

const head = (id: string, w: number, h: number) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${id}-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

const keys = (y0: number, items: [string, string, string][]) => items.map((k, i) => key(y0 + i * 31, ...k)).join("");

// Small car, nose pointing right, at (x, y) = rear-bottom corner.
const car = (x: number, y: number) => `
  <path d="M${x},${y} L${x},${y - 10} L${x + 8},${y - 10} L${x + 13},${y - 17} L${x + 26},${y - 17} L${x + 31},${y - 10} L${x + 38},${y - 9} L${x + 38},${y} Z" fill="currentColor" fill-opacity="0.15" stroke-width="1.4"/>
  <circle cx="${x + 9}" cy="${y}" r="3.5" fill="currentColor" stroke="none"/><circle cx="${x + 30}" cy="${y}" r="3.5" fill="currentColor" stroke="none"/>`;

// ---------- Section 1: the textbook's 30 mph numbers on a road (Textbook p. 35–36) ----------
// Scale: 23 m = 300 px (13.04 px per m). Brake point at 9.0 m → x = 137.
const svgRoad = `${head("sd-road", 340, 330)}
  <line x1="0" y1="96" x2="340" y2="96" stroke-width="1.5"/>
  ${car(2, 92)}
  <line x1="44" y1="62" x2="96" y2="62" stroke-width="2.2" marker-end="url(#sd-road-c)"/>
  <text x="44" y="54" fill="currentColor" stroke="none" font-weight="600">13.4 m/s</text>
  <g stroke-dasharray="4 4" stroke-width="1" opacity="0.7">
    <line x1="20" y1="70" x2="20" y2="172"/><line x1="137" y1="70" x2="137" y2="172"/><line x1="320" y1="70" x2="320" y2="172"/>
  </g>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="22" y="114">sees hazard</text><text x="139" y="114">brakes on</text><text x="316" y="114" text-anchor="end">stopped</text>
  </g>
  <line x1="21" y1="134" x2="136" y2="134" stroke-width="2.4" style="stroke:var(--vx)" marker-start="url(#sd-road-t)" marker-end="url(#sd-road-t)"/>
  <line x1="138" y1="134" x2="319" y2="134" stroke-width="2.4" style="stroke:var(--vy)" marker-start="url(#sd-road-b)" marker-end="url(#sd-road-b)"/>
  <line x1="21" y1="164" x2="319" y2="164" stroke-width="2.4" style="stroke:var(--accent)" marker-start="url(#sd-road-s)" marker-end="url(#sd-road-s)"/>
  <g stroke="none" font-weight="600" text-anchor="middle">
    <text x="78" y="128" style="fill:var(--vx)">9.0 m</text>
    <text x="228" y="128" style="fill:var(--vy)">14.0 m</text>
    <text x="170" y="184" style="fill:var(--accent)">23 m</text>
  </g>
  ${keys(214, [
    ["currentColor", "13.4 m/s (30 mph) · the car's speed", "initial speed u"],
    ["var(--vx)", "9.0 m · moves before the brakes go on", "thinking distance"],
    ["var(--vy)", "14.0 m · moves while braking", "braking distance"],
    ["var(--accent)", "23 m · from seeing the hazard to stopped", "stopping distance = thinking + braking"],
  ])}
</svg>`;

export const figRoad: Figure = {
  kind: "svg",
  svg: svgRoad,
  alt: "A car moving at 13.4 metres per second. From the point where the driver sees a hazard to where the brakes go on is 9.0 metres, the thinking distance. From brakes on to stopped is 14.0 metres, the braking distance. The whole 23 metres is the stopping distance.",
  caption: "Highway Code at 30 mph (Textbook p. 35–36): 9.0 m + 14.0 m ≈ 23 m.",
};

// ---------- Section 2: reaction time worked example (Textbook p. 35) ----------
// Row 1: 9.0 m = 120 px. Row 2 (70 mph): 21 m = 280 px, same scale (13.3 px per m).
const svgReaction = `${head("sd-rt", 340, 340)}
  <text x="10" y="18" fill="currentColor" stroke="none" font-size="12">30 mph</text>
  ${car(10, 58)}
  <line x1="52" y1="34" x2="96" y2="34" stroke-width="2.2" marker-end="url(#sd-rt-c)"/>
  <text x="100" y="38" fill="currentColor" stroke="none" font-weight="600">13.4 m/s</text>
  <line x1="30" y1="72" x2="150" y2="72" stroke-width="2.4" style="stroke:var(--vx)" marker-start="url(#sd-rt-t)" marker-end="url(#sd-rt-t)"/>
  <text x="90" y="90" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vx)">9.0 m</text>
  <text x="160" y="77" fill="currentColor" stroke="none" font-weight="600">t = ? → 0.67 s</text>
  <line x1="0" y1="112" x2="340" y2="112" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.5"/>
  <text x="10" y="134" fill="currentColor" stroke="none" font-size="12">70 mph, same 0.67 s</text>
  ${car(10, 174)}
  <line x1="52" y1="150" x2="150" y2="150" stroke-width="2.2" marker-end="url(#sd-rt-c)"/>
  <text x="154" y="154" fill="currentColor" stroke="none" font-weight="600">31.1 m/s</text>
  <line x1="30" y1="188" x2="310" y2="188" stroke-width="2.4" style="stroke:var(--vx)" marker-start="url(#sd-rt-t)" marker-end="url(#sd-rt-t)"/>
  <text x="170" y="206" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vx)">? → 21 m</text>
  ${keys(240, [
    ["currentColor", "13.4 m/s and 31.1 m/s · the car's speed", "speed (constant while thinking)"],
    ["var(--vx)", "9.0 m, 21 m · moved before braking", "thinking distance"],
    ["currentColor", "0.67 s · time to get the foot on the brake", "reaction time"],
  ])}
</svg>`;

export const figReaction: Figure = {
  kind: "svg",
  svg: svgReaction,
  alt: "Top row: a car at 13.4 metres per second travels 9.0 metres before braking; the reaction time is a question mark, answer 0.67 seconds. Bottom row, drawn to the same scale: at 31.1 metres per second with the same 0.67 second reaction time, it travels 21 metres before braking.",
  caption: "Same reaction time, 2.3 × the speed → 2.3 × the thinking distance.",
};

// ---------- Section 3: braking worked example (Textbook p. 36) ----------
const svgBraking = `${head("sd-br", 340, 300)}
  <line x1="0" y1="80" x2="340" y2="80" stroke-width="1.5"/>
  ${car(14, 76)}
  ${car(282, 76)}
  <line x1="56" y1="40" x2="116" y2="40" stroke-width="2.2" marker-end="url(#sd-br-c)"/>
  <text x="56" y="30" fill="currentColor" stroke="none" font-weight="600">u = 13.4 m/s</text>
  <text x="300" y="40" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">v = 0</text>
  <line x1="34" y1="104" x2="300" y2="104" stroke-width="2.4" style="stroke:var(--vy)" marker-start="url(#sd-br-b)" marker-end="url(#sd-br-b)"/>
  <text x="167" y="124" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vy)">s = 14.0 m</text>
  <line x1="220" y1="40" x2="160" y2="40" stroke-width="2.2" style="stroke:var(--accent)" marker-end="url(#sd-br-s)"/>
  <text x="190" y="62" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--accent)">a = ? → −6.4 m/s²</text>
  ${keys(168, [
    ["currentColor", "13.4 m/s → 0 · speed at start, then stopped", "initial velocity u, final velocity v"],
    ["var(--vy)", "14.0 m · distance covered while braking", "braking distance s"],
    ["var(--accent)", "6.4 m/s² · speed lost each second (backwards)", "deceleration (a = −6.4 m s⁻²)"],
  ])}
</svg>`;

export const figBraking: Figure = {
  kind: "svg",
  svg: svgBraking,
  alt: "A car braking from 13.4 metres per second to rest over 14.0 metres. An arrow pointing backwards shows the acceleration, unknown, answer minus 6.4 metres per second squared.",
  caption: "Acceleration points **backwards** (against the motion), so it comes out negative.",
};

// ---------- Section 4: Highway Code table as stacked bars (Textbook p. 36, Table 1) ----------
const table: [number, number, number, number, number][] = [
  // mph, m/s, thinking, braking, stopping
  [20, 8.9, 6, 6, 12],
  [30, 13.4, 9, 14, 23],
  [40, 17.8, 12, 24, 36],
  [50, 22.2, 15, 38, 53],
  [60, 26.7, 18, 55, 73],
  [70, 31.1, 21, 75, 96],
];
const SX = 2.1; // px per metre
const svgTable = `${head("sd-tab", 340, 330)}
  <text x="10" y="16" fill="currentColor" stroke="none" font-size="12">speed</text>
  <text x="96" y="16" fill="currentColor" stroke="none" font-size="12">distance (metres, to scale)</text>
  ${table
    .map(([mph, ms, th, br, st], i) => {
      const y = 30 + i * 30;
      const x0 = 96;
      return `
  <text x="10" y="${y + 11}" fill="currentColor" stroke="none" font-size="12" font-weight="600">${mph} mph</text>
  <text x="56" y="${y + 11}" stroke="none" font-size="11" style="fill:var(--muted)">${ms}</text>
  <rect x="${x0}" y="${y}" width="${(th * SX).toFixed(1)}" height="14" stroke="none" style="fill:var(--vx)"/>
  <rect x="${(x0 + th * SX).toFixed(1)}" y="${y}" width="${(br * SX).toFixed(1)}" height="14" stroke="none" style="fill:var(--vy)"/>
  <text x="${(x0 + st * SX + 5).toFixed(1)}" y="${y + 11}" stroke="none" font-size="12" font-weight="600" style="fill:var(--accent)">${st} m</text>`;
    })
    .join("")}
  ${keys(222, [
    ["var(--vx)", "6 → 21 m · grows in step with speed", "thinking distance ∝ speed"],
    ["var(--vy)", "6 → 75 m · grows much faster", "braking distance ∝ speed²"],
    ["var(--accent)", "12 → 96 m · the two added", "stopping distance"],
  ])}
</svg>`;

export const figTable: Figure = {
  kind: "svg",
  svg: svgTable,
  alt: "Stacked bar chart of the Highway Code stopping distances. At 20, 30, 40, 50, 60 and 70 miles per hour (8.9, 13.4, 17.8, 22.2, 26.7 and 31.1 metres per second) the thinking distances are 6, 9, 12, 15, 18 and 21 metres, the braking distances 6, 14, 24, 38, 55 and 75 metres, and the stopping distances 12, 23, 36, 53, 73 and 96 metres.",
  caption: "Table 1 of the textbook (p. 36) drawn to scale. Orange (thinking) grows steadily; purple (braking) takes over at high speed.",
};

// ---------- Velocity–time graph builder ----------
type Vt = {
  id: string;
  tMax: number; vMax: number;
  tTicks: number[]; vTicks: number[];
  u: number; tReact: number; tStop: number;
  uLabel?: string;             // label at the speed tick, e.g. "15" or "?"
  thinking?: string; braking?: string; slope?: string;
  keyItems?: [string, string, string][];
};
const X0 = 50, Y0 = 200, W = 270, H = 160;
export function vtSvg(o: Vt): string {
  const x = (t: number) => +(X0 + (t / o.tMax) * W).toFixed(1);
  const y = (v: number) => +(Y0 - (v / o.vMax) * H).toFixed(1);
  const keyH = (o.keyItems?.length ?? 0) * 31;
  const h = 262 + keyH;
  return `${head(o.id, 340, h)}
  <line x1="${X0}" y1="${Y0}" x2="${X0 + W + 10}" y2="${Y0}" stroke-width="1.4" marker-end="url(#${o.id}-c)"/>
  <line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H - 14}" stroke-width="1.4" marker-end="url(#${o.id}-c)"/>
  <text x="${X0 + W}" y="${Y0 + 34}" text-anchor="end" fill="currentColor" stroke="none" font-size="12">time / s</text>
  <text x="${X0 - 40}" y="${Y0 - H - 20}" fill="currentColor" stroke="none" font-size="12">velocity / m s⁻¹</text>
  ${o.tTicks.map((t) => `<line x1="${x(t)}" y1="${Y0}" x2="${x(t)}" y2="${Y0 + 5}" stroke-width="1"/><text x="${x(t)}" y="${Y0 + 18}" text-anchor="middle" fill="currentColor" stroke="none" font-size="11.5">${t}</text>`).join("")}
  ${o.vTicks.map((v) => `<line x1="${X0 - 5}" y1="${y(v)}" x2="${X0}" y2="${y(v)}" stroke-width="1"/><text x="${X0 - 8}" y="${y(v) + 4}" text-anchor="end" fill="currentColor" stroke="none" font-size="11.5">${v}</text>`).join("")}
  ${o.uLabel ? `<text x="${X0 - 8}" y="${y(o.u) + 4}" text-anchor="end" fill="currentColor" stroke="none" font-size="12" font-weight="600">${o.uLabel}</text>` : ""}
  <rect x="${X0}" y="${y(o.u)}" width="${(x(o.tReact) - X0).toFixed(1)}" height="${(Y0 - y(o.u)).toFixed(1)}" stroke="none" style="fill:var(--vx)" fill-opacity="0.28"/>
  <path d="M${x(o.tReact)},${y(o.u)} L${x(o.tStop)},${Y0} L${x(o.tReact)},${Y0} Z" stroke="none" style="fill:var(--vy)" fill-opacity="0.28"/>
  <path d="M${X0},${y(o.u)} L${x(o.tReact)},${y(o.u)} L${x(o.tStop)},${Y0}" stroke-width="2.4"/>
  ${o.thinking ? `<text x="${((X0 + x(o.tReact)) / 2).toFixed(1)}" y="${(Y0 - 10).toFixed(1)}" text-anchor="middle" stroke="none" font-weight="600" font-size="12" style="fill:var(--vx)">${o.thinking}</text>` : ""}
  ${o.braking ? `<text x="${(x(o.tReact) + (x(o.tStop) - x(o.tReact)) / 3).toFixed(1)}" y="${(Y0 - 12).toFixed(1)}" text-anchor="middle" stroke="none" font-weight="600" font-size="12" style="fill:var(--vy)">${o.braking}</text>` : ""}
  ${o.slope ? `<text x="${((x(o.tReact) + x(o.tStop)) / 2 + 8).toFixed(1)}" y="${((y(o.u) + Y0) / 2 - 6).toFixed(1)}" stroke="none" font-weight="600" font-size="12" style="fill:var(--accent)">${o.slope}</text>` : ""}
  ${o.keyItems ? keys(262, o.keyItems) : ""}
</svg>`;
}

// ---------- Section 5: v–t worked example (ours): 15 m/s, reacts 0.60 s, stopped at 3.6 s ----------
export const figVtWorked: Figure = {
  kind: "svg",
  svg: vtSvg({
    id: "sd-vt1", tMax: 4, vMax: 20, tTicks: [0, 0.6, 2, 3.6], vTicks: [0, 5, 10, 20], u: 15, uLabel: "15",
    tReact: 0.6, tStop: 3.6, thinking: "9.0 m", braking: "? → 22.5 m", slope: "slope: a = ? → −5.0",
    keyItems: [
      ["currentColor", "15 m/s · speed when the hazard appears", "initial velocity u"],
      ["var(--vx)", "0.60 s, 9.0 m · flat part: still at full speed", "reaction time; thinking distance = rectangle area"],
      ["var(--vy)", "3.0 s, 22.5 m · sloping part: slowing down", "braking time; braking distance = triangle area"],
      ["var(--accent)", "5.0 m/s² · speed lost per second", "deceleration = −gradient"],
    ],
  }),
  alt: "Velocity against time. The line is flat at 15 metres per second from 0 to 0.60 seconds, then slopes straight down to zero at 3.6 seconds. The rectangle under the flat part is shaded orange and labelled 9.0 metres, thinking distance. The triangle under the slope is shaded purple and labelled 22.5 metres, braking distance. The slope gives an acceleration of minus 5.0 metres per second squared.",
  caption: "Area = distance; gradient = acceleration. Stopping distance = 9.0 + 22.5 = 31.5 m.",
};

// ---------- Section 5: how the graph changes (ours, built on the 15 m/s example) ----------
// Scale: x 34 px per s (0–7 s), y 8 px per m/s (0–20).
const px = (t: number) => +(50 + 34 * t).toFixed(1);
const py = (v: number) => +(200 - 8 * v).toFixed(1);
const line = (pts: [number, number][], colour: string, dash = "") =>
  `<path d="M${pts.map(([t, v]) => `${px(t)},${py(v)}`).join(" L")}" stroke-width="2.2" ${dash ? `stroke-dasharray="${dash}"` : ""} style="stroke:${colour}"/>`;
const svgVtChanges = `${head("sd-vt2", 340, 386)}
  <line x1="50" y1="200" x2="300" y2="200" stroke-width="1.4" marker-end="url(#sd-vt2-c)"/>
  <line x1="50" y1="200" x2="50" y2="26" stroke-width="1.4" marker-end="url(#sd-vt2-c)"/>
  <text x="300" y="234" text-anchor="end" fill="currentColor" stroke="none" font-size="12">time / s</text>
  <text x="10" y="20" fill="currentColor" stroke="none" font-size="12">velocity / m s⁻¹</text>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((t) => `<line x1="${px(t)}" y1="200" x2="${px(t)}" y2="205" stroke-width="1"/><text x="${px(t)}" y="218" text-anchor="middle" fill="currentColor" stroke="none" font-size="11.5">${t}</text>`).join("")}
  ${[0, 7.5, 15].map((v) => `<line x1="45" y1="${py(v)}" x2="50" y2="${py(v)}" stroke-width="1"/><text x="42" y="${py(v) + 4}" text-anchor="end" fill="currentColor" stroke="none" font-size="11.5">${v}</text>`).join("")}
  ${line([[0, 15], [0.6, 15], [5.6, 0]], "var(--vy)", "6 4")}
  ${line([[0, 15], [1.2, 15], [4.2, 0]], "var(--vx)", "6 4")}
  ${line([[0, 7.5], [0.6, 7.5], [2.1, 0]], "var(--good)", "2 3")}
  ${line([[0, 15], [0.6, 15], [3.6, 0]], "currentColor")}
  ${keys(262, [
    ["currentColor", "15 m/s, 0.60 s, stops at 3.6 s · normal", "the worked example above"],
    ["var(--vx)", "0.60 s → 1.2 s · tired driver", "longer reaction time: longer flat part, same slope"],
    ["var(--vy)", "5.0 → 3.0 m/s² · wet road", "smaller deceleration: shallower slope"],
    ["var(--good)", "15 → 7.5 m/s · half the speed", "same flat time and slope, stops at 2.1 s"],
  ])}
</svg>`;

export const figVtChanges: Figure = {
  kind: "svg",
  svg: svgVtChanges,
  alt: "Four velocity-time lines. Normal: flat at 15 metres per second until 0.6 seconds, then straight down to zero at 3.6 seconds. Tired driver: flat until 1.2 seconds, then the same slope down to zero at 4.2 seconds. Wet road: flat until 0.6 seconds, then a shallower slope reaching zero at 5.6 seconds. Half speed: flat at 7.5 metres per second until 0.6 seconds, then the same slope as normal, reaching zero at 2.1 seconds.",
  caption: "Reaction time changes the **flat part**; road, tyres and brakes change the **slope**.",
};

// ---------- Section 6: braking force and energy (ours): 950 kg, 20 m/s, 6000 N ----------
const svgEnergy = `${head("sd-en", 340, 300)}
  <line x1="0" y1="90" x2="340" y2="90" stroke-width="1.5"/>
  ${car(14, 86)}
  ${car(282, 86)}
  <text x="33" y="54" text-anchor="middle" fill="currentColor" stroke="none" font-size="12" font-weight="600">950 kg</text>
  <line x1="56" y1="70" x2="116" y2="70" stroke-width="2.2" marker-end="url(#sd-en-c)"/>
  <text x="120" y="74" fill="currentColor" stroke="none" font-weight="600">20 m/s</text>
  <line x1="268" y1="66" x2="210" y2="66" stroke-width="2.4" style="stroke:var(--accent)" marker-end="url(#sd-en-s)"/>
  <text x="240" y="54" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--accent)">6000 N</text>
  <line x1="34" y1="114" x2="300" y2="114" stroke-width="2.4" style="stroke:var(--vy)" marker-start="url(#sd-en-b)" marker-end="url(#sd-en-b)"/>
  <text x="167" y="134" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vy)">d = ? → 31.7 m</text>
  ${keys(168, [
    ["currentColor", "950 kg, 20 m/s · moving car: 190 000 J", "mass m, speed v, kinetic energy ½mv²"],
    ["var(--accent)", "6000 N · push of the brakes, backwards", "braking force F"],
    ["var(--vy)", "31.7 m · distance to take all 190 000 J away", "braking distance d (Fd = ½mv²)"],
  ])}
</svg>`;

export const figEnergy: Figure = {
  kind: "svg",
  svg: svgEnergy,
  alt: "A 950 kilogram car at 20 metres per second, with a 6000 newton braking force pointing backwards. The braking distance is a question mark, answer 31.7 metres.",
  caption: "Brakes do work F × d until all the kinetic energy is gone.",
};

// ---------- Section 7: the d/v against v graph (practical) ----------
const svgDv = `${head("sd-dv", 340, 300)}
  <line x1="50" y1="190" x2="310" y2="190" stroke-width="1.4" marker-end="url(#sd-dv-c)"/>
  <line x1="50" y1="190" x2="50" y2="30" stroke-width="1.4" marker-end="url(#sd-dv-c)"/>
  <text x="310" y="212" text-anchor="end" fill="currentColor" stroke="none" font-size="12">speed v</text>
  <text x="10" y="22" fill="currentColor" stroke="none" font-size="12">stopping distance ÷ speed, d/v</text>
  <line x1="50" y1="150" x2="290" y2="60" stroke-width="2.4" style="stroke:var(--accent)"/>
  <circle cx="50" cy="150" r="4.5" style="fill:var(--vx)" stroke="none"/>
  <text x="58" y="168" stroke="none" font-weight="600" font-size="12" style="fill:var(--vx)">intercept = t</text>
  <path d="M170,105 L250,105 L250,75" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="256" y="96" stroke="none" font-weight="600" font-size="12" style="fill:var(--vy)">gradient</text>
  <text x="256" y="112" stroke="none" font-weight="600" font-size="12" style="fill:var(--vy)">= 1/(2a)</text>
  ${keys(240, [
    ["var(--vx)", "y-intercept · d/v when v = 0", "reaction time t"],
    ["var(--vy)", "steepness · smaller when braking is harder", "gradient = 1 ÷ (2 × deceleration)"],
  ])}
</svg>`;

export const figDv: Figure = {
  kind: "svg",
  svg: svgDv,
  alt: "Graph of stopping distance divided by speed against speed: a straight line that does not pass through the origin. The y-intercept is the reaction time. The gradient is one over twice the deceleration.",
  caption: "Rearranging d = vt + v²/(2a) into straight-line form y = c + mx.",
};
