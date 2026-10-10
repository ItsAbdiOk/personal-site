
// All numbers in this file were recomputed in Python with g = 9.81 m s⁻².

// ---------- Inline diagrams (viewBox-based, theme-aware) ----------

export const svgTrajectory = `<svg viewBox="0 0 380 240" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">
  <defs>
    <marker id="pm-traj-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
  </defs>
  <line x1="20" y1="190" x2="360" y2="190" stroke-width="1.5"/>
  <path d="M40,190 Q190,-50 340,190" stroke-width="2.5" style="stroke:var(--accent)"/>
  <circle cx="40" cy="190" r="5" fill="currentColor" stroke="none"/>
  <circle cx="190" cy="70" r="5" style="fill:var(--accent)" stroke="none"/>
  <line x1="190" y1="70" x2="190" y2="190" stroke-dasharray="4 4"/>
  <text x="196" y="135" fill="currentColor" stroke="none">maximum height</text>
  <text x="196" y="60" fill="currentColor" stroke="none">top: upward speed = 0</text>
  <line x1="40" y1="215" x2="340" y2="215" stroke-width="1.2" marker-start="url(#pm-traj-ah)" marker-end="url(#pm-traj-ah)"/>
  <text x="190" y="232" text-anchor="middle" fill="currentColor" stroke="none">range (horizontal distance)</text>
  <text x="50" y="205" fill="currentColor" stroke="none">launch</text>
  <text x="300" y="182" fill="currentColor" stroke="none">landing</text>
  <text x="60" y="40" fill="currentColor" stroke="none">curved path = parabola</text>
</svg>`;

export const svgStrobe = `<svg viewBox="0 0 360 270" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">
  <g stroke-dasharray="3 5" stroke-width="0.8" opacity="0.5">
    <line x1="40" y1="30" x2="330" y2="30"/>
    <line x1="40" y1="35.8" x2="330" y2="35.8"/>
    <line x1="40" y1="53.2" x2="330" y2="53.2"/>
    <line x1="40" y1="82.2" x2="330" y2="82.2"/>
    <line x1="40" y1="122.8" x2="330" y2="122.8"/>
    <line x1="40" y1="175" x2="330" y2="175"/>
    <line x1="40" y1="238.8" x2="330" y2="238.8"/>
  </g>
  <g stroke-width="1.8">
    <circle cx="50" cy="30" r="6"/>
    <circle cx="50" cy="35.8" r="6"/>
    <circle cx="50" cy="53.2" r="6"/>
    <circle cx="50" cy="82.2" r="6"/>
    <circle cx="50" cy="122.8" r="6"/>
    <circle cx="50" cy="175" r="6"/>
    <circle cx="50" cy="238.8" r="6"/>
  </g>
  <g stroke="none" style="fill:var(--accent)">
    <circle cx="50" cy="30" r="5"/>
    <circle cx="90" cy="35.8" r="6"/>
    <circle cx="130" cy="53.2" r="6"/>
    <circle cx="170" cy="82.2" r="6"/>
    <circle cx="210" cy="122.8" r="6"/>
    <circle cx="250" cy="175" r="6"/>
    <circle cx="290" cy="238.8" r="6"/>
  </g>
  <text x="62" y="20" fill="currentColor" stroke="none">dropped (hollow)  ·  launched sideways (filled)</text>
  <text x="300" y="262" text-anchor="middle" fill="currentColor" stroke="none">equal sideways steps</text>
  <text x="68" y="210" fill="currentColor" stroke="none">same height</text>
  <text x="68" y="223" fill="currentColor" stroke="none">at every flash</text>
</svg>`;

export const svgComponents = `<svg viewBox="0 0 340 215" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="13">
  <defs>
    <marker id="pm-comp-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
    <marker id="pm-comp-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
  </defs>
  <line x1="40" y1="180" x2="238" y2="180" stroke-width="2.5" style="stroke:var(--accent)" marker-end="url(#pm-comp-ah2)"/>
  <line x1="240" y1="180" x2="240" y2="67" stroke-width="2.5" style="stroke:var(--accent)" marker-end="url(#pm-comp-ah2)"/>
  <line x1="40" y1="180" x2="238" y2="65.6" stroke-width="2.5" marker-end="url(#pm-comp-ah)"/>
  <circle cx="40" cy="180" r="5" fill="currentColor" stroke="none"/>
  <path d="M80,180 A40,40 0 0 0 74.64,160" stroke-width="1.5"/>
  <text x="86" y="174" fill="currentColor" stroke="none">30°</text>
  <text x="128" y="98" text-anchor="end" fill="currentColor" stroke="none" font-weight="600">kicked at 15 m/s</text>
  <text x="140" y="203" text-anchor="middle" style="fill:var(--accent)" stroke="none" font-weight="600">sideways speed 13.0 m/s</text>
  <text x="248" y="118" style="fill:var(--accent)" stroke="none" font-weight="600">upward speed</text>
  <text x="248" y="135" style="fill:var(--accent)" stroke="none" font-weight="600">7.5 m/s</text>
</svg>`;

