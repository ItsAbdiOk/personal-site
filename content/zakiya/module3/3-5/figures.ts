import type { Figure } from "@/lib/zakiya/types";

// Diagrams for 3.5. Every number is drawn where it lives, with a key underneath:
// value · plain words (bold), exam term (muted).
// Colours: --vx (orange) = velocities, --vy (purple) = acceleration, --accent (blue) = displacement,
// currentColor = time. All numbers recomputed in Python with g = 9.81 m s⁻².

const head = (id: string, h: number, w = 340) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="${id}-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${id}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
    <marker id="${id}-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
    <marker id="${id}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>`;

const key = (y: number, colour: string, top: string, term: string) => `
  <rect x="8" y="${y - 10}" width="10" height="10" rx="2" stroke="none" style="fill:${colour}"/>
  <text x="26" y="${y}" fill="currentColor" stroke="none" font-size="12.5" font-weight="600">${top}</text>
  <text x="26" y="${y + 15}" stroke="none" font-size="11.5" style="fill:var(--muted)">${term}</text>`;

const car = (x: number, y: number) => `
  <g stroke-width="1.6">
    <path d="M${x},${y} l0,-12 l10,0 l8,-10 l22,0 l8,10 l8,0 l0,12 z" style="fill:var(--muted)" fill-opacity="0.18"/>
    <circle cx="${x + 12}" cy="${y + 2}" r="5" fill="currentColor" stroke="none"/>
    <circle cx="${x + 44}" cy="${y + 2}" r="5" fill="currentColor" stroke="none"/>
  </g>`;

// ---------- Car from rest (Textbook p. 33): 0 → 12 m/s in 9.0 s ----------
const svgCar = `${head("em-car", 345)}
  <line x1="0" y1="110" x2="340" y2="110" stroke-width="1.5"/>
  ${car(14, 103)}
  ${car(262, 103)}
  <text x="40" y="70" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vx)">u = 0</text>
  <line x1="262" y1="62" x2="318" y2="62" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#em-car-v)"/>
  <text x="290" y="52" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vx)">v = 12 m/s</text>
  <line x1="40" y1="130" x2="290" y2="130" stroke-width="1.8" style="stroke:var(--accent)" marker-end="url(#em-car-s)"/>
  <text x="165" y="150" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--accent)">s = ? → 54 m</text>
  <line x1="110" y1="30" x2="190" y2="30" stroke-width="2.2" style="stroke:var(--vy)" marker-end="url(#em-car-a)"/>
  <text x="150" y="20" text-anchor="middle" stroke="none" font-weight="600" style="fill:var(--vy)">a = ? → 1.33 m/s²</text>
  <text x="150" y="82" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">t = 9.0 s</text>
  ${key(190, "var(--vx)", "0 · starts from rest", "initial velocity u")}
  ${key(220, "var(--vx)", "12 m/s · speed at the end", "final velocity v")}
  ${key(250, "currentColor", "9.0 s · how long it took", "time t")}
  ${key(280, "var(--vy)", "1.33 m/s² · gains 1.33 m/s every second", "acceleration a")}
  ${key(310, "var(--accent)", "54 m · how far along the road", "displacement s")}
</svg>`;

export const figCar: Figure = {
  kind: "svg",
  svg: svgCar,
  alt: "A car on a straight road starts from rest, u equals 0, and 9.0 seconds later is moving at v equals 12 metres per second. The acceleration is a question mark, answer 1.33 metres per second squared. The distance along the road is a question mark, answer 54 metres. A key gives each number's plain meaning and suvat letter.",
  caption: "Textbook car: three numbers known ({{u}}, {{v}}, {{t}}), two to find ({{a}}, {{s}}).",
};

