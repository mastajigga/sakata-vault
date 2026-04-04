# Design System: Kisakata.com — V3 "Terre & Ciel"

## 1. Visual Theme & Atmosphere

Une interface chaleureuse et terrienne, comme une soirée au coin du feu dans un village du Mai-Ndombe. Les couleurs évoquent la terre rouge, le bois sombre, le cuivre artisanal et le ciel crépusculaire. L'atmosphère est celle de la sagesse qui se transmet dans le calme — pas de spectacle, mais une profondeur magnétique. Le design est le plus "humain" des trois — moins technologique, plus artisanal, comme un objet sculpté à la main avec des outils modernes.

- **Density:** 4/10 — Galerie avec des respirations. Sections longues, scrolling contemplatif.
- **Variance:** 6/10 — Asymétrie douce. Décalages subtils, pas de ruptures brutales.
- **Motion:** 5/10 — Fluide et discret. Transitions CSS soignées, pas de chorégraphie complexe.

## 2. Color Palette & Roles

- **Ciel Nocturne** (#1B2838) — Fond principal. Bleu profond de la nuit équatoriale.
- **Terre Profonde** (#2A1810) — Fond secondaire. Pour les sections alternées et les accents terrestres.
- **Cuivre Artisanal** (#B87333) — Accent unique. Saturation 65%. CTAs, liens, ornements. Évoque le cuivre des bijoux et outils traditionnels.
- **Sable Doux** (#E8DCC8) — Texte principal. La couleur du sable de rivière au soleil couchant.
- **Cendre Chaude** (#9B8E80) — Texte secondaire. Gris-brun chaleureux.
- **Argile Translucide** (rgba(42, 24, 16, 0.5)) — Surfaces glassmorphism.
- **Fil de Cuivre** (rgba(184, 115, 51, 0.15)) — Bordures, séparateurs.

**BANNI :** Cuivre saturé éclatant, violet/bleu IA, noir pur, dégradés flashy.

## 3. Typography Rules

- **Display:** `Satoshi` — Bold, tracking -0.02em. Taille contrôlée `clamp(2rem, 4.5vw, 3.5rem)`. Élégance sobre.
- **Body:** `Outfit` — Leading 1.8, max-width 60ch. Couleur Sable Doux à 85% opacité. Très lisible, très doux.
- **Mono:** `Geist Mono` — Dates, sources, métadonnées. Couleur Cendre Chaude.
- **Kisakata Text:** `Satoshi Medium Italic` — Mots en kisakata, couleur Cuivre Artisanal.

**BANNI :** Inter, polices serif génériques, typo "aggressive" ou "tech".

## 4. Hero Section: "Le Feu du Soir"

- Vidéo `iluo into the eyes.mp4` en plein écran, brightness(0.25), sepia(0.15)
- **Masque vignette ovale** : Dégradé radial elliptique qui fond la vidéo dans le Ciel Nocturne
  ```css
  mask-image: radial-gradient(ellipse 60% 65% at center 45%, black 20%, transparent 75%);
  ```
- Titre centré, taille modérée (pas de texte géant). Poids 600 (medium, pas bold).
- Sous-titre en Sable Doux à 55% opacité. Ton du Sage : "La rivière ne s'arrête jamais de couler..."
- CTA : bouton outline Cuivre Artisanal. Hover : remplissage Cuivre, texte Ciel Nocturne.
- **Texture subtile** : Bruit de grain (noise overlay) à 3% opacité sur tout le site pour un rendu artisanal.

## 5. Component Stylings

- **Buttons:** Outline Cuivre Artisanal 1.5px. Hover : fond Cuivre, texte Ciel Nocturne. Transition 350ms. Active : translateY(-1px).
- **Cards:** `border-radius: 1.25rem`. Fond Argile Translucide. Bordure Fil de Cuivre. Shadow : `0 15px 40px -15px rgba(27, 40, 56, 0.3)`. Hover : bordure Cuivre.
- **Dividers:** Au lieu de cartes pour le contenu dense, utiliser des `border-top` Fil de Cuivre 1px avec `padding-top: 2rem`.
- **Audio Player:** Intégré dans le flux du contenu (pas flottant). Style "vinyle" avec une barre de progression arrondie en Cuivre.
- **Inputs:** Fond transparent. `border-bottom` Cendre Chaude 1px. Focus : border-bottom Cuivre + glow très subtil.

## 6. Layout Principles

- Sections longues et contemplatives, pas nécessairement fullscreen. `min-h-[70vh]` suffit.
- Hero : centré avec masque ovale. Contenu en une seule colonne luxueuse.
- Savoir : Alternance texte/image en zig-zag (texte à gauche, image à droite, puis inversé).
- Pas de masonry. Pas de grille complexe. La simplicité est le luxe.
- Max-width : `1200px` centré — plus étroit que V1/V2 pour un sentiment "intime".
- Séparations entre sections : `border-top` Fil de Cuivre + grand espacement (`py-32`).
- Mobile : colonne unique, padding `1.25rem`.

## 7. Motion & Interaction

- **Spring Physics:** `stiffness: 60, damping: 30` — lent, majestueux, comme un vieil arbre qui bouge dans le vent.
- **Scroll Reveals:** Uniquement fade-in + translateY(30px). Pas de slides latéraux. Durée 1000ms.
- **Grain Overlay:** Noise texture fixée (`position: fixed`) à 3% opacité, `pointer-events: none`.
- **Navigation:** Semi-transparente, fond Argile Translucide. Pas de changement brusque au scroll — juste un léger renforcement du blur.
- **Proverbes:** Fade-in simple, pas de typewriter. Opacité 0 → 1 en 1.5s.
- **Images:** Reveal au scroll avec un masque rectangulaire qui s'ouvre du centre vers les bords (clip-path animation).

## 8. Anti-Patterns (Banned)

- Pas de curseur personnalisé
- Pas de néon, pas de glow
- Pas de noir pur (#000000)
- Pas de grilles 3 colonnes égales
- Pas de "Scroll to explore" ou chevrons
- Pas de gradient text
- Pas d'emojis
- Pas d'Inter ou de serif génériques
- Pas de particules (trop "tech" pour cette version)
- Pas de parallax agressive — tout est doux et lent
