import type { Figure } from "@/lib/zakiya/types";

// Extra diagrams for sections-b. Every number comes from the worked examples in sections-b
// (checked in Python with g = 9.81 m s⁻²). Labels use three layers: value → plain words → exam term.
// Colours: var(--vx) horizontal, var(--vy) vertical, var(--accent) time / path, var(--muted) word layers.

const head = (w: number, h: number) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">`;

// Arrowhead markers in each colour (ids prefixed per diagram so pages with many SVGs don't clash).
const markers = (p: string) => `<defs>
    <marker id="${p}-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
    <marker id="${p}-x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vx)" stroke="none"/></marker>
    <marker id="${p}-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vy)" stroke="none"/></marker>
  </defs>`;

const M = `style="fill:var(--muted)" font-size="11.5"`; // word layers
const M14 = `style="fill:var(--muted)" font-size="13.5"`;
const X = `style="fill:var(--vx)" font-weight="700"`;
const Y = `style="fill:var(--vy)" font-weight="700"`;
const A = `style="fill:var(--accent)" font-weight="700"`;

// ---------- Cannonball (Textbook p. 40–41): the two linked steps ----------
// Path: x = 60 + 270τ, y = 60 + 140τ² (τ = fraction of the 3.00 s). Not to scale (912 m vs 44.1 m).
export const svgCannonSteps = `${head(360, 262)}
  ${markers("pmb-cn")}
  <rect x="10" y="60" width="50" height="140" fill="currentColor" opacity="0.12" stroke="none"/>
  <line x1="10" y1="60" x2="60" y2="60" stroke-width="1.5"/><line x1="60" y1="60" x2="60" y2="200" stroke-width="1.5"/>
  <path d="M0,200 Q15,195 30,200 T60,200 T90,200 T120,200 T150,200 T180,200 T210,200 T240,200 T270,200 T300,200 T330,200 T360,200" stroke-width="1.2" opacity="0.6"/>
  <path d="M60,60 Q195,60 330,200" stroke-width="2" stroke-dasharray="5 4" style="stroke:var(--accent)"/>
  <circle cx="60" cy="60" r="5" fill="currentColor" stroke="none"/>
  <circle cx="330" cy="200" r="4" style="fill:var(--accent)" stroke="none"/>
  <line x1="62" y1="60" x2="122" y2="60" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-cn-x)"/>
  <line x1="80" y1="62" x2="80" y2="198" stroke-width="1.5" style="stroke:var(--vy)" marker-start="url(#pmb-cn-y)" marker-end="url(#pmb-cn-y)"/>
  <line x1="60" y1="218" x2="330" y2="218" stroke-width="1.5" style="stroke:var(--vx)" marker-start="url(#pmb-cn-x)" marker-end="url(#pmb-cn-x)"/>
  <g stroke="none">
    <text x="62" y="16" ${X}>304 m/s</text>
    <text x="62" y="30" ${M}>sideways speed</text>
    <text x="62" y="44" ${M}>horizontal velocity vₓ</text>
    <text x="350" y="16" text-anchor="end" ${Y}>uᵧ = 0</text>
    <text x="350" y="30" text-anchor="end" ${M}>no downward speed at the start</text>
    <text x="350" y="44" text-anchor="end" ${M}>initial vertical velocity</text>
    <text x="88" y="118" ${Y}>44.1 m</text>
    <text x="88" y="132" ${M}>height of the cliff</text>
    <text x="88" y="146" ${M}>vertical displacement s</text>
    <text x="350" y="82" text-anchor="end" ${A}>t = ? → 3.00 s</text>
    <text x="350" y="96" text-anchor="end" ${M}>time falling (step a)</text>
    <text x="350" y="110" text-anchor="end" ${M}>time of flight</text>
    <text x="195" y="238" text-anchor="middle" ${X}>? → 304 × 3.00 = 912 m (step b)</text>
    <text x="195" y="253" text-anchor="middle" ${M}>distance out to sea · horizontal distance</text>
  </g>
</svg>`;

