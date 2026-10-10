import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

const sections: Section[] = [
  // ------------------------------------------------------------------
  {
    id: "area-is-displacement",
    heading: "Area under a v–t graph = displacement",
    source: "both",
    specRef: "3.1.1(d)",
    blocks: [
      { type: "lead", body: "The one new idea in this topic: the area under a velocity–time graph tells you how far the object went. Here's why." },
      {
        type: "text",
        body: "Start with numbers. Cycle at 6.0 m s⁻¹ for 0.5 s and you move 6.0 × 0.5 = **3.0 m**. On a v–t graph that's a thin strip 6.0 tall and 0.5 wide: its {{area}} is 3.0. Same number.",
      },
      { type: "figure", figure: F.figStrip },
      {
        type: "text",
        body: "In a very short time {{dt}} the velocity {{v}} hardly changes, so the distance moved is {{v-dt}}. That's one strip. Add up every strip and you get the whole area, which is the whole {{s|displacement}}.",
      },
      {
        type: "equation",
        latexless: "Δs ≈ v Δt",
        tex: "\\Delta s \\approx v\\,\\Delta t",
        words: "**small distance moved = velocity × short time** (one thin strip of area)",
        general: "v = Δs ÷ Δt (average velocity), rearranged",
        generalTex: "v = \\dfrac{\\Delta s}{\\Delta t} \\text{ (average velocity), rearranged}",
        dataSheet: false,
      },
      {
        type: "text",
        body: "Units check: the up axis is m s⁻¹, the across axis is s, and {{area-units}}. Any area on a v–t graph comes out in metres.",
      },
      {
        type: "list",
        items: [
          "{{gradient|Gradient}} of a v–t graph = **acceleration** {{a}} (from 3.3).",
          "{{area|Area}} under a v–t graph = **displacement** {{s}} (this topic).",
        ],
      },
      {
        type: "sayIt",
        say: ["==area under graph = displacement== (or distance)", "acceleration = ==gradient== of the velocity–time graph"],
        source: "H156/02 June 2018 Q1(b) mark scheme; H556/01 June 2022 Q3 key (A)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "straight-lines",
    heading: "Straight-line graphs: split into shapes",
    source: "both",
    specRef: "3.1.1(d)",
    blocks: [
      { type: "lead", body: "When the graph is made of straight lines (constant accelerations), the area is just rectangles, triangles and trapeziums." },
      {
        type: "text",
        body: "A cyclist speeds up to 4.0 m s⁻¹ in 10 s, rides steadily for 20 s, then slows to a stop in 20 s. Split the area at every corner of the line.",
      },
      { type: "figure", figure: F.figCyclist },
      {
        type: "worked",
        title: "Displacement of a cyclist (Textbook p. 29–30)",
        origin: { kind: "textbook", ref: "p. 29–30" },
        question: "Use the graph to find the total distance the cyclist travels in 50 s.",
        steps: [
          "**Method:** distance = {{area}} between the line and the time axis.",
          "**A (speeding up):** a triangle. {{tri}} = ½ × 10 × 4.0 = **20 m**.",
          "**B (steady):** a rectangle. {{rect}} = 20 × 4.0 = **80 m**.",
          "**C (slowing down):** a triangle. ½ × 20 × 4.0 = **40 m**.",
          "**Add:** 20 + 80 + 40 = **140 m**.",
        ],
        answer: "**140 m.** All the velocity is positive, so this is both the distance and the displacement.",
      },
      {
        type: "text",
        body: "**Shortcut:** the whole shape is a {{trap|trapezium}}. Its {{parallel}} are the 20 s flat top and the 50 s time axis; its height is 4.0 m s⁻¹.",
      },
      { type: "figure", figure: F.figCyclistTrap },
      {
        type: "equation",
        latexless: "area = ½ × (a + b) × h",
        tex: "\\text{area} = \\tfrac{1}{2}(a + b)\\,h",
        words: "**trapezium area = half of (sum of the two parallel sides) × distance between them**. Cyclist: ½ × (50 + 20) × 4.0 = 140 m.",
        note: "Maths, not on the data sheet. A sloping straight line from {{u}} to {{v}} over time {{t}} makes a trapezium too, which is where the data-sheet {{half-uv}} comes from (see 3.5).",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Sprinter (Textbook p. 30, Figure 6)",
        origin: { kind: "textbook", ref: "p. 30" },
        question:
          "A sprinter reaches 10.0 m s⁻¹ in 4 s, holds it until 9 s, then slows steadily to 5.0 m s⁻¹ at 13 s, when the race ends. Find (a) the distance run, (b) the {{avgv}}.",
        steps: [
          "**0–4 s, triangle:** ½ × 4 × 10.0 = **20 m**.",
          "**4–9 s, rectangle:** 5 × 10.0 = **50 m**.",
          "**9–13 s, trapezium** (the line doesn't reach zero): parallel sides are the two velocities, 10.0 and 5.0; the width is 4 s. ½ × (10.0 + 5.0) × 4 = **30 m**.",
          "**(a)** 20 + 50 + 30 = **100 m**.",
          "**(b)** {{avgv|Average velocity}} = total displacement ÷ total time = 100 ÷ 13 = **7.7 m s⁻¹**.",
        ],
        answer: "**100 m**, average velocity **7.7 m s⁻¹**.",
      },
      { type: "figure", figure: F.figSprinter },
      {
        type: "worked",
        title: "Car speeding up (Textbook p. 30, Figure 5)",
        origin: { kind: "textbook", ref: "p. 30" },
        question: "A car speeds up steadily from rest to 15 m s⁻¹ in 75 s, then keeps that speed until 100 s. Find the distance travelled and the average velocity.",
        steps: [
          "**Triangle (0–75 s):** ½ × 75 × 15 = **562.5 m**.",
          "**Rectangle (75–100 s):** 25 × 15 = **375 m**.",
          "**Total:** 562.5 + 375 = **937.5 m**. Average velocity = 937.5 ÷ 100 = **9.4 m s⁻¹**.",
        ],
        answer: "About **940 m**; average velocity **9.4 m s⁻¹**. Not (0 + 15) ÷ 2 = 7.5: the car spends 25 s at top speed.",
      },
      { type: "figure", figure: F.figCar },
      {
        type: "warning",
        body: "Read the scales. Time may be in ms or min, velocity in km h⁻¹. Convert to s and m s⁻¹ **before** finding the area, or the metres will be wrong.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "counting-squares",
    heading: "Curved graphs: count the squares",
    source: "both",
    specRef: "3.1.1(d)",
    blocks: [
      { type: "lead", body: "When the line curves (changing acceleration), there are no neat shapes. Estimate the area by counting grid squares." },
      {
        type: "list",
        items: [
          "**1.** Count the squares that are complete or nearly complete.",
          "**2.** Add the squares that are **more than half** under the line. Skip those that are mostly above it.",
          "**3.** Work out the {{square}}: width (s) × height (m s⁻¹).",
          "**4.** Distance ≈ number of squares × area of one square.",
        ],
      },
      { type: "figure", figure: F.figSquares },
      {
        type: "equation",
        latexless: "s ≈ N × (area of one square)",
        tex: "s \\approx N \\times (\\text{area of one square})",
        words: "**distance ≈ number of squares counted × what one square is worth**. Here 24 × 4 m = 96 m.",
        dataSheet: false,
      },
      {
        type: "worked",
        title: "Car pulling away (our example)",
        origin: { kind: "ours" },
        question: "A car's v–t graph curves up from rest towards 12 m s⁻¹ over 12 s. Grid squares are 2 s × 2 m s⁻¹. Estimate the distance travelled in 12 s.",
        steps: [
          "**Count full or nearly full squares:** 1 + 3 + 4 + 5 + 5 + 5 = **23** (column by column).",
          "**Mostly-under squares:** just **1** more (top right). Total **24**.",
          "**One square:** 2 s × 2 m s⁻¹ = **4 m**.",
          "**Distance** ≈ 24 × 4 = **96 m**.",
        ],
        answer: "**About 96 m.** The exact area is 98 m, so a careful count is close enough. Any answer near this earns the mark.",
      },
      {
        type: "warning",
        body: "The most common slip: forgetting that one square is **not** 1 m. Always multiply the count by width × height of one square.",
      },
      {
        type: "sayIt",
        say: [
          "==Reference to area (under the curve)==, then ==construct rectangle or square plus triangle / trapezium==, **or** ==count squares (under the curve) and multiply by the area of one square==.",
        ],
        reject: ["\"Integrate\": examiners ignore references to integration."],
        source: "H556/01 June 2025 Q16(a)(i) mark scheme",
      },
      {
        type: "tip",
        body: "For acceleration at one instant on a curved graph, draw a {{tangent}} at that time and find its gradient (3.3). Area for distance, tangent for acceleration.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "below-the-axis",
    heading: "Area below the axis: going backwards",
    source: "both",
    specRef: "3.1.1(d)",
    blocks: [
      { type: "lead", body: "Velocity can be negative. Then the area is below the time axis, and it counts as displacement the other way." },
      {
        type: "text",
        body: "A ball is rolled up a ramp at 4.0 m s⁻¹. It slows, stops at 4.0 s, then rolls back down, reaching −4.0 m s⁻¹ at 8.0 s. The minus sign is a {{neg}}: it's moving the other way.",
      },
      { type: "figure", figure: F.figRamp },
      {
        type: "worked",
        title: "Ball up a ramp (Textbook p. 30, Figure 7)",
        origin: { kind: "textbook", ref: "p. 30" },
        question: "Find (a) the total distance the ball travels in 8.0 s, (b) its displacement, (c) its {{avgspeed}} and average velocity.",
        steps: [
          "**Up the ramp (0–4.0 s):** triangle above the axis, ½ × 4.0 × 4.0 = **+8.0 m**.",
          "**Back down (4.0–8.0 s):** triangle below the axis, ½ × 4.0 × 4.0 = **−8.0 m**.",
          "**(a) {{distance|Distance}}:** add the sizes, 8.0 + 8.0 = **16 m**.",
          "**(b) {{disp|Displacement}}:** keep the signs, 8.0 + (−8.0) = **0 m**. It's back where it started.",
          "**(c)** Average speed = 16 ÷ 8.0 = **2.0 m s⁻¹**. Average velocity = 0 ÷ 8.0 = **0 m s⁻¹**.",
        ],
        answer: "Distance **16 m**, displacement **0**, average speed **2.0 m s⁻¹**, average velocity **0**.",
      },
      {
        type: "text",
        body: "The line is straight the whole way, so the {{gradient}} is constant: (−4.0 − 4.0) ÷ 8.0 = **−1.0 m s⁻²**. The acceleration doesn't change at the top, even though the ball stops for an instant.",
      },
      {
        type: "warning",
        body: "A ball that bounces **reverses direction**: its velocity jumps from + to −, so the line jumps to the other side of the axis. Drawing a line sloping back down to zero instead was a common error.",
      },
      {
        type: "examiners",
        body: "On a bounce sketch, many drew a negative-gradient line back to the axis instead of the velocity jumping to −4.2 m s⁻¹ followed by a line **parallel** to the first (same gradient, g).",
        cite: "June 2019 H156/02 Q1(b)(ii)",
      },
      {
        type: "tip",
        body: "Maximum height of a thrown or bouncing ball = the area of the triangle **above** the axis, up to where the line crosses zero.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "reading-the-shape",
    heading: "Reading and sketching v–t graphs",
    source: "spec-only",
    specRef: "3.1.1(b)",
    blocks: [
      { type: "lead", body: "Exams love car-stopping graphs. Know what each part of the line means, and how it changes when something changes." },
      {
        type: "text",
        body: "A car at 15 m s⁻¹: the driver takes 0.60 s to react (flat line), then brakes to a stop in 3.0 s (sloping line). Each part's area is one piece of the stopping distance.",
      },
      { type: "figure", figure: F.figStopping },
      {
        type: "worked",
        title: "Stopping distance from a v–t graph (our example)",
        origin: { kind: "ours" },
        question: "Use the graph to find the thinking, braking and total stopping distances.",
        steps: [
          "**Thinking (rectangle):** 15 × 0.60 = **9.0 m**.",
          "**Braking (triangle):** ½ × 3.0 × 15 = **22.5 m**.",
          "**Stopping distance:** 9.0 + 22.5 = **31.5 m**.",
          "**Deceleration** = {{gradient}} of the sloping part = 15 ÷ 3.0 = **5.0 m s⁻²**.",
        ],
        answer: "Stopping distance **31.5 m** (about 32 m).",
      },
      {
        type: "list",
        items: [
          "**Flat line:** constant velocity, a = 0.",
          "**Straight sloping line:** constant acceleration. Sloping down = ==constant (negative) gradient== = constant deceleration.",
          "**Curve getting flatter:** the ==(magnitude of) gradient decreases==, so the acceleration is decreasing.",
        ],
      },
      { type: "figure", figure: F.figShapeChanges },
      {
        type: "sayIt",
        say: [
          "Tired driver: ==horizontal section would be longer== (no change to sloping line).",
          "More resistive surface: ==sloping section would be steeper== (allow ==(magnitude of) gradient is greater==).",
        ],
        reject: ["Talking about thinking time / braking time instead of how the **line** changes.", "\"Gradient is lower\" (ignored)."],
        source: "H156/02 June 2023 Q1(c) mark scheme",
      },
      {
        type: "sayIt",
        say: ["Curved line: ==line will curve / be non-linear== or ==(magnitude of) gradient of line decreases=="],
        reject: ["\"gradient is smaller / less steep / shallower\" (describes one value, not a change)"],
        source: "H156/02 June 2019 Q1(c) mark scheme",
      },
      {
        type: "examiners",
        body: "Asked why a straight-line train braking graph is unrealistic, answers needed physics: acceleration changes gradually, brakes can't be applied fully at once, or drag changes with speed. Just writing \"air resistance\" without linking it to speed, or discussing reaction time, scored nothing.",
        cite: "June 2025 H156/02 Q1(c)",
      },
    ],
  },
];

export default sections;
