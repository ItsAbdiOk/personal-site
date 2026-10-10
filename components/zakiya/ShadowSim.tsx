"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import s from "./zakiya.module.css";

const g = 9.81;
// Textbook p. 42–43: ball kicked at 15 m s⁻¹, 30° above the ground.
const U = 15;
const TH = (30 * Math.PI) / 180;
const UX = U * Math.cos(TH); // 13.0 m/s
const UY = U * Math.sin(TH); // 7.5 m/s
const T = (2 * UY) / g; // 1.53 s
const R = UX * T; // 19.9 m
const H = (UY * UY) / (2 * g); // 2.87 m
const TICK = 0.25; // s between shadow marks

/** The ball's two shadows: one on the ground (sun overhead → sideways motion only)
 *  and one on a wall (sun low, from the side → up/down motion only). */
export default function ShadowSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();
  const [t, setT] = useState(T * 0.55);
  const rafRef = useRef(0);

  const draw = useCallback((time: number) => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
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

    // World: wall at x = 0 on the left, ball launched a little to its right.
    const x0 = 3; // metres from wall to launch point
    const padL = 18, padR = 18, padT = 34, padB = 44;
    const sc = Math.min((w - padL - padR) / (R + x0 + 1), (h - padT - padB) / (H * 1.6));
    const X = (x: number) => padL + x * sc;
    const Y = (y: number) => h - padB - y * sc;
    const pos = (tt: number) => ({ x: x0 + UX * tt, y: UY * tt - 0.5 * g * tt * tt });

    const ink = css("--ink");
    const muted = css("--muted");
    const vx = css("--vx");
    const vy = css("--vy");
    ctx.font = "12px -apple-system, system-ui, sans-serif";
    ctx.textBaseline = "middle";

    // Ground and wall
    ctx.strokeStyle = css("--line");
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(H * 1.45));
    ctx.lineTo(X(0), Y(0));
    ctx.lineTo(w - padR + 8, Y(0));
    ctx.stroke();
    ctx.fillStyle = muted;
    ctx.fillText("wall", X(0) + 6, Y(H * 1.45) + 2);
    ctx.fillText("ground", w - padR - 40, Y(0) + 14);

    // Sun icons: overhead (lights the ground) and low on the right (lights the wall)
    const sun = (cx: number, cy: number, label: string) => {
      ctx.fillStyle = "#FFB300";
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = muted;
      ctx.textAlign = "right";
      ctx.fillText(label, cx - 12, cy);
      ctx.textAlign = "left";
    };
    sun(X(x0 + R * 0.55), 14, "sun overhead");
    sun(w - padR, Y(H * 1.15), "low sun");

    // Faint full path
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const p = pos((T * i) / 60);
      if (i === 0) ctx.moveTo(X(p.x), Y(p.y));
      else ctx.lineTo(X(p.x), Y(p.y));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Shadow marks every 0.25 s so far: ground ones evenly spaced, wall ones bunch at the top
    for (let tt = 0; tt <= time + 1e-9; tt += TICK) {
      const p = pos(tt);
      ctx.fillStyle = vx;
      ctx.fillRect(X(p.x) - 1, Y(0) - 5, 2, 10);
      ctx.fillStyle = vy;
      ctx.fillRect(X(0) - 5, Y(p.y) - 1, 10, 2);
    }

    // Light rays from the ball to each shadow
    const b = pos(time);
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = "#FFB300";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X(b.x), Y(b.y));
    ctx.lineTo(X(b.x), Y(0));
    ctx.moveTo(X(b.x), Y(b.y));
    ctx.lineTo(X(0), Y(b.y));
    ctx.stroke();
    ctx.setLineDash([]);

    // The two shadows
    ctx.fillStyle = vx;
    ctx.beginPath();
    ctx.ellipse(X(b.x), Y(0), 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = vy;
    ctx.beginPath();
    ctx.ellipse(X(0), Y(b.y), 3.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(X(b.x), Y(b.y), 6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    draw(t);
  }, [t, draw]);

  useEffect(() => {
    const onResize = () => draw(t);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [t, draw]);

  const play = () => {
    cancelAnimationFrame(rafRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(T);
      return;
    }
    const slow = 2.2; // play at under half speed so the marks are easy to follow
    const start = performance.now();
    const step = (now: number) => {
      const tt = Math.min(((now - start) / 1000) / slow, T);
      setT(tt);
      if (tt < T) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const vyNow = UY - g * t;
  return (
    <div className={s.sim}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="A ball kicked at 15 m/s at 30 degrees. Its shadow on the ground moves sideways at a steady 13.0 m/s, leaving evenly spaced marks. Its shadow on a wall moves only up and down: fast, slowing to a stop at the top, then speeding up downwards."
      />
      <div className={s.controls}>
        <div className={s.control}>
          <label htmlFor={id + "t"}>
            Time <output>{t.toFixed(2)} s</output>
          </label>
          <input
            id={id + "t"}
            className={s.range}
            type="range"
            min={0}
            max={T}
            step={0.01}
            value={t}
            onChange={(e) => {
              cancelAnimationFrame(rafRef.current);
              setT(+e.target.value);
            }}
          />
        </div>
      </div>
      <div className={s.readout} aria-live="polite">
        <div className={s.stat}>
          <span>Ground shadow = sideways speed = horizontal velocity v<sub>x</sub></span>
          <b>{UX.toFixed(1)} m/s</b>
        </div>
        <div className={s.stat}>
          <span>Wall shadow = up/down speed = vertical velocity v<sub>y</sub></span>
          <b>
            {Math.abs(vyNow).toFixed(1)} m/s {Math.abs(vyNow) < 0.05 ? "" : vyNow > 0 ? "up" : "down"}
          </b>
        </div>
      </div>
      <div className={s.row}>
        <button
          type="button"
          className={s.btn}
          onPointerDown={(e) => e.button === 0 && play()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), play())}
        >
          Play
        </button>
        <span className={s.legend}>
          <span className={s.sw} style={{ background: "var(--vx)" }} />
          ground shadow (horizontal): same gap every 0.25 s
          {"  "}
          <span className={s.sw} style={{ background: "var(--vy)", marginLeft: 8 }} />
          wall shadow (vertical): gaps shrink, then grow
        </span>
      </div>
    </div>
  );
}
