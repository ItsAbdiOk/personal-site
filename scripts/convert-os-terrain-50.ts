/**
 * Convert OS Terrain 50 ASCII grid (.asc) files into a single JSON elevation grid.
 *
 * Usage:
 *   bun scripts/convert-os-terrain-50.ts <input-dir> [output-path] [bbox]
 *
 *   input-dir   directory containing .asc files (recursive)
 *   output-path defaults to public/data/london-elevation.json
 *   bbox        optional crop box: "minLat,minLng,maxLat,maxLng"
 *               example: "51.45,-0.25,51.60,-0.05" for central London
 *
 * The OS Terrain 50 data is in the British National Grid coordinate system
 * (EPSG:27700). We store the grid in BNG and convert at lookup time.
 *
 * Download OS Terrain 50 from:
 *   https://osdatahub.os.uk/downloads/open/Terrain50
 *   (download the ASC version, not GeoTIFF)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import proj4 from "proj4";

// Define British National Grid (EPSG:27700) for proj4
proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);

interface ParsedAsc {
  ncols: number;
  nrows: number;
  xllcorner: number;
  yllcorner: number;
  cellsize: number;
  noDataValue: number;
  data: number[][]; // [row from top][col]
}

function parseAsc(content: string): ParsedAsc {
  const lines = content.split(/\r?\n/);
  const header: Record<string, number> = {};
  let i = 0;
  // First 6 lines are headers (ncols, nrows, xllcorner, yllcorner, cellsize, NODATA_value)
  for (; i < 6; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    header[parts[0].toLowerCase()] = parseFloat(parts[1]);
  }
  const nrows = header.nrows;
  const ncols = header.ncols;
  const data: number[][] = [];
  for (let r = 0; r < nrows; r++) {
    const row = lines[6 + r];
    if (!row) {
      data.push(new Array(ncols).fill(-9999));
      continue;
    }
    data.push(row.trim().split(/\s+/).map(Number));
  }
  return {
    ncols,
    nrows,
    xllcorner: header.xllcorner,
    yllcorner: header.yllcorner,
    cellsize: header.cellsize,
    noDataValue: header.nodata_value ?? -9999,
    data,
  };
}

function findAscFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...findAscFiles(full));
    } else if (entry.toLowerCase().endsWith(".asc")) {
      out.push(full);
    }
  }
  return out;
}

interface CombinedGrid {
  xllcorner: number;
  yllcorner: number;
  cellsize: number;
  ncols: number;
  nrows: number;
  data: Float32Array; // row-major from bottom-left, [row * ncols + col]
}

function combine(parsed: ParsedAsc[]): CombinedGrid {
  if (parsed.length === 0) throw new Error("No tiles to combine");
  const cellsize = parsed[0].cellsize;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of parsed) {
    if (p.cellsize !== cellsize) {
      throw new Error(`Tile cellsize mismatch: ${p.cellsize} vs ${cellsize}`);
    }
    minX = Math.min(minX, p.xllcorner);
    maxX = Math.max(maxX, p.xllcorner + p.ncols * p.cellsize);
    minY = Math.min(minY, p.yllcorner);
    maxY = Math.max(maxY, p.yllcorner + p.nrows * p.cellsize);
  }
  const ncols = Math.round((maxX - minX) / cellsize);
  const nrows = Math.round((maxY - minY) / cellsize);
  const data = new Float32Array(ncols * nrows).fill(-9999);
  for (const p of parsed) {
    const colOffset = Math.round((p.xllcorner - minX) / cellsize);
    const rowOffsetFromBottom = Math.round((p.yllcorner - minY) / cellsize);
    for (let r = 0; r < p.nrows; r++) {
      // ASC rows go top-to-bottom; we store bottom-to-top
      const tileRowFromBottom = p.nrows - 1 - r;
      const globalRowFromBottom = rowOffsetFromBottom + tileRowFromBottom;
      if (globalRowFromBottom < 0 || globalRowFromBottom >= nrows) continue;
      for (let c = 0; c < p.ncols; c++) {
        const globalCol = colOffset + c;
        if (globalCol < 0 || globalCol >= ncols) continue;
        const v = p.data[r][c];
        if (v !== p.noDataValue) {
          data[globalRowFromBottom * ncols + globalCol] = v;
        }
      }
    }
  }
  return { xllcorner: minX, yllcorner: minY, cellsize, ncols, nrows, data };
}

/** Crop a combined grid to a lat/lng bounding box */
function cropToBbox(
  grid: CombinedGrid,
  bbox: { minLat: number; minLng: number; maxLat: number; maxLng: number }
): CombinedGrid {
  // Convert the four corners of the bbox to BNG and find the enclosing rectangle
  const corners: [number, number][] = [
    [bbox.minLng, bbox.minLat],
    [bbox.minLng, bbox.maxLat],
    [bbox.maxLng, bbox.minLat],
    [bbox.maxLng, bbox.maxLat],
  ];
  const bngCorners = corners.map((c) => proj4("EPSG:4326", "EPSG:27700", c));
  const minE = Math.min(...bngCorners.map((c) => c[0]));
  const maxE = Math.max(...bngCorners.map((c) => c[0]));
  const minN = Math.min(...bngCorners.map((c) => c[1]));
  const maxN = Math.max(...bngCorners.map((c) => c[1]));

  const cs = grid.cellsize;
  const c0 = Math.max(0, Math.floor((minE - grid.xllcorner) / cs));
  const c1 = Math.min(grid.ncols, Math.ceil((maxE - grid.xllcorner) / cs));
  const r0 = Math.max(0, Math.floor((minN - grid.yllcorner) / cs));
  const r1 = Math.min(grid.nrows, Math.ceil((maxN - grid.yllcorner) / cs));

  const newCols = c1 - c0;
  const newRows = r1 - r0;
  if (newCols <= 0 || newRows <= 0) {
    throw new Error(
      `Bbox does not intersect data. Source: BNG ${grid.xllcorner},${grid.yllcorner} -> ${grid.xllcorner + grid.ncols * cs},${grid.yllcorner + grid.nrows * cs}. Bbox BNG: ${minE},${minN} -> ${maxE},${maxN}`
    );
  }
  const newData = new Float32Array(newCols * newRows);
  for (let r = 0; r < newRows; r++) {
    for (let c = 0; c < newCols; c++) {
      newData[r * newCols + c] = grid.data[(r0 + r) * grid.ncols + (c0 + c)];
    }
  }
  return {
    xllcorner: grid.xllcorner + c0 * cs,
    yllcorner: grid.yllcorner + r0 * cs,
    cellsize: cs,
    ncols: newCols,
    nrows: newRows,
    data: newData,
  };
}

