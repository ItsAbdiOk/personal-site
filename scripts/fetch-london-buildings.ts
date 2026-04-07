/**
 * Fetch building footprints + heights from OpenStreetMap via Overpass API
 * for a bounding box and save as a compact JSON file.
 *
 * Usage:
 *   bun scripts/fetch-london-buildings.ts [bbox] [output-path]
 *
 *   bbox        "minLat,minLng,maxLat,maxLng" — defaults to central London
 *   output-path defaults to public/data/london-buildings.json
 *
 * The Overpass query returns all `way` and `relation` elements tagged
 * `building=*` within the bounding box. We extract the polygon coordinates
 * (closed ways) and the best-available height tag.
 *
 * Heights priority:
 *   1. building:height or height — explicit meters
 *   2. building:levels * 3m + 0.5m — count floors
 *   3. fall back to 6m for residential, 9m for commercial, 6m default
 *
 * Output JSON shape:
 *   {
 *     bounds: { minLat, minLng, maxLat, maxLng },
 *     count: <number>,
 *     buildings: [
 *       { p: [[lat, lng], [lat, lng], ...], h: 12.5 },
 *       ...
 *     ]
 *   }
 *
 * Polygons are closed (first point == last point) and stored as Int24
 * deltas from minLat/minLng to keep file size down.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

// Multiple Overpass mirrors. We try them in order if one times out.
const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

interface OsmNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

interface OsmWay {
  type: "way";
  id: number;
  nodes?: number[];
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

interface OsmRelation {
  type: "relation";
  id: number;
  members: { type: string; ref: number; role: string }[];
  tags?: Record<string, string>;
}

type OsmElement = OsmNode | OsmWay | OsmRelation;

interface OverpassResponse {
  version: number;
  elements: OsmElement[];
}

function parseHeight(tags: Record<string, string> | undefined): number {
  if (!tags) return 6;

  // Priority 1: explicit height in meters
  const h = tags["height"] || tags["building:height"];
  if (h) {
    const m = h.match(/[\d.]+/);
    if (m) {
      const v = parseFloat(m[0]);
      if (v > 0 && v < 500) return v;
    }
  }

  // Priority 2: building:levels (floors)
  const levels = tags["building:levels"];
  if (levels) {
    const v = parseInt(levels, 10);
    if (v > 0 && v < 200) return v * 3 + 0.5;
  }

  // Priority 3: fall back by building type
  const type = tags["building"];
  if (type === "commercial" || type === "office" || type === "retail") return 9;
  if (type === "industrial" || type === "warehouse") return 8;
  if (type === "church" || type === "cathedral") return 18;
  if (type === "house") return 6;
  if (type === "apartments") return 12;

  // Default
  return 6;
}

async function fetchBuildingsTile(bbox: {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}): Promise<OverpassResponse> {
  // `out geom` inlines coordinates directly, much faster than out;>;out skel
  const query = `
    [out:json][timeout:120];
    (
      way["building"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});
    );
    out geom;
  `;

  // Try all mirrors, with up to 4 retry rounds and exponential backoff
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    for (const url of OVERPASS_URLS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
        });
        if (!res.ok) {
          lastError = new Error(`${url}: ${res.status} ${res.statusText}`);
          console.log(`    ${url} -> ${res.status}`);
          continue;
        }
        const data = (await res.json()) as OverpassResponse;
        return data;
      } catch (e) {
        lastError = e as Error;
        console.log(`    ${url} -> network error`);
      }
    }
    const waitMs = (attempt + 1) * 8000;
    console.log(`    All mirrors failed on attempt ${attempt + 1}, waiting ${waitMs / 1000}s...`);
    await new Promise((r) => setTimeout(r, waitMs));
  }
  throw lastError ?? new Error("All Overpass mirrors failed after 4 attempts");
}

/** Split bbox into tiles and fetch in sequence so each query is small enough to succeed */
async function fetchBuildings(bbox: {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}): Promise<OverpassResponse> {
  console.log("Querying Overpass API...");
  console.log(`  Bbox: ${bbox.minLat},${bbox.minLng} -> ${bbox.maxLat},${bbox.maxLng}`);

  // Split into a 4x4 grid of sub-tiles to keep each query small
  const TILES = 4;
  const latStep = (bbox.maxLat - bbox.minLat) / TILES;
  const lngStep = (bbox.maxLng - bbox.minLng) / TILES;

  const allElements: OsmElement[] = [];
  let tileNum = 0;
  for (let i = 0; i < TILES; i++) {
    for (let j = 0; j < TILES; j++) {
      tileNum++;
      const tile = {
        minLat: bbox.minLat + i * latStep,
        maxLat: bbox.minLat + (i + 1) * latStep,
        minLng: bbox.minLng + j * lngStep,
        maxLng: bbox.minLng + (j + 1) * lngStep,
      };
      console.log(`  Tile ${tileNum}/${TILES * TILES}...`);
      const data = await fetchBuildingsTile(tile);
      console.log(`    -> ${data.elements.length} elements`);
      allElements.push(...data.elements);
      // Be polite to the API
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // Dedupe by id+type (sub-tiles overlap on borders)
  const seen = new Set<string>();
  const unique: OsmElement[] = [];
  for (const el of allElements) {
    const key = `${el.type}:${el.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(el);
    }
  }

  console.log(`  Total: ${unique.length} unique elements`);
  return { version: 0, elements: unique };
}

function processBuildings(data: OverpassResponse) {
  const buildings: { p: [number, number][]; h: number }[] = [];

  for (const el of data.elements) {
    if (el.type !== "way") continue;
    if (!el.tags?.["building"]) continue;
    if (!el.geometry || el.geometry.length < 4) continue;

    const poly: [number, number][] = el.geometry.map((g) => [g.lat, g.lon]);

    // Ensure closed
    if (poly[0][0] !== poly[poly.length - 1][0] || poly[0][1] !== poly[poly.length - 1][1]) {
      poly.push([poly[0][0], poly[0][1]]);
    }

    buildings.push({ p: poly, h: parseHeight(el.tags) });
  }

  return buildings;
}

// --- Main ---
const bboxArg = process.argv[2] || "51.507,-0.169,51.553,-0.096"; // Central London ~5km
const outputPath = process.argv[3] || "public/data/london-buildings.json";

const [minLat, minLng, maxLat, maxLng] = bboxArg.split(",").map(Number);
const bounds = { minLat, minLng, maxLat, maxLng };

(async () => {
  try {
    const data = await fetchBuildings(bounds);
    const buildings = processBuildings(data);

    console.log(`Processed ${buildings.length} buildings`);

    // Compact format: store coords as Int32 deltas from bounds.minLat/minLng,
    // scaled by 1e6 (~10cm precision). This shrinks the JSON dramatically vs
    // verbose floats and array-of-objects-of-arrays.
    const SCALE = 1e6;
    const compact = buildings.map((b) => {
      // Drop the closing duplicate point — renderer can re-close
      const pts = b.p.slice(0, -1);
      const flat: number[] = [];
      for (const [lat, lng] of pts) {
        flat.push(
          Math.round((lat - bounds.minLat) * SCALE),
          Math.round((lng - bounds.minLng) * SCALE)
        );
      }
      return [Math.round(b.h * 10), flat] as [number, number[]];
    });

    const output = {
      source: "OpenStreetMap (ODbL)",
      bounds,
      scale: SCALE,
      heightScale: 10,
      count: compact.length,
      // Each entry: [heightDeciMeters, [latDelta0, lngDelta0, latDelta1, lngDelta1, ...]]
      buildings: compact,
    };

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(output));
    const sizeKB = (JSON.stringify(output).length / 1024).toFixed(0);
    console.log(`✓ Wrote ${outputPath} (${sizeKB} KB)`);
  } catch (e) {
    console.error("Failed:", e);
    process.exit(1);
  }
})();
