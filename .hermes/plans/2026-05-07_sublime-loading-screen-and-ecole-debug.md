# Écran de Chargement Sublime + Audit Pages École — Plan d’implémentation

> **Pour Hermes :** utiliser ensuite `subagent-driven-development` ou une exécution directe contrôlée pour implémenter ce plan étape par étape.

**Goal:** Afficher immédiatement après chaque clic de navigation interne un écran de chargement immersif, beau, fluide et cohérent avec le design Sakata, puis révéler la page complètement chargée avec une transition douce. En parallèle, diagnostiquer proprement les problèmes restants des pages École et sous-pages.

**Architecture:** Le projet possède déjà `LoadingProvider`, `LoadingScreen` et `PageAnimate`. Le problème principal est que `LoadingProvider.startLoading()` n’est pas automatiquement appelé au moment du clic sur les liens Next.js. Le plan consiste à créer un système global de navigation feedback : interception sûre des clics internes + hook réutilisable + écran visuel amélioré + `loading.tsx` Next.js par segment critique. Les pages École seront auditées avec Playwright pour distinguer problèmes de routage, pages vides, erreurs JS, liens morts et lenteurs.

**Tech Stack:** Next.js 16.2.2 App Router, React client components, Framer Motion, Tailwind classes, Playwright, existing Sakata design tokens CSS.

---

## Contexte actuel observé

### Existant utile

- `src/app/layout.tsx`
  - Enveloppe l’application avec :
    - `LoadingProvider`
    - `Navbar`
    - `PageAnimate`
    - `Footer`
    - `WelcomeModal`

- `src/components/LoadingProvider.tsx`
  - Expose :
    - `isLoading`
    - `startLoading()`
    - `stopLoading()`
  - Stoppe le loader au changement de `pathname`.
  - A un timer minimum : `TIMINGS.LOADING_MIN_DISPLAY = 600ms`.
  - A un safety timeout : `TIMINGS.LOADING_SAFETY_TIMEOUT = 4000ms`.

- `src/components/LoadingScreen.tsx`
  - Existe déjà.
  - Affiche actuellement un overlay simple : fond forêt nocturne + logo SAKATA + trois points + ligne brume.

- `src/components/ui/PageAnimate.tsx`
  - Anime l’entrée/sortie de page via `AnimatePresence` et `usePathname()`.

### Problème racine probable

Le loader existe, mais il ne se déclenche pas systématiquement **au clic**. Le timing actuel dépend surtout du changement de route. Si la navigation prend plusieurs secondes avant que la nouvelle route soit prête, l’utilisateur peut rester sans feedback immédiat.

### Problèmes École mentionnés

L’utilisateur signale encore des problèmes sur `/ecole` et sous-pages. À ce stade, ne pas corriger au hasard : il faut reproduire avec Playwright et classer les problèmes :

- liens morts / mauvaises URL,
- pages 404 ou “introuvable”,
- pages qui chargent mais restent vides,
- erreurs console JS,
- lenteurs réseau,
- problèmes d’hydratation,
- overlays/modales qui interceptent les clics,
- composants lourds de math/visualisation qui ralentissent l’affichage.

---

# Phase A — Écran de chargement global immédiat

## Task 1 — Créer un composant de lien Sakata conscient du loader

**Objectif:** Disposer d’un wrapper `SakataLink` qui déclenche immédiatement `startLoading()` au clic sur un lien interne valide.

**Files:**

- Create: `src/components/navigation/SakataLink.tsx`
- Modify later: remplacer progressivement les liens critiques par `SakataLink`

**Comportement attendu:**

- Si le lien est interne (`href` commence par `/`) :
  - appeler `startLoading()` immédiatement au `onClick`.
  - laisser Next.js gérer la navigation.
- Ne pas déclencher si :
  - clic avec `metaKey`, `ctrlKey`, `shiftKey`, `altKey`,
  - bouton souris différent du clic gauche,
  - `target="_blank"`,
  - lien externe,
  - `href` identique au pathname courant,
  - `event.defaultPrevented`.

**Pseudo-code:**

