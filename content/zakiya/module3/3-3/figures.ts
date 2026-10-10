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
const svgFig5 = `${head("ac-f5", 340)}
  <g stroke-width="0.6" opacity="0.25">
    <line x1="50" y1="160" x2="290" y2="160"/><line x1="50" y1="120" x2="290" y2="120"/><line x1="50" y1="80" x2="290" y2="80"/><line x1="50" y1="40" x2="290" y2="40"/>
    <line x1="130" y1="40" x2="130" y2="200"/><line x1="210" y1="40" x2="210" y2="200"/><line x1="290" y1="40" x2="290" y2="200"/>
  </g>
  <line x1="50" y1="200" x2="300" y2="200" stroke-width="1.5" marker-end="url(#ac-f5-c)"/>
  <line x1="50" y1="200" x2="50" y2="28" stroke-width="1.5" marker-end="url(#ac-f5-c)"/>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="50" y="216" text-anchor="middle">0</text><text x="130" y="216" text-anchor="middle">1.0</text><text x="210" y="216" text-anchor="middle">2.0</text><text x="290" y="216" text-anchor="middle">3.0</text>
    <text x="42" y="204" text-anchor="end">0</text><text x="42" y="124" text-anchor="end">2.0</text><text x="42" y="44" text-anchor="end">4.0</text>
    <text x="300" y="232" text-anchor="end">t / s</text><text x="8" y="22">v / m s⁻¹</text>
  </g>
  <path d="M50,200 L130,120 L290,80" stroke-width="2.5"/>
  <line x1="52" y1="200" x2="128" y2="200" stroke-width="2" style="stroke:var(--vx)"/>
  <line x1="130" y1="198" x2="130" y2="122" stroke-width="2" style="stroke:var(--vy)"/>
  <line x1="132" y1="120" x2="288" y2="120" stroke-width="2" stroke-dasharray="5 3" style="stroke:var(--vx)"/>
  <line x1="290" y1="118" x2="290" y2="82" stroke-width="2" stroke-dasharray="5 3" style="stroke:var(--vy)"/>
  <g stroke="none" font-weight="600" font-size="12">
    <text x="90" y="194" text-anchor="middle" style="fill:var(--vx)">1.0 s</text>
    <text x="136" y="164" style="fill:var(--vy)">2.0 m/s</text>
    <text x="210" y="136" text-anchor="middle" style="fill:var(--vx)">2.0 s</text>
    <text x="284" y="104" text-anchor="end" style="fill:var(--vy)">1.0 m/s</text>
    <text x="64" y="128" style="fill:var(--accent)">2.0 m s⁻²</text>
    <text x="196" y="72" text-anchor="middle" style="fill:var(--accent)">0.50 m s⁻²</text>
  </g>
  ${key(254, "var(--vy)", "2.0, 1.0 m/s · how much faster it got", "change in velocity Δv (rise)")}
  ${key(288, "var(--vx)", "1.0, 2.0 s · how long that took", "time taken Δt (run)")}
  ${key(322, "var(--accent)", "2.0, 0.50 m s⁻² · rise ÷ run", "gradient = acceleration a")}
</svg>`;

export const figFig5: Figure = {
  kind: "svg",
  svg: svgFig5,
  alt: "Velocity–time graph. A straight line rises from 0 to 2.0 metres per second between 0 and 1.0 seconds: gradient triangle with rise 2.0 and run 1.0 gives 2.0 metres per second squared. A shallower straight line rises from 2.0 to 3.0 metres per second between 1.0 and 3.0 seconds: rise 1.0, run 2.0, gradient 0.50 metres per second squared.",
  caption: "Textbook Figure 5 (p. 28) with gradient triangles. Steeper line = bigger {{a}}. Maximum acceleration = 2.0 m s⁻², in the first second.",
};

