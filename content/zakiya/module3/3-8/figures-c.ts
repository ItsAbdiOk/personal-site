import type { Figure } from "@/lib/zakiya/types";

// Extra diagrams for sections-c. All numbers come from sections-c.ts and were
// rechecked in Python with g = 9.81 m s⁻² (uₓ 10.39, u_y 6.00, t 2.72 s, x 28.3 m,
// 0.612 s / 1.83 m to the top, 21.83 m fall in 2.110 s, 1/30 s = 0.033 s).
// Colours: currentColor, var(--accent), var(--vx) sideways, var(--vy) up/down, var(--muted).

const OPEN = (w: number, h: number) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">`;

/** Arrowhead markers in each theme colour, ids prefixed so several SVGs can share a page. */
const defs = (p: string) => {
  const m = (id: string, fill: string) =>
    `<marker id="${p}-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" stroke="none" style="fill:${fill}"/></marker>`;
  return `<defs>${m("cc", "currentColor")}${m("ac", "var(--accent)")}${m("vx", "var(--vx)")}${m("vy", "var(--vy)")}${m("mu", "var(--muted)")}</defs>`;
};

type TOpts = { anchor?: "start" | "middle" | "end"; fill?: string; bold?: boolean; size?: number };
const T = (x: number, y: number, s: string, o: TOpts = {}) =>
  `<text x="${x}" y="${y}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""} stroke="none" style="fill:${o.fill ?? "currentColor"}"${o.bold ? ` font-weight="600"` : ""}${o.size ? ` font-size="${o.size}"` : ""}>${s}</text>`;

/** Stacked label: bold value on top, then plain words, then exam term (muted). */
const L3 = (x: number, y: number, value: string, plain: string, exam: string, fill: string, anchor: TOpts["anchor"] = "start") =>
  T(x, y, value, { anchor, fill, bold: true }) +
  T(x, y + 14, plain, { anchor, size: 11 }) +
  T(x, y + 27, exam, { anchor, fill: "var(--muted)", size: 11 });

// ---------- Cliff geometry (shared) ----------
// 7 px per metre. Launch at (40, 70); sea 20 m lower at y = 210.
const PX = 7, X0 = 40, Y0 = 70;
const UX = 12 * Math.cos(Math.PI / 6), UY = 12 * Math.sin(Math.PI / 6), G = 9.81, TF = 2.7215;
const cliffPath = () => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (TF * i) / 40;
    const x = X0 + UX * t * PX, y = Y0 - (UY * t - 0.5 * G * t * t) * PX;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
};
const LAND_X = X0 + 28.28 * PX; // ≈ 238
const SEA_Y = Y0 + 20 * PX; // 210

const cliffBase = (p: string) =>
  defs(p) +
  // cliff block and sea
  `<path d="M0,${Y0} L${X0},${Y0} L${X0},${SEA_Y} L0,${SEA_Y}" stroke-width="1.5"/>` +
  `<path d="M${X0},${SEA_Y} Q60,${SEA_Y - 4} 80,${SEA_Y} T120,${SEA_Y} T160,${SEA_Y} T200,${SEA_Y} T240,${SEA_Y} T280,${SEA_Y} T320,${SEA_Y} T340,${SEA_Y}" stroke-width="1.2" style="stroke:var(--muted)"/>` +
  // launch level (s = 0)
  `<line x1="${X0}" y1="${Y0}" x2="335" y2="${Y0}" stroke-width="1" stroke-dasharray="4 4" style="stroke:var(--muted)"/>` +
  T(335, Y0 - 5, "launch level: s = 0", { anchor: "end", fill: "var(--muted)", size: 11 }) +
  // sign convention arrow
  `<line x1="16" y1="58" x2="16" y2="22" stroke-width="2" marker-end="url(#${p}-cc)"/>` +
  T(24, 27, "+ = up", { bold: true }) +
  // path, launch and landing dots
  `<path d="${cliffPath()}" stroke-width="2.2" style="stroke:var(--accent)"/>` +
  `<circle cx="${X0}" cy="${Y0}" r="4" fill="currentColor" stroke="none"/>` +
  `<circle cx="${LAND_X.toFixed(1)}" cy="${SEA_Y}" r="4.5" stroke="none" style="fill:var(--accent)"/>`;

