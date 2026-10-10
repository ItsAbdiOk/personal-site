import type { Figure } from "@/lib/zakiya/types";

// Extra diagrams for sections-a. Every number is drawn where it lives,
// with a key underneath: value · plain words, then the exam term.
// Colours: --vx for sideways things, --vy for up/down things.

const head = (id: string, h: number, y0 = 0) => `<svg viewBox="0 ${y0} 340 ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${id}-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

// One key entry: coloured swatch, "value · plain words" (bold), exam term underneath (muted).
const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

// ---------- What is a projectile: g = 9.81 every second ----------
export const svgGravityEachSecond = `${head("pa-g", 312)}
  <text x="10" y="18" fill="currentColor" stroke="none" font-size="12">dots 1 second apart</text>
  <path d="M40,40 Q160,40 280,166" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.6"/>
  <g stroke-width="2.2" style="stroke:var(--vx)">
    <line x1="40" y1="40" x2="80" y2="40" marker-end="url(#pa-g-x)"/>
    <line x1="120" y1="54" x2="160" y2="54" marker-end="url(#pa-g-x)"/>
    <line x1="200" y1="96" x2="240" y2="96" marker-end="url(#pa-g-x)"/>
    <line x1="280" y1="166" x2="320" y2="166" marker-end="url(#pa-g-x)"/>
  </g>
  <g stroke-width="2.2" style="stroke:var(--vy)">
    <line x1="120" y1="54" x2="120" y2="74" marker-end="url(#pa-g-y)"/>
    <line x1="200" y1="96" x2="200" y2="136" marker-end="url(#pa-g-y)"/>
    <line x1="280" y1="166" x2="280" y2="226" marker-end="url(#pa-g-y)"/>
  </g>
  <g fill="currentColor" stroke="none">
    <circle cx="40" cy="40" r="5"/><circle cx="120" cy="54" r="5"/><circle cx="200" cy="96" r="5"/><circle cx="280" cy="166" r="5"/>
  </g>
  <g stroke="none" style="fill:var(--vy)" font-weight="600">
    <text x="112" y="72" text-anchor="end">+9.81</text>
    <text x="192" y="124" text-anchor="end">+9.81</text>
    <text x="270" y="206" text-anchor="end">+9.81</text>
  </g>
  ${key(258, "var(--vx)", "same arrow every second · steady sideways", "constant horizontal velocity vₓ")}
  ${key(290, "var(--vy)", "+9.81 m/s each second · speeds up down", "acceleration g = 9.81 m s⁻²")}
</svg>`;

// ---------- Cannonball (Textbook p. 40–41): 304 m/s off a 44.1 m cliff ----------
export const svgCannonball = `${head("pa-cb", 340, 30)}
  <line x1="0" y1="190" x2="340" y2="190" stroke-width="1.5"/>
  <path d="M60,190 L60,60 L120,60 L120,190" stroke-width="1.5" style="fill:var(--muted)" fill-opacity="0.18"/>
  <path d="M120,60 Q220,60 320,190" stroke-width="2.2" stroke-dasharray="6 4" style="stroke:var(--accent)"/>
  <line x1="120" y1="60" x2="185" y2="60" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pa-cb-x)"/>
  <circle cx="120" cy="60" r="5.5" fill="currentColor" stroke="none"/>
  <circle cx="320" cy="190" r="5.5" fill="currentColor" stroke="none"/>
  <line x1="46" y1="62" x2="46" y2="188" stroke-width="1.8" style="stroke:var(--vy)" marker-start="url(#pa-cb-y)" marker-end="url(#pa-cb-y)"/>
  <line x1="122" y1="206" x2="318" y2="206" stroke-width="1.8" style="stroke:var(--vx)" marker-start="url(#pa-cb-x)" marker-end="url(#pa-cb-x)"/>
  <g stroke="none" font-weight="600">
    <text x="122" y="48" style="fill:var(--vx)">304 m/s</text>
    <text x="90" y="130" text-anchor="middle" style="fill:var(--vy)">44.1 m</text>
    <text x="216" y="76" fill="currentColor">t = ? → 3.00 s</text>
    <text x="220" y="225" text-anchor="middle" style="fill:var(--vx)">? → 912 m</text>
  </g>
  ${key(256, "var(--vx)", "304 m/s · sideways speed", "horizontal velocity vₓ (never changes)")}
  ${key(287, "var(--vy)", "44.1 m · height of the cliff", "vertical displacement s")}
  ${key(318, "currentColor", "3.00 s · time in the air", "time of flight t (shared by both)")}
  ${key(349, "var(--vx)", "912 m · how far away it lands", "range (horizontal displacement x)")}
