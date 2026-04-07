/**
 * Elevation lookup from a static OS Terrain 50 grid.
 * Loads the JSON produced by scripts/convert-os-terrain-50.ts at server start
 * and provides a fast lat/lng -> elevation lookup.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import proj4 from "proj4";

proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);

interface ElevationGridData {
  source: string;
  format: string;
  xllcorner: number;
  yllcorner: number;
  cellsize: number;
  ncols: number;
  nrows: number;
  scale: number;
  noData: number;
  elevations: number[];
}

let cached: ElevationGridData | null = null;
let cacheChecked = false;

function loadGrid(): ElevationGridData | null {
  if (cacheChecked) return cached;
  cacheChecked = true;

  const path = join(process.cwd(), "public", "data", "london-elevation.json");
  if (!existsSync(path)) {
    return null;
  }
  try {
    const text = readFileSync(path, "utf-8");
    cached = JSON.parse(text) as ElevationGridData;
    return cached;
  } catch (e) {
    console.warn("Failed to load elevation grid:", e);
    return null;
  }
}

export function isElevationGridAvailable(): boolean {
  return loadGrid() !== null;
}

/**
 * Look up elevation (meters) at a lat/lng using bilinear interpolation.
 * Smooths out the source 50m grid when sampling at finer resolution.
 * Returns null if outside the grid.
 */
export function elevationAt(lat: number, lng: number): number | null {
  const grid = loadGrid();
  if (!grid) return null;

  const [easting, northing] = proj4("EPSG:4326", "EPSG:27700", [lng, lat]);

  // Continuous grid coordinates
  const cf = (easting - grid.xllcorner) / grid.cellsize;
  const rf = (northing - grid.yllcorner) / grid.cellsize;

  if (cf < 0 || cf > grid.ncols - 1 || rf < 0 || rf > grid.nrows - 1) {
    return null;
  }

  const c0 = Math.floor(cf);
  const r0 = Math.floor(rf);
  const c1 = Math.min(c0 + 1, grid.ncols - 1);
  const r1 = Math.min(r0 + 1, grid.nrows - 1);
  const fx = cf - c0;
  const fy = rf - r0;

  const v00 = grid.elevations[r0 * grid.ncols + c0];
  const v10 = grid.elevations[r0 * grid.ncols + c1];
  const v01 = grid.elevations[r1 * grid.ncols + c0];
  const v11 = grid.elevations[r1 * grid.ncols + c1];

  // If any sample is NoData, fall back to nearest valid
  if (
    v00 === grid.noData ||
    v10 === grid.noData ||
    v01 === grid.noData ||
    v11 === grid.noData
  ) {
    const stored = grid.elevations[r0 * grid.ncols + c0];
    if (stored === grid.noData) return null;
    return stored / grid.scale;
  }

  // Bilinear interpolation
  const top = v00 * (1 - fx) + v10 * fx;
  const bottom = v01 * (1 - fx) + v11 * fx;
  const interpolated = top * (1 - fy) + bottom * fy;
  return interpolated / grid.scale;
}

/**
 * Build a regular lat/lng grid covering a bounding box, with elevations
 * sampled from the OS Terrain 50 grid. Returns null if grid is unavailable.
 *
 * The output is a regular array indexed [row * gridSize + col] where row 0
 * is at minLat (south) and col 0 is at minLng (west).
 */
export function sampleElevationGrid(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  gridSize: number
): {
  elevations: number[];
  gridSize: number;
  bounds: typeof bounds;
  validCount: number;
} | null {
  const grid = loadGrid();
  if (!grid) return null;

  const elevations = new Array(gridSize * gridSize).fill(0);
  const latStep = (bounds.maxLat - bounds.minLat) / (gridSize - 1);
  const lngStep = (bounds.maxLng - bounds.minLng) / (gridSize - 1);

  let validCount = 0;
  let lastValid = 0;
  for (let r = 0; r < gridSize; r++) {
    const lat = bounds.minLat + r * latStep;
    for (let c = 0; c < gridSize; c++) {
      const lng = bounds.minLng + c * lngStep;
      const e = elevationAt(lat, lng);
      if (e !== null) {
        elevations[r * gridSize + c] = e;
        lastValid = e;
        validCount++;
      } else {
        // Use last valid as a fill (will be overwritten if we find another)
        elevations[r * gridSize + c] = lastValid;
      }
    }
  }

  // Second pass: fill any leading 0s with the first valid value
  let firstValid = 0;
  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] !== 0) {
      firstValid = elevations[i];
      break;
    }
  }
  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] === 0) elevations[i] = firstValid;
    else break;
  }

  if (validCount === 0) return null;

  return { elevations, gridSize, bounds, validCount };
}
