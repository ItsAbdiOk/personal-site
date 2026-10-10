import type { Subchapter } from "@/lib/zakiya/types";
import sections from "./3-4/sections";
import explain from "./3-4/explain";
import * as F from "./3-4/figures";

const AS1 = (s: string, k: "QP" | "MS") =>
  `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/${s}%20${k}%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf`;
const AS2 = (s: string, k: "QP" | "MS") =>
  `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-2/${s}%20${k}%20-%20Paper%202%20OCR%20(A)%20Physics%20AS-level.pdf`;
const AL1 = (s: string, k: "QP" | "MS") =>
  `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/${k}/${s}%20${k}.pdf`;

const sub: Subchapter = {
  slug: "3-4-more-on-velocity-time-graphs",
  number: "3.4",
  title: "More on velocity–time graphs",
  module: 3,
  chapter: { number: 3, title: "Motion" },
  specRefs: ["3.1.1(b)", "3.1.1(d)"],
  textbookPages: "29–30",
  colour: "#0071E3",
  summary:
    "The **area under a velocity–time graph is the displacement**. Split straight-line graphs into rectangles, triangles and trapeziums; estimate curved ones by counting squares.",
  keyIdea:
    "v–t graph: **gradient = acceleration**, **area = displacement**. Area below the time axis counts as negative displacement.",

  sections,
  explain,

  // ====================================================================
  definitions: [
    {
      term: "area under a velocity–time graph",
      plain: "The space between the line and the time axis. It equals how far the object has moved.",
      spec: "velocity–time graphs; displacement is area under graph",
      textbook: "We can read the displacement of the object from the area under the graph.",
      differenceNote:
        "Same idea. Mark schemes credit ==area under graph = displacement or distance== (H156/02 June 2018 Q1(b)). Write the word **area** explicitly: it is the first mark in describe-the-method questions.",
      source: "both",
    },
    {
      term: "gradient of a velocity–time graph",
      plain: "How steep the line is: change in velocity ÷ time. It equals the acceleration.",
      spec: "velocity–time graphs; acceleration is gradient",
      textbook: "Acceleration can be determined from the gradient of a velocity–time graph.",
      differenceNote: "No difference. Pair it with area: gradient → acceleration, area → displacement (H556/01 June 2022 Q3, key A).",
      source: "both",
    },
    {
      term: "estimating the area under a non-linear graph",
      plain: "For a curved line: count the squares under it and multiply by what one square is worth.",
      spec: "estimate the area under a non-linear velocity–time graph (spec 3.1.1(d))",
      textbook: "Count complete or nearly complete squares, then those mostly beneath the graph; omit squares mostly above.",
      differenceNote:
        "The textbook gives the counting method. The mark scheme (H556/01 June 2025 Q16(a)(i)) also accepts drawing a rectangle plus triangle or trapezium, but needs **multiply by the area of one square** if you count. \"Integrate\" is ignored.",
      source: "both",
    },
    {
      term: "distance vs displacement from a v–t graph",
      plain: "Distance: add the sizes of all areas. Displacement: area above the axis is +, below is −.",
      textbook: "Ball up a ramp (Figure 7): asks for distance travelled and for average speed and average velocity.",
      differenceNote:
        "The spec doesn't word this. The physics: distance is a scalar (no direction), displacement a vector. A ball that goes up 8.0 m and back 8.0 m has distance 16 m but displacement 0.",
      source: "textbook-only",
    },
    {
      term: "average velocity",
      plain: "Total displacement divided by total time.",
      textbook: "Average velocity v = Δs ÷ Δt, where Δs is the displacement in the time interval Δt.",
      differenceNote:
        "Not \"average of start and end velocity\": that only works for constant acceleration. From a graph, find the area first, then divide by the total time.",
      source: "textbook-only",
    },
  ],

  // ====================================================================
  flashcards: [
    { id: "vt-fc-01", front: "What does the area under a velocity–time graph represent?", back: "The **displacement** of the object (the distance moved, if it never reverses).", tag: "concept", source: "both", page: "29" },
    { id: "vt-fc-02", front: "What does the gradient of a velocity–time graph represent?", back: "The **acceleration**.", tag: "concept", source: "both", page: "29" },
    { id: "vt-fc-03", front: "Why does area on a velocity–time graph come out in metres?", back: "Height is in m s⁻¹ and width is in s. (m s⁻¹) × s = **m**.", tag: "concept", source: "both", page: "29" },
    { id: "vt-fc-04", front: "Why is the area of a thin strip under a v–t graph equal to the small displacement in that time?", back: "In a tiny time Δt the velocity barely changes, so Δs ≈ vΔt, which is the strip's height × width.", tag: "concept", source: "textbook-only", page: "29" },
    { id: "vt-fc-05", front: "A cyclist speeds up from rest to 4.0 m s⁻¹ in 10 s. How far does she go in that time?", back: "Triangle area: ½ × 10 × 4.0 = **20 m**.", tag: "equation", source: "textbook-only", page: "29–30" },
    { id: "vt-fc-06", front: "What is the area of a trapezium, and when do you use it on a v–t graph?", back: "**½ × (sum of parallel sides) × height.** Use it for a sloping line that doesn't reach zero, or for a whole speed-up, cruise, slow-down shape.", tag: "equation", source: "textbook-only", page: "30" },
    { id: "vt-fc-07", front: "How do you estimate the area under a curved velocity–time graph?", back: "Count full or nearly full squares, add squares mostly under the line, skip ones mostly above, then **multiply by the area of one square**.", tag: "concept", source: "both", page: "30" },
    { id: "vt-fc-08", front: "Grid squares on a v–t graph are 2 s wide and 2 m s⁻¹ tall. What is one square worth?", back: "2 s × 2 m s⁻¹ = **4 m**.", tag: "concept", source: "both", page: "30" },
    { id: "vt-fc-09", front: "What does area below the time axis of a v–t graph mean?", back: "Displacement in the **opposite (negative)** direction: the object is moving backwards.", tag: "concept", source: "textbook-only", page: "30" },
    { id: "vt-fc-10", front: "How do you get total distance, rather than displacement, from a v–t graph that crosses the time axis?", back: "**Add the sizes** of the areas above and below the axis, ignoring signs.", tag: "concept", source: "textbook-only", page: "30" },
    { id: "vt-fc-11", front: "A ball rolls 8.0 m up a ramp and 8.0 m back down in 8.0 s. What are its average speed and average velocity?", back: "Average speed = 16 ÷ 8.0 = **2.0 m s⁻¹**. Average velocity = 0 ÷ 8.0 = **0** (no overall displacement).", tag: "concept", source: "textbook-only", page: "30" },
    { id: "vt-fc-12", front: "How do you find average velocity from a velocity–time graph?", back: "Find the **total area** (displacement), then divide by the **total time**.", tag: "equation", source: "textbook-only", page: "30" },
    { id: "vt-fc-13", front: "On a car's stopping v–t graph, what do the flat part and the sloping part show?", back: "Flat: driver reacting, constant speed (area = **thinking distance**). Sloping: braking (area = **braking distance**).", tag: "concept", source: "spec-only" },
    { id: "vt-fc-14", front: "How does a car's stopping v–t graph change if the driver is tired?", back: "The **horizontal section is longer**. The sloping braking line is unchanged.", tag: "concept", source: "spec-only" },
    { id: "vt-fc-15", front: "How does a car's stopping v–t graph change on a road with more friction?", back: "The **sloping section is steeper** (greater magnitude of gradient). The flat section is unchanged.", tag: "concept", source: "spec-only" },
    { id: "vt-fc-16", front: "How does the v–t line change when a ball bounces off the floor?", back: "Velocity **jumps** from + to − (it reverses), then the new line is **parallel** to the old one: same gradient, g.", tag: "concept", source: "spec-only" },
  ],

  // ====================================================================
  questions: [
    {
      id: "vt-r1",
      title: "What the area tells you",
      style: "Paper 1 MCQ",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2022 Q3",
      stem: "A student plots a velocity–time graph for a trolley rolling along a straight track.",
      parts: [
        {
          prompt: "Which statement is correct?",
          marks: 1,
          kind: "mcq",
          options: [
            "The gradient gives the displacement and the area gives the acceleration.",
            "The gradient gives the velocity and the area gives the distance.",
            "The gradient gives the acceleration and the area gives the displacement.",
            "The gradient gives the acceleration and the area gives the average velocity.",
          ],
          correctIndex: 2,
          modelAnswer: "**C.** Gradient = change in velocity ÷ time = **acceleration**. Area = velocity × time = **displacement** (units m).",
          markScheme: ["C"],
          commonMistakes: [
            "**B**: mixes up v–t with displacement–time graphs, where the gradient is velocity.",
            "**D**: area has units (m s⁻¹) × s = m, a distance, not a velocity.",
          ],
        },
      ],
    },
    {
      id: "vt-r2",
      title: "Which goes furthest?",
      style: "Paper 1 MCQ",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 November 2020 Q14",
      stem: "The graph shows how the velocity of four objects A, B, C and D changes over 10 s.",
      figure: F.figQFour,
      parts: [
        {
          prompt: "Which object travels the greatest distance in the 10 s?",
          marks: 1,
          kind: "mcq",
          options: ["A", "B", "C", "D"],
          correctIndex: 2,
          modelAnswer:
            "**C.** Distance = area under each line. A: 6 × 10 = 60 m. B: ½ × 10 × 11 = 55 m. C: ½ × (10 + 4) × 10 = **70 m**. D: ½ × (2 + 10) × 10 = 60 m.",
          markScheme: ["C"],
          commonMistakes: [
            "**B**: it ends fastest, but it starts from rest, so it has the **smallest** area. Final speed isn't distance.",
            "Picking the steepest line: steepness is acceleration, not distance.",
          ],
        },
      ],
    },
    {
      id: "vt-r3",
      title: "Tram braking",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2025 Q1",
      stem: "A tram travels at 20 m s⁻¹. At t = 0 the driver sees a red signal. The graph shows its velocity until it stops.",
      figure: F.figQTram,
      parts: [
        {
          label: "a",
          prompt: "Calculate the deceleration of the tram while it is braking.",
          marks: 2,
          kind: "numeric",
          answer: { value: 0.5, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer: "Gradient of the sloping part: (0 − 20) ÷ (45 − 5.0) = −20 ÷ 40 = −0.50 m s⁻², so deceleration = **0.50 m s⁻²**.",
          markScheme: ["C1 gradient = (0 − 20) ÷ (45 − 5.0)", "A1 (−)0.50 m s⁻² (ignore sign)"],
          commonMistakes: ["Dividing by 45 s instead of 40 s: the braking starts at 5.0 s, not 0."],
        },
        {
          label: "b",
          prompt: "Calculate the distance travelled by the tram from t = 0 until it stops.",
          marks: 2,
          kind: "numeric",
          answer: { value: 500, unit: "m", tolerancePct: 2 },
          modelAnswer: "Area of trapezium: ½ × (5.0 + 45) × 20 = **500 m**. (Or 20 × 5.0 + ½ × 40 × 20 = 100 + 400 = 500 m.)",
          markScheme: ["C1 area under graph, e.g. ½ × (5.0 + 45) × 20 or 20 × 5.0 + ½ × 40 × 20", "A1 500 m (allow ECF from (a))"],
          commonMistakes: ["Only finding the braking triangle (400 m) and forgetting the 100 m before the brakes go on."],
        },
        {
          label: "c",
          prompt: "Suggest two reasons why the real graph would not be made of straight lines.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "Any two: the deceleration would **change gradually** at the start and end rather than suddenly; brakes **can't be applied at full force instantly**; **friction and air resistance change with speed**, so the deceleration isn't constant; a sudden change would jolt passengers.",
          markScheme: [
            "B1 acceleration not constant / line curved",
            "B1 acceleration changes gradually at start or end / brakes can't be applied fully at once / air resistance or friction changes with speed / passenger comfort",
          ],
          commonMistakes: [
            "Writing just \"air resistance\" without saying it **changes with speed**. In the June 2025 original this alone was not enough for the mark.",
            "Talking about the driver's reaction time: that's already the flat part of the graph.",
          ],
        },
      ],
    },
    {
      id: "vt-r4",
      title: "Will it stop before the line?",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2018 Q1 (numbers changed: in the original the car stops past the line)",
      stem: "A car moving at 12 m s⁻¹ is 25 m from a stop line when the lights change. The graph shows its velocity from that moment.",
      figure: F.figQStopLine,
      parts: [
        {
          label: "a",
          prompt: "Describe the motion of the car between t = 0.50 s and t = 3.5 s, referring to the graph.",
          marks: 2,
          kind: "written",
          modelAnswer: "The ==negative gradient== shows it is **decelerating**. The line is straight, so the gradient is constant: ==constant deceleration==.",
          markScheme: ["B1 deceleration shown by the negative gradient/slope", "B1 straight line / constant (negative) gradient → constant deceleration"],
          commonMistakes: ["\"It slows down\" with no link to the graph's gradient.", "Saying the deceleration decreases because the velocity decreases."],
        },
        {
          label: "b",
          prompt: "Show whether the car stops before the line, and by how much.",
          marks: 3,
          kind: "numeric",
          answer: { value: 1.0, unit: "m", tolerancePct: 5 },
          modelAnswer:
            "Distance = area: 12 × 0.50 + ½ × 3.0 × 12 = 6.0 + 18 = **24 m**. 24 m is less than 25 m, so it stops **1.0 m before** the line.",
          markScheme: ["C1 area under graph = displacement", "M1 12 × 0.50 + ½ × 3.0 × 12 (= 24 m)", "A1 stops 1.0 m before the line"],
          commonMistakes: ["Using 3.5 s as the triangle's base: braking lasts 3.5 − 0.50 = 3.0 s.", "Leaving out the 6.0 m travelled before braking."],
        },
      ],
    },
    {
      id: "vt-r5",
      title: "Speed-up then cruise",
      style: "Structured",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2022 Q21(a)",
      stem: "A cyclist speeds up from 3.0 m s⁻¹ to 9.0 m s⁻¹ in 4.0 s, then rides at 9.0 m s⁻¹ until t = 10.0 s.",
      figure: F.figQCyclist,
      parts: [
        {
          label: "a",
          prompt: "Calculate the distance travelled in the 10.0 s.",
          marks: 3,
          kind: "numeric",
          answer: { value: 78, unit: "m", tolerancePct: 2 },
          modelAnswer: "Trapezium (0–4.0 s): ½ × (3.0 + 9.0) × 4.0 = 24 m. Rectangle (4.0–10.0 s): 9.0 × 6.0 = 54 m. Total **78 m**.",
          markScheme: ["C1 distance = area under the graph", "C1 ½ × (3.0 + 9.0) × 4.0 or 9.0 × 6.0", "A1 78 m"],
          commonMistakes: ["Treating the first part as a triangle (½ × 4.0 × 9.0 = 18 m): the line starts at 3.0 m s⁻¹, not zero."],
        },
        {
          label: "b",
          prompt: "Calculate the average velocity of the cyclist over the 10.0 s.",
          marks: 1,
          kind: "numeric",
          answer: { value: 7.8, unit: "m s⁻¹", tolerancePct: 2 },
          modelAnswer: "78 ÷ 10.0 = **7.8 m s⁻¹** (ECF from (a)).",
          markScheme: ["B1 7.8 m s⁻¹, ECF from (a)"],
          commonMistakes: ["(3.0 + 9.0) ÷ 2 = 6.0 m s⁻¹: averaging start and end only works for constant acceleration throughout."],
        },
      ],
    },
    {
      id: "vt-r6",
      title: "Counting squares",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2025 Q16(a)(i)",
      stem: "A toy parachute is dropped from rest. Drag makes its velocity–time graph curve.",
      figure: F.figQCurve,
      parts: [
        {
          label: "a",
          prompt: "Describe how the graph can be used to estimate the distance fallen in the first 10 s.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "Distance = ==area under the curve==. ==Count the squares== under the curve (full ones, plus those more than half under) and ==multiply by the area of one square== (1 s × 2 m s⁻¹ = 2 m).",
          markScheme: [
            "B1 reference to area under the curve",
            "B1 count squares and multiply by area of one square, or construct rectangle/triangle/trapezium shapes; ignore integration",
          ],
          commonMistakes: ["Writing \"integrate\": examiners ignore it, so it scores nothing.", "Counting squares but not saying what one square is worth."],
        },
        {
          label: "b",
          prompt: "Use the graph to estimate the distance fallen in the first 10 s.",
          marks: 2,
          kind: "numeric",
          answer: { value: 72, unit: "m", tolerancePct: 9 },
          modelAnswer:
            "About 36 squares are under the curve (full, nearly full, or more than half). One square = 1 s × 2 m s⁻¹ = 2 m. Distance ≈ 36 × 2 = **72 m** (accept 66–78 m).",
          markScheme: ["C1 attempt to count squares × area of one square", "A1 66–78 m"],
          commonMistakes: ["Answering 36 m: the count, not multiplied by 2 m per square.", "Using v × t = 9.6 × 10 = 96 m, which ignores the slow start."],
        },
      ],
    },
    {
      id: "vt-r7",
      title: "Ball thrown upwards",
      style: "Structured",
      difficulty: 3,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2019 Q1(b)(iii) and H156/01 June 2016 Q14",
      stem: "A ball is thrown straight up at 6.0 m s⁻¹. Air resistance is negligible. Up is positive.",
      figure: F.figQThrow,
      parts: [
        {
          label: "a",
          prompt: "Calculate the time at which the ball reaches its highest point.",
          marks: 1,
          kind: "numeric",
          answer: { value: 0.612, unit: "s", tolerancePct: 2 },
          modelAnswer: "The highest point is where v = 0. Gradient = −9.81, so t = 6.0 ÷ 9.81 = **0.61 s**.",
          markScheme: ["B1 0.61 s"],
          commonMistakes: ["Thinking the highest point is where the line ends."],
        },
        {
          label: "b",
          prompt: "Use the graph to find the maximum height reached.",
          marks: 2,
          kind: "numeric",
          answer: { value: 1.83, unit: "m", tolerancePct: 3 },
          modelAnswer: "Area of the triangle above the axis: ½ × 0.612 × 6.0 = **1.8 m**.",
          markScheme: ["C1 area of triangle above the axis", "A1 1.8 m"],
          commonMistakes: ["Including area below the axis: after 0.61 s the ball is coming back down."],
        },
        {
          label: "c",
          prompt: "At t = 1.0 s, find (i) the displacement of the ball from the thrower's hand, (ii) the total distance it has travelled.",
          marks: 3,
          kind: "written",
          modelAnswer:
            "At 1.0 s, v = 6.0 − 9.81 × 1.0 = −3.81 m s⁻¹. Area below the axis (0.61 s to 1.0 s): ½ × 0.388 × 3.81 = 0.74 m.\n(i) Displacement = 1.83 − 0.74 = **1.1 m** above the hand.\n(ii) Distance = 1.83 + 0.74 = **2.6 m**.",
          markScheme: ["C1 v = −3.8 m s⁻¹ at 1.0 s", "A1 displacement 1.1 m (above the hand)", "A1 distance 2.6 m"],
          commonMistakes: ["Adding the two areas for displacement: the area below the axis is **negative**.", "Giving the same number for both: distance ignores direction, displacement doesn't."],
        },
      ],
    },
    {
      id: "vt-r8",
      title: "Changing the stopping graph",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2023 Q1(c)",
      stem: "A car's stopping v–t graph has a horizontal section (driver reacting) followed by a straight sloping section (braking) down to zero.",
      parts: [
        {
          label: "a",
          prompt: "State how the graph changes if the driver is distracted by a phone.",
          marks: 1,
          kind: "written",
          modelAnswer: "The ==horizontal section is longer== (longer reaction time). The sloping section is unchanged.",
          markScheme: ["B1 horizontal line/section longer (no change to sloping line); ignore thinking time/distance"],
          commonMistakes: ["Saying \"the thinking time is longer\" without describing the line. The question asks about the graph."],
        },
        {
          label: "b",
          prompt: "State how the graph changes if the road is wet, so the tyres grip less.",
          marks: 1,
          kind: "written",
          modelAnswer: "The ==sloping section is less steep== (smaller magnitude of gradient), so it reaches zero later. The horizontal section is unchanged.",
          markScheme: ["B1 sloping line/section less steep / (magnitude of) gradient smaller; flat part unchanged"],
          commonMistakes: ["Making the braking line steeper: less grip means **smaller** deceleration."],
        },
        {
          label: "c",
          prompt: "Explain, using the graph, why both changes increase the stopping distance.",
          marks: 1,
          kind: "written",
          modelAnswer: "Stopping distance = ==area under the graph==. A longer flat section or a shallower slope both **add area**.",
          markScheme: ["B1 stopping distance = area under graph, and area increases"],
          commonMistakes: ["Saying the car \"takes longer\" without linking to area."],
        },
      ],
    },
  ],

  // ====================================================================
  pastPapers: [
    {
      id: "pp-h556-01-2022-q3",
      paper: "H556/01",
      series: "June 2022",
      question: "Q3 (multiple choice)",
      marks: 1,
      difficulty: 1,
      url: AL1("June%202022", "QP"),
      msUrl: AL1("June%202022", "MS"),
      tests: "What the gradient and area of a v–t graph give.",
      answers: [{ value: "A" }],
      explanation: "Gradient = acceleration, area = displacement. Check the units if unsure: (m s⁻¹) ÷ s and (m s⁻¹) × s.",
    },
    {
      id: "pp-h556-01-2020n-q14",
      paper: "H556/01",
      series: "November 2020",
      question: "Q14 (multiple choice)",
      marks: 1,
      difficulty: 1,
      url: AL1("November%202020", "QP"),
      msUrl: AL1("November%202020", "MS"),
      tests: "Greatest distance from four straight-line v–t graphs.",
      answers: [{ value: "C" }],
      explanation: "Distance = area under each line. Compare areas, not end speeds or steepness.",
    },
    {
      id: "pp-h156-02-2018-q1",
      paper: "H156/02",
      series: "June 2018",
      question: "Q1",
      marks: 5,
      difficulty: 1,
      url: AS2("June%202018", "QP"),
      msUrl: AS2("June%202018", "MS"),
      tests: "Describing constant deceleration from a v–t graph; braking distance from the area relative to a stop line.",
      answers: [{ label: "b", value: 1, unit: "m", tolerancePct: 5 }],
      explanation:
        "(a) Negative gradient → deceleration; straight line → constant. (b) Braking area = ½ × 3 × 14 = 21 m, compared with the 20 m to the line: it stops 1 m past.",
    },
    {
      id: "pp-h156-02-2023-q1",
      paper: "H156/02",
      series: "June 2023",
      question: "Q1(a)(iii), (b), (c)",
      marks: 6,
      difficulty: 2,
      url: AS2("June%202023", "QP"),
      msUrl: AS2("June%202023", "MS"),
      tests: "Stopping distance as area; sketching the graph at half speed; how the line changes for a tired driver or a more resistive surface.",
      answers: [{ label: "a(iii)", value: 37, unit: "m" }],
      explanation:
        "Area = thinking rectangle + braking triangle: 18 × 0.7 + ½ × 18 × 2.7 = 36.9 m. For (b), same reaction time and same gradient from half the speed. For (c), describe the **line**: longer horizontal section; steeper sloping section.",
    },
    {
      id: "pp-h556-01-2025-q16a",
      paper: "H556/01",
      series: "June 2025",
      question: "Q16(a)",
      marks: 6,
      difficulty: 3,
      url: AL1("June%202025", "QP"),
      msUrl: AL1("June%202025", "MS"),
      tests: "Describing how to estimate distance from a curved v–t graph; tangent for acceleration; change of momentum from the graph.",
      answers: [
        { label: "a(ii)", value: 1.5, unit: "m s⁻²", tolerancePct: 17 },
        { label: "a(iii)", value: 95000, unit: "kg m s⁻¹" },
      ],
      explanation:
        "(i) Say **area under the curve**, then count squares × area of one square (or rectangle + triangle). Integration is ignored. (ii) Tangent at the given point; mark scheme allows 1.3–1.7. (iii) Change in velocity read off the graph × mass.",
    },
  ],
};

export default sub;
