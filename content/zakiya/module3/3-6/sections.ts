import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

// All numbers rechecked in Python. Textbook = A Level Physics for OCR, pp. 35–36.
const sections: Section[] = [
  {
    id: "two-parts",
    heading: "Stopping distance has two parts",
    source: "both",
    specRef: "3.1.2(c)",
    blocks: [
      { type: "lead", body: "A car can't stop the instant a driver sees danger. Split the distance it needs into two parts, because each part depends on different things." },
      {
        type: "text",
        body: "At 30 mph (13.4 m s⁻¹) the Highway Code says a car travels **9.0 m** before the driver even touches the brake, then another **14.0 m** while braking. Total: about **23 m** (Textbook p. 35–36).",
      },
      { type: "figure", figure: F.figRoad },
      {
        type: "list",
        items: [
          "{{thinking}}: from first seeing the {{hazard}} to the moment the brake is pressed. The car is still at full {{speed}}.",
          "{{braking}}: from the brake going on until the car stops.",
          "{{stopping}}: the two added together.",
        ],
      },
      {
        type: "equation",
        latexless: "stopping distance = thinking distance + braking distance",
        tex: "\\text{stopping distance} = \\text{thinking distance} + \\text{braking distance}",
        words: "**total distance to stop = distance before braking + distance while braking**. At 30 mph: 9.0 m + 14.0 m ≈ 23 m.",
        dataSheet: false,
      },
      {
        type: "sayIt",
        say: [
          "Stopping distance is the ==sum of the thinking distance and the braking distance==.",
          "Or: the ==total distance travelled from when the driver sees a hazard to the vehicle stopping==.",
        ],
        source: "H156/02 June 2017 Q1(a) mark scheme",
      },
      {
        type: "examiners",
        body: "On a velocity–time graph from hazard to stop, the most popular wrong answer for the {{stopping}} was the {{braking}} alone: candidates forgot to add the {{thinking}}.",
        cite: "June 2018 H156/01 Q10",
      },
      {
        type: "examiners",
        body: "A common error was calculating the distance travelled **while braking** when the question asked for the {{stopping}}. In the next part, some then used the stopping distance for the work done by the brakes, which needs the braking distance only.",
        cite: "June 2023 H156/02 Q1(a)(iii)–(iv)",
      },
      {
        type: "tip",
        body: "Textbook study tip (p. 35): don't mix up **distance** and **time**. \"It takes longer to stop\" is ambiguous; say \"the stopping **distance** is greater\" or \"the stopping **time** is longer\".",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "thinking",
    heading: "Thinking distance and reaction time",
    source: "both",
    specRef: "3.1.2(c)",
    blocks: [
      { type: "lead", body: "While the driver reacts, the car doesn't slow at all. So thinking distance is plain speed × time." },
      {
        type: "text",
        body: "At 13.4 m s⁻¹ the car covers 13.4 m every second. The driver takes about 0.67 s to react, so it covers 13.4 × 0.67 ≈ 9.0 m before braking. That time is the {{reaction}}.",
      },
      {
        type: "equation",
        latexless: "thinking distance = speed × reaction time",
        tex: "\\text{thinking distance} = \\text{speed} \\times \\text{reaction time}",
        words: "**distance before braking = how fast you're going × how long you take to react**. 13.4 m s⁻¹ × 0.67 s ≈ 9.0 m.",
        general: "s = ut + ½at² with a = 0 (constant speed), so s = ut",
        generalTex: "s = ut + \\tfrac{1}{2}at^2 \\text{ with } a = 0 \\text{ (constant speed), so } s = ut",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Highway Code reaction time (Textbook p. 35)",
        origin: { kind: "textbook", ref: "p. 35" },
        question: "In the UK Highway Code, the {{thinking}} at 30 {{mph}} (13.4 m s⁻¹) is 9.0 m. Calculate the {{reaction}}.",
        steps: [
          "**Rearrange** thinking distance = speed × reaction time for the time: reaction time = thinking distance ÷ {{speed}}.",
          "**Substitute:** reaction time = 9.0 ÷ 13.4 = **0.67 s** (2 s.f.).",
          "**Extension (book):** at 70 mph (31.1 m s⁻¹) with the same 0.67 s: thinking distance = 31.1 × 0.67 ≈ **21 m**, about five cars long.",
        ],
        answer: "**0.67 s.** At 70 mph the same reaction time costs about 21 m before braking even starts.",
      },
      { type: "figure", figure: F.figReaction },
      {
        type: "text",
        body: "**Thinking distance is {{prop}} to speed** (for a fixed reaction time). The table on p. 36 shows it: 9 m at 13.4 m s⁻¹, 18 m at 26.7 m s⁻¹. Double the speed, double the thinking distance.",
      },
      {
        type: "list",
        items: [
          "**Increase the reaction time** (so the thinking distance): tiredness, alcohol, drugs, distraction (e.g. a phone).",
          "**Increase the thinking distance with the same reaction time:** higher speed.",
          "Road, tyres and brakes do **not** affect thinking distance: the brakes aren't on yet.",
        ],
      },
      {
        type: "sayIt",
        say: [
          "Thinking distance: ==distance travelled from the moment the driver sees a hazard until the brakes are applied==.",
          "==Thinking distance is proportional to speed (for a constant thinking time)==.",
        ],
        source: "PMT topic pack Set N Q39 mark scheme (current spec; paper not identified)",
      },
      {
        type: "warning",
        body: "A definition must mention **both ends**: seeing the hazard (the stimulus) and applying the brakes. An older OCR scheme refused just \"speed × reaction time\" as a definition: that's how you calculate it, not what it is.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "braking",
    heading: "Braking distance and deceleration",
    source: "both",
    specRef: "3.1.2(c)",
    blocks: [
      { type: "lead", body: "Once the brakes are on, the car slows at a roughly constant rate, so the {{suvat}} equations from 3.5 work." },
      {
        type: "text",
        body: "From 13.4 m s⁻¹ the Highway Code car stops in 14.0 m. Assume the {{decel}} is constant. We know the start {{speed}}, the end speed (0) and the distance, but not the time: that's a job for {{v2eq}}.",
      },
      {
        type: "equation",
        latexless: "a = −u² ÷ 2s",
        tex: "a = -\\dfrac{u^2}{2s}",
        words: "**acceleration = −(speed when braking starts)² ÷ (2 × braking distance)**. Minus because the car slows down.",
        general: "v² = u² + 2as with v = 0",
        generalTex: "v^2 = u^2 + 2as \\text{ with } v = 0",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Highway Code deceleration (Textbook p. 36)",
        origin: { kind: "textbook", ref: "p. 36" },
        question: "The {{braking}} at 30 mph (13.4 m s⁻¹) is 14.0 m. Assuming constant {{decel}}, calculate the acceleration of the car.",
        steps: [
          "**List the SUVAT values:** {{s}} = 14.0 m, {{u}} = 13.4 m s⁻¹, {{v}} = 0, {{a}} = ?",
          "**Pick the equation with no t:** {{v2eq}}. With v = 0 it rearranges to {{minus-u2-2s}}.",
          "**Substitute:** $a = -\\dfrac{13.4^2}{2 \\times 14.0} = -\\dfrac{179.6}{28.0}$ = **−6.4 m s⁻²** (2 s.f.).",
        ],
        answer: "**a = −6.4 m s⁻²**: a deceleration of 6.4 m s⁻². The car loses 6.4 m s⁻¹ every second.",
      },
      { type: "figure", figure: F.figBraking },
      {
        type: "worked",
        title: "Time to stop from 70 mph (Textbook p. 36, Q3)",
        origin: { kind: "textbook", ref: "p. 36" },
        question: "From Table 1, a car at 70 mph (31.1 m s⁻¹) has a {{braking}} of 75 m. Calculate (a) its deceleration, (b) the time it takes to stop once the brakes are on.",
        steps: [
          "**(a)** {{s}} = 75 m, {{u}} = 31.1 m s⁻¹, {{v}} = 0. {{minus-u2-2s}}: $a = -\\dfrac{31.1^2}{2 \\times 75} = -\\dfrac{967.2}{150}$ = **−6.4 m s⁻²** (6.45).",
          "**(b)** Now use {{v}} = {{u}} + {{a}}{{t}}, rearranged: $t = \\dfrac{v - u}{a} = \\dfrac{0 - 31.1}{-6.45}$ = **4.8 s**.",
        ],
        answer: "**6.4 m s⁻²** deceleration; **4.8 s** of braking. Same deceleration as at 30 mph: the road and brakes haven't changed, only the speed.",
      },
      {
        type: "text",
        body: "Flip the equation round to get the distance: {{u2-2a}}. Speed is **squared**, so braking distance is {{propsq}}. Table 1 shows it: 13.4 → 26.7 m s⁻¹ is about × 2, and 14 → 55 m is about × 4.",
      },
      {
        type: "equation",
        latexless: "s = u² ÷ 2a",
        tex: "s = \\dfrac{u^2}{2a}",
        words: "**braking distance = (speed)² ÷ (2 × deceleration)**. Double the speed → four times the braking distance.",
        general: "v² = u² + 2as with v = 0 (a taken as the size of the deceleration)",
        generalTex: "v^2 = u^2 + 2as \\text{ with } v = 0 \\text{ (}a\\text{ taken as the size of the deceleration)}",
        dataSheet: false,
      },
      {
        type: "list",
        items: [
          "**Longer braking distance:** higher speed (biggest effect), worn brakes or tyres, wet, icy or gravel road, heavier load, going downhill.",
          "These change the **deceleration**. Reaction time does **not** affect braking distance.",
        ],
      },
      {
        type: "warning",
        body: "Doubling the speed **doubles** the thinking distance but **quadruples** the braking distance. The stopping distance goes up by more than 2 × but less than 4 ×.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "table",
    heading: "The Highway Code table",
    source: "textbook-only",
    blocks: [
      { type: "lead", body: "One picture of the whole topic: thinking distance grows steadily, braking distance runs away at high speed." },
      { type: "figure", figure: F.figTable },
      {
        type: "list",
        items: [
          "Every column adds up: thinking + braking = stopping (6 + 6 = 12 … 21 + 75 = 96 m).",
          "Thinking ÷ speed ≈ 0.67 s every time: one fixed {{reaction}}.",
          "Braking: $u^2 \\div 2s$ ≈ 6.4–6.6 m s⁻² every time: one fixed {{decel}}.",
          "At 20 mph thinking and braking are equal; at 70 mph braking is over 3 × thinking.",
        ],
      },
      {
        type: "tip",
        body: "Speeds in mph must be converted before any calculation. Multiply by 1609 (metres in a mile) and divide by 3600 (seconds in an hour): 30 mph → 30 × 1609 ÷ 3600 = 13.4 m s⁻¹. Careful: this gives 26.8 and 31.3 for 60 and 70 mph, but Table 1 prints 26.7 and 31.1. Use whichever the question gives you.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "vt-graph",
    heading: "Stopping on a velocity–time graph",
    source: "both",
    specRef: "3.1.1(d), 3.1.2(c)",
    blocks: [
      { type: "lead", body: "Most exam questions give a velocity–time graph from \"sees hazard\" to \"stopped\". Read the two parts straight off it." },
      {
        type: "list",
        items: [
          "**Flat part** = thinking. Its length along the time axis is the {{reaction}}.",
          "**Sloping part** = braking. Its {{gradient}} is the acceleration (negative).",
          "{{area}} = distance. Rectangle = {{thinking}}, triangle = {{braking}}.",
        ],
      },
      {
        type: "worked",
        title: "Reading a stopping graph",
        origin: { kind: "ours" },
        question: "A car is moving at 15 m s⁻¹ when the driver sees a hazard. The velocity stays at 15 m s⁻¹ until t = 0.60 s, then falls uniformly to zero at t = 3.6 s. Find the {{decel}}, the {{braking}} and the {{stopping}}.",
        steps: [
          "**Reaction time:** the flat part lasts **0.60 s**.",
          "**Thinking distance** = rectangle area = 15 × 0.60 = **9.0 m**.",
          "**Braking time** = 3.6 − 0.60 = 3.0 s. **Acceleration** = {{gradient}} = (0 − 15) ÷ 3.0 = **−5.0 m s⁻²**.",
          "**Braking distance** = triangle area = ½ × 3.0 × 15 = **22.5 m**.",
          "**Stopping distance** = 9.0 + 22.5 = **31.5 m**.",
        ],
        answer: "Deceleration **5.0 m s⁻²**, braking distance **22.5 m**, stopping distance **31.5 m** (≈ 32 m).",
      },
      { type: "figure", figure: F.figVtWorked },
      {
        type: "text",
        body: "**How the graph changes** is a favourite question. A longer reaction time stretches the flat part. A smaller deceleration makes the slope shallower. Half the speed halves the height; with the same braking force the slope stays the same, so it reaches zero sooner.",
      },
      { type: "figure", figure: F.figVtChanges },
      {
        type: "sayIt",
        say: [
          "Tired driver: ==horizontal section would be longer== (and no change to the sloping line).",
          "More resistive road surface: ==sloping section would be steeper== (allow: gradient is greater).",
          "Half speed: horizontal line at half the speed for the same time, then a line of the ==same gradient== to zero.",
        ],
        reject: ["\"Thinking time is longer\" or \"braking time is shorter\" on their own: describe the **line**."],
        source: "H156/02 June 2023 Q1(b),(c) mark scheme",
      },
      {
        type: "examiners",
        body: "When sketching the half-speed graph, many ended the line at the same time as the original or made the braking part much too short. Same braking force → same gradient → braking time halves.",
        cite: "June 2023 H156/02 Q1(b)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "forces-energy",
    heading: "Braking force and energy",
    source: "spec-only",
    specRef: "3.1.2(c) with 3.2 and 3.3",
    blocks: [
      { type: "lead", body: "Exam questions often add a force or energy step. Two routes, same answer." },
      {
        type: "text",
        body: "A 950 kg car at 20 m s⁻¹ has {{ke}} ½ × 950 × 20² = 190 000 J. Brakes pushing back with 6000 N take away 6000 J every metre. So the car stops after 190 000 ÷ 6000 = 31.7 m.",
      },
      {
        type: "equation",
        latexless: "F × d = ½mv²",
        tex: "F d = \\tfrac{1}{2} m v^2",
        words: "**braking force × braking distance = kinetic energy the car had**. The brakes' {{work}} removes all the KE.",
        general: "W = Fx cos θ with θ = 0 (force along the motion)",
        generalTex: "W = Fx\\cos\\theta \\text{ with } \\theta = 0",
        note: "Same answer as F = ma then {{u2-2a}}. Either way, {{d}} is {{propsq}} for a fixed {{F}}.",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Braking force to braking distance",
        origin: { kind: "ours" },
        question: "A car of {{m|mass}} 950 kg travels at 20 m s⁻¹. The brakes give a constant {{F|braking force}} of 6000 N. Calculate the {{braking}}.",
        steps: [
          "**Route 1, energy:** {{ke}} = ½ × 950 × 20² = 190 000 J. {{work}} by brakes = F × d, so d = 190 000 ÷ 6000 = **31.7 m**.",
          "**Route 2, SUVAT:** a = F ÷ m = 6000 ÷ 950 = 6.316… m s⁻² (deceleration; keep it in the calculator). {{u2-2a}} = 20² ÷ (2 × 6.316…) = **31.7 m**.",
        ],
        answer: "**31.7 m** (32 m to 2 s.f.).",
      },
      { type: "figure", figure: F.figEnergy },
      {
        type: "text",
        body: "**On a hill** the {{weight-comp}} joins in. Uphill it acts backwards with the brakes, so the car stops in a shorter distance. Downhill it acts forwards, against the brakes, so the braking distance is longer.",
      },
      {
        type: "sayIt",
        say: [
          "Uphill: ==a component of the weight is acting backwards== / ==greater resultant force down the slope==.",
          "So ==a smaller distance is required to do the same work== (transfer the same KE).",
        ],
        reject: ["An unqualified \"smaller distance\"."],
        source: "H556/01 June 2023 Q16(b)(ii) mark scheme",
      },
      {
        type: "examiners",
        body: "Say \"**component of weight parallel to the slope**\", not just \"an extra force\".",
        cite: "June 2023 H556/01 Q16(b)(ii)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "practical",
    heading: "Measuring stopping distances (PAG 1)",
    source: "spec-only",
    specRef: "3.1.2(a)(ii), 3.1.2(c)",
    blocks: [
      { type: "lead", body: "Two graphs you may be asked to plot. Both turn a curve into a straight line so the gradient and intercept mean something." },
      {
        type: "text",
        body: "**Block on a bench (PAG 01.3):** push a wooden block with a 10 cm card through a light gate; speed = 0.10 m ÷ time in the gate. Measure where it stops. Plot stopping distance against **speed²**: a straight line through the origin, because friction × distance = ½mv² (assuming constant friction).",
      },
      {
        type: "text",
        body: "**Car with a driver:** add the two parts. Thinking distance = vt, braking distance = v² ÷ 2a (a = size of the deceleration):",
      },
      {
        type: "equation",
        latexless: "d = vt + v² ÷ 2a",
        tex: "d = vt + \\dfrac{v^2}{2a}",
        words: "**stopping distance = speed × reaction time + speed² ÷ (2 × deceleration)**.",
        dataSheet: false,
      },
      {
        type: "equation",
        latexless: "d/v = t + v ÷ 2a",
        tex: "\\dfrac{d}{v} = t + \\dfrac{1}{2a}\\,v",
        words: "**Divide everything by speed.** Plot {{dv}} (y) against v (x): a straight line with {{intercept}} = reaction time {{t}} and gradient = 1 ÷ 2a.",
        general: "y = c + mx",
        generalTex: "y = c + mx",
        dataSheet: false,
      },
      { type: "figure", figure: F.figDv },
      {
        type: "text",
        body: "**Systematic error:** if every measured {{d}} is too big by the same amount (a zero error), each d/v is too big, so the intercept and the reaction time come out too large (H556/03 Specimen Q2(d)). On a stopping distance–v² graph the line shifts but its gradient is unchanged (H156/01 June 2016 Q22).",
      },
      {
        type: "sayIt",
        say: ["The ==gradient is determined from the graph== (gradient = 2a for a u² against x graph)."],
        reject: ["Using u²/x from one data point: \"the gradient is not determined\"."],
        source: "H156/01 June 2016 Q22(b) mark scheme",
      },
    ],
  },
];

export default sections;
