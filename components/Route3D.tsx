"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Route3D.module.css";

export type Route3DVariant = "dark" | "light" | "terrain";

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
    };
    const theme = themes[variant];

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

    // --- Terrain (variant=terrain only) ---
    if (variant === "terrain") {
      // Generate a low-poly plane that follows route bounds
      const padding = maxDim * 0.3;
      const planeSize = maxDim + padding * 2;
      const segments = 32;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);

      // Bend the plane gently using the route's altitude as inspiration (sin waves)
      const positions = planeGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const noise =
          Math.sin(x * 0.02) * 4 +
          Math.cos(y * 0.025) * 3 +
          Math.sin((x + y) * 0.015) * 2;
        positions.setZ(i, noise);
      }
      planeGeo.computeVertexNormals();

      const planeMat = new THREE.MeshStandardMaterial({
        color: theme.terrainColor,
        roughness: 0.95,
        metalness: 0,
        flatShading: true,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -2;
      plane.position.x = center.x;
      plane.position.z = center.z;
      scene.add(plane);
    }

    // --- Subtle grid for dark/terrain variants ---
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [latlng, altitude, variant, height]);

  return (
    <div className={`${styles.container} ${variant === "light" ? styles.containerLight : styles.containerDark}`}>
      <div ref={containerRef} className={styles.canvas} style={{ height }} />
      <span className={variant === "light" ? styles.label : styles.labelLight}>
        Route &middot; with elevation
      </span>
    </div>
  );
}
