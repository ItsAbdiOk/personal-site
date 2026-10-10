import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.3. Every number is drawn where it lives, with a key underneath:
// value · plain words (bold), then the exam term (muted).
// Colours: --vy = velocity, --vx = time, --accent = acceleration / gradient.

const head = (id: string, h: number) => `<svg viewBox="0 0 340 ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

// One "before → after" row: velocity arrow at the start and at the end, time bar underneath, result.
const row = (id: string, y0: number, title: string, uTxt: string, uLen: number, vTxt: string, vLen: number, tTxt: string, res: string) => `
  <text x="8" y="${y0 + 14}" fill="currentColor" stroke="none" font-weight="600">${title}</text>
  <text x="20" y="${y0 + 32}" stroke="none" font-size="11.5" style="fill:var(--muted)">start</text>
  <text x="200" y="${y0 + 32}" stroke="none" font-size="11.5" style="fill:var(--muted)">end</text>
  <circle cx="20" cy="${y0 + 46}" r="5" fill="currentColor" stroke="none"/>
  <circle cx="200" cy="${y0 + 46}" r="5" fill="currentColor" stroke="none"/>
  ${uLen > 0 ? `<line x1="20" y1="${y0 + 46}" x2="${20 + uLen}" y2="${y0 + 46}" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#${id}-v)"/>` : ""}
  ${vLen > 0 ? `<line x1="200" y1="${y0 + 46}" x2="${200 + vLen}" y2="${y0 + 46}" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#${id}-v)"/>` : ""}
  <g stroke="none" font-weight="600" style="fill:var(--vy)">
    <text x="${uLen > 0 ? 24 + uLen : 30}" y="${y0 + 50}">${uTxt}</text>
    <text x="${vLen > 0 ? 204 + vLen : 210}" y="${y0 + 50}">${vTxt}</text>
  </g>
  <line x1="22" y1="${y0 + 66}" x2="198" y2="${y0 + 66}" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#${id}-t)" marker-end="url(#${id}-t)"/>
  <text x="110" y="${y0 + 82}" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vx)">${tTxt}</text>
  <text x="330" y="${y0 + 82}" text-anchor="end" stroke="none" font-weight="700" style="fill:var(--accent)">${res}</text>`;

// ---------- Cheetah (Textbook p. 27: up to 13 m s⁻², up to 26 m s⁻¹) ----------
const svgCheetah = `${head("ac-ch", 262)}
  <text x="8" y="18" stroke="none" font-size="12" style="fill:var(--muted)">if it kept up 13 m s⁻² from rest, 1 second between dots</text>
  <g fill="currentColor" stroke="none">
    <circle cx="30" cy="50" r="5"/><circle cx="30" cy="100" r="5"/><circle cx="30" cy="150" r="5"/>
  </g>
  <g stroke-width="2.5" style="stroke:var(--vy)">
    <line x1="30" y1="100" x2="90" y2="100" marker-end="url(#ac-ch-v)"/>
    <line x1="30" y1="150" x2="150" y2="150" marker-end="url(#ac-ch-v)"/>
  </g>
  <line x1="90" y1="143" x2="90" y2="157" stroke-width="1" stroke-dasharray="2 2"/>
  <g stroke="none" font-weight="600">
    <text x="44" y="54" style="fill:var(--vy)">t = 0 s: 0 m/s</text>
    <text x="98" y="104" style="fill:var(--vy)">t = 1 s: 13 m/s</text>
    <text x="158" y="154" style="fill:var(--vy)">t = 2 s: 26 m/s</text>
    <text x="60" y="90" text-anchor="middle" style="fill:var(--accent)">+13 m/s</text>
    <text x="120" y="140" text-anchor="middle" style="fill:var(--accent)">+13 m/s</text>
  </g>
  ${key(196, "var(--accent)", "13 m s⁻² · gains 13 m/s every second", "acceleration a")}
  ${key(230, "var(--vy)", "26 m/s · its top speed", "velocity v")}
</svg>`;

export const figCheetah: Figure = {
  kind: "svg",
  svg: svgCheetah,
  alt: "Three dots one second apart for a cheetah starting from rest. Its velocity arrow is 0 metres per second at 0 s, 13 at 1 s and 26 at 2 s, gaining 13 metres per second each second.",
  caption: "Cheetah numbers from the textbook (p. 27). An acceleration of 13 {{ms2}} means **+13 m s⁻¹ every second**, so from rest it would hit its 26 m s⁻¹ top speed in 2 s.",
};

// ---------- Bugatti (Textbook p. 27) ----------
const svgBugatti = `${head("ac-bu", 330)}
  ${row("ac-bu", 0, "a · speeding up", "0 m/s", 0, "27.8 m/s", 60, "2.46 s", "a = ? → 11.3 m s⁻²")}
  ${row("ac-bu", 100, "b · braking", "27.8 m/s", 60, "0 m/s", 0, "2.34 s", "a = ? → −11.9 m s⁻²")}
  ${key(222, "var(--vy)", "0 and 27.8 m/s · speed at start and end", "initial velocity u, final velocity v")}
  ${key(256, "var(--vx)", "2.46 s, 2.34 s · how long the change took", "time taken Δt")}
  ${key(290, "var(--accent)", "11.3, −11.9 · m/s gained (or lost) per second", "acceleration a (minus = deceleration)")}