/** Fig 1: splitting 12 m/s at 30° into 10.39 sideways and 6.00 up. */
export const svgCliffLaunch = `${OPEN(340, 220).replace('viewBox="0 0 340 220"', 'viewBox="0 55 340 165"')}
  ${defs("pmc-l")}
  <line x1="40" y1="150" x2="188" y2="150" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmc-l-vx)"/>
  <line x1="190" y1="150" x2="190" y2="65.6" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmc-l-vy)"/>
  <line x1="40" y1="150" x2="188" y2="64.6" stroke-width="2.5" marker-end="url(#pmc-l-cc)"/>
  <circle cx="40" cy="150" r="4.5" fill="currentColor" stroke="none"/>
  <path d="M80,150 A40,40 0 0 0 74.6,130" stroke-width="1.5"/>
  ${T(86, 145, "30°", { bold: true })}
  ${T(6, 72, "12 m/s at 30°", { bold: true })}
  ${T(6, 86, "how hard it's thrown", { size: 11 })}
  ${T(6, 99, "launch velocity u", { fill: "var(--muted)", size: 11 })}
  ${L3(115, 170, "10.39 m/s = 12 cos 30°", "sideways speed (never changes)", "horizontal velocity uₓ", "var(--vx)", "middle")}
  ${L3(198, 100, "6.00 m/s", "upward speed", "u<tspan baseline-shift=\"sub\" font-size=\"8\">y</tspan> = 12 sin 30°", "var(--vy)")}
  ${T(198, 144, "vertical velocity", { fill: "var(--muted)", size: 11 })}
</svg>`;

/** Fig 2/3: the cliff, before (unknowns as ?) and after (answers). */
const cliff = (answered: boolean) => {
  const p = answered ? "pmc-ca" : "pmc-cb";
  return `${OPEN(340, 282)}
  ${cliffBase(p)}
  <line x1="50" y1="${Y0 + 2}" x2="50" y2="${SEA_Y - 2}" stroke-width="2" style="stroke:var(--vy)" marker-start="url(#${p}-vy)" marker-end="url(#${p}-vy)"/>
  ${L3(58, 150, "s = −20 m", "ends 20 m below start", "vertical displacement s", "var(--vy)")}
  <line x1="${X0 + 2}" y1="226" x2="${(LAND_X - 2).toFixed(1)}" y2="226" stroke-width="2" style="stroke:var(--vx)" marker-start="url(#${p}-vx)" marker-end="url(#${p}-vx)"/>
  ${L3(140, 242, answered ? "x = 28.3 m" : "x = ?", "how far out it lands", "horizontal displacement x", "var(--vx)", "middle")}
  ${L3(335, 22, answered ? "t = 2.72 s" : "t = ?", "time in the air", "time of flight t", "var(--accent)", "end")}
  ${T(LAND_X + 8, SEA_Y - 8, "lands", { size: 11 })}
</svg>`;
};
export const svgCliffBefore = cliff(false);
export const svgCliffAfter = cliff(true);

