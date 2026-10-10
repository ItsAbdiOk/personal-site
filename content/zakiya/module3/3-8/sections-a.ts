import type { Section } from "@/lib/zakiya/types";
import * as F from "./figures";
import * as FA from "./figures-a";

const sections: Section[] = [
    {
      id: "what-is-a-projectile",
      heading: "What is a projectile?",
      source: "both",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "First, what counts as a projectile and the two rules it follows. Every calculation later in this topic is just these two rules applied.",
        },
        {
          type: "text",
          body: "A [[projectile]] is an object that has been launched and is now moving with **only gravity** acting on it. A kicked football, a dropped phone, a cannonball. At A level we **ignore air resistance** unless the question says otherwise.",
        },
        {
          type: "list",
          items: [
            "**Sideways (horizontal):** nothing pushes it sideways, so its sideways speed never changes. That sideways speed is called {{vx}}.",
            "**Up and down (vertical):** its weight pulls it down, so it speeds up downwards by 9.81 m s⁻¹ every second. That's {{g}} = 9.81 m s⁻², the same all flight.",
            "Steady sideways + speeding-up downwards gives an arch-shaped path called a {{parabola}}.",
          ],
        },
        { type: "figure", figure: FA.figGravityEachSecond },
        {
          type: "sayIt",
          say: [
            "Projectile motion: constant vertical acceleration g **and** ==constant horizontal velocity== (or ==zero horizontal force== / ==zero horizontal acceleration==).",
          ],
          source: "H556/01 June 2025 Q17(a)(i)",
        },
        {
          type: "figure",
          figure: {
            kind: "svg",
            svg: F.svgTrajectory,
            alt: "A curved parabolic path from a launch point on the ground to a landing point. The highest point is marked 'maximum height', where the upward speed is zero. A double arrow along the ground marks the range.",
            caption: "The words you need: launch, maximum height, [[range]]. The time from launch to landing is the [[time of flight]].",
          },
        },
        {
          type: "text",
          body: "This is exactly what the spec means by _two-dimensional motion with constant velocity in one direction and constant acceleration in a {{perpendicular}} direction_. Perpendicular just means at 90°: horizontal and vertical.",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "independence",
      heading: "Horizontal and vertical are independent",
      source: "both",
      specRef: "3.1.3(a)",
      blocks: [
        {
          type: "lead",
          body: "The big trick of this topic: treat sideways and up-down as **two separate problems**. This section shows why you're allowed to.",
        },
        {
          type: "text",
          body: "Independent means **one does not affect the other**. How fast a ball moves sideways makes no difference to how fast it falls.",
        },
        {
          type: "figure",
          figure: {
            kind: "svg",
            svg: F.svgStrobe,
            alt: "Strobe diagram. Two balls released at the same moment from the same height: one dropped straight down, one launched horizontally. At every flash both balls are at the same height. The launched ball moves equal distances sideways between flashes, while the vertical gaps grow for both balls.",
            caption: "Flash photo idea: one ball dropped, one launched sideways at the same instant. At every flash they are at the **same height**. Sideways steps are **equal** (constant {{vx}}). Vertical gaps **grow** (speeding up downwards).",
          },
        },
        {
          type: "analogy",
          icon: "🔦",
          body: "Shine a torch straight down from the ceiling and another straight at a wall. The ball casts two shadows. The **floor shadow** slides along at a steady speed. The **wall shadow** falls exactly like a dropped ball. Each shadow behaves as if the other one does not exist. That is independence.",
        },
        {
          type: "text",
          body: "**Why is {{vx}} constant?** Gravity pulls straight down, at 90° to sideways. The part of gravity that points sideways is {{gcos90}} = 0. No sideways pull means no sideways speeding up or slowing down.",
        },
        {
          type: "text",
          body: "**What links the two directions?** Only **time**. The ball is in the air for the same {{t}} in both directions. Typical plan: find t from one direction, then use it in the other. E.g. a cannonball fired horizontally at 304 m s⁻¹ from a 44.1 m clifftop: the fall gives t = 3.00 s, then sideways distance = 304 × 3.00 = 912 m (Textbook p. 40–41).",
        },
        { type: "figure", figure: FA.figCannonball },
        {
          type: "warning",
          body: "A faster or heavier ball does **not** fall faster. Dropped and horizontally launched balls from the same height land at the **same time** (no air resistance). Mass does not appear in any of the equations.",
        },
        {
          type: "sayIt",
          say: [
            "==Time of flight is independent of speed== because the ==distance of fall is the same== and the ==initial vertical velocity is zero==.",
            "Horizontal distance ==is directly proportional to the launch speed== ==because the time of flight is constant==.",
          ],
          source: "H556/01 November 2021 Q21(b)(ii)",
        },
        {
          type: "examiners",
          body: "Many candidates thought the time of flight depended on the take-off speed. For a horizontal launch it depends **only on the height** fallen.",
          cite: "Autumn 2021 H556/01 Q21(b)(ii)",
        },
        {
          type: "examiners",
          body: "Weaker answers gave an object falling after a collision a starting vertical velocity (the horizontal speed from the previous part). Stronger answers spotted that the starting vertical velocity {{uy}} = 0.",
          cite: "June 2022 H156/01 Q23(d)",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "resolving",
      heading: "Splitting the launch velocity into components",
      source: "both",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "Most launches are at an angle. Before you can use the two-column trick, you split the launch speed into a sideways part and an upward part.",
        },
        {
          type: "text",
          body: "**Start with a real kick** (Textbook p. 42–43). A ball is kicked at **15 m s⁻¹** at **30°** above the ground. Of that 15 m s⁻¹, **13.0 m s⁻¹ goes sideways** and **7.5 m s⁻¹ goes upwards**. Each part is called a {{component}}.",
        },
        {
          type: "figure",
          figure: FA.figComponentsKey,
        },
        {
          type: "analogy",
          icon: "⚽",
          body: "Picture the ball's **shadow on the ground** at midday. The shadow only moves sideways, at a steady 13.0 m s⁻¹. That's the sideways component.",
        },
        {
          type: "figure",
          figure: {
            kind: "shadow-sim",
            caption: "Press **Play** or drag the time slider. With the sun overhead, the ground shadow only shows the **sideways** motion: equal gaps every 0.25 s, so a steady 13.0 m s⁻¹. A low sun casts a shadow on the wall that only shows the **up/down** motion: 7.5 m s⁻¹ up, slowing to 0 at the top, then speeding up downwards. Two shadows = the two components.",
          },
        },
        {
          type: "text",
          body: "**Where 13.0 and 7.5 come from:** 15 × {{cos}} 30° = 13.0 and 15 × {{sin}} 30° = 7.5. Swap in any launch speed {{u}} and angle {{theta}} and you get the general rule below.",
        },
        {
          type: "text",
          body: "**Why is cos the sideways one?** cos always gives the side {{adjacent}}. With θ measured from the ground, the side touching the angle is the sideways one. sin gives the other side, the upward one.",
        },
        {
          type: "equation",
          latexless: "horizontal: ux = u cos θ",
          tex: "\\text{horizontal: } u_x = u\\cos\\theta",
          words: "sideways speed = launch speed × cos(angle)",
          general: "Fx = F cos θ (data sheet, for any vector)",
          generalTex: "F_x = F\\cos\\theta \\text{ (data sheet, for any vector)}",
          dataSheet: true,
          note: "Kick: 15 cos 30° = 13.0 m s⁻¹. This is {{ux}}.",
        },
        {
          type: "equation",
          latexless: "vertical: uy = u sin θ",
          tex: "\\text{vertical: } u_y = u\\sin\\theta",
          words: "upward speed at launch = launch speed × sin(angle)",
          general: "Fy = F sin θ (data sheet, for any vector)",
          generalTex: "F_y = F\\sin\\theta \\text{ (data sheet, for any vector)}",
          dataSheet: true,
          note: "Kick: 15 sin 30° = 7.5 m s⁻¹. This is {{uy}}.",
        },
        {
          type: "warning",
          body: "**cos goes with the side next to the angle.** If the angle is given from the **vertical** instead, the horizontal component becomes u sin θ. Always sketch the triangle first.",
        },
        {
          type: "examiners",
          body: "A throw was given at 84° **to the vertical**. Most candidates used u cos 84° for the vertical component; a significant minority used u sin 6°. Both are correct: what matters is the triangle.",
          cite: "June 2023 H156/02 Q3(a)",
        },
        {
          type: "examiners",
          body: "A common error was leaving out sin 75° (or using cos 75°) when finding a vertical velocity from a launch at 75° to the horizontal.",
          cite: "June 2024 H556/03 Q3(b)",
        },
        {
          type: "warning",
          body: "Never put the full launch speed u into a horizontal or vertical equation. Each direction only gets **its own component**.",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "toolkit",
      heading: "The toolkit: two columns",
      source: "both",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "Now the method you'll use in every question: one column for sideways, one for up-down, and the equations that go in each.",
        },
        {
          type: "text",
          body: "Draw two columns in every projectile question: **horizontal** and **vertical**. Fill in what you know in each.",
        },
        { type: "figure", figure: FA.figToolkitColumns },
        {
          type: "list",
          items: [
            "**Horizontal:** acceleration {{a}} = 0, so just distance = speed × time.",
            "**Vertical:** a = −9.81 m s⁻² (taking **up as positive**, the minus because gravity points down). Use the {{suvat}} equations.",
            "**Shared:** the time {{t}}.",
          ],
        },
        {
          type: "equation",
          latexless: "x = vx × t",
          tex: "x = v_x \\times t",
          words: "sideways distance = sideways speed × time in the air",
          general: "s = ut + ½at² with a = 0",
          generalTex: "s = ut + \\tfrac{1}{2}at^2 \\text{ with } a = 0",
          dataSheet: false,
          note: "Horizontal only. {{x}} is the sideways distance; {{vx}} never changes, so no ½at² term.",
        },
        {
          type: "equation",
          latexless: "v = u + at",
          tex: "v = u + at",
          words: "final speed = starting speed + (speed gained each second × seconds)",
          general: "SUVAT, data sheet",
          dataSheet: true,
          note: "Use when you have no distance {{s}}. Vertically: $v_y$ = $u_y$ − 9.81t.",
        },
        {
          type: "equation",
          latexless: "s = ½(u + v)t",
          tex: "s = \\tfrac{1}{2}(u + v)t",
          words: "distance = average speed × time",
          general: "SUVAT, data sheet",
          dataSheet: true,
          note: "Use when you don't know the acceleration (rare here: vertically it's always −9.81).",
        },
        {
          type: "equation",
          latexless: "s = ut + ½at²",
          tex: "s = ut + \\tfrac{1}{2}at^2",
          words: "distance = (starting speed × time) + extra distance from speeding up",
          general: "SUVAT, data sheet",
          dataSheet: true,
          note: "Use when you have no final speed v. Dropped from rest (u = 0): fall height = ½ × 9.81 × t².",
        },
        {
          type: "equation",
          latexless: "v² = u² + 2as",
          tex: "v^2 = u^2 + 2as",
          words: "final speed² = starting speed² + 2 × acceleration × distance",
          general: "SUVAT, data sheet",
          dataSheet: true,
          note: "Use when you have no time t, e.g. landing speed from a height.",
        },
        {
          type: "warning",
          body: "**Pick a {{signs|sign convention}} and stick to it.** If up is positive, then a = −9.81 m s⁻², and a ball landing 20 m _below_ its launch point has s = −20 m. Mixing signs is the most common way to get a wrong time.",
        },
        { type: "figure", figure: FA.figSigns },
        {
          type: "examiners",
          body: "Successful candidates made horizontal and vertical as separate as possible: a two-column table headed _vertical_ and _horizontal_, or V and H subscripts on u, v, a and s.",
          cite: "June 2025 H556/01 Q17(a)(ii)",
        },
        {
          type: "tip",
          body: "**Show that** questions: write the equation, substitute every number (including g = 9.81 m s⁻², never 10), and if there is a v^2^ show the square-root step. Give one more significant figure than the value quoted. Otherwise give answers to the same s.f. as the data: 7.0, not 7.",
        },
      ],
    },

    // ------------------------------------------------------------------
];

export default sections;
