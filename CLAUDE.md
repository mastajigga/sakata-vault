@AGENTS.md

# Kisakata.com — Project Intelligence

## Stack
- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Design:** Tailwind CSS v3 + Vanilla CSS custom properties
- **Animations:** GSAP (ScrollTrigger) + Framer Motion
- **Backend:** Supabase (project ID: `slbnjjgparojkvxbsdzn`)
- **Fonts:** Outfit (via next/font/google)

## Critical Rules (Learned from bugs)

### Next.js 16 Server/Client Component Boundary
- **Event handlers** (`onClick`, `onMouseEnter`, `onMouseLeave`) CANNOT be passed to Server Components.
- If a section needs interactivity, extract it into a separate `"use client"` component file.
- `page.tsx` files are Server Components by default — never put event handlers directly in them.

### Hydration Mismatch Prevention
- **NEVER use `Math.random()`** in JSX render output of client components. The server-rendered HTML will have different random values than the client, causing a hydration mismatch.
- Use **deterministic/pre-computed arrays** for any data that varies (particle positions, delays, sizes).
- Same applies to `Date.now()`, `new Date()`, or any non-deterministic value in the render path.

### Tailwind CSS Setup (Required)
- Tailwind v3 is installed with PostCSS and autoprefixer.
- `tailwind.config.js` content paths: `./src/app/**/*.{js,ts,jsx,tsx,mdx}` and `./src/components/**/*.{js,ts,jsx,tsx,mdx}`.
- `globals.css` MUST have `@tailwind base; @tailwind components; @tailwind utilities;` at the top, BEFORE any custom CSS.
- VS Code may show `Unknown at rule @tailwind` warnings — these are harmless (PostCSS handles them at build time).

## Design System: V2 "Canopee Digitale"
- **Palette:** `--canopy-black` (#070E08), `--emerald-deep` (#2D6A4F), `--amber-light` (#E9C46A), `--ivory-warm` (#F4F1EB)
- **Glass:** `--glass-bg` = rgba(7,14,8,0.7) with blur(20px); only on fixed/sticky elements
- **Anti-patterns:** No cursor:none, no Inter font, no pure #000, no 3-column equal grids, no emojis, no "Scroll to explore"

## Directory Structure
```
src/
  app/
    globals.css         — Design system tokens + Tailwind directives
    layout.tsx          — Root layout with Outfit font
    page.tsx            — Home page (Server Component)
  components/
    Hero.tsx            — Video hero with GSAP parallax
    Navbar.tsx          — Transparent-to-glass nav
    Mission.tsx         — Cultural mission section
    SectionCard.tsx     — Double-bezel knowledge cards
    CommunityCallout.tsx — Interactive community CTA
  lib/
    (supabase client)
public/
  videos/               — MP4 files for hero/sections
  images/               — Static images
media/                  — Source video files (not served)
```

## Active Skills (in .agents/skills/)
- `design-taste-frontend` — Premium UI rules (variance 8, motion 6, density 4)
- `high-end-visual-design` — $150k agency-level design enforcement
- `stitch-design-taste` — DESIGN.md generation for Google Stitch
- `sage-basakata` — Narrative voice of a village elder
- `documentaliste-culturel` — Ethnographic documentation standards
- `seo-geo-expert` — SEO/GEO for Mai-Ndombe + diaspora
- `minimalist-ui`, `industrial-brutalist-ui`, `redesign-existing-projects` — Alternative design modes
- `full-output-enforcement` — Anti-truncation rules
