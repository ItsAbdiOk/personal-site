import type { Subchapter } from "@/lib/zakiya/types";
import sections from "./3-3/sections";
import explain from "./3-3/explain";
import * as F from "./3-3/figures";

const AS1 = (s: string, t: "QP" | "MS") => `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/${s}%20${t}%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf`;
const AS2 = (s: string, t: "QP" | "MS") => `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-2/${s}%20${t}%20-%20Paper%202%20OCR%20(A)%20Physics%20AS-level.pdf`;
const AL1 = (s: string, t: "QP" | "MS") => `https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/${t}/${s}%20${t}.pdf`;

const sub: Subchapter = {
  slug: "3-3-acceleration",
  number: "3.3",
  title: "Acceleration",
  module: 3,
  chapter: { number: 3, title: "Motion" },
  specRefs: ["3.1.1(a)", "3.1.1(b)", "3.1.1(d)"],
  textbookPages: "27–28",
  colour: "#0071E3",
  summary:
    "How fast velocity changes is called [[acceleration]]: a = Δv/Δt, in m s⁻². You can calculate it from two velocities and a time, or read it as the **gradient** of a velocity–time graph.",
  keyIdea:
    "Acceleration = **rate of change of velocity** = **gradient of the v–t graph**. Δv is always final − initial, so slowing down gives a negative answer.",

  sections,
  explain,

  // ====================================================================
  definitions: [
    {
      term: "acceleration",
      plain: "How much the velocity changes each second. A vector, unit m s⁻².",
      spec: "3.1.1(a) lists acceleration as a term to know; no wording is given",
      textbook: "The acceleration of an object is defined as the rate of change of velocity. a = Δv/Δt.",
      differenceNote:
        "Learn the **textbook wording**: ==rate of change of velocity==, or a = (v − u)/t with every symbol defined. OCR has marked down \"rate of change of **speed**\" and \"change in velocity **per second**\" (a unit mixed into a definition).",
      source: "both",
    },
    {
      term: "deceleration",
      plain: "Slowing down: an acceleration pointing against the motion, so it is negative.",
      textbook: "A negative acceleration is often called deceleration.",
      differenceNote:
        "Not in the spec. Mark schemes accept it (\"Allow deceleration for acceleration\", H156/02 June 2025 Q1(c)). If asked for a deceleration, give its **size** (magnitude) without the minus sign.",
      source: "textbook-only",
    },
    {
      term: "gradient of a velocity–time graph",
      plain: "How steep the v–t line is (rise ÷ run). It equals the acceleration.",
      spec: "3.1.1(d): velocity–time graphs; acceleration is gradient",
      textbook: "acceleration = gradient of velocity–time graph",
      differenceNote:
        "Same fact. In an explanation, write the full sentence \"acceleration = gradient of the velocity–time graph\"; mark schemes want it as a clear statement, not implied.",
      source: "both",
    },
    {
      term: "acceleration at an instant",
      plain: "The acceleration at one moment on a curved v–t graph: the gradient of the tangent there.",
      textbook: "Figure 3: acceleration can be determined from the gradient of the velocity–time graph (a tangent with Δv and Δt drawn on it).",
      differenceNote:
        "The spec doesn't name it. Mark schemes give M1 for a ==tangent drawn at== the stated time and A1 for ==change in y / change in x== (H556/01 June 2025 Q16(a)(ii)). A tangent at the wrong time caps you at 1 mark.",
      source: "both",
    },
  ],

  // ====================================================================
  flashcards: [
    { id: "ac-fc-01", front: "What is the definition of acceleration?", back: "**The rate of change of velocity**: a = Δv/Δt.", tag: "definition", source: "both", page: "27" },
    { id: "ac-fc-02", front: "What is the SI unit of acceleration?", back: "**m s⁻²**: velocity (m s⁻¹) gained per second.", tag: "definition", source: "both", page: "27" },
    { id: "ac-fc-03", front: "Is acceleration a scalar or a vector?", back: "**A vector.** It comes from velocity, so it has a size and a direction.", tag: "concept", source: "both", page: "27" },
    { id: "ac-fc-04", front: "An object moving forwards has a negative acceleration. What is happening to it?", back: "It is **slowing down** (decelerating). The acceleration points against the motion.", tag: "concept", source: "both", page: "27" },
    { id: "ac-fc-05", front: "Why does \"change in velocity per second\" not earn the definition mark for acceleration?", back: "It **mixes a quantity with a unit** (per second). Say \"rate of change of velocity\".", tag: "definition", source: "spec-only" },
    { id: "ac-fc-06", front: "Why is \"rate of change of speed\" the wrong definition of acceleration?", back: "Acceleration is about **velocity**, a vector. A change of direction at steady speed is still an acceleration.", tag: "definition", source: "spec-only" },
    { id: "ac-fc-07", front: "How do you convert a speed in km/h into m s⁻¹?", back: "**Divide by 3.6.** 100 km/h ÷ 3.6 = 27.8 m s⁻¹.", tag: "equation", source: "textbook-only", page: "27" },
    { id: "ac-fc-08", front: "A car goes from 0 to 27.8 m s⁻¹ in 2.46 s. What is its average acceleration?", back: "**11.3 m s⁻²** (27.8 ÷ 2.46). The textbook misprints this as 13.3.", tag: "equation", source: "textbook-only", page: "27" },
    { id: "ac-fc-09", front: "Is a = Δv/Δt printed on the OCR data sheet?", back: "**No.** v = u + at is, and it rearranges to a = (v − u)/t.", tag: "equation", source: "spec-only" },
    { id: "ac-fc-10", front: "What does the gradient of a velocity–time graph represent?", back: "**The acceleration.**", tag: "concept", source: "both", page: "28" },
    { id: "ac-fc-11", front: "How do you find the acceleration at one instant from a curved velocity–time graph?", back: "Draw a **tangent** at that time, then gradient = Δv ÷ Δt using a big triangle on the tangent.", tag: "concept", source: "both", page: "28" },
    { id: "ac-fc-12", front: "What does a horizontal line on a velocity–time graph tell you?", back: "**Zero acceleration**: constant velocity.", tag: "concept", source: "both", page: "28" },
    { id: "ac-fc-13", front: "What does a straight line sloping downwards on a velocity–time graph tell you?", back: "**Constant deceleration** (constant negative gradient).", tag: "concept", source: "both", page: "28" },
    { id: "ac-fc-14", front: "What is the velocity–time graph of an object falling freely from rest with no air resistance?", back: "A **straight line through the origin** with gradient g = 9.81 m s⁻².", tag: "concept", source: "spec-only" },
    { id: "ac-fc-15", front: "What does one straight, sloping section of a v–t graph look like on an acceleration–time graph?", back: "A **flat line** at a height equal to that section's gradient.", tag: "concept", source: "textbook-only", page: "28" },
  ],

  // ====================================================================
  questions: [
    {
      id: "ac-r1",
      title: "Pick the definition",
      style: "Paper 1 MCQ",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2018 Q2",
      parts: [
        {
          prompt: "Which statement is a correct definition of acceleration?",
          marks: 1,
          kind: "mcq",
          options: [
            "Acceleration is the change in velocity per second.",
            "Acceleration is the rate of change of speed.",
            "Acceleration is the rate of change of velocity.",
            "Acceleration is velocity divided by time.",
          ],
          correctIndex: 2,
          modelAnswer: "**C.** Acceleration = ==rate of change of velocity==, a = Δv/Δt.",
          markScheme: ["C"],
          commonMistakes: [
            "**A**: sounds right but puts a unit (\"per second\") in a definition. It was a wrong option in the real June 2018 question.",
            "**B**: speed has no direction. OCR mark schemes reject \"rate of change of speed\".",
            "**D**: needs the **change** in velocity, not the velocity itself.",
          ],
        },
      ],
    },
    {
      id: "ac-r2",
      title: "Falling stone graph",
      style: "Paper 1 MCQ",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2023 Q14",
      stem: "A stone is released from rest and falls freely. Air resistance is negligible. Downwards is positive.",
      parts: [
        {
          prompt: "Which describes the stone's velocity–time graph?",
          marks: 1,
          kind: "mcq",
          options: [
            "A horizontal line at 9.81 m s⁻¹.",
            "A straight line through the origin with gradient 9.81 m s⁻².",
            "A curve through the origin that gets steeper.",
            "A curve through the origin that gets flatter.",
          ],
          correctIndex: 1,
          modelAnswer: "**B.** Constant acceleration g means a constant gradient, so a straight line. It starts at rest, so it goes through the origin.",
          markScheme: ["B"],
          commonMistakes: [
            "**C**: that's the **displacement**–time graph (s grows with t²). Read the y-axis label.",
            "**A**: a flat v–t line means zero acceleration.",
            "**D**: that's falling **with** air resistance, heading for terminal velocity.",
          ],
        },
      ],
    },
    {
      id: "ac-r3",
      title: "Ball reaching terminal velocity",
      style: "Paper 1 MCQ",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2018 Q12",
      stem: "A ball is dropped from rest in air. Its velocity–time graph is a curve that starts at the origin and levels off at terminal velocity.",
      parts: [
        {
          prompt: "Which statement about the ball's acceleration is correct?",
          marks: 1,
          kind: "mcq",
          options: [
            "It is zero at the start and 9.81 m s⁻² at terminal velocity.",
            "It is 9.81 m s⁻² throughout the fall.",
            "It is 9.81 m s⁻² at the start and zero at terminal velocity.",
            "It increases steadily from zero to 9.81 m s⁻².",
          ],
          correctIndex: 2,
          modelAnswer: "**C.** At t = 0 the ball isn't moving, so there's no air resistance: a = g = 9.81 m s⁻² (the initial gradient). At terminal velocity the graph is flat: gradient 0, so a = 0.",
          markScheme: ["C"],
          commonMistakes: [
            "**A**: mixes up the height of the graph (velocity) with its gradient (acceleration).",
            "**B**: true only with no air resistance; the curve shows the gradient falling.",
          ],
        },
      ],
    },
    {
      id: "ac-r4",
      title: "Tram between stops",
      style: "Structured",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2025 Q1",
      stem: "The graph models a tram travelling between two stops.",
      figure: F.figTram,
      parts: [
        {
          label: "a",
          prompt: "Calculate the acceleration of the tram in the first 20 s.",
          marks: 2,
          kind: "numeric",
          answer: { value: 0.6, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer: "a = gradient = Δv/Δt = (12 − 0) ÷ 20 = **0.60 m s⁻²**",
          markScheme: ["C1 gradient / a = 12 ÷ 20", "A1 0.60 m s⁻² (allow 0.6)"],
          commonMistakes: ["Using the time at the end of the journey (104 s) instead of the 20 s the speeding-up took."],
        },
        {
          label: "b",
          prompt: "Calculate the magnitude of the deceleration as the tram stops.",
          marks: 2,
          kind: "numeric",
          answer: { value: 0.5, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer: "Δv = 0 − 12 = −12 m s⁻¹, Δt = 104 − 80 = 24 s.\na = −12 ÷ 24 = −0.50 m s⁻², so deceleration = **0.50 m s⁻²**.",
          markScheme: ["C1 Δt = 104 − 80 = 24 s", "A1 0.50 m s⁻² (ignore sign)"],
          commonMistakes: ["Dividing by 104 s (the time read off the axis) instead of the 24 s the braking took. This gives 0.115 m s⁻²."],
        },
        {
          label: "c",
          prompt: "Suggest why a real tram's velocity–time graph would not look exactly like this.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "The corners would be **rounded / the line curved**: the acceleration can't change **suddenly**, because the motor and brakes take time to reach full force (and it would jolt passengers). Air resistance also **changes with speed**, so the acceleration wouldn't be constant.",
          markScheme: [
            "B1 acceleration/deceleration would change gradually, not suddenly (line curved / not straight at start and end)",
            "B1 reason: brakes/motor can't reach maximum force instantly, OR avoids sudden forces on passengers, OR air resistance/friction changes with speed",
          ],
          commonMistakes: [
            "Just writing \"air resistance\" without saying it **depends on speed**, or talking about the driver's reaction time. The examiners' report flags both as weak answers (H156/02 June 2025 Q1(c)).",
            "Making one point for 2 marks. 2 marks = two separate ideas.",
          ],
        },
      ],
    },
    {
      id: "ac-r5",
      title: "Braking at the lights",
      style: "Structured",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2018 Q1(a)",
      stem: "A car travels at a steady 15 m s⁻¹. At t = 0.80 s the driver brakes. The velocity–time graph then falls in a straight line to zero at t = 3.80 s.",
      parts: [
        {
          label: "a",
          prompt: "State the features of the graph after t = 0.80 s that show the car is decelerating at a constant rate.",
          marks: 2,
          kind: "written",
          modelAnswer: "The gradient is **negative**, so the car is decelerating. The line is **straight** (constant gradient), so the deceleration is constant.",
          markScheme: [
            "B1 ==negative gradient/slope== shows deceleration",
            "B1 ==straight line / constant gradient== shows it is constant",
            "\"Constant negative gradient\" scores both marks",
          ],
          commonMistakes: ["Saying \"the line goes down\" without the word **gradient**: you need to link the shape to acceleration."],
        },
        {
          label: "b",
          prompt: "Calculate the magnitude of the deceleration.",
          marks: 2,
          kind: "numeric",
          answer: { value: 5.0, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer: "Δv = 0 − 15 = −15 m s⁻¹; Δt = 3.80 − 0.80 = 3.00 s.\na = −15 ÷ 3.00 = −5.0 m s⁻², so deceleration = **5.0 m s⁻²**.",
          markScheme: ["C1 Δt = 3.00 s", "A1 5.0 m s⁻² (ignore sign)"],
          commonMistakes: ["Using 3.80 s, the time on the axis, instead of the 3.00 s of braking: gives 3.9 m s⁻²."],
        },
      ],
    },
    {
      id: "ac-r6",
      title: "Electric scooter tangent",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2025 Q16(a)(ii)",
      stem: "An electric scooter starts from rest. Its velocity–time graph is a curve that gets less steep with time. At t = 6.0 s the velocity is 5.1 m s⁻¹. A student draws the tangent at t = 6.0 s; it passes through (0, 1.5 m s⁻¹) and (14.0 s, 9.9 m s⁻¹).",
      parts: [
        {
          label: "a",
          prompt: "Describe how the acceleration of the scooter changes. Explain how the graph shows this.",
          marks: 2,
          kind: "written",
          modelAnswer: "The acceleration **decreases**. Acceleration = gradient of the v–t graph, and the ==gradient decreases== as the curve gets flatter.",
          markScheme: ["B1 acceleration decreases", "B1 acceleration = gradient, and the gradient decreases"],
          commonMistakes: ["Writing \"the gradient is smaller\": examiners wanted \"the gradient **decreases** (with time)\" (H156/02 June 2019 Q1(c))."],
        },
        {
          label: "b",
          prompt: "Calculate the acceleration of the scooter at t = 6.0 s.",
          marks: 2,
          kind: "numeric",
          answer: { value: 0.6, unit: "m s⁻²", tolerancePct: 3 },
          modelAnswer: "Gradient of the tangent = (9.9 − 1.5) ÷ (14.0 − 0) = 8.4 ÷ 14.0 = **0.60 m s⁻²**",
          markScheme: ["M1 tangent at t = 6.0 s used", "A1 change in y / change in x = 0.60 m s⁻²"],
          commonMistakes: [
            "Doing 5.1 ÷ 6.0 = 0.85 m s⁻². That is the average acceleration over the first 6 s, not the value at 6.0 s.",
            "Drawing a tangent that crosses the curve or sits at the wrong time. Examiners capped this at 1 mark (H556/01 June 2025 Q16(a)(ii)).",
          ],
        },
      ],
    },
    {
      id: "ac-r7",
      title: "The bounce",
      style: "Structured",
      difficulty: 3,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2019 Q1(a)(i) and H156/01 June 2019 Q22(d)",
      stem: "A ball is dropped from rest. Take downwards as positive. Its velocity–time graph is a straight line from the origin to 5.4 m s⁻¹ at t = 0.55 s, when it hits the floor. It leaves the floor at 4.0 m s⁻¹ **upwards**, after 0.020 s in contact.",
      parts: [
        {
          label: "a",
          prompt: "Show that the acceleration of the ball before it hits the floor is about 10 m s⁻².",
          marks: 2,
          kind: "numeric",
          answer: { value: 9.8, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer: "a = gradient = 5.4 ÷ 0.55 = **9.8 m s⁻²** (9.82), which is about 10 m s⁻².",
          markScheme: ["C1 gradient = 5.4/0.55", "A1 9.8 m s⁻² (to more s.f. than the 'show that' value)"],
          commonMistakes: ["Writing 10 as the answer. In a 'show that', give a more precise value than the one in the question."],
        },
        {
          label: "b",
          prompt: "Calculate the magnitude of the average acceleration of the ball while it is in contact with the floor.",
          marks: 3,
          kind: "numeric",
          answer: { value: 470, unit: "m s⁻²", tolerancePct: 2 },
          modelAnswer:
            "Downwards +: before = +5.4 m s⁻¹, after = −4.0 m s⁻¹.\nΔv = −4.0 − 5.4 = −9.4 m s⁻¹.\na = −9.4 ÷ 0.020 = −470 m s⁻², magnitude **470 m s⁻²** (upwards).",
          markScheme: ["C1 Δv = 5.4 + 4.0 = 9.4 m s⁻¹ (direction change accounted for)", "C1 a = 9.4 ÷ 0.020", "A1 470 m s⁻²"],
          commonMistakes: [
            "Using Δv = 5.4 − 4.0 = 1.4 m s⁻¹, giving 70 m s⁻². Velocity is a vector: the ball **reverses**, so the changes add. Examiners saw this exact slip (H156/01 June 2019 Q22(d)).",
          ],
        },
      ],
    },
  ],

  // ====================================================================
  pastPapers: [
    {
      id: "pp-h156-01-2023-q14",
      paper: "H156/01",
      series: "June 2023",
      question: "Q14 (multiple choice)",
      marks: 1,
      difficulty: 1,
      url: AS1("June%202023", "QP"),
      msUrl: AS1("June%202023", "MS"),
      tests: "Choosing the v–t graph of a freely falling object.",
      answers: [{ value: "A" }],
      explanation: "Constant acceleration g from rest: straight line through the origin. B was the most common wrong choice, so check the axis and the shape carefully.",
    },
    {
      id: "pp-h556-01-2018-q12",
      paper: "H556/01",
      series: "June 2018",
      question: "Q12 (multiple choice)",
      marks: 1,
      difficulty: 1,
      url: AL1("June%202018", "QP"),
      msUrl: AL1("June%202018", "MS"),
      tests: "Reading acceleration off a v–t curve that reaches terminal velocity.",
      answers: [{ value: "C" }],
      explanation: "At t = 0 there's no air resistance yet, so the initial gradient is g = 9.81 m s⁻².",
    },
    {
      id: "pp-h156-01-2022-q21",
      paper: "H156/01",
      series: "June 2022",
      question: "Q21",
      marks: 7,
      difficulty: 2,
      url: AS1("June%202022", "QP"),
      msUrl: AS1("June%202022", "MS"),
      tests: "Buggy v–t graph: distance from area, acceleration from gradient, then resolving forces.",
      answers: [
        { label: "a", value: 71, unit: "m", tolerancePct: 2 },
        { label: "b(i)", value: 2.0, unit: "m s⁻²", tolerancePct: 2 },
        { label: "b(ii)", value: 90, unit: "N", tolerancePct: 3 },
      ],
      explanation: "(b)(i) is the 3.3 part: gradient = Δv ÷ Δt from the straight section. (a) needs areas (3.4); (b)(ii) needs F = ma and resolving (Ch 4).",
    },
    {
      id: "pp-h156-02-2019-q1",
      paper: "H156/02",
      series: "June 2019",
      question: "Q1",
      marks: 12,
      difficulty: 2,
      url: AS2("June%202019", "QP"),
      msUrl: AS2("June%202019", "MS"),
      tests: "Bouncing tennis ball v–t graph: acceleration, KE, velocity after the bounce, effect of air resistance.",
      answers: [
        { label: "a(i)", value: 9.8, unit: "m s⁻²", tolerancePct: 2 },
        { label: "a(ii)", value: 0.63, unit: "J", tolerancePct: 2 },
        { label: "b(i)", value: 4.2, unit: "m s⁻¹", tolerancePct: 2 },
        { label: "b(iii)", value: 0.9, unit: "m", tolerancePct: 5 },
      ],
      explanation: "(a)(i) gradient of the straight line. (b)(ii) after the bounce the line is parallel (same g). (c) with air resistance the line curves: say the gradient **decreases**, not \"is smaller\".",
    },
  ],
};

export default sub;