</svg>`;

export const figBugatti: Figure = {
  kind: "svg",
  svg: svgBugatti,
  alt: "Two rows. Row a: the car starts at 0 metres per second and ends at 27.8 metres per second after 2.46 seconds; acceleration unknown, answer 11.3 metres per second squared. Row b: the car starts at 27.8 metres per second and stops after 2.34 seconds; acceleration unknown, answer minus 11.9 metres per second squared.",
  caption: "Textbook Bugatti (p. 27). Same size of velocity change both times; the sign of the answer tells you speeding up (+) or slowing down (−).",
};

// ---------- Cyclist and train (Textbook p. 28 summary Q1, Q2) ----------
const svgCyclistTrain = `${head("ac-ct", 330)}
  ${row("ac-ct", 0, "Cyclist", "0 m/s", 0, "8.0 m/s", 12, "12 s", "a = ? → 0.67 m s⁻²")}
  ${row("ac-ct", 100, "Train", "40 m/s", 60, "10 m/s", 15, "60 s", "a = ? → −0.50 m s⁻²")}
  ${key(222, "var(--vy)", "8.0 m/s; 40 → 10 m/s · speeds at start and end", "initial velocity u, final velocity v")}
  ${key(256, "var(--vx)", "12 s, 60 s · how long the change took", "time taken Δt")}
  ${key(290, "var(--accent)", "0.67; 0.50 · speeding up; slowing by 0.50 each s", "acceleration; magnitude of deceleration")}
</svg>`;

export const figCyclistTrain: Figure = {
  kind: "svg",
  svg: svgCyclistTrain,
  alt: "Two rows. Cyclist: starts at rest, reaches 8.0 metres per second after 12 seconds; acceleration answer 0.67 metres per second squared. Train: slows from 40 to 10 metres per second over 60 seconds; acceleration answer minus 0.50 metres per second squared.",
  caption: "Textbook summary questions 1 and 2 (p. 28). Arrow length = velocity.",
};

// ---------- Figure 5 graph with two gradient triangles (Textbook p. 28) ----------
// origin (50,200); 1.0 s = 80 px; 1.0 m/s = 40 px.

export const figFig5: Figure = {
  kind: "graph",
  alt: "Velocity–time graph. A straight line rises from 0 to 2.0 metres per second between 0 and 1.0 seconds, then a shallower straight line rises to 3.0 metres per second at 3.0 seconds. A dashed tangent triangle on the second line has rise 1.0 metres per second and run 2.0 seconds, so its gradient is 0.50 metres per second squared. Dragging the dot into the first second gives a gradient of 2.0 metres per second squared.",
  caption: "Textbook Figure 5 (p. 28) with gradient triangles. Second section: 1.0 ÷ 2.0 = 0.50 m s⁻². Drag the dot into the first second: the line is steeper and the gradient reads 2.0 m s⁻² (rise 2.0 per 1.0 s). Steeper line = bigger {{a}}. Maximum acceleration = 2.0 m s⁻², in the first second.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 3, step: 0.5 },
  y: { label: "velocity", symbol: "v", unit: "m s⁻¹", min: 0, max: 4, step: 1 },
  series: [{ id: "v", label: "v–t", points: [[0, 0], [1, 2], [3, 3]], colour: "vy" }],
  points: [{ x: 1, y: 2, label: "2.0 m s⁻¹ at 1.0 s" }, { x: 3, y: 3, label: "3.0 m s⁻¹ at 3.0 s" }],
  tangent: {
    series: "v",
    at: 2,
    draggable: true,
    showTriangle: true,
    readout: { quantity: "acceleration", unit: "m s⁻²", decimals: 2 },
  },
};

// ---------- Tangent on a curve (ours, hand-sketched: tangent at t = 4.0 s) ----------
// The old hand-drawn curve was a sketch (v = 4t − 0.25t²). That parabola turns over at 8 s, so it cannot carry the
// 10.0 s run in the worked example on a clipped axis. Same labelled points instead: v(4.0) = 12 m s⁻¹, tangent
// gradient 2.0 m s⁻² (through (0, 4) and (10.0, 24)) from the simple formula v = 36t ÷ (8 + t).
export const figTangent: Figure = {
  kind: "graph",
  alt: "A curved velocity–time graph rising steeply then levelling off. A straight tangent touches it at t = 4.0 seconds, where v = 12 metres per second. The tangent runs from 4 metres per second at 0 seconds to 24 metres per second at 10.0 seconds. Big triangle: rise 20 metres per second, run 10.0 seconds, gradient 2.0 metres per second squared. The touching point can be dragged along the curve.",
  caption: "Our example. The {{tangent}} touches the curve at t = 4.0 s. Use a **big** triangle on the tangent, not on the curve: 20 ÷ 10.0 = 2.0 m s⁻². Drag the dot: the flatter the curve, the smaller the acceleration.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 18, step: 2 },
  y: { label: "velocity", symbol: "v", unit: "m s⁻¹", min: 0, max: 30, step: 5 },
  series: [{ id: "v", label: "v–t", expr: "36*t/(8+t)", colour: "vy" }],
  points: [{ x: 4, y: 12, label: "t = 4.0 s, v = 12 m s⁻¹" }],
  tangent: {
    series: "v",
    at: 4,
    draggable: true,
    showTriangle: true,
    readout: { quantity: "acceleration", unit: "m s⁻²", decimals: 1 },
  },
};

// ---------- Four v–t shapes (Textbook p. 28 Figure 4) ----------
const mini = (x: number, y: number, d: string, top: string, term: string) => `
  <line x1="${x}" y1="${y + 70}" x2="${x + 140}" y2="${y + 70}" stroke-width="1.2"/>
  <line x1="${x}" y1="${y + 70}" x2="${x}" y2="${y}" stroke-width="1.2"/>
  <text x="${x - 4}" y="${y + 8}" text-anchor="end" stroke="none" font-size="11" fill="currentColor">v</text>
  <text x="${x + 140}" y="${y + 84}" text-anchor="end" stroke="none" font-size="11" fill="currentColor">t</text>
  <path d="${d}" stroke-width="2.5" style="stroke:var(--accent)" transform="translate(${x},${y})"/>
  <text x="${x}" y="${y + 100}" stroke="none" font-size="12" font-weight="600" fill="currentColor">${top}</text>
  <text x="${x}" y="${y + 115}" stroke="none" font-size="11" style="fill:var(--muted)">${term}</text>`;

const svgShapes = `${head("ac-sh", 290)}
  ${mini(20, 10, "M0,55 L130,12", "straight, sloping up", "constant acceleration")}
  ${mini(172, 10, "M0,30 L130,30", "flat", "zero acceleration (constant v)")}
  ${mini(20, 150, "M0,10 L130,55", "straight, sloping down", "constant deceleration")}
  ${mini(172, 150, "M0,60 Q20,15 130,8", "curve getting flatter", "acceleration decreasing")}
