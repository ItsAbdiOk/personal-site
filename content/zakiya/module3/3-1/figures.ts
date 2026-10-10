import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.1. Every number is drawn where it lives, with a key underneath:
// value · plain words (bold), exam term (muted).
// Colours: --vx (orange) = distance, --vy (purple) = time, --accent (blue) = speed.

const head = (id: string, h: number) => `<svg viewBox="0 0 340 ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${id}-t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

// Axes for a distance–time graph: origin (50, y0), right to x=310, up to y=top.
const axes = (id: string, y0: number, top: string) => `
  <line x1="50" y1="${y0}" x2="318" y2="${y0}" stroke-width="1.4" marker-end="url(#${id}-c)"/>
  <line x1="50" y1="${y0}" x2="50" y2="${top}" stroke-width="1.4" marker-end="url(#${id}-c)"/>
  <text x="318" y="${y0 + 30}" text-anchor="end" fill="currentColor" stroke="none" font-size="12">time t / s</text>`;

const svg = (s: string, alt: string, caption?: string): Figure => ({ kind: "svg", svg: s, alt, caption });

// ---------- Textbook p. 22: Fine or not? 2500 m in 82 s ----------
export const figFine = svg(
  `${head("f1", 262)}
  <line x1="20" y1="80" x2="320" y2="80" stroke-width="10" style="stroke:var(--ground)"/>
  <g stroke-width="1.5">
    <rect x="12" y="34" width="22" height="16" rx="3"/><line x1="23" y1="50" x2="23" y2="74"/>
    <rect x="306" y="34" width="22" height="16" rx="3"/><line x1="317" y1="50" x2="317" y2="74"/>
  </g>
  <g stroke="none" font-size="11.5" style="fill:var(--muted)">
    <text x="30" y="26" text-anchor="middle">camera 1</text><text x="310" y="26" text-anchor="middle">camera 2</text>
  </g>
  <line x1="25" y1="104" x2="315" y2="104" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#f1-d)" marker-end="url(#f1-d)"/>
  <g stroke="none" font-weight="600">
    <text x="170" y="122" text-anchor="middle" style="fill:var(--vx)">2.5 km = 2500 m</text>
    <text x="170" y="48" text-anchor="middle" style="fill:var(--vy)">1 min 22 s = 82 s</text>
    <text x="170" y="150" text-anchor="middle" style="fill:var(--accent)">v = ? → 2500 ÷ 82 = 30 m/s</text>
    <text x="170" y="168" text-anchor="middle" font-weight="400" font-size="12" style="fill:var(--muted)">limit 22 m/s, so yes: over the limit</text>
  </g>
  ${key(196, "var(--vx)", "2500 m · road between the cameras", "distance travelled Δx")}
  ${key(230, "var(--vy)", "82 s · time between the cameras", "time taken Δt  (speed: 30 m s⁻¹ · average speed v)")}
</svg>`,
  "A straight road with a camera at each end. An arrow between them is labelled 2.5 km = 2500 m. Above the road: 1 min 22 s = 82 s. Below: v = 2500 ÷ 82 = 30 m/s, limit 22 m/s, so over the limit.",
  "Textbook p. 22: the two cameras only know **where** and **when**. Distance ÷ time gives the {{avg|average speed}}.",
);

// ---------- Ours: 72 km/h → 20 m/s ----------
export const figConvert = svg(
  `${head("f2", 224)}
  <g stroke-width="1.4">
    <rect x="20" y="20" width="110" height="34" rx="8"/><rect x="210" y="20" width="110" height="34" rx="8"/>
    <rect x="20" y="70" width="110" height="34" rx="8"/><rect x="210" y="70" width="110" height="34" rx="8"/>
    <line x1="134" y1="37" x2="206" y2="37" marker-end="url(#f2-c)"/><line x1="134" y1="87" x2="206" y2="87" marker-end="url(#f2-c)"/>
  </g>
  <g stroke="none" font-weight="600" text-anchor="middle">
    <text x="75" y="42" style="fill:var(--vx)">72 km</text><text x="265" y="42" style="fill:var(--vx)">72 000 m</text>
    <text x="75" y="92" style="fill:var(--vy)">1 hour</text><text x="265" y="92" style="fill:var(--vy)">3600 s</text>
    <text x="170" y="31" font-weight="400" font-size="11.5" fill="currentColor">× 1000</text>
    <text x="170" y="81" font-weight="400" font-size="11.5" fill="currentColor">× 60 × 60</text>
    <text x="170" y="134" style="fill:var(--accent)">72 000 ÷ 3600 = 20 m/s</text>
  </g>
  ${key(166, "var(--vx)", "72 000 m · distance in one hour", "distance in SI units (metres)")}
  ${key(198, "var(--vy)", "3600 s · one hour", "time in SI units (seconds)")}
