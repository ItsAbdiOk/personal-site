/**
 * Map-matching via Valhalla: snap a noisy GPS trace to real streets.
 *
 * Uses the free public Valhalla instance hosted by OpenStreetMap Germany:
 *   https://valhalla1.openstreetmap.de/trace_route
 *
 * Docs: https://valhalla.github.io/valhalla/api/map-matching/api-reference/
 *
 * Caches matched traces to disk, keyed by Strava activity ID, so each run is
 * only matched once. Failures fall back to the raw trace.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const VALHALLA_URLS = [
  "https://valhalla1.openstreetmap.de/trace_route",
  "https://valhalla.openstreetmap.de/trace_route",
];

const CACHE_DIR = join(process.cwd(), ".map-match-cache");

interface ValhallaTracePoint {
  lat: number;
  lon: number;
}

interface ValhallaResponse {
  trip?: {
    legs?: Array<{
      shape: string; // encoded polyline with precision 6
    }>;
  };
}

/** Decode Valhalla's polyline6 encoding (like Google polyline but *1e6 not *1e5) */
function decodePolyline6(encoded: string): [number, number][] {
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

    // Valhalla uses *1e6 precision
    points.push([lat / 1e6, lng / 1e6]);
  }

  return points;
}

/**
 * Match a GPS trace to OSM streets via Valhalla.
 * Returns the matched coordinate sequence, or null on failure.
 *
 * shapeMatch = "walk_or_snap" is the robust default. Use "map_snap" for
 * stricter matching that stays on roads even for noisy GPS.
 */
async function fetchValhallaMatch(
  latlng: number[][]
): Promise<number[][] | null> {
  // Downsample if too many points (Valhalla has practical limits on input size).
  // 300 points is plenty for route shape; Strava sends ~862 for a 1km walk.
  const MAX_POINTS = 300;
  let sampled: number[][] = latlng;
  if (latlng.length > MAX_POINTS) {
    const step = latlng.length / MAX_POINTS;
    sampled = [];
    for (let i = 0; i < MAX_POINTS; i++) {
      sampled.push(latlng[Math.floor(i * step)]);
    }
    // Always include the last point
    if (sampled[sampled.length - 1] !== latlng[latlng.length - 1]) {
      sampled.push(latlng[latlng.length - 1]);
    }
  }

  const body = {
    shape: sampled.map(([lat, lon]) => ({ lat, lon })),
    costing: "pedestrian",
    shape_match: "walk_or_snap",
    format: "json",
    filters: {
      attributes: ["edge.way_id", "shape"],
      action: "include",
    },
  };

  for (const url of VALHALLA_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.warn(`valhalla ${url} -> ${res.status}`);
        continue;
      }
      const data = (await res.json()) as ValhallaResponse;
      if (!data.trip?.legs || data.trip.legs.length === 0) {
        console.warn("valhalla: empty trip");
        continue;
      }
      // Concatenate all leg shapes
      const all: number[][] = [];
      for (const leg of data.trip.legs) {
        if (!leg.shape) continue;
        const decoded = decodePolyline6(leg.shape);
        all.push(...decoded);
      }
      if (all.length < 2) {
        console.warn("valhalla: decoded too few points");
        continue;
      }
      return all;
    } catch (e) {
      console.warn(`valhalla ${url} ->`, e);
    }
  }
  return null;
}

/** Match a GPS trace with disk caching by activity ID */
export async function matchTraceCached(
  activityId: number,
  latlng: number[][]
): Promise<number[][] | null> {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
  const cacheFile = join(CACHE_DIR, `${activityId}.json`);
  if (existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(readFileSync(cacheFile, "utf-8"));
      if (cached && Array.isArray(cached.matched)) {
        return cached.matched as number[][];
      }
    } catch {
      // Cache corrupt — fall through and re-fetch
    }
  }

  const matched = await fetchValhallaMatch(latlng);
  if (matched) {
    try {
      writeFileSync(
        cacheFile,
        JSON.stringify({ activityId, matched, cached: Date.now() })
      );
    } catch (e) {
      console.warn("map-match cache write failed:", e);
    }
  } else {
    // Cache a miss too, so we don't retry on every request. Use a short-lived
    // marker.
    try {
      writeFileSync(
        cacheFile,
        JSON.stringify({
          activityId,
          matched: null,
          cached: Date.now(),
          error: "valhalla_failed",
        })
      );
    } catch {
      // Ignore write errors
    }
  }
  return matched;
}
