import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";

const sections: Section[] = [
  {
    id: "distance-vs-displacement",
    heading: "Distance vs displacement",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Two ways to say \"how far\": one counts the whole route, the other only cares where you ended up. Every velocity question depends on picking the right one." },
      {
        type: "text",
        body: "Missy Franklin swam the 100 m backstroke in a 50 m pool in **58.33 s**. She swam 100 m, but she **finished where she started**. So her {{distance}} was 100 m and her {{displacement}} was **0 m**.",
      },
      { type: "figure", figure: F.figPool },
      {
        type: "list",
        items: [
          "**Distance** = length of the path. Only a size. That makes it a {{scalar}}.",
          "**Displacement** {{s}} = straight line from start to finish, **with a direction**. That makes it a {{vector}}.",
          "Same pairing for how fast: {{speed}} comes from distance (scalar), {{velocity}} comes from displacement (vector).",
          "Her {{avg-speed}} = 100 ÷ 58.33 = **1.71 m s⁻¹**. Her {{avg-velocity}} = 0 ÷ 58.33 = **0 m s⁻¹**.",
        ],
      },
      {
        type: "list",
        items: [
          "**Scalars** (size only): distance, speed, time, mass, energy, power, work, wavelength, frequency.",
          "**Vectors** (size and direction): displacement, velocity, acceleration, force (incl. weight), momentum.",
        ],
      },
      {
        type: "sayIt",
        say: ["A vector is a quantity that has ==both magnitude and direction==, e.g. velocity (give an example if asked)."],
        reject: ["\"A quantity that has direction\" on its own (older-spec mark scheme: magnitude is needed too)."],
        source: "H156/01 Specimen Q21(a) mark scheme; rejection from older-spec (G481) pack Set M3 Q3(a)",
      },
      {
        type: "examiners",
        body: "In a 1-mark scalar/vector table, the most popular wrong row listed **wavelength** as a vector. A wavelength is just a length: a scalar. The correct row paired mass (scalar) with centripetal force (vector).",
        cite: "June 2022 H556/01 Q1",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "average-velocity",
    heading: "Average velocity",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Average velocity uses only where you started and where you finished. The route in between does not matter." },
      {
        type: "text",
        body: "Harrogate to Leeds: **24 km** by road, but Leeds is only **21 km due south** in a straight line. The trip takes 37 min. Divide the road length by the time and you get a speed; divide the straight line by the time and you get a velocity.",
      },
      {
        type: "equation",
        latexless: "v = Δs / Δt",
        tex: "v = \\dfrac{\\Delta s}{\\Delta t}",
        words: "average velocity = change in displacement ÷ time taken",
        dataSheet: false,
        note: "{{delta}} means \"change in\". {{delta-s}} = change in displacement (m), {{delta-t}} = time taken (s), {{v}} in {{ms}}. So velocity is the {{rate-of-change}} of displacement. Speed uses the same shape with distance {{delta-x}} instead (the textbook writes distance as {{x}}): v = Δx ÷ Δt.",
      },
      {
        type: "worked",
        title: "Harrogate to Leeds (Textbook p. 24)",
        origin: { kind: "textbook", ref: "p. 24" },
        question: "Leeds is about 21 km south of Harrogate, but the distance by road is about 24 km. The journey takes 37 minutes. Calculate (a) the average speed, (b) the average velocity, (c) the average velocity for the round trip Harrogate → Leeds → Harrogate.",
        steps: [
          "**Units first.** Time: 37 {{x60|× 60}} = **2220 s**. Distances: 24 km {{km-m|× 1000}} = 24 000 m and 21 km = 21 000 m.",
          "**(a) Speed uses the road.** {{v}} = {{delta-x}} ÷ {{delta-t}} = 24 000 ÷ 2220 = 10.8 = **11 m s⁻¹** (2 s.f.).",
          "**(b) Velocity uses the straight line.** {{v}} = {{delta-s}} ÷ {{delta-t}} = 21 000 ÷ 2220 = 9.46 = **9.5 m s⁻¹ due south**. A velocity needs its direction.",
          "**(c) Round trip.** You end where you started, so {{delta-s}} = 0 and the average velocity is **0**. (The average speed is still 11 m s⁻¹.)",
        ],
        answer: "Average speed **11 m s⁻¹**; average velocity **9.5 m s⁻¹ due south**; round trip average velocity **0**.",
      },
      { type: "figure", figure: F.figLeeds },
      {
        type: "sayIt",
        say: ["Velocity is the ==rate of change of displacement==. If you write v = Δs/Δt, say Δs is the change in displacement and Δt the time taken."],
        reject: ["\"displacement ÷ time\" or \"distance ÷ time\"", "\"speed in a specific direction\"", "mixing quantity and unit, e.g. \"displacement per second\""],
        source: "H156/01 June 2019 Q22(a) mark scheme (velocity = rate of change of displacement); rejections from older-spec (G481) pack Set M1 Q2(a), Set M3 Q5(a)",
      },
      {
        type: "tip",
        body: "The size of the average velocity can never be bigger than the average speed. If yours is, you've swapped the two distances.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "st-graphs",
    heading: "Displacement–time graphs: gradient = velocity",
    source: "both",
    specRef: "3.1.1(b), 3.1.1(c)",
    blocks: [
      { type: "lead", body: "On an s–t graph, the steepness of the line **is** the velocity. Learn to read the shape, then put a number on it." },
      {
        type: "text",
        body: "On a {{st-graph}}, displacement goes up the side and time goes along the bottom. A car goes 120 m in 20 s: that's 6.0 m every second, and the line climbs 120 up for 20 across. So the {{gradient}} (120 ÷ 20) **is** the velocity.",
      },
      {
        type: "equation",
        latexless: "v = gradient of s–t graph = Δs / Δt",
        tex: "v = \\text{gradient} = \\dfrac{\\Delta s}{\\Delta t}",
        words: "velocity = change up the side ÷ change along the bottom",
        dataSheet: false,
      },
      { type: "figure", figure: F.figShapes },
      {
        type: "worked",
        title: "Forwards and backwards (Textbook p. 25–26)",
        origin: { kind: "textbook", ref: "p. 25–26" },
        question: "A car on a straight road: its displacement rises steadily from 0 to 120 m between t = 0 and 20 s, stays at 120 m until t = 30 s, then falls steadily back to 0 at t = 60 s. Find its velocity at t = 10 s and at t = 40 s.",
        steps: [
          "**t = 10 s** is on the first straight piece (0–20 s), so use that whole piece: {{v}} = {{delta-s}} ÷ {{delta-t}} = (120 − 0) ÷ (20 − 0) = **6.0 m s⁻¹**.",
          "**20–30 s:** flat line, displacement not changing, so the car is {{stationary}} ({{v}} = 0).",
          "**t = 40 s** is on the last straight piece (30–60 s): {{v}} = (0 − 120) ÷ (60 − 30) = −120 ÷ 30 = **−4.0 m s⁻¹**.",
          "The minus sign is a {{neg-v}}: the car is going the **opposite way** to the first 20 s, back towards the start.",
        ],
        answer: "**+6.0 m s⁻¹** at 10 s; **−4.0 m s⁻¹** at 40 s (4.0 m s⁻¹ back towards the start).",
      },
      { type: "figure", figure: F.figCar },
      {
        type: "sayIt",
        say: ["When describing motion from an s–t graph, state ==velocity is the gradient== (or rate of change of displacement) clearly, then describe each part: constant velocity / speeding up / slowing down / stationary / changes direction."],
        source: "H156/01 June 2019 Q22(a) and H156/01 June 2017 Q21(b) mark schemes",
      },
      {
        type: "warning",
        body: "**Check the y-axis label first.** A straight sloping line on an s–t graph means constant velocity; the same line on a v–t graph means constant acceleration.",
      },
      {
        type: "examiners",
        body: "Asked to sketch height against time for a dropped, bouncing ball, many drew straight lines (constant velocity) instead of curves that get steeper on the way down.",
        cite: "June 2024 H156/01 Q24(e)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "tangents",
    heading: "Curved graphs: tangents for instantaneous velocity",
    source: "both",
    specRef: "3.1.1(c)",
    blocks: [
      { type: "lead", body: "When the line curves, the velocity keeps changing. To get it at one moment, draw a tangent and find its gradient." },
      {
        type: "text",
        body: "A cyclist sets off from rest. At t = 4 s she is 12 m along the road. 12 ÷ 4 = 3.0 m s⁻¹ is her **average** velocity so far, but she's speeding up, so at 4 s she's going faster than that. The graph curves upwards.",
      },
      {
        type: "list",
        items: [
          "Use a ruler to draw a {{tangent}} that **just touches** the curve at t = 4 s.",
          "Make it **long**: pick two far-apart points **on the tangent** (not on the curve, not from a table).",
          "Gradient of the tangent = {{delta-s}} ÷ {{delta-t}} = the {{inst-velocity}} at 4 s.",
        ],
      },
      {
        type: "worked",
        title: "Cyclist speeding up",
        origin: { kind: "ours" },
        question: "A cyclist's s–t graph curves upwards. At t = 4.0 s, s = 12 m. A tangent drawn at t = 4.0 s passes through (2.0 s, 0 m) and (6.0 s, 24 m). Find her velocity at 4.0 s and compare it with her average velocity over the first 4.0 s.",
        steps: [
          "**Tangent gradient:** {{delta-s}} = 24 − 0 = 24 m, {{delta-t}} = 6.0 − 2.0 = 4.0 s, so {{v}} = 24 ÷ 4.0 = **6.0 m s⁻¹**.",
          "**Average velocity, 0 to 4.0 s:** use the {{chord}} from the origin to the point: 12 ÷ 4.0 = **3.0 m s⁻¹**.",
          "They differ because she is accelerating: the velocity at 4.0 s is **twice** the average up to then.",
        ],
        answer: "Instantaneous velocity at 4.0 s = **6.0 m s⁻¹**; average over 0–4.0 s = **3.0 m s⁻¹**.",
      },
      { type: "figure", figure: F.figTangent },
      {
        type: "list",
        items: [
          "**Steepest** part of an s–t graph = **greatest speed**.",
          "Where the curve is **flat for an instant** (top of a hump), {{v}} = 0: it's momentarily at rest and about to turn back.",
        ],
      },
      {
        type: "sayIt",
        say: ["==Tangent drawn at== the stated time, then ==gradient== Δs ÷ Δt, with Δs and Δt read off the tangent shown."],
        reject: ["Tangent at the wrong time: the answer mark is lost", "s ÷ t from a single point (that's an average, not the gradient)"],
        source: "H156/01 June 2019 Q22(c) mark scheme",
      },
      {
        type: "examiners",
        body: "About a quarter drew the tangent at the **wrong time**, capping them at 1 mark. Others drew short tangents; the longer the tangent, the more accurate the gradient.",
        cite: "June 2019 H156/01 Q22(c); June 2022 H156/02 Q1(d)(ii)",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "velocity-is-a-vector",
    heading: "Velocity has a direction: signs matter",
    source: "both",
    specRef: "3.1.1(a)",
    blocks: [
      { type: "lead", body: "Because velocity is a vector, turning round changes it even if the speed stays the same. Signs keep track of direction." },
      {
        type: "text",
        body: "A ball hits a wall at 5.0 m s⁻¹ and bounces back at 3.0 m s⁻¹. Call **towards the wall positive** (a {{sign-convention}}). Before: {{u}} = +5.0 m s⁻¹. After: {{v}} = −3.0 m s⁻¹. The speed (the velocity's {{magnitude}}) only dropped by 2.0 m s⁻¹, but the velocity changed by **8.0 m s⁻¹**.",
      },
      {
        type: "equation",
        latexless: "Δv = v − u",
        tex: "\\Delta v = v - u",
        words: "change in velocity = final velocity − initial velocity, keeping the signs",
        dataSheet: false,
        note: "Here {{delta-v}} = (−3.0) − (+5.0) = **−8.0 m s⁻¹**. Opposite directions, so the sizes **add**: 5.0 + 3.0 = 8.0.",
      },
      { type: "figure", figure: F.figBounce },
      {
        type: "examiners",
        body: "For a bouncing ball, candidates who subtracted the speeds (4.9 − 3.5) instead of adding them (4.9 + 3.5 = 8.4 m s⁻¹) got the force badly wrong (44 N instead of 260 N).",
        cite: "June 2019 H156/01 Q22(d)",
      },
      {
        type: "sayIt",
        say: ["Same speed, different direction: similarity ==same magnitude / same speed==; difference ==different (or opposite) direction=="],
        reject: ["\"same velocity\" as the similarity"],
        source: "H156/02 June 2024 Q1(b) mark scheme",
      },
    ],
  },
];

export default sections;
