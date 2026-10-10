import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.7. Every number is drawn where it lives, with a key underneath:
// value · plain words (bold), exam term (muted). --vy = up/down things, --accent = answers.
// All numbers recomputed in Python with g = 9.81 m s⁻².

const head = (id: string, w: number, h: number) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

// ---------- A dropped ball, one dot per second ----------
const svgDropEachSecond = `${head("ff-d", 340, 320)}
  <line x1="70" y1="20" x2="70" y2="230" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
  <g fill="currentColor" stroke="none">
    <circle cx="70" cy="24" r="6"/><circle cx="70" cy="40" r="6"/><circle cx="70" cy="88" r="6"/><circle cx="70" cy="168" r="6"/>
  </g>
  <g stroke="none" font-size="12" fill="currentColor">
    <text x="12" y="28">0 s</text><text x="12" y="44">1 s</text><text x="12" y="92">2 s</text><text x="12" y="172">3 s</text>
  </g>
  <g stroke-width="2.2" style="stroke:var(--vy)">
    <line x1="88" y1="40" x2="88" y2="58" marker-end="url(#ff-d-y)"/>
    <line x1="88" y1="88" x2="88" y2="124" marker-end="url(#ff-d-y)"/>
    <line x1="88" y1="168" x2="88" y2="222" marker-end="url(#ff-d-y)"/>
  </g>
  <g stroke="none" font-weight="600" style="fill:var(--vy)">
    <text x="98" y="30">0 m/s</text>
    <text x="98" y="54">9.81 m/s</text>
    <text x="98" y="110">19.6 m/s</text>
    <text x="98" y="200">29.4 m/s</text>
  </g>
  <g stroke-width="1.4" style="stroke:var(--accent)">
    <line x1="230" y1="24" x2="230" y2="40" marker-end="url(#ff-d-c)"/>
    <line x1="270" y1="24" x2="270" y2="88" marker-end="url(#ff-d-c)"/>
    <line x1="310" y1="24" x2="310" y2="168" marker-end="url(#ff-d-c)"/>
  </g>
  <g stroke="none" font-weight="600" style="fill:var(--accent)" font-size="12">
    <text x="226" y="56" text-anchor="end">4.91 m</text>
    <text x="266" y="62" text-anchor="end">19.6 m</text>
    <text x="306" y="130" text-anchor="end">44.1 m</text>
  </g>
  ${key(262, "var(--vy)", "+9.81 m/s every second · speeds up", "acceleration of free fall g = 9.81 m s⁻²")}
  ${key(298, "var(--accent)", "4.91, 19.6, 44.1 m · how far it has dropped", "displacement s = ½gt²")}
</svg>`;

export const figDropEachSecond: Figure = {
  kind: "svg",
  svg: svgDropEachSecond,
  alt: "A ball dropped from rest shown at 0, 1, 2 and 3 seconds. Its speed is 0, 9.81, 19.6 and 29.4 m/s. It has fallen 4.91 m, 19.6 m and 44.1 m. The dots are drawn to scale, so the gaps between them grow each second (1 : 4 : 9 for the distances fallen).",
  caption: "Speed goes up by the same 9.81 m/s each second, so the gaps between the dots keep growing. Distance grows with time squared: 4× as far at 2 s, 9× at 3 s (drawn to scale).",
};

// ---------- Marble dropped for 2.3 s (Textbook p. 39 practice Q2) ----------
const svgMarble = `${head("ff-m", 340, 290)}
  <line x1="20" y1="210" x2="320" y2="210" stroke-width="1.5"/>
  <path d="M60,210 L60,30 L130,30 L130,210" stroke-width="1.5" style="fill:var(--muted)" fill-opacity="0.18"/>
  <circle cx="150" cy="36" r="6" fill="currentColor" stroke="none"/>
  <circle cx="150" cy="203" r="6" fill="currentColor" stroke="none" opacity="0.5"/>
  <line x1="150" y1="46" x2="150" y2="192" stroke-width="1.2" stroke-dasharray="5 4"/>
  <line x1="180" y1="32" x2="180" y2="208" stroke-width="1.8" style="stroke:var(--accent)" marker-start="url(#ff-m-c)" marker-end="url(#ff-m-c)"/>
  <g stroke="none" font-weight="600">
    <text x="188" y="110" style="fill:var(--accent)">H = ? → 26 m</text>
    <text x="160" y="34" style="fill:var(--vy)">u = 0</text>
    <text x="188" y="150" fill="currentColor">t = 2.3 s</text>
    <text x="188" y="200" style="fill:var(--vy)">a = 9.81 m/s²</text>
  </g>
  ${key(236, "var(--accent)", "26 m · height it fell from", "displacement s (here H)")}
  ${key(268, "var(--vy)", "0 at the top · let go, not thrown", "initial velocity u = 0")}
</svg>`;

