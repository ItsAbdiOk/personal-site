import type { Subchapter } from "@/lib/zakiya/types";
import sectionsA from "./3-8/sections-a";
import sectionsB from "./3-8/sections-b";
import sectionsC from "./3-8/sections-c";
import explainCore from "./3-8/explain-core";
import explainA from "./3-8/explain-a";
import explainB from "./3-8/explain-b";
import explainC from "./3-8/explain-c";

const sub: Subchapter = {
  slug: "3-8-projectile-motion",
  number: "3.8",
  title: "Projectile motion",
  module: 3,
  chapter: { number: 3, title: "Motion" },
  specRefs: ["3.1.3(a)", "3.1.3(b)"],
  textbookPages: "40–43",
  colour: "#0071E3",
  summary:
    "A [[projectile]] is anything thrown, kicked or fired that then moves under gravity alone. Split its motion into a **horizontal** part and a **vertical** part and solve each one separately.",
  keyIdea:
    "Horizontal: **constant velocity** (a = 0). Vertical: **constant acceleration** g downwards. The only thing the two directions share is **time**.",

  sections: [...sectionsA, ...sectionsB, ...sectionsC],
  explain: { ...explainA, ...explainB, ...explainC, ...explainCore },

  // ====================================================================
  definitions: [
    {
      term: "projectile",
      plain: "Something launched (thrown, kicked, fired, dropped) that then moves under gravity alone.",
      differenceNote:
        "Neither the spec nor the textbook gives a one-line definition: the spec uses the word, and the textbook just puts it in bold. If asked, a safe answer is: **an object moving under the influence of gravity only (air resistance negligible)**. Always mention that the only force is its weight.",
      source: "both",
    },
    {
      term: "independence of horizontal and vertical motion",
      plain: "What happens sideways does not change what happens up and down, and vice versa. Only time is shared.",
      spec: "independence of the vertical and horizontal motion of a projectile",
      textbook: "The vertical and horizontal motions of the ball are independent of each other.",
      differenceNote:
        "Same idea; neither is a full exam answer on its own. Marks come from the **physics**: the horizontal velocity is constant because there is no horizontal force (weight is vertical), the vertical acceleration is g regardless of horizontal speed, and the time is the same for both. Say those three things and you are safe either way.",
      source: "both",
    },
    {
      term: "two-dimensional projectile motion",
      plain: "Motion in a flat plane: steady speed sideways, steady acceleration downwards.",
      spec: "two-dimensional motion of a projectile with constant velocity in one direction and constant acceleration in a perpendicular direction",
      textbook: "Listed as a learning outcome (the two-dimensional motion of projectiles) without the detail.",
      differenceNote:
        "The **spec wording is more precise** and is the one to learn: it tells you the physics (constant velocity one way, constant acceleration at 90° to it). The textbook wording would not earn a mark by itself because it says nothing about velocity or acceleration.",
      source: "both",
    },
    {
      term: "component",
      plain: "The part of a velocity that points in one chosen direction, e.g. horizontal or vertical.",
      spec: "Data sheet: Fx = F cos θ, Fy = F sin θ (resolving any vector, Module 2)",
      textbook: "Horizontal component v cos θ and vertical component v sin θ for a launch at θ to the horizontal.",
      differenceNote:
        "No real difference: the data sheet gives the general rule, the textbook applies it to launch velocity. Mark schemes just want the correct trig with the angle measured from the right line.",
      source: "both",
    },
    {
      term: "time of flight",
      plain: "How long the projectile is in the air, from launch to landing.",
      differenceNote:
        "Textbook term only (in bold, not formally defined). The spec never uses it, but exam questions do say \"time of flight\", so know what it means. No marks for a definition: it is always a calculation.",
      source: "textbook-only",
    },
    {
      term: "range",
      plain: "The horizontal distance from the launch point to the landing point.",
      differenceNote:
        "Textbook term (labelled on its cliff diagram); not in the spec. Be careful: range means **horizontal** distance only, not the length of the curved path and not the straight-line distance.",
      source: "textbook-only",
    },
  ],

  // ====================================================================
  flashcards: [
    { id: "pm-fc-01", front: "What is a projectile?", back: "An object moving under the influence of **gravity only** (air resistance ignored), such as a kicked ball or a dropped phone.", tag: "definition", source: "both", page: "40–43" },
    { id: "pm-fc-02", front: "What is the horizontal acceleration of a projectile when air resistance is negligible?", back: "**Zero.** So the horizontal component of velocity stays constant for the whole flight.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-03", front: "What is the vertical acceleration of a projectile when air resistance is negligible?", back: "**g = 9.81 m s⁻² downwards** at every point of the flight (a = −9.81 m s⁻² if you take up as positive).", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-04", front: "Why is the horizontal velocity of a projectile constant?", back: "Its weight acts vertically, so there is **no horizontal force** and therefore no horizontal acceleration.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-05", front: "Which quantity is the same for the horizontal and the vertical motion of a projectile?", back: "**Time.** Find t from one direction, then use it in the other.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-06", front: "One ball is dropped and another is launched horizontally from the same height at the same instant. Which lands first (no air resistance)?", back: "**Neither: they land at the same time.** Vertical motion is independent of horizontal speed.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-07", front: "A projectile is launched at speed u at angle θ above the horizontal. What is the horizontal component of its velocity?", back: "**u cos θ**", tag: "equation", source: "both", page: "40–43" },
    { id: "pm-fc-08", front: "A projectile is launched at speed u at angle θ above the horizontal. What is the vertical component of its velocity?", back: "**u sin θ**", tag: "equation", source: "both", page: "40–43" },
    { id: "pm-fc-09", front: "For an object launched horizontally, what is the initial vertical component of its velocity?", back: "**Zero.** Vertically it behaves exactly like a dropped object.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-10", front: "What is a projectile's velocity at its highest point?", back: "**Horizontal, equal to u cos θ.** Only the vertical component is zero, so the velocity (and KE) is not zero.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-11", front: "What is a projectile's acceleration at its highest point?", back: "**9.81 m s⁻² downwards**, the same as everywhere else in the flight. It is not zero.", tag: "concept", source: "both", page: "40–43" },
    { id: "pm-fc-12", front: "Which of the SUVAT equations are given on the OCR data sheet?", back: "**All four:** v = u + at, s = ½(u + v)t, s = ut + ½at², v² = u² + 2as.", tag: "equation", source: "spec-only" },
    { id: "pm-fc-13", front: "Are the equations for resolving a vector into components on the OCR data sheet?", back: "**Yes**, as $F_x$ = F cos θ and F (vertical) = F sin θ.", tag: "equation", source: "spec-only" },
    { id: "pm-fc-14", front: "How do you find the magnitude of a projectile's velocity from its horizontal and vertical components?", back: "**Pythagoras:** v = √(horizontal² + vertical²). Not on the data sheet.", tag: "equation", source: "both", page: "40–43" },
    { id: "pm-fc-15", front: "How do you find the angle of a projectile's velocity to the horizontal from its components?", back: "**θ = tan⁻¹(vertical component ÷ horizontal component).** Not on the data sheet. The inverse ratio gives the angle to the vertical.", tag: "equation", source: "both", page: "40–43" },
    { id: "pm-fc-16", front: "What shape is the path of a projectile when air resistance is negligible?", back: "A **parabola**.", tag: "concept", source: "textbook-only", page: "40–43" },
    { id: "pm-fc-17", front: "A projectile is launched and lands on flat ground with no air resistance. How does its landing speed compare with its launch speed?", back: "**They are equal.** The vertical component has the same size but opposite direction, and time up = time down.", tag: "concept", source: "textbook-only", page: "40–43" },
    { id: "pm-fc-18", front: "How does air resistance change the path of a projectile?", back: "**Lower** maximum height, **shorter** range, and **not symmetric**: the path is always below the ideal one and steeper on the way down.", tag: "concept", source: "spec-only" },
  ],

  // ====================================================================
  questions: [
    // ---------------- MCQs ----------------
    {
      id: "pm-r1",
      title: "Kinetic energy at the top",
      style: "Paper 1 MCQ",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2016 Q18",
      stem: "A ball is thrown from the ground at an angle of 40° above the horizontal. Its initial kinetic energy is E. Air resistance is negligible.",
      parts: [
        {
          prompt: "What is the kinetic energy of the ball at its maximum height?",
          marks: 1,
          kind: "mcq",
          options: ["0", "0.41E", "0.59E", "0.77E"],
          correctIndex: 2,
          modelAnswer:
            "**C.** At the top only the horizontal component is left: v = u cos 40°. KE ∝ v^2^, so KE = cos^2^40° × E = 0.587E ≈ **0.59E**.",
          markScheme: ["C"],
          commonMistakes: [
            "**A (0)**: \"it stops at the top\". Only $v_y$ is zero; the ball still has a horizontal velocity. In the real June 2016 question the zero option was the most popular wrong answer.",
            "**D (0.77E)**: uses cos 40° without squaring. KE depends on **speed squared**.",
            "**B (0.41E)**: uses sin^2^40°, the share of KE that went into GPE, not what is left.",
          ],
        },
      ],
    },
    {
      id: "pm-r2",
      title: "Resultant force with drag",
      style: "Paper 1 MCQ",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2018 Q3",
      stem: "A netball is on the **falling** part of its path, moving forwards and downwards. Air resistance on the ball is small compared with its weight.",
      parts: [
        {
          prompt: "Which statement best describes the direction of the resultant force on the ball?",
          marks: 1,
          kind: "mcq",
          options: [
            "Along the direction of the ball's velocity.",
            "Vertically downwards.",
            "Downwards, tilted slightly backwards (against the horizontal motion).",
            "Opposite to the direction of the ball's velocity.",
          ],
          correctIndex: 2,
          modelAnswer:
            "**C.** Two forces act: weight (vertically down, large) and drag (opposite to the velocity, so backwards and upwards, small). Add them as vectors: the resultant is mostly downwards with a small backwards component.",
          markScheme: ["C"],
          commonMistakes: [
            "**A**: force does not have to point the way an object moves. In the real 2018 question, answers pointing along the motion were the popular distractors.",
            "**B**: true only with **no** air resistance. The question says drag is small, not zero.",
            "**D**: that is the drag on its own. Weight is much bigger, so it dominates the resultant.",
          ],
        },
      ],
    },
    {
      id: "pm-r3",
      title: "The weightless sensor",
      style: "Paper 1 MCQ",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2025 Q17(b)(ii) and H556/03 November 2020 Q4(a)",
      stem: "A force sensor sits on the floor of a closed box. The box is thrown and moves as a projectile. Air resistance is negligible. While the box is in flight the sensor reads zero.",
      parts: [
        {
          prompt: "Which statement explains the zero reading?",
          marks: 1,
          kind: "mcq",
          options: [
            "There is no gravitational force on the sensor once the box has been thrown.",
            "The box and the sensor both have acceleration g, so there is no contact force between them.",
            "The resultant force on the sensor is zero.",
            "The sensor falls more slowly than the box.",
          ],
          correctIndex: 1,
          modelAnswer:
            "**B.** The box and the sensor have the **same acceleration (g)**. The floor does not need to push on the sensor to make it accelerate, so there is **no contact force**: that is what \"weightless\" means here.",
          markScheme: ["B"],
          commonMistakes: [
            "**A**: gravity still acts: it is the weight that makes both accelerate at g. \"No gravity\" answers are rejected by examiners.",
            "**C**: the resultant force is the weight, not zero. \"No resultant force\" is a listed misconception in the Autumn 2020 H556/03 report.",
            "**D**: all objects fall with the same acceleration regardless of mass.",
          ],
        },
      ],
    },

    // ---------------- Structured ----------------
    {
      id: "pm-r4",
      title: "Dog-ball launcher",
      style: "Structured",
      difficulty: 1,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/01 June 2023 Q24(b) and H556/01 November 2021 Q21(b)(ii)",
      stem: "A ball launcher for dogs fires a tennis ball **horizontally** at 9.0 m s⁻¹ from a height of 1.25 m above level ground. A dog waits in a marked zone that runs from 4.0 m to 4.8 m from the point directly below the launcher. Air resistance is negligible.",
      parts: [
        {
          label: "a",
          prompt: "Calculate the time taken for the ball to reach the ground.",
          marks: 2,
          kind: "numeric",
          answer: { value: 0.505, unit: "s", tolerancePct: 2 },
          modelAnswer:
            "Vertically: $u_V$ = 0, a = 9.81 m s⁻², s = 1.25 m.\ns = ½at^2^ → 1.25 = ½ × 9.81 × t^2^ → $t = \\sqrt{\\dfrac{2 \\times 1.25}{9.81}}$ = **0.505 s**",
          markScheme: ["C1 1.25 = ½ × 9.81 × t^2^", "A1 0.50 s", "Allow 0.505 s; not a method using u = 9.0 m s⁻¹ vertically"],
          commonMistakes: [
            "Putting 9.0 m s⁻¹ in as the vertical u. Launched horizontally means $u_V$ = **0**. Examiners flagged exactly this in June 2022 H156/01 Q23(d).",
            "Forgetting the ½, giving t = 0.357 s.",
          ],
        },
        {
          label: "b",
          prompt: "Show that the ball lands inside the zone.",
          marks: 3,
          kind: "written",
          modelAnswer:
            "Horizontal velocity is constant: x = 9.0 × 0.505 = **4.54 m**.\nThe zone runs from 4.0 m to 4.8 m, and **4.0 m < 4.54 m < 4.8 m**, so the ball lands inside it.",
          markScheme: [
            "M1 x = 9.0 × 0.505 (= 4.54 m); possible ECF from (a)",
            "C1 zone limits 4.0 m and 4.8 m identified",
            "A1 explicit comparison: 4.0 < 4.54 < 4.8 (m). This mark can be implied by a clear statement using both limits",
          ],
          commonMistakes: [
            "Stopping at 4.54 m. In the real question, examiners said the ones who dropped marks had not clearly compared the landing point with the **full** range of the target.",
            "Comparing with one edge only (\"4.54 > 4.0 so it lands in\"). It must also be below 4.8 m.",
          ],
        },
        {
          label: "c",
          prompt: "The launcher is turned up so it fires at 12.0 m s⁻¹ from the same height. Explain how the time of flight changes.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "The time of flight **does not change** (still 0.505 s). It depends only on the vertical motion: the **distance of fall is the same** and the **initial vertical velocity is still zero**, so $t = \\sqrt{2h/g}$ has no v in it.",
          markScheme: [
            "B1 time of flight is unchanged / independent of speed (AW)",
            "B1 because the height (distance of fall) is the same and the initial vertical velocity is zero; allow algebraic answer t = √(2h/g)",
          ],
          commonMistakes: [
            "\"Faster ball, less time in the air.\" The Autumn 2021 H556/01 report lists this as a common misconception.",
            "Saying \"it stays the same\" with no reason: that is only 1 of the 2 marks.",
          ],
        },
        {
          label: "d",
          prompt: "Calculate where the ball now lands.",
          marks: 1,
          kind: "numeric",
          answer: { value: 6.06, unit: "m", tolerancePct: 2 },
          modelAnswer: "x = 12.0 × 0.505 = **6.06 m** from the launcher: past the zone. Distance ∝ launch speed because the time of flight is constant.",
          markScheme: ["B1 6.1 m (allow 6.0 m); ECF from (a)"],
          commonMistakes: ["Recalculating a new, shorter time. Same height → same time."],
        },
      ],
    },
    {
      id: "pm-r5",
      title: "Throw measured from the vertical",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H156/02 June 2023 Q3 (energy route as in H156/02 June 2022 Q4(b)(ii))",
      stem: "A ball of mass 0.145 kg leaves a player's hand 1.80 m above level ground with a speed of 15.0 m s⁻¹ at an angle of **78.0° to the vertical**. Air resistance is negligible.",
      parts: [
        {
          label: "a",
          prompt: "Show that the initial vertical component of the ball's velocity is about 3.1 m s⁻¹.",
          marks: 1,
          kind: "numeric",
          answer: { value: 3.12, unit: "m s⁻¹", tolerancePct: 1 },
          modelAnswer: "The angle is from the **vertical**, so the vertical side is next to it: $u_V$ = 15.0 cos 78.0° = **3.12 m s⁻¹**. (Same as 15.0 sin 12.0°.)",
          markScheme: ["M1 15.0 × cos 78.0° (= 3.119)", "ALLOW 15.0 × sin 12.0°", "A0 (show that)"],
          commonMistakes: [
            "Using sin 78.0° out of habit, giving 14.7 m s⁻¹. **Sketch the triangle**: the angle here is measured from the vertical.",
            "Writing only \"= 3.1\": a show-that needs at least one more significant figure than the value given.",
          ],
        },
        {
          label: "b",
          prompt: "Show that the vertical component of the velocity as the ball reaches the ground is about 6.7 m s⁻¹.",
          marks: 2,
          kind: "numeric",
          answer: { value: 6.71, unit: "m s⁻¹", tolerancePct: 1 },
          modelAnswer:
            "Down positive: u = 3.12 m s⁻¹ (the ball first goes up, but on returning to hand height it is moving down at 3.12 m s⁻¹; $v^2 = u^2 + 2as$ handles this automatically), s = 1.80 m, a = 9.81 m s⁻².\nv^2^ = 3.12^2^ + 2 × 9.81 × 1.80 = 45.0\nv = √45.0 = **6.71 m s⁻¹**",
          markScheme: ["M1 v^2^ = 3.12^2^ + 2 × 9.81 × 1.80 (= 45.0)", "M1 v = √45.0 = 6.71 (square root step must be seen)", "A0 (show that); ALLOW ECF from (a)"],
          commonMistakes: [
            "Not showing the √ step. Examiners for the real question said the square root of v^2^ had to be shown.",
            "Using g = 10. Write 9.81 in the substitution.",
          ],
        },
        {
          label: "c",
          prompt: "Calculate the kinetic energy of the ball as it reaches the ground.",
          marks: 3,
          kind: "numeric",
          answer: { value: 18.9, unit: "J", tolerancePct: 2 },
          modelAnswer:
            "**Route 1 (components):** $u_H$ = 15.0 sin 78.0° = 14.67 m s⁻¹ (constant). v^2^ = 14.67^2^ + 6.71^2^ = 260. KE = ½ × 0.145 × 260 = **18.9 J**\n**Route 2 (energy):** KE at release = ½ × 0.145 × 15.0^2^ = 16.3 J. GPE lost = 0.145 × 9.81 × 1.80 = 2.56 J. KE at ground = 16.3 + 2.56 = **18.9 J**",
          markScheme: [
            "C1 $u_H$ = 15.0 sin 78.0° (= 14.7) OR ΔGPE = 0.145 × 9.81 × 1.80 (= 2.56 J)",
            "C1 v^2^ = 14.7^2^ + 6.71^2^ (= 260) OR initial KE = ½ × 0.145 × 15.0^2^ (= 16.3 J)",
            "A1 18.9 J; ALLOW 19 J",
            "Not 3.3 J (vertical component only); not 16.3 J (GPE not added)",
          ],
          commonMistakes: [
            "Using 6.71 m s⁻¹ only (3.3 J). In June 2023 H156/02 Q3(c) this was **the** common error: leaving out the horizontal KE.",
            "Calculating ½mu^2^ = 16.3 J and forgetting the 1.80 m drop. June 2022 H156/02 Q4(b)(ii) examiners saw the same.",
          ],
        },
        {
          label: "d",
          prompt: "Calculate the angle between the ball's velocity and the ground as it lands.",
          marks: 2,
          kind: "numeric",
          answer: { value: 24.6, unit: "°", tolerancePct: 2 },
          modelAnswer: "$\\tan\\theta = \\dfrac{v_V}{v_H} = \\dfrac{6.71}{14.67}$ → $\\theta$ = **24.6°** below the horizontal.",
          markScheme: ["C1 tan θ = 6.71 ÷ 14.7", "A1 25° (allow 24.6°); ALLOW ECF from (b)", "Not 65° (angle to the vertical)"],
          commonMistakes: [
            "Inverting the ratio (65.4°): that is the angle to the **vertical**.",
            "Using distances or energies instead of velocity components: the wrong routes seen in June 2022 H156/02 Q4(b)(iii).",
          ],
        },
        {
          label: "e",
          prompt: "Explain why the momentum of the ball changes during its flight.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "**Momentum = mass × velocity.** The ball's vertical velocity (and so its speed) increases as it falls, and its direction changes, so its momentum changes. (Or: force = rate of change of momentum, and its weight acts on it throughout.)",
          markScheme: [
            "M1 (change of) momentum = mass × (change of) velocity OR force = rate of change of momentum OR momentum is a vector",
            "A1 velocity increases / weight (gravitational force) acts on the ball / direction changes, so momentum changes; ALLOW changes for increases",
          ],
          commonMistakes: [
            "Jumping straight to \"it speeds up\". For full marks the real mark scheme wanted a property of momentum stated first (e.g. p = mv).",
          ],
        },
      ],
    },
    {
      id: "pm-r6",
      title: "Spring-loaded launcher",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2022 Q16(b)",
      stem: "A toy launcher uses a spring of force constant 240 N m⁻¹. The spring is compressed by 5.0 cm and released, firing a ball of mass 12 g **horizontally** from the edge of a table 0.95 m above the floor. Assume all the elastic potential energy becomes kinetic energy of the ball.",
      parts: [
        {
          label: "a",
          prompt: "Show that the elastic potential energy stored in the spring is about 0.3 J.",
          marks: 1,
          kind: "numeric",
          answer: { value: 0.3, unit: "J", tolerancePct: 1 },
          modelAnswer: "E = ½kx^2^ = ½ × 240 × 0.050^2^ = **0.30 J**",
          markScheme: ["M1 ½ × 240 × 0.050^2^", "A0 (show that)"],
          commonMistakes: ["Using x = 5.0 (cm) gives 3000 J: a power-of-ten (POT) slip. Convert to metres."],
        },
        {
          label: "b",
          prompt: "Show that the speed of the ball as it leaves the launcher is about 7 m s⁻¹.",
          marks: 2,
          kind: "numeric",
          answer: { value: 7.07, unit: "m s⁻¹", tolerancePct: 1 },
          modelAnswer: "0.30 = ½ × 0.012 × v^2^ → v^2^ = 50 → v = **7.07 m s⁻¹**",
          markScheme: ["M1 0.30 = ½ × 0.012 × v^2^", "M1 v = √50 = 7.07", "A0 (show that)"],
          commonMistakes: ["Using m = 12 (g) instead of 0.012 kg.", "Stopping at v^2^ = 50 without the square root."],
        },
        {
          label: "c",
          prompt: "Calculate the horizontal distance R from the edge of the table to where the ball lands.",
          marks: 3,
          kind: "numeric",
          answer: { value: 3.11, unit: "m", tolerancePct: 2 },
          modelAnswer:
            "Vertical: $u_V$ = 0, so 0.95 = ½ × 9.81 × t^2^ → t = **0.440 s**.\nHorizontal: R = 7.07 × 0.440 = **3.11 m**",
          markScheme: [
            "C1 0.95 = ½ × 9.81 × t^2^",
            "C1 t = 0.44 s",
            "A1 3.1 m",
            "Allow 7 m s⁻¹ or 7.1 m s⁻¹ instead of 7.07 (3.08–3.12 m); possible ECF from (b)",
          ],
          commonMistakes: [
            "Trying to find the time from the horizontal motion. As the real report put it, successful candidates used the **vertical** motion to find the time, then used that time for the range.",
            "Putting 7.07 m s⁻¹ into the vertical equation.",
          ],
        },
        {
          label: "d",
          prompt: "Explain how the value of R calculated in (c) compares with the actual value.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "The **actual distance is smaller**. Air resistance (drag) reduces the ball's speed during flight, **and/or** not all the elastic energy becomes KE of the ball (the spring itself moves and there is friction in the launcher), so the launch speed is less than 7.07 m s⁻¹.",
          markScheme: [
            "M1 (actual distance is) smaller than calculated R",
            "A1 valid reason: drag/air resistance reduces speed in flight, OR initial speed smaller because not all the energy is transferred to the ball (spring has KE / friction)",
            "Ignore references to efficiency and unqualified energy dissipation",
          ],
          commonMistakes: [
            "\"Energy is lost\" with no mechanism: ignored in the real mark scheme.",
            "Saying the actual R is bigger. Every real effect here reduces the range.",
          ],
        },
      ],
    },
    {
      id: "pm-r7",
      title: "Long pass on a level pitch",
      style: "Structured",
      difficulty: 2,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 November 2020 Q18(a)–(c), with H156/02 June 2016 Q3(c)",
      stem: "A footballer kicks a ball of mass 0.43 kg from the ground at 22.0 m s⁻¹ at 35.0° above the horizontal, aiming for a teammate standing 50.0 m away on level ground. Air resistance is negligible.",
      parts: [
        {
          label: "a",
          prompt: "Describe how the kinetic energy of the ball changes from the moment it is kicked until it reaches its maximum height.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "The KE **decreases** as the ball rises, because KE is transferred to GPE. At maximum height the KE is a **minimum but not zero**, because the ball still has its horizontal velocity (22.0 cos 35.0°).",
          markScheme: [
            "B1 KE decreases (with height); allow KE is transferred to GPE",
            "B1 at maximum height KE is minimum / non-zero",
            "Not references to KE being a vector / having components for the second mark",
          ],
          commonMistakes: ["\"KE falls to zero at the top.\" Only the **vertical** velocity is zero there."],
        },
        {
          label: "b",
          prompt: "Show that the time taken for the ball to reach its maximum height is about 1.3 s.",
          marks: 2,
          kind: "numeric",
          answer: { value: 1.29, unit: "s", tolerancePct: 1 },
          modelAnswer: "$u_V$ = 22.0 sin 35.0° = 12.6 m s⁻¹. At the top $v_V$ = 0: 0 = 12.6 − 9.81t → t = **1.29 s**",
          markScheme: [
            "C1 $u_V$ = 22.0 sin 35.0° (= 12.6)",
            "C1 t = 12.6 ÷ 9.81 (= 1.29 s)",
            "A0 (show that)",
            "Not t = 50.0 ÷ (22.0 cos 35.0°) — zero marks",
          ],
          commonMistakes: ["Dividing the 50.0 m by the horizontal speed: that is not the time to the top, and scores nothing."],
        },
        {
          label: "c",
          prompt: "Calculate the kinetic energy of the ball at its maximum height.",
          marks: 2,
          kind: "numeric",
          answer: { value: 69.8, unit: "J", tolerancePct: 2 },
          modelAnswer: "At the top v = $v_H$ = 22.0 cos 35.0° = 18.0 m s⁻¹.\nKE = ½ × 0.43 × 18.0^2^ = **69.8 J**",
          markScheme: ["C1 v = 22.0 cos 35.0° (= 18.0)", "A1 70 J", "Not 104 J (22.0 used); not 34 J (vertical component used)"],
          commonMistakes: [
            "Using the launch speed (104 J) or the vertical component (34 J). Examiners for June 2018 H556/01 Q16(a)(iv) saw both.",
          ],
        },
        {
          label: "d",
          prompt: "Calculate the distance by which the ball misses the teammate.",
          marks: 3,
          kind: "numeric",
          answer: { value: 3.64, unit: "m", tolerancePct: 3 },
          modelAnswer:
            "Level ground, so time of flight = 2 × 1.286 = 2.57 s.\nRange = 18.02 × 2.573 = 46.4 m (keep the unrounded values in your calculator).\nIt lands 50.0 − 46.4 = **3.6 m short** of the teammate.",
          markScheme: [
            "C1 time of flight = 2 × 1.29 (= 2.57 s)",
            "C1 range = 22.0 cos 35.0° × 2.57 (= 46.4 m)",
            "A1 3.6 m",
            "Allow 3.1–3.2 m if t = 1.3 s (2.6 s) used; allow 18.0 × 1.29 for 1 mark",
          ],
          commonMistakes: [
            "Using only the time to the top (range 23 m, \"misses by 27 m\").",
            "Rounding t to 1.3 s before the last step changes the answer to 3.1–3.2 m. Keep the unrounded value in your calculator.",
          ],
        },
        {
          label: "e",
          prompt: "Air resistance is not negligible in reality. Describe how the path of the ball would differ.",
          marks: 2,
          kind: "written",
          modelAnswer:
            "The path is **always below** the no-drag path: a lower maximum height, **reached sooner** (at a smaller horizontal distance). It is no longer symmetric: it comes down more steeply and lands **shorter**.",
          markScheme: [
            "M1 path always below the original path / lower maximum height",
            "A1 maximum height reached sooner (closer to the kicker) OR asymmetric, steeper descent, shorter range",
          ],
          commonMistakes: ["Drawing or describing a path that rises **higher**. Drag opposes the upward motion too."],
        },
      ],
    },
    {
      id: "pm-r8",
      title: "Gun launch to space",
      style: "Structured",
      difficulty: 3,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/03 June 2024 Q3(b) and H556/01 June 2025 Q17(b)(i)",
      stem: "An engineer proposes a gun that fires a small payload at 2.40 km s⁻¹ at 80.0° to the horizontal. In a first model, g = 9.81 m s⁻² throughout the flight and air resistance is ignored. Radius of the Earth = 6400 km.",
      parts: [
        {
          label: "a",
          prompt: "Show that the initial vertical component of the velocity is about 2.36 km s⁻¹.",
          marks: 1,
          kind: "numeric",
          answer: { value: 2.364, unit: "km s⁻¹", tolerancePct: 0.5 },
          modelAnswer: "$u_V$ = 2.40 sin 80.0° = **2.364 km s⁻¹** (2364 m s⁻¹)",
          markScheme: ["M1 2.40 × sin 80.0° = 2.364", "A0 (show that)"],
          commonMistakes: ["Using cos 80.0° (0.417 km s⁻¹). The 2024 report lists leaving out the sine, or using cos, as a common problem."],
        },
        {
          label: "b",
          prompt: "Using the first model, estimate the maximum height H reached by the payload.",
          marks: 2,
          kind: "numeric",
          answer: { value: 285, unit: "km", tolerancePct: 2 },
          modelAnswer: "At the top $v_V$ = 0: 0 = 2364^2^ − 2 × 9.81 × H\nH = 2364^2^ ÷ 19.62 = 2.85 × 10^5^ m = **285 km**",
          markScheme: ["C1 0 = 2364^2^ − 2 × 9.81 × H", "A1 2.8 × 10^5^ m (285 km)", "Not 8.9 km (cos 80.0° used)"],
          commonMistakes: [
            "Using 2.364 in km s⁻¹ with g in m s⁻² gives 0.285: a unit mix-up. Work in metres and seconds, then convert. The 2024 report flagged m/km slips.",
          ],
        },
        {
          label: "c",
          prompt: "State the speed of the payload at its maximum height in the first model.",
          marks: 1,
          kind: "numeric",
          answer: { value: 417, unit: "m s⁻¹", tolerancePct: 2 },
          modelAnswer: "Only the horizontal component remains: 2400 cos 80.0° = **417 m s⁻¹**.",
          markScheme: ["B1 417 m s⁻¹ (allow 420)"],
          commonMistakes: ["Answering 0."],
        },
        {
          label: "d",
          prompt: "State one assumption, other than constant g, made in the first model.",
          marks: 1,
          kind: "written",
          modelAnswer:
            "**No air resistance** (no drag). In reality drag at 2.4 km s⁻¹ in the lower atmosphere would be enormous, so H would be far smaller.",
          markScheme: ["B1 no air resistance / drag negligible; allow Earth's rotation ignored"],
          commonMistakes: ["Restating the given assumption (\"g is always 9.81\"). It is in the stem, so it earns nothing."],
        },
        {
          label: "e",
          prompt: "Evaluate the assumption that g = 9.81 m s⁻² up to height H. Support your answer with a calculation.",
          marks: 3,
          kind: "written",
          modelAnswer:
            "g ∝ 1/r^2^. At height H: g = 9.81 × (6400 ÷ 6685)^2^ = **8.99 m s⁻²**, about **8% smaller** than at the surface.\nSo the assumption is **not reasonable** at this height: g gets noticeably weaker, the payload decelerates less on the way up, and the real H would be **greater** than 285 km (ignoring drag).",
          markScheme: [
            "M1 g ∝ 1/r^2^ used with r = 6400 km and 6400 + H",
            "C1 g at H ≈ 9.0 m s⁻² (ratio ≈ 0.92); ECF for H from (b)",
            "A1 clear verdict: not a good assumption (g about 8% smaller), so H would be greater",
            "Not 6400 ÷ 6685 without squaring (0.957)",
          ],
          commonMistakes: [
            "Forgetting to square the radius ratio. Both the 2024 and 2025 reports name this.",
            "Getting the fraction upside down (g bigger at altitude). Higher up, g is **smaller**.",
            "Doing the calculation but never stating a verdict. Say plainly whether the assumption is reasonable.",
          ],
        },
      ],
    },

    // ---------------- Extended response ----------------
    {
      id: "pm-r9",
      title: "Range against launch height",
      style: "Extended response",
      difficulty: 3,
      origin: { kind: "ours" },
      basedOn: "Modelled on H556/01 June 2018 Q16(b) and H156/02 November 2020 Q4",
      stem: "A student launches a small steel ball **horizontally** from the edge of a bench at a constant speed v. She varies the launch height h above the floor. The ball lands a horizontal distance x from the point directly below the edge. Air resistance is negligible.",
      parts: [
        {
          prompt:
            "Use your knowledge of projectile motion to suggest the relationship between x and h. Describe how an experiment can be safely conducted, and how the data can be analysed, to test this relationship and determine v. [Level of response]",
          marks: 6,
          kind: "written",
          modelAnswer:
            "**Relationship.** Horizontal velocity is constant. Vertically u = 0, so h = ½gt^2^ and $t = \\sqrt{2h/g}$: the time of fall does not depend on v. Then x = vt = v√(2h ÷ g), so **x^2^ = (2v^2^ ÷ g) h**: x^2^ ∝ h.\n\n**Method.** Clamp a curved track to a stand so its end is horizontal (check with a spirit level) at the bench edge. Release the ball from the **same marked point** each time so v is constant. Change h by raising the track and launch edge on an adjustable stand; measure h from the launch edge to the floor with a metre rule held vertical (set square). Mark the landing point with a sand tray or carbon paper on white paper; measure x from a plumb line below the edge with a tape measure. Repeat 3 times for each of 6 heights and average. Measure v directly with a light gate at the end of the track, **connected to a timer or data-logger**, using the ball's diameter (measured with vernier callipers).\n\n**Safety.** Use a sand tray or catch box so the ball does not roll across the floor (trip hazard); clamp the stand so it cannot topple.\n\n**Analysis.** Plot **x^2^ against h**. A **straight line through the origin** supports the relationship. Gradient = 2v^2^ ÷ g, so v = √(g × gradient ÷ 2). Compare with the light-gate value.",
          markScheme: [
            "**Level 3 (5–6 marks):** relationship suggested AND supported by correct physics or algebra; clear, safe method with appropriate measurements; analysis with a suitable graph through the origin AND v found from the gradient. Well structured and logical.",
            "**Level 2 (3–4 marks):** relationship suggested with some physics; workable method; some analysis (e.g. graph named but no gradient → v). Some structure.",
            "**Level 1 (1–2 marks):** basic method (e.g. measure h and x with a ruler) OR relationship stated without support. Limited structure.",
            "**0 marks:** no response or no response worthy of credit.",
            "_Indicative physics:_ horizontal velocity constant; time of fall independent of v; t = √(2h/g); x = v√(2h/g); x^2^ ∝ h (or x ∝ √h).",
            "_Indicative method:_ same release point for constant v; horizontal launch (spirit level); h by metre rule / set square; landing point by sand / carbon paper / video; x by ruler from plumb line; repeat and average; light gate + timer/data-logger with ball diameter for v; safety (catch box, clamp stand).",
            "_Indicative analysis:_ plot x^2^ against h (or x against √h); straight line through the origin; gradient = 2v^2^/g; v = √(g × gradient / 2).",
          ],
          commonMistakes: [
            "Not saying the line goes **through the origin**. In June 2018 H556/01 Q16(b) this held many at a high Level 1 or low Level 2.",
            "Plotting x against h and expecting a straight line. x ∝ √h, so that graph curves: linearise first.",
            "Describing the time of flight, or the vertical fall, instead of how x depends on h (a mix-up the 2018 examiners reported).",
            "Leaving out how the ball is released, how v is measured, or how the landing point is found: the strands the Autumn 2020 H156/02 report expected.",
          ],
        },
      ],
    },
  ],

  // ====================================================================
  // Real OCR questions to sit after the remixes (easiest first). Answers recomputed with g = 9.81 m s⁻²
  // and checked against the published mark schemes; tolerances cover the answers those schemes allow.
  pastPapers: [
    {
      id: "pp-h156-01-2016-q18",
      paper: "H156/01",
      series: "June 2016",
      question: "Q18 (multiple choice)",
      marks: 1,
      difficulty: 1,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/June%202016%20QP%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/June%202016%20MS%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf",
      tests: "Kinetic energy at the top of an angled throw.",
      answers: [{ value: "C" }],
      explanation: "At the top only the horizontal component u cos θ is left. KE ∝ v^2^, so KE~top~ = cos^2^θ × KE~launch~. Watch for the options that forget to square, or that say zero.",
    },
    {
      id: "pp-h156-01-2023-q24b",
      paper: "H156/01",
      series: "June 2023",
      question: "Q24(b)",
      marks: 3,
      difficulty: 1,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/June%202023%20QP%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-1/June%202023%20MS%20-%20Paper%201%20OCR%20(A)%20Physics%20AS-level.pdf",
      tests: "Horizontal velocity × time, then an explicit comparison with a target.",
      answers: [{ label: "b", value: 2.09, unit: "m", tolerancePct: 1 }],
      explanation: "Distance from the wall = horizontal velocity × time. Then work out the target's inner and outer edges (centre ± radius, same units) and write the inequality.",
    },
    {
      id: "pp-h156-02-2022-q4",
      paper: "H156/02",
      series: "June 2022",
      question: "Q4",
      marks: 7,
      difficulty: 1,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-2/June%202022%20QP%20-%20Paper%202%20OCR%20(A)%20Physics%20AS-level.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/AS-Paper-2/June%202022%20MS%20-%20Paper%202%20OCR%20(A)%20Physics%20AS-level.pdf",
      tests: "A drop, then a horizontal launch from the same height: range, landing KE and impact angle.",
      answers: [
        { label: "a(i)", value: 3.92, unit: "J", tolerancePct: 2 },
        { label: "a(ii)", value: 7.0, unit: "m s⁻¹", tolerancePct: 1 },
        { label: "b(i)", value: 8.52, unit: "m", tolerancePct: 1.5 },
        { label: "b(ii)", value: 15.4, unit: "J", tolerancePct: 3 },
        { label: "b(iii)", value: 30, unit: "°", tolerancePct: 2.5 },
      ],
      explanation: "Part (a) is a straight drop (give 7.0, not 7). In (b) the vertical motion is the **same** drop, so reuse that vertical velocity. Landing KE = horizontal KE + GPE lost. Angle = tan⁻¹($v_V$ ÷ $v_H$), from velocities only.",
    },
    {
      id: "pp-h556-01-2022-q16b",
      paper: "H556/01",
      series: "June 2022",
      question: "Q16(b)",
      marks: 10,
      difficulty: 2,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/QP/June%202022%20QP.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/MS/June%202022%20MS.pdf",
      tests: "Elastic energy → launch speed → horizontal launch range, then real vs ideal.",
      answers: [
        { label: "b(i)", value: 0.9, unit: "J", tolerancePct: 3 },
        { label: "b(ii)", value: 7.7, unit: "m s⁻¹", tolerancePct: 2 },
        { label: "b(iii)", value: 4.28, unit: "m", tolerancePct: 6 },
      ],
      explanation: "Use the extension read from the graph in ½kx^2^, then ½mv^2^ for the speed. The flight is a horizontal launch: time from 1.5 m = ½gt^2^, then R = v × t (the scheme allows 4.2–4.5 m depending on the speed you carry forward). In (iv) the real R is smaller: say why (drag, or not all the energy reaches the ball).",
    },
    {
      id: "pp-h556-01-2020-q18",
      paper: "H556/01",
      series: "November 2020",
      question: "Q18",
      marks: 10,
      difficulty: 2,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/QP/November%202020%20QP.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/MS/November%202020%20MS.pdf",
      tests: "Angled launch: KE description, time to the top, and how far a shot misses.",
      answers: [
        { label: "b", value: 1.32, unit: "s", tolerancePct: 2 },
        { label: "c", value: 86.6, unit: "m", tolerancePct: 3.6 },
      ],
      explanation: "Time to the top = u sin θ ÷ g; double it for the whole flight on level ground. Range = u cos θ × total time; subtract the target distance. Part (d) is momentum, not projectiles.",
    },
    {
      id: "pp-h556-01-2023-q17b",
      paper: "H556/01",
      series: "June 2023",
      question: "Q17(b)",
      marks: 8,
      difficulty: 2,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/QP/June%202023%20QP.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/MS/June%202023%20MS.pdf",
      tests: "Object released from circular motion: horizontal launch at v = rω, and what mass changes (nothing).",
      answers: [
        { label: "b(i)", value: 1.86, unit: "s", tolerancePct: 3 },
        { label: "b(ii)", value: 15.7, unit: "m", tolerancePct: 5.5 },
      ],
      explanation: "On release the velocity is horizontal (along the tangent) with size rω, so $u_V$ = 0. Time from the drop height, then horizontal displacement = rω × t. For (iii): name a variable, its effect on speed or time, then a conclusion. Mass alone changes nothing.",
    },
    {
      id: "pp-h556-01-2025-q17",
      paper: "H556/01",
      series: "June 2025",
      question: "Q17",
      marks: 13,
      difficulty: 3,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/QP/June%202025%20QP.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-1/MS/June%202025%20MS.pdf",
      tests: "Aircraft flying a parabola: conditions for projectile motion, velocity after a fall, thrust, g with height, weightlessness.",
      answers: [
        { label: "a(ii)", value: 22.6, unit: "s", tolerancePct: 2 },
        { label: "a(iii) speed", value: 312, unit: "m s⁻¹", tolerancePct: 1.3 },
        { label: "a(iii) angle", value: 44.8, unit: "° to vertical", tolerancePct: 1.8 },
        { label: "b(i)", value: 0.997, tolerancePct: 0.2 },
      ],
      explanation: "Use two columns (H and V). The horizontal speed stays at the value given; the vertical speed after the fall is gt. Combine with Pythagoras and find the angle with tan⁻¹. For thrust, say thrust = drag (zero horizontal net force), not \"balanced forces\". For g, square the radius ratio. Weightless = same acceleration + no contact force.",
    },
    {
      id: "pp-h556-03-2024-q3b",
      paper: "H556/03",
      series: "June 2024",
      question: "Q3(b) (6-mark Level of Response)",
      marks: 6,
      difficulty: 3,
      url: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-3/QP/June%202024%20QP.pdf",
      msUrl: "https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/OCR-A/Paper-3/MS/June%202024%20MS.pdf",
      tests: "Two-stage rocket estimate with assumptions, then evaluating constant g.",
      answers: [{ label: "H", value: 530, unit: "km", tolerancePct: 3 }],
      explanation: "Stage 1 (powered): constant acceleration from rest, s = ½(u + v)t with the vertical component 3100 sin 75°. Stage 2 (coasting): $v^2 = u^2 + 2as$ up to $v_V$ = 0, no air resistance. State the assumption for each stage. Then find g at the top with g ∝ 1/r^2^ (square it) and give a clear verdict.",
    },
  ],
};

export default sub;