</svg>`;

export const figShapes: Figure = {
  kind: "svg",
  svg: svgShapes,
  alt: "Four small velocity–time graphs. A straight line sloping up: constant acceleration. A flat line: zero acceleration, constant velocity. A straight line sloping down: constant deceleration. A curve that gets flatter: acceleration decreasing.",
  caption: "Read the {{grad|gradient}}, not the height. Based on Textbook Figure 4 (p. 28).",
};

// ---------- Acceleration–time graph for Figure 5 (Textbook p. 28 Q4b) ----------

export const figAT: Figure = {
  kind: "graph",
  alt: "Acceleration–time graph. A flat line at 2.0 metres per second squared from 0 to 1.0 seconds, then a step down to a flat line at 0.50 metres per second squared from 1.0 to 3.0 seconds.",
  caption: "Each straight section of the v–t graph becomes a **flat** step on the {{atgraph}}.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 3, step: 0.5 },
  y: { label: "acceleration", symbol: "a", unit: "m s⁻²", min: 0, max: 2.5, step: 0.5 },
  series: [{ id: "a", label: "a–t", points: [[0, 2], [1, 2], [1, 0.5], [3, 0.5]], colour: "accent" }],
  points: [{ x: 0.5, y: 2, label: "2.0 m s⁻²" }, { x: 2, y: 0.5, label: "0.50 m s⁻²" }],
};

// ---------- Question figure: tram v–t graph (ours) ----------
// origin (50,190); 1 s = 2.4 px; 1 m/s = 10 px.

export const figTram: Figure = {
  kind: "graph",
  alt: "Velocity–time graph for a tram. Straight line from 0 to 12 metres per second between 0 and 20 seconds, flat at 12 metres per second until 80 seconds, then a straight line down to 0 at 104 seconds.",
  caption: "Velocity–time graph for the tram.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 120, step: 20 },
  y: { label: "velocity", symbol: "v", unit: "m s⁻¹", min: 0, max: 16, step: 4 },
  series: [{ id: "tram", points: [[0, 0], [20, 12], [80, 12], [104, 0]], colour: "vy" }],
};