/** Fig 4: the no-quadratic split: up to the top, then fall from rest. */
const PEAK_X = X0 + UX * (UY / G) * PX; // ≈ 84.5
const PEAK_Y = Y0 - 1.8349 * PX; // ≈ 57.2
export const svgCliffSplit = `${OPEN(340, 312)}
  ${cliffBase("pmc-s")}
  <circle cx="${PEAK_X.toFixed(1)}" cy="${PEAK_Y.toFixed(1)}" r="3.5" fill="currentColor" stroke="none"/>
  <line x1="${PEAK_X.toFixed(1)}" y1="${(PEAK_Y + 1).toFixed(1)}" x2="${PEAK_X.toFixed(1)}" y2="${Y0 - 1}" stroke-width="2" style="stroke:var(--vy)"/>
  <line x1="${(PEAK_X + 14).toFixed(1)}" y1="${(PEAK_Y + 2).toFixed(1)}" x2="${(PEAK_X + 14).toFixed(1)}" y2="${SEA_Y - 2}" stroke-width="2" style="stroke:var(--vy)" stroke-dasharray="5 3" marker-start="url(#pmc-s-vy)" marker-end="url(#pmc-s-vy)"/>
  ${T(PEAK_X - 8, PEAK_Y - 6, "① 1.83 m", { anchor: "end", fill: "var(--vy)", bold: true })}
  ${T(PEAK_X + 22, 140, "③ 21.83 m", { fill: "var(--vy)", bold: true })}
  ${T(112, 50, "② 0.612 s", { fill: "var(--accent)", bold: true })}
  ${T(232, 160, "④ 2.110 s", { fill: "var(--accent)", bold: true })}
  <g font-size="11">
    ${T(4, 236, "<tspan font-weight=\"600\" style=\"fill:var(--vy)\">① 1.83 m</tspan> · rises above your hand · max height (v<tspan baseline-shift=\"sub\" font-size=\"8\">y</tspan> = 0)")}
    ${T(4, 253, "<tspan font-weight=\"600\" style=\"fill:var(--accent)\">② 0.612 s</tspan> · going up · time to top = 6.00 ÷ 9.81")}
    ${T(4, 270, "<tspan font-weight=\"600\" style=\"fill:var(--vy)\">③ 21.83 m</tspan> · top to sea = 20 + 1.83 · drop from rest")}
    ${T(4, 287, "<tspan font-weight=\"600\" style=\"fill:var(--accent)\">④ 2.110 s</tspan> · coming down · time to fall 21.83 m")}
    ${T(4, 304, "<tspan font-weight=\"600\" style=\"fill:var(--accent)\">② + ④ = 2.72 s</tspan> · whole flight · time of flight t")}
  </g>
</svg>`;

/** Fig 5: forces with drag, on the way up and on the way down. */
const fbd = (cx: number, cy: number, up: boolean, p: string) => {
  const vdx = 34, vdy = up ? -26 : 26; // velocity direction
  return `<circle cx="${cx}" cy="${cy}" r="9" stroke-width="1.8"/>
  <line x1="${cx + 10}" y1="${cy + (up ? -8 : 8)}" x2="${cx + 10 + vdx}" y2="${cy + vdy}" stroke-width="1.8" stroke-dasharray="4 3" style="stroke:var(--muted)" marker-end="url(#${p}-mu)"/>
  ${T(cx + 10 + vdx + 4, cy + vdy + (up ? 0 : 10), "v", { fill: "var(--muted)", bold: true })}
  <line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy + 62}" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#${p}-vy)"/>
  ${T(cx + 6, cy + 58, "W", { fill: "var(--vy)", bold: true })}
  <line x1="${cx - 8}" y1="${cy + (up ? 6 : -6)}" x2="${cx - 8 - 31}" y2="${cy + (up ? 30 : -30)}" stroke-width="2.5" style="stroke:var(--accent)" marker-end="url(#${p}-ac)"/>
  ${T(cx - 42, cy + (up ? 44 : -30), "D", { anchor: "end", fill: "var(--accent)", bold: true })}`;
};
export const svgDragForces = `${OPEN(340, 245)}
  ${defs("pmc-d")}
  ${T(85, 18, "on the way up", { anchor: "middle", bold: true })}
  ${T(255, 18, "on the way down", { anchor: "middle", bold: true })}
  <line x1="170" y1="8" x2="170" y2="150" stroke-width="1" style="stroke:var(--muted)" stroke-dasharray="3 4"/>
  ${fbd(85, 62, true, "pmc-d")}
  ${fbd(255, 62, false, "pmc-d")}
  ${T(85, 146, "W and D both point down:", { anchor: "middle", size: 11 })}
  ${T(85, 160, "slows faster → lower top", { anchor: "middle", size: 11 })}
  ${T(255, 146, "D points up, against W:", { anchor: "middle", size: 11 })}
  ${T(255, 160, "acceleration less than 9.81 m s⁻²", { anchor: "middle", size: 11 })}
  <g font-size="11">
    ${T(4, 190, "<tspan font-weight=\"600\" style=\"fill:var(--vy)\">W</tspan> · gravity's pull · weight (always down)")}
    ${T(4, 205, "<tspan font-weight=\"600\" style=\"fill:var(--accent)\">D</tspan> · air pushing back · drag (opposite the velocity)")}
    ${T(4, 220, "<tspan font-weight=\"600\" style=\"fill:var(--muted)\">v</tspan> · where it's heading · velocity")}
    ${T(4, 235, "resultant force = W + D added as vectors (not along v)", { fill: "var(--muted)" })}
  </g>
</svg>`;

