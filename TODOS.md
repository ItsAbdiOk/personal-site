# TODOs

## Future enhancements

### 3D Strava map: topographic terrain
The current Route3D component uses variant="dark" — a glowing route tube
on a near-black background with a subtle grid floor. Future iteration:

- Add a low-poly terrain mesh under the route using real elevation data
- Source elevation grid from Open-Elevation API (free, no key) or
  Mapbox Terrain RGB tiles
- Style as a topographic contour map: thin contour lines on the terrain,
  colored by elevation bands (warm grays only, no rainbow gradient)
- Light pass should use the existing run's altitude range to set band thresholds
- Keep the route tube glowing on top so it remains the focal point
- Variant `terrain` already scaffolded in Route3D.tsx — replace the
  procedural noise mesh with real elevation data

Reference: components/Route3D.tsx (variant="terrain")
