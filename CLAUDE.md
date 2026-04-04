@AGENTS.md

# Kisakata.com — Project Intelligence

## Stack
- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Design:** Tailwind CSS v3 + Vanilla CSS custom properties
- **Animations:** GSAP (ScrollTrigger) + Framer Motion
- **Backend:** Supabase (project ID: `slbnjjgparojkvxbsdzn`)
- **Fonts:** Outfit (Display) + Geist Mono (Technical)

## Critical Rules
- **Event handlers** CANNOT be passed to Server Components.
- **Hydration Mismatch:** Avoid `Math.random()` or `Date` in render paths.
- **Tailwind:** `@tailwind` directives must be at the top of `globals.css`.

## Design System: V1 "Brume de la Rivière"
- **Palette:** `--foret-nocturne` (#050C09), `--or-ancestral` (#B59551), `--ivoire-ancien` (#F2EEDD)
- **Atmosphere:** Mystérieuse, contemplative, riche en contrastes et textures.
- **UI:** Glassmorphism forestier (`#0A1F15` avec flou), bordures ancestrales.

## Auth & Roles (RBAC)
- **Roles:** `admin`, `manager`, `contributor`, `user`.
- **Protected Routes:** `/admin/**` géré par `AdminLayout` et `AuthProvider`.
- **Identity:** Intégration Supabase Auth + Profils personnalisés.

## Internationalization (i18n)
- **5 Langues:** Français (fr), Kisakata (skt), Lingala (lin), Swahili (swa), Tshiluba (tsh).
- **Selector:** `LanguageSwitcher` intégré à la `Navbar`.
- **Content:** Données dynamiques Supabase avec champs `JSONB` multivalues.

## Structure
```
src/
  app/
    admin/          — Gestion contenu & utilisateurs
    auth/           — Login immersif
    savoir/         — Flux de connaissances dynamique
  components/
    Navbar.tsx      — Navigation intelligente (Auth & i18n)
    AuthProvider.tsx — Pipeline sécurité
  lib/
    translate.ts    — Service de traduction automatique
```

## Active Skills
- `sage-basakata` — Voix narrative ancestrale.
- `design-taste-frontend` — Enforcements esthétiques premium.
- `documentaliste-culturel` — Rigueur documentaire.