// --- Main ---
const inputDir = process.argv[2];
const outputPath = process.argv[3] || "public/data/london-elevation.json";
const bboxArg = process.argv[4];

if (!inputDir) {
  console.error("Usage: bun scripts/convert-os-terrain-50.ts <input-dir> [output-path] [bbox]");
  console.error("Example: bun scripts/convert-os-terrain-50.ts ~/Downloads/os-terrain-50/data public/data/london-elevation.json 51.45,-0.25,51.60,-0.05");
  process.exit(1);
}

console.log(`Scanning ${inputDir}...`);
const files = findAscFiles(inputDir);
console.log(`Found ${files.length} .asc files`);

if (files.length === 0) {
  console.error("No .asc files found. Make sure you've extracted the OS Terrain 50 zip.");
  process.exit(1);
}

console.log("Parsing...");
const parsed = files.map((f) => {
  process.stdout.write(".");
  return parseAsc(readFileSync(f, "utf-8"));
});
console.log();

console.log("Combining...");
let grid = combine(parsed);
console.log(`Combined grid: ${grid.ncols} x ${grid.nrows} cells (${grid.cellsize}m resolution)`);
console.log(`BNG bounds: E ${grid.xllcorner}-${grid.xllcorner + grid.ncols * grid.cellsize}, N ${grid.yllcorner}-${grid.yllcorner + grid.nrows * grid.cellsize}`);

if (bboxArg) {
  const [minLat, minLng, maxLat, maxLng] = bboxArg.split(",").map(Number);
  console.log(`Cropping to bbox lat ${minLat}-${maxLat}, lng ${minLng}-${maxLng}...`);
  grid = cropToBbox(grid, { minLat, minLng, maxLat, maxLng });
  console.log(`Cropped grid: ${grid.ncols} x ${grid.nrows} cells`);
}

// Output: store elevations as Int16 in decimeters (1 decimal precision is plenty for visual)
const elevations = new Array(grid.data.length);
for (let i = 0; i < grid.data.length; i++) {
  const v = grid.data[i];
  elevations[i] = v === -9999 ? -32768 : Math.round(v * 10);
}

const output = {
  source: "OS Terrain 50 (Ordnance Survey, OGL v3)",
  format: "bng-int16-dm", // British National Grid, Int16, decimeters
  xllcorner: grid.xllcorner,
  yllcorner: grid.yllcorner,
  cellsize: grid.cellsize,
  ncols: grid.ncols,
  nrows: grid.nrows,
  // Multiplier to convert stored value back to meters: divide by this
  scale: 10,
  noData: -32768,
  elevations,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(output));
const sizeKB = (JSON.stringify(output).length / 1024).toFixed(0);
console.log(`Wrote ${outputPath} (${sizeKB} KB)`);
console.log(`✓ Done. ${grid.ncols * grid.nrows} elevation cells.`);
