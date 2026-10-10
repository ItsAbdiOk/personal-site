import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";
import * as C from "./figures-c";

const sections: Section[] = [
    {
      id: "different-heights",
      heading: "Launched and landing at different heights",
      source: "spec-only",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "Next: a ball thrown **up at an angle off a cliff**, so it lands lower than it started. Exams love this, and the flat-ground shortcuts stop working.",
        },
        {
          type: "text",
          body: "Picture it: you throw a stone at 12 m s⁻¹, 30° above flat, from a cliff top 20 m above the sea. It rises a little, then falls past your feet and all the way down to the water. The textbook only covers sideways launches and flat-ground launches. Here the way up and the way down are **not** mirror images, so the \"double the time to the top\" trick fails.",
        },
        {
          type: "text",
          body: "**The fix:** treat the whole flight in one go. Pick **up as positive** ({{signconv|sign convention}}). The sea is 20 m **below** where the stone started, so its vertical {{s}} at landing is **−20 m**, not +20. Down is negative because we chose up as positive. Gravity pulls down, so {{a}} = −9.81 m s⁻².",
        },
        {
          type: "equation",
          latexless: "s = uy t − ½ g t²",
          words: "Vertical displacement = starting upward speed × time, minus half of g × time squared.",
          general: "s = ut + ½at²  (with u = u sin θ and a = −g)",
          dataSheet: true,
          note: "Put s = −(cliff height). This gives a {{quadratic}} in t, solved with the {{quadformula|quadratic formula}}.",
        },
        { type: "figure", figure: C.figCliffLaunch },
        { type: "figure", figure: C.figCliffBefore },
        {
          type: "worked",
          title: "Stone thrown from a cliff",
          origin: { kind: "ours" },
          question:
            "A stone is thrown at 12 m s⁻¹ at 30° **above** the horizontal from the top of a cliff 20 m above the sea. Ignore air resistance. Find the time to reach the sea and how far out it lands.",
          steps: [
            "**Split the speed into sideways and upward parts** (each direction only gets its own part): {{ux}} = 12 {{cos}} 30° = 10.39 m s⁻¹; {{uy}} = 12 {{sin}} 30° = 6.00 m s⁻¹",
            "**List the vertical values, up positive:** u = +6.00 m s⁻¹, a = −9.81 m s⁻², s = **−20** m (negative because the sea is _below_ the launch point)",
            "**Choose the SUVAT equation with s, u, a and t** (the time is what we want): s = ut + ½at^2^ → −20 = 6.00t − 4.905t^2^",
            "**Move everything to one side** so it equals zero: 4.905t^2^ − 6.00t − 20 = 0",
            "**Use the quadratic formula** with a = 4.905, b = −6.00, c = −20: t = [6.00 + √(36.0 + 392.4)] ÷ 9.81 = (6.00 + 20.70) ÷ 9.81 = **2.72 s**. The other answer is negative ({{negroot|a time before the throw}}), so reject it.",
            "**Sideways part uses the same time** (sideways speed never changes): x = {{ux}} × t = 10.39 × 2.721 = **28.3 m**",
          ],
          answer: "It hits the sea after **2.7 s**, **28 m** from the foot of the cliff.",
        },
        { type: "figure", figure: C.figCliffAfter },
        {
          type: "text",
          body: "**No-quadratic alternative:** split the flight in two. (1) Up to the top: 6.00 ÷ 9.81 = 0.612 s, rising 1.83 m. (2) From the top it falls from rest through 20 + 1.83 = 21.83 m, which takes 2.110 s. Total 0.612 + 2.110 = 2.72 s. Same answer, just more steps.",
        },
        { type: "figure", figure: C.figCliffSplit },
        {
          type: "warning",
          body: "If you forget the minus sign on s (−20 m), you get no real answer or a nonsense time. Sketch the launch point and landing point and mark which is lower.",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "air-resistance",
      heading: "Exam extra: what air resistance changes",
      source: "spec-only",
      specRef: "3.2.2(a)–(c)",
      blocks: [
        {
          type: "lead",
          body: "Everything so far ignored air. Real balls fall short, and exams ask you to say **how** and **why**.",
        },
        {
          type: "text",
          body: "Think of a football kicked hard: it never goes as far as the ideal sum says, and it drops more steeply at the end. The textbook just says \"ignore air resistance\". But the spec covers {{drag}} in 3.2.2, and exam questions ask you to compare a real path with the ideal one.",
        },
        {
          type: "figure",
          figure: {
            kind: "svg",
            svg: F.svgDrag,
            alt: "Two paths from the same launch point with the same launch speed and angle. A dashed symmetric curve labelled no air resistance reaches higher and lands further away. A solid lower, shorter curve labelled with air resistance peaks earlier, comes down more steeply and lands closer. Dots mark each highest point. An arrow labelled drag points backwards along the solid path.",
            caption: "Same throw, two outcomes: with air, it peaks sooner, lower, and lands closer.",
          },
        },
        {
          type: "list",
          items: [
            "Drag acts **opposite to the velocity** (backwards along the path), so it has a sideways part **and** an up/down part.",
            "Sideways: {{vx}} now **decreases**, so the range (how far it lands) is **shorter**.",
            "On the way up: drag points down too, adding to the weight, so it slows faster → **lower maximum height**.",
            "On the way down: drag points up, against the weight → downward acceleration **less than {{g}}**.",
            "Path is **not symmetric**: the highest point is closer to the landing point, and the descent is **steeper**.",
          ],
        },
        { type: "figure", figure: C.figDragForces },
        {
          type: "examiners",
          body: "{{resultant-force|Resultant force}} on a ball in flight with small drag: add weight (down) and drag (opposite the velocity) **as vectors**. The popular wrong answers pointed along the motion.",
          cite: "June 2018 H156/01 Q3",
        },
        {
          type: "sayIt",
          say: [
            "Sketch with drag: the path is ==always below the original path==, and the ==maximum height is reached sooner== (at a smaller horizontal distance).",
            "Real vs calculated range: the ==actual distance is smaller== because ==air resistance (drag)== makes the speed in flight smaller.",
          ],
          reject: ["\"less efficient\" or energy \"lost\" without saying how (ignored)"],
          source: "H156/02 June 2016 Q3(c); H556/01 June 2022 Q16(b)(iv)",
        },
        {
          type: "text",
          body: "If something must keep a constant sideways velocity **despite** drag (e.g. an aircraft flying a projectile-shaped path), its engines must push forwards with {{thrust}}.",
        },
        {
          type: "equation",
          latexless: "thrust − drag = 0",
          words: "The forward push from the engines exactly cancels the backward drag, so there's no overall sideways force and the sideways speed stays the same.",
          general: "F = ma, with a = 0 sideways",
          dataSheet: false,
        },
        { type: "figure", figure: C.figThrustDrag },
        {
          type: "sayIt",
          say: ["The engines provide thrust so that ==thrust equals drag==, giving ==zero horizontal net force==."],
          reject: ["\"balanced forces\" (not specific enough: which forces, which direction?)"],
          source: "H556/01 June 2025 Q17(a)(iv), mark scheme and examiners' report",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "practical",
      heading: "Seeing it in the lab",
      source: "spec-only",
      specRef: "3.1.2(a)(ii) PAG1",
      blocks: [
        {
          type: "lead",
          body: "How you'd actually **measure** a projectile in class. Exams ask you to describe the method, and it's 6 easy marks if you cover every step.",
        },
        {
          type: "text",
          body: "Example: a marble rolls off a desk and you film it at 30 frames per second. Frame 15 is 15 ÷ 30 = 0.5 s after it left the edge. Measure where it is in each frame against a ruler behind it, and you have x, y and t. The textbook shows a multiple-flash photo but not how to get one. The spec's practical skills ({{pag1|PAG1}}, which lists **video techniques** and {{datalogger|data-loggers}}) mean you could be asked to describe the method.",
        },
        { type: "figure", figure: C.figVideoFrames },
        {
          type: "list",
          items: [
            "Roll a small dense ball off a ramp so it leaves the edge horizontally, in front of a metre rule or grid.",
            "Film with a camera on a tripod, **perpendicular** to the plane of motion (pointing straight at it, side-on) and far back to reduce {{parallax}}. Know the {{framerate|frame rate}}.",
            "Go frame by frame: record x and y of the ball; time = frame number ÷ frame rate.",
            "**x against t** is a straight line → {{vx}} constant.",
            "**y against t^2^** is a straight line through the origin, {{gradient}} = g ÷ 2 (from s = ½gt^2^).",
            "Drop a second ball at the same moment: same y at every frame → {{independence|independence}} of sideways and vertical motion.",
            "Timing with {{lightgate|light gates}}? Say they are ==connected to a timer or data-logger==.",
          ],
        },
        {
          type: "equation",
          latexless: "y = ½ g t²",
          words: "Distance fallen = half of g × time squared. So plotting y against t² gives a straight line with gradient g ÷ 2: double the gradient to get g.",
          general: "s = ut + ½at²  (with u = 0 vertically and a = g, down positive)",
          dataSheet: true,
          note: "The textbook's chapter 3 practice question 3 (Textbook p. 44–45) uses this same s against t² graph for a dropped ball to find g.",
        },
        { type: "figure", figure: C.figYvsT2 },
        {
          type: "sayIt",
          say: ["Predict a graph that is a ==straight line through the origin== (e.g. range x against launch speed v) and **say so**."],
          source: "H556/01 June 2018 Q16(b); H156/02 November 2020 Q4",
        },
        {
          type: "examiners",
          body: "Too many did not mention the line passing **through the origin**, which held them at a high Level 1 or low Level 2. Some described the time of flight instead of how x depends on v.",
          cite: "June 2018 H556/01 Q16(b)",
        },
        {
          type: "examiners",
          body: "Expected: how the horizontal surface is supported, how the ball is released (curved slope or spring), how its launch speed is measured, a rule for the range, repeats and averages, and safety. Good answers marked the landing point with sand or paint.",
          cite: "Autumn 2020 H156/02 Q4",
        },
        {
          type: "tip",
          body: "In a 6-mark {{lor|Level of Response}} question, cover **every strand** the question names (method, measurements, analysis, safety) under short headings. A missing strand usually caps you at Level 2, however good the rest is.",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "weightless",
      heading: "Exam extra: \"weightless\" in a projectile",
      source: "spec-only",
      blocks: [
        {
          type: "lead",
          body: "Why people float in a diving plane, and the exact words that get the marks (the obvious answers lose them).",
        },
        {
          type: "text",
          body: "Imagine you're in a lift and the cable snaps: you and the lift both fall at 9.81 m s⁻² together, so the floor stops pressing on your feet and you float. Passengers in an aircraft flying a projectile path (or anything inside a thrown box) are the same: they fall **with** it. Everything has the same acceleration {{g}}, so the floor does not need to push on them: they feel {{weightless}}. Gravity has not switched off.",
        },
        { type: "figure", figure: C.figWeightless },
        {
          type: "sayIt",
          say: [
            "Aircraft and passengers have the ==same acceleration (g)==.",
            "There is ==no {{contact|contact force}}== on the passenger from the seat or floor.",
          ],
          reject: ["\"there are no forces on the passenger\"", "\"there is no gravity\" / \"gravity is too weak\"", "\"there is no resultant force\""],
          source: "H556/01 June 2025 Q17(b)(ii); H556/03 November 2020 Q4(a)",
        },
        {
          type: "examiners",
          body: "Feeling weightless is not the same as being in {{freefall|free fall}}. Common wrong answers: \"weightless because he is falling\", \"no resultant force\", \"no gravity in a vacuum\".",
          cite: "Autumn 2020 H556/03 Q4(a)",
        },
      ],
    },
];

export default sections;
