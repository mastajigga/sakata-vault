# Kisakata.com — Project Intelligence & Guidelines

## 1. Stack & Architecture
- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Authentification & DB:** Supabase (project ID: `slbnjjgparojkvxbsdzn`) — **IMPORTANT:** Toujours utiliser `@supabase/ssr` (`createBrowserClient` / `createServerClient`) au lieu de `@supabase/supabase-js` en direct pour éviter la désynchronisation des sessions entre LocalStorage et Cookies.
- **Design:** Tailwind CSS v3 + CSS Variables personnalisées (Design System V1 "Brume de la Rivière").
- **Animations:** GSAP (ScrollTrigger via `useGSAP`) + Framer Motion.
- **Polices:** Outfit (H1/Titres) + Geist Mono (Interface/Détails).
- **Analytics:** Command Center V2 inclut désormais la capture d'IP (via trigger Postgres `tr_capture_ip`) et l'analyse géographique.

## 2. Rôles et Monétisation (Paywall)
- **Roles utilisateurs:** `admin`, `manager`, `contributor`, `user`.
- **Niveaux d'abonnement (Paywall):** `free`, `premium`.
- **Gating de contenu:** La route `savoir/[slug]` utilise un composant "Paywall" avec un rendu "glassmorphism" qui bloque la lecture des articles nécessitant le niveau `premium`. Tous les statuts d'abonnement sont synchronisés via `AuthProvider`.

## 3. Structure du Projet (App Router)
```text
src/
  app/
    admin/          # Espace sécurisé (Command Center) pour gestion membres & contenus.
    auth/           # Tunnel d'authentification immersif (Supabase).
    savoir/         # Encyclopédie dynamique (Textes/Images intégrés). Articles premium inclus.
    forum/          # "Mboka" (Le Village) : Forum en temps réel avec catégories et RLS.
      [category_slug]/new   # Éditeur de sujets enrichis (Markdown personnalisé).
      thread/[thread_slug]  # Chat temps réel pour discussions communautaires.
    profil/         # Hub personnel pour gérer son statut (Premium/Classic) et ses détails.
  components/
    Navbar.tsx      # Navigation intelligente avec gestion conditionnelle (Profil vs Admin).
    AuthProvider.tsx # Fournisseur global des informations Supabase (Client-side, SSR sync).
  lib/
    supabase/admin.ts # Client de contournement RLS (Service Key). **Note:** Utiliser avec parcimonie sur Netlify (préférer `supabasePublic` pour le forum public).
```

## 4. Règles Critiques (Next.js & Infrastructure)
- **Supabase Joins:** La table `profiles` ne contient pas de colonne `display_name`. Utiliser uniquement `username` et `nickname`.
- **Rendu Forum:** Toujours vérifier que les jointures sur `profiles` utilisent la syntaxe standard Supabase pour éviter les erreurs de mapping sur Netlify.
- **Hydratation & Loading:** `LoadingProvider` gère les transitions de page. Ne pas introduire de délais artificiels (le timeout de sécurité est de 4s).
- **Hydratation:** La structure HTML doit toujours être stricte. Ne pas insérer de valeurs aléatoires (ex: `Date.now()`) lors du rendu serveur sans protection `useEffect`.
- **Composants Client vs Serveur:** `use client` est nécessaire au sommet des fichiers qui intègrent de l'interactivité (GSAP, Etat local, Formulaires).
- **Styles:** Ne jamais surcharger les polices globales avec des utilitaires Tailwind sans raison. Garder les variables `--foret-nocturne`, `--or-ancestral`, et `--ivoire-ancien` comme base canonique.

## 5. Skills et Outils Actifs
- `sage-basakata` — Maintenir la voix narrative ancestrale dans la formulation.
- `design-taste-frontend` / `stitch-design-taste` — Strict respect de l'esthétique premium (espacements, motion-design, bordures 1px).
- `documentaliste-culturel` — Rigueur lors du remplissage sémantique des bases de données.