// ---------- Tangent on a curve (ours: v = 4t − 0.25t², tangent at t = 4.0 s) ----------
// origin (50,210); 1 s = 24 px; 1 m/s = 7 px.
const svgTangent = `${head("ac-tg", 352)}
  <line x1="50" y1="210" x2="305" y2="210" stroke-width="1.5" marker-end="url(#ac-tg-c)"/>
  <line x1="50" y1="210" x2="50" y2="30" stroke-width="1.5" marker-end="url(#ac-tg-c)"/>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="50" y="226" text-anchor="middle">0</text><text x="146" y="226" text-anchor="middle">4.0</text><text x="290" y="226" text-anchor="middle">10.0</text>
    <text x="42" y="214" text-anchor="end">0</text><text x="42" y="186" text-anchor="end">4</text><text x="42" y="130" text-anchor="end">12</text><text x="42" y="46" text-anchor="end">24</text>
    <text x="305" y="242" text-anchor="end">t / s</text><text x="8" y="22">v / m s⁻¹</text>
  </g>
  <path d="M50,210 L62,196.4 L74,183.8 L86,171.9 L98,161 L110,150.9 L122,141.8 L134,133.4 L146,126 L158,119.4 L170,113.8 L182,108.9 L194,105 L206,101.9 L218,99.8 L230,98.4 L242,98" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="50" y1="182" x2="290" y2="42" stroke-width="1.8" style="stroke:var(--accent)"/>
  <line x1="146" y1="210" x2="146" y2="126" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="50" y1="126" x2="146" y2="126" stroke-width="1" stroke-dasharray="3 3"/>
  <circle cx="146" cy="126" r="5" fill="currentColor" stroke="none"/>
  <line x1="52" y1="182" x2="288" y2="182" stroke-width="2" stroke-dasharray="5 3" style="stroke:var(--vx)"/>
  <line x1="290" y1="180" x2="290" y2="44" stroke-width="2" stroke-dasharray="5 3" style="stroke:var(--vy)"/>
  <g stroke="none" font-weight="600" font-size="12">
    <text x="210" y="198" text-anchor="middle" style="fill:var(--vx)">10.0 s</text>
    <text x="284" y="120" text-anchor="end" style="fill:var(--vy)">20 m/s</text>
    <text x="154" y="146" fill="currentColor">t = 4.0 s</text>
    <text x="154" y="162" fill="currentColor">v = 12 m/s</text>
    <text x="186" y="66" text-anchor="end" style="fill:var(--accent)">tangent</text>
  </g>
  ${key(268, "var(--vy)", "24 − 4 = 20 m/s · rise of the tangent", "change in velocity Δv")}
  ${key(302, "var(--vx)", "10.0 − 0 = 10.0 s · run of the tangent", "time interval Δt")}
  ${key(336, "var(--accent)", "? → 2.0 m s⁻² · steepness at t = 4.0 s", "instantaneous acceleration = gradient of tangent")}
</svg>`;

