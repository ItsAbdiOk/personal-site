import type { Section } from "@/lib/zakiya/types";
import * as FB from "./figures-b";

const sections: Section[] = [
    {
      id: "horizontal-launch",
      heading: "Horizontal launch from a height",
      source: "both",
      specRef: "3.1.3(a)(b)",
      blocks: [
        {
          type: "lead",
          body: "Where this is going: something leaves a cliff or table moving sideways. You'll find **how long it falls** and **how far out it lands**, the most common projectile question.",
        },
        {
          type: "text",
          body: "**Real numbers first (Textbook p. 40–41).** A cannonball is fired sideways at 304 m s⁻¹ off a cliff 44.1 m above the sea. It takes **3.00 s** to fall, and in that time it travels **912 m** out to sea. The 304 m s⁻¹ doesn't make it fall any faster or slower: a cannonball simply dropped from the cliff would also hit the water after 3.00 s.",
        },
        {
          type: "text",
          body: "Why: the launch is **sideways only**, so the starting up/down speed {{uy}} is **zero** ({{uy-zero|304 × cos 90° = 0}}). Vertically, it's just a dropped object. Sideways, nothing pushes or pulls it, so its sideways speed {{vx}} stays 304 m s⁻¹ the whole way down.",
        },
        {
          type: "equation",
          latexless: "t = √(2h ÷ g)",
          words: "**time to fall = square root of (2 × height ÷ 9.81)**. Only the height matters; the sideways speed plays no part.",
          general: "s = ut + ½at² with u = 0 (dropped from rest vertically), s = h, a = g",
          dataSheet: false,
        },
        {
          type: "equation",
          latexless: "x = vx × t",
          words: "**distance out = sideways speed × time in the air**. Sideways speed never changes, so this is plain speed × time.",
          general: "s = ut + ½at² with a = 0 horizontally, so s = ut",
          dataSheet: false,
        },
        {
          type: "warning",
          body: "Horizontal launch → **u~y~ = 0**. Students often put the launch speed in as the vertical u. The launch speed belongs only in the horizontal column.",
        },
        {
          type: "worked",
          title: "Cannonball off a cliff (Textbook p. 40–41)",
          origin: { kind: "textbook", ref: "p. 40–41" },
          question:
            "A cannonball is fired horizontally at 304 m s⁻¹ from a clifftop 44.1 m above the sea. Ignore air resistance. Find (a) the {{flight-time|time of flight}}, (b) the horizontal distance it travels.",
          steps: [
            "**Split the motion.** Falling and moving sideways happen independently, so treat them as two separate problems linked only by the time {{t}}.",
            "**(a) Falling (down positive, since everything happens downwards).** Write what you know: start speed down u~y~ = 0, distance down {{s}} = 44.1 m, acceleration {{a}} = {{g}} = 9.81 m s⁻², time t = ?",
            "Pick the {{suvat}} equation that has s, u, a and t: s = ut + ½at^2^. With u = 0 it becomes 44.1 = ½ × 9.81 × t^2^.",
            "Rearrange for t: t^2^ = (2 × 44.1) ÷ 9.81 = 8.991, so t = √8.991 = **3.00 s**.",
            "**(b) Sideways.** No acceleration, so distance = speed × time = 304 × 3.00 = **912 m**.",
          ],
          answer: "Time of flight **3.00 s**; it lands **912 m** (almost 1 km) from the foot of the cliff.",
        },
        {
          type: "figure",
          figure: FB.figCannonSteps,
        },
        {
          type: "tip",
          body: "\"Show that it lands in the target\": end with an explicit comparison against **both** edges of the target, e.g. 1.20 m < 1.32 m < 1.40 m. A distance on its own is not a conclusion.",
        },
        {
          type: "examiners",
          body: "Most found where the ball landed. Those who dropped marks had not clearly compared it with the **full range** of the target ring.",
          cite: "June 2023 H156/01 Q24(b)",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "velocity-at-a-point",
      heading: "Velocity at any point (and at impact)",
      source: "both",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "Where this is going: \"how fast and which way is it moving when it lands?\" You combine the sideways and downward speeds into one {{resultant}} velocity: a size and an angle.",
        },
        {
          type: "text",
          body: "**Real numbers first (Textbook p. 42).** An arrow is fired sideways at 49.2 m s⁻¹ from a castle wall 29.4 m high. When it hits the ground it is still moving sideways at **49.2 m s⁻¹**, but has picked up **24.0 m s⁻¹ downwards**. Together that's **54.7 m s⁻¹**, angled **26.0° below the horizontal**.",
        },
        {
          type: "text",
          body: "At any moment the velocity has two parts: {{vx}} (never changes) and {{vy}} (changes by 9.81 m s⁻¹ every second). They are at right angles, so combine them with {{pythag|Pythagoras}} for the size, and {{tan-inv|tan⁻¹}} for the angle.",
        },
        {
          type: "figure",
          figure: FB.figVectorsB,
        },
        {
          type: "equation",
          latexless: "v = √(vx² + vy²)",
          words: "**actual speed = square root of (sideways speed² + up/down speed²)**. The two parts are the short sides of a right-angled triangle; the actual speed is the long side.",
          general: "Pythagoras: hypotenuse² = side² + side²",
          note: "This gives the {{magnitude}} (size) of the velocity.",
          dataSheet: false,
        },
        {
          type: "equation",
          latexless: "θ = tan⁻¹(vy ÷ vx)",
          words: "**angle below (or above) the ground = tan⁻¹(up/down speed ÷ sideways speed)**. A big up/down speed compared with the sideways speed means a steep angle.",
          general: "tan θ = opposite ÷ adjacent in the right-angled triangle",
          note: "This is the {{impact-angle|angle to the horizontal}}.",
          dataSheet: false,
        },
        {
          type: "figure",
          figure: FB.figArrowSetup,
        },
        {
          type: "worked",
          title: "Arrow from a castle (Textbook p. 42)",
          origin: { kind: "textbook", ref: "p. 42" },
          question: "An arrow is fired horizontally at 49.2 m s⁻¹ from a castle 29.4 m high. Ignore air resistance. Find its velocity when it hits the ground.",
          steps: [
            "**Plan:** velocity = size + direction. Find the two parts (sideways and down), then combine them.",
            "**Down part.** We know u~y~ = 0, s = 29.4 m, a = 9.81 m s⁻², and want the final speed v~y~. No time given, so use the SUVAT equation without t: v^2^ = u^2^ + 2as.",
            "v~y~^2^ = 0 + 2 × 9.81 × 29.4 = 576.8, so v~y~ = √576.8 = **24.0 m s⁻¹** downwards.",
            "**Sideways part.** Nothing changes it: v~x~ = **49.2 m s⁻¹**.",
            "**Size:** Pythagoras on the two parts: v = √(49.2^2^ + 24.0^2^) = **54.7 m s⁻¹**.",
            "**Direction:** θ = tan⁻¹(down ÷ sideways) = tan⁻¹(24.0 ÷ 49.2) = **26.0°** below the horizontal.",
          ],
          answer: "**54.7 m s⁻¹ at 26.0° below the horizontal.** A velocity needs a size **and** a direction.",
        },
        {
          type: "figure",
          figure: FB.figImpactB,
        },
        {
          type: "warning",
          body: "\"Calculate the velocity\" means **magnitude and direction**. Giving only 54.7 m s⁻¹ usually loses the direction mark. Also: tan⁻¹(v~x~ ÷ v~y~) gives the angle to the **vertical** (64.0° here), so say which one you mean.",
        },
        {
          type: "text",
          body: "**{{ke-land|Kinetic energy on landing}}** uses the **whole** speed: ½m(v~x~^2^ + v~y~^2^). Or by energy: KE on landing = ½mu^2^ + mgh (launch KE + GPE lost). Both routes give the same answer.",
        },
        {
          type: "examiners",
          body: "The common error was working out the landing KE from the vertical component alone, leaving out the horizontal KE.",
          cite: "June 2023 H156/02 Q3(c)",
        },
        {
          type: "examiners",
          body: "Many used the horizontal speed for KE and then did not add the GPE lost in the fall. For the impact angle, wrong answers used energies or distances instead of velocity components.",
          cite: "June 2022 H156/02 Q4(b)",
        },
      ],
    },

    // ------------------------------------------------------------------
    {
      id: "angled-launch",
      heading: "Launched at an angle on flat ground",
      source: "both",
      specRef: "3.1.3(b)",
      blocks: [
        {
          type: "lead",
          body: "Where this is going: a kicked ball goes **up then down**. You'll split the kick into a sideways part and an upward part, then find how high, how long and how far.",
        },
        {
          type: "text",
          body: "**Real numbers first (Textbook p. 42–43).** A ball is kicked at 15 m s⁻¹, 30° above the ground. That kick is really **13.0 m s⁻¹ sideways** plus **7.5 m s⁻¹ upwards**. The upward 7.5 m s⁻¹ is used up by gravity in 0.76 s, so the ball is in the air for **1.53 s** and lands about **20 m** away.",
        },
        {
          type: "text",
          body: "The method: {{resolve|resolve}} the launch speed {{u}} at angle {{theta}} into its two parts, then use the two columns. Try the simulator: change the angle and watch v~x~ stay fixed while v~y~ changes.",
        },
        {
          type: "equation",
          latexless: "ux = u cos θ    uy = u sin θ",
          words: "**sideways part = launch speed × {{cos}} (angle)**; **upward part = launch speed × {{sin}} (angle)**. For 15 m s⁻¹ at 30°: 15 × cos 30° = 13.0 and 15 × sin 30° = 7.5.",
          general: "Resolving a vector: the side next to the angle uses cos, the side opposite uses sin",
          dataSheet: false,
        },
        {
          type: "figure",
          figure: FB.figResolveB,
        },
        {
          type: "figure",
          figure: {
            kind: "projectile-sim",
            caption: "Drag the speed and angle sliders. Notice: the horizontal arrow never changes length; the vertical arrow shrinks to zero at the top. On flat ground 45° gives the biggest range, and pairs like 30° and 60° land in the same place.",
          },
        },
        {
          type: "list",
          items: [
            "**At the top:** v~y~ = 0. Use this to find the {{max-height|maximum height}} or the time to the top.",
            "**On flat ground the flight is {{symmetric|symmetric}}:** time up = time down, and it lands with the same speed it was launched with (no air resistance).",
            "**Time of flight** on flat ground = 2 × time to the top. The {{range-dist|range}} = sideways speed × time of flight.",
          ],
        },
        {
          type: "equation",
          latexless: "T = 2u sin θ ÷ g",
          words: "**time in the air = 2 × upward part ÷ 9.81**. Gravity takes 9.81 m s⁻¹ off the upward speed each second; it takes (upward part ÷ 9.81) seconds to stop rising, and the same again to fall back.",
          general: "v = u + at with v = −u sin θ, u = u sin θ, a = −g",
          dataSheet: false,
        },
        {
          type: "equation",
          latexless: "h = (u sin θ)² ÷ 2g",
          words: "**max height = upward part² ÷ (2 × 9.81)**. At the top the upward speed has dropped to zero.",
          general: "v² = u² + 2as with v = 0 at the top, a = −g",
          dataSheet: false,
        },
        {
          type: "worked",
          title: "Kicking a ball (Textbook p. 42–43)",
          origin: { kind: "textbook", ref: "p. 42–43" },
          question:
            "A ball is kicked at 15 m s⁻¹ at 30° to the horizontal on flat ground. Ignore air resistance. Find (a) the time of flight, (b) the range. (c) Extra step, not in the book: the maximum height.",
          steps: [
            "**Resolve the kick** into parts: sideways u~x~ = 15 cos 30° = 13.0 m s⁻¹; upward u~y~ = 15 sin 30° = 7.5 m s⁻¹.",
            "**(a) Up/down, taking up as positive.** It lands at the same height, so it lands moving down at the same speed it left: u = +7.5 m s⁻¹, v = −7.5 m s⁻¹, a = −9.81 m s⁻², t = ?",
            "Use v = u + at (it links v, u, a and t): t = (v − u) ÷ a = (−7.5 − 7.5) ÷ (−9.81) = **1.53 s**.",
            "**(b) Sideways.** Speed is fixed at 13.0 m s⁻¹, so range = 13.0 × 1.529 = 19.9 m ≈ **20 m**.",
            "**(c) Max height.** At the top the upward speed is 0. Use v^2^ = u^2^ + 2as: 0 = 7.5^2^ + 2(−9.81)s, so s = 56.25 ÷ 19.62 = **2.87 m**.",
          ],
          answer: "Time of flight **1.53 s**, range **20 m** (2 s.f.), max height **2.9 m**.",
        },
        {
          type: "figure",
          figure: FB.figKickAnswers,
        },
        {
          type: "warning",
          body: "At maximum height the **vertical** velocity is zero, not the velocity. The ball still has a ==horizontal velocity== of u cos θ (here 13.0 m s⁻¹). Writing \"velocity at the top is zero\" is a classic lost mark.",
        },
        {
          type: "sayIt",
          say: [
            "KE is not zero at the top because ==the ball has a horizontal velocity==.",
            "From launch to the top, KE ==decreases== (transferred to GPE); at the top ==KE is a minimum but not zero==.",
          ],
          reject: ["\"it is still moving\" (moving which way? not credited)", "saying KE is a vector or has components"],
          source: "H556/01 June 2018 Q16(a)(iii); H556/01 November 2020 Q18(a)",
        },
        {
          type: "examiners",
          body: "For KE at the top, the key was to use the **horizontal component**. Some used the launch speed, others the vertical component.",
          cite: "June 2018 H556/01 Q16(a)(iv)",
        },
        {
          type: "tip",
          body: "\"Show that the time to the top is about 1.3 s\": get it from the **vertical** motion (t = u sin θ ÷ g). Dividing a horizontal distance by the horizontal speed answers a different question and scores nothing.",
        },
        {
          type: "warning",
          body: "Keep unrounded values in your calculator between steps. Rounding t to 1.5 s here would give a range of 19.5 m instead of 19.9 m, which can push a 3 s.f. answer outside the allowed range.",
        },
      ],
    },

    // ------------------------------------------------------------------
];

export default sections;