```tsx
"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { useLoading } from "@/components/LoadingProvider";

type SakataLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export const SakataLink = forwardRef<HTMLAnchorElement, SakataLinkProps>(
  ({ href, onClick, target, ...props }, ref) => {
    const pathname = usePathname();
    const { startLoading } = useLoading();

    return (
      <Link
        ref={ref}
        href={href}
        target={target}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          if (target === "_blank") return;

          const hrefString = typeof href === "string" ? href : href.pathname || "";
          if (!hrefString.startsWith("/")) return;
          if (hrefString === pathname) return;
          if (hrefString.startsWith("#")) return;

          startLoading();
        }}
        {...props}
      />
    );
  }
);
SakataLink.displayName = "SakataLink";
```

**Vérification:**

- Cliquer `/langue`, `/ecole`, `/savoir`, `/forum`.
- Le loader doit apparaître instantanément, avant la transition page.

---

## Task 2 — Ajouter une interception globale des liens pour couvrir les liens non remplacés

**Objectif:** Ne pas devoir remplacer tous les `<Link>` du site d’un coup.

**Files:**

- Create: `src/components/navigation/NavigationLoadingBridge.tsx`
- Modify: `src/app/layout.tsx`

**Approche:**

Ajouter un composant client dans `LoadingProvider` ou juste sous celui-ci qui écoute les clics document-level sur les balises `<a>` internes.

**Règles:**

- Ignorer :
  - liens externes,
  - ancres `#`,
  - `download`,
  - `target="_blank"`,
  - touches meta/ctrl/shift/alt,
  - même URL.
- Déclencher `startLoading()` dès que l’utilisateur clique.
- Laisser `LoadingProvider` stopper au changement de pathname.

**Pourquoi les deux systèmes ?**

- `SakataLink` = propre pour nouveaux composants.
- `NavigationLoadingBridge` = couverture globale des liens existants, y compris `Navbar`, dropdowns, pages école, bento cards.

**Vérification:**

- Sans modifier tous les fichiers, cliquer sur :
  - logo/navbar,
  - dropdown “Savoir” → École,
  - cartes `/ecole/primaire`, `/ecole/secondaire`,
  - leçons `/langue/lecon/...`.
- Le loader doit apparaître à la frame du clic.

---

## Task 3 — Améliorer visuellement `LoadingScreen`

**Objectif:** Remplacer le loader simple par un écran “sublime” thème Sakata : brume, rivière, particules dorées, phrase culturelle, animation fluide.

**File:**

- Modify: `src/components/LoadingScreen.tsx`

**Design:**

- Fond : `var(--foret-nocturne)` + radial gradients or/ivoire.
- Brume animée : plusieurs blobs flous en `motion.div`.
- Ligne rivière : SVG sinusoïdal animé en stroke-dashoffset.
- Logo : `SAKATA` avec glow doré.
- Sous-titre : `La rivière prépare le savoir…` ou traduction via `t("loading.message")`.
- Micro-progress illusion : petite ligne dorée animée en boucle.
- Respect `prefers-reduced-motion` si possible.

**Structure visuelle proposée:**

```tsx
<AnimatePresence>
  {isLoading && (
    <motion.div className="fixed inset-0 z-[9999] ...">
      <motion.div className="absolute ... brume" />
      <svg>rivière animée</svg>
      <motion.div>SAKATA</motion.div>
      <motion.p>La rivière prépare le savoir…</motion.p>
      <motion.div>barre lumineuse</motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

**Critères qualité:**

- Apparition en < 100ms visuellement.
- Fade-in 180–250ms.
- Exit fade/scale 300–450ms.
- `z-index` supérieur à navbar, modales courantes, welcome modal si nécessaire.
- Pas de layout shift.
- Aucun scroll arrière-plan pendant loading si overlay actif.

---

## Task 4 — Ajuster les timings

**File:**

- Modify: `src/lib/constants/timings.ts`

**Proposition:**

```ts
LOADING_MIN_DISPLAY: 750,
LOADING_SAFETY_TIMEOUT: 8000,
LOADING_CLICK_DEBOUNCE: 150,
```

**Raison:**

- 600ms peut être trop bref pour percevoir une belle animation.
- 4000ms peut être trop court pour certaines pages lourdes école/math.
- Un debounce évite les doubles clics et flashs.

---

## Task 5 — Ajouter des `loading.tsx` Next.js sur segments critiques

**Objectif:** Même si la navigation est serveur/lente, Next.js peut afficher un fallback de segment.

**Files à créer:**

- `src/app/loading.tsx`
- `src/app/ecole/loading.tsx`
- `src/app/langue/loading.tsx`
- `src/app/savoir/loading.tsx`
- `src/app/forum/loading.tsx`

**Approche:**

Créer un composant réutilisable :

- Create: `src/components/SakataRouteLoading.tsx`

Puis dans chaque `loading.tsx` :

```tsx
import SakataRouteLoading from "@/components/SakataRouteLoading";