// ---------- Derivation graph (Textbook p. 31–32), drawn with the particle numbers (p. 33) ----------
// u = 4.0, v = 12, t = 2.0 s, a = 4.0, s = 8 + 8 = 16 m. Scale: x 0..2 s → 50..290; y 0..12 → 210..30 (15 px per m/s)
const svgDerive = `${head("em-dv", 420)}
  <line x1="50" y1="210" x2="310" y2="210" stroke-width="1.5" marker-end="url(#em-dv-c)"/>
  <line x1="50" y1="210" x2="50" y2="18" stroke-width="1.5" marker-end="url(#em-dv-c)"/>
  <text x="310" y="246" fill="currentColor" stroke="none" font-size="12" text-anchor="end">time / s</text>
  <text x="56" y="20" fill="currentColor" stroke="none" font-size="12">velocity / m s⁻¹</text>
  <rect x="50" y="150" width="240" height="60" stroke="none" style="fill:var(--accent)" fill-opacity="0.22"/>
  <path d="M50,150 L290,30 L290,150 z" stroke="none" style="fill:var(--accent)" fill-opacity="0.42"/>
  <line x1="50" y1="150" x2="290" y2="30" stroke-width="2.6" style="stroke:var(--vx)"/>
  <line x1="290" y1="30" x2="290" y2="210" stroke-width="1" stroke-dasharray="4 4"/>
  <g stroke="none" font-weight="600">
    <text x="44" y="154" text-anchor="end" style="fill:var(--vx)">4.0</text>
    <text x="44" y="34" text-anchor="end" style="fill:var(--vx)">12</text>
    <text x="44" y="214" text-anchor="end" fill="currentColor">0</text>
    <text x="290" y="226" text-anchor="middle" fill="currentColor">2.0</text>
    <text x="170" y="186" text-anchor="middle" style="fill:var(--accent)">ut = 4.0 × 2.0 = 8 m</text>
    <text x="232" y="132" text-anchor="middle" style="fill:var(--accent)">½(v − u)t = 8 m</text>
    <text x="112" y="70" text-anchor="middle" style="fill:var(--vy)">slope = 4.0 m/s²</text>
  </g>
  <line x1="112" y1="75" x2="130" y2="106" stroke-width="1" style="stroke:var(--vy)"/>
  ${key(262, "var(--vx)", "4.0 m/s · speed at the start", "initial velocity u (where the line starts)")}
  ${key(292, "var(--vx)", "12 m/s · speed at the end", "final velocity v (where the line ends)")}
  ${key(322, "currentColor", "2.0 s · how long it took", "time t (width of the shape)")}
  ${key(352, "var(--vy)", "4.0 m/s² · gains 4 m/s every second", "acceleration a = gradient of the line")}
  ${key(382, "var(--accent)", "8 m + 8 m = 16 m · distance covered", "displacement s = area under the line")}
</svg>`;

export const figDerive: Figure = {
  kind: "svg",
  svg: svgDerive,
  alt: "Velocity-time graph. A straight line rises from 4.0 metres per second at time 0 to 12 metres per second at 2.0 seconds. The area under it is split into a rectangle of height 4.0 and width 2.0, area 8 metres, labelled u t, and a triangle on top of height 8 and width 2.0, area 8 metres, labelled one half of v minus u times t. The slope is 4.0 metres per second squared.",
  caption: "Our numbers on the textbook particle (p. 33): 4.0 → 12 m s⁻¹ over 16 m; we worked out that it takes 2.0 s. The {{gradient}} is {{a}}; the {{area}} is {{s}}: rectangle {{ut}} + triangle {{half-v-u-t}}.",
};

// ---------- Which equation? Each equation leaves out one letter ----------
const rows: [string, string][] = [
  ["v = u + at", "s"],
  ["s = ut + ½at²", "v"],
  ["s = ½(u + v)t", "a"],
  ["v² = u² + 2as", "t"],
];
const letters = ["s", "u", "v", "a", "t"];
const svgChooser = `${head("em-ch", 230)}
  ${letters.map((l, i) => `<text x="${170 + i * 34}" y="24" text-anchor="middle" fill="currentColor" stroke="none" font-weight="700" font-style="italic">${l}</text>`).join("")}
  ${rows
    .map(([eq, miss], r) => {
      const y = 56 + r * 40;
      return `<text x="10" y="${y + 5}" fill="currentColor" stroke="none" font-weight="600">${eq}</text>
  ${letters
    .map((l, i) => {
      const x = 170 + i * 34;
      return l === miss
        ? `<rect x="${x - 14}" y="${y - 13}" width="28" height="26" rx="6" stroke="none" style="fill:var(--vy)" fill-opacity="0.2"/><text x="${x}" y="${y + 5}" text-anchor="middle" stroke="none" font-weight="700" style="fill:var(--vy)">✗</text>`
        : `<text x="${x}" y="${y + 5}" text-anchor="middle" fill="currentColor" stroke="none">✓</text>`;
    })
    .join("")}`;
    })
    .join("")}
  <text x="10" y="218" stroke="none" font-size="12" style="fill:var(--muted)">✗ = the one letter that equation does not contain</text>
</svg>`;

export const figChooser: Figure = {
  kind: "svg",
  svg: svgChooser,
  alt: "A grid. Rows are the four equations, columns are the letters s, u, v, a, t. Each row has a tick under four letters and a cross under one: v equals u plus a t has no s; s equals u t plus a half a t squared has no v; s equals a half of u plus v times t has no a; v squared equals u squared plus 2 a s has no t.",
  caption: "Each equation has **four of the five** letters. Find the letter you neither know nor want, and use the equation without it.",
};

