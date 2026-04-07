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
  | "topo-banded";

interface Route3DProps {
  latlng: number[][];
  altitude: number[];
  variant?: Route3DVariant;
  height?: number;
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

/** Build a terrain mesh from interpolated route altitudes */
function buildTerrainGeometry(
  routeXZ: { x: number; z: number }[],
  routeYRaw: number[],
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  gridSize: number,
  yScale: number,
  minAlt: number
): THREE.PlaneGeometry {
  const padX = (bounds.maxX - bounds.minX) * 0.4;
  const padZ = (bounds.maxZ - bounds.minZ) * 0.4;
  const x0 = bounds.minX - padX;
  const x1 = bounds.maxX + padX;
  const z0 = bounds.minZ - padZ;
  const z1 = bounds.maxZ + padZ;
  const w = x1 - x0;
  const h = z1 - z0;

  // Pack known points into typed arrays for fast IDW
  const knownX = new Float32Array(routeXZ.length);
  const knownZ = new Float32Array(routeXZ.length);
  const knownY = new Float32Array(routeXZ.length);
  for (let i = 0; i < routeXZ.length; i++) {
    knownX[i] = routeXZ[i].x;
    knownZ[i] = routeXZ[i].z;
    knownY[i] = (routeYRaw[i] - minAlt) * yScale;
  }

  const planeGeo = new THREE.PlaneGeometry(w, h, gridSize, gridSize);
  const positions = planeGeo.attributes.position;

  // Plane is in XY before rotation. Map UV to world XZ for IDW lookup.
  for (let i = 0; i < positions.count; i++) {
    const px = positions.getX(i); // -w/2 .. w/2
    const py = positions.getY(i); // -h/2 .. h/2
    const worldX = px + (x0 + x1) / 2;
    const worldZ = py + (z0 + z1) / 2;
    const elev = idwElevation(worldX, worldZ, knownX, knownZ, knownY);
    positions.setZ(i, elev);
  }
  planeGeo.computeVertexNormals();
  return planeGeo;
}

export default function Route3D({
  latlng,
  altitude,
  variant = "dark",
  height = 320,
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
    };
    const theme = themes[variant];
    const isTopo =
      variant === "topo-wireframe" ||
      variant === "topo-contour" ||
      variant === "topo-banded";

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

    if (isTopo) {
      const bounds = {
        minX: box.min.x,
        maxX: box.max.x,
        minZ: box.min.z,
        maxZ: box.max.z,
      };
      terrainGeo = buildTerrainGeometry(xz, altitude, bounds, 48, yScale, minAlt);

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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [latlng, altitude, variant, height]);

  return (
    <div className={`${styles.container} ${variant === "light" ? styles.containerLight : styles.containerDark}`}>
      <div ref={containerRef} className={styles.canvas} style={{ height }} />
      <span className={variant === "light" ? styles.label : styles.labelLight}>
        {variant === "topo-wireframe" && "A · Wireframe contour"}
        {variant === "topo-contour" && "B · Contour shader"}
        {variant === "topo-banded" && "C · Banded elevation"}
        {(variant === "dark" || variant === "light" || variant === "terrain") &&
          "Route · with elevation"}
      </span>
    </div>
  );
}
