import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.4. One helper draws every velocity–time graph so they all look the same.
// Every number sits where it lives (an area's value inside its shape), with a key underneath:
// value · plain words (bold), exam term (muted). Colours: --vx, --vy, --accent for areas.

type Pt = [number, number];
type Shade = { pts: Pt[]; colour: string; label?: string; at?: Pt; opacity?: number };
type Note = { at: Pt; text: string; colour?: string; anchor?: "start" | "middle" | "end"; dx?: number; dy?: number; bold?: boolean };
type Key = [colour: string, top: string, term: string];
type VT = {
  id: string;
  t: [max: number, step: number, labelEvery?: number, decimals?: number];
  v: [min: number, max: number, step: number, labelEvery?: number, decimals?: number];
  lines?: { pts: Pt[]; colour?: string; dashed?: boolean; width?: number }[];
  shades?: Shade[];
  notes?: Note[];
  keys?: Key[];
  h?: number;
};

const X0 = 52, X1 = 322, TOP = 16;

function vt(o: VT): string {
  const H = o.h ?? 150;
  const BOT = TOP + H;
  const [tMax, tStep, tEvery = 1, tDec = 0] = o.t;
  const [vMin, vMax, vStep, vEvery = 1, vDec = 0] = o.v;
  const X = (t: number) => +(X0 + (t / tMax) * (X1 - X0)).toFixed(1);
  const Y = (v: number) => +(BOT - ((v - vMin) / (vMax - vMin)) * H).toFixed(1);
  const keys = o.keys ?? [];
  const total = BOT + 44 + keys.length * 34;
  let s = `<svg viewBox="0 0 340 ${total}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">`;
  // grid
  s += `<g stroke-width="0.7" opacity="0.18">`;
  for (let i = 0; i * tStep <= tMax + 1e-9; i++) s += `<line x1="${X(i * tStep)}" y1="${TOP}" x2="${X(i * tStep)}" y2="${BOT}"/>`;
  for (let j = 0; vMin + j * vStep <= vMax + 1e-9; j++) s += `<line x1="${X0}" y1="${Y(vMin + j * vStep)}" x2="${X1}" y2="${Y(vMin + j * vStep)}"/>`;
  s += `</g>`;
  // shaded areas
  for (const sh of o.shades ?? []) {
    s += `<polygon points="${sh.pts.map(([t, v]) => `${X(t)},${Y(v)}`).join(" ")}" stroke="none" style="fill:${sh.colour}" fill-opacity="${sh.opacity ?? 0.28}"/>`;
  }
  // axes (time axis drawn at v = 0)
  s += `<line x1="${X0}" y1="${TOP}" x2="${X0}" y2="${BOT}" stroke-width="1.4"/>`;
  s += `<line x1="${X0}" y1="${Y(0)}" x2="${X1}" y2="${Y(0)}" stroke-width="1.4"/>`;
  // tick labels
  s += `<g fill="currentColor" stroke="none" font-size="11">`;
  for (let i = 0; i * tStep <= tMax + 1e-9; i += tEvery) s += `<text x="${i === 0 ? X0 + 2 : X(i * tStep)}" y="${BOT + 14}" text-anchor="${i === 0 ? "start" : "middle"}">${(i * tStep).toFixed(tDec)}</text>`;
  for (let j = 0; vMin + j * vStep <= vMax + 1e-9; j += vEvery) {
    const v = vMin + j * vStep;
    s += `<text x="${X0 - 5}" y="${Y(v) + 4}" text-anchor="end">${v < 0 ? "−" : ""}${Math.abs(v).toFixed(vDec)}</text>`;
  }
  s += `<text x="${(X0 + X1) / 2}" y="${BOT + 30}" text-anchor="middle" font-style="italic">t / s</text>`;
  s += `<text x="12" y="${(TOP + BOT) / 2}" text-anchor="middle" font-style="italic" transform="rotate(-90 12 ${(TOP + BOT) / 2})">v / m s⁻¹</text>`;
  s += `</g>`;
  // graph lines
  for (const l of o.lines ?? []) {
    s += `<polyline points="${l.pts.map(([t, v]) => `${X(t)},${Y(v)}`).join(" ")}" stroke-width="${l.width ?? 2.4}" stroke-linejoin="round" style="stroke:${l.colour ?? "currentColor"}"${l.dashed ? ` stroke-dasharray="6 4"` : ""}/>`;
  }
  // area labels + notes
  for (const sh of o.shades ?? []) {
    if (!sh.label) continue;
    const at = sh.at ?? sh.pts.reduce<Pt>((m, p) => [m[0] + p[0] / sh.pts.length, m[1] + p[1] / sh.pts.length], [0, 0]);
    s += `<text x="${X(at[0])}" y="${Y(at[1]) + 4}" text-anchor="middle" stroke="none" font-weight="700" font-size="12.5" fill="currentColor">${sh.label}</text>`;
  }
  for (const n of o.notes ?? []) {
    s += `<text x="${X(n.at[0]) + (n.dx ?? 0)}" y="${Y(n.at[1]) + (n.dy ?? 0)}" text-anchor="${n.anchor ?? "middle"}" stroke="none"${n.bold === false ? "" : ` font-weight="600"`} style="fill:${n.colour ?? "currentColor"}">${n.text}</text>`;
  }
  // key
  keys.forEach(([colour, top, term], i) => {
    const y = BOT + 58 + i * 34;
    s += `<rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>`;
    s += `<text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>`;
    s += `<text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;
  });
  return s + `</svg>`;
}

const sample = (f: (t: number) => number, t0: number, t1: number, n = 60): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / n;
    return [t, f(t)] as Pt;
  });
const rect = (t0: number, t1: number, v0: number, v1: number): Pt[] => [[t0, v0], [t1, v0], [t1, v1], [t0, v1]];
const svg = (s: string, alt: string, caption?: string): Figure => ({ kind: "svg", svg: s, alt, caption });

const VX = "var(--vx)", VY = "var(--vy)", AC = "var(--accent)", MU = "var(--muted)";

// ---------- Why area = displacement: one thin strip ----------
const stripCurve = (t: number) => 8 * (1 - Math.exp(-t / 3.6));
export const figStrip = svg(
  vt({
    id: "s34-strip",
    t: [10, 1, 2], v: [0, 10, 1, 2], h: 150,
    shades: [
      { pts: [[0, 0], ...sample(stripCurve, 0, 10), [10, 0]], colour: AC, opacity: 0.12 },
      { pts: rect(5, 5.5, 0, 6.0), colour: VX, opacity: 0.75 },
    ],
    lines: [{ pts: sample(stripCurve, 0, 10) }, { pts: [[0, 6.0], [5, 6.0]], dashed: true, width: 1.2, colour: VX }],
    notes: [
      { at: [0, 6.0], text: "6.0", anchor: "start", dx: 4, dy: -5, colour: VX },
      { at: [5.5, 0], text: "0.5 s wide", anchor: "start", dx: 4, dy: -6, colour: VX },
      { at: [7.8, 2.6], text: "whole area", colour: AC },
    ],
    keys: [
      [VX, "6.0 m/s × 0.5 s = 3.0 m · one thin strip", "Δs ≈ vΔt (strip area = small displacement)"],
      [AC, "add every strip · the whole shaded area", "area under v–t graph = displacement s"],
    ],
  }),
  "A curved velocity–time graph rising from 0 towards 8 metres per second over 10 seconds. One thin strip under the curve, at about 5 seconds, is highlighted: height 6.0 m/s, width 0.5 s. The rest of the area under the curve is lightly shaded.",
  "Over a short 0.5 s the speed hardly changes, so the strip is almost a rectangle: 6.0 × 0.5 = 3.0 m travelled. Add up all the strips and you get the whole area, which is the whole {{s|displacement}}.",
);

// ---------- Cyclist (Textbook p. 29–30): split into A + B + C ----------
const cyc: Pt[] = [[0, 0], [10, 4], [30, 4], [50, 0]];
export const figCyclist = svg(
  vt({
    id: "s34-cyc",
    t: [50, 10], v: [0, 5, 1, 1, 1], h: 140,
    shades: [
      { pts: [[0, 0], [10, 4], [10, 0]], colour: VX, label: "A", at: [7, 1.2] },
      { pts: rect(10, 30, 0, 4), colour: AC, label: "B", at: [20, 2] },
      { pts: [[30, 0], [30, 4], [50, 0]], colour: VY, label: "C", at: [36, 1.3] },
    ],
    lines: [{ pts: cyc }],
    notes: [
      { at: [5, 0], text: "10 s", dy: -5, colour: VX },
      { at: [20, 4], text: "4.0 m/s for 20 s", dy: -6 },
      { at: [40, 0], text: "20 s", dy: -5, colour: VY },
    ],
    keys: [
      [VX, "A: ½ × 10 × 4.0 = 20 m · speeding up", "area of triangle (½ × base × height)"],
      [AC, "B: 20 × 4.0 = 80 m · steady 4.0 m/s", "area of rectangle (base × height)"],
      [VY, "C: ½ × 20 × 4.0 = 40 m · slowing to a stop", "area of triangle"],
      ["currentColor", "20 + 80 + 40 = 140 m · how far she rode", "displacement = total area under graph"],
    ],
  }),
  "Velocity–time graph of a cyclist: straight line from 0 to 4.0 m/s over the first 10 s, flat at 4.0 m/s from 10 s to 30 s, then a straight line down to 0 at 50 s. The area is split into triangle A (first 10 s), rectangle B (10 to 30 s) and triangle C (30 to 50 s).",
  "Textbook p. 29–30. Straight lines only, so the area splits into two triangles and a rectangle.",
);

export const figCyclistTrap = svg(
  vt({
    id: "s34-trap",
    t: [50, 10], v: [0, 5, 1, 1, 1], h: 140,
    shades: [{ pts: cyc, colour: AC }],
    lines: [{ pts: cyc }, { pts: [[10, 4.6], [30, 4.6]], colour: VX, width: 1.6 }, { pts: [[0, 0.5], [50, 0.5]], colour: VY, width: 1.6 }],
    notes: [
      { at: [20, 4.6], text: "20 s", dy: -5, colour: VX },
      { at: [25, 0.5], text: "50 s", dy: -5, colour: VY },
      { at: [30, 4], text: "4.0 m/s", anchor: "start", dx: 6, dy: -3 },
      { at: [25, 2.2], text: "140 m", colour: AC },
    ],
    keys: [
      [VX, "20 s · time at top speed", "shorter parallel side"],
      [VY, "50 s · the whole ride", "longer parallel side"],
      ["currentColor", "4.0 m/s · top speed", "height of the trapezium"],
      [AC, "½ × (50 + 20) × 4.0 = 140 m", "area of trapezium = displacement"],
    ],
  }),
  "The same cyclist graph shaded as one trapezium. The top parallel side (the flat part) is 20 s long, the bottom parallel side (the time axis) is 50 s long, and the height is 4.0 m/s. The area is 140 m.",
  "Same graph, one shape: a [[trapezium]]. Same answer, 140 m.",
);

// ---------- Car (Textbook p. 30, Fig 5) ----------
export const figCar = svg(
  vt({
    id: "s34-car",
    t: [100, 25, 2], v: [0, 20, 5, 2], h: 140,
    shades: [
      { pts: [[0, 0], [75, 15], [75, 0]], colour: VX, label: "562.5 m", at: [52, 5] },
      { pts: rect(75, 100, 0, 15), colour: AC, label: "375 m", at: [87.5, 7.5] },
    ],
    lines: [{ pts: [[0, 0], [75, 15], [100, 15]] }],
    notes: [
      { at: [37.5, 0], text: "75 s", dy: -5, colour: VX },
      { at: [87.5, 15], text: "25 s at 15 m/s", dy: -6 },
    ],
    keys: [
      [VX, "½ × 75 × 15 = 562.5 m · speeding up", "area of triangle"],
      [AC, "25 × 15 = 375 m · steady 15 m/s", "area of rectangle"],
      ["currentColor", "937.5 m ÷ 100 s = 9.4 m/s", "average velocity = displacement ÷ time"],
    ],
  }),
  "Velocity–time graph of a car: straight line from 0 to 15 m/s over 75 s, then flat at 15 m/s until 100 s. Triangle area 562.5 m, rectangle area 375 m.",
  "Textbook p. 30, Figure 5.",
);

// ---------- Sprinter (Textbook p. 30, Fig 6) ----------
export const figSprinter = svg(
  vt({
    id: "s34-spr",
    t: [14, 1, 2], v: [0, 12.5, 2.5, 2, 1], h: 140,
    shades: [
      { pts: [[0, 0], [4, 10], [4, 0]], colour: VX, label: "20 m", at: [3, 3] },
      { pts: rect(4, 9, 0, 10), colour: AC, label: "50 m", at: [6.5, 5] },
      { pts: [[9, 0], [9, 10], [13, 5], [13, 0]], colour: VY, label: "30 m", at: [11, 3.5] },
    ],
    lines: [{ pts: [[0, 0], [4, 10], [9, 10], [13, 5]] }, { pts: [[13, 0], [13, 12.5]], dashed: true, width: 1.2 }],
    notes: [
      { at: [6.5, 10], text: "10.0 m/s", dy: -6 },
      { at: [13, 5], text: "5.0", anchor: "start", dx: 5, colour: VY },
      { at: [13, 12.5], text: "end of race", anchor: "end", dx: -4, dy: 10, bold: false },
    ],
    keys: [
      [VX, "½ × 4 × 10 = 20 m · getting up to speed", "area of triangle"],
      [AC, "5 × 10 = 50 m · top speed 4 s to 9 s", "area of rectangle"],
      [VY, "½ × (10 + 5.0) × 4 = 30 m · tiring", "area of trapezium"],
      ["currentColor", "100 m in 13 s → 7.7 m/s", "displacement; average velocity = Δs ÷ Δt"],
    ],
  }),
  "Velocity–time graph of a sprinter: rises in a straight line from 0 to 10.0 m/s in 4 s, flat at 10.0 m/s from 4 s to 9 s, then falls in a straight line to 5.0 m/s at 13 s, where the race ends. Areas: 20 m, 50 m and 30 m.",
  "Textbook p. 30, Figure 6. Three shapes: 20 + 50 + 30 = 100 m in total.",
);

// ---------- Ball up a ramp (Textbook p. 30, Fig 7): area below the axis ----------
export const figRamp = svg(
  vt({
    id: "s34-ramp",
    t: [8, 1, 2, 1], v: [-4, 4, 1, 2, 1], h: 150,
    shades: [
      { pts: [[0, 0], [0, 4], [4, 0]], colour: VX, label: "+8.0 m", at: [1.4, 1.3] },
      { pts: [[4, 0], [8, -4], [8, 0]], colour: VY, label: "−8.0 m", at: [6.6, -1.3] },
    ],
    lines: [{ pts: [[0, 4], [8, -4]] }],
    notes: [
      { at: [4, 0], text: "stops: v = 0", anchor: "start", dx: 6, dy: -8 },
      { at: [2, 4], text: "going up the ramp", dy: -4, colour: VX },
      { at: [2, -2.6], text: "rolling back down", colour: VY },
    ],
    keys: [
      [VX, "½ × 4.0 × 4.0 = +8.0 m · up the ramp", "area above axis = displacement (positive)"],
      [VY, "½ × 4.0 × 4.0 = −8.0 m · back down", "area below axis = displacement (negative)"],
      ["currentColor", "8.0 + 8.0 = 16 m · total ground covered", "distance (add sizes, ignore signs)"],
      [AC, "8.0 + (−8.0) = 0 m · back where it started", "displacement (signs count)"],
    ],
  }),
  "Velocity–time graph for a ball rolled up a ramp: a straight line from +4.0 m/s at 0 s down through zero at 4.0 s to −4.0 m/s at 8.0 s. The triangle above the axis has area +8.0 m; the triangle below the axis has area −8.0 m.",
  "Textbook p. 30, Figure 7. Velocity below zero means moving the other way, so area below the axis counts as negative displacement.",
);

// ---------- Counting squares (ours): car pulling away ----------
const pull = (t: number) => 12 * (1 - Math.exp(-t / 4));
// From python: fraction of each 2 s × 2 m/s square under the curve. ≥ 0.8 = (nearly) full; 0.5–0.8 = mostly under.
const fullCols = [1, 3, 4, 5, 5, 5];
const fullSquares: Shade[] = fullCols.flatMap((n, i) =>
  Array.from({ length: n }, (_, j) => ({ pts: rect(2 * i + 0.08, 2 * i + 1.92, 2 * j + 0.08, 2 * j + 1.92), colour: VX, opacity: 0.45 })),
);
export const figSquares = svg(
  vt({
    id: "s34-sq",
    t: [12, 2], v: [0, 12, 2], h: 160,
    shades: [...fullSquares, { pts: rect(10.08, 11.92, 10.08, 11.92), colour: VY, opacity: 0.55 }],
    lines: [{ pts: sample(pull, 0, 12) }],
    notes: [
      { at: [11, 10.15], text: "1", colour: "currentColor" },
      { at: [0.2, 9.4], text: "skip: mostly above", anchor: "start", bold: false, colour: MU },
    ],
    keys: [
      [VX, "23 squares · full or nearly full", "count these first"],
      [VY, "1 square · more than half under the curve", "count it; skip squares mostly above"],
      ["currentColor", "2 s × 2 m/s = 4 m · what one square is worth", "area of one square"],
      [AC, "24 × 4 m = 96 m · distance in 12 s", "estimate of area under a non-linear graph"],
    ],
  }),
  "A curved velocity–time graph for a car pulling away: speed rises quickly at first then levels off towards 12 m/s by 12 s. The grid squares are 2 s wide and 2 m/s tall. 23 squares that are full or nearly full are shaded orange; one extra square that is mostly under the curve, near the top right, is shaded purple.",
  "Our example. Each square is 2 s × 2 m/s = 4 m. 24 squares → about 96 m. (The exact area is 98 m, so the count is within 3%.)",
);

// ---------- Stopping distance (ours) ----------
export const figStopping = svg(
  vt({
    id: "s34-stop",
    t: [4, 0.5, 2, 1], v: [0, 18, 3, 2], h: 140,
    shades: [
      { pts: rect(0, 0.6, 0, 15), colour: VX, label: "9.0 m", at: [0.3, 7.5] },
      { pts: [[0.6, 0], [0.6, 15], [3.6, 0]], colour: VY, label: "22.5 m", at: [1.5, 5] },
    ],
    lines: [{ pts: [[0, 15], [0.6, 15], [3.6, 0]] }],
    notes: [
      { at: [0.3, 15], text: "0.60 s", dy: -6, colour: VX },
      { at: [2.1, 0], text: "3.0 s braking", dy: -5, colour: VY },
      { at: [0, 15], text: "15", anchor: "end", dx: -5, dy: 4, colour: AC },
    ],
    keys: [
      [VX, "15 × 0.60 = 9.0 m · before the brakes go on", "thinking distance (rectangle)"],
      [VY, "½ × 3.0 × 15 = 22.5 m · while braking", "braking distance (triangle)"],
      ["currentColor", "9.0 + 22.5 = 31.5 m · total to stop", "stopping distance = area under graph"],
    ],
  }),
  "Velocity–time graph for a car: flat at 15 m/s for 0.60 s (the driver reacting), then a straight line down to 0 at 3.6 s (braking). The rectangle under the flat part is 9.0 m; the triangle under the sloping part is 22.5 m.",
  "Our example. Flat part = the driver reacting; sloping part = braking.",
);

export const figShapeChanges = svg(
  vt({
    id: "s34-shape",
    t: [6, 1, 1], v: [0, 18, 3, 2], h: 140,
    lines: [
      { pts: [[0, 15], [0.6, 15], [3.6, 0]] },
      { pts: [[0, 15], [1.2, 15], [4.2, 0]], colour: VX, dashed: true },
      { pts: [[0.6, 15], [5.6, 0]], colour: VY, dashed: true },
    ],
    notes: [
      { at: [1.2, 15], text: "tired: flat part longer", anchor: "start", dx: 6, dy: -6, colour: VX },
      { at: [3.7, 8.5], text: "wet road: less steep", anchor: "start", colour: VY },
      { at: [2.4, 2], text: "normal", anchor: "end" },
    ],
    keys: [
      ["currentColor", "0.60 s then 3.0 s · normal stop", "reaction time + braking time"],
      [VX, "flat part 1.2 s, slope unchanged", "longer reaction time → larger thinking distance"],
      [VY, "flat part unchanged, slope less steep", "smaller deceleration → larger braking distance"],
    ],
  }),
  "Three velocity–time graphs for a car stopping from 15 m/s. Normal: flat for 0.60 s then straight down to zero at 3.6 s. Tired driver: flat for 1.2 s, then the same slope down, reaching zero at 4.2 s. Wet road: flat for 0.60 s, then a less steep line reaching zero at 5.6 s.",
  "Our example. Read each change off the graph: a longer flat part or a shallower slope both add area, so both add stopping distance.",
);

// ================= Question figures =================
export const figQFour = svg(
  vt({
    id: "s34-q4",
    t: [10, 1, 2], v: [0, 12, 2], h: 150,
    lines: [
      { pts: [[0, 6], [10, 6]], colour: AC },
      { pts: [[0, 0], [10, 11]], colour: VX },
      { pts: [[0, 10], [10, 4]], colour: VY },
      { pts: [[0, 2], [10, 10]], colour: "currentColor" },
    ],
    notes: [
      { at: [10, 6], text: "A", anchor: "start", dx: 4, dy: 4, colour: AC },
      { at: [10, 11], text: "B", anchor: "start", dx: 4, dy: 4, colour: VX },
      { at: [10, 4], text: "C", anchor: "start", dx: 4, dy: 4, colour: VY },
      { at: [10, 10], text: "D", anchor: "start", dx: 4, dy: 8 },
    ],
  }),
  "Four straight-line velocity–time graphs from 0 to 10 s. A: flat at 6 m/s. B: rises from 0 to 11 m/s. C: falls from 10 m/s to 4 m/s. D: rises from 2 m/s to 10 m/s.",
);

export const figQTram = svg(
  vt({ id: "s34-qtram", t: [50, 5, 2], v: [0, 25, 5], h: 140, lines: [{ pts: [[0, 20], [5, 20], [45, 0]] }] }),
  "Velocity–time graph of a tram: flat at 20 m/s from 0 to 5.0 s, then a straight line down to 0 at 45 s.",
);

export const figQStopLine = svg(
  vt({ id: "s34-qline", t: [4, 0.5, 2, 1], v: [0, 14, 2, 2], h: 140, lines: [{ pts: [[0, 12], [0.5, 12], [3.5, 0]] }] }),
  "Velocity–time graph of a car: flat at 12 m/s from 0 to 0.50 s, then a straight line down to 0 at 3.5 s.",
);

export const figQCyclist = svg(
  vt({ id: "s34-qcyc", t: [10, 1, 2], v: [0, 10, 1, 2], h: 140, lines: [{ pts: [[0, 3], [4, 9], [10, 9]] }] }),
  "Velocity–time graph of a cyclist: straight line from 3.0 m/s at 0 s to 9.0 m/s at 4.0 s, then flat at 9.0 m/s until 10.0 s.",
);

const fall = (t: number) => 10 * (1 - Math.exp(-t / 3));
export const figQCurve = svg(
  vt({ id: "s34-qcurve", t: [10, 1, 2], v: [0, 10, 2], h: 150, lines: [{ pts: sample(fall, 0, 10) }] }),
  "Curved velocity–time graph for a toy parachute falling from rest: velocity rises steeply from 0, then levels off, reaching about 9.6 m/s at 10 s. Grid squares are 1 s wide and 2 m/s tall.",
  "Grid: each square is 1 s wide and 2 m/s tall.",
);

export const figQThrow = svg(
  vt({
    id: "s34-qthrow",
    t: [1.2, 0.2, 1, 1], v: [-6, 6, 2], h: 150,
    lines: [{ pts: [[0, 6], [1.2, 6 - 9.81 * 1.2]] }],
    notes: [{ at: [0, 6], text: "6.0", anchor: "start", dx: 6, dy: 4 }],
  }),
  "Velocity–time graph of a ball thrown straight up: a straight line from +6.0 m/s at 0 s, crossing zero at about 0.61 s, to about −5.8 m/s at 1.2 s. Up is positive.",
  "Up is positive. The line's gradient is −9.81 m s⁻².",
);