export default function Loading() {
  return <SakataRouteLoading variant="ecole" />;
}
```

**Variantes:**

- `default` : or/forêt Sakata.
- `ecole` : bleu/teal mais harmonisé avec forêt nocturne.
- `langue` : or/brume/rivière.

---

# Phase B — Transition douce page totalement chargée

## Task 6 — Synchroniser `LoadingProvider` avec `PageAnimate`

**Objectif:** Éviter que le loader disparaisse trop tôt, avant que la nouvelle page ait fait son entrée.

**Files:**

- Modify: `src/components/LoadingProvider.tsx`
- Modify: `src/components/ui/PageAnimate.tsx`

**Approche:**

Option simple :

- `LoadingProvider` garde le loader minimum 750ms.
- `PageAnimate` garde l’animation d’entrée.
- Au changement de pathname, `scheduleStop()` arrête après minimum display.

Option avancée :

- `PageAnimate` appelle `stopLoading()` dans `onAnimationComplete` de `motion.main`.
- Garder safety timeout pour éviter loader bloqué.

**Préférence:** commencer simple, puis passer à l’option avancée si des flashes persistent.

---

## Task 7 — Empêcher les flashes pendant navigation rapide

**Objectif:** Pas de clignotement désagréable sur pages déjà préfetchées.

**Approche:**

- Déclencher loader immédiatement.
- Si route change en < 150ms, garder loader jusqu’au minimum display.
- Si la navigation est externe/dure (`window.location.href`) laisser le browser prendre le relais.

**Vérification:**

- Cliquer entre `/`, `/langue`, `/savoir` plusieurs fois.
- Pas de flash blanc/noir.
- Pas de double overlay.

---

# Phase C — Audit et correction pages École

## Task 8 — Écrire un script Playwright d’audit École

**Objectif:** Reproduire les problèmes École au lieu de deviner.

**File:**

- Create: `scripts/playwright-ecole-audit.py`

**URLs à tester:**

- `/ecole`
- `/ecole/primaire`
- `/ecole/secondaire`
- `/ecole/primaire/primaire-1/cours`
- `/ecole/primaire/primaire-2/cours`
- `/ecole/primaire/primaire-3/cours`
- `/ecole/primaire/primaire-4/cours`
- `/ecole/primaire/primaire-5/cours`
- `/ecole/primaire/primaire-6/cours`
- `/ecole/secondaire/1ere-secondaire/cours`
- `/ecole/secondaire/1ere-secondaire/exercices`
- `/ecole/secondaire/2e-secondaire/cours`
- `/ecole/secondaire/2e-secondaire/exercices`
- `/ecole/secondaire/3e-secondaire/cours`
- `/ecole/secondaire/3e-secondaire/exercices`
- `/ecole/secondaire/4e-secondaire/cours`
- `/ecole/secondaire/4e-secondaire/exercices`
- `/ecole/secondaire/5e-secondaire/cours`
- `/ecole/secondaire/5e-secondaire/exercices`
- `/ecole/secondaire/6e-secondaire/cours`
- `/ecole/secondaire/6e-secondaire/exercices`

**Mesures:**

- HTTP status.
- H1/H2 présent.
- Texte “introuvable”, “not found”, “error”.
- Erreurs console.
- Exceptions JS.
- Temps `domcontentloaded`.
- Temps `networkidle`.
- Nombre de liens internes cassés.
- Screenshot en cas d’échec.

**Commande:**

```bash
LD_LIBRARY_PATH="$HOME/.local/lib:$LD_LIBRARY_PATH" python3 scripts/playwright-ecole-audit.py
```

---

## Task 9 — Auditer les liens depuis les pages École

**Objectif:** Identifier les clics qui mènent à des pages inexistantes.

**Approche Playwright:**

- Ouvrir `/ecole`.
- Collecter tous les `a[href^="/ecole"]`.
- Tester chaque `href`.
- Répéter sur `/ecole/primaire` et `/ecole/secondaire`.

**Sortie:**

- Liste des liens cassés.
- Source approximative si possible via texte du lien.

---

## Task 10 — Corriger les problèmes École selon diagnostic

**Important:** ne pas corriger avant diagnostic.

**Hypothèses à vérifier:**

1. Liens dans `CourseRiver` pointent vers des routes qui n’existent pas.
2. Certaines pages `exercices` existent mais composants non importés / placeholders vides.
3. Composants math lourds chargent lentement et donnent impression de freeze.
4. Images Unsplash externes ralentissent ou échouent.
5. Des overlays ou liens absolus interceptent les clics.

**Files probables:**

- `src/app/ecole/components/CourseRiver.tsx`
- `src/app/ecole/page.tsx`
- `src/app/ecole/primaire/page.tsx`
- `src/app/ecole/secondaire/page.tsx`
- `src/app/ecole/data/mathematics-curriculum.ts`
- `src/app/ecole/secondaire/*/cours/page.tsx`
- `src/app/ecole/secondaire/*/exercices/page.tsx`
- `src/app/ecole/primaire/*/cours/page.tsx`

---

# Phase D — Tests de validation

## Task 11 — Build local

```bash
cd ~/Projects/Sakata
npm run build
```

**Expected:** build OK, aucune erreur TypeScript.

---

## Task 12 — Playwright navigation globale

Créer ou adapter un script pour tester :

- clic navbar → `/ecole`, `/langue`, `/savoir` ;
- clic cartes école ;
- clic leçons langue ;
- vérifier que le loader apparaît dans les 100ms après clic ;
- vérifier qu’il disparaît après chargement ;
- vérifier que la page finale est correcte.

**Critères:**

- `LoadingScreen` visible après clic.
- Page finale visible.
- Pas de `LoadingProvider: Safety timeout reached` sauf vraie erreur.
- Pas d’erreur console.

---

## Task 13 — Test mobile

**Viewport:** 390×844.

Tester :

- menu mobile.
- liens “Espace École”, “Langue Kisakata”, “Articles”.
- loader au clic.
- absence de blocage par overlay menu.

---

# Phase E — Commit, push, Netlify

## Task 14 — Commit

```bash
git add src/components/LoadingProvider.tsx \
  src/components/LoadingScreen.tsx \
  src/components/navigation/SakataLink.tsx \
  src/components/navigation/NavigationLoadingBridge.tsx \
  src/components/SakataRouteLoading.tsx \
  src/app/loading.tsx \
  src/app/ecole/loading.tsx \
  src/app/langue/loading.tsx \
  src/app/savoir/loading.tsx \
  src/app/forum/loading.tsx \
  scripts/playwright-ecole-audit.py

git commit -m "feat: add instant Sakata navigation loading screen"
```

Si corrections École incluses dans le même cycle :

```bash
git commit -m "fix: repair school navigation and page loading issues"
```

Préférence : 2 commits séparés.

---

## Task 15 — Push + vérification Netlify

```bash
git push
```

Puis vérifier Netlify avec le token/site déjà documentés dans le skill `sakata-development` :

- dernier deploy `ready`,
- commit ref = commit pushé,
- pas d’erreur build.

---

# Risques / points d’attention

1. **Le loader global peut s’afficher sur les ancres `#section`** si l’interception est trop large. À éviter.
2. **Les liens avec `target="_blank"`** ne doivent pas déclencher l’overlay.
3. **Les pages très rapides** peuvent provoquer un flash si minimum display trop bas.
4. **Les pages École lourdes** peuvent dépasser le safety timeout actuel 4000ms ; il faudra probablement monter à 8000ms.
5. **Le WelcomeModal** peut intercepter les clics dans les tests Playwright. Les scripts doivent fermer la modale si elle apparaît.
6. **Le logo navbar actuel fait une navigation dure + clear cache**. Il ne doit probablement pas passer par le loader SPA, ou alors seulement afficher le loader avant `window.location.href = "/"`.
7. **Next.js 16.2.2 / Turbopack** : ne pas supposer des APIs obsolètes ; vérifier les docs locales si on touche aux conventions App Router avancées.

---

# Livrable final attendu

- Loader instantané, sublime, thème Sakata.
- Transition page fluide, sans trou visuel.
- Fallbacks `loading.tsx` pour routes lentes.
- Rapport Playwright École avec problèmes exacts.
- Corrections des liens/pages École identifiées.
- Build OK.
- Playwright OK.
- Push + Netlify ready.

