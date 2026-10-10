import type { Explain } from "@/lib/zakiya/types";

// Extra tap-to-explain entries added for sections-c. Core entries (explain-core.ts) win on key clashes, so use new keys.
const explain: Record<string, Explain> = {
  signconv: { label: "sign convention", body: "Choosing which direction counts as **positive** before you start. Pick **up = +**, then anything pointing down (gravity, a drop below the start) gets a **minus** sign. Stick to it for every value in the question." },
  quadratic: { label: "quadratic", body: "An equation with a **t²** term in it, like 4.905t² − 6.00t − 20 = 0. You can't just rearrange for t; use the quadratic formula. It usually gives **two** answers." },
  quadformula: { label: "quadratic formula", body: "For at² + bt + c = 0: **t = [−b ± √(b² − 4ac)] ÷ 2a**. Read a, b and c off your equation (keep their signs), type it in, and take the **+** version for a positive time. Not on the data sheet: you learn it from GCSE maths." },
  negroot: { label: "negative time", body: "The quadratic always gives two answers. The negative one would be a time **before** the stone was thrown, which makes no physical sense, so you throw it away." },
  drag: { label: "drag", body: "**Air resistance**: the force from air pushing against something moving through it. Always points **backwards along the path** (opposite to the velocity) and gets bigger the faster it goes." },
  "resultant-force": { label: "resultant force", body: "The **single overall force** you get when you add all the forces together, taking their directions into account (as arrows, head to tail). This is what decides the acceleration." },
  thrust: { label: "thrust", body: "The **forward push** from an engine (jet or propeller)." },
  pag1: { label: "PAG1", body: "**Practical Activity Group 1**: OCR's set of required practicals on measuring motion (e.g. finding g). You may be asked to describe any method from it." },
  datalogger: { label: "data-logger", body: "A device that **records readings automatically** (e.g. times from light gates) many times a second, so you don't have to read a stopwatch." },
  parallax: { label: "parallax", body: "An error from **looking at the ruler at an angle**: the ball seems to line up with the wrong mark. Pointing the camera straight at the ruler, from far back, reduces it." },
  framerate: { label: "frame rate", body: "**How many pictures per second** the camera takes, e.g. 30 frames per second. So each frame is 1 ÷ 30 s apart, and time = frame number ÷ frame rate." },
  gradient: { label: "gradient", body: "The **steepness** of a straight-line graph: rise ÷ run (change in y ÷ change in x). For y against t², it equals g ÷ 2." },
  independence: { label: "independence", body: "The sideways motion and the up/down motion **don't affect each other**. A ball launched sideways falls at exactly the same rate as one just dropped." },
  lightgate: { label: "light gate", body: "A beam of light across a gap. When an object blocks the beam, an electronic timer starts or stops. Much more precise than a hand-held stopwatch." },
  lor: { label: "Level of Response", body: "A long (usually 6-mark) answer marked **as a whole** into Levels 1–3, not point by point. To reach Level 3 you must cover every part the question asks for, clearly." },
  weightless: { label: "weightless", body: "**Feeling** as if you have no weight: nothing (seat, floor) is pushing up on you. Your weight (gravity's pull) is still there; you and everything around you are just falling together." },
  contact: { label: "contact force", body: "A push from a surface touching you, e.g. the floor pushing up on your feet. It's what you **feel** as your weight." },
  freefall: { label: "free fall", body: "Moving with **only gravity** acting, so the acceleration is g (9.81 m s⁻² downwards). A projectile with no air resistance is in free fall the whole flight, even on the way up." },
};

export default explain;