export const figMarble: Figure = {
  kind: "svg",
  svg: svgMarble,
  alt: "A marble is dropped from rest from the top of a block. It takes 2.3 s to land. The height H is unknown and works out as 26 m.",
  caption: "Before: H = ?. After: H = ½ × 9.81 × 2.3² = 25.947 ≈ **26 m** (2 s.f., like 2.3 s).",
};

// ---------- Ball thrown up at 12 m/s (ours) ----------
const svgThrowUp = `${head("ff-u", 340, 300)}
  <line x1="20" y1="220" x2="320" y2="220" stroke-width="1.5"/>
  <circle cx="90" cy="210" r="6" fill="currentColor" stroke="none"/>
  <circle cx="90" cy="40" r="6" style="fill:var(--accent)" stroke="none"/>
  <line x1="70" y1="200" x2="70" y2="130" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#ff-u-y)"/>
  <line x1="150" y1="42" x2="150" y2="208" stroke-width="1.8" style="stroke:var(--accent)" marker-start="url(#ff-u-c)" marker-end="url(#ff-u-c)"/>
  <g stroke="none" font-weight="600">
    <text x="14" y="165" style="fill:var(--vy)">12 m/s</text>
    <text x="102" y="36" style="fill:var(--accent)">top: v = 0</text>
    <text x="158" y="120" style="fill:var(--accent)">h = ? → 7.34 m</text>
    <text x="158" y="140" fill="currentColor">t = ? → 1.22 s</text>
    <text x="158" y="190" style="fill:var(--vy)">a = −9.81 m/s²</text>
  </g>
  ${key(248, "var(--vy)", "12 m/s up · speed you throw it", "initial velocity u = +12 m s⁻¹")}
  ${key(280, "var(--accent)", "7.34 m, 1.22 s · how high, how long", "maximum height, time to top (v = 0)")}
</svg>`;

export const figThrowUp: Figure = {
  kind: "svg",
  svg: svgThrowUp,
  alt: "A ball is thrown straight up at 12 m/s. At the top its velocity is zero. The maximum height is 7.34 m, reached after 1.22 s. Acceleration is −9.81 m/s² with up positive.",
  caption: "Up is positive, so a = −9.81 m/s². At the top v = 0: that gives **7.34 m** and **1.22 s**.",
};

// ---------- Electromagnet and trapdoor (Textbook p. 37–38) ----------
const svgTrapdoor = `${head("ff-t", 340, 330)}
  <rect x="62" y="14" width="36" height="22" rx="3" stroke-width="1.6"/>
  <path d="M66,20 L94,24 M66,26 L94,30" stroke-width="1.2"/>
  <circle cx="80" cy="46" r="10" fill="currentColor" stroke="none"/>
  <line x1="40" y1="56" x2="120" y2="56" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="40" y1="216" x2="80" y2="216" stroke-width="2.4"/>
  <line x1="80" y1="216" x2="118" y2="226" stroke-width="2.4"/>
  <circle cx="80" cy="216" r="3" fill="currentColor" stroke="none"/>
  <line x1="50" y1="58" x2="50" y2="214" stroke-width="1.8" style="stroke:var(--accent)" marker-start="url(#ff-t-c)" marker-end="url(#ff-t-c)"/>
  <rect x="220" y="110" width="96" height="52" rx="6" stroke-width="1.6"/>
  <text x="268" y="132" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">timer</text>
  <text x="268" y="152" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vy)">0.421 s</text>
  <path d="M98,25 L180,25 L180,124 L220,124" stroke-width="1.2"/>
  <path d="M118,226 L180,226 L180,148 L220,148" stroke-width="1.2"/>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="188" y="20">magnet off → timer</text>
    <text x="188" y="34">starts, ball drops</text>
    <text x="96" y="246">trapdoor: hit → timer stops</text>
  </g>
  <text x="6" y="140" stroke="none" font-weight="600" style="fill:var(--accent)">85.6 cm</text>
  <text x="6" y="156" stroke="none" font-size="11.5" style="fill:var(--muted)">= 0.856 m</text>
  ${key(276, "var(--accent)", "0.856 m · bottom of ball to trapdoor", "displacement s (height of fall h)")}
  ${key(310, "var(--vy)", "0.421 s · how long the drop took", "time t → g = 2s ÷ t² = 9.66 m s⁻²")}
</svg>`;

export const figTrapdoor: Figure = {
  kind: "svg",
  svg: svgTrapdoor,
  alt: "An electromagnet holds a steel ball above a hinged trapdoor. Both are wired to a timer. The height of fall, 85.6 cm, is measured from the bottom of the ball to the trapdoor. The timer reads 0.421 s.",
  caption: "Switching the magnet off starts the timer; the ball knocking the trapdoor open stops it. Measure the height from the **bottom** of the ball.",
};

