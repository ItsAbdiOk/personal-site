"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Route3D.module.css";

export type Route3DVariant =
  | "dark"
  | "light"
  | "terrain"
  | "topo-wireframe"
  | "topo-contour"
  | "topo-banded"
  | "topo-real";

interface RealElevationGrid {
  elevations: number[];
  gridSize: number;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}

interface Route3DProps {
  latlng: number[][];
  altitude: number[];
  variant?: Route3DVariant;
  height?: number;
  realElevationGrid?: RealElevationGrid | null;
}

/** Convert lat/lng to local meters relative to centroid */
function latlngToMeters(latlng: number[][]): { x: number; z: number }[] {
  if (latlng.length === 0) return [];
  const cLat = latlng.reduce((s, p) => s + p[0], 0) / latlng.length;
  const cLng = latlng.reduce((s, p) => s + p[1], 0) / latlng.length;
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos((cLat * Math.PI) / 180);
  return latlng.map(([lat, lng]) => ({
    x: (lng - cLng) * mPerDegLng,
    z: -(lat - cLat) * mPerDegLat, // Negative so north is -Z
  }));
}

/**
 * Inverse Distance Weighted interpolation.
 * Estimates elevation at (gx, gz) from known (x, y, z) points.
 * Power=2 is standard. Returns the closest known altitude if exact match.
 */
function idwElevation(
  gx: number,
  gz: number,
  knownX: Float32Array,
  knownZ: Float32Array,
  knownY: Float32Array,
  power = 2
): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i < knownX.length; i++) {
    const dx = gx - knownX[i];
    const dz = gz - knownZ[i];
    const distSq = dx * dx + dz * dz;
    if (distSq < 0.01) return knownY[i]; // exact hit
    const weight = 1 / Math.pow(distSq, power / 2);
    num += weight * knownY[i];
    den += weight;
  }
  return den > 0 ? num / den : 0;
}

interface ElevationGrid {
  data: Float32Array; // (gridSize+1)^2 values
  size: number; // number of cells per side
  x0: number;
  z0: number;
  cellW: number; // width of one cell in world units
  cellH: number; // depth of one cell in world units
  minElev: number;
  maxElev: number;
}

/**
 * Build an ElevationGrid from a real lat/lng-bounded elevation array
 * (e.g. sampled from OS Terrain 50). Coordinates are converted to local
 * meters relative to the route's centroid.
 */
function buildElevationGridFromReal(
  real: RealElevationGrid,
  routeCentroidLat: number,
  routeCentroidLng: number,
  yScale: number,
  minAltOffset: number
): ElevationGrid {
  const { elevations, gridSize, bounds } = real;
  // gridSize here is number of vertices per side. ElevationGrid.size is cells (vertices - 1).
  const cellsPerSide = gridSize - 1;

  // Convert lat/lng bounds to local meters
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos((routeCentroidLat * Math.PI) / 180);

  const x0 = (bounds.minLng - routeCentroidLng) * mPerDegLng;
  const x1 = (bounds.maxLng - routeCentroidLng) * mPerDegLng;
  // North is -Z, so the maxLat row maps to minZ
  const z0 = -(bounds.maxLat - routeCentroidLat) * mPerDegLat;
  const z1 = -(bounds.minLat - routeCentroidLat) * mPerDegLat;

  const cellW = (x1 - x0) / cellsPerSide;
  const cellH = (z1 - z0) / cellsPerSide;

  // Source array has row 0 at minLat (south). We want row 0 at minZ (north),
  // so flip rows when copying.
  const data = new Float32Array(gridSize * gridSize);
  let minE = Infinity;
  let maxE = -Infinity;
  for (let r = 0; r < gridSize; r++) {
    const srcRow = gridSize - 1 - r;
    for (let c = 0; c < gridSize; c++) {
      const srcVal = elevations[srcRow * gridSize + c];
      const scaled = (srcVal - minAltOffset) * yScale;
      data[r * gridSize + c] = scaled;
      if (scaled < minE) minE = scaled;
      if (scaled > maxE) maxE = scaled;
    }
  }

  return {
    data,
    size: cellsPerSide,
    x0,
    z0,
    cellW,
    cellH,
    minElev: minE,
    maxElev: maxE,
  };
}

