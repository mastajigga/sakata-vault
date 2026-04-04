# Design System: Kisakata.com — V1 "Brume de la Rivière"

## 1. Visual Theme & Atmosphere

Une interface mystérieuse et contemplative, comme une aube brumeuse sur la rivière Lukenie. L'espace visuel est dominé par des verts profonds et des voiles translucides évoquant la brume matinale sur l'eau. La densité est faible — chaque élément respire, chaque section est un tableau. Le mouvement est lent, fluide, comme le courant d'une rivière paresseuse. L'utilisateur est transporté dans un voyage sensoriel, pas dans une interface utilitaire.

- **Density:** 3/10 — Art Gallery Airy. Luxe d'espace. Grands plans vides intentionnels.
- **Variance:** 7/10 — Asymétrie contrôlée. Split-screen naturels, blancs massifs à gauche, contenu dense à droite.
- **Motion:** 7/10 — Fluidité organique. Transitions longues (800ms+), easing cubique doux, parallaxe lente.

## 2. Color Palette & Roles

- **Forêt Nocturne** (#0A1F15) — Fond principal. Noir verdâtre profond évoquant la canopée de nuit.
- **Eau Sombre** (#0C2920) — Fond secondaire pour les sections alternées.
- **Brume Matinale** (#D4DDD7) — Texte secondaire, voiles translucides, overlays légers.
- **Ivoire Ancien** (#F0EDE5) — Texte principal. Pas de blanc pur — la chaleur de l'ivoire ancien.
- **Or Ancestral** (#C4A035) — Accent unique. Utilisé exclusivement pour les CTA, liens actifs, et accents typographiques. Saturation 72%.
- **Verre Forestier** (rgba(10, 31, 21, 0.6)) — Surfaces glassmorphism (navbar, cartes).
- **Bordure de Brume** (rgba(212, 221, 215, 0.08)) — Lignes structurelles, 1px.

**BANNI :** Vert néon, violet/bleu IA, noir pur (#000000), dégradés saturés.

## 3. Typography Rules

- **Display:** `Outfit` — Tracking serré (-0.03em), poids 700-800. Hiérarchie par taille ET opacité, pas par couleur.
- **Body:** `Satoshi` — Leading 1.7, max-width 62ch. Couleur Ivoire Ancien à 75% opacité.
- **Mono:** `JetBrains Mono` — Pour les dates, statistiques, et références de sources.
- **Kisakata Text:** `Satoshi Italic` — Les mots en Kisakata sont toujours en italique, couleur Or Ancestral.

**BANNI :** Inter, polices serif génériques, tailles de titre > 6rem sur mobile.

## 4. Hero Section: "L'Entrée dans la Brume"

- Vidéo `iluo into the eyes.mp4` en plein écran, brightness(0.35)
- **Masque radial** : Un dégradé radial du centre vers les bords fusionne la vidéo dans le fond #0A1F15
  ```css
  mask-image: radial-gradient(ellipse 70% 70% at center, black 30%, transparent 80%);
  ```
- Titre centré, sobre, poids 700 (pas 900). Taille `clamp(2.5rem, 5vw, 4rem)` — élégant, pas criard.
- Sous-titre en Ivoire Ancien à 60% opacité, max 50ch.
- Un seul CTA : bouton Ghost avec bordure Or Ancestral.
- Pas de flèche de scroll, pas de "Découvrir", pas de chevron animé.

## 5. Component Stylings

- **Buttons:** Flat, bordure Or Ancestral 1px. Remplissage au hover (fond Or, texte #0A1F15). Transition 400ms ease-out. `active: translateY(-1px)`.
- **Cards:** `border-radius: 1.5rem`. Fond Verre Forestier avec `backdrop-filter: blur(16px)`. Bordure de Brume 1px. Ombre diffuse teintée vert : `0 20px 60px -20px rgba(10, 31, 21, 0.4)`.
- **Video Sections:** Plein écran avec brightness réduite. Masque radial obligatoire. Titre en overlay, centré.
- **Audio Player:** Barre fine horizontale, fond Verre Forestier. Barre de progression couleur Or Ancestral.
- **Inputs:** Label au-dessus en Brume Matinale. Fond transparent, bordure-bas Brume Matinale 1px. Focus ring Or Ancestral.

## 6. Layout Principles

- Sections plein écran (`min-h-[100dvh]`) alternant entre dense et aéré.
- Hero : contenu centré avec masque radial vidéo.
- Sections de savoir : Split-screen (60/40) avec image à gauche, texte à droite.
- Grille de contenu : 2 colonnes asymétriques (2fr 1fr), jamais 3 colonnes égales.
- Max-width : `1400px` centré avec padding horizontal `clamp(1.5rem, 5vw, 4rem)`.
- Mobile : collapse strict en colonne unique sous 768px.

## 7. Motion & Interaction

- **Spring Physics:** `stiffness: 80, damping: 25` — plus lent et plus "aquatique" que le défaut.
- **Scroll Reveals:** Fade-in depuis le bas, 60px de déplacement, stagger 150ms entre éléments.
- **Vidéo Parallaxe:** GSAP ScrollTrigger, scrub. La vidéo zoom lentement (scale 1.0 → 1.15) et se brouille au scroll.
- **Navigation:** Transparente sur le Hero, fond Verre Forestier au scroll (transition 600ms).
- **Texte Kisakata:** Apparition lettre par lettre (typewriter effect) sur les proverbes d'ouverture.

## 8. Anti-Patterns (Banned)

- Pas de curseur personnalisé
- Pas de vert néon ou d'éclat fluo
- Pas de noir pur (#000000)
- Pas de grille 3 colonnes égales
- Pas de "Scroll to explore" ou flèche de scroll
- Pas de texte gradient sur les grands titres
- Pas d'emojis
- Pas de polices Inter ou serif génériques
- Pas de contenu "placeholder" — tout doit être authentique