export const figTangent: Figure = {
  kind: "svg",
  svg: svgTangent,
  alt: "A curved velocity–time graph rising steeply then levelling off. A straight tangent touches it at t = 4.0 seconds, where v = 12 metres per second. The tangent runs from 4 metres per second at 0 seconds to 24 metres per second at 10.0 seconds. Big triangle: rise 20 metres per second, run 10.0 seconds, gradient 2.0 metres per second squared.",
  caption: "Our example. The {{tangent}} touches the curve at t = 4.0 s. Use a **big** triangle on the tangent, not on the curve: 20 ÷ 10.0 = 2.0 m s⁻².",
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
  ${mini(190, 10, "M0,30 L130,30", "flat", "zero acceleration (constant v)")}
  ${mini(20, 150, "M0,10 L130,55", "straight, sloping down", "constant deceleration")}
  ${mini(190, 150, "M0,60 Q20,15 130,8", "curve getting flatter", "acceleration decreasing")}
</svg>`;

export const figShapes: Figure = {
  kind: "svg",
  svg: svgShapes,
  alt: "Four small velocity–time graphs. A straight line sloping up: constant acceleration. A flat line: zero acceleration, constant velocity. A straight line sloping down: constant deceleration. A curve that gets flatter: acceleration decreasing.",
  caption: "Read the {{grad|gradient}}, not the height. Based on Textbook Figure 4 (p. 28).",
};

// ---------- Acceleration–time graph for Figure 5 (Textbook p. 28 Q4b) ----------
const svgAT = `${head("ac-at", 290)}
  <g stroke-width="0.6" opacity="0.25">
    <line x1="50" y1="170" x2="290" y2="170"/><line x1="50" y1="140" x2="290" y2="140"/><line x1="50" y1="110" x2="290" y2="110"/><line x1="50" y1="80" x2="290" y2="80"/>
    <line x1="130" y1="60" x2="130" y2="200"/><line x1="210" y1="60" x2="210" y2="200"/><line x1="290" y1="60" x2="290" y2="200"/>
  </g>
  <line x1="50" y1="200" x2="300" y2="200" stroke-width="1.5" marker-end="url(#ac-at-c)"/>
  <line x1="50" y1="200" x2="50" y2="48" stroke-width="1.5" marker-end="url(#ac-at-c)"/>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="50" y="216" text-anchor="middle">0</text><text x="130" y="216" text-anchor="middle">1.0</text><text x="210" y="216" text-anchor="middle">2.0</text><text x="290" y="216" text-anchor="middle">3.0</text>
    <text x="42" y="204" text-anchor="end">0</text><text x="42" y="174" text-anchor="end">0.50</text><text x="42" y="144" text-anchor="end">1.0</text><text x="42" y="84" text-anchor="end">2.0</text>
    <text x="300" y="232" text-anchor="end">t / s</text><text x="8" y="42">a / m s⁻²</text>
  </g>
  <path d="M50,80 L130,80 L130,170 L290,170" stroke-width="2.5" style="stroke:var(--accent)"/>
  <g stroke="none" font-weight="600" font-size="12" style="fill:var(--accent)">
    <text x="90" y="72" text-anchor="middle">2.0 m s⁻²</text>
    <text x="210" y="162" text-anchor="middle">0.50 m s⁻²</text>
  </g>
  ${key(262, "var(--accent)", "2.0 then 0.50 · gradients from the v–t graph", "acceleration a (each flat step)")}
</svg>`;

export const figAT: Figure = {
  kind: "svg",
  svg: svgAT,
  alt: "Acceleration–time graph. A flat line at 2.0 metres per second squared from 0 to 1.0 seconds, then a step down to a flat line at 0.50 metres per second squared from 1.0 to 3.0 seconds.",
  caption: "Each straight section of the v–t graph becomes a **flat** step on the {{atgraph}}.",
};

// ---------- Question figure: tram v–t graph (ours) ----------
// origin (50,190); 1 s = 2.4 px; 1 m/s = 10 px.
const svgTram = `${head("ac-tr", 236)}
  <g stroke-width="0.6" opacity="0.25">
    <line x1="50" y1="150" x2="314" y2="150"/><line x1="50" y1="110" x2="314" y2="110"/><line x1="50" y1="70" x2="314" y2="70"/>
    <line x1="98" y1="60" x2="98" y2="190"/><line x1="146" y1="60" x2="146" y2="190"/><line x1="194" y1="60" x2="194" y2="190"/><line x1="242" y1="60" x2="242" y2="190"/><line x1="290" y1="60" x2="290" y2="190"/>
  </g>
  <line x1="50" y1="190" x2="320" y2="190" stroke-width="1.5" marker-end="url(#ac-tr-c)"/>
  <line x1="50" y1="190" x2="50" y2="40" stroke-width="1.5" marker-end="url(#ac-tr-c)"/>
  <g stroke="none" fill="currentColor" font-size="11.5">
    <text x="50" y="206" text-anchor="middle">0</text><text x="98" y="206" text-anchor="middle">20</text><text x="146" y="206" text-anchor="middle">40</text><text x="194" y="206" text-anchor="middle">60</text><text x="242" y="206" text-anchor="middle">80</text><text x="290" y="206" text-anchor="middle">100</text>
    <text x="42" y="194" text-anchor="end">0</text><text x="42" y="154" text-anchor="end">4</text><text x="42" y="114" text-anchor="end">8</text><text x="42" y="74" text-anchor="end">12</text>
    <text x="320" y="224" text-anchor="end">t / s</text><text x="8" y="34">v / m s⁻¹</text>
  </g>
  <path d="M50,190 L98,70 L242,70 L299.6,190" stroke-width="2.5" style="stroke:var(--vy)"/>
</svg>`;

export const figTram: Figure = {
  kind: "svg",
  svg: svgTram,
  alt: "Velocity–time graph for a tram. Straight line from 0 to 12 metres per second between 0 and 20 seconds, flat at 12 metres per second until 80 seconds, then a straight line down to 0 at 104 seconds.",
  caption: "Velocity–time graph for the tram.",
};