export const figCannonSteps: Figure = {
  kind: "svg",
  svg: svgCannonSteps,
  alt: "Cannonball fired sideways from a cliff. Sideways arrow at the top labelled 304 m/s, sideways speed, horizontal velocity v x. Note: u y = 0, no downward speed at the start. Vertical dimension down the cliff labelled 44.1 m, height of the cliff, vertical displacement s. On the curved path: t = ? becomes 3.00 s, time falling, time of flight. Along the sea: ? becomes 304 times 3.00 = 912 m, horizontal distance. Not to scale.",
  caption: "The two steps on one picture. **Step (a)** uses only the up/down numbers (44.1 m, u~y~ = 0, g) to get the time. **Step (b)** carries that time across to the sideways speed. Not to scale: 912 m is about 20 times the cliff height.",
};

// ---------- Arrow from a castle (Textbook p. 42): what we know and what we want ----------
// Path: quadratic curve from the wall top to the landing point. Landing arrow drawn at 26.0° below horizontal.
export const svgArrowSetup = `${head(360, 220)}
  ${markers("pmb-ar")}
  <path d="M10,170 V48 h8 v8 h8 v-8 h8 v8 h8 v-8 h8 v8 h10 V170" fill="currentColor" fill-opacity="0.12" stroke-width="1.5"/>
  <line x1="0" y1="170" x2="360" y2="170" stroke-width="1.5"/>
  <path d="M60,56 Q140,56 300,170" stroke-width="2" stroke-dasharray="5 4" style="stroke:var(--accent)"/>
  <circle cx="60" cy="56" r="4" fill="currentColor" stroke="none"/>
  <line x1="62" y1="56" x2="122" y2="56" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-ar-x)"/>
  <line x1="78" y1="58" x2="78" y2="168" stroke-width="1.5" style="stroke:var(--vy)" marker-start="url(#pmb-ar-y)" marker-end="url(#pmb-ar-y)"/>
  <line x1="300" y1="170" x2="345" y2="170" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-ar-x)"/>
  <line x1="300" y1="170" x2="300" y2="205" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmb-ar-y)"/>
  <line x1="300" y1="170" x2="345" y2="192" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#pmb-ar-c)"/>
  <g stroke="none">
    <text x="62" y="14" ${X}>49.2 m/s</text>
    <text x="62" y="28" ${M}>sideways speed (never changes)</text>
    <text x="62" y="42" ${M}>horizontal velocity vₓ</text>
    <text x="86" y="112" ${Y}>29.4 m</text>
    <text x="86" y="126" ${M}>height of the wall</text>
    <text x="86" y="140" ${M}>vertical displacement s</text>
    <text x="352" y="70" text-anchor="end" font-weight="700" fill="currentColor">v = ? → 54.7 m/s at 26.0°</text>
    <text x="352" y="84" text-anchor="end" ${M}>speed + direction at landing</text>
    <text x="352" y="98" text-anchor="end" ${M}>impact velocity (dashed)</text>
    <text x="292" y="190" text-anchor="end" ${Y}>vᵧ = ? → 24.0 m/s</text>
    <text x="292" y="204" text-anchor="end" ${M}>downward speed at landing</text>
  </g>
</svg>`;

export const figArrowSetup: Figure = {
  kind: "svg",
  svg: svgArrowSetup,
  alt: "Arrow fired sideways from a castle wall. Sideways arrow at the top labelled 49.2 m/s, sideways speed, horizontal velocity v x. Height of the wall 29.4 m, vertical displacement s. At the landing point: a sideways arrow, a downward arrow labelled v y = ? becomes 24.0 m/s, downward speed at landing, and a dashed slanted arrow labelled v = ? becomes 54.7 m/s at 26.0 degrees, impact velocity.",
  caption: "Before you start: what's known (49.2 m s⁻¹, 29.4 m) and the two unknowns, with the answers you'll reach.",
};

