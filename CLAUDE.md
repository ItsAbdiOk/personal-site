# Personal Site

Next.js 14 personal portfolio and blog for Abdirahman Mohamed — MSc AI
student at Queen Mary University of London. Deployed to Vercel at
**www.abdirahmanmohamed.dev**.

See [README.md](./README.md) for the full overview.

## Stack

- Next.js 14 (app router), React 18, TypeScript
- Bun for install + dev (no Node required locally)
- MDX via `next-mdx-remote` for blog posts
- Three.js (lazy-loaded, only on `/life`) for the 3D topographic map
- `proj4` for British National Grid ↔ WGS84 conversion
- `next/og` for the dynamic OpenGraph image

## Commands

```bash
bun install
bun run dev          # localhost:3000
bun run build        # production build
bun run lint         # next lint
```

No test framework set up (opted out via `.gstack/no-test-bootstrap`).

## Project structure

```
app/
  layout.tsx               Root metadata + Person/WebSite JSON-LD
  page.tsx                 Home
  opengraph-image.tsx      Dynamic 1200×630 OG image via next/og
  api/{anilist,podcasts,strava}/route.ts
  life/page.tsx            Live dashboard
  writing/[slug]/page.tsx  Blog post (MDX + BlogPosting JSON-LD)
  now/, reading/, cv/
components/
  Route3D.tsx              three.js terrain + buildings + route
  RouteMap.tsx             SVG fallback
  RunStats.tsx, MangaCard, PodcastCard
  Nav.tsx, Footer.tsx, ReadingProgress.tsx, ScrollReveal.tsx
lib/
  elevation.ts             OS Terrain 50 lookup (bilinear interp)
  map-match.ts             Valhalla client + per-activity cache
  posts.ts                 MDX post loader
scripts/
  convert-os-terrain-50.ts OS Terrain .asc → JSON grid
  fetch-london-buildings.ts Overpass API → buildings JSON
public/data/
  london-elevation.json    ~360 KB — regenerate with convert-os-terrain-50.ts
  london-buildings.json    ~3.3 MB — regenerate with fetch-london-buildings.ts
posts/                     MDX blog posts
styles/globals.css         CSS variables, animations, prefers-reduced-motion
```

## Environment variables

Required for the `/life` page data. Set in `.env.local` locally and in
Vercel (all environments: Production, Preview, Development).

- `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`
- `POCKETCASTS_EMAIL`, `POCKETCASTS_PASSWORD`

Missing credentials → graceful fallback to "temporarily unavailable" on
the affected section.

## Deploy

Push to `main` on GitHub. Vercel auto-deploys production.

Feature branches auto-get preview URLs:
`https://personal-site-git-{branch}-itsabdioks-projects.vercel.app`

Strava env vars need to be set for the Preview environment too, or the
preview will show the fallback instead of the 3D map.

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
