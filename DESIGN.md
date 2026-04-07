# Design System — Abdirahman Mohamed

## Product Context
- **What this is:** Personal portfolio and blog for an AI engineer and MSc AI student
- **Who it's for:** Recruiters, fellow builders, potential collaborators, the ML/AI community
- **Space/industry:** Personal developer portfolio, ML/AI
- **Project type:** Marketing site / editorial blog

## Aesthetic Direction
- **Direction:** Editorial/Magazine, warm minimalism
- **Decoration level:** Minimal (typography and whitespace do all the work)
- **Mood:** "Apple meets Notion." Cold precision with editorial warmth. The work speaks for itself. Quiet competence, not performative technical flex.
- **Key risks (deliberate departures from category norms):**
  - No accent color. Hierarchy comes entirely from typography weight and size.
  - Serif headlines in a field of sans-serif developer sites. Says "I think about craft, not just code."

## Typography
- **Display/Hero:** DM Serif Display (400, italic for emphasis words like "language")
- **Body:** DM Sans (400 for body, 500 for UI labels and nav)
- **UI/Labels:** DM Sans 500, uppercase, letter-spacing 0.06-0.12em
- **Data/Tables:** DM Sans (supports tabular-nums)
- **Code:** SF Mono, Fira Code, Fira Mono, Menlo, monospace
- **Loading:** Google Fonts via Next.js `next/font/google` (automatic optimization)
- **Scale:**
  - Hero: 2.75rem (44px) / mobile: 2.125rem (34px)
  - H2: 1.5rem (24px) / mobile: 1.75rem (28px)
  - H3: 1.25rem (20px) / mobile: 0.875rem (14px)
  - Body: 1rem (16px) — never below 16px, including mobile
  - Bio/Description: 0.9375rem (15px)
  - UI Label: 0.6875rem (11px), uppercase
  - Caption: 0.75rem (12px)
  - Tag/Pill: 0.6875rem (11px)
- **Line heights:** Hero 1.15, Headings 1.2, Body 1.7, Prose 1.75

## Color
- **Approach:** Restrained. Warm grays only, no accent color.
- **Palette:**
  - `--bg: #FAFAF8` — page background (warm off-white)
  - `--bg-muted: #F2F2EE` — card hover, code blocks, tag backgrounds
  - `--text-primary: #1A1A18` — headings, nav name, active states
  - `--text-secondary: #555550` — body text, prose paragraphs
  - `--text-tertiary: #6E6E68` — descriptions, blockquotes, italic emphasis (WCAG AA: 4.59:1)
  - `--text-muted: #767672` — nav links, section labels, dates, footer (WCAG AA: 4.54:1)
  - `--text-faint: #BBBBBB` — decorative dots only (not for readable text)
  - `--border: #E8E8E4` — dividers, card grid gaps, form borders
- **Dark mode strategy (not yet implemented):**
  - Surfaces use elevation (lighter = closer), not just lightness inversion
  - Text off-white (#E8E8E4), not pure white
  - Reduce any future accent saturation by 10-20%
  - `color-scheme: dark` on html element

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 2(2px) 4(4px) 8(8px) 12(12px) 16(16px) 20(20px) 24(24px) 32(32px) 48(48px) 64(64px) 80(80px)
- **Section padding:** 48-80px vertical (desktop), 36-48px (mobile)
- **Page padding:** 32px (desktop), 24px (mobile)

## Layout
- **Approach:** Grid-disciplined, single-column
- **Grid:** Single column, 720px max-width, centered
- **Max content width:** 720px (`--max-width`)
- **Border radius:** 0-4px (minimal, intentional: 3px for pills/tags, 4px for code blocks and images)
- **Breakpoint:** 768px (single breakpoint, mobile-first)
- **Safe-area:** `env(safe-area-inset-*)` on `.page-container` for notch devices

## Motion
- **Approach:** Minimal-functional
- **Easing:** `0.15s ease` for all hover transitions (`--transition`)
- **Properties animated:** Color only. Never layout properties.
- **Mobile nav:** `max-height 0.2s ease, opacity 0.15s ease` for dropdown
- **No entrance animations, no scroll effects, no page transitions.**

## Interaction States
- **Hover:** Color transitions on links (muted -> primary), background on cards (bg -> bg-muted)
- **Active nav:** `color: var(--text-primary)` (same as hover, distinguished by context)
- **Focus:** Needs `:focus-visible` ring (not yet implemented, high priority)
- **Mobile nav:** Hamburger with animated dropdown, 44px min touch targets

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Initial design system created | Formalized from /design-review audit. Existing system was coherent but undocumented. |
| 2026-04-03 | Darkened --text-muted to #767672 | WCAG AA compliance. Was #AAAAAA (2.25:1), now 4.54:1. |
| 2026-04-03 | Darkened --text-tertiary to #6E6E68 | WCAG AA compliance. Was #888880 (3.49:1), now 4.59:1. |
| 2026-04-03 | No accent color (deliberate) | Forces hierarchy through typography weight/size. More elegant, harder to execute. |
| 2026-04-03 | Serif headlines (DM Serif Display) | Differentiator in a sans-serif developer portfolio space. Adds editorial warmth. |
| 2026-04-03 | 16px minimum body text (including mobile) | Was dropping to 15px on mobile. 16px is the floor for readability. |
