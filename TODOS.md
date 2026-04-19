# TODOs

## Completed

### 3D Strava map: topographic terrain — shipped

Done across the `topo-terrain-comparison` branch, merged to main.
Went further than originally planned:

- Real elevation from OS Terrain 50 (50m grid, OGL v3) instead of IDW
  interpolation from the Strava stream
- Bilinear interpolation in `lib/elevation.ts` for smooth upsampling
- Marching-squares contour extraction at 28 elevation levels, with
  index contours (every 5th) rendered bolder
- 36,882 OSM 3D buildings extruded from real footprints + heights
- Valhalla map-matching so the route follows real streets instead of
  the noisy GPS trace clipping through buildings
- 5km × 5km minimum sample area so even tiny walks show real London
  topography (Thames valley, hill slopes)

Reference commits: `d3f0656`, `e783e5a`, `302b117`, `583e574`.

## Future enhancements

### Map-match cache persistence on Vercel
The Valhalla cache at `.map-match-cache/` works locally but Vercel's
serverless filesystem is read-only except `/tmp`, which is per-invocation.
Every cold start re-calls Valhalla. Options:

- Move the cache to `/tmp` (works across warm invocations only)
- Use Vercel KV (persistent, free tier)
- Pre-compute matches at build time and ship as static JSON

Ref: `lib/map-match.ts`.

### Apex domain redirect
`abdirahmanmohamed.dev` (no www) doesn't resolve — only the www subdomain
does. Anyone typing the bare domain into a browser hits a failed request.
Set an ANAME/ALIAS on the apex pointing to Vercel, or redirect via Vercel's
domain settings.

### Add focus-visible ring styling
Flagged in the design review. Keyboard users see the default browser
outline, which doesn't match the warm minimal aesthetic. Add a custom
`:focus-visible` style in `styles/globals.css`.

### Strava section: OSM context layer
The current Route3D shows terrain + buildings + route. Could add:

- River Thames as a stylised blue ribbon (OSM `natural=water` polygons)
- Parks as light green overlays (OSM `leisure=park`)
- Major roads as thin lines (OSM `highway=primary|secondary`)

Would add a few hundred KB of JSON but give the scene more London character.

### Analytics
No analytics yet. Options:

- Vercel Analytics (free tier, privacy-friendly, already integrated)
- Plausible self-hosted
- Nothing (current state — simplest, most private)

### Photography / visual work page
The `/life` page shows data. A visual page (photos from runs, places lived,
things built physically) would round out the portfolio.
