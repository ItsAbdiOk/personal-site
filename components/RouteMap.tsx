"use client";

import styles from "./RouteMap.module.css";

export type RouteVariant = "minimal" | "dotted" | "gradient";

interface RouteMapProps {
  polyline: string;
  variant?: RouteVariant;
  width?: number;
  height?: number;
}

/** Decode Google encoded polyline into [lat, lng] pairs */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

function useRouteGeometry(polyline: string, width: number, height: number) {
  const points = decodePolyline(polyline);
  if (points.length < 2) return null;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  const padding = 24;
  const drawW = width - padding * 2;
  const drawH = height - padding * 2;

  const scaleX = drawW / lngRange;
  const scaleY = drawH / latRange;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = padding + (drawW - lngRange * scale) / 2;
  const offsetY = padding + (drawH - latRange * scale) / 2;

  const svgPoints = points.map((p) => ({
    x: offsetX + (p[1] - minLng) * scale,
    y: offsetY + (maxLat - p[0]) * scale,
  }));

  const pathData = svgPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return { points: svgPoints, pathData, start: svgPoints[0], end: svgPoints[svgPoints.length - 1] };
}

/** Style A: Clean single line with start/end dots */
function RouteMinimal({ polyline, width = 320, height = 200 }: RouteMapProps) {
  const geo = useRouteGeometry(polyline, width, height);
  if (!geo) return null;

  return (
    <div className={styles.container}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} aria-label="Run route">
        <path d={geo.pathData} fill="none" stroke="rgba(26,26,24,0.06)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={geo.pathData} fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.routeLine} />
        <circle cx={geo.start.x} cy={geo.start.y} r="3.5" fill="var(--bg)" stroke="var(--text-primary)" strokeWidth="1.5" />
        <circle cx={geo.end.x} cy={geo.end.y} r="3.5" fill="var(--text-primary)" />
      </svg>
      <span className={styles.label}>Route</span>
    </div>
  );
}

/** Style B: Dotted path with distance markers */
function RouteDotted({ polyline, width = 320, height = 200 }: RouteMapProps) {
  const geo = useRouteGeometry(polyline, width, height);
  if (!geo) return null;

  // Sample every Nth point for dots
  const step = Math.max(1, Math.floor(geo.points.length / 60));
  const dots = geo.points.filter((_, i) => i % step === 0);

  return (
    <div className={`${styles.container} ${styles.containerDark}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} aria-label="Run route">
        {/* Faint continuous line underneath */}
        <path d={geo.pathData} fill="none" stroke="rgba(250,250,248,0.12)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots along the route */}
        {dots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="rgba(250,250,248,0.5)" className={styles.dot} style={{ animationDelay: `${i * 15}ms` }} />
        ))}
        {/* Start marker */}
        <circle cx={geo.start.x} cy={geo.start.y} r="4" fill="none" stroke="#FAFAF8" strokeWidth="1.5" />
        {/* End marker */}
        <circle cx={geo.end.x} cy={geo.end.y} r="4" fill="#FAFAF8" />
        <circle cx={geo.end.x} cy={geo.end.y} r="2" fill="#1A1A18" />
      </svg>
      <span className={styles.labelLight}>B &middot; Dotted dark</span>
    </div>
  );
}

/** Style C: Gradient stroke that fades from muted to primary along the route */
function RouteGradient({ polyline, width = 320, height = 200 }: RouteMapProps) {
  const geo = useRouteGeometry(polyline, width, height);
  if (!geo) return null;

  const gradientId = "routeGrad";

  return (
    <div className={styles.container}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} aria-label="Run route">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--border)" />
            <stop offset="100%" stopColor="var(--text-primary)" />
          </linearGradient>
        </defs>
        {/* Soft glow behind */}
        <path d={geo.pathData} fill="none" stroke="rgba(26,26,24,0.04)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Gradient line */}
        <path d={geo.pathData} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.routeLine} />
        {/* Start: hollow circle (faded) */}
        <circle cx={geo.start.x} cy={geo.start.y} r="4" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.5" />
        {/* End: solid circle (strong) */}
        <circle cx={geo.end.x} cy={geo.end.y} r="4" fill="var(--text-primary)" />
      </svg>
      <span className={styles.label}>C &middot; Gradient</span>
    </div>
  );
}

export default function RouteMap({ polyline, variant = "minimal", ...props }: RouteMapProps) {
  if (!polyline) return null;

  switch (variant) {
    case "dotted":
      return <RouteDotted polyline={polyline} {...props} />;
    case "gradient":
      return <RouteGradient polyline={polyline} {...props} />;
    default:
      return <RouteMinimal polyline={polyline} {...props} />;
  }
}
