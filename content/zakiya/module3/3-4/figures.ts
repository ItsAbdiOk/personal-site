import type { Figure, GraphAxis } from "@/lib/zakiya/types";

// Graphs for 3.4. Every velocity–time graph is a declarative `graph` figure (components/zakiya/Graph.tsx),
// so the numbers are recomputed from `expr` / `points` by scripts/zakiya/check/claims_3_4_*.py.
// Straight-line graphs use `points` (exact); the three curves use `expr`.
// Curves were hand-sketched in the old SVGs (no printed formula), so each is a simple exponential
// approach to a limit through the same labelled points: figStrip, figSquares, figQCurve.

const t = (max: number, step: number): GraphAxis => ({ label: "time", symbol: "t", unit: "s", min: 0, max, step });
const vAx = (min: number, max: number, step: number): GraphAxis => ({ label: "velocity", symbol: "v", unit: "m s⁻¹", min, max, step });
const disp = (decimals: number) => ({ quantity: "displacement", unit: "m", decimals });

// ---------- Why area = displacement: one thin strip ----------
// Sketched curve v = 8(1 − e^(−t/3.6)): 6.0 m/s at 5 s, levelling off towards 8 m/s.
export const figStrip: Figure = {
  kind: "graph",
  alt: "A curved velocity–time graph rising from 0 towards 8 metres per second over 10 seconds, passing 6.0 m/s at 5 seconds. The area under the whole curve is shaded.",
  caption:
    "Over a short 0.5 s the speed hardly changes (about 6.0 m/s at 5 s), so a thin strip there is almost a rectangle: 6.0 × 0.5 = 3.0 m travelled. Add up all the strips and you get the whole shaded area, which is the whole {{s|displacement}}.",
  x: t(10, 1),
  y: vAx(0, 10, 1),
  series: [{ id: "v", expr: "8*(1-exp(-t/3.6))", colour: "accent" }],
  points: [{ x: 5, y: 6, label: "6.0 m s⁻¹" }],
  area: { series: "v", from: 0, to: 10, readout: disp(0) },
};

// ---------- Cyclist (Textbook p. 29–30): split into A + B + C ----------
const cycX = t(50, 10);
const cycY = vAx(0, 5, 1);
export const figCyclist: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a cyclist: straight line from 0 to 4.0 m/s over the first 10 s, flat at 4.0 m/s from 10 s to 30 s, then a straight line down to 0 at 50 s. The area under the line is shaded and equals 140 m.",
  caption:
    "Textbook p. 29–30. Straight lines only, so the area splits at each corner into triangle A (first 10 s, 20 m), rectangle B (10 to 30 s, 80 m) and triangle C (30 to 50 s, 40 m). 20 + 80 + 40 = 140 m.",
  x: cycX,
  y: cycY,
  series: [{ id: "cyc", points: [[0, 0], [10, 4], [30, 4], [50, 0]], colour: "accent" }],
  points: [{ x: 10, y: 4, label: "10 s" }, { x: 30, y: 4, label: "30 s" }],
  area: { series: "cyc", from: 0, to: 50, readout: disp(0) },
};

export const figCyclistTrap: Figure = {
  kind: "graph",
  alt: "The same cyclist graph shaded as one trapezium. The top parallel side (the flat part) is 20 s long, the bottom parallel side (the time axis) is 50 s long, and the height is 4.0 m/s. The area is 140 m.",
  caption: "Same graph, one shape: a [[trapezium]]. Parallel sides 20 s (flat top) and 50 s (time axis), height 4.0 m s⁻¹. Same answer, ½ × (50 + 20) × 4.0 = 140 m.",
  x: cycX,
  y: cycY,
  series: [{ id: "cyc", points: [[0, 0], [10, 4], [30, 4], [50, 0]], colour: "accent" }],
  points: [{ x: 10, y: 4 }, { x: 30, y: 4, label: "4.0 m s⁻¹" }],
  area: { series: "cyc", from: 0, to: 50, readout: disp(0) },
};