</svg>`,
  "Two rows of boxes. 72 km times 1000 becomes 72 000 m. 1 hour times 60 times 60 becomes 3600 s. Below: 72 000 ÷ 3600 = 20 m/s.",
  "Turn both into {{si|SI units}} first, then divide. Shortcut: km/h ÷ 3.6 = m/s ({{kmh}}).",
);

// ---------- Textbook p. 23 Q5: the lorry, two stages ----------
export const figLorry = svg(
  `${head("f3", 282)}
  <line x1="20" y1="70" x2="320" y2="70" stroke-width="10" style="stroke:var(--ground)"/>
  <line x1="250" y1="52" x2="250" y2="88" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="22" y1="92" x2="248" y2="92" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#f3-d)" marker-end="url(#f3-d)"/>
  <line x1="252" y1="92" x2="318" y2="92" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#f3-d)" marker-end="url(#f3-d)"/>
  <line x1="22" y1="138" x2="318" y2="138" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#f3-d)" marker-end="url(#f3-d)"/>
  <g stroke="none" font-weight="600" text-anchor="middle">
    <text x="135" y="30" style="fill:var(--vy)">2.0 min = 120 s</text>
    <text x="135" y="48" style="fill:var(--accent)">25 m/s</text>
    <text x="285" y="30" style="fill:var(--vy)">50 s</text>
    <text x="285" y="48" style="fill:var(--accent)">16 m/s</text>
    <text x="135" y="110" style="fill:var(--vx)">25 × 120 = 3000 m</text>
    <text x="285" y="110" style="fill:var(--vx)">800 m (hill)</text>
    <text x="170" y="156" style="fill:var(--vx)">total 3800 m in 170 s</text>
    <text x="170" y="178" style="fill:var(--accent)">average = ? → 3800 ÷ 170 = 22 m/s</text>
  </g>
  ${key(212, "var(--vx)", "3800 m · whole trip", "total distance travelled")}
  ${key(246, "var(--vy)", "170 s · whole trip", "total time taken  (not (25 + 16) ÷ 2)")}
</svg>`,
  "A road split into two stages. Stage 1: 120 s at 25 m/s, 3000 m. Stage 2, a hill: 800 m in 50 s, 16 m/s. Below: total 3800 m in 170 s, average 22 m/s.",
  "Textbook p. 23 (Q5): the slow stage lasts less time, so it pulls the average down less than you'd guess.",
);

// ---------- Ours: shapes on a distance–time graph ----------
export const figShapes = svg(
  `${head("f4", 262)}
  ${axes("f4", 190, "20")}
  <text x="44" y="16" fill="currentColor" stroke="none" font-size="12">distance x / m</text>
  <g stroke-width="2.4">
    <line x1="50" y1="150" x2="300" y2="150" style="stroke:var(--muted)"/>
    <line x1="50" y1="190" x2="300" y2="120" style="stroke:var(--vx)"/>
    <line x1="50" y1="190" x2="170" y2="40" style="stroke:var(--accent)"/>
  </g>
  <g stroke="none" font-weight="600" font-size="12.5">
    <text x="300" y="166" text-anchor="end" style="fill:var(--muted)">flat: not moving</text>
    <text x="300" y="112" text-anchor="end" style="fill:var(--vx)">gentle slope: slow</text>
    <text x="176" y="44" style="fill:var(--accent)">steep slope: fast</text>
  </g>
  ${key(230, "var(--accent)", "steeper line · faster", "speed = gradient of the distance–time graph")}