/** Fig 6: thrust = drag keeps vₓ constant. */
export const svgThrustDrag = `${OPEN(340, 150)}
  ${defs("pmc-t")}
  <path d="M120,70 L210,70 Q232,70 238,78 Q232,86 210,86 L120,86 Z" stroke-width="1.8"/>
  <path d="M150,70 L170,50 L182,50 L172,70 M128,70 L122,56 L132,56 L140,70" stroke-width="1.5"/>
  <line x1="242" y1="78" x2="318" y2="78" stroke-width="3" style="stroke:var(--vx)" marker-end="url(#pmc-t-vx)"/>
  <line x1="116" y1="78" x2="40" y2="78" stroke-width="3" style="stroke:var(--accent)" marker-end="url(#pmc-t-ac)"/>
  ${L3(282, 100, "thrust", "engines push forward", "thrust = drag", "var(--vx)", "middle")}
  ${L3(76, 100, "drag", "air pushes back", "opposite the velocity", "var(--accent)", "middle")}
  ${T(170, 22, "same size, opposite way", { anchor: "middle", bold: true })}
  ${T(170, 38, "→ horizontal net force = 0, so vₓ stays constant", { anchor: "middle", size: 11 })}
</svg>`;

/** Fig 7: video frames at 30 fps; 1/30 s between frames; frame 15 = 0.5 s. */
const frame = (x: number, n: string, bx: number, by: number, trail: [number, number][] = []) =>
  `<rect x="${x}" y="30" width="64" height="74" rx="3" stroke-width="1.5"/>
  <line x1="${x}" y1="46" x2="${x + 16}" y2="46" stroke-width="2.5"/>
  <line x1="${x + 4}" y1="98" x2="${x + 60}" y2="98" stroke-width="1" style="stroke:var(--muted)"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${x + 6 + i * 10}" y1="94" x2="${x + 6 + i * 10}" y2="98" stroke-width="1" style="stroke:var(--muted)"/>`).join("")}
  ${trail.map(([tx, ty]) => `<circle cx="${x + tx}" cy="${ty}" r="2.5" stroke="none" style="fill:var(--muted)"/>`).join("")}
  <circle cx="${x + bx}" cy="${by}" r="4" stroke="none" style="fill:var(--accent)"/>
  ${T(x + 32, 22, n, { anchor: "middle", bold: true, size: 11 })}`;
export const svgVideoFrames = `${OPEN(340, 224)}
  ${defs("pmc-v")}
  ${frame(6, "frame 0", 18, 42)}
  ${frame(80, "frame 1", 23, 43)}
  ${frame(154, "frame 2", 28, 46)}
  ${T(241, 70, "…", { anchor: "middle", bold: true })}
  ${frame(268, "frame 15", 56, 86, [[18, 42], [23, 43], [28, 46], [33, 51], [38, 58], [43, 66], [48, 75]])}
  <line x1="38" y1="114" x2="112" y2="114" stroke-width="1.8" style="stroke:var(--vy)" marker-start="url(#pmc-v-vy)" marker-end="url(#pmc-v-vy)"/>
  ${L3(6, 132, "1/30 s ≈ 0.033 s", "gap between frames", "time interval = 1 ÷ frame rate", "var(--vy)")}
  <line x1="38" y1="108" x2="38" y2="118" stroke-width="1" style="stroke:var(--vy)"/>
  <line x1="112" y1="108" x2="112" y2="118" stroke-width="1" style="stroke:var(--vy)"/>
  ${L3(335, 132, "15 ÷ 30 = 0.5 s", "time since it left the desk", "t = frame no. ÷ frame rate", "var(--accent)", "end")}
  ${L3(6, 190, "30 frames per second", "pictures taken each second", "frame rate", "currentColor")}
  ${T(335, 190, "grey dots = earlier frames", { anchor: "end", fill: "var(--muted)", size: 11 })}
  ${T(335, 204, "ruler behind gives x and y", { anchor: "end", fill: "var(--muted)", size: 11 })}