// ---------- Apple falling (Textbook p. 33–34): 1.50 m, t = 0.553 s ----------
const svgApple = `${head("em-ap", 330)}
  <line x1="0" y1="200" x2="340" y2="200" stroke-width="1.5"/>
  <line x1="80" y1="200" x2="80" y2="60" stroke-width="5" stroke-linecap="round" style="stroke:var(--muted)"/>
  <ellipse cx="80" cy="45" rx="62" ry="32" stroke-width="1.5" style="fill:var(--muted)" fill-opacity="0.18"/>
  <circle cx="130" cy="62" r="7" stroke-width="1.8"/>
  <circle cx="130" cy="193" r="7" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="150" y1="64" x2="150" y2="196" stroke-width="1.8" style="stroke:var(--accent)" marker-start="url(#em-ap-s)" marker-end="url(#em-ap-s)"/>
  <line x1="240" y1="70" x2="240" y2="120" stroke-width="2.4" style="stroke:var(--vy)" marker-end="url(#em-ap-a)"/>
  <g stroke="none" font-weight="600">
    <text x="158" y="135" style="fill:var(--accent)">1.50 m</text>
    <text x="250" y="96" style="fill:var(--vy)">9.81 m/s²</text>
    <text x="140" y="56" style="fill:var(--vx)">u = 0</text>
    <text x="250" y="160" fill="currentColor">t = ? → 0.553 s</text>
  </g>
  ${key(236, "var(--vx)", "0 · falls from rest", "initial velocity u")}
  ${key(266, "var(--accent)", "1.50 m · height it falls", "displacement s (down positive)")}
  ${key(296, "var(--vy)", "9.81 m/s² · gravity's speed-up", "acceleration of free fall g")}
</svg>`;

export const figApple: Figure = {
  kind: "svg",
  svg: svgApple,
  alt: "An apple hanging 1.50 metres above the ground falls from rest. Its initial velocity is 0, its acceleration is 9.81 metres per second squared downwards, and the time to reach the ground is a question mark, answer 0.553 seconds. A key lists each number's plain meaning and exam term.",
  caption: "Textbook apple. Everything happens downwards, so take **down as positive** and every value is positive. Time: 0.553 s.",
};

// ---------- Paper clip flicked up (Textbook p. 34): 6.0 m/s, max height 1.83 m ----------
const svgClip = `${head("em-pc", 340)}
  <line x1="0" y1="215" x2="340" y2="215" stroke-width="1.5"/>
  <rect x="94" y="196" width="12" height="18" rx="5" stroke-width="1.8"/>
  <rect x="94" y="30" width="12" height="18" rx="5" stroke-width="1.2" stroke-dasharray="3 3"/>
  <line x1="100" y1="190" x2="100" y2="130" stroke-width="2.6" style="stroke:var(--vx)" marker-end="url(#em-pc-v)"/>
  <line x1="70" y1="210" x2="70" y2="42" stroke-width="1.8" style="stroke:var(--accent)" marker-end="url(#em-pc-s)"/>
  <line x1="250" y1="80" x2="250" y2="130" stroke-width="2.4" style="stroke:var(--vy)" marker-end="url(#em-pc-a)"/>
  <line x1="310" y1="200" x2="310" y2="150" stroke-width="1.4" marker-end="url(#em-pc-c)"/>
  <g stroke="none" font-weight="600">
    <text x="108" y="164" style="fill:var(--vx)">u = +6.0 m/s</text>
    <text x="114" y="44" style="fill:var(--vx)">v = 0 at the top</text>
    <text x="62" y="110" text-anchor="end" style="fill:var(--accent)">s = ?</text>
    <text x="62" y="128" text-anchor="end" style="fill:var(--accent)">→ 1.83 m</text>
    <text x="258" y="106" style="fill:var(--vy)">a = −9.81</text>
    <text x="304" y="144" text-anchor="end" fill="currentColor" font-size="12">up = +</text>
  </g>
  ${key(250, "var(--vx)", "+6.0 m/s · flicked upwards", "initial velocity u")}
  ${key(280, "var(--vx)", "0 · stops for an instant at the top", "final velocity v at maximum height")}
  ${key(310, "var(--vy)", "−9.81 m/s² · gravity pulls down, against the motion", "acceleration a (negative: up is +)")}
</svg>`;

export const figClip: Figure = {
  kind: "svg",
  svg: svgClip,
  alt: "A paper clip flicked straight up at plus 6.0 metres per second, with up taken as positive. Gravity's acceleration arrow points down, labelled minus 9.81 metres per second squared. At the top the clip's velocity is 0. The height reached is a question mark, answer 1.83 metres.",
  caption: "Textbook paper clip. Up is **+**, so gravity's {{a}} is **−9.81 m s⁻²** and {{v}} = 0 at the top. Height: 1.83 m (1.8 m to 2 s.f.).",
};
