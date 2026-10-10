import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

const sections: Section[] = [
  {
    id: "average-speed",
    heading: "Average speed",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Speed cameras on roadworks don't catch you at one spot. They time you between two cameras. That gives your **average** speed, the first idea in this topic." },
      {
        type: "text",
        body: "A car passes camera 1, then camera 2 is **2500 m** further on. It takes **82 s**. Each second it covers, on average, 2500 ÷ 82 ≈ **30 m**. So its {{avg|average speed}} is 30 m s⁻¹.",
      },
      {
        type: "equation",
        latexless: "v = Δx / Δt",
        tex: "v = \\dfrac{\\Delta x}{\\Delta t}",
        words: "average speed = distance travelled ÷ time taken",
        dataSheet: false,
        note: "The textbook writes distance as {{x}} and time as {{t}}. {{v}} = speed, {{dx}} = distance travelled, {{dt}} = time taken. {{delta}} means \"change in\". Unit: {{ms}}. **Not on the data sheet**: learn it.",
      },
      { type: "figure", figure: F.figFine },
      {
        type: "worked",
        title: "Fine or not?",
        origin: { kind: "textbook", ref: "p. 22" },
        question: "A car travels 2.5 km in 1 minute 22 seconds. The average speed limit is 50 mph (22 m s⁻¹). Has the driver broken the limit?",
        steps: [
          "Units first. {{km|2.5 km = 2500 m}}. {{min|1 min 22 s = 60 + 22 = 82 s}}.",
          "{{v}} = {{dx}} ÷ {{dt}} = 2500 ÷ 82 = 30.49 m s⁻¹.",
          "Round to {{sf|2 s.f.}} (the data has 2 s.f.): 30 m s⁻¹.",
          "Compare: 30 m s⁻¹ > 22 m s⁻¹.",
        ],
        answer: "**{{v}} = 30 m s⁻¹**, so **yes**, the driver exceeded the average speed limit.",
      },
      {
        type: "text",
        body: "Speed is a {{scalar}}: it has size but no direction. Its direction-carrying partner, velocity, is in 3.2.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "units-and-rearranging",
    heading: "Units, rearranging and whole trips",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Most lost marks here are not physics: they are km, minutes and hours left unconverted, or speeds averaged the wrong way." },
      {
        type: "text",
        body: "A car at 72 km/h goes 72 km in an hour. That's 72 000 m in 3600 s, so 72 000 ÷ 3600 = **20 m/s**.",
      },
      { type: "figure", figure: F.figConvert },
      {
        type: "equation",
        latexless: "speed in m s⁻¹ = speed in km h⁻¹ ÷ 3.6",
        tex: "v_{\\text{m s}^{-1}} = \\dfrac{v_{\\text{km h}^{-1}}}{3.6}",
        words: "to turn km/h into m/s, divide by 3.6",
        general: "1 km h⁻¹ = 1000 m ÷ 3600 s",
        generalTex: "1\\ \\text{km h}^{-1} = \\dfrac{1000\\ \\text{m}}{3600\\ \\text{s}}",
        dataSheet: false,
        note: "{{kmh}}. If you forget the 3.6, do it the long way: {{km}} and hours × 3600.",
      },
      {
        type: "text",
        body: "The same equation finds a distance or a time. A lorry at 25 m s⁻¹ for 120 s goes 25 × 120 = **3000 m** ({{rearrange}}).",
      },
      {
        type: "equation",
        latexless: "Δx = v × Δt   and   Δt = Δx / v",
        tex: "\\Delta x = v\\,\\Delta t \\qquad \\Delta t = \\dfrac{\\Delta x}{v}",
        words: "distance = speed × time;  time = distance ÷ speed",
        general: "v = Δx / Δt",
        generalTex: "v = \\dfrac{\\Delta x}{\\Delta t}",
        dataSheet: false,
      },
      { type: "figure", figure: F.figLorry },
      {
        type: "worked",
        title: "The lorry on the hill",
        origin: { kind: "textbook", ref: "p. 23 (Q5)" },
        question: "A lorry travels for 2.0 minutes at a constant 25 m s⁻¹. It then travels 800 m up a hill in 50 s. Find the total distance and its average speed.",
        steps: [
          "Stage 1 time: {{min|2.0 min = 120 s}}.",
          "Stage 1 distance: {{rearrange|25 × 120}} = 3000 m.",
          "Total distance: 3000 + 800 = 3800 m. Total time: 120 + 50 = 170 s.",
          "{{avg|Average speed}} = 3800 ÷ 170 = 22.35 m s⁻¹ ≈ 22 m s⁻¹.",
        ],
        answer: "**3800 m** and **22 m s⁻¹**. Not (25 + 16) ÷ 2 = 20.5 m s⁻¹: the lorry spends longer at 25 m s⁻¹ than at 16 m s⁻¹.",
      },
      {
        type: "warning",
        body: "Average speed = **total** distance ÷ **total** time. Never average the speeds of the stages unless each stage lasts the same time.",
      },
      {
        type: "examiners",
        body: "On an orbit question, many candidates didn't convert 1.19 km to metres, or used the circle's area (πr²) instead of the distance round it (2πr).",
        cite: "June 2024 H156/02 Q1(a)",
      },
      {
        type: "sayIt",
        say: ["Give a unit with every speed: ==m s⁻¹==. A consistent unit (e.g. 0.031 km s⁻¹) was also allowed for the unit mark."],
        source: "H556/01 June 2023 Q16(a)(i) mark scheme",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "distance-time-graphs",
    heading: "Distance–time graphs",
    source: "both",
    specRef: "3.1.1(b), 3.1.1(c)",
    blocks: [
      { type: "lead", body: "A graph shows a whole journey at once. Its **slope** tells you the speed at every stage." },
      {
        type: "list",
        items: [
          "Distance on the y-axis (up), time on the x-axis (across).",
          "**Flat line**: distance not changing, so the object is stationary.",
          "**Straight sloping line**: same distance every second, so {{constant}}.",
          "**Steeper** line: more metres per second, so faster.",
        ],
      },
      { type: "figure", figure: F.figShapes },
      {
        type: "text",
        body: "On the textbook's graph the object is at 400 m after 20 s and 1400 m after 70 s. In those 50 s it covers 1000 m, so 1000 ÷ 50 = **20 m s⁻¹**. That calculation is the {{gradient}} of the line.",
      },
      {
        type: "equation",
        latexless: "speed = gradient = Δx / Δt",
        tex: "v = \\text{gradient} = \\dfrac{\\Delta x}{\\Delta t}",
        words: "speed = how steep the distance–time line is = rise ÷ run",
        general: "v = Δx / Δt",
        generalTex: "v = \\dfrac{\\Delta x}{\\Delta t}",
        dataSheet: false,
        note: "Rise = {{dx}}, run = {{dt}}. Read both off the axes, with their units.",
      },
      { type: "figure", figure: F.figGradient },
      {
        type: "worked",
        title: "Speed from a straight line",
        origin: { kind: "textbook", ref: "p. 23 (Figure 2)" },
        question: "A distance–time graph is a straight line through (20 s, 400 m) and (70 s, 1400 m). Find the speed.",
        steps: [
          "Draw a big {{triangle}} between the two points.",
          "{{dx}} = 1400 − 400 = 1000 m.",
          "{{dt}} = 70 − 20 = 50 s.",
          "{{gradient|Gradient}} = 1000 ÷ 50 = 20 m s⁻¹.",
        ],
        answer: "**{{v}} = 20 m s⁻¹**, the same all the way along because the line is straight.",
      },
      {
        type: "tip",
        body: "Make the {{triangle}} cover **more than half** the line (textbook study tip). A tiny triangle magnifies reading errors.",
      },
      {
        type: "text",
        body: "OCR papers usually draw **displacement**–time graphs (3.2). For something moving one way along a line, they look the same and the gradient still gives the speed.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "instantaneous-speed",
    heading: "Instantaneous speed: tangents",
    source: "both",
    specRef: "3.1.1(a), 3.1.1(c)",
    blocks: [
      { type: "lead", body: "Average-speed cameras can be beaten: race, then crawl. To catch that you need the speed at **one moment**, which a curved graph hides in its steepness." },
      {
        type: "text",
        body: "A car's graph curves upwards: it is speeding up. Over 0–6 s it goes 72 m, an average of 12 m s⁻¹. But at {{t}} = 4 s it is doing **16 m s⁻¹**. That is its {{inst|instantaneous speed}}: the speed over a very short time.",
      },
      {
        type: "list",
        items: [
          "Mark the point on the curve at the time asked for.",
          "With a ruler, draw a {{tangent}}: a straight line that just touches the curve there, with the same slope.",
          "Make it long. Draw a big {{triangle}} on the **tangent** (not the curve).",
          "{{gradient|Gradient}} of the tangent = {{dx}} ÷ {{dt}} = instantaneous speed.",
        ],
      },
      { type: "figure", figure: F.figTangent },
      {
        type: "worked",
        title: "Speed at 4 seconds",
        origin: { kind: "ours" },
        question: "A car's distance–time curve passes through (4.0 s, 32 m). The tangent at that point passes through (2.0 s, 0 m) and (6.0 s, 64 m). Find the car's instantaneous speed at 4.0 s.",
        steps: [
          "Use points on the {{tangent}}, far apart: (2.0, 0) and (6.0, 64).",
          "{{dx}} = 64 − 0 = 64 m.",
          "{{dt}} = 6.0 − 2.0 = 4.0 s.",
          "{{gradient|Gradient}} = 64 ÷ 4.0 = 16 m s⁻¹.",
        ],
        answer: "**16 m s⁻¹** at 4.0 s. (32 m ÷ 4.0 s = 8 m s⁻¹ is the average from the start, not the speed at 4.0 s.)",
      },
      {
        type: "warning",
        body: "Reading one point and dividing ({{x}} ÷ {{t}}) gives the **average** speed since {{t}} = 0, not the instantaneous speed. On a curve you must draw a {{tangent}}.",
      },
      {
        type: "sayIt",
        say: [
          "==Tangent drawn at the time asked for== ({{t}} given in the question), long: one scheme wanted it to span at least two large squares.",
          "Then ==change in y / change in x==, showing the {{dx}} and {{dt}} you read off.",
        ],
        reject: ["A tangent at the wrong time, or one too steep, too shallow or not touching: 1 mark at most."],
        source: "H156/02 June 2022 Q1(d)(ii); H156/01 June 2019 Q22(c); H556/01 June 2025 Q16(a)(ii) mark schemes",
      },
      {
        type: "examiners",
        body: "About a quarter of candidates drew the tangent at the wrong time, which limited them to 1 mark.",
        cite: "June 2019 H156/01 Q22(c)",
      },
      {
        type: "examiners",
        body: "Some found the velocity at an instant as displacement ÷ time from one point instead of a tangent gradient. Tangents should be long, using points on the line, not the data table.",
        cite: "June 2022 H156/02 Q1(d)(ii)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "spacing",
    heading: "Speed from evenly timed marks",
    source: "spec-only",
    specRef: "3.1.1(b)",
    blocks: [
      { type: "lead", body: "Exams also show motion as dots: oil drips, strobe flashes, ticker tape. Equal time between dots turns gaps into speeds." },
      {
        type: "text",
        body: "A leaking car drips once every **0.5 s**. If each gap is **5 m**, it moves 5 m every 0.5 s: 5 ÷ 0.5 = **10 m s⁻¹**, steady.",
      },
      {
        type: "list",
        items: [
          "**Equal gaps**: equal distance in equal time, so {{constant}}.",
          "**Gaps growing**: further each interval, so speeding up.",
          "**Gaps shrinking**: slowing down. Bunched-up dots: (nearly) stopped.",
        ],
      },
      { type: "figure", figure: F.figDrips },
      {
        type: "tip",
        body: "Check the question says the dots are at a **steady rate**. Only then does gap size compare speeds.",
      },
    ],
  },
];

export default sections;