/** Build a 2D elevation grid via IDW from the route stream */
function buildElevationGrid(
  routeXZ: { x: number; z: number }[],
  routeYRaw: number[],
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  size: number,
  yScale: number,
  minAlt: number
): ElevationGrid {
  const padX = (bounds.maxX - bounds.minX) * 0.4;
  const padZ = (bounds.maxZ - bounds.minZ) * 0.4;
  const x0 = bounds.minX - padX;
  const x1 = bounds.maxX + padX;
  const z0 = bounds.minZ - padZ;
  const z1 = bounds.maxZ + padZ;
  const w = x1 - x0;
  const h = z1 - z0;

  const knownX = new Float32Array(routeXZ.length);
  const knownZ = new Float32Array(routeXZ.length);
  const knownY = new Float32Array(routeXZ.length);
  for (let i = 0; i < routeXZ.length; i++) {
    knownX[i] = routeXZ[i].x;
    knownZ[i] = routeXZ[i].z;
    knownY[i] = (routeYRaw[i] - minAlt) * yScale;
  }

  const cellW = w / size;
  const cellH = h / size;
  const data = new Float32Array((size + 1) * (size + 1));
  let minE = Infinity;
  let maxE = -Infinity;
  for (let j = 0; j <= size; j++) {
    for (let i = 0; i <= size; i++) {
      const wx = x0 + i * cellW;
      const wz = z0 + j * cellH;
      const e = idwElevation(wx, wz, knownX, knownZ, knownY);
      data[j * (size + 1) + i] = e;
      if (e < minE) minE = e;
      if (e > maxE) maxE = e;
    }
  }

  return { data, size, x0, z0, cellW, cellH, minElev: minE, maxElev: maxE };
}

/** Build a terrain mesh from an existing elevation grid */
function buildTerrainGeometryFromGrid(grid: ElevationGrid): THREE.PlaneGeometry {
  const w = grid.size * grid.cellW;
  const h = grid.size * grid.cellH;
  const planeGeo = new THREE.PlaneGeometry(w, h, grid.size, grid.size);
  const positions = planeGeo.attributes.position;
  const cx = grid.x0 + w / 2;
  const cz = grid.z0 + h / 2;

  for (let i = 0; i < positions.count; i++) {
    const px = positions.getX(i);
    const py = positions.getY(i);
    const worldX = px + cx;
    const worldZ = py + cz;
    const gi = Math.round((worldX - grid.x0) / grid.cellW);
    const gj = Math.round((worldZ - grid.z0) / grid.cellH);
    const idx = gj * (grid.size + 1) + gi;
    positions.setZ(i, grid.data[idx] || 0);
  }
  planeGeo.computeVertexNormals();
  return planeGeo;
}

/**
 * Marching squares: extract contour line segments at a given elevation level.
 * Returns an array of line segment endpoints in world space (x,z pairs).
 */