</svg>`;

// ---------- Kick (Textbook p. 42–43): 15 m/s at 30°, triple-labelled copy of svgComponents ----------
export const svgComponentsKey = `${head("pa-k", 295, 50)}
  <line x1="40" y1="180" x2="238" y2="180" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pa-k-x)"/>
  <line x1="240" y1="180" x2="240" y2="67" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pa-k-y)"/>
  <line x1="40" y1="180" x2="238" y2="65.6" stroke-width="2.5" marker-end="url(#pa-k-c)"/>
  <circle cx="40" cy="180" r="5" fill="currentColor" stroke="none"/>
  <path d="M80,180 A40,40 0 0 0 74.64,160" stroke-width="1.5"/>
  <g stroke="none" font-weight="600">
    <text x="86" y="174" style="fill:var(--accent)">30°</text>
    <text x="128" y="98" text-anchor="end" fill="currentColor">15 m/s</text>
    <text x="140" y="200" text-anchor="middle" style="fill:var(--vx)">13.0 m/s</text>
    <text x="248" y="128" style="fill:var(--vy)">7.5 m/s</text>
  </g>
  ${key(230, "currentColor", "15 m/s · how hard it's kicked", "launch speed u (the hypotenuse)")}
  ${key(261, "var(--accent)", "30° · angle above the ground", "launch angle θ")}
  ${key(292, "var(--vx)", "13.0 m/s · sideways part", "horizontal component uₓ = u cos θ")}
  ${key(323, "var(--vy)", "7.5 m/s · upward part", "vertical component u<tspan dy='3' font-size='0.75em'>y</tspan><tspan dy='-3'> = u sin θ</tspan>")}
</svg>`;

// ---------- Toolkit: the cannonball in two columns ----------
const cell = (x: number, y: number, val: string, words: string) => `
  <text x="${x}" y="${y}" fill="currentColor" stroke="none" font-weight="600">${val}</text>
  <text x="${x}" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${words}</text>`;

export const svgToolkitColumns = `${head("pa-tk", 300)}
  <rect x="4" y="4" width="160" height="214" rx="8" stroke-width="1.5" style="stroke:var(--vx)"/>
  <rect x="176" y="4" width="160" height="214" rx="8" stroke-width="1.5" style="stroke:var(--vy)"/>
  <text x="84" y="26" text-anchor="middle" stroke="none" font-weight="700" style="fill:var(--vx)">H · sideways</text>
  <text x="256" y="26" text-anchor="middle" stroke="none" font-weight="700" style="fill:var(--vy)">V · up/down</text>
  <line x1="12" y1="36" x2="156" y2="36" stroke-width="1" style="stroke:var(--vx)" opacity="0.5"/>
  <line x1="184" y1="36" x2="328" y2="36" stroke-width="1" style="stroke:var(--vy)" opacity="0.5"/>
  ${cell(14, 60, "uₓ = 304 m/s", "sideways speed")}
  ${cell(14, 108, "a = 0", "nothing pushes sideways")}
  ${cell(14, 156, "x = ? → 912 m", "how far it lands")}
  <text x="14" y="206" stroke="none" font-size="11.5" style="fill:var(--vx)">② x = 304 × 3.00</text>
  ${cell(186, 60, "u<tspan dy='3' font-size='0.75em'>y</tspan><tspan dy='-3'> = 0</tspan>", "fired flat: no fall speed")}
  ${cell(186, 108, "a = −9.81 m s⁻²", "gravity, downwards")}
  ${cell(186, 156, "s = −44.1 m", "cliff height (down = −)")}
  <text x="186" y="206" stroke="none" font-size="11.5" style="fill:var(--vy)">① s = ½at² gives t</text>
  <rect x="4" y="232" width="332" height="62" rx="8" stroke-width="1.5"/>
  <text x="170" y="256" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700">t = ? → 3.00 s</text>
  <text x="170" y="275" text-anchor="middle" stroke="none" font-size="11.5" style="fill:var(--muted)">time in the air · time of flight</text>
  <text x="170" y="289" text-anchor="middle" stroke="none" font-size="11.5" style="fill:var(--muted)">the same in both columns</text>
