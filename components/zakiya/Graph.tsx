"use client";

// Declarative graph figure (Figure kind "graph"): axes, grid, curves, and optional tangent /
// area modes. Everything is computed from the content's expr / points, so the Python checks in
// scripts/zakiya/check can recompute the same numbers (see lib/zakiya/graph-expr.ts).

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { Figure, GraphAxis, GraphColour, GraphSeries } from "@/lib/zakiya/types";
import { compileExpr, derivative, integrate, polylineArea, polylineAt, polylineSlope } from "@/lib/zakiya/graph-expr";
import { richToText, texToPlain } from "@/lib/zakiya/rich";
import { Rich } from "./Rich";
import g from "./Graph.module.css";

type GraphFig = Extract<Figure, { kind: "graph" }>;

type Fn = {
  id: string;
  colour: GraphColour;
  label?: string;
  lo: number; // domain on x
  hi: number;
  at: (x: number) => number;
  slope: (x: number) => number;
  area: (a: number, b: number) => number;
  pts?: [number, number][];
};

const M = { l: 46, r: 14, t: 30, b: 44 }; // plot margins (px)

/** 1, 2 or 5 × 10ⁿ, about `target` steps across the range. */
export function niceStep(range: number, target = 6): number {
  const raw = range / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
}

const decimalsOf = (step: number) => Math.max(0, Math.min(4, -Math.floor(Math.log10(step) + 1e-9)));

/** Fixed decimals with a proper minus sign. */
export function fmt(v: number, d: number): string {
  const s = (Math.abs(v) < 0.5 * 10 ** -d ? 0 : v).toFixed(d);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}

const sym = (a: GraphAxis) => (a.symbol ? texToPlain(a.symbol, "text") : "");

