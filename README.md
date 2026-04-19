# personal-site

Next.js 14 personal portfolio and blog for Abdirahman Mohamed — MSc AI
student at Queen Mary University of London, specialising in speech and
language processing.

Live at **[abdirahmanmohamed.dev](https://www.abdirahmanmohamed.dev)**.

## What's here

- **Home** (`/`) — hero, project grid, writing list, current "Now" block
- **Writing** (`/writing`, `/writing/[slug]`) — MDX blog posts with reading progress bar
- **Now** (`/now`) — what I'm working on right now
- **Life** (`/life`) — live data from AniList (manga), Pocket Casts (podcasts),
  and Strava (running), with a 3D topographic map of the latest run

## Design system

The visual direction, typography, colour palette, spacing, and motion are
documented in [`DESIGN.md`](./DESIGN.md). Read it before making any UI change.
TL;DR: editorial warm minimalism, DM Serif Display + DM Sans on a warm off-white
background, no accent colour, contour-map aesthetic.

## The Life page 3D map

This is the distinctive bit. `/life` pulls the latest run from Strava and
renders it in 3D with real London topography:

- **Terrain mesh** — sampled from [OS Terrain 50](https://osdatahub.os.uk/downloads/open/Terrain50)
  (Ordnance Survey, 50m grid, Open Government License v3)
- **Contour lines** — extracted via a marching-squares pass over the elevation grid
- **3D buildings** — 36,882 OSM building footprints extruded with real heights
- **Map-matched route** — the GPS trace is snapped to OSM streets via the
  free public [Valhalla](https://valhalla.openstreetmap.de/) routing engine,
  so it doesn't clip through buildings

One-time data prep is documented in [`scripts/README-elevation.md`](./scripts/README-elevation.md).

## Tech

- Next.js 14 (app router)
- React 18, TypeScript
- MDX via `next-mdx-remote`
- Three.js for the 3D map, lazy-loaded only on `/life`
- `proj4` for British National Grid ↔ WGS84 conversion
- `next/og` for the dynamic OpenGraph image
- Deployed on Vercel

## Dev

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
bun run lint     # next lint
```

No test framework yet — it's a personal portfolio site. Opted out
via `.gstack/no-test-bootstrap`.

## Environment variables

All live data needs credentials set in `.env.local` (dev) and in Vercel
Environment Variables (production). These should be set for **Production,
Preview, and Development** environments.

| Variable | Purpose |
|----------|---------|
| `STRAVA_CLIENT_ID` | Strava API — running data on `/life` |
| `STRAVA_CLIENT_SECRET` | Strava API |
| `STRAVA_REFRESH_TOKEN` | Strava OAuth refresh token |
| `POCKETCASTS_EMAIL` | Pocket Casts login — podcast history on `/life` |
| `POCKETCASTS_PASSWORD` | Pocket Casts login |

Missing credentials cause graceful fallbacks (the section shows "temporarily
unavailable" instead of breaking).

## Project layout

```
app/
  page.tsx                   Home
  layout.tsx                 Root layout + metadata + JSON-LD
  opengraph-image.tsx        Dynamic 1200×630 OG image
  api/
    anilist/route.ts         Manga (GraphQL)
    podcasts/route.ts        Pocket Casts history
    strava/route.ts          Activities + streams + real terrain grid
  life/page.tsx              Live dashboard (manga, podcasts, runs)
  writing/[slug]/page.tsx    Blog post (MDX + BlogPosting JSON-LD)
  now/, reading/, cv/        Other pages
  sitemap.ts, robots.ts

components/
  Route3D.tsx                three.js scene — terrain + buildings + route
  RouteMap.tsx               SVG fallback when streams unavailable
  RunStats.tsx, MangaCard.tsx, PodcastCard.tsx
  Nav.tsx, Footer.tsx, ReadingProgress.tsx, ScrollReveal.tsx

lib/
  elevation.ts               OS Terrain 50 lookup with bilinear interp
  map-match.ts               Valhalla map-matching client + cache
  posts.ts                   MDX post loader

scripts/
  convert-os-terrain-50.ts   Build step: .asc → london-elevation.json
  fetch-london-buildings.ts  Build step: OSM Overpass → london-buildings.json
  README-elevation.md        How to regenerate elevation data

public/data/
  london-elevation.json      OS Terrain 50 grid (central London, ~360 KB)
  london-buildings.json      OSM buildings (central London, ~3.3 MB)

posts/                       MDX blog posts
styles/globals.css           CSS variables + animations + reduced-motion
```

## Attribution

- Terrain: © Crown copyright and database rights, Ordnance Survey
  (OS Terrain 50, OGL v3)
- Buildings and street network: © OpenStreetMap contributors (ODbL)
- Map-matching: Valhalla routing engine via `valhalla.openstreetmap.de`

## License

The site code is MIT-licensed. Blog post content and personal photography
remain copyright Abdirahman Mohamed, all rights reserved.