// ---------- Arrow impact triangle, to scale: 4 px per m s⁻¹ ----------
// 49.2 → 196.8 px, 24.0 → 96 px, so the hypotenuse is 219.0 px (= 54.7 × 4) at 26.0°.
export const svgImpactB = `${head(360, 205)}
  ${markers("pmb-im")}
  <line x1="20" y1="60" x2="216.8" y2="60" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-im-x)"/>
  <line x1="216.8" y1="60" x2="216.8" y2="156" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmb-im-y)"/>
  <line x1="20" y1="60" x2="216.8" y2="156" stroke-width="3" marker-end="url(#pmb-im-c)"/>
  <path d="M65,60 A45,45 0 0 1 60.45,79.73" stroke-width="1.5" style="stroke:var(--accent)"/>
  <g stroke="none">
    <text x="118" y="22" text-anchor="middle" ${X}>49.2 m/s</text>
    <text x="118" y="36" text-anchor="middle" ${M}>sideways speed</text>
    <text x="118" y="50" text-anchor="middle" ${M}>horizontal velocity vₓ</text>
    <text x="224" y="96" ${Y}>24.0 m/s</text>
    <text x="224" y="110" ${M}>downward speed</text>
    <text x="224" y="124" ${M}>at landing</text>
    <text x="224" y="138" ${M}>vertical velocity vᵧ</text>
    <text x="150" y="138" text-anchor="end" font-weight="700" fill="currentColor">54.7 m/s</text>
    <text x="150" y="152" text-anchor="end" ${M}>actual speed</text>
    <text x="150" y="166" text-anchor="end" ${M}>resultant velocity v</text>
    <text x="72" y="77" ${A}>26.0°</text>
    <text x="10" y="186" ${M}><tspan style="fill:var(--accent)" font-weight="700">26.0° (θ)</tspan> · angle below the ground · direction</text>
    <text x="10" y="201" ${M}>Drawn to scale: the sides really are 49.2 : 24.0.</text>
  </g>
</svg>`;

export const figImpactB: Figure = {
  kind: "svg",
  svg: svgImpactB,
  alt: "Velocity triangle for the arrow at impact, drawn to scale. Horizontal side 49.2 m/s, sideways speed, horizontal velocity v x. Vertical side 24.0 m/s, downward speed at landing, vertical velocity v y. Long side 54.7 m/s, actual speed, resultant velocity v. Angle 26.0 degrees between the long side and the horizontal: angle below the ground, the direction.",
  caption: "Answer triangle for the arrow. Pythagoras gives the long side (54.7 m s⁻¹); tan⁻¹(24.0 ÷ 49.2) gives the angle (26.0°).",
};

// ---------- Kicked ball velocity arrows, TO SCALE: 4 px per m s⁻¹ ----------
// vₓ = 13.0 → 52 px every time. vᵧ: 7.5 → 30 px, 3.75 → 15 px, 0 at the top.
// Points at t = 0, ¼T, ½T, ¾T, T on the path M50,210 Q190,-110 330,210 (path height stretched).
export const svgVectorsB = `${head(390, 306)}
  ${markers("pmb-vc")}
  <line x1="10" y1="210" x2="390" y2="210" stroke-width="1" opacity="0.5"/>
  <path d="M50,210 Q190,-110 330,210" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.7"/>
  <g stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-vc-x)">
    <line x1="50" y1="210" x2="102" y2="210"/>
    <line x1="120" y1="90" x2="172" y2="90"/>
    <line x1="190" y1="50" x2="242" y2="50"/>
    <line x1="260" y1="90" x2="312" y2="90"/>
    <line x1="330" y1="210" x2="382" y2="210"/>
  </g>
  <g stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmb-vc-y)">
    <line x1="50" y1="210" x2="50" y2="180"/>
    <line x1="120" y1="90" x2="120" y2="75"/>
    <line x1="260" y1="90" x2="260" y2="105"/>
    <line x1="330" y1="210" x2="330" y2="240"/>
  </g>
  <circle cx="190" cy="50" r="4" fill="currentColor" stroke="none"/>
  <g stroke="none">
    <text x="190" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">top: vᵧ = 0, still 13.0 sideways</text>
    <text x="190" y="36" text-anchor="middle" ${M14}>velocity is horizontal, not zero</text>
    <text x="44" y="194" text-anchor="end" ${Y}>7.5 up</text>
    <text x="114" y="84" text-anchor="end" ${Y}>3.75 up</text>
    <text x="254" y="106" text-anchor="end" ${Y}>3.75 down</text>
    <text x="324" y="238" text-anchor="end" ${Y}>7.5 down</text>
    <text x="10" y="264" ${M14}><tspan ${X} font-size="14">13.0 m/s</tspan> · sideways speed · horizontal velocity vₓ</text>
    <text x="10" y="281" ${M14}><tspan ${Y} font-size="14">7.5 → 0 → 7.5</tspan> · up/down speed · vertical velocity vᵧ</text>
    <text x="10" y="299" ${M14}>Arrow lengths drawn to scale (speeds in m/s).</text>
  </g>
</svg>`;

