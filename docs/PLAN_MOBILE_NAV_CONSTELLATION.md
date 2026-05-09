# Plan — Navigation mobile "Constellation"

> Option B : un seul FAB doré pulsant en bas-droite. Au tap, les destinations s'épanouissent en arc de cercle comme une constellation. Pour mobile (< md breakpoint) uniquement. Le desktop conserve la navbar existante.

---

## 1. Comportement attendu

### État au repos
- **Un seul FAB** flottant à `bottom-right` (24px de la bordure, safe-area iOS compris).
- Diamètre 64px, fond gradient or ancestral → or chaud, halo doux pulsant en boucle (animation respiration).
- Icône **contextuelle** :
  - Page d'accueil / inconnue : `Compass` (étoile + boussole sacrée)
  - Forum (catégorie ou liste) : `Plus`
  - Thread forum : `Pen` (réponse rapide)
  - Chat : `Send` (rappel d'envoi de message — non, ambigu) → `MessageCirclePlus`
  - Savoir / article : `BookOpen`
  - Profil : `Settings`
  - École / Géographie : `Compass`
- **Badge non-lues** (notifications + chat) en bord supérieur-droit, rouge ou or, animé.

### Au tap
- Le bouton tourne légèrement (10°) et se transforme en croix `X` (icône + couleur or).
- Un **backdrop blur** apparaît derrière (`bg-foret-nocturne/70 backdrop-blur-md`) qui couvre tout l'écran.
- **6 satellites** émergent en arc de cercle (~120° autour du FAB) avec un stagger de 0.04s :
  1. **Accueil** — Home
  2. **Savoir** — BookOpen
  3. **Communauté** — Users (forum, membres, chat)
  4. **École** — GraduationCap
  5. **Notifications** — Bell (avec badge non-lues s'il y en a)
  6. **Profil / Compte** — User (avec sous-flèche vers Auth/Logout)
- Chaque satellite : 52px, fond `foret-nocturne/95` avec border `or-ancestral/30`, label en pill au-dessus de l'icône.
- **Action contextuelle** au-dessus de la croix centrale (à 90° vertical) : un satellite plus gros (60px) avec libellé direct (ex. "Nouveau sujet" sur la page forum, "Demander à contribuer" si non-contributeur sur /contributeur, etc.).

### Interactions de fermeture
- Tap sur le backdrop → ferme.
- Tap sur la croix → ferme.
- Échappement (Escape sur clavier) → ferme.
- Tap sur un satellite → ferme + navigue.
- Scroll → ferme (anti-piège quand on swipe accidentellement).
- Au démontage / changement de route → ferme automatiquement.

### Détails visuels
- Animation d'entrée : chaque satellite fait `scale: 0 → 1`, `opacity: 0 → 1`, et translation depuis le centre du FAB vers sa position d'arc, avec ease `[0.16, 1, 0.3, 1]`.
- **Particules d'or scintillantes** subtiles entre les satellites (1-2 sparkles animés) pour le côté constellation.
- **Trace lumineuse** : ligne or fine (1px, opacité 30%) qui relie le FAB à chaque satellite ouvert (crée la "carte du ciel").
- Halo sous le FAB ouvert : disque or `radial-gradient(rgba(181,149,81,0.4) → transparent)` blur 80px.

### Hide/Show (option discrète)
- Le FAB se cache pendant le scroll-down rapide (translation Y +120px, opacity 0) et réapparaît au scroll-up. Implémentation `useScrollDirection` hook léger. **Sauf** sur les pages où une action critique est attendue (forum, chat) → il reste toujours visible.

---

## 2. Architecture des fichiers

```
src/components/navbar/mobile/
  ├── ConstellationNav.tsx      # composant principal monté dans Navbar (mobile uniquement)
  ├── FabButton.tsx             # bouton flottant central (état repos / ouvert)
  ├── Satellite.tsx             # un nœud de l'arc avec label
  ├── ConstellationLayout.ts    # helper pour calculer positions x/y selon angle/rayon
  ├── useConstellationActions.ts # détermine les actions contextuelles selon pathname + role
  └── useScrollDirection.ts     # hide/show on scroll
```

- Mounted via le `<Navbar />` existant (qui rend déjà différemment selon mobile/desktop). On garde le hamburger pour le moment **désactivé sur mobile** mais on ne supprime pas le code immédiatement (on le retire dans un commit suivant après validation).

### Hook `useConstellationActions`
Retourne `{ primary, satellites }` :
- `primary` : l'action contextuelle clé pour la page courante (peut être null).
- `satellites` : array fixe de 6 destinations principales adaptées au rôle (ex. ajout "Modération" si role moderator/admin).

```ts
// pseudocode
function useConstellationActions(): {
  primary: { label, icon, href, onClick? } | null;
  satellites: Array<{ label, icon, href, badge?: number }>;
}
```

Logique :
- `pathname.startsWith("/forum/[cat]")` → primary = "Nouveau sujet"
- `pathname === "/savoir"` → primary = "Devenir contributeur" si pas approved, sinon "Écrire un article"
- `pathname.startsWith("/chat")` → primary = "Nouvelle conversation"
- `pathname.startsWith("/genealogie")` → primary = "Ajouter un membre"
- Default → null (pas de primary)

Satellites de base (toujours les mêmes pour la cohérence mentale) :
1. Accueil — `/`
2. Savoir — `/savoir`
3. Communauté — `/forum`
4. École — `/ecole`
5. Notifications — `/notifications` (avec badge `unreadCount`)
6. Profil — `/profil`

Pour les modérateurs / admins, on remplace "École" par "Modération" → `/admin/forum` (priorité aux outils utilisés au quotidien).

### Layout mathématique
Pour 6 satellites en arc autour d'un FAB en bas-droite :
- Centre : `(window.innerWidth - 24 - 32, window.innerHeight - 24 - 32 - safeAreaBottom)`
- Rayon : 130px sur petits écrans, 150px sur écrans plus grands.
- Arc : de 180° (gauche) à 270° (haut) — soit un quart de cercle qui ouvre vers le haut-gauche depuis le coin bas-droit.
- Chaque satellite à `angle_i = 180 + (i * 90 / (n-1))°`.
- Position : `x = cx + r * cos(angle)`, `y = cy + r * sin(angle)` (avec sin négatif car y croît vers le bas).

Sur très petit écran (height < 600), on rabat à un rayon de 110px. Pas de scroll dans la constellation — toujours dans la viewport.

### Z-index
- FAB : `z-[60]` (au-dessus du contenu mais sous les modales globales `z-[100]+`).
- Satellites : `z-[59]`.
- Backdrop : `z-[58]`.
- Notifications/ban modal continuent à dominer (`z-[160]+` côté ModerationGate / SubscriptionGrantGate).

---

## 3. Étapes d'exécution

1. **Créer les fichiers** dans `src/components/navbar/mobile/` (skeleton).
2. **`useScrollDirection`** — petit hook listening `window.scroll`, expose `direction: "up" | "down" | null` + `isScrolling`.
3. **`useConstellationActions`** — branche `usePathname`, `useAuth`, `useGlobalUnreadCount`, `useNotifications().unreadCount`.
4. **`Satellite`** — composant pur (props : `index`, `total`, `meta`, `open`, `onSelect`). Calcule sa position via `ConstellationLayout.position(index, total, ...)`.
5. **`FabButton`** — composant pur avec animation pulse en boucle (Framer Motion `animate` avec `repeat: Infinity`), icône morphée selon prop.
6. **`ConstellationNav`** — orchestrateur :
   - State `open: boolean`.
   - Effects : ferme à `pathname` change, à `Escape`, à scroll si ouvert.
   - Render conditionnel : `<div className="md:hidden">` (le composant n'apparaît qu'en mobile).
   - Backdrop AnimatePresence + satellites `map`.
   - Halo radial central animé.
7. **Branchement dans `Navbar.tsx`** :
   - Ajouter `<ConstellationNav />` à la fin du JSX (rendu mobile only).
   - **Désactiver** le menu burger mobile actuel (lignes ~310-470 dans `Navbar.tsx`) tout en gardant le code commenté pour rollback rapide. Préférer le supprimer entièrement dans un second commit après validation.
8. **Adapter les pages mobile** : retirer les paddings excessifs en bas qui étaient là pour compenser le burger.
9. **Tests manuels** :
   - Forum : tap FAB → "Nouveau sujet" en primary.
   - Genealogie : tap → "Ajouter un membre".
   - Notifications : badge bien synchronisé avec la cloche desktop.
   - Modération : moderator role voit "Modération" à la place de "École".
   - Anonyme : satellite "Profil" devient "Se connecter" (icône `LogIn`).

---

## 4. Risques et points d'attention

- **Safe area iOS** : utiliser `env(safe-area-inset-bottom)` pour positionner le FAB. CSS : `bottom: calc(24px + env(safe-area-inset-bottom))`.
- **Lecture/contemplation** : le FAB ne doit pas masquer du contenu critique. On laisse le scroll-down hide pour les longs articles.
- **Bouton physique dispo** : sur Android avec gesture nav, le bas est plus délicat. Le rayon de l'arc évite que les satellites tombent hors écran.
- **Realtime badges** : les compteurs (notifications, chat) doivent venir des hooks existants, pas refetch.
- **Accessibilité** : le FAB doit avoir `aria-label="Menu de navigation"`, `aria-expanded`, et chaque satellite son `aria-label`. Focus-trap quand ouvert.
- **Hydratation** : composant `"use client"` strict, garde `mounted` boolean avant de mesurer `window.innerWidth/innerHeight`.
- **Performances** : la pulsation utilise `transform: scale` (GPU), pas `width/height`. Les particules sont 1-2 max.
- **Préserver la cloche desktop** : `NotificationBell` reste dans la navbar desktop. La constellation embarque sa propre entrée notifications pour mobile.

---

## 5. Critères de réussite

- [ ] FAB visible et centré uniquement sur mobile (`< 768px`).
- [ ] Au repos : icône contextuelle correcte sur 5 routes différentes.
- [ ] Au tap : 6 satellites + (si applicable) 1 primary, animation fluide < 600ms total.
- [ ] Tap satellite navigue vers la bonne route et ferme.
- [ ] Tap backdrop / Escape / scroll ferme.
- [ ] Badge notifications synchronisé temps réel (insertion d'une notif par realtime → badge se met à jour sur le FAB et le satellite).
- [ ] Aucune régression desktop (`md+` reste avec la Navbar actuelle).
- [ ] Build prod ✅, typecheck ✅.

---

## 6. Plus tard (out of scope cette itération)

- Onboarding micro-tooltip "Glissez sur le FAB pour découvrir le sanctuaire" lors de la première visite (3s puis disparaît).
- Long press sur un satellite → menu d'actions secondaires.
- Personnalisation : permettre à l'utilisateur de choisir 6 destinations parmi 12 dans son profil.
- Haptic feedback iOS.

---

Plan validé → exécution dans l'ordre 1→9.
