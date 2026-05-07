# Transition de chargement Brume — Implementation Plan

> **For Hermes:** Implémenter directement dans Sakata, sans dépendance supplémentaire, en respectant le design system "Brume de la Rivière".

**Goal:** Afficher immédiatement une page de chargement immersive et fluide dès qu'un utilisateur clique sur un lien interne, puis laisser la nouvelle page se révéler doucement lorsque la navigation est terminée.

**Architecture:** Le projet possède déjà `LoadingProvider` et `LoadingScreen`, mais le chargement n'est pas déclenché automatiquement par les clics sur les liens. La solution consiste à transformer ce système existant en transition globale de navigation : interception des clics internes, affichage immédiat de l'overlay, arrêt automatique au changement de `pathname`, et animation de sortie qui dissipe la brume.

**Tech Stack:** Next.js 16 App Router, React client components, `next/navigation`, Framer Motion, Tailwind CSS, CSS keyframes dans `globals.css`.

---

## Pourquoi cette solution

Le problème observé vient du fait que certaines pages du site sont lourdes : lorsque l'utilisateur clique sur un lien interne, le navigateur/Next.js peut mettre plusieurs secondes à préparer la nouvelle route. Pendant ce temps, l'écran ne change pas visuellement, ce qui donne l'impression que le clic n'a pas marché.

Next.js propose des fichiers `loading.tsx`, mais ils ne couvrent pas toujours le besoin UX exact ici :

- ils dépendent des boundaries React/Suspense ;
- ils peuvent apparaître trop tard sur certaines navigations ;
- ils ne donnent pas forcément un feedback instantané au moment du clic ;
- ils ne permettent pas facilement une animation globale cohérente avec l'identité du site.

Le site possède déjà un `LoadingProvider`, donc la meilleure approche est de l'utiliser comme couche globale :

1. Au clic sur un lien interne, `LoadingProvider` démarre tout de suite l'overlay.
2. Quand `usePathname()` change, cela signifie que la nouvelle route est montée : on programme la disparition fluide.
3. L'overlay sort avec une animation de brume qui monte et se dissipe, ce qui donne l'impression que la page se découvre.
4. Un timeout de sécurité évite qu'un overlay reste bloqué en cas de navigation annulée.
5. Les liens externes, ancres, téléchargements, nouveaux onglets et clics modifiés (`Ctrl`, `Cmd`, `Shift`) sont ignorés pour ne pas casser le comportement natif.

Cette solution est DRY : elle centralise toute l'expérience dans `LoadingProvider` + `LoadingScreen`, sans modifier chaque lien du site.

---

## Comportement attendu

### Au clic sur un lien interne

- L'overlay couvre l'écran immédiatement.
- Le fond devient une forêt nocturne profonde.
- Des nappes de brume animées se déplacent lentement.
- Un halo doré pulse autour de "SAKATA".
- Une ligne de rivière lumineuse traverse l'écran.
- Un texte rassure l'utilisateur : "La brume s'ouvre..." / "Transmission des savoirs...".

### Quand la nouvelle page est prête

- L'overlay reste au minimum quelques centaines de millisecondes pour éviter un flash trop brutal.
- La brume se lève vers le haut.
- L'opacité descend progressivement.
- La page chargée apparaît derrière l'overlay, comme révélée par la dissipation de la brume.

### Accessibilité

- `aria-live="polite"` et `role="status"` indiquent qu'une navigation est en cours.
- `prefers-reduced-motion: reduce` désactive les animations longues de brume.
- Les clics externes et nouveaux onglets restent natifs.

---

## Fichiers concernés

### Modifier

- `src/components/LoadingProvider.tsx`
  - ajouter une interception globale des clics sur liens internes ;
  - ignorer les liens externes, ancres, téléchargements, nouveaux onglets et clics modifiés ;
  - éviter de relancer le loader sur la route courante ;
  - garder les timers existants.

- `src/components/LoadingScreen.tsx`
  - remplacer l'écran minimal actuel par une scène brumeuse immersive ;
  - ajouter animation d'entrée, animation continue et animation de sortie ;
  - garder `useLanguage()` pour le message localisé existant.

- `src/app/globals.css`
  - ajouter les keyframes de brume : dérive horizontale, respiration, scintillement, rivière, sortie ;
  - ajouter le mode reduced-motion.

### Créer

- `docs/plans/2026-05-07-transition-brume-chargement.md`
  - le présent plan détaillé.

---

## Plan d'exécution

### Tâche 1 — Documenter le plan

**Objectif:** Sauvegarder cette décision UX/technique dans un fichier `.md` durable.