// ---------- Car (Textbook p. 30, Fig 5) ----------
export const figCar: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a car: straight line from 0 to 15 m/s over 75 s, then flat at 15 m/s until 100 s. The area under the line is shaded and equals 937.5 m.",
  caption: "Textbook p. 30, Figure 5. Triangle (0 to 75 s) 562.5 m plus rectangle (75 to 100 s, 25 s at 15 m s⁻¹) 375 m = 937.5 m. 937.5 m ÷ 100 s = 9.4 m s⁻¹ average velocity.",
  x: t(100, 25),
  y: vAx(0, 20, 5),
  series: [{ id: "car", points: [[0, 0], [75, 15], [100, 15]], colour: "accent" }],
  points: [{ x: 75, y: 15, label: "75 s" }],
  area: { series: "car", from: 0, to: 100, readout: disp(1) },
};

// ---------- Sprinter (Textbook p. 30, Fig 6) ----------
export const figSprinter: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a sprinter: rises in a straight line from 0 to 10.0 m/s in 4 s, flat at 10.0 m/s from 4 s to 9 s, then falls in a straight line to 5.0 m/s at 13 s, where the race ends. The area under the line is shaded and equals 100 m.",
  caption: "Textbook p. 30, Figure 6. The race ends at 13 s. Three shapes: triangle 20 m, rectangle 50 m, trapezium 30 m. 20 + 50 + 30 = 100 m in total, in 13 s, so 7.7 m s⁻¹ on average.",
  x: t(14, 1),
  y: vAx(0, 12.5, 2.5),
  series: [{ id: "spr", points: [[0, 0], [4, 10], [9, 10], [13, 5]], colour: "accent" }],
  points: [{ x: 4, y: 10, label: "10.0" }, { x: 9, y: 10 }, { x: 13, y: 5 }],
  area: { series: "spr", from: 0, to: 13, readout: disp(0) },
};

// ---------- Ball up a ramp (Textbook p. 30, Fig 7): area below the axis ----------
export const figRamp: Figure = {
  kind: "graph",
  alt: "Velocity–time graph for a ball rolled up a ramp: a straight line from +4.0 m/s at 0 s down through zero at 4.0 s to −4.0 m/s at 8.0 s. The triangle above the axis has area +8.0 m; the triangle below the axis has area −8.0 m, so the net displacement is 0.",
  caption:
    "Textbook p. 30, Figure 7. Velocity below zero means moving the other way, so area below the axis counts as negative displacement: +8.0 m (up the ramp) and −8.0 m (back down) add to a displacement of 0. The distance covered is 8.0 + 8.0 = 16 m.",
  x: t(8, 1),
  y: vAx(-4, 4, 1),
  series: [{ id: "ball", points: [[0, 4], [8, -4]], colour: "accent" }],
  points: [{ x: 4, y: 0 }],
  area: { series: "ball", from: 0, to: 8, readout: disp(0) },
};

// ---------- Counting squares (ours): car pulling away ----------
// Sketched curve v = 12(1 − e^(−t/4)): reaches 11.4 m/s at 12 s. Exact area is 98.4 m.
export const figSquares: Figure = {
  kind: "graph",
  alt: "A curved velocity–time graph for a car pulling away: speed rises quickly at first then levels off towards 12 m/s by 12 s. The grid squares are 2 s wide and 2 m/s tall; the squares full or mostly under the curve are shaded and counted.",
  caption: "Our example. Each square is 2 s × 2 m/s = 4 m. Count the 19 whole squares, then the 5 part squares that are more than half under the curve: 24 squares → about 96 m. (The exact area is 98 m, so the count is within 3%.)",
  x: t(12, 2),
  y: vAx(0, 12, 2),
  series: [{ id: "car", expr: "12*(1-exp(-t/4))", colour: "accent" }],
  area: { series: "car", from: 0, to: 12, readout: { quantity: "distance travelled", unit: "m", decimals: 0 }, squares: true },
};

// ---------- Stopping distance (ours) ----------
export const figStopping: Figure = {
  kind: "graph",
  alt: "Velocity–time graph for a car: flat at 15 m/s for 0.60 s (the driver reacting), then a straight line down to 0 at 3.6 s (braking). The rectangle under the flat part is 9.0 m; the triangle under the sloping part is 22.5 m; the whole shaded area is 31.5 m.",
  caption: "Our example. Flat part = the driver reacting: 15 × 0.60 = 9.0 m. Sloping part = braking: ½ × 3.0 × 15 = 22.5 m. Total stopping distance 31.5 m.",
  x: t(4, 0.5),
  y: vAx(0, 18, 3),
  series: [{ id: "stop", points: [[0, 15], [0.6, 15], [3.6, 0]], colour: "accent" }],
  points: [{ x: 0.6, y: 15, label: "0.60 s" }],
  area: { series: "stop", from: 0, to: 3.6, readout: { quantity: "stopping distance", unit: "m", decimals: 1 } },
};