// ---------- Two light gates ----------
const svgLightGates = `${head("ff-l", 340, 280)}
  <circle cx="90" cy="26" r="9" fill="currentColor" stroke="none"/>
  <text x="106" y="30" fill="currentColor" stroke="none" font-size="12">dropped from rest</text>
  <line x1="90" y1="40" x2="90" y2="196" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
  <g stroke-width="1.6">
    <rect x="40" y="70" width="14" height="20" rx="2"/><rect x="126" y="70" width="14" height="20" rx="2"/>
    <rect x="40" y="170" width="14" height="20" rx="2"/><rect x="126" y="170" width="14" height="20" rx="2"/>
  </g>
  <g stroke-width="1.6" stroke-dasharray="3 3" style="stroke:var(--vy)">
    <line x1="54" y1="80" x2="126" y2="80"/><line x1="54" y1="180" x2="126" y2="180"/>
  </g>
  <line x1="28" y1="82" x2="28" y2="178" stroke-width="1.8" style="stroke:var(--accent)" marker-start="url(#ff-l-c)" marker-end="url(#ff-l-c)"/>
  <text x="8" y="134" stroke="none" font-weight="600" style="fill:var(--accent)">s</text>
  <rect x="208" y="105" width="124" height="44" rx="6" stroke-width="1.6"/>
  <text x="270" y="132" text-anchor="middle" fill="currentColor" stroke="none" font-size="12">timer / data logger</text>
  <path d="M140,80 L200,80 L200,118 L208,118" stroke-width="1.2"/>
  <path d="M140,180 L200,180 L200,136 L208,136" stroke-width="1.2"/>
  <g stroke="none" fill="currentColor" font-size="12">
    <text x="148" y="72">beam 1 broken: start</text>
    <text x="148" y="198">beam 2 broken: stop</text>
  </g>
  ${key(230, "var(--vy)", "light beams · ball cuts them", "light gates connected to a timer")}
  ${key(262, "var(--accent)", "gap between beams · measured with a metre rule", "distance s between the gates")}
</svg>`;

export const figLightGates: Figure = {
  kind: "svg",
  svg: svgLightGates,
  alt: "A ball falls through two horizontal light beams, one above the other, a distance s apart. Both gates are wired to a timer or data logger: the first beam starts it, the second stops it.",
  caption: "No magnet delay. But the ball is already moving at the first gate, so **u ≠ 0** unless you release it right at the top beam.",
};

// ---------- s against t² graph from Table 1 (Textbook p. 39) ----------
// Declarative graph (components/zakiya/Graph.tsx). Data points = Table 1 (t² = t × t, s as measured).
// The best-fit line is s = ½ g t² = 4.905 t² through the origin; drawn as two points (0, 0) to (0.27, 1.3246)
// using the book's gradient 4.906. Axis runs to 0.27 s² so the tangent triangle (at 0.09, ±range/3) spans
// exactly 0 to 0.180 s², matching the worked example.
export const figGraph: Figure = {
  kind: "graph",
  alt: "Graph of distance fallen s in metres against time squared t² in seconds squared, for the ten points of Table 1. Nine points lie on a straight line through the origin; the point at t² = 0.0697 s², s = 0.368 m sits above the line and is labelled as an anomaly. A large triangle under the line has a base of 0.180 s² and a height of 0.883 m, giving a gradient of 4.906 m/s² and g = 9.81 m/s².",
  caption: "Textbook p. 39 Table 1 plotted. Straight line through the origin; one point off the line is ignored. A **large** triangle: 0.883 ÷ 0.180 = 4.906, so g = 2 × 4.906 = **9.81 m s⁻²**.",
  x: { label: "time squared", symbol: "t^2", unit: "s²", min: 0, max: 0.27, step: 0.1 },
  y: { label: "distance fallen", symbol: "s", unit: "m", min: 0, max: 1.4, step: 0.2 },
  series: [{ id: "fit", label: "line of best fit", points: [[0, 0], [0.27, 1.3246]], colour: "accent" }],
  tangent: {
    series: "fit",
    at: 0.09,
    draggable: false,
    showTriangle: true,
    readout: { quantity: "gradient", unit: "m s⁻²", decimals: 3 },
  },
  points: [
    { x: 0.0174, y: 0.085 }, { x: 0.0272, y: 0.134 }, { x: 0.0392, y: 0.192 }, { x: 0.0534, y: 0.262 },
    { x: 0.0697, y: 0.368, label: "anomaly: 0.368 m" },
    { x: 0.0882, y: 0.433 }, { x: 0.1089, y: 0.534 }, { x: 0.1318, y: 0.646 }, { x: 0.1568, y: 0.769 }, { x: 0.1840, y: 0.903 },
  ],
};
