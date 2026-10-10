// Registry for Zakiya's study guide (/zakiya).
// To add a subchapter: write content/zakiya/module<N>/<slug>.ts (default export `Subchapter`),
// import it below and put it in SUBCHAPTERS. The outline entry with the same number lights up.
import type { Subchapter } from "@/lib/zakiya/types";
import projectileMotion from "./module3/3-8-projectile-motion";

export const SUBCHAPTERS: Subchapter[] = [projectileMotion];

export type OutlineChapter = {
  number: number;
  title: string;
  blurb: string;
  colour: string;
  art?: "plot" | "elevator" | "plug" | "sieve" | "turntable";
  subchapters: { number: string; title: string }[];
};

export type OutlineModule = { number: number; title: string; chapters: OutlineChapter[] };

export const OUTLINE: OutlineModule[] = [
  {
    number: 3,
    title: "Forces and motion",
    chapters: [
      {
        number: 3,
        title: "Motion",
        blurb: "Graphs that tell a story",
        colour: "#0071E3",
        art: "plot",
        subchapters: [
          { number: "3.1", title: "Distance and speed" },
          { number: "3.2", title: "Displacement and velocity" },
          { number: "3.3", title: "Acceleration" },
          { number: "3.4", title: "More on velocity–time graphs" },
          { number: "3.5", title: "Equations of motion" },
          { number: "3.6", title: "Car stopping distances" },
          { number: "3.7", title: "Free fall and g" },
          { number: "3.8", title: "Projectile motion" },
        ],
      },
      {
        number: 4,
        title: "Forces in action",
        blurb: "Why lifts feel weird",
        colour: "#FF9500",
        art: "elevator",
        subchapters: [
          { number: "4.1", title: "Force, mass and weight" },
          { number: "4.2", title: "Centre of mass" },
          { number: "4.3", title: "Free-body diagrams" },
          { number: "4.4", title: "Drag and terminal velocity" },
          { number: "4.5", title: "Moments and equilibrium" },
          { number: "4.6", title: "Couples and torques" },
          { number: "4.7", title: "Triangle of forces" },
          { number: "4.8", title: "Density and pressure" },
          { number: "4.9", title: "p = hρg and Archimedes' principle" },
        ],
      },
      {
        number: 5,
        title: "Work, energy and power",
        blurb: "Where the energy goes",
        colour: "#34C759",
        art: "plug",
        subchapters: [
          { number: "5.1", title: "Work done and energy" },
          { number: "5.2", title: "Conservation of energy" },
          { number: "5.3", title: "Kinetic and gravitational potential energy" },
          { number: "5.4", title: "Power and efficiency" },
        ],
      },
      {
        number: 6,
        title: "Materials",
        blurb: "Stretch it till it snaps",
        colour: "#AF52DE",
        art: "sieve",
        subchapters: [
          { number: "6.1", title: "Springs and Hooke's law" },
          { number: "6.2", title: "Elastic potential energy" },
          { number: "6.3", title: "Deforming materials" },
          { number: "6.4", title: "Stress–strain, and the Young modulus" },
        ],
      },
      {
        number: 7,
        title: "Laws of motion and momentum",
        blurb: "Flick it, watch it coast",
        colour: "#FF2D55",
        art: "turntable",
        subchapters: [
          { number: "7.1", title: "Newton's first and third laws of motion" },
          { number: "7.2", title: "Linear momentum" },
          { number: "7.3", title: "Newton's second law of motion" },
          { number: "7.4", title: "Impulse" },
          { number: "7.5", title: "Collisions in two dimensions" },
        ],
      },
    ],
  },
];

export function getSubchapter(slug: string): Subchapter | undefined {
  return SUBCHAPTERS.find((s) => s.slug === slug);
}

export function getSubchapterByNumber(number: string): Subchapter | undefined {
  return SUBCHAPTERS.find((s) => s.number === number);
}