**Fichier:**
- Create: `docs/plans/2026-05-07-transition-brume-chargement.md`

**Vérification:**
- Le fichier existe.
- Il explique le problème, la solution et les raisons du choix.

---

### Tâche 2 — Déclencher le loader dès les clics internes

**Objectif:** Ne plus attendre que Next.js commence visiblement à changer de page ; afficher le feedback dès l'intention utilisateur.

**Fichier:**
- Modify: `src/components/LoadingProvider.tsx`

**Étapes:**
1. Ajouter `useSearchParams` pour détecter aussi les changements de query string.
2. Ajouter un `useEffect` qui écoute `document.addEventListener("click", ...)`.
3. Trouver le lien via `event.target.closest("a")`.
4. Ignorer :
   - clic déjà empêché ;
   - clic non gauche ;
   - `metaKey`, `ctrlKey`, `shiftKey`, `altKey` ;
   - `target="_blank"` ;
   - `download` ;
   - URL externe ;
   - hash seul sur la même page ;
   - même pathname + même search.
5. Appeler `startLoading()`.
6. Garder `scheduleStop()` au changement de route.

**Pourquoi:** Cette tâche résout précisément le temps mort après le clic.

---

### Tâche 3 — Créer la scène de chargement brumeuse

**Objectif:** Transformer l'overlay actuel en expérience premium cohérente avec Sakata.

**Fichier:**
- Modify: `src/components/LoadingScreen.tsx`

**Étapes:**
1. Garder `AnimatePresence`.
2. Utiliser un overlay `fixed inset-0 z-[9998]` sous la WelcomeModal (`z-[9999]`) mais au-dessus du site.
3. Ajouter plusieurs couches visuelles :
   - fond radial forêt/eau sombre ;
   - grain discret ;
   - nappes de brume floues ;
   - halos dorés ;
   - ligne de rivière animée ;
   - titre SAKATA ;
   - points de chargement.
4. Ajouter une animation de sortie `clipPath` + opacité pour révéler la page.
5. Ajouter `role="status"`, `aria-live="polite"`.

**Pourquoi:** Un loader n'est pas seulement fonctionnel ; il transforme un délai subi en moment narratif.

---

### Tâche 4 — Ajouter les keyframes CSS

**Objectif:** Garder les animations fluides et performantes, sans surcharger React.

**Fichier:**
- Modify: `src/app/globals.css`

**Étapes:**
1. Ajouter `@keyframes sakataMistDrift`.
2. Ajouter `@keyframes sakataMistBreathe`.
3. Ajouter `@keyframes sakataRiverShimmer`.
4. Ajouter `@keyframes sakataGoldPulse`.
5. Ajouter classes utilitaires `.sakata-mist-*`.
6. Ajouter `@media (prefers-reduced-motion: reduce)`.

**Pourquoi:** Les animations CSS sur `transform` et `opacity` sont plus fluides et moins coûteuses que des updates JS.

---

### Tâche 5 — Vérifier localement

**Commandes:**

```bash
cd ~/Projects/Sakata
npm run build
```

Puis, si un serveur dev est disponible :

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/langue
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/savoir
```

**Critères d'acceptation:**

- `npm run build` passe sans erreur TypeScript.
- La navigation interne affiche immédiatement l'overlay.
- L'overlay disparaît après changement de route.
- Les liens externes et nouveaux onglets ne sont pas interceptés.
- Aucun warning React critique.

---

## Notes de design

La direction artistique doit rester Sakata :

- couleurs : `--foret-nocturne`, `--eau-sombre`, `--brume-matinale`, `--or-ancestral`, `--ivoire-ancien` ;
- ambiance : brume matinale sur rivière, forêt profonde, transmission du savoir ;
- motion : lente, organique, fluide ;
- éviter les spinners génériques trop modernes ;
- privilégier une sensation rituelle/patrimoniale.

---

## Risques et protections

### Risque : loader bloqué

Protection : `LOADING_SAFETY_TIMEOUT` force l'arrêt.

### Risque : interception trop agressive

Protection : ignorer externes, hash-only, downloads, target blank, clics modifiés.

### Risque : animation trop lourde

Protection : utiliser CSS `transform`, `opacity`, `will-change`, peu de layers, pas de canvas.

### Risque : conflit avec WelcomeModal

Protection : overlay en `z-[9998]`, WelcomeModal reste au-dessus si elle est affichée.

---

## Résultat attendu final

Une navigation Sakata plus premium : au lieu d'un silence visuel après le clic, l'utilisateur voit immédiatement la brume se former, le savoir circuler, puis la nouvelle page se dévoiler doucement lorsque le chargement est terminé.