</svg>`;

/** Fig 8: y against t² is a straight line through the origin, gradient g ÷ 2. */
export const svgYvsT2 = `${OPEN(340, 220)}
  ${defs("pmc-g")}
  <line x1="50" y1="170" x2="50" y2="20" stroke-width="1.5" marker-end="url(#pmc-g-cc)"/>
  <line x1="50" y1="170" x2="250" y2="170" stroke-width="1.5" marker-end="url(#pmc-g-cc)"/>
  <line x1="50" y1="170" x2="230" y2="40" stroke-width="2.5" style="stroke:var(--accent)"/>
  <circle cx="50" cy="170" r="3.5" fill="currentColor" stroke="none"/>
  <path d="M120,119.4 L190,119.4 L190,68.9" stroke-width="1.5" stroke-dasharray="4 3" style="stroke:var(--muted)"/>
  ${T(155, 133, "Δt²", { anchor: "middle", fill: "var(--muted)", size: 11 })}
  ${T(196, 98, "Δy", { fill: "var(--muted)", size: 11 })}
  ${T(42, 26, "y", { anchor: "end", bold: true })}
  ${T(24, 40, "distance", { anchor: "middle", size: 10 })}
  ${T(24, 52, "fallen", { anchor: "middle", size: 10 })}
  ${T(250, 186, "t²", { anchor: "middle", bold: true })}
  ${T(150, 186, "time squared", { anchor: "middle", size: 11 })}
  ${T(50, 200, "through the origin (0, 0)", { size: 11, fill: "var(--muted)" })}
  ${L3(236, 60, "g ÷ 2", "how steep the line is", "gradient = Δy ÷ Δt²", "var(--accent)")}
  ${T(236, 112, "so g = 2 × gradient", { bold: true, size: 11 })}
</svg>`;

/** Fig 9: weightless passenger: weight acts, contact force is zero, same acceleration g. */
export const svgWeightless = `${OPEN(340, 280)}
  ${defs("pmc-w")}
  <rect x="20" y="20" width="170" height="150" rx="16" stroke-width="1.8"/>
  ${T(105, 38, "aircraft cabin", { anchor: "middle", fill: "var(--muted)", size: 11 })}
  <line x1="30" y1="150" x2="180" y2="150" stroke-width="2"/>
  <circle cx="105" cy="64" r="8" stroke-width="1.8"/>
  <path d="M105,72 L105,102 M105,80 L90,92 M105,80 L120,92 M105,102 L95,120 M105,102 L115,120" stroke-width="1.8"/>
  <line x1="122" y1="80" x2="122" y2="136" stroke-width="2.8" style="stroke:var(--vy)" marker-end="url(#pmc-w-vy)"/>
  ${T(128, 118, "W", { fill: "var(--vy)", bold: true })}
  <line x1="78" y1="148" x2="78" y2="124" stroke-width="1.5" stroke-dasharray="3 3" style="stroke:var(--muted)"/>
  <path d="M70,128 L86,144 M86,128 L70,144" stroke-width="1.8" style="stroke:var(--accent)"/>
  ${T(62, 140, "0", { anchor: "end", fill: "var(--accent)", bold: true })}
  <line x1="210" y1="60" x2="210" y2="130" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmc-w-vy)"/>
  ${T(218, 80, "both fall with", { size: 11 })}
  ${T(218, 94, "a = g = 9.81 m s⁻²", { bold: true, fill: "var(--vy)", size: 11 })}
  ${T(218, 108, "(aircraft and", { size: 11 })}
  ${T(218, 122, "passenger)", { size: 11 })}
  <g font-size="11">
    ${T(4, 196, "<tspan font-weight=\"600\" style=\"fill:var(--vy)\">W</tspan> · gravity still pulls · weight W = mg (not zero!)")}
    ${T(4, 214, "<tspan font-weight=\"600\" style=\"fill:var(--accent)\">0</tspan> · seat/floor doesn't push · contact force = 0")}
    ${T(4, 232, "<tspan font-weight=\"600\" style=\"fill:var(--vy)\">9.81 m s⁻²</tspan> · speed up downwards together")}
    ${T(18, 246, "· same acceleration g", { fill: "var(--muted)" })}
    ${T(4, 268, "only force on passenger = W, so they feel weightless", { fill: "var(--muted)" })}
  </g>