export const figVectorsB: Figure = {
  kind: "svg",
  svg: svgVectorsB,
  alt: "Dashed curved path of the kicked ball (15 m/s at 30 degrees), with velocity arrows drawn to scale at five equally spaced times. Every horizontal arrow is the same length: 13.0 m/s, sideways speed, horizontal velocity v x. Vertical arrows: 7.5 up at launch, 3.75 up a quarter of the way through the flight, none at the top, 3.75 down three quarters through, 7.5 down at landing; these are the vertical velocity v y. At the top the label says v y = 0 but still 13.0 sideways, so the velocity is horizontal, not zero.",
  caption: "The kicked ball from the next section (15 m s⁻¹ at 30°), arrows **to scale**: the 13.0 sideways arrow really is longer than the 7.5 up arrow. Sideways stays the same; up/down shrinks to zero at the top, then grows downwards.",
};

// ---------- Resolving the kick, to scale: 12 px per m s⁻¹ ----------
// 15 → 180 px at 30°: horizontal 155.9 px (13.0), vertical 90 px (7.5).
export const svgResolveB = `${head(340, 200).replace("0 0 340 200", "0 42 340 152")}
  ${markers("pmb-rs")}
  <line x1="30" y1="150" x2="185.9" y2="150" stroke-width="2.5" style="stroke:var(--vx)" marker-end="url(#pmb-rs-x)"/>
  <line x1="185.9" y1="150" x2="185.9" y2="60" stroke-width="2.5" style="stroke:var(--vy)" marker-end="url(#pmb-rs-y)"/>
  <line x1="30" y1="150" x2="185.9" y2="60" stroke-width="3" marker-end="url(#pmb-rs-c)"/>
  <circle cx="30" cy="150" r="4" fill="currentColor" stroke="none"/>
  <path d="M70,150 A40,40 0 0 0 64.64,130" stroke-width="1.5" style="stroke:var(--accent)"/>
  <g stroke="none">
    <text x="110" y="62" text-anchor="end" font-weight="700" fill="currentColor">15 m/s</text>
    <text x="110" y="76" text-anchor="end" ${M}>kick speed</text>
    <text x="110" y="90" text-anchor="end" ${M}>initial velocity u</text>
    <text x="76" y="145" ${A}>30° <tspan ${M} font-weight="400">launch angle θ</tspan></text>
    <text x="10" y="172" ${X}>13.0 m/s = 15 cos 30°</text>
    <text x="10" y="187" ${M}>sideways part · horizontal component uₓ</text>
    <text x="194" y="90" ${Y}>7.5 m/s</text>
    <text x="194" y="104" ${M}>= 15 sin 30°</text>
    <text x="194" y="118" ${M}>upward part</text>
    <text x="194" y="132" ${M}>vertical component uᵧ</text>
  </g>
</svg>`;