export const svgVectors = `<svg viewBox="0 0 380 290" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">
  <defs>
    <marker id="pm-vec-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
    <marker id="pm-vec-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
  </defs>
  <line x1="10" y1="200" x2="370" y2="200" stroke-width="1" opacity="0.5"/>
  <path d="M30,200 Q180,-100 330,200" stroke-width="1.5" stroke-dasharray="5 4"/>
  <g stroke-width="2" style="stroke:var(--accent)" marker-end="url(#pm-vec-ah2)">
    <line x1="30" y1="200" x2="70" y2="200"/>
    <line x1="105" y1="87.5" x2="145" y2="87.5"/>
    <line x1="180" y1="50" x2="220" y2="50"/>
    <line x1="255" y1="87.5" x2="295" y2="87.5"/>
    <line x1="330" y1="200" x2="370" y2="200"/>
  </g>
  <g stroke-width="2" marker-end="url(#pm-vec-ah)">
    <line x1="30" y1="200" x2="30" y2="160"/>
    <line x1="105" y1="87.5" x2="105" y2="67.5"/>
    <line x1="255" y1="87.5" x2="255" y2="107.5"/>
    <line x1="330" y1="200" x2="330" y2="240"/>
  </g>
  <circle cx="180" cy="50" r="4" fill="currentColor" stroke="none"/>
  <g fill="currentColor" stroke="none">
    <text x="180" y="20" text-anchor="middle">top: up/down speed = 0</text>
    <text x="180" y="36" text-anchor="middle">still 13.0 sideways</text>
    <text x="98" y="72" text-anchor="end">3.75 up</text>
    <text x="249" y="106" text-anchor="end">3.75 down</text>
    <text x="10" y="222">launch: 7.5 up</text>
    <text x="322" y="230" text-anchor="end">landing: 7.5 down</text>
    <text x="10" y="262" style="fill:var(--accent)">sideways arrows: 13.0 every time</text>
    <text x="10" y="280">up/down arrows change (speeds in m s⁻¹)</text>
  </g>
</svg>`;

export const svgImpact = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">
  <defs>
    <marker id="pm-imp-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" stroke="none"/></marker>
    <marker id="pm-imp-ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)" stroke="none"/></marker>
  </defs>
  <line x1="40" y1="40" x2="200" y2="40" stroke-width="2" style="stroke:var(--accent)" marker-end="url(#pm-imp-ah2)"/>
  <line x1="200" y1="40" x2="200" y2="118" stroke-width="2" style="stroke:var(--accent)" marker-end="url(#pm-imp-ah2)"/>
  <line x1="40" y1="40" x2="198" y2="117" stroke-width="2.5" marker-end="url(#pm-imp-ah)"/>
  <path d="M85,40 A45,45 0 0 1 80.45,59.73"/>
  <g fill="currentColor" stroke="none">
    <text x="120" y="28" text-anchor="middle">sideways: 49.2 m s⁻¹</text>
    <text x="208" y="84">down: 24.0 m s⁻¹</text>
    <text x="104" y="112" text-anchor="end">v = 54.7 m s⁻¹</text>
    <text x="92" y="56">θ = 26.0°</text>
    <text x="10" y="150">actual velocity: 54.7 m s⁻¹</text>
    <text x="10" y="168">at 26.0° below the horizontal</text>
  </g>
</svg>`;

export const svgDrag = `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" font-family="inherit" font-size="12">
  <line x1="10" y1="200" x2="350" y2="200" stroke-width="1.5"/>
  <path d="M30,200 Q180,-60 330,200" stroke-width="2" stroke-dasharray="6 4"/>
  <path d="M30,200 C110,62 200,80 245,200" stroke-width="2.5" style="stroke:var(--accent)"/>
  <circle cx="180" cy="70" r="3" fill="currentColor" stroke="none"/>
  <circle cx="147" cy="103" r="3" stroke="none" style="fill:var(--accent)"/>
  <line x1="222" y1="134" x2="207" y2="113" stroke-width="1.8" style="stroke:var(--accent)"/>
  <path d="M207,113 L208,123 M207,113 L216,117" stroke-width="1.8" style="stroke:var(--accent)"/>
  <text x="228" y="124" stroke="none" style="fill:var(--accent)">drag</text>
  <text x="10" y="20" fill="currentColor" stroke="none">same launch speed and angle for both</text>
  <text x="352" y="50" text-anchor="end" fill="currentColor" stroke="none">no air resistance:</text>
  <text x="352" y="64" text-anchor="end" fill="currentColor" stroke="none">symmetric, higher, further</text>
  <text x="95" y="150" fill="currentColor" stroke="none">with air resistance:</text>
  <text x="95" y="164" fill="currentColor" stroke="none">lower, shorter,</text>
  <text x="95" y="178" fill="currentColor" stroke="none">steeper coming down</text>
  <line x1="245" y1="196" x2="245" y2="204" stroke-width="1.5"/>
  <line x1="330" y1="196" x2="330" y2="204" stroke-width="1.5"/>
  <text x="30" y="216" text-anchor="middle" fill="currentColor" stroke="none">launch</text>
  <text x="245" y="216" text-anchor="middle" fill="currentColor" stroke="none">lands closer</text>
  <text x="352" y="232" text-anchor="end" fill="currentColor" stroke="none">lands further</text>
</svg>`;

