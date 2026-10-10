import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

// All numbers recomputed in Python with g = 9.81 m s⁻².
const sections: Section[] = [
  {
    id: "what-is-free-fall",
    heading: "What is free fall?",
    source: "both",
    specRef: "3.1.2(b)(i)",
    blocks: [
      { type: "lead", body: "Pin down what \"free fall\" means and the one number that runs it: {{g}} = 9.81 m s⁻²." },
      {
        type: "text",
        body: "Let go of a ball. After 1 s it's moving at 9.81 m/s; after 2 s, 19.6 m/s; after 3 s, 29.4 m/s. It gains the **same 9.81 m/s every second**. That steady gain is the [[acceleration of free fall]], {{g}}.",
      },
      { type: "figure", figure: F.figDropEachSecond },
      {
        type: "text",
        body: "An object is in [[free fall]] when it is accelerating under gravity with **no other force** acting on it. So no {{air-res|air resistance}}. Its only force is its {{weight}}, which points down towards the centre of the Earth.",
      },
      {
        type: "list",
        items: [
          "{{g}} is an acceleration, so its unit is **m s⁻²**. 9.81 m s⁻² is on the data sheet as a constant.",
          "Heavy or light, everything in free fall has the **same acceleration**: {{mass-cancels|the mass cancels}}. A 2 kg ball has twice the weight of a 1 kg ball but needs twice the force to speed up.",
          "Real objects only get close to free fall when air resistance is tiny: a heavy, small, dense ball over a short drop.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "g-varies",
    heading: "Is g always 9.81?",
    source: "textbook-only",
    blocks: [
      { type: "lead", body: "9.81 is a standard value, not a law of nature. It changes a little from place to place." },
      {
        type: "text",
        body: "{{g}} depends on height above sea level, latitude and the rocks underneath. It is **9.825 m s⁻²** in Helsinki, **9.816 m s⁻²** in London and only **9.776 m s⁻²** in Singapore. Exams use **9.81 m s⁻²**.",
      },
      {
        type: "text",
        body: "Felix Baumgartner jumped from 39.0 km up in 2012 and hit **380 m/s after about 50 s**. In true free fall he'd have reached 9.81 × 50 = 490 m/s. Even very thin air pushed back: on average he gained only 380 ÷ 50 = **7.6 m/s each second**.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "suvat-for-falling",
    heading: "SUVAT for falling objects",
    source: "both",
    specRef: "3.1.2(a)(i)",
    blocks: [
      { type: "lead", body: "A falling object has constant acceleration, so the {{suvat}} equations from 3.5 work with {{a}} = {{g}}." },
      {
        type: "list",
        items: [
          "**Dropped** (let go, not thrown): {{u}} = 0.",
          "**Acceleration**: {{a}} = 9.81 m s⁻². Pick a direction as positive and stick to it. For a drop, down = + is easiest. For a throw upwards, {{up-positive}} and a = −9.81 m s⁻².",
          "Thrown straight up: {{v-zero-top}}.",
        ],
      },
      {
        type: "text",
        body: "Dropped from rest, the ball falls 4.91 m in the first second: ½ × 9.81 × 1². After 2 s it has fallen ½ × 9.81 × 2² = 19.6 m: double the time, **four times** the distance.",
      },
      {
        type: "equation",
        latexless: "s = ½gt²",
        tex: "s = \\tfrac{1}{2}gt^2",
        words: "**distance fallen = ½ × 9.81 × time²** (dropped from rest).",
        general: "s = ut + ½at² with u = 0, a = g",
        generalTex: "s = ut + \\tfrac{1}{2}at^2 \\text{ with } u = 0,\\ a = g",
        dataSheet: false,
      },
      {
        type: "equation",
        latexless: "v = gt",
        tex: "v = gt",
        words: "**speed after falling = 9.81 × time**. 2 s of falling gives 19.6 m/s.",
        general: "v = u + at with u = 0, a = g",
        generalTex: "v = u + at \\text{ with } u = 0,\\ a = g",
        dataSheet: false,
      },
      {
        type: "equation",
        latexless: "v² = 2gh",
        tex: "v^2 = 2gh",
        words: "**speed² at the bottom = 2 × 9.81 × height**. A 2.0 m drop: v = √(2 × 9.81 × 2.0) = 6.3 m/s.",
        general: "v² = u² + 2as with u = 0, a = g, s = h",
        generalTex: "v^2 = u^2 + 2as \\text{ with } u = 0,\\ a = g,\\ s = h",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Marble dropped for 2.3 s (Textbook p. 39, Q2)",
        origin: { kind: "textbook", ref: "p. 39" },
        question: "A marble is dropped from a height {{h|H}}. It lands 2.3 s later. Calculate H. Use {{g}} = 9.81 m s⁻².",
        steps: [
          "**List what you know** (down positive): {{u}} = 0 (dropped), {{a}} = 9.81 m s⁻², {{t}} = 2.3 s, {{s}} = H = ?",
          "Pick the equation with s, u, a and t: s = ut + ½at². With u = 0 it's {{half-g-t2|s = ½gt²}}.",
          "Substitute: H = ½ × 9.81 × 2.3² = ½ × 9.81 × 5.29 = 25.947 m.",
        ],
        answer: "25.947 ≈ **H = 26 m** (2 s.f., matching the 2.3 s). The book prints no answer; checked in Python.",
      },
      { type: "figure", figure: F.figMarble },
      {
        type: "worked",
        title: "Ball thrown straight up at 12 m/s",
        origin: { kind: "ours" },
        question: "A ball is thrown vertically upwards at 12 m/s. Ignore air resistance. Find (a) its maximum height, (b) the time to reach it.",
        steps: [
          "**Choose {{up-positive}}**: {{u}} = +12 m/s, {{a}} = −9.81 m s⁻². At the top {{v-zero-top|v = 0}}.",
          "**(a)** No time given, so use v² = u² + 2as with {{v}} = 0: 0 = 12² + 2 × (−9.81) × s, so s = 144 ÷ 19.62 = **7.34 m**.",
          "**(b)** v = u + at: 0 = 12 − 9.81 t, so t = 12 ÷ 9.81 = **1.22 s**.",
        ],
        answer: "Maximum height **7.34 m**, reached after **1.22 s**. It takes another 1.22 s to fall back.",
      },
      { type: "figure", figure: F.figThrowUp },
      {
        type: "sayIt",
        say: ["Use ==g = 9.81 m s⁻²== (9.8 is allowed)."],
        reject: ["g = 10 m s⁻² (not accepted unless already penalised)."],
        source: "H156/01 June 2019 Q22(b) mark scheme",
      },
      {
        type: "examiners",
        body: "Some candidates used g = 10 m s⁻²; they were told to use 9.81. Others mixed up the lift's 2.4 m s⁻² with 9.81 m s⁻² in the same question.",
        cite: "June 2025 H156/01 Q21(b)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "trapdoor",
    heading: "Measuring g: electromagnet and trapdoor",
    source: "both",
    specRef: "3.1.2(b)(ii)",
    blocks: [
      { type: "lead", body: "The spec names this method. The idea: drop a ball a known height, time it electronically, use s = ½gt²." },
      {
        type: "text",
        body: "A 1.0 m drop takes only about **0.45 s**. A stopwatch adds a {{reaction-time}} of about 0.2 s, far too big. So the timing must be **electronic**.",
      },
      {
        type: "list",
        items: [
          "An {{electromagnet}} holds a small steel ball. Switching off the current **starts the timer** and **releases the ball**.",
          "The ball hits the {{trapdoor}}, breaking the contact: the **timer stops**.",
          "Measure the height {{h}} with a {{metre-rule}} from the **bottom of the ball** to the trapdoor.",
          "Then {{two-s-t2|g = 2s ÷ t²}}.",
        ],
      },
      { type: "figure", figure: F.figTrapdoor },
      {
        type: "equation",
        latexless: "g = 2s ÷ t²",
        tex: "g = \\dfrac{2s}{t^2}",
        words: "**g = 2 × height ÷ time²**. Just s = ½gt² rearranged.",
        general: "s = ut + ½at² with u = 0",
        generalTex: "s = ut + \\tfrac{1}{2}at^2 \\text{ with } u = 0",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "85.6 cm in 0.421 s (Textbook p. 38)",
        origin: { kind: "textbook", ref: "p. 38" },
        question: "A ball drops 85.6 cm from an electromagnet to a trapdoor in 0.421 s. Determine {{g}}.",
        steps: [
          "**Convert to SI units**: {{s}} = 85.6 cm = 0.856 m. {{u}} = 0, {{t}} = 0.421 s, {{a}} = g = ?",
          "u = 0, so s = ut + ½at² becomes s = ½at², so a = {{two-s-t2|2s ÷ t²}}.",
          "a = 2 × 0.856 ÷ 0.421² = 1.712 ÷ 0.1772 = **9.66 m s⁻²**. (Keep the unrounded t² = 0.1772; 0.177 would give 9.67.)",
        ],
        answer: "**g = 9.66 m s⁻²** (3 s.f.), a bit below 9.81.",
      },
      {
        type: "list",
        items: [
          "**Why too small?** {{air-res|Air resistance}} slows the ball, and the {{demag-delay}} starts the clock before the ball moves: t too long, g too small.",
          "**Improve it:** a **heavier (denser) ball** (air resistance matters less) and a **much longer drop** (the fixed delay is a smaller share of t; smaller percentage uncertainty in t).",
        ],
      },
      {
        type: "sayIt",
        say: [
          "h measured with a ==metre rule== (or tape measure).",
          "==(Electronic) timer / data logger, started and stopped electronically==.",
          "Start: ==switch off the electromagnet (releases ball, starts timer)==. Stop: ==ball opens the trapdoor==.",
        ],
        reject: ["A stopwatch for times recorded to the millisecond.", "\"Use light gates\" with no timer and no detail of starting/stopping (one mark at most)."],
        source: "H156/02 June 2018 Q3(a) mark scheme",
      },
      {
        type: "sayIt",
        say: [
          "Improvement: ==automatic electronic timing== (trapdoor + timer, light gates + data logger, video with frame rate) ==to remove reaction-time error==.",
          "Or: ==increase the height== so the ==percentage uncertainty in t is smaller==.",
        ],
        reject: ["\"human error\" (ignored)", "\"repeat for a range of heights and take a mean\" (ignored)"],
        source: "H156/01 June 2024 Q24(d) mark scheme",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "light-gates-and-pictures",
    heading: "Light gates, video and strobe photos",
    source: "both",
    specRef: "3.1.2(b)(ii)",
    blocks: [
      { type: "lead", body: "Two more ways to time the fall without the magnet's delay." },
      {
        type: "text",
        body: "**Light gates**: two beams, one above the other, {{s}} apart. The ball cuts the first {{light-gate}}: the timer (or {{data-logger}}) starts. It cuts the second: the timer stops.",
      },
      { type: "figure", figure: F.figLightGates },
      {
        type: "warning",
        body: "s = ½gt² needs {{u}} = 0. If the ball is already moving at the first gate, it doesn't hold. Release the ball **just at the top beam**, or use a method that allows for u (e.g. time from release).",
      },
      {
        type: "text",
        body: "**Pictures**: drop a ball beside a {{metre-rule}} and film it, or use a {{strobe|stroboscope}} with the camera shutter open. You get the ball's position at equal time gaps. The gaps grow, which shows it's accelerating.",
      },
      {
        type: "examiners",
        body: "A common weak answer was just \"use light gates\": no timer or data logger, and nothing about what starts and stops the timing. Name the timer and say how it is triggered.",
        cite: "June 2024 H156/01 Q24(d)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "graph-method",
    heading: "Finding g from a graph",
    source: "both",
    specRef: "3.1.2(b)(ii)",
    blocks: [
      { type: "lead", body: "One drop gives one g. A straight-line graph of many drops averages out the scatter and exposes odd results." },
      {
        type: "text",
        body: "From the textbook's photos (Table 1): after 0.132 s the ball has fallen 0.085 m; after 0.429 s, 0.903 m. s against t isn't a straight line, but s against {{t2}} is, because s = ½g × t².",
      },
      {
        type: "equation",
        latexless: "s = (g/2) × t²",
        tex: "s = \\left(\\tfrac{g}{2}\\right) t^2",
        words: "**distance = (half of g) × time²**. Plot s up the side, t² along the bottom: a straight line through the origin with gradient g/2.",
        general: "y = mx + c with y = s, x = t², m = g/2, c = 0",
        generalTex: "y = mx + c \\text{ with } y = s,\\ x = t^2,\\ m = \\tfrac{g}{2},\\ c = 0",
        dataSheet: false,
      },
      {
        type: "list",
        items: [
          "Square each time ({{t2}}), plot s (y) against t² (x).",
          "Draw a {{best-fit}}, ignoring any {{anomaly}}.",
          "Find the {{gradient}} with a {{large-triangle}}. Then g = 2 × gradient, since the gradient is {{g-over-2}}.",
        ],
      },
      { type: "figure", figure: F.figGraph },
      {
        type: "worked",
        title: "Gradient from Table 1 (Textbook p. 39)",
        origin: { kind: "textbook", ref: "p. 39" },
        question: "Use the textbook's s against t² graph to find {{g}} and its {{pct-diff}} from 9.81 m s⁻².",
        steps: [
          "Nine points sit on one line. The point at t = 0.264 s (t² = 0.0697 s², s = 0.368 m) is off it: the line gives ½ × 9.81 × 0.0697 = 0.342 m. That's the {{anomaly}}; leave it out.",
          "{{large-triangle|Large triangle}} from (0, 0) to (0.180 s², 0.883 m): gradient = 0.883 ÷ 0.180 = **4.906 m s⁻²** (keep the extra figure for the next step).",
          "g = 2 × 4.906 = **9.81 m s⁻²**. Percentage difference = (9.81 − 9.81) ÷ 9.81 × 100 ≈ **0%**.",
        ],
        answer: "**g = 9.81 m s⁻²**, about 0% from the accepted value. The book prints no answer; a computer fit of the nine good points gives 9.81 too.",
      },
      {
        type: "text",
        body: "Exams also use other straight-line graphs. Same trick each time: rearrange to {{y-mx-c}}.",
      },
      {
        type: "list",
        items: [
          "**t² against h**: t² = (2/g) h, gradient 2/g, so g = 2 ÷ gradient.",
          "**t against {{sqrt-h|√h}}**: t = √(2/g) × √h, so g = 2 ÷ gradient².",
          "**h against v²**: from {{v2-2gh}}, h = v² ÷ 2g, a straight line through the origin with gradient 1/(2g).",
        ],
      },
      {
        type: "sayIt",
        say: [
          "==Gradient = √(2/g)== or ==g = 2/gradient²== (t against √h).",
          "Draw the ==worst acceptable line==; ==% uncertainty in g = 2 × % uncertainty in gradient==.",
        ],
        source: "H156/02 June 2024 Q3 mark scheme (level-of-response indicative points)",
      },
      {
        type: "tip",
        body: "Read the triangle's corners **off your line**, not from the table. A data point used as a corner only counts if it lies exactly on the line.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "accuracy-uncertainty",
    heading: "How good is your g?",
    source: "both",
    specRef: "3.1.2(b)(ii)",
    blocks: [
      { type: "lead", body: "Two different questions: how close to 9.81 is it ({{accuracy}}), and how sure are you ({{pct-unc|uncertainty}})?" },
      {
        type: "text",
        body: "You measure g = 10.20 m s⁻². It's 0.39 m s⁻² above 9.81. As a share of the accepted value: 0.39 ÷ 9.81 × 100 = **4.0%**. That's the {{pct-diff}}.",
      },
      {
        type: "equation",
        latexless: "% difference = (experimental − accepted) ÷ accepted × 100%",
        tex: "\\%\\ \\text{diff.} = \\dfrac{\\text{exp.} - \\text{acc.}}{\\text{acc.}} \\times 100\\%",
        words: "**(experimental − accepted) ÷ accepted × 100%: how far off you are, as a percentage of the true value.** Divide by 9.81, not by your own value.",
        dataSheet: false,
      },
      {
        type: "list",
        items: [
          "{{accuracy|Accurate}} = close to the true value. (9.2 ± 1.0) m s⁻² is less accurate than (9.7 ± 0.2) m s⁻², because 9.2 is further from 9.81.",
          "{{precision|Precise}} = small spread / small ± value. A precise result can still be inaccurate.",
          "g = 2s ÷ t² uses t **squared**, so {{double-unc|double}} the percentage uncertainty in t. 2% in t → 4% in g.",
        ],
      },
      {
        type: "examiners",
        body: "Asked for the **least accurate** value of g, the popular wrong answer was the one with the **smallest uncertainty**. Accuracy is about distance from 9.81, not the ± value.",
        cite: "June 2019 H156/01 Q2",
      },
      {
        type: "examiners",
        body: "The best answers remembered to **double** the percentage uncertainty in t, because g depends on t². Some candidates mistook percentage difference for percentage uncertainty.",
        cite: "June 2023 H556/01 Q18",
      },
    ],
  },
];

export default sections;
