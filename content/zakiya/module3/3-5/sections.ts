import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

const sections: Section[] = [
  // ------------------------------------------------------------------
  {
    id: "five-letters",
    heading: "Five letters: s, u, v, a, t",
    source: "both",
    specRef: "3.1.2(a)(i)",
    blocks: [
      {
        type: "lead",
        body: "Every motion question in this topic is described by the same five quantities. Learn the letters first; the equations are just links between them.",
      },
      {
        type: "text",
        body: "A car starts from rest and reaches 12 m s⁻¹ after 9.0 s. How hard did it accelerate, and how far did it go? You can answer both without a graph, using the [[equations of motion]].",
      },
      {
        type: "list",
        items: [
          "{{s}}: how far it went, in a straight line (here ?, answer 54 m).",
          "{{u}}: how fast it was going at the start (here 0, because it starts from rest).",
          "{{v}}: how fast it was going at the end (here 12 m s⁻¹).",
          "{{a}}: how much the velocity grows each second (here ?, answer 1.33 m s⁻²).",
          "{{t}}: how long it took (here 9.0 s).",
        ],
      },
      { type: "figure", figure: F.figCar },
      {
        type: "text",
        body: "Together they are called the {{suvat}} equations. They only work when two things are true: the motion is in a **straight line**, and the acceleration is **constant** (the same all the time). A {{v-t-graph|velocity–time graph}} for this kind of motion is a straight line.",
      },
      {
        type: "warning",
        body: "If the acceleration changes (a car that speeds up less and less, anything with air resistance that matters), the suvat equations do not apply. Use the graph instead: {{gradient}} for acceleration, {{area}} for distance.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "where-from",
    heading: "Where the four equations come from",
    source: "textbook-only",
    specRef: "3.1.2(a)(i)",
    blocks: [
      {
        type: "lead",
        body: "All four equations come from one straight-line velocity–time graph. Seeing that makes them easier to remember and to trust.",
      },
      {
        type: "text",
        body: "A particle speeds up from 4.0 m s⁻¹ to 12 m s⁻¹ in 2.0 s. On a velocity–time graph that is a straight line from 4.0 up to 12.",
      },
      { type: "figure", figure: F.figDerive },
      {
        type: "text",
        body: "**1. Slope.** It gains 12 − 4.0 = 8.0 m s⁻¹ in 2.0 s, so {{a}} = 8.0 ÷ 2.0 = 4.0 m s⁻². In words: end speed = start speed + (gain per second × seconds).",
      },
      {
        type: "equation",
        latexless: "v = u + at",
        tex: "v = u + at",
        words: "**final velocity = initial velocity + acceleration × time**. 12 = 4.0 + 4.0 × 2.0.",
        general: "a = (v − u) ÷ t, rearranged",
        generalTex: "a = \\dfrac{v - u}{t} \\text{, rearranged}",
        note: "Has no {{s}}.",
        dataSheet: true,
      },
      {
        type: "text",
        body: "**2. Area = rectangle + triangle.** Rectangle: 4.0 × 2.0 = 8 m ({{ut}}). Triangle: ½ × 8.0 × 2.0 = 8 m ({{half-v-u-t}}). Since v − u = at, the triangle is ½ × at × t. Total: 16 m.",
      },
      {
        type: "equation",
        latexless: "s = ut + ½at²",
        tex: "s = ut + \\tfrac{1}{2}at^2",
        words: "**distance = (start speed × time) + ½ × acceleration × time²**. 16 = 4.0 × 2.0 + ½ × 4.0 × 2.0².",
        general: "area under the v–t graph = rectangle + triangle",
        generalTex: "\\text{area under the } v\\text{–}t \\text{ graph} = \\text{rectangle} + \\text{triangle}",
        note: "Has no {{v}}.",
        dataSheet: true,
      },
      {
        type: "text",
        body: "**3. Area as a trapezium.** The same shape is a trapezium with parallel sides 4.0 and 12: ½ × (4.0 + 12) × 2.0 = 16 m. In words, the {{average-velocity|average velocity}} (8.0 m s⁻¹) × time.",
      },
      {
        type: "equation",
        latexless: "s = ½(u + v)t",
        tex: "s = \\tfrac{1}{2}(u + v)t",
        words: "**distance = average of start and end speeds × time**. 16 = ½ × (4.0 + 12) × 2.0.",
        general: "distance = average velocity × time",
        generalTex: "\\text{distance} = \\text{average velocity} \\times \\text{time}",
        note: "Has no {{a}}.",
        dataSheet: true,
      },
      {
        type: "text",
        body: "**4. Remove the time.** Put t = (v − u) ÷ a from equation 1 into equation 3 and tidy up. Check: 12² = 144 and 4.0² + 2 × 4.0 × 16 = 16 + 128 = 144. ✓",
      },
      {
        type: "equation",
        latexless: "v² = u² + 2as",
        tex: "v^2 = u^2 + 2as",
        words: "**end speed² = start speed² + 2 × acceleration × distance**. 12² = 4.0² + 2 × 4.0 × 16.",
        general: "s = ½(u + v)t with t = (v − u) ÷ a",
        generalTex: "s = \\tfrac{1}{2}(u + v)t \\text{ with } t = \\dfrac{v - u}{a}",
        note: "Has no {{t}}.",
        dataSheet: true,
      },
      {
        type: "text",
        body: "The textbook mentions a fifth, {{s-vt|s = vt − ½at²}} (no {{u}}). It is not on the data sheet and no current OCR question has needed it.",
      },
      {
        type: "tip",
        body: "All four are on the data sheet, so you don't need to memorise them. You do need to know the conditions (straight line, constant acceleration) and which letter each one leaves out.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "choosing",
    heading: "Picking the right equation",
    source: "both",
    specRef: "3.1.2(a)(i)",
    blocks: [
      {
        type: "lead",
        body: "One routine solves every suvat question: list the five letters, then use the equation that leaves out the one you don't care about.",
      },
      { type: "figure", figure: F.figChooser },
      {
        type: "list",
        items: [
          "**Write s, u, v, a, t** down the side of the page and fill in what you know, with units.",
          "**Put ? by the one you want.** One letter is left blank: you neither know nor need it.",
          "**Use the equation without that letter.** Substitute numbers, then rearrange.",
        ],
      },
      {
        type: "worked",
        title: "Car accelerating from rest (Textbook p. 33)",
        origin: { kind: "textbook", ref: "p. 33" },
        question: "A car on a straight road accelerates from rest to 12 m s⁻¹ in 9.0 s. Calculate its acceleration and the distance travelled.",
        steps: [
          "**List:** {{s}} = ?, {{u}} = 0, {{v}} = 12 m s⁻¹, {{a}} = ?, {{t}} = 9.0 s.",
          "**Acceleration:** s is not needed, so use the equation without s: v = u + at. 12 = 0 + a × 9.0.",
          "a = 12 ÷ 9.0 = **1.33 m s⁻²**. Each second, the car gains 1.33 m s⁻¹.",
          "**Distance:** use the equation without a (so a rounding slip in a can't spread): s = ½(u + v)t = ½ × (0 + 12) × 9.0 = **54 m**.",
        ],
        answer: "**a = 1.33 m s⁻²**, **s = 54 m**. Average speed 6 m s⁻¹ for 9.0 s.",
      },
      {
        type: "worked",
        title: "Particle speeding up (Textbook p. 33)",
        origin: { kind: "textbook", ref: "p. 33" },
        question: "A particle travels 16 m while it accelerates from 4.0 m s⁻¹ to 12 m s⁻¹. Calculate its acceleration.",
        steps: [
          "**List:** {{s}} = 16 m, {{u}} = 4.0 m s⁻¹, {{v}} = 12 m s⁻¹, {{a}} = ?, {{t}} = not given, not wanted.",
          "No t, so use the equation without t: v² = u² + 2as.",
          "12² = 4.0² + 2 × a × 16 → 144 = 16 + 32a.",
          "a = (144 − 16) ÷ 32 = **4.0 m s⁻²**.",
        ],
        answer: "**a = 4.0 m s⁻²**. (The graph above is this particle: it takes 2.0 s.)",
      },
      { type: "figure", figure: F.figDerive },
      {
        type: "examiners",
        body: "On the trolley-on-a-ramp calculation, examiners showed a grade E answer as **flawless technique**: known and unknown quantities listed on the left, then the equation, then the substitution, then the answer. Most candidates used v² = u² + 2as.",
        cite: "June 2018 H156/01 Q21(b)(i)",
      },
      {
        type: "sayIt",
        say: [
          "Write the equation, then the substitution with numbers, e.g. ==2.5² = 1.3² + 2 × 1.10 × a==, then the answer to the same s.f. as the data.",
        ],
        reject: ["A bare answer: a slip with no working shown scores nothing."],
        source: "H156/01 June 2018 Q21(b)(i) mark scheme (C1 substitution, A1 answer)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "signs",
    heading: "Signs: slowing down and going up",
    source: "both",
    specRef: "3.1.2(a)(i)",
    blocks: [
      {
        type: "lead",
        body: "s, u, v and a are vectors, so direction matters. Pick one direction as positive and stick to it; slowing down then shows up as a negative a.",
      },
      {
        type: "text",
        body: "Flick a paper clip straight up at 6.0 m s⁻¹. It slows by 9.81 m s⁻¹ every second, stops for an instant at the top, then falls back. Take **up as positive**: then {{u}} = +6.0 m s⁻¹ but gravity's {{a}} = {{minus-g|−9.81 m s⁻²}}, because gravity points down.",
      },
      { type: "figure", figure: F.figClip },
      {
        type: "worked",
        title: "What goes up (Textbook p. 34)",
        origin: { kind: "textbook", ref: "p. 34" },
        question: "A paper clip is flicked vertically up at 6.0 m s⁻¹. Calculate its maximum height. Ignore air resistance.",
        steps: [
          "**Up is positive.** It is slowing down, so {{a}} must be negative: a = −9.81 m s⁻².",
          "At the top it stops for an instant, so {{v}} = 0. That is the hidden value in every 'maximum height' question.",
          "**List:** {{s}} = ?, {{u}} = 6.0 m s⁻¹, v = 0, a = −9.81 m s⁻², {{t}} not wanted → use v² = u² + 2as.",
          "0 = 6.0² + 2 × (−9.81) × s → $s = \\dfrac{-6.0^2}{2 \\times (-9.81)} = \\dfrac{36}{19.62}$ = **1.83 m**.",
        ],
        answer: "Maximum height **1.83 m**, or **1.8 m** to 2 s.f. to match the data.",
      },
      {
        type: "warning",
        body: "Mixed signs give nonsense. With a = +9.81 here you get s = −1.83 m: the clip would rise to below its starting point. A negative answer you didn't expect means a sign is wrong.",
      },
      {
        type: "list",
        items: [
          "**Slowing down** in the positive direction: a is negative. Questions may say {{deceleration}} of 4.0 m s⁻²; you write a = −4.0 m s⁻².",
          "**At maximum height:** v = 0 (but a is still −9.81 m s⁻²).",
          "**Back at the start:** s = 0, and v = −u (same speed, now downwards).",
        ],
      },
      {
        type: "examiners",
        body: "A ball hits the ground at 4.9 m s⁻¹ and bounces up at 3.5 m s⁻¹. The change in velocity is 4.9 + 3.5 = 8.4 m s⁻¹, not 4.9 − 3.5. The correct force (260 N) eluded even many top candidates because they ignored that velocity is a vector.",
        cite: "June 2019 H156/01 Q22(d)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "falling",
    heading: "Falling objects",
    source: "both",
    specRef: "3.1.2(a)(i)",
    blocks: [
      {
        type: "lead",
        body: "A dropped object is the most common suvat question: u = 0 and a = 9.81 m s⁻², so only s, v and t are left to find.",
      },
      {
        type: "text",
        body: "Without air resistance, everything falls with the same constant acceleration {{g}} = 9.81 m s⁻² (on the data sheet). Constant acceleration in a straight line: suvat applies.",
      },
      {
        type: "worked",
        title: "Falling apple (Textbook p. 33–34)",
        origin: { kind: "textbook", ref: "p. 33–34" },
        question: "An apple falls from rest from a height of 1.50 m. Calculate the time it takes to reach the ground. Ignore air resistance.",
        steps: [
          "**Down is positive** (it only moves down). **List:** {{s}} = 1.50 m, {{u}} = 0, {{a}} = 9.81 m s⁻², {{t}} = ?, {{v}} not wanted.",
          "Use the equation without v: s = ut + ½at².",
          "1.50 = (0 × t) + ½ × 9.81 × t². Note {{zero-t|0 × t = 0}}, not t.",
          "$t^2 = \\dfrac{2 \\times 1.50}{9.81} = 0.306$, so $t = \\sqrt{0.306}$ = **0.553 s**.",
        ],
        answer: "**0.553 s**. With u = 0 the equation is just s = ½at².",
      },
      { type: "figure", figure: F.figApple },
      {
        type: "equation",
        latexless: "t = √(2s ÷ a)",
        tex: "t = \\sqrt{\\dfrac{2s}{a}}",
        words: "**time to cover s from rest = √(2 × distance ÷ acceleration)**. Apple: √(2 × 1.50 ÷ 9.81) = 0.553 s.",
        general: "s = ut + ½at² with u = 0",
        generalTex: "s = ut + \\tfrac{1}{2}at^2 \\text{ with } u = 0",
        dataSheet: false,
      },
      {
        type: "warning",
        body: "Use the distance it **actually falls**. 'Released from 4.5 m, speed when 2.5 m above the ground' means s = 2.0 m. A ball whose bottom is 10.2 cm above the floor falls 10.2 cm, not 10.2 cm + its diameter. Real MCQs put both wrong distances in as options.",
      },
      {
        type: "examiners",
        body: "For a lift accelerating at 2.4 m s⁻², some candidates were confused about when to use 2.4 m s⁻² and when to use 9.81 m s⁻². In suvat, **a is the acceleration of the thing that is moving**; using 9.81 for the lift was marked as wrong physics.",
        cite: "June 2025 H156/01 Q21(b)(ii) (examiners' report and mark scheme)",
      },
      {
        type: "examiners",
        body: "Use the data-sheet value: candidates should use 9.81 m s⁻², not 10 m s⁻², for the acceleration of free fall.",
        cite: "June 2025 H156/01 Q21(b)(i)",
      },
      {
        type: "tip",
        body: "Sketch the drop with the heights marked before you pick s. Ten seconds of drawing stops the 'wrong distance' trap.",
      },
    ],
  },
];

export default sections;