</svg>`;

// ---------- Toolkit: sign convention, landing 20 m below ----------
export const svgSigns = `${head("pa-sg", 262, 0)}
  <line x1="40" y1="60" x2="200" y2="60" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
  <line x1="40" y1="160" x2="200" y2="160" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
  <path d="M60,60 Q130,10 190,160" stroke-width="2" stroke-dasharray="6 4" style="stroke:var(--accent)"/>
  <circle cx="60" cy="60" r="5" fill="currentColor" stroke="none"/>
  <circle cx="190" cy="160" r="5" fill="currentColor" stroke="none"/>
  <line x1="22" y1="120" x2="22" y2="70" stroke-width="2" marker-end="url(#pa-sg-c)"/>
  <text x="14" y="138" fill="currentColor" stroke="none" font-weight="600">+ up</text>
  <line x1="230" y1="62" x2="230" y2="157" stroke-width="2" style="stroke:var(--vy)" marker-end="url(#pa-sg-y)"/>
  <text x="238" y="106" stroke="none" font-weight="600" style="fill:var(--vy)">s = −20 m</text>
  <line x1="326" y1="70" x2="326" y2="110" stroke-width="2" style="stroke:var(--vy)" marker-end="url(#pa-sg-y)"/>
  <text x="326" y="128" text-anchor="middle" stroke="none" font-size="12" style="fill:var(--vy)">a</text>
  <text x="52" y="52" text-anchor="end" fill="currentColor" stroke="none" font-size="12">start</text>
  <text x="182" y="178" text-anchor="end" fill="currentColor" stroke="none" font-size="12">lands</text>
  ${key(212, "var(--vy)", "−20 m · ends 20 m below the start", "vertical displacement s (negative)")}
  ${key(243, "var(--vy)", "−9.81 m s⁻² · gravity pulls down", "acceleration a = −g")}
</svg>`;

export const figGravityEachSecond: Figure = {
  kind: "svg",
  svg: svgGravityEachSecond,
  alt: "A ball moving sideways and falling, drawn at four moments one second apart. Its sideways arrow is the same length every time: constant horizontal velocity. Its downward arrow grows by 9.81 metres per second each second: acceleration g equals 9.81 metres per second squared.",
  caption: "Sideways arrow: never changes. Downward arrow: **+9.81 m s⁻¹ every second**.",
};

export const figCannonball: Figure = {
  kind: "svg",
  svg: svgCannonball,
  alt: "A cannonball fired horizontally at 304 metres per second from the top of a 44.1 metre cliff. The time in the air is shown as a question mark, answer 3.00 seconds. The distance along the ground to where it lands is shown as a question mark, answer 912 metres. A key lists each number with its plain meaning and exam term.",
  caption: "Textbook cannonball. The fall (44.1 m) gives the time, the time gives the distance.",
};

export const figComponentsKey: Figure = {
  kind: "svg",
  svg: svgComponentsKey,
  alt: "A ball kicked at 15 metres per second at 30 degrees above the ground, drawn as a slanted arrow. It splits into a horizontal arrow of 13.0 metres per second and a vertical arrow of 7.5 metres per second, forming a right-angled triangle. A key gives each number's plain meaning and exam term: launch speed u, launch angle theta, horizontal component u cos theta, vertical component u sin theta.",
  caption: "The real launch speed (15 m s⁻¹) is the slanted side, the {{hypotenuse}}. Note 13.0 + 7.5 ≠ 15: the parts add up as a triangle, not as plain numbers.",
};

export const figToolkitColumns: Figure = {
  kind: "svg",
  svg: svgToolkitColumns,
  alt: "Two-column table for the textbook cannonball. Horizontal column: u x equals 304 metres per second, a equals 0, x is unknown, answer 912 metres. Vertical column: u y equals 0, a equals minus 9.81 metres per second squared, s equals minus 44.1 metres. Step one: use the vertical column to find t. Shared box underneath: t equals 3.00 seconds, the same in both columns. Step two: x equals 304 times 3.00.",
  caption: "The cannonball in two columns. Find t in the column with enough numbers (V), then carry it across (H).",
};

export const figSigns: Figure = {
  kind: "svg",
  svg: svgSigns,
  alt: "Sign convention with up as positive. A ball starts at one level and lands 20 metres lower, so its vertical displacement is minus 20 metres. Gravity points down, so the acceleration is minus 9.81 metres per second squared.",
  caption: "Up is +, so anything pointing down gets a minus sign.",
};