</svg>`,
  "Distance–time axes with three straight lines: a flat line labelled not moving, a gentle slope labelled slow, and a steep slope labelled fast.",
  "Straight line = {{constant|constant speed}}. The steeper the line, the bigger the {{gradient}}, the faster.",
);

// ---------- Textbook p. 23 Figure 2: gradient = 20 m/s ----------
// t 0..80 s → x 50..310 (3.25 px/s); x 0..1600 m → y 200..40 (0.1 px/m)
export const figGradient = svg(
  `${head("f5", 318)}
  ${axes("f5", 200, "28")}
  <text x="44" y="22" fill="currentColor" stroke="none" font-size="12">distance x / m</text>
  <line x1="50" y1="200" x2="310" y2="40" stroke-width="2.4" style="stroke:var(--accent)"/>
  <g stroke-width="1" stroke-dasharray="3 3" opacity="0.5">
    <line x1="115" y1="160" x2="115" y2="200"/><line x1="50" y1="160" x2="115" y2="160"/>
    <line x1="277.5" y1="60" x2="277.5" y2="200"/><line x1="50" y1="60" x2="277.5" y2="60"/>
  </g>
  <line x1="117" y1="160" x2="275.5" y2="160" stroke-width="2" style="stroke:var(--vy)" marker-start="url(#f5-t)" marker-end="url(#f5-t)"/>
  <line x1="277.5" y1="158" x2="277.5" y2="62" stroke-width="2" style="stroke:var(--vx)" marker-start="url(#f5-d)" marker-end="url(#f5-d)"/>
  <g stroke="none" font-size="11.5" style="fill:var(--muted)">
    <text x="115" y="214" text-anchor="middle">20</text><text x="277.5" y="214" text-anchor="middle">70</text>
    <text x="44" y="164" text-anchor="end">400</text><text x="44" y="64" text-anchor="end">1400</text>
  </g>
  <g stroke="none" font-weight="600" font-size="12.5">
    <text x="196" y="178" text-anchor="middle" style="fill:var(--vy)">70 − 20 = 50 s</text>
    <text x="270" y="132" text-anchor="end" style="fill:var(--vx)">1400 − 400</text>
    <text x="270" y="148" text-anchor="end" style="fill:var(--vx)">= 1000 m</text>
    <text x="64" y="84" style="fill:var(--accent)">gradient = 20 m/s</text>
  </g>
  ${key(256, "var(--vx)", "1000 m · how far it went", "change in distance Δx")}
  ${key(286, "var(--vy)", "50 s · how long it took", "change in time Δt")}