export const figResolveB: Figure = {
  kind: "svg",
  svg: svgResolveB,
  alt: "Right-angled triangle drawn to scale. Long side 15 m/s, kick speed, initial velocity u, at a 30 degree launch angle theta. Horizontal side 13.0 m/s = 15 cos 30 degrees, sideways part, horizontal component u x. Vertical side 7.5 m/s = 15 sin 30 degrees, upward part, vertical component u y.",
  caption: "Resolving the kick (to scale). cos goes with the side **next to** the angle (sideways), sin with the side **opposite** it (upward).",
};

// ---------- Kicked ball answers, path TO SCALE: 15.1 px per m ----------
// Range 19.9 m → 300 px; max height 2.87 m → 43.3 px; launch tangent = 30°.
export const svgKickAnswers = `${head(360, 240).replace("0 0 360 240", "0 44 360 196")}
  ${markers("pmb-kk")}
  <line x1="10" y1="150" x2="350" y2="150" stroke-width="1.5"/>
  <path d="M30,150 Q180,63.4 330,150" stroke-width="2.5" style="stroke:var(--accent)"/>
  <line x1="30" y1="150" x2="64.6" y2="130" stroke-width="3" marker-end="url(#pmb-kk-c)"/>
  <circle cx="30" cy="150" r="4" fill="currentColor" stroke="none"/>
  <circle cx="180" cy="106.7" r="4" style="fill:var(--accent)" stroke="none"/>
  <line x1="180" y1="108.7" x2="180" y2="148" stroke-width="1.5" style="stroke:var(--vy)" marker-start="url(#pmb-kk-y)" marker-end="url(#pmb-kk-y)"/>
  <line x1="180" y1="146" x2="180" y2="156" stroke-width="1.5"/>
  <line x1="30" y1="182" x2="330" y2="182" stroke-width="1.5" style="stroke:var(--vx)" marker-start="url(#pmb-kk-x)" marker-end="url(#pmb-kk-x)"/>
  <g stroke="none">
    <text x="10" y="70" font-weight="700" fill="currentColor">15 m/s at 30°</text>
    <text x="10" y="84" ${M}>kick speed + angle</text>
    <text x="10" y="98" ${M}>launch velocity u, θ</text>
    <text x="180" y="62" text-anchor="middle" ${Y}>? → 2.87 m</text>
    <text x="180" y="76" text-anchor="middle" ${M}>highest point</text>
    <text x="180" y="90" text-anchor="middle" ${M}>maximum height</text>
    <text x="350" y="70" text-anchor="end" ${A}>t = ? → 1.53 s</text>
    <text x="350" y="84" text-anchor="end" ${M}>time in the air</text>
    <text x="350" y="98" text-anchor="end" ${M}>time of flight</text>
    <text x="180" y="168" text-anchor="middle" ${M}><tspan ${A} font-size="12">0.76 s</tspan> to the top (half of 1.53 s)</text>
    <text x="180" y="200" text-anchor="middle" ${X}>? → 13.0 × 1.53 = 19.9 m ≈ 20 m</text>
    <text x="180" y="215" text-anchor="middle" ${M}>distance along the ground · range</text>
    <text x="180" y="234" text-anchor="middle" ${M}>Path drawn to scale.</text>
  </g>
</svg>`;

export const figKickAnswers: Figure = {
  kind: "svg",
  svg: svgKickAnswers,
  alt: "The kicked ball's curved path drawn to scale on flat ground. Launch arrow labelled 15 m/s at 30 degrees, launch velocity. Dimension from the ground to the top of the path: ? becomes 2.87 m, highest point, maximum height. Top right: t = ? becomes 1.53 s, time in the air, time of flight. Below the top: 0.76 s to the top, half of 1.53 s. Along the ground: ? becomes 13.0 times 1.53 = 19.9 m, about 20 m, the range.",
  caption: "Where each answer lives. Drawn to scale, the path is much flatter than most sketches: 2.87 m high but 19.9 m long.",
};
