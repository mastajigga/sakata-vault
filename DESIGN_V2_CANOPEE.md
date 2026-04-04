# Design System: Kisakata.com — V2 "Canopée Digitale"

## 1. Visual Theme & Atmosphere

Une interface dense et vibrante, comme une marche sous la canopée de la forêt équatoriale du Mai-Ndombe. La lumière filtre à travers les feuilles — des taches d'or et d'émeraude dansent sur un fond obscur. L'énergie est celle d'un écosystème vivant : micro-animations de particules lumineuses, transitions organiques, éléments qui "respirent". Le design est plus dense, plus technologique que la V1, tout en restant naturel. C'est la forêt vue par un drone 4K — moderne, précise, majestueuse.

- **Density:** 5/10 — Daily App Balanced. L'espace est rempli mais structuré. Les sections sont connectées.
- **Variance:** 8/10 — Asymétrie forte. Masonry, overlapping contrôlé, colonnes fractionnaires.
- **Motion:** 8/10 — Chorégraphie avancée. Particules de lumière, scroll-triggered reveals, micro-interactions infinies.

## 2. Color Palette & Roles

- **Noir Forestier** (#070E08) — Fond principal. Le noir de la forêt dense, presque végétal.
- **Sous-Bois** (#0D1A0F) — Fond secondaire, sections alternées.
- **Émeraude Profonde** (#2D6A4F) — Accent principal. Saturation 63%. CTAs, liens, focus rings.
- **Ambre Lumière** (#E9C46A) — Accent secondaire pour les accents typographiques et les highlights.
- **Mousse Claire** (#B7C9B7) — Texte secondaire. Doux, organique, comme la mousse sur les troncs.
- **Blanc Cassé** (#F4F1EB) — Texte principal. Chaleur naturelle.
- **Canopée Glass** (rgba(7, 14, 8, 0.7)) — Surfaces glassmorphism avec blur(20px).
- **Fibre Végétale** (rgba(45, 106, 79, 0.12)) — Bordures subtiles, 1px.

**BANNI :** Vert fluo, violet/bleu IA, noir pur, gradients néon.

## 3. Typography Rules

- **Display:** `Cabinet Grotesk` — Bold, tracking -0.04em. Taille `clamp(2.5rem, 6vw, 5rem)`. Présence visuelle forte sans crier.
- **Body:** `Geist` — Leading 1.75, max-width 65ch. Couleur Blanc Cassé à 80% opacité.
- **Mono:** `Geist Mono` — Dates, statistiques, métadonnées de sources. Couleur Mousse Claire.
- **Kisakata Text:** `Cabinet Grotesk Italic` — Mots en kisakata en italique, couleur Ambre Lumière.

**BANNI :** Inter, Times New Roman, Georgia. Tailles excessives sur mobile.

## 4. Hero Section: "Entrée dans la Canopée"

- Vidéo `iluo into the eyes.mp4` en plein écran, brightness(0.3), contrast(1.1)
- **Masque rectangulaire arrondi** : La vidéo est contenue dans un rectangle `border-radius: 2rem` avec un padding de `2rem` par rapport aux bords — comme une fenêtre dans la forêt
  ```css
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  border-radius: 2rem;
  margin: 2rem;
  ```
- Titre aligné à gauche (split-screen 60/40). Poids 700.
- Sous-titre en Mousse Claire, max 55ch.
- CTA : bouton rempli Émeraude Profonde. Texte Blanc Cassé. Hover : scale(1.02) + shadow émeraude.
- **Particules de lumière** : Canvas overlay avec des points lumineux flottants simulant la lumière à travers la canopée (WebGL ou CSS keyframes).

## 5. Component Stylings

- **Buttons:** Fond Émeraude Profonde, text Blanc Cassé. Hover : luminosité +10%, shadow diffuse émeraude. Active : translateY(-1px), scale(0.98).
- **Cards:** `border-radius: 2rem`. Fond Canopée Glass. Bordure Fibre Végétale. Shadow : `0 30px 60px -20px rgba(7, 14, 8, 0.5)`. Hover : bordure passe à Émeraude Profonde, transition 400ms.
- **Video Sections:** Rectangles arrondis avec margin. Fade-to-black sur les bords.
- **Audio Player:** Lecteur flottant en bas de page, fond Canopée Glass. Forme organique arrondie. Waveform visualisé en Émeraude.
- **Inputs:** Fond transparent. Bordure complète Fibre Végétale. Focus : bordure Émeraude, glow subtil.

## 6. Layout Principles

- Sections fullscreen avec transitions de couleur (Noir Forestier → Sous-Bois alternés).
- Hero : Split-screen asymétrique. Titre à gauche, illustration/vidéo à droite.
- Savoir Grid : Masonry 3 colonnes (2fr 1.5fr 1fr) avec des hauteurs variées.
- Timeline : Scroll horizontal hijack (GSAP) pour l'histoire chronologique.
- Max-width : `1440px` centré.
- Mobile : colonne unique, padding `1rem`.

## 7. Motion & Interaction

- **Spring Physics:** `stiffness: 120, damping: 18` — réactif et dynamique, comme le vent dans les feuilles.
- **Particules de Lumière:** Canvas overlay avec 30-50 points lumineux semi-transparents, flottant lentement. Intensité liée au scroll.
- **Scroll Reveals:** Éléments entrent depuis les côtés (alternant gauche/droite), stagger 100ms.
- **Card Hover:** Parallax tilt léger (5°) suivant le curseur. Bordure s'illumine en Émeraude.
- **Navigation:** Transparente en haut. Au scroll : fond Canopée Glass avec blur. Transition 500ms.
- **Proverbes:** Animation de "typed" (lettre par lettre) avec cursor blinking Ambre.

## 8. Anti-Patterns (Banned)

- Pas de curseur personnalisé
- Pas de néon ou de glow saturé
- Pas de noir pur (#000000)
- Pas de grille 3 colonnes égales
- Pas de "Scroll to explore"
- Pas de gradient text sur les grands titres
- Pas d'emojis
- Pas d'Inter ou de serif génériques
- Pas de contenu placeholder
