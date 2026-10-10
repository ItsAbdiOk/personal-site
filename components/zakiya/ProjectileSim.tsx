"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import s from "./zakiya.module.css";

const g = 9.81;

type Physics = { ux: number; uy: number; h0: number; T: number; R: number; H: number; tPeak: number; vImpact: number };

/** Launch from height h0 above flat ground, no air resistance. */
export function projectile(speed: number, angleDeg: number, h0: number): Physics {
  const th = (angleDeg * Math.PI) / 180;
  const ux = speed * Math.cos(th);
  const uy = speed * Math.sin(th);
  // h0 + uy t − ½ g t² = 0  →  t = (uy + √(uy² + 2 g h0)) / g
  const T = Math.max((uy + Math.sqrt(uy * uy + 2 * g * h0)) / g, 0.0001);
  const R = ux * T;
  const tPeak = Math.max(uy / g, 0);
  const H = h0 + (uy > 0 ? (uy * uy) / (2 * g) : 0);
  const vyImpact = uy - g * T;
  return { ux, uy, h0, T, R, H, tPeak, vImpact: Math.hypot(ux, vyImpact) };
}

export default function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();
  const [speed, setSpeed] = useState(15);
  const [angle, setAngle] = useState(45);
  const [height, setHeight] = useState(0);
  const progressRef = useRef(1);
  const rafRef = useRef(0);
  const P = useMemo(() => projectile(speed, angle, height), [speed, angle, height]);

  const draw = useCallback(
    (p: number) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      const css = (n: string) => getComputedStyle(cv).getPropertyValue(n).trim() || "#888";
      const dpr = window.devicePixelRatio || 1;
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Auto-fit: keep the whole path (and the launch tower) in view with equal x/y scale.
      const padL = 28, padR = 22, padT = 22, padB = 26;
      const sc = Math.min((w - padL - padR) / Math.max(P.R, 20), (h - padT - padB) / Math.max(P.H, 8));
      const X = (x: number) => padL + x * sc;
      const Y = (y: number) => h - padB - y * sc;
      const pos = (t: number) => ({ x: P.ux * t, y: P.h0 + P.uy * t - 0.5 * g * t * t });

      // ground
      ctx.strokeStyle = css("--ground");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, Y(0) + 0.5);
      ctx.lineTo(w, Y(0) + 0.5);
      ctx.stroke();

      // launch platform
      if (P.h0 > 0) {
        ctx.fillStyle = "rgba(0,0,0,.06)";
        ctx.fillRect(X(0) - 18, Y(P.h0), 18, Y(0) - Y(P.h0));
        ctx.fillStyle = css("--muted");
        ctx.font = "600 11px -apple-system, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${P.h0} m`, 4, Math.max(Y(P.h0) - 6, 12));
      }

      // max-height guide (dashed)
      if (P.H > P.h0 + 0.05) {
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = css("--line");
        ctx.beginPath();
        ctx.moveTo(X(0), Y(P.H));
        ctx.lineTo(X(P.ux * P.tPeak), Y(P.H));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // trail
      const t = P.T * p;
      ctx.strokeStyle = css("--trail");
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const q = pos((t * i) / 100);
        if (i) ctx.lineTo(X(q.x), Y(q.y));
        else ctx.moveTo(X(q.x), Y(q.y));
      }
      ctx.stroke();

      // ghost dots every 0.25 s (equal horizontal spacing = constant vx)
      ctx.fillStyle = css("--muted");
      for (let ti = 0.25; ti < t; ti += 0.25) {
        const q = pos(ti);
        ctx.beginPath();
        ctx.arc(X(q.x), Y(q.y), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ball + velocity components
      const b = pos(t);
      const by = Math.max(b.y, 0);
      const vy = P.uy - g * t;
      const k = 2.2;
      arrow(ctx, X(b.x), Y(by), X(b.x) + P.ux * k, Y(by), css("--vx"));
      arrow(ctx, X(b.x), Y(by), X(b.x), Y(by) - vy * k, css("--vy"));
      ctx.fillStyle = css("--ball");
      ctx.beginPath();
      ctx.arc(X(b.x), Y(by), 6, 0, Math.PI * 2);
      ctx.fill();
    },
    [P],
  );

  // Redraw on any parameter change (cancel a flight in progress) and on resize.
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    progressRef.current = 1;
    draw(1);
  }, [draw]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ro = new ResizeObserver(() => draw(progressRef.current));
    ro.observe(cv);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const launch = () => {
    cancelAnimationFrame(rafRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
      draw(1);
      return;
    }
    // Real time × 0.6, clamped so very short/long flights still read well.
    const dur = Math.min(Math.max(P.T * 1000 * 0.6, 700), 3200);
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      progressRef.current = p;
      draw(p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    progressRef.current = 0;
    rafRef.current = requestAnimationFrame(step);
  };

  return (
    <div className={s.sim}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Projectile path: launched at ${speed} m/s, ${angle}° from ${height} m high. Flight time ${P.T.toFixed(2)} s, range ${P.R.toFixed(1)} m, max height ${P.H.toFixed(2)} m.`}
      />
      <div className={s.controls}>
        <div className={s.control}>
          <label htmlFor={id + "u"}>
            Launch speed <output>{speed} m/s</output>
          </label>
          <input id={id + "u"} className={s.range} type="range" min={5} max={25} value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </div>
        <div className={s.control}>
          <label htmlFor={id + "a"}>
            Angle <output>{angle}°</output>
          </label>
          <input id={id + "a"} className={s.range} type="range" min={0} max={85} value={angle} onChange={(e) => setAngle(+e.target.value)} />
        </div>
        <div className={s.control}>
          <label htmlFor={id + "h"}>
            Launch height <output>{height} m</output>
          </label>
          <input id={id + "h"} className={s.range} type="range" min={0} max={20} value={height} onChange={(e) => setHeight(+e.target.value)} />
        </div>
      </div>
      <div className={s.readout} aria-live="polite">
        <div className={s.stat}>
          <span>Time</span>
          <b>{P.T.toFixed(2)} s</b>
        </div>
        <div className={s.stat}>
          <span>Range</span>
          <b>{P.R.toFixed(1)} m</b>
        </div>
        <div className={s.stat}>
          <span>Max height</span>
          <b>{P.H.toFixed(2)} m</b>
        </div>
      </div>
      <div className={s.row}>
        <button type="button" className={s.btn} onPointerDown={(e) => e.button === 0 && launch()} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), launch())}>
          Launch
        </button>
        <span className={s.legend}>
          <span className={s.sw} style={{ background: "var(--vx)" }} />v<sub>x</sub> never changes
          {"  "}
          <span className={s.sw} style={{ background: "var(--vy)", marginLeft: 8 }} />v<sub>y</sub> shrinks, then flips. Dots every 0.25 s.
        </span>
      </div>
    </div>
  );
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, c: string) {
  if (Math.hypot(x2 - x1, y2 - y1) < 3) return;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = ctx.fillStyle = c;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4));
  ctx.fill();
}
