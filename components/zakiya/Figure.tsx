"use client";

import { Elevator, Plot, Terrain, Turntable } from "@lucasmarkes/hairline/react";
import type { Figure as FigureT } from "@/lib/zakiya/types";
import ProjectileSim from "./ProjectileSim";
import ShadowSim from "./ShadowSim";
import Graph from "./Graph";
import { Rich } from "./Rich";
import s from "./zakiya.module.css";

const HAIRLINE = { elevator: Elevator, turntable: Turntable, plot: Plot, terrain: Terrain } as const;

export default function Figure({ figure }: { figure: FigureT }) {
  let body: React.ReactNode = null;
  if (figure.kind === "projectile-sim") body = <ProjectileSim />;
  else if (figure.kind === "shadow-sim") body = <ShadowSim />;
  else if (figure.kind === "hairline") {
    const C = HAIRLINE[figure.figure];
    body = C ? (
      <div className={s.hairlineWrap}>
        <C play theme="light" />
      </div>
    ) : null;
  } else if (figure.kind === "graph") {
    body = <Graph fig={figure} />;
  } else if (figure.kind === "svg") {
    // Content is authored in this repo (content/zakiya), not user input.
    body = <div className={s.svgWrap} role="img" aria-label={figure.alt} dangerouslySetInnerHTML={{ __html: figure.svg }} />;
  }
  return (
    <figure className={s.figure}>
      {body}
      {figure.caption && (
        <figcaption>
          <Rich text={figure.caption} />
        </figcaption>
      )}
    </figure>
  );
}