function buildFn(sr: GraphSeries, x: GraphAxis): Fn | null {
  const colour = sr.colour ?? "accent";
  const label = sr.label ? richToText(sr.label) : undefined;
  if (sr.points && sr.points.length > 1) {
    const pts = [...sr.points].sort((a, b) => a[0] - b[0]);
    return {
      id: sr.id,
      colour,
      label,
      pts,
      lo: Math.max(pts[0][0], x.min),
      hi: Math.min(pts[pts.length - 1][0], x.max),
      at: (v) => polylineAt(pts, v),
      slope: (v) => polylineSlope(pts, v),
      area: (a, b) => polylineArea(pts, a, b),
    };
  }
  if (sr.expr) {
    try {
      const f = compileExpr(sr.expr, x.symbol ? texToPlain(x.symbol, "text") : "x");
      return { id: sr.id, colour, label, lo: x.min, hi: x.max, at: f, slope: (v) => derivative(f, v), area: (a, b) => integrate(f, a, b) };
    } catch (e) {
      console.error(`[zakiya graph] series "${sr.id}":`, e);
    }
  }
  return null;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Graph({ fig }: { fig: GraphFig }) {
  const { x, y } = fig;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(340);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => el.clientWidth > 0 && setW(Math.max(260, Math.round(el.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = clamp(Math.round(W * 0.66), 230, 360);
  const pw = W - M.l - M.r;
  const ph = H - M.t - M.b;
  const X = useCallback((v: number) => M.l + ((v - x.min) / (x.max - x.min)) * pw, [x.min, x.max, pw]);
  const Y = useCallback((v: number) => M.t + ph - ((v - y.min) / (y.max - y.min)) * ph, [y.min, y.max, ph]);
  const unX = (px: number) => x.min + ((px - M.l) / pw) * (x.max - x.min);

  const fns = useMemo(() => {
    const m = new Map<string, Fn>();
    fig.series.forEach((sr) => {
      const f = buildFn(sr, x);
      if (f) m.set(sr.id, f);
    });
    return m;
  }, [fig.series, x]);

  const xs = x.step ?? niceStep(x.max - x.min);
  const ys = y.step ?? niceStep(y.max - y.min);
  const ticks = (a: GraphAxis, step: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(a.min / step - 1e-9) * step; v <= a.max + step * 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const xt = ticks(x, xs);
  const yt = ticks(y, ys);
  const xEvery = Math.max(1, Math.ceil(30 / ((xs / (x.max - x.min)) * pw)));
  const yEvery = Math.max(1, Math.ceil(18 / ((ys / (y.max - y.min)) * ph)));

  // ---------- tangent state ----------
  const tan = fig.tangent;
  const tf = tan ? fns.get(tan.series) : undefined;
  const snap = 10 ** Math.floor(Math.log10((x.max - x.min) / 20));
  const xDec = decimalsOf(snap);
  const [pos, setPos] = useState(() => (tan ? tan.at : 0));
  const posRef = useRef(pos);
  posRef.current = pos;
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; offset: number; moved: boolean; x0: number } | null>(null);
  const raf = useRef(0);
  const vel = useRef(0);

  const lo = tf ? tf.lo : x.min;
  const hi = tf ? tf.hi : x.max;
  const snapTo = (v: number) => clamp(Math.round(v / snap) * snap, lo, hi);

  /** Critically damped spring (response 0.3 s) from the current value; interruptible. */
  const springTo = useCallback((target: number) => {
    cancelAnimationFrame(raf.current);
    if (reducedMotion()) {
      setPos(target);
      return;
    }
    const w = (2 * Math.PI) / 0.3;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const p = posRef.current;
      const a = -w * w * (p - target) - 2 * w * vel.current;
      vel.current += a * dt;
      const next = p + vel.current * dt;
      if (Math.abs(next - target) < 1e-4 * (x.max - x.min) && Math.abs(vel.current) < 1e-3 * (x.max - x.min)) {
        vel.current = 0;
        setPos(target);
        return;
      }
      posRef.current = next;
      setPos(next);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [x.max, x.min]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pxOf = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * W;
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!tan?.draggable || !tf || e.button !== 0) return;
    const px = pxOf(e);
    const onHandle = (e.target as Element).closest?.("[data-handle]");
    if (!onHandle && (px < M.l - 8 || px > W - M.r + 8)) return;
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    try {
      svgRef.current!.setPointerCapture(e.pointerId); // keep tracking outside the graph
    } catch {
      /* pointer already gone */
    }
    // Grabbing the handle keeps the offset from where it was grabbed; tapping the plot glides there.
    drag.current = { id: e.pointerId, offset: onHandle ? px - X(posRef.current) : 0, moved: !!onHandle, x0: px };
    setDragging(true);
    if (!onHandle) springTo(snapTo(unX(px)));
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.abs(pxOf(e) - d.x0) < 4) return; // a tap on the plot keeps gliding
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    d.moved = true;
    setPos(clamp(unX(pxOf(e) - d.offset), lo, hi)); // 1:1 with the finger
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.moved) springTo(snapTo(posRef.current)); // settle on a readable value (a tap keeps gliding)
  };
  const onKey = (e: React.KeyboardEvent) => {
    const big = e.shiftKey ? 10 : 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = posRef.current + snap * big;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = posRef.current - snap * big;
    else if (e.key === "Home") next = lo;
    else if (e.key === "End") next = hi;
    if (next === null) return;
    e.preventDefault();
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    posRef.current = snapTo(next);
    setPos(posRef.current);
  };

  // ---------- geometry ----------
  const curvePath = (f: Fn) => {
    if (f.pts) return f.pts.map(([a, b], i) => `${i ? "L" : "M"}${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(" ");
    const n = Math.max(120, Math.round(pw));
    let d = "";
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const v = f.lo + ((f.hi - f.lo) * i) / n;
      const yv = f.at(v);
      if (!Number.isFinite(yv)) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${X(v).toFixed(1)},${Y(clamp(yv, y.min - (y.max - y.min), y.max + (y.max - y.min))).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  const tangent = useMemo(() => {
    if (!tan || !tf) return null;
    // Readouts use the value rounded to the shown precision, so t, gradient and Δy always agree;
    // the handle itself follows the finger continuously (see handleAt).
    const at = clamp(Math.round(pos / snap) * snap, tf.lo, tf.hi);
    const y0 = tf.at(at);
    const m = tf.slope(at);
    if (!Number.isFinite(y0) || !Number.isFinite(m)) return null;
    const line = (v: number) => y0 + m * (v - at);
    let tri = null;
    if (tan.showTriangle) {
      const span = Math.max(snap, Math.round((x.max - x.min) / 3 / snap) * snap);
      let x1 = Math.max(tf.lo, at - span);
      let x2 = Math.min(tf.hi, at + span);
      if (m !== 0) {
        // Keep the triangle on the axes: stop where the tangent leaves the y-range (on a snap step).
        const xa = at + (y.min - y0) / m;
        const xb = at + (y.max - y0) / m;
        x1 = Math.max(x1, Math.ceil((Math.min(xa, xb) - 1e-9) / snap) * snap);
        x2 = Math.min(x2, Math.floor((Math.max(xa, xb) + 1e-9) / snap) * snap);
      }
      if (x2 - x1 > snap / 2) tri = { x1, x2, y1: line(x1), y2: line(x2) };
    }
    return { at, y0, m, line, tri };
  }, [tan, tf, pos, snap, x.max, x.min, y.max, y.min]);

  const area = useMemo(() => {
    const ar = fig.area;
    const f = ar ? fns.get(ar.series) : undefined;
    if (!ar || !f) return null;
    const a = Math.max(Math.min(ar.from, ar.to), f.lo);
    const b = Math.min(Math.max(ar.from, ar.to), f.hi);
    const value = f.area(a, b);
    // Shaded region: along the curve, then back along y = 0.
    const base = Y(clamp(0, y.min, y.max));
    let d = `M${X(a).toFixed(1)},${base.toFixed(1)}`;
    if (f.pts) {
      // keep vertical steps: visit both points that share an x
      d += f.pts
        .filter((p) => p[0] >= a && p[0] <= b)
        .reduce((s, p) => s + ` L${X(p[0]).toFixed(1)},${Y(clamp(p[1], y.min, y.max)).toFixed(1)}`, ` L${X(a).toFixed(1)},${Y(clamp(f.at(a), y.min, y.max)).toFixed(1)}`);
      d += ` L${X(b).toFixed(1)},${Y(clamp(f.at(b), y.min, y.max)).toFixed(1)}`;
    } else {
      d += Array.from({ length: 161 }, (_, i) => a + ((b - a) * i) / 160).map((v) => ` L${X(v).toFixed(1)},${Y(clamp(f.at(v), y.min, y.max)).toFixed(1)}`).join("");
    }
    d += ` L${X(b).toFixed(1)},${base.toFixed(1)} Z`;

    let squares: { cells: { x0: number; y0: number; full: boolean }[]; full: number; part: number; partSum: number } | null = null;
    if (ar.squares) {
      const cells: { x0: number; y0: number; full: boolean }[] = [];
      let full = 0;
      let part = 0;
      let partSum = 0;
      for (let cx = Math.floor(a / xs) * xs; cx < b - 1e-9; cx += xs) {
        for (let cy = Math.floor(y.min / ys) * ys; cy < y.max - 1e-9; cy += ys) {
          // Fraction of this square between the curve and y = 0 (and inside from→to).
          const l = Math.max(cx, a);
          const r = Math.min(cx + xs, b);
          if (r <= l) continue;
          const N = 24;
          let cover = 0;
          for (let i = 0; i < N; i++) {
            const v = l + ((r - l) * (i + 0.5)) / N;
            const fv = f.at(v);
            if (!Number.isFinite(fv)) continue;
            const top = Math.min(cy + ys, Math.max(0, fv));
            const bot = Math.max(cy, Math.min(0, fv));
            cover += Math.max(0, top - bot) / ys;
          }
          cover = (cover / N) * ((r - l) / xs);
          if (cover > 0.985) {
            full++;
            cells.push({ x0: cx, y0: cy, full: true });
          } else if (cover > 0.015) {
            part++;
            partSum += cover;
            cells.push({ x0: cx, y0: cy, full: false });
          }
        }
      }
      squares = { cells, full, part, partSum };
    }
    return { a, b, value, d, f, squares };
  }, [fig.area, fns, X, Y, xs, ys, y.min, y.max]);

  // ---------- readouts ----------
  const xName = sym(x) || richToText(x.label);
  const ySym = sym(y);
  const tanText = (() => {
    if (!tan || !tangent) return null;
    const d = tan.readout.decimals;
    const q = richToText(tan.readout.quantity);
    return `gradient = ${fmt(tangent.m, d)} ${tan.readout.unit} → ${q} at ${xName} = ${fmt(tangent.at, xDec)} ${x.unit}`;
  })();
  const areaText = area && fig.area ? `area = ${fmt(area.value, fig.area.readout.decimals)} ${fig.area.readout.unit} → ${richToText(fig.area.readout.quantity)}` : null;

  const stroke = (c: GraphColour) => `var(--${c})`;
  const handleAt = tangent && tf ? { cx: X(pos), cy: Y(tf.at(pos)) } : null;
  const clip = `${uid}-clip`;
  const yAxisAt = Y(clamp(0, y.min, y.max));
  const xAxisAt = X(clamp(0, x.min, x.max));

  return (
    <div className={g.wrap}>
      <div ref={wrapRef} className={g.plot}>
        <svg
          ref={svgRef}
          className={`${g.svg} ${tan?.draggable ? g.svgDrag : ""} ${dragging ? g.dragging : ""}`}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label={fig.alt}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <defs>
            <clipPath id={clip}>
              <rect x={M.l} y={M.t - 2} width={pw + 2} height={ph + 4} />
            </clipPath>
          </defs>

          {/* grid */}
          <g className={g.grid}>
            {xt.map((v) => (
              <line key={`gx${v}`} x1={X(v)} x2={X(v)} y1={M.t} y2={M.t + ph} />
            ))}
            {yt.map((v) => (
              <line key={`gy${v}`} x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} />
            ))}
          </g>

          {/* area + squares */}
          {area && (
            <g clipPath={`url(#${clip})`}>
              <path d={area.d} className={g.area} style={{ fill: stroke(area.f.colour) }} />
              {area.squares?.cells.map((c) => (
                <rect
                  key={`${c.x0}:${c.y0}`}
                  x={X(c.x0) + 1}
                  y={Y(c.y0 + ys) + 1}
                  width={Math.max(0, X(c.x0 + xs) - X(c.x0) - 2)}
                  height={Math.max(0, Y(c.y0) - Y(c.y0 + ys) - 2)}
                  rx={2}
                  className={c.full ? g.sqFull : g.sqPart}
                />
              ))}
            </g>
          )}

          {/* axes */}
          <g className={g.axis}>
            <line x1={M.l} x2={M.l + pw} y1={yAxisAt} y2={yAxisAt} />
            <line x1={xAxisAt} x2={xAxisAt} y1={M.t} y2={M.t + ph} />
          </g>
          <g className={g.tick}>
            {xt.map((v, i) =>
              i % xEvery === 0 ? (
                <text key={`tx${v}`} x={X(v)} y={M.t + ph + 15} textAnchor="middle">
                  {fmt(v, decimalsOf(xs))}
                </text>
              ) : null,
            )}
            {yt.map((v, i) =>
              i % yEvery === 0 ? (
                <text key={`ty${v}`} x={M.l - 6} y={Y(v) + 4} textAnchor="end">
                  {fmt(v, decimalsOf(ys))}
                </text>
              ) : null,
            )}
          </g>
          <text className={g.axisLabel} x={W - M.r} y={H - 8} textAnchor="end">
            {richToText(x.label)} {x.symbol && <tspan fontStyle="italic">{sym(x)}</tspan>} / {x.unit}
          </text>
          <text className={g.axisLabel} x={4} y={16} textAnchor="start">
            {richToText(y.label)} {y.symbol && <tspan fontStyle="italic">{ySym}</tspan>} / {y.unit}
          </text>

          {/* curves */}
          <g clipPath={`url(#${clip})`}>
            {[...fns.values()].map((f) => (
              <path key={f.id} d={curvePath(f)} className={g.curve} style={{ stroke: stroke(f.colour) }} />
            ))}
          </g>

          {/* tangent */}
          {tangent && (
            <g clipPath={`url(#${clip})`}>
              <line
                className={g.tangent}
                x1={X(x.min)}
                y1={Y(tangent.line(x.min))}
                x2={X(x.max)}
                y2={Y(tangent.line(x.max))}
              />
              {tangent.tri && (
                <g>
                  <line className={g.legX} x1={X(tangent.tri.x1)} y1={Y(tangent.tri.y1)} x2={X(tangent.tri.x2)} y2={Y(tangent.tri.y1)} />
                  <line className={g.legY} x1={X(tangent.tri.x2)} y1={Y(tangent.tri.y1)} x2={X(tangent.tri.x2)} y2={Y(tangent.tri.y2)} />
                </g>
              )}
            </g>
          )}

          {tangent?.tri && (() => {
            const t3 = tangent.tri;
            const bottom = M.t + ph;
            const yLeg = Y(t3.y1);
            // Δx under the horizontal leg, or just above it when it sits on the x-axis.
            const below = tangent.m >= 0 ? yLeg + 15 <= bottom - 2 : false;
            const yX = clamp(below ? yLeg + 15 : yLeg - 7, M.t + 12, bottom - 4);
            // Δy beside the vertical leg: to its right if there is room, else to its left, clear of
            // the handle (which sits level with the leg's middle) and of the Δx label.
            const yLabel = `Δ${ySym || "y"} = ${fmt(t3.y2 - t3.y1, tan!.readout.decimals)} ${y.unit}`;
            const est = yLabel.length * 6.8;
            const right = X(t3.x2) + 8 + est <= W - 2;
            const hy = Y(tangent.y0);
            const fits = (v: number) => v >= M.t + 12 && v <= bottom - 4 && Math.abs(v - yX) >= 16;
            const mid = (yLeg + Y(t3.y2)) / 2 + 4;
            const yY = right ? clamp(mid, M.t + 12, bottom - 4) : ([hy + 26, hy - 16, mid].find(fits) ?? mid);
            return (
              <g>
                <text className={`${g.legLabel} ${g.legLabelX}`} x={(X(t3.x1) + X(t3.x2)) / 2} y={yX} textAnchor="middle">
                  Δ{xName} = {fmt(t3.x2 - t3.x1, xDec)} {x.unit}
                </text>
                <text className={`${g.legLabel} ${g.legLabelY}`} x={X(t3.x2) + (right ? 8 : -6)} y={yY} textAnchor={right ? "start" : "end"}>
                  {yLabel}
                </text>
              </g>
            );
          })()}

          {/* marked points */}
          {fig.points?.map((p, i) => (
            <g key={`p${i}`} className={g.point}>
              <circle cx={X(p.x)} cy={Y(p.y)} r={4} />
              {p.label && (
                <text x={X(p.x) - 7} y={Y(p.y) - 8} textAnchor="end">
                  {richToText(p.label)}
                </text>
              )}
            </g>
          ))}

          {/* tangent handle */}
          {tangent && handleAt && (
            tan!.draggable ? (
              <g
                data-handle
                className={g.handle}
                role="slider"
                tabIndex={0}
                aria-label={`Tangent point: drag along the curve to change ${xName}`}
                aria-valuemin={lo}
                aria-valuemax={hi}
                aria-valuenow={+tangent.at.toFixed(xDec)}
                aria-valuetext={tanText ?? undefined}
                onKeyDown={onKey}
              >
                <circle className={g.handleHit} cx={handleAt.cx} cy={handleAt.cy} r={22} />
                <circle className={g.handleRing} cx={handleAt.cx} cy={handleAt.cy} r={13} />
                <circle className={g.handleDot} cx={handleAt.cx} cy={handleAt.cy} r={7.5} style={{ fill: stroke(tf!.colour) }} />
              </g>
            ) : (
              <circle className={g.point} cx={handleAt.cx} cy={handleAt.cy} r={4.5} />
            )
          )}
        </svg>
      </div>

      {(tanText || areaText) && (
        <div className={g.readouts} aria-live="polite">
          {tanText && tangent && (
            <p className={g.readout}>
              <span>
                gradient ={" "}
                {tangent.tri && (
                  <>
                    <span className={g.cY}>{fmt(tangent.tri.y2 - tangent.tri.y1, tan!.readout.decimals)}</span> ÷{" "}
                    <span className={g.cX}>{fmt(tangent.tri.x2 - tangent.tri.x1, xDec)}</span> ={" "}
                  </>
                )}
                <b>
                  {fmt(tangent.m, tan!.readout.decimals)} {tan!.readout.unit}
                </b>{" "}
                → <b>{richToText(tan!.readout.quantity)}</b> at {xName} = {fmt(tangent.at, xDec)} {x.unit}
              </span>
              {tan!.draggable && <span className={g.hint}>Drag the dot along the curve (or use the arrow keys).</span>}
            </p>
          )}
          {areaText && area && (
            <p className={g.readout}>
              <span>
                area = <b>{fmt(area.value, fig.area!.readout.decimals)} {fig.area!.readout.unit}</b> → <b>{richToText(fig.area!.readout.quantity)}</b>
              </span>
              <span className={g.hint}>
                Shaded from {xName} = {fmt(area.a, decimalsOf(xs))} to {fmt(area.b, decimalsOf(xs))} {x.unit}.
              </span>
              {area.squares && (
                <span className={g.hint}>
                  Counting squares: {area.squares.full} full
                  {area.squares.part > 0 && ` + ${area.squares.part} part-filled (≈ ${fmt(area.squares.partSum, 1)} between them)`} ≈{" "}
                  {fmt(area.squares.full + area.squares.partSum, 1)} squares × {fmt(xs * ys, decimalsOf(xs * ys))} {fig.area!.readout.unit} each.
                </span>
              )}
            </p>
          )}
        </div>
      )}
      {fig.series.some((sr) => sr.label) && fig.series.length > 1 && (
        <ul className={g.legend}>
          {fig.series.map((sr) =>
            sr.label ? (
              <li key={sr.id}>
                <span className={g.swatch} style={{ background: stroke(sr.colour ?? "accent") }} aria-hidden />
                <Rich text={sr.label} />
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