function marchingSquares(grid: ElevationGrid, level: number): number[] {
  const { data, size, x0, z0, cellW, cellH } = grid;
  const segments: number[] = [];
  const w = size + 1;

  // For each cell defined by 4 corners (a=tl, b=tr, c=br, d=bl)
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const a = data[j * w + i];
      const b = data[j * w + (i + 1)];
      const c = data[(j + 1) * w + (i + 1)];
      const d = data[(j + 1) * w + i];

      const ax = x0 + i * cellW;
      const ay = z0 + j * cellH;
      const bx = x0 + (i + 1) * cellW;
      const by = ay;
      const cx = bx;
      const cy = z0 + (j + 1) * cellH;
      const dx = ax;
      const dy = cy;

      // Linear interpolation for edge crossing
      const lerp = (
        e1x: number,
        e1y: number,
        e1v: number,
        e2x: number,
        e2y: number,
        e2v: number
      ) => {
        if (Math.abs(e2v - e1v) < 1e-6) return [(e1x + e2x) / 2, (e1y + e2y) / 2];
        const t = (level - e1v) / (e2v - e1v);
        return [e1x + t * (e2x - e1x), e1y + t * (e2y - e1y)];
      };

      let code = 0;
      if (a >= level) code |= 1;
      if (b >= level) code |= 2;
      if (c >= level) code |= 4;
      if (d >= level) code |= 8;

      if (code === 0 || code === 15) continue;

      // Edge intersections
      const top = () => lerp(ax, ay, a, bx, by, b);
      const right = () => lerp(bx, by, b, cx, cy, c);
      const bottom = () => lerp(dx, dy, d, cx, cy, c);
      const left = () => lerp(ax, ay, a, dx, dy, d);

      let segs: number[][][] = [];
      switch (code) {
        case 1:
        case 14:
          segs = [[left(), top()]];
          break;
        case 2:
        case 13:
          segs = [[top(), right()]];
          break;
        case 3:
        case 12:
          segs = [[left(), right()]];
          break;
        case 4:
        case 11:
          segs = [[right(), bottom()]];
          break;
        case 5:
          segs = [
            [left(), top()],
            [right(), bottom()],
          ];
          break;
        case 6:
        case 9:
          segs = [[top(), bottom()]];
          break;
        case 7:
        case 8:
          segs = [[left(), bottom()]];
          break;
        case 10:
          segs = [
            [left(), bottom()],
            [right(), top()],
          ];
          break;
      }

      for (const s of segs) {
        segments.push(s[0][0], s[0][1], s[1][0], s[1][1]);
      }
    }
  }

  return segments;
}