</svg>`,
  "A straight line through the origin on distance–time axes. A big triangle under it runs from 20 s to 70 s across (50 s) and from 400 m to 1400 m up (1000 m). The gradient is labelled 20 m/s.",
  "Textbook p. 23, Figure 2. Rise ÷ run of a big triangle: 1000 m ÷ 50 s = 20 m/s.",
);

// ---------- Ours: tangent on x = 2t² at t = 4 s (interactive graph) ----------
// Checked in scripts/zakiya/check/claims_3_1_distance_and_speed.py by re-evaluating `expr`.
export const figTangent: Figure = {
  kind: "graph",
  alt: "A curve getting steeper, x = 2t², on distance–time axes from 0 to 6 s. A dashed tangent touches the curve at t = 4 s. A triangle on the tangent runs from 2 s to 6 s (4 s) and up from 0 to 64 m, so the gradient is 16 m/s. The touching point can be dragged along the curve.",
  caption: "Ours. The dashed {{tangent}} just touches the curve at 4 s. Its gradient, 64 m ÷ 4 s = 16 m/s, is the {{inst|instantaneous speed}} there. Drag the dot: the steeper the curve, the faster the car.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 6, step: 1 },
  y: { label: "distance", symbol: "x", unit: "m", min: 0, max: 80, step: 10 },
  series: [{ id: "car", label: "x = 2t²", expr: "2*t^2", colour: "accent" }],
  tangent: {
    series: "car",
    at: 4,
    draggable: true,
    showTriangle: true,
    readout: { quantity: "speed", unit: "m s⁻¹", decimals: 1 },
  },
};

// ---------- Ours: the lorry on a speed–time graph (area = distance) ----------
// 25 m/s for 120 s, then 16 m/s for 50 s. Area = 3000 + 800 = 3800 m (exact for straight lines).
export const figLorryArea: Figure = {
  kind: "graph",
  alt: "Speed–time graph of the lorry: a flat line at 25 m/s from 0 to 120 s, a drop to 16 m/s, then flat at 16 m/s until 170 s. The area under the line is shaded and equals 3800 m.",
  caption: "Ours. The same lorry as a speed–time graph. Each rectangle is speed × time, so the shaded area is the distance: 25 × 120 + 16 × 50 = 3800 m.",
  x: { label: "time", symbol: "t", unit: "s", min: 0, max: 180, step: 20 },
  y: { label: "speed", symbol: "v", unit: "m s⁻¹", min: 0, max: 30, step: 5 },
  series: [{ id: "lorry", points: [[0, 25], [120, 25], [120, 16], [170, 16]], colour: "accent" }],
  area: {
    series: "lorry",
    from: 0,
    to: 170,
    readout: { quantity: "distance travelled", unit: "m", decimals: 0 },
    squares: true,
  },
};

// ---------- Ours: drips every 0.5 s ----------
const dots = (y: number, xs: number[]) => xs.map((x) => `<circle cx="${x}" cy="${y}" r="4"/>`).join("");
export const figDrips = svg(
  `${head("f7", 250)}
  <g fill="currentColor" stroke="none">
    ${dots(40, [30, 90, 150, 210, 270])}
    ${dots(100, [30, 40, 60, 95, 150, 230])}
    ${dots(160, [30, 95, 150, 190, 215, 230])}
  </g>
  <line x1="32" y1="56" x2="88" y2="56" stroke-width="1.6" style="stroke:var(--vx)" marker-start="url(#f7-d)" marker-end="url(#f7-d)"/>
  <g stroke="none" font-size="12.5" font-weight="600">
    <text x="60" y="72" text-anchor="middle" style="fill:var(--vx)">5 m</text>
    <text x="320" y="44" text-anchor="end" style="fill:var(--accent)">equal gaps</text>
    <text x="320" y="104" text-anchor="end" style="fill:var(--accent)">gaps grow</text>
    <text x="320" y="164" text-anchor="end" style="fill:var(--accent)">gaps shrink</text>
    <text x="150" y="20" text-anchor="middle" font-weight="400" style="fill:var(--vy)">one drip every 0.5 s · car moving right →</text>
  </g>
  <g stroke="none" font-size="11.5" style="fill:var(--muted)">
    <text x="320" y="60" text-anchor="end">constant speed</text>
    <text x="320" y="120" text-anchor="end">speeding up</text>
    <text x="320" y="180" text-anchor="end">slowing down</text>
  </g>
  ${key(212, "var(--vx)", "5 m every 0.5 s · 10 m/s, steady", "equal distance in equal time = constant speed")}