</svg>`;

// ---------- Figure objects for sections-c ----------

export const figCliffLaunch: Figure = {
  kind: "svg",
  svg: svgCliffLaunch,
  alt: "Launch velocity of 12 metres per second at 30 degrees above horizontal, drawn as an arrow, split into a horizontal arrow of 10.39 metres per second (sideways speed, 12 cos 30°, horizontal velocity u x) and a vertical arrow of 6.00 metres per second (upward speed, 12 sin 30°, vertical velocity u y).",
  caption: "Step 1: each direction only gets its own part of the 12 m s⁻¹.",
};

export const figCliffBefore: Figure = {
  kind: "svg",
  svg: svgCliffBefore,
  alt: "Cliff 20 metres high with the stone's curved path rising slightly then falling to the sea. An up arrow marks up as positive. A dashed line at the launch level is labelled s = 0. A vertical arrow from launch level down to the sea is labelled s = minus 20 m, ends 20 m below start, vertical displacement s. The distance along the sea to the landing point is labelled x = ?, and the time in the air t = ?.",
  caption: "Before solving: up is +, so the sea is at s = −20 m. t and x are the unknowns.",
};

export const figCliffAfter: Figure = {
  kind: "svg",
  svg: svgCliffAfter,
  alt: "Same cliff diagram with the answers filled in: time in the air t = 2.72 s and horizontal distance from the foot of the cliff x = 28.3 m, with s = minus 20 m still marked.",
  caption: "After solving: t = 2.72 s, and in that time the sideways 10.39 m s⁻¹ carries it 28.3 m.",
};

export const figCliffSplit: Figure = {
  kind: "svg",
  svg: svgCliffSplit,
  alt: "Cliff diagram split at the highest point. Numbered labels: 1, it rises 1.83 m above the launch point; 2, 0.612 s to reach the top; 3, it then falls 21.83 m (20 plus 1.83) from the top to the sea; 4, that fall takes 2.110 s. 0.612 plus 2.110 gives the 2.72 s time of flight.",
  caption: "The no-quadratic route: up to the top, then a drop from rest.",
};

export const figDragForces: Figure = {
  kind: "svg",
  svg: svgDragForces,
  alt: "Two force diagrams for a ball with air resistance. On the way up the velocity points up and right; weight W points down and drag D points down and back, opposite the velocity, so both slow it and the maximum height is lower. On the way down the velocity points down and right; weight points down and drag points up and back, so the downward acceleration is less than 9.81 metres per second squared.",
  caption: "Drag always points opposite the velocity, so it flips between the way up and the way down.",
};

export const figThrustDrag: Figure = {
  kind: "svg",
  svg: svgThrustDrag,
  alt: "An aircraft with a forward thrust arrow and an equal backward drag arrow. Same size, opposite way, so the horizontal net force is zero and the horizontal velocity stays constant.",
};

export const figVideoFrames: Figure = {
  kind: "svg",
  svg: svgVideoFrames,
  alt: "A strip of video frames numbered 0, 1, 2 and then 15, each showing a desk edge, a ruler and the marble. Between frame 0 and frame 1 a bracket reads 1/30 s, about 0.033 s, the gap between frames, equal to 1 divided by the frame rate. Frame 15 shows grey dots for earlier positions and is labelled 15 divided by 30 equals 0.5 s, the time since it left the desk. The frame rate is 30 frames per second.",
  caption: "At 30 frames per second, each frame is 1/30 s after the last, so frame number ÷ 30 gives t.",
};

export const figYvsT2: Figure = {
  kind: "svg",
  svg: svgYvsT2,
  alt: "Graph of distance fallen y against time squared t squared: a straight line through the origin. A gradient triangle shows change in y over change in t squared; the gradient equals g divided by 2, so g is 2 times the gradient.",
};

export const figWeightless: Figure = {
  kind: "svg",
  svg: svgWeightless,
  alt: "A passenger floating above the floor inside an aircraft cabin. The only force arrow on the passenger is weight W pointing down. The contact force from the floor is crossed out and labelled 0. Beside the cabin, an arrow shows that aircraft and passenger both accelerate downward at g = 9.81 metres per second squared.",
  caption: "Gravity hasn't switched off: W still acts. The floor just has nothing to push against.",
};