export default function Route3D({
  latlng,
  altitude,
  variant = "dark",
  height = 320,
  realElevationGrid,
}: Route3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || latlng.length < 2 || altitude.length !== latlng.length) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Theme variants ---
    const themes = {
      dark: {
        bg: 0x0d0d0c,
        routeColor: 0xfafaf8,
        routeEmissive: 0xfafaf8,
        ambientIntensity: 0.4,
        hemiSky: 0x444440,
        hemiGround: 0x0d0d0c,
        terrainColor: 0x1a1a18,
      },
      light: {
        bg: 0xfafaf8,
        routeColor: 0x1a1a18,
        routeEmissive: 0x000000,
        ambientIntensity: 0.7,
        hemiSky: 0xffffff,
        hemiGround: 0xe8e8e4,
        terrainColor: 0xf2f2ee,
      },
      terrain: {
        bg: 0x0d0d0c,
        routeColor: 0xfafaf8,
        routeEmissive: 0xfafaf8,
        ambientIntensity: 0.3,
        hemiSky: 0x554448,
        hemiGround: 0x0d0d0c,
        terrainColor: 0x2a2a26,
      },
      "topo-wireframe": {
        bg: 0x0d0d0c,
        routeColor: 0xfafaf8,
        routeEmissive: 0xfafaf8,
        ambientIntensity: 0.5,
        hemiSky: 0x555550,
        hemiGround: 0x0d0d0c,
        terrainColor: 0x1a1a18,
      },
      "topo-contour": {
        bg: 0x0d0d0c,
        routeColor: 0xfafaf8,
        routeEmissive: 0xfafaf8,
        ambientIntensity: 0.4,
        hemiSky: 0x555550,
        hemiGround: 0x0d0d0c,
        terrainColor: 0x1a1a18,
      },
      "topo-banded": {
        bg: 0x0d0d0c,
        routeColor: 0xfafaf8,
        routeEmissive: 0xfafaf8,
        ambientIntensity: 0.4,
        hemiSky: 0x555550,
        hemiGround: 0x0d0d0c,
        terrainColor: 0x1a1a18,
      },
      "topo-real": {
        // Light theme like a real USGS topo map
        bg: 0xfafaf8,
        routeColor: 0x1a1a18,
        routeEmissive: 0x000000,
        ambientIntensity: 0.9,
        hemiSky: 0xffffff,
        hemiGround: 0xe8e8e4,
        terrainColor: 0xfafaf8,
      },
    };
    const theme = themes[variant];
    const isTopo =
      variant === "topo-wireframe" ||
      variant === "topo-contour" ||
      variant === "topo-banded" ||
      variant === "topo-real";

    const width = container.clientWidth;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.bg);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // --- Project route to local coordinates ---
    const xz = latlngToMeters(latlng);
    const minAlt = Math.min(...altitude);
    const elevationGain = Math.max(...altitude) - minAlt;
    // Vertical exaggeration so flat runs still look interesting
    const yScale = elevationGain > 5 ? 3 : 8;

    const points = xz.map((p, i) => new THREE.Vector3(p.x, (altitude[i] - minAlt) * yScale, p.z));

    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);

    // Compute bounds for camera framing
    const box = new THREE.Box3().setFromPoints(points);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.z);
    const cameraDistance = maxDim * 1.4;

    // --- Route tube ---
    const tubeRadius = Math.max(maxDim * 0.004, 1.5);
    const tubeGeometry = new THREE.TubeGeometry(curve, 400, tubeRadius, 8, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: theme.routeColor,
      emissive: theme.routeEmissive,
      emissiveIntensity: variant === "light" ? 0 : 0.6,
      roughness: 0.4,
      metalness: 0.1,
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    // --- Start and end markers ---
    const markerGeo = new THREE.SphereGeometry(tubeRadius * 2.5, 16, 16);
    const startMarker = new THREE.Mesh(
      markerGeo,
      new THREE.MeshStandardMaterial({
        color: theme.routeColor,
        emissive: theme.routeEmissive,
        emissiveIntensity: variant === "light" ? 0 : 0.4,
      })
    );
    startMarker.position.copy(points[0]);
    scene.add(startMarker);

    const endMarker = new THREE.Mesh(
      markerGeo.clone(),
      new THREE.MeshStandardMaterial({
        color: theme.routeColor,
        emissive: theme.routeEmissive,
        emissiveIntensity: variant === "light" ? 0 : 0.8,
      })
    );
    endMarker.position.copy(points[points.length - 1]);
    scene.add(endMarker);

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0xffffff, theme.ambientIntensity);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, 0.6);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(maxDim * 0.5, maxDim * 1.2, maxDim * 0.3);
    scene.add(dirLight);

    // --- Topographic terrain (interpolated from Strava stream via IDW) ---
    let terrainGeo: THREE.PlaneGeometry | null = null;
    let terrainMat: THREE.Material | null = null;
    let wireMat: THREE.LineBasicMaterial | null = null;
    let wireSegments: THREE.LineSegments | null = null;
    const contourGeometries: THREE.BufferGeometry[] = [];
    const contourMaterials: THREE.Material[] = [];

    if (isTopo) {
      const bounds = {
        minX: box.min.x,
        maxX: box.max.x,
        minZ: box.min.z,
        maxZ: box.max.z,
      };

      // Prefer real elevation grid (OS Terrain 50) over IDW interpolation
      let grid: ElevationGrid;
      if (realElevationGrid && realElevationGrid.elevations.length > 0) {
        // Centroid of route in lat/lng for the local-meters projection
        const cLat = latlng.reduce((s, p) => s + p[0], 0) / latlng.length;
        const cLng = latlng.reduce((s, p) => s + p[1], 0) / latlng.length;
        grid = buildElevationGridFromReal(
          realElevationGrid,
          cLat,
          cLng,
          yScale,
          minAlt
        );
      } else {
        const gridResolution = variant === "topo-real" ? 96 : 48;
        grid = buildElevationGrid(xz, altitude, bounds, gridResolution, yScale, minAlt);
      }
      terrainGeo = buildTerrainGeometryFromGrid(grid);

      // The plane is initially in XY. We'll rotate it -90deg X so its
      // local Z (which we used for elevation) becomes world Y. Position
      // y=-1 to give the route a tiny gap above the terrain.

      if (variant === "topo-wireframe") {
        // Solid mesh + wireframe overlay = the contour effect
        terrainMat = new THREE.MeshStandardMaterial({
          color: theme.terrainColor,
          roughness: 0.95,
          metalness: 0,
          flatShading: true,
          side: THREE.DoubleSide,
        });
        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.rotation.x = -Math.PI / 2;
        terrainMesh.position.y = -1;
        scene.add(terrainMesh);

        const wireGeo = new THREE.WireframeGeometry(terrainGeo);
        wireMat = new THREE.LineBasicMaterial({
          color: 0x444440,
          transparent: true,
          opacity: 0.5,
        });
        wireSegments = new THREE.LineSegments(wireGeo, wireMat);
        wireSegments.rotation.x = -Math.PI / 2;
        wireSegments.position.y = -0.95;
        scene.add(wireSegments);
      } else if (variant === "topo-contour") {
        // Custom shader: draw contour lines at fixed elevation intervals.
        // Use ~25 contour bands across the elevation range so lines are visible
        // even on flat runs. Use fract distance to integers (0 at contour, 0.5 between).
        const elevRange = box.max.y - box.min.y;
        const contourSpacing = Math.max(elevRange / 25, 0.3);
        terrainMat = new THREE.ShaderMaterial({
          uniforms: {
            uContourSpacing: { value: contourSpacing },
            uBaseColor: { value: new THREE.Color(0x1a1a18) },
            uLineColor: { value: new THREE.Color(0xc8c8c0) },
          },
          vertexShader: `
            varying float vElevation;
            void main() {
              vElevation = position.z;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uContourSpacing;
            uniform vec3 uBaseColor;
            uniform vec3 uLineColor;
            varying float vElevation;

            void main() {
              float scaled = vElevation / uContourSpacing;
              float f = fract(scaled);
              // Distance to nearest integer: 0 at contour line, 0.5 between
              float dist = min(f, 1.0 - f);
              // Hybrid: fwidth-based with minimum width so lines are always visible
              float lineWidth = max(fwidth(scaled) * 1.5, 0.04);
              float line = smoothstep(0.0, lineWidth, dist);
              vec3 color = mix(uLineColor, uBaseColor, line);
              gl_FragColor = vec4(color, 1.0);
            }
          `,
          side: THREE.DoubleSide,
          extensions: { derivatives: true } as never,
        });
        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.rotation.x = -Math.PI / 2;
        terrainMesh.position.y = -1;
        scene.add(terrainMesh);
      } else if (variant === "topo-banded") {
        // Vertex colors banded by elevation, warm grays.
        // Use percentile bands so banding is visible even with small ranges.
        const positions = terrainGeo.attributes.position;
        const allElevs: number[] = [];
        for (let i = 0; i < positions.count; i++) {
          allElevs.push(positions.getZ(i));
        }
        const sorted = [...allElevs].sort((a, b) => a - b);
        const palette = [
          [0.08, 0.08, 0.072],
          [0.18, 0.18, 0.165],
          [0.30, 0.30, 0.275],
          [0.45, 0.45, 0.42],
          [0.62, 0.62, 0.58],
          [0.82, 0.82, 0.78],
        ];
        // Build band thresholds by percentile so bands are roughly equal area
        const thresholds: number[] = [];
        for (let i = 1; i < palette.length; i++) {
          const idx = Math.floor((sorted.length * i) / palette.length);
          thresholds.push(sorted[idx]);
        }
        const colors = new Float32Array(positions.count * 3);
        for (let i = 0; i < positions.count; i++) {
          const elev = allElevs[i];
          let bandIdx = 0;
          for (let t = 0; t < thresholds.length; t++) {
            if (elev > thresholds[t]) bandIdx = t + 1;
          }
          const c = palette[bandIdx];
          colors[i * 3] = c[0];
          colors[i * 3 + 1] = c[1];
          colors[i * 3 + 2] = c[2];
        }
        terrainGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        terrainMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.85,
          metalness: 0,
          flatShading: true,
          side: THREE.DoubleSide,
        });
        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.rotation.x = -Math.PI / 2;
        terrainMesh.position.y = -1;
        scene.add(terrainMesh);
      } else if (variant === "topo-real") {
        // REAL topographic map: marching squares contour lines on a light background.
        // 1. Subtle terrain shading underneath (very light)
        // 2. ~30 contour lines extracted via marching squares
        // 3. Glowing dark route on top
        terrainMat = new THREE.MeshStandardMaterial({
          color: 0xf2f2ee,
          roughness: 0.95,
          metalness: 0,
          flatShading: false,
          side: THREE.DoubleSide,
        });
        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.rotation.x = -Math.PI / 2;
        terrainMesh.position.y = -1;
        scene.add(terrainMesh);

        // Marching squares contour extraction
        const elevRange = grid.maxElev - grid.minElev;
        const contourCount = 28;
        const contourStep = elevRange / contourCount;
        // Center of the grid in world space
        const gridCenterX = grid.x0 + (grid.size * grid.cellW) / 2;
        const gridCenterZ = grid.z0 + (grid.size * grid.cellH) / 2;

        for (let n = 1; n < contourCount; n++) {
          const level = grid.minElev + n * contourStep;
          const segments = marchingSquares(grid, level);
          if (segments.length === 0) continue;

          // Convert (x, z) pairs to (x, level, z) Vector3 positions
          // Position relative to grid center (since terrain mesh is at world origin
          // before we offset it)
          const positions = new Float32Array((segments.length / 2) * 3);
          for (let s = 0; s < segments.length / 2; s++) {
            positions[s * 3] = segments[s * 2] - gridCenterX;
            positions[s * 3 + 1] = level;
            positions[s * 3 + 2] = segments[s * 2 + 1] - gridCenterZ;
          }

          const contourGeo = new THREE.BufferGeometry();
          contourGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
          contourGeometries.push(contourGeo);

          // Color contours by elevation: lower = light brown, higher = dark brown
          const t = n / contourCount;
          const r = 0.45 + t * 0.15;
          const g = 0.32 + t * 0.10;
          const b = 0.22 + t * 0.05;
          // Every 5th contour is bolder (index contour like real maps)
          const isIndex = n % 5 === 0;
          const contourMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(r, g, b),
            transparent: true,
            opacity: isIndex ? 0.95 : 0.55,
            linewidth: 1, // Note: most browsers ignore this, lines are always 1px
          });
          contourMaterials.push(contourMat);

          const contourLines = new THREE.LineSegments(contourGeo, contourMat);
          contourLines.position.y = -0.5; // Slightly above terrain
          scene.add(contourLines);
        }
      }
    }

    // --- Subtle grid for the plain dark variant only ---
    if (variant === "dark") {
      const gridSize = maxDim * 2;
      const grid = new THREE.GridHelper(gridSize, 16, 0x222220, 0x1a1a18);
      grid.position.x = center.x;
      grid.position.z = center.z;
      grid.position.y = -2;
      scene.add(grid);
    }

    // --- Camera orbit ---
    let frameId = 0;
    let time = reduceMotion ? Math.PI * 0.25 : 0;

    function animate() {
      time += 0.0025;
      const orbitX = center.x + Math.sin(time) * cameraDistance;
      const orbitZ = center.z + Math.cos(time) * cameraDistance;
      const orbitY = center.y + cameraDistance * 0.55;
      camera.position.set(orbitX, orbitY, orbitZ);
      camera.lookAt(center.x, center.y, center.z);
      renderer.render(scene, camera);
      if (!reduceMotion) {
        frameId = requestAnimationFrame(animate);
      }
    }

    animate();

    // --- Resize handling ---
    function handleResize() {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      tubeGeometry.dispose();
      tubeMaterial.dispose();
      markerGeo.dispose();
      terrainGeo?.dispose();
      terrainMat?.dispose();
      wireMat?.dispose();
      wireSegments?.geometry.dispose();
      contourGeometries.forEach((g) => g.dispose());
      contourMaterials.forEach((m) => m.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [latlng, altitude, variant, height]);

  return (
    <div
      className={`${styles.container} ${
        variant === "light" || variant === "topo-real"
          ? styles.containerLight
          : styles.containerDark
      }`}
    >
      <div ref={containerRef} className={styles.canvas} style={{ height }} />
      <span
        className={
          variant === "light" || variant === "topo-real"
            ? styles.label
            : styles.labelLight
        }
      >
        {variant === "topo-wireframe" && "A · Wireframe contour"}
        {variant === "topo-contour" && "B · Contour shader"}
        {variant === "topo-banded" && "C · Banded elevation"}
        {variant === "topo-real" && "D · Topographic map"}
        {(variant === "dark" || variant === "light" || variant === "terrain") &&
          "Route · with elevation"}
      </span>
    </div>
  );
}