</svg>`,
  "Three rows of drips. Top row: equal 5 m gaps, constant speed. Middle row: gaps growing, speeding up. Bottom row: gaps shrinking, slowing down. One drip every 0.5 s.",
  "Ours. Same time between drips, so the gap is the distance moved in 0.5 s. Top row: 5 m ÷ 0.5 s = 10 m/s every time.",
);

// ---------- Question figures ----------
export const figQDrips = svg(
  `${head("q1", 120)}
  <g stroke-width="1" stroke-dasharray="3 3">
    <line x1="10" y1="30" x2="10" y2="80"/><line x1="90" y1="30" x2="90" y2="80"/><line x1="170" y1="30" x2="170" y2="80"/><line x1="250" y1="30" x2="250" y2="80"/><line x1="330" y1="30" x2="330" y2="80"/>
  </g>
  <g fill="currentColor" stroke="none">
    ${dots(56, [14, 24, 36, 50, 66, 84])}
    ${dots(56, [102, 120, 138, 156])}
    ${dots(56, [174, 192, 208, 222, 234, 244])}
    ${dots(56, [254, 264, 276, 290, 306, 324])}
  </g>
  <g stroke="none" font-weight="600" text-anchor="middle" fill="currentColor">
    <text x="50" y="22">A</text><text x="130" y="22">B</text><text x="210" y="22">C</text><text x="290" y="22">D</text>
  </g>
  <text x="170" y="108" text-anchor="middle" stroke="none" font-size="12" style="fill:var(--muted)">start on the left · bike moving right →</text>
</svg>`,
  "A road strip split into four sections A to D. A: gaps between drops grow. B: equal gaps. C: gaps shrink. D: gaps grow.",
);

// x = 12t − t²; tangent at t = 3 s through (0, 9) and (6, 45). t 0..6 → 50..300; x 0..50 → 200..40
export const figQTangent = svg(
  `${head("q6", 250)}
  ${axes("q6", 200, "24")}
  <text x="44" y="18" fill="currentColor" stroke="none" font-size="12">distance x / m</text>
  <g stroke-width="0.6" opacity="0.35">
    <line x1="50" y1="168" x2="300" y2="168"/><line x1="50" y1="136" x2="300" y2="136"/><line x1="50" y1="104" x2="300" y2="104"/><line x1="50" y1="72" x2="300" y2="72"/><line x1="50" y1="40" x2="300" y2="40"/>
    <line x1="91.7" y1="40" x2="91.7" y2="200"/><line x1="133.3" y1="40" x2="133.3" y2="200"/><line x1="175" y1="40" x2="175" y2="200"/><line x1="216.7" y1="40" x2="216.7" y2="200"/><line x1="258.3" y1="40" x2="258.3" y2="200"/><line x1="300" y1="40" x2="300" y2="200"/>
  </g>
  <path d="M50.0,200.0 L60.4,190.6 L70.8,181.6 L81.2,173.0 L91.7,164.8 L102.1,157.0 L112.5,149.6 L122.9,142.6 L133.3,136.0 L143.8,129.8 L154.2,124.0 L164.6,118.6 L175.0,113.6 L185.4,109.0 L195.8,104.8 L206.2,101.0 L216.7,97.6 L227.1,94.6 L237.5,92.0 L247.9,89.8 L258.3,88.0 L268.8,86.6 L279.2,85.6 L289.6,85.0 L300.0,84.8" stroke-width="2.4" style="stroke:var(--accent)"/>
  <line x1="50" y1="171.2" x2="300" y2="56" stroke-width="1.6" stroke-dasharray="6 4"/>
  <circle cx="175" cy="113.6" r="4.5" fill="currentColor" stroke="none"/>
  <g stroke="none" font-size="11.5" style="fill:var(--muted)">
    <text x="50" y="214" text-anchor="middle">0</text><text x="133.3" y="214" text-anchor="middle">2</text><text x="216.7" y="214" text-anchor="middle">4</text><text x="300" y="214" text-anchor="middle">6</text>
    <text x="44" y="204" text-anchor="end">0</text><text x="44" y="140" text-anchor="end">20</text><text x="44" y="76" text-anchor="end">40</text>
  </g>
  <g stroke="none" font-size="12" font-weight="600">
    <text x="46" y="176" text-anchor="end" style="fill:var(--vx)">(0, 9)</text>
    <text x="296" y="50" text-anchor="end" style="fill:var(--vx)">(6.0, 45)</text>
    <text x="180" y="132" fill="currentColor">t = 3.0 s</text>
  </g>
</svg>`,
  "Distance–time graph of a cyclist from 0 to 6 s. The curve starts steep and flattens out, reaching 36 m at 6 s. A dashed tangent touches the curve at t = 3.0 s and passes through (0, 9 m) and (6.0 s, 45 m).",
);