export const figShapeChanges: Figure = {
  kind: "graph",
  alt: "Three velocity–time graphs for a car stopping from 15 m/s. Normal: flat for 0.60 s then straight down to zero at 3.6 s. Tired driver: flat for 1.2 s, then the same slope down, reaching zero at 4.2 s. Wet road: flat for 0.60 s, then a less steep line reaching zero at 5.6 s.",
  caption: "Our example. Read each change off the graph: a longer flat part (tired driver) or a shallower slope (wet road) both add area, so both add stopping distance.",
  x: t(6, 1),
  y: vAx(0, 18, 3),
  series: [
    { id: "normal", label: "normal", points: [[0, 15], [0.6, 15], [3.6, 0]], colour: "accent" },
    { id: "tired", label: "tired: flat part longer", points: [[0, 15], [1.2, 15], [4.2, 0]], colour: "vx" },
    { id: "wet", label: "wet road: less steep", points: [[0, 15], [0.6, 15], [5.6, 0]], colour: "vy" },
  ],
};

// ================= Question figures =================
export const figQFour: Figure = {
  kind: "graph",
  alt: "Four straight-line velocity–time graphs from 0 to 10 s. A: flat at 6 m/s. B: rises from 0 to 11 m/s. C: falls from 10 m/s to 4 m/s. D: rises from 2 m/s to 10 m/s.",
  x: t(10, 1),
  y: vAx(0, 12, 2),
  series: [
    { id: "A", label: "A", points: [[0, 6], [10, 6]], colour: "accent" },
    { id: "B", label: "B", points: [[0, 0], [10, 11]], colour: "vx" },
    { id: "C", label: "C", points: [[0, 10], [10, 4]], colour: "vy" },
    { id: "D", label: "D", points: [[0, 2], [10, 10]], colour: "muted" },
  ],
};

export const figQTram: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a tram: flat at 20 m/s from 0 to 5.0 s, then a straight line down to 0 at 45 s.",
  x: t(50, 5),
  y: vAx(0, 25, 5),
  series: [{ id: "tram", points: [[0, 20], [5, 20], [45, 0]], colour: "accent" }],
};

export const figQStopLine: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a car: flat at 12 m/s from 0 to 0.50 s, then a straight line down to 0 at 3.5 s.",
  x: t(4, 0.5),
  y: vAx(0, 14, 2),
  series: [{ id: "car", points: [[0, 12], [0.5, 12], [3.5, 0]], colour: "accent" }],
};

export const figQCyclist: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a cyclist: straight line from 3.0 m/s at 0 s to 9.0 m/s at 4.0 s, then flat at 9.0 m/s until 10.0 s.",
  x: t(10, 1),
  y: vAx(0, 10, 1),
  series: [{ id: "cyc", points: [[0, 3], [4, 9], [10, 9]], colour: "accent" }],
};

// Sketched curve v = 10(1 − e^(−t/3)): about 9.6 m/s at 10 s.
export const figQCurve: Figure = {
  kind: "graph",
  alt: "Curved velocity–time graph for a toy parachute falling from rest: velocity rises steeply from 0, then levels off, reaching about 9.6 m/s at 10 s. Grid squares are 1 s wide and 2 m/s tall.",
  caption: "Grid: each square is 1 s wide and 2 m/s tall.",
  x: t(10, 1),
  y: vAx(0, 10, 2),
  series: [{ id: "para", expr: "10*(1-exp(-t/3))", colour: "accent" }],
};

export const figQThrow: Figure = {
  kind: "graph",
  alt: "Velocity–time graph of a ball thrown straight up: a straight line from +6.0 m/s at 0 s, crossing zero at about 0.61 s, to about −5.8 m/s at 1.2 s. Up is positive.",
  caption: "Up is positive. The line's gradient is −9.81 m s⁻².",
  x: t(1.2, 0.2),
  y: vAx(-6, 6, 2),
  series: [{ id: "ball", expr: "6 - 9.81*t", colour: "accent" }],
  points: [{ x: 0, y: 6, label: "6.0" }],
};
