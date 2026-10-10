import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

const sections: Section[] = [
  {
    id: "what-is-acceleration",
    heading: "What acceleration means",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Acceleration tells you how quickly velocity changes. Get this one idea right and every graph and calculation in this topic follows." },
      {
        type: "text",
        body: "A cheetah can reach 26 m s⁻¹ and has an acceleration of up to 13 m s⁻² (Textbook p. 27). That means it can gain **13 m s⁻¹ of velocity every second**. Starting from rest, after 1 s it would be at 13 m s⁻¹, after 2 s at 26 m s⁻¹.",
      },
      { type: "figure", figure: F.figCheetah },
      {
        type: "text",
        body: "So [[acceleration]] is the ==rate of change of velocity==: the {{Dv|change in velocity}} divided by the {{Dt|time taken}} for that change.",
      },
      {
        type: "equation",
        latexless: "a = Δv / Δt",
        tex: "a = \\dfrac{\\Delta v}{\\Delta t}",
        words: "acceleration = change in velocity ÷ time taken",
        general: "v = u + at, rearranged: a = (v − u) / t (data sheet)",
        generalTex: "v = u + at \\;\\Rightarrow\\; a = \\dfrac{v - u}{t} \\text{ (data sheet)}",
        dataSheet: false,
        note: "{{a}} = acceleration, {{Delta}} = change in, {{Dv}} = {{vminusu}} ({{v}} final, {{u}} initial velocity), {{Dt}} or {{t}} = time taken. Cheetah: 26 ÷ 2 = 13 m s⁻². a = Δv/Δt itself is **not** on the data sheet; {{suvat}} is.",
      },
      {
        type: "list",
        items: [
          "**Unit:** {{ms2}}. It is {{ms1}} (velocity) ÷ s (time), so read 13 m s⁻² as \"13 m s⁻¹ gained per second\".",
          "**Vector:** acceleration has a direction, because velocity does. It is a {{vector}}.",
          "**Negative acceleration** (moving forwards but slowing down) is often called {{decel}}.",
        ],
      },
      {
        type: "sayIt",
        say: ["Acceleration is the ==rate of change of velocity==, or a = (v − u)/t **with the symbols defined**."],
        reject: ["\"rate of change of **speed**\"", "\"change in velocity **per second**\" (mixes a quantity with a unit)"],
        source: "OCR older-spec (G481) mark schemes, Set M2 Q3(a) and Q4(a); \"change in velocity per second\" is a wrong option in H156/01 June 2018 Q2",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "calculating-acceleration",
    heading: "Calculating acceleration",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Two numbers in, one out: change in velocity and time. The only traps are the sign and the units." },
      {
        type: "worked",
        title: "Bugatti: 0 to 100 km/h, then brakes",
        origin: { kind: "textbook", ref: "p. 27" },
        question: "**a** A Bugatti Veyron goes from rest to 100 km/h (27.8 m s⁻¹) in 2.46 s. Find its average acceleration. **b** It stops from 27.8 m s⁻¹ in 2.34 s. Find its acceleration, assuming it is constant.",
        steps: [
          "Convert first: {{kmh|100 km/h ÷ 3.6}} = 27.8 {{ms1}}.",
          "**a** {{Dv}} = 27.8 − 0 = 27.8 m s⁻¹, {{Dt}} = 2.46 s.",
          "{{a}} = 27.8 ÷ 2.46 = **11.3 m s⁻²**.",
          "**b** {{Dv}} = final − start = 0 − 27.8 = **−27.8** m s⁻¹, {{Dt}} = 2.34 s.",
          "{{a}} = −27.8 ÷ 2.34 = **−11.9 m s⁻²**. {{minus|The minus}} means the velocity is getting smaller: a {{decel}} of 11.9 m s⁻².",
        ],
        answer: "**a** 11.3 m s⁻² **b** −11.9 m s⁻² (deceleration 11.9 m s⁻²)",
      },
      { type: "figure", figure: F.figBugatti },
      {
        type: "warning",
        body: "The textbook prints **13.3 m s⁻²** for part a. That is a misprint: 27.8 ÷ 2.46 = 11.3 m s⁻² (checked against the page image). 11.3 also fits the text's claim that the cheetah's 13 m s⁻² beats the Bugatti.",
      },
      {
        type: "worked",
        title: "Cyclist and train",
        origin: { kind: "textbook", ref: "p. 28" },
        question: "**1** A cyclist starts from rest and reaches 8.0 m s⁻¹ after 12 s. Find the acceleration. **2** A train slows from 40 m s⁻¹ to 10 m s⁻¹ over 60 s. Find the {{magnitude}} of its deceleration.",
        steps: [
          "**1** {{Dv}} = 8.0 − 0 = 8.0 m s⁻¹; {{Dt}} = 12 s.",
          "{{a}} = 8.0 ÷ 12 = **0.67 m s⁻²**.",
          "**2** {{Dv}} = 10 − 40 = −30 m s⁻¹; {{Dt}} = 60 s.",
          "{{a}} = −30 ÷ 60 = −0.50 m s⁻². The question asks for the {{magnitude}}, so drop the sign: **0.50 m s⁻²**.",
        ],
        answer: "**1** 0.67 m s⁻² **2** 0.50 m s⁻²",
      },
      { type: "figure", figure: F.figCyclistTrain },
      {
        type: "warning",
        body: "{{Dv}} is always **final − initial**. Writing 40 − 10 for the train gives +0.50, which says \"speeding up\": the wrong physics, even if the size is right.",
      },
      {
        type: "sayIt",
        say: ["==Deceleration== is accepted in place of acceleration when the object is slowing down."],
        source: "H156/02 June 2025 Q1(c) (\"Allow deceleration for acceleration\")",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "gradient-of-vt",
    heading: "Acceleration from a velocity–time graph",
    source: "both",
    specRef: "3.1.1(d)",
    blocks: [
      { type: "lead", body: "On a {{vtgraph}} the steepness of the line **is** the acceleration. Exam questions test this more than any formula." },
      {
        type: "text",
        body: "On a v–t graph, going up the side is a change in velocity ({{Dv}}) and going along is a time ({{Dt}}). So {{rise}} ÷ {{run}} = Δv ÷ Δt = acceleration.",
      },
      {
        type: "equation",
        latexless: "a = gradient of v–t graph",
        tex: "a = \\text{gradient of } v\\text{–}t \\text{ graph} = \\dfrac{\\Delta v}{\\Delta t}",
        words: "acceleration = how steep the velocity–time line is (rise ÷ run)",
        general: "a = Δv / Δt",
        generalTex: "a = \\dfrac{\\Delta v}{\\Delta t}",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Two straight sections",
        origin: { kind: "textbook", ref: "p. 28" },
        question: "A v–t graph rises in a straight line from 0 to 2.0 m s⁻¹ in the first 1.0 s, then in a shallower straight line to 3.0 m s⁻¹ at 3.0 s. Find the maximum acceleration.",
        steps: [
          "Section 1: {{rise}} = 2.0 − 0 = 2.0 m s⁻¹, {{run}} = 1.0 s. {{grad|Gradient}} = 2.0 ÷ 1.0 = **2.0 m s⁻²**.",
          "Section 2: rise = 3.0 − 2.0 = 1.0 m s⁻¹, run = 3.0 − 1.0 = 2.0 s. Gradient = 1.0 ÷ 2.0 = **0.50 m s⁻²**.",
          "The steeper section has the bigger {{a}}, so the maximum is in the first second.",
        ],
        answer: "Maximum acceleration = **2.0 m s⁻²** (0 to 1.0 s), because that section has the steepest gradient.",
      },
      { type: "figure", figure: F.figFig5 },
      {
        type: "text",
        body: "**Curved line?** The acceleration is changing. To find it at one moment (the {{instant}}), draw a {{tangent}} at that time and find _its_ gradient.",
      },
      {
        type: "worked",
        title: "Tangent on a curve",
        origin: { kind: "ours" },
        question: "A car's v–t graph is a curve. At t = 4.0 s, v = 12 m s⁻¹. A tangent drawn there passes through (0, 4 m s⁻¹) and (10.0 s, 24 m s⁻¹). Find the acceleration at t = 4.0 s.",
        steps: [
          "Draw the {{tangent}} touching the curve at t = 4.0 s only. Make it long.",
          "{{rise}} of the tangent = 24 − 4 = 20 m s⁻¹.",
          "{{run}} = 10.0 − 0 = 10.0 s.",
          "{{a}} = 20 ÷ 10.0 = **2.0 m s⁻²**.",
        ],
        answer: "2.0 m s⁻² at t = 4.0 s",
      },
      { type: "figure", figure: F.figTangent },
      {
        type: "sayIt",
        say: ["==Tangent drawn at== the stated time (M1), then ==change in y / change in x== (A1)."],
        source: "H556/01 June 2025 Q16(a)(ii)",
      },
      {
        type: "examiners",
        body: "A tangent that was too steep, too shallow or didn't touch the curve at the stated time limited candidates to 1 mark. On an earlier tangent question about a quarter drew it at the wrong time.",
        cite: "H556/01 June 2025 Q16(a)(ii); H156/01 June 2019 Q22(c)",
      },
      {
        type: "examiners",
        body: "Make the tangent cover as much of the graph as possible, and read the gradient from points **on the line**, not from a table of data.",
        cite: "H156/02 June 2022 Q1(d)(ii)",
      },
      {
        type: "warning",
        body: "Don't divide one reading by its time (v ÷ t) off a curve. That gives an {{average}} from t = 0, not the acceleration at that instant.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "reading-vt-shapes",
    heading: "Reading the shape of a v–t graph",
    source: "both",
    specRef: "3.1.1(b), 3.1.1(d)",
    blocks: [
      { type: "lead", body: "Four shapes cover almost every v–t graph you'll meet. Learn to say what each one means." },
      { type: "figure", figure: F.figShapes },
      {
        type: "list",
        items: [
          "**Straight, sloping up:** same gradient all the way, so constant {{a}}.",
          "**Flat:** gradient 0, so zero acceleration. The object is moving at constant velocity (not stopped, unless the line is at v = 0).",
          "**Straight, sloping down:** constant negative gradient, so constant {{decel}}.",
          "**Curve:** the gradient changes, so the acceleration changes. Getting flatter = acceleration decreasing.",
        ],
      },
      {
        type: "text",
        body: "Two you'll be asked about: a dropped object with no air resistance gives a **straight line through the origin** with gradient {{g}} = 9.81 m s⁻². With air resistance the line starts with gradient 9.81 m s⁻² and curves over until it is flat at {{terminal}}.",
      },
      {
        type: "sayIt",
        say: [
          "Deceleration is shown by the ==negative gradient==; a straight line / ==constant negative gradient== shows constant deceleration.",
          "For a curve: ==the (magnitude of the) gradient decreases==.",
        ],
        reject: ["\"the gradient is smaller / less steep / shallower\" when describing how a curve changes"],
        source: "H156/02 June 2018 Q1(a); H156/02 June 2019 Q1(c)",
      },
      {
        type: "examiners",
        body: "Candidates mixed up displacement–time and velocity–time graphs, e.g. sketching a falling ball as if it had constant velocity. Check the y-axis label first.",
        cite: "H156/01 June 2024 Q24(e)",
      },
      {
        type: "warning",
        body: "On a v–t graph the **height** is velocity and the **gradient** is acceleration. A high, flat line means fast but **not** accelerating.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "acceleration-time-graphs",
    heading: "Acceleration–time graphs",
    source: "both",
    specRef: "3.1.1(b)",
    blocks: [
      { type: "lead", body: "Turn a v–t graph into an a–t graph by plotting its gradient against time." },
      {
        type: "worked",
        title: "Sketch the a–t graph",
        origin: { kind: "textbook", ref: "p. 28" },
        question: "Sketch the {{atgraph}} from t = 0 to 3.0 s for the two-section v–t graph above.",
        steps: [
          "0 to 1.0 s: {{grad|gradient}} = 2.0 m s⁻², the same all section, so a flat line at **2.0**.",
          "1.0 to 3.0 s: gradient = 0.50 m s⁻², so a flat line at **0.50**.",
          "The step happens at 1.0 s, where the v–t line bends.",
        ],
        answer: "A flat line at 2.0 m s⁻² for 0–1.0 s, dropping to a flat line at 0.50 m s⁻² for 1.0–3.0 s.",
      },
      { type: "figure", figure: F.figAT },
      {
        type: "tip",
        body: "Straight v–t section → flat a–t line. Flat v–t section → a–t line on zero. Sloping down → a–t line below zero.",
      },
    ],
  },
];

export default sections;
