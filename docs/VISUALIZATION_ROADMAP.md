# 🗺️ Roadmap du Système de Visualisation Mathématique — Kisakata.com

> **Document vivant** — Dernière mise à jour : 12 avril 2026
> Projet : [kisakata.com](https://kisakata.com) — Plateforme éducative Basakata (RDC)
> Stack : Next.js 16.2.2 · Tailwind CSS v3 · Framer Motion · Supabase

---

## 🌍 Vision du Projet

Kisakata est la première encyclopédie mathématique interactive conçue pour le peuple Basakata de la République Démocratique du Congo. Chaque concept abstrait — des chiffres aux polynômes — est ancré dans une expérience visuelle, interactive et culturellement située.

Le système de visualisation est la colonne vertébrale pédagogique de la plateforme. Chaque chapitre propose **4 visualisations distinctes** qui renforcent la compréhension par l'exploration sensorielle et la manipulation directe.

---

## 📊 Vue d'ensemble — Chiffres clés

| Indicateur | Valeur |
|---|---|
| Niveaux couverts | Primaire 1-6 + 1ère-3e Secondaire |
| Chapitres au total | **42 chapitres** |
| Visualisations actives | **168 instances** (42 chapitres × 4 visuels) |
| Types de visualisation distincts | **25 types** |
| Types hérités (Phase 1) | 15 types |
| Types ajoutés Phase 2 (primaires) | 10 types |
| Types ajoutés Phase 3 (secondaires) | 10 types |
| Composants React produits | 25 composants interactifs |

---

## 🏗️ Historique des Phases de Développement

### Phase 1 — Fondations (Types Historiques)

**Période :** Lancement initial du projet

Les 15 types de visualisation de base ont été créés pour couvrir les besoins essentiels du curriculum secondaire, avec une forte concentration sur l'algèbre, la géométrie et les statistiques descriptives.

**Types créés :**

| Type | Description courte |
|---|---|
| `balance` | Balance d'équations algébriques |
| `venn` | Diagramme de Venn interactif |
| `function-plot` | Tracé de fonctions mathématiques |
| `system` | Systèmes d'équations visuels |
| `angle-triangle` | Triangle avec mesures d'angles |
| `proportion` | Visualisation de la proportionnalité |
| `parabola` | Parabole et ses paramètres |
| `pythagorean-squares` | Démonstration du théorème de Pythagore |
| `statistics-bars` | Barres statistiques comparatives |
| `pie-chart` | Diagramme circulaire (camembert) |
| `number-line` | Droite numérique interactive |
| `place-value-grid` | Tableau de valeur positionnelle |
| `area-rectangle` | Aire d'un rectangle |
| `fraction-circle` | Cercle fractionnel |
| `timeline` | Frise chronologique (usage temporel) |

**Problème identifié :** Sur-utilisation du type `area-rectangle` (présent dans 8 chapitres primaires sans être le meilleur outil pédagogique). Le type `timeline` était parfois appliqué à des contextes non-temporels.

---

### Phase 2 — Visualisations Primaires (10 nouveaux types)

**Période :** Deuxième itération majeure

Création de 10 types spécifiquement conçus pour le cycle primaire (P1-P6), fondés sur la manipulation concrète, le comptage intuitif et la mesure physique.

**Types créés :**

| Type | Description |
|---|---|
| `counting-beads` | Boulier/abaque interactif avec slider 0-20 et billes animées |
| `number-bonds` | Ponts numériques SVG pour la décomposition additive |
| `coin-counter` | Compteur de pièces avec algorithme greedy (1F à 50F) |
| `ruler-measure` | Règle SVG 30 cm avec pirogue positionnable |
| `multiplication-grid` | Grille 10×10 avec cellules illuminées par la sélection |
| `fraction-bar` | 4 barres comparatives (1/1, 1/2, 1/3, 1/4) |
| `decimal-grid` | Grille 10×10 avec triple affichage fraction/décimal/% |
| `bar-model` | Modèle de barre Singapour pour la résolution de problèmes |
| `shape-explorer` | Explorateur de 4 formes cliquables + affichage des propriétés |
| `clock-face` | Horloge SVG analogique interactive 24h |

**Résultat :** La sur-utilisation de `area-rectangle` est réduite de 60%. Chaque niveau primaire dispose de types adaptés au stade cognitif des élèves (Piaget : stade opératoire concret).

---

### Phase 3 — Visualisations Secondaires (10 nouveaux types)

**Période :** Troisième itération majeure

Création de 10 types avancés pour le cycle secondaire (1ère-3e), orientés vers l'abstraction algébrique, la géométrie analytique et les statistiques inférentielles.

**Types créés :**

| Type | Description |
|---|---|
| `equation-steps` | Résolution pas à pas d'équations avec déballage des étapes |
| `number-sets` | Ensembles imbriqués ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ avec appartenance interactive |
| `coordinate-plane` | Plan cartésien XY interactif avec tracé de points |
| `slope-explorer` | Explorateur de pente et droite affine y = mx + b |
| `discriminant-viz` | Visualisation du discriminant Δ et position des paraboles |
| `angle-measurer` | Rapporteur SVG interactif 0-180° avec indication visuelle |
| `histogram` | Histogramme statistique avec classes de fréquences |
| `scatter-plot` | Nuage de points avec droite de tendance (régression) |
| `algebraic-tiles` | Tuiles algébriques manipulables (x², x, 1) |
| `truth-table` | Table d'appartenance ensembliste |

---

## 📚 Catalogue Complet des 25 Types

### Groupe A — Comptage et Nombres (Primaire)

---

#### `counting-beads`
- **Description :** Abaque interactif avec slider 0-20. Les billes se déplacent en temps réel selon la valeur choisie, avec animation Framer Motion.
- **Composant React :** `CountingBeadsViz`
- **Niveau :** Primaire 1-3
- **Chapitres utilisateurs :**
  - P1 — Compter de 1 à 5
  - P1 — Les chiffres
  - P1 — Jusqu'à 10
  - P2 — Soustraire
  - P3 — Dizaines et unités

---

#### `number-bonds`
- **Description :** Ponts numériques SVG illustrant la décomposition additive d'un nombre cible. Interactivité par clic sur les parties.
- **Composant React :** `NumberBondsViz`
- **Niveau :** Primaire 1-3
- **Chapitres utilisateurs :**
  - P1 — Compter de 1 à 5
  - P1 — Jusqu'à 10
  - P2 — Additionner
  - P2 — Soustraire
  - P3 — Addition

---

#### `number-line`
- **Description :** Droite numérique avec marqueur déplaçable. Utilisée pour positionner des entiers, des fractions, des décimaux et visualiser des opérations.
- **Composant React :** `NumberLineViz`
- **Niveau :** Primaire 1-6 / Secondaire 1
- **Chapitres utilisateurs :** Présent dans 20+ chapitres (type transversal)

---

#### `place-value-grid`
- **Description :** Tableau de valeur positionnelle (unités, dizaines, centaines). Remplissage visuel des colonnes selon la valeur saisie.
- **Composant React :** `PlaceValueGridViz`
- **Niveau :** Primaire 1-5
- **Chapitres utilisateurs :**
  - P1 — Les chiffres
  - P1 — Jusqu'à 10
  - P3 — Dizaines et unités
  - P3 — Addition
  - P3 — Deux opérations
  - P5 — Décimaux
  - P6 — Polygones

---

### Groupe B — Opérations et Mesures (Primaire)

---

#### `coin-counter`
- **Description :** Interface de comptage de pièces de monnaie congolaises (1F à 50F). Algorithme greedy qui distribue automatiquement le nombre minimal de pièces.
- **Composant React :** `CoinCounterViz`
- **Niveau :** Primaire 2
- **Chapitres utilisateurs :**
  - P2 — L'argent

---

#### `ruler-measure`
- **Description :** Règle SVG de 30 cm avec un objet positionnable (pirogue culturellement située). Lecture de la mesure en cm et mm.
- **Composant React :** `RulerMeasureViz`
- **Niveau :** Primaire 2-6 / Secondaire 2
- **Chapitres utilisateurs :**
  - P2 — Mesurer
  - P4 — Périmètres
  - P4 — Formes
  - P5 — Surface rectangle
  - P6 — Polygones
  - S2 — Géométrie plane
  - S2 — Triangles semblables
  - S3 — Théorème de Pythagore

---

#### `bar-model`
- **Description :** Modèle de barre Singapour (Singapore Bar Method). Permet de représenter visuellement des problèmes additifs, soustractifs et multiplicatifs avec des barres proportionnelles.
- **Composant React :** `BarModelViz`
- **Niveau :** Primaire 1-6
- **Chapitres utilisateurs :**
  - P1 — Compter de 1 à 5, Les chiffres, Avant et après
  - P2 — Additionner, L'argent, Mesurer, Problèmes
  - P3 — Dizaines et unités, Multiplication, Division, Deux opérations
  - P4 — Intérêt simple
  - P5 — Décimaux, Opérations décimales, Volumes et litres
  - P6 — Proportionnalité, Problèmes complexes

---

#### `multiplication-grid`
- **Description :** Grille 10×10 interactive. La sélection d'un facteur illumine la zone rectangulaire correspondante, illustrant visuellement le produit.
- **Composant React :** `MultiplicationGridViz`
- **Niveau :** Primaire 3-5
- **Chapitres utilisateurs :**
  - P3 — Multiplication
  - P3 — Division
  - P4 — Tables
  - P5 — Surface rectangle

---

#### `clock-face`
- **Description :** Horloge analogique SVG avec aiguilles déplaçables. Supporte le format 24h. Aiguilles animées en rotation fluide.
- **Composant React :** `ClockFaceViz`
- **Niveau :** Primaire 1
- **Chapitres utilisateurs :**
  - P1 — Avant et après

---

### Groupe C — Fractions, Décimaux et Pourcentages (Primaire)

---

#### `fraction-bar`
- **Description :** 4 barres de fraction comparatives représentant 1/1, 1/2, 1/3, 1/4. Permet une visualisation comparative directe de la taille relative des fractions.
- **Composant React :** `FractionBarViz`
- **Niveau :** Primaire 4-6
- **Chapitres utilisateurs :**
  - P4 — Fractions
  - P5 — Fractions numériques
  - P6 — Pourcentages
  - P6 — Proportionnalité

---

#### `fraction-circle`
- **Description :** Cercle fractionnel (camembert sectoriel interactif). Cliquer sur un secteur affiche la fraction correspondante.
- **Composant React :** `FractionCircleViz`
- **Niveau :** Primaire 3-6
- **Chapitres utilisateurs :**
  - P3 — Division
  - P4 — Fractions
  - P4 — Formes
  - P5 — Fractions numériques
  - P6 — Pourcentages

---

#### `decimal-grid`
- **Description :** Grille 10×10 représentant les centièmes. Trois modes d'affichage synchronisés : fraction, décimal et pourcentage.
- **Composant React :** `DecimalGridViz`
- **Niveau :** Primaire 5-6
- **Chapitres utilisateurs :**
  - P5 — Décimaux
  - P5 — Opérations décimales
  - P5 — Fractions numériques
  - P6 — Pourcentages
  - P6 — Graphiques

---

### Groupe D — Géométrie et Formes (Primaire)

---

#### `shape-explorer`
- **Description :** Explorateur de 4 formes géométriques (carré, rectangle, triangle, cercle). Un clic révèle les propriétés : côtés, angles, formules de périmètre et surface.
- **Composant React :** `ShapeExplorerViz`
- **Niveau :** Primaire 1-6 / Secondaire 2
- **Chapitres utilisateurs :**
  - P1 — Les formes
  - P4 — Périmètres
  - P4 — Formes
  - P6 — Polygones
  - S2 — Géométrie plane

---

#### `area-rectangle`
- **Description :** Rectangle redimensionnable avec affichage en temps réel de l'aire (longueur × largeur). Cellules de la grille intérieure comptables.
- **Composant React :** `AreaRectangleViz`
- **Niveau :** Primaire 1-5 / Secondaire 2
- **Chapitres utilisateurs :**
  - P1 — Les formes
  - P3 — Multiplication
  - P4 — Tables, Fractions, Périmètres, Formes
  - P5 — Surface rectangle

---

### Groupe E — Données et Statistiques (Primaire-Secondaire)

---

#### `statistics-bars`
- **Description :** Diagramme en barres avec données éditables. Utilisé transversalement du primaire (représentations simples) au secondaire (statistiques descriptives).
- **Composant React :** `StatisticsBarsViz`
- **Niveau :** Primaire 2-6 / Secondaire 1-3
- **Chapitres utilisateurs :** Présent dans 12+ chapitres (type transversal)

---

#### `timeline`
- **Description :** Frise chronologique SVG. Positionnement d'événements sur un axe temporel. **Règle de design :** Usage strictement réservé aux contextes temporels (histoire, chronologie, avant/après).
- **Composant React :** `TimelineViz`
- **Niveau :** Primaire 1-6
- **Chapitres utilisateurs :**
  - P1 — Avant et après
  - P2 — Problèmes
  - P4 — Intérêt simple
  - P6 — Graphiques
  - P6 — Problèmes complexes

---

#### `pie-chart`
- **Description :** Diagramme circulaire animé avec secteurs et légendes. Adapté pour la représentation de répartitions proportionnelles.
- **Composant React :** `PieChartViz`
- **Niveau :** Secondaire 3
- **Chapitres utilisateurs :**
  - S3 — Statistiques descriptives

---

#### `histogram`
- **Description :** Histogramme statistique avec classes de fréquences éditables. Affichage de la fréquence absolue et relative. Différent d'un diagramme en barres (classes continues).
- **Composant React :** `HistogramViz`
- **Niveau :** Secondaire 3
- **Chapitres utilisateurs :**
  - S3 — Statistiques descriptives
  - S3 — Représentation graphique

---

#### `scatter-plot`
- **Description :** Nuage de points XY avec droite de tendance (régression linéaire calculée). Points ajoutables/supprimables interactivement.
- **Composant React :** `ScatterPlotViz`
- **Niveau :** Secondaire 2-3
- **Chapitres utilisateurs :**
  - S2 — Triangles semblables
  - S3 — Statistiques descriptives
  - S3 — Représentation graphique

---

### Groupe F — Algèbre et Fonctions (Secondaire)

---

#### `balance`
- **Description :** Balance à plateaux pour visualiser l'équilibre d'une équation. Ajouter/retirer des poids des deux côtés illustre les propriétés d'équivalence.
- **Composant React :** `BalanceViz`
- **Niveau :** Primaire 2-3 / Secondaire 1-2
- **Chapitres utilisateurs :**
  - P2 — Additionner, L'argent, Problèmes
  - P3 — Addition, Deux opérations
  - P5 — Opérations décimales
  - P5 — Volumes et litres
  - S1 — Variables & Inconnues, Expressions algébriques, Équations du 1er degré
  - S2 — Systèmes d'équations

---

#### `equation-steps`
- **Description :** Affichage pas à pas de la résolution d'une équation. Chaque étape est révélée progressivement avec annotation de l'opération appliquée.
- **Composant React :** `EquationStepsViz`
- **Niveau :** Secondaire 1-3
- **Chapitres utilisateurs :**
  - S1 — Variables & Inconnues, Expressions algébriques, Équations du 1er degré
  - S2 — Systèmes d'équations
  - S3 — Équations du 2nd degré

---

#### `algebraic-tiles`
- **Description :** Tuiles algébriques manipulables représentant x², x et 1. Glisser-déposer pour former des polynômes et illustrer la factorisation.
- **Composant React :** `AlgebraicTilesViz`
- **Niveau :** Secondaire 1
- **Chapitres utilisateurs :**
  - S1 — Variables & Inconnues
  - S1 — Expressions algébriques

---

#### `function-plot`
- **Description :** Tracé de fonctions mathématiques avec axe interactif. Supporte les fonctions affines, polynomiales et trigonométriques.
- **Composant React :** `FunctionPlotViz`
- **Niveau :** Secondaire 2
- **Chapitres utilisateurs :**
  - S2 — Fonctions affines

---

#### `slope-explorer`
- **Description :** Explorateur de la droite affine y = mx + b. Sliders pour m (pente) et b (ordonnée à l'origine). Affichage de l'angle et de l'équation en temps réel.
- **Composant React :** `SlopeExplorerViz`
- **Niveau :** Secondaire 2
- **Chapitres utilisateurs :**
  - S2 — Fonctions affines
  - S2 — Systèmes d'équations

---

#### `coordinate-plane`
- **Description :** Plan cartésien XY interactif avec quadrillage. Placement de points par clic, affichage des coordonnées, tracé de droites.
- **Composant React :** `CoordinatePlaneViz`
- **Niveau :** Secondaire 1-3
- **Chapitres utilisateurs :**
  - S1 — Expressions algébriques, Équations du 1er degré
  - S2 — Fonctions affines, Systèmes d'équations
  - S3 — Équations du 2nd degré, Théorème de Pythagore, Représentation graphique

---

#### `discriminant-viz`
- **Description :** Visualisation du discriminant Δ = b² - 4ac. Affichage dynamique des 3 cas (Δ > 0 deux racines, Δ = 0 racine double, Δ < 0 pas de racine) avec parabole correspondante.
- **Composant React :** `DiscriminantViz`
- **Niveau :** Secondaire 3
- **Chapitres utilisateurs :**
  - S3 — Équations du 2nd degré

---

#### `parabola`
- **Description :** Parabole y = ax² + bx + c avec paramètres ajustables. Affichage du sommet, des racines et de l'axe de symétrie.
- **Composant React :** `ParabolaViz`
- **Niveau :** Secondaire 3
- **Chapitres utilisateurs :**
  - S3 — Équations du 2nd degré

---

### Groupe G — Géométrie Analytique et Logique (Secondaire)

---

#### `angle-measurer`
- **Description :** Rapporteur SVG interactif 0-180°. Un bras pivotant mesure l'angle sélectionné avec affichage en degrés.
- **Composant React :** `AngleMeasurerViz`
- **Niveau :** Secondaire 2-3
- **Chapitres utilisateurs :**
  - S2 — Géométrie plane
  - S2 — Triangles semblables
  - S3 — Théorème de Pythagore

---

#### `angle-triangle`
- **Description :** Triangle avec affichage dynamique des trois angles. Modifier un angle ajuste les autres pour maintenir la somme à 180°.
- **Composant React :** `AngleTriangleViz`
- **Niveau :** Secondaire 2
- **Chapitres utilisateurs :**
  - S2 — Géométrie plane

---

#### `pythagorean-squares`
- **Description :** Démonstration visuelle du théorème de Pythagore : carrés construits sur les trois côtés d'un triangle rectangle avec affichage des aires a² + b² = c².
- **Composant React :** `PythagoreanSquaresViz`
- **Niveau :** Secondaire 3
- **Chapitres utilisateurs :**
  - S3 — Théorème de Pythagore

---

#### `proportion`
- **Description :** Visualisation de la proportionnalité directe. Affichage de deux grandeurs liées avec rapport k constant.
- **Composant React :** `ProportionViz`
- **Niveau :** Secondaire 2
- **Chapitres utilisateurs :**
  - S2 — Triangles semblables

---

#### `number-sets`
- **Description :** Ensembles imbriqués ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ avec interface permettant de tester l'appartenance d'un nombre à chaque ensemble.
- **Composant React :** `NumberSetsViz`
- **Niveau :** Secondaire 1
- **Chapitres utilisateurs :**
  - S1 — Théorie des ensembles

---

#### `venn`
- **Description :** Diagramme de Venn interactif (deux ensembles). Affichage des régions A, B, A∩B et A∪B. Éléments déplaçables entre les zones.
- **Composant React :** `VennViz`
- **Niveau :** Secondaire 1
- **Chapitres utilisateurs :**
  - S1 — Théorie des ensembles

---

#### `truth-table`
- **Description :** Table d'appartenance ensembliste. Générer et afficher les tables de vérité pour les opérations ∩, ∪ et ∁.
- **Composant React :** `TruthTableViz`
- **Niveau :** Secondaire 1
- **Chapitres utilisateurs :**
  - S1 — Théorie des ensembles

---

## 📋 Mapping Curriculum Complet

### Primaires — 30 chapitres (P1 à P6)

| Programme | Chapitre | Type 1 | Type 2 | Type 3 | Type 4 |
|---|---|---|---|---|---|
| Primaire 1 | Compter de 1 à 5 | `counting-beads` | `number-line` | `number-bonds` | `bar-model` |
| Primaire 1 | Les chiffres | `counting-beads` | `number-line` | `place-value-grid` | `bar-model` |
| Primaire 1 | Les formes | `shape-explorer` | `ruler-measure` | `area-rectangle` | `fraction-circle` |
| Primaire 1 | Avant et après | `timeline` | `number-line` | `clock-face` | `bar-model` |
| Primaire 1 | Jusqu'à 10 | `counting-beads` | `number-bonds` | `number-line` | `place-value-grid` |
| Primaire 2 | Additionner | `number-bonds` | `number-line` | `balance` | `bar-model` |
| Primaire 2 | Soustraire | `number-bonds` | `number-line` | `balance` | `counting-beads` |
| Primaire 2 | L'argent | `coin-counter` | `number-line` | `balance` | `bar-model` |
| Primaire 2 | Mesurer | `ruler-measure` | `number-line` | `bar-model` | `statistics-bars` |
| Primaire 2 | Problèmes | `bar-model` | `timeline` | `number-line` | `balance` |
| Primaire 3 | Dizaines et unités | `place-value-grid` | `counting-beads` | `number-line` | `bar-model` |
| Primaire 3 | Addition | `place-value-grid` | `number-bonds` | `number-line` | `balance` |
| Primaire 3 | Multiplication | `multiplication-grid` | `area-rectangle` | `number-line` | `bar-model` |
| Primaire 3 | Division | `multiplication-grid` | `fraction-circle` | `number-line` | `bar-model` |
| Primaire 3 | Deux opérations | `number-line` | `balance` | `bar-model` | `place-value-grid` |
| Primaire 4 | Tables | `multiplication-grid` | `area-rectangle` | `number-line` | `statistics-bars` |
| Primaire 4 | Fractions | `fraction-bar` | `fraction-circle` | `area-rectangle` | `number-line` |
| Primaire 4 | Périmètres | `ruler-measure` | `shape-explorer` | `area-rectangle` | `statistics-bars` |
| Primaire 4 | Formes | `shape-explorer` | `area-rectangle` | `ruler-measure` | `fraction-circle` |
| Primaire 4 | Intérêt simple | `number-line` | `statistics-bars` | `bar-model` | `timeline` |
| Primaire 5 | Décimaux | `decimal-grid` | `place-value-grid` | `number-line` | `bar-model` |
| Primaire 5 | Opérations décimales | `decimal-grid` | `number-line` | `balance` | `bar-model` |
| Primaire 5 | Fractions numériques | `fraction-bar` | `fraction-circle` | `decimal-grid` | `number-line` |
| Primaire 5 | Surface rectangle | `area-rectangle` | `ruler-measure` | `multiplication-grid` | `statistics-bars` |
| Primaire 5 | Volumes et litres | `bar-model` | `number-line` | `statistics-bars` | `balance` |
| Primaire 6 | Pourcentages | `decimal-grid` | `fraction-circle` | `statistics-bars` | `fraction-bar` |
| Primaire 6 | Proportionnalité | `statistics-bars` | `number-line` | `bar-model` | `fraction-bar` |
| Primaire 6 | Polygones | `shape-explorer` | `ruler-measure` | `area-rectangle` | `place-value-grid` |
| Primaire 6 | Graphiques | `statistics-bars` | `decimal-grid` | `timeline` | `number-line` |
| Primaire 6 | Problèmes complexes | `bar-model` | `statistics-bars` | `number-line` | `timeline` |

---

### Secondaires — 12 chapitres (1ère-3e secondaire)

| Programme | Chapitre | Type 1 | Type 2 | Type 3 | Type 4 |
|---|---|---|---|---|---|
| 1ère secondaire | Variables & Inconnues | `algebraic-tiles` | `balance` | `equation-steps` | `number-line` |
| 1ère secondaire | Expressions algébriques | `algebraic-tiles` | `equation-steps` | `coordinate-plane` | `balance` |
| 1ère secondaire | Équations du 1er degré | `equation-steps` | `balance` | `number-line` | `coordinate-plane` |
| 1ère secondaire | Théorie des ensembles | `number-sets` | `truth-table` | `venn` | `statistics-bars` |
| 2e secondaire | Fonctions affines | `slope-explorer` | `coordinate-plane` | `function-plot` | `statistics-bars` |
| 2e secondaire | Systèmes d'équations | `coordinate-plane` | `balance` | `equation-steps` | `slope-explorer` |
| 2e secondaire | Géométrie plane | `angle-measurer` | `angle-triangle` | `shape-explorer` | `ruler-measure` |
| 2e secondaire | Triangles semblables | `proportion` | `angle-measurer` | `ruler-measure` | `scatter-plot` |
| 3e secondaire | Équations du 2nd degré | `discriminant-viz` | `parabola` | `coordinate-plane` | `equation-steps` |
| 3e secondaire | Théorème de Pythagore | `pythagorean-squares` | `angle-measurer` | `ruler-measure` | `coordinate-plane` |
| 3e secondaire | Statistiques descriptives | `histogram` | `scatter-plot` | `statistics-bars` | `pie-chart` |
| 3e secondaire | Représentation graphique | `scatter-plot` | `histogram` | `statistics-bars` | `coordinate-plane` |

---

## 🎨 Principes de Design Pédagogique

Ces règles ont guidé les choix de types pour chaque chapitre.

### 1. Règle de Pertinence Contextuelle
Chaque type de visualisation doit correspondre au **concept mathématique central** du chapitre, pas à une utilisation générique. Un `area-rectangle` est justifié pour enseigner les aires et la multiplication — pas pour illustrer des fractions simples ou des comparaisons statistiques.

### 2. Règle de la Progression Cognitive (Piaget)
- **P1-P2 :** Stade préopératoire → concret, manipulable, comptable (`counting-beads`, `coin-counter`, `clock-face`)
- **P3-P4 :** Stade opératoire concret → structures logiques, règles (`multiplication-grid`, `fraction-bar`, `shape-explorer`)
- **P5-P6 :** Transition → abstraction partielle (`decimal-grid`, `bar-model`, `statistics-bars`)
- **Secondaire :** Stade formel → abstraction pure (`equation-steps`, `coordinate-plane`, `discriminant-viz`)

### 3. Règle d'Usage Strict du `timeline`
Le type `timeline` est **exclusivement réservé** aux contenus temporels : chronologies, séquences d'événements, notions "avant/après". Il ne doit jamais être utilisé comme substitut à un `bar-model` ou `statistics-bars` pour illustrer des comparaisons quantitatives.

### 4. Règle des 4 Visualisations Complémentaires
Chaque chapitre doit proposer 4 types **distincts et complémentaires** — jamais 4 variantes du même concept. L'idéal est de combiner : un type principal (concept clé), un type structurel (organisation), un type comparatif (mise en relation), un type applicatif (problème).

### 5. Règle de Diversification Inter-Chapitres
Un même type ne doit pas apparaître dans plus de 3 chapitres consécutifs du même niveau scolaire. Cette règle maintient l'engagement et évite la saturation cognitive.

### 6. Ancrage Culturel Basakata
Quand cela est possible, les types primaires intègrent des objets culturellement proches : la pirogue pour la règle, les pièces congolaises pour le comptage monétaire. Ce principe renforce l'identité et réduit la distance cognitive.

---

## 🔭 Roadmap Future

### Prochaine étape : Extension vers la 4e-6e Secondaire

Le curriculum secondaire complet couvre 6 années (1ère à 6e secondaire). Les 12 chapitres actuellement mappés couvrent les 3 premières années. Les années 4-6 nécessiteront :

| Besoin estimé | Nouveaux types à créer |
|---|---|
| Trigonométrie (sin, cos, tan) | `trig-circle` — Cercle trigonométrique interactif |
| Logarithmes et exponentielles | `log-plot` — Graphe logarithmique/exponentiel |
| Géométrie dans l'espace | `3d-solid` — Solides 3D rotatifs (pyramide, cylindre, sphère) |
| Suites et séries | `sequence-viz` — Représentation terme par terme |
| Probabilités | `probability-tree` — Arbre des probabilités interactif |
| Géométrie analytique avancée | `conic-sections` — Sections coniques (ellipse, hyperbole) |
| Vecteurs | `vector-field` — Champ vectoriel 2D |
| Matrices | `matrix-transform` — Transformation matricielle visuelle |

**Estimation :** 8 nouveaux types pour 24 chapitres supplémentaires (4e-6e secondaire).

### Exercices Interactifs (Gamification)

La prochaine évolution des visualisations consiste à les transformer en exercices évaluatifs :

- **Mode découverte** (état actuel) → exploration libre, pas de validation
- **Mode exercice** → l'apprenant doit atteindre un état cible, réponse validée
- **Mode défi** → contrainte temporelle, compteur d'essais, système de points Basakata

Cette évolution nécessitera un système de scoring côté Supabase et une intégration avec les profils utilisateurs (`free` / `premium`).

### Accessibilité (a11y)

Conformément à l'audit d'accessibilité réalisé (voir `ACCESSIBILITY_AUDIT.md`), les prochaines priorités pour les visualisations sont :

- Ajouter des `aria-label` descriptifs sur toutes les zones SVG interactives
- Implémenter la navigation clavier (Tab/Enter/Arrow) sur les composants de type `counting-beads`, `multiplication-grid` et `coordinate-plane`
- Ajouter des descriptions textuelles alternatives (`aria-description`) pour les graphiques complexes (`histogram`, `scatter-plot`)
- Tester avec VoiceOver (macOS) et NVDA (Windows)

### Optimisation des Performances

- Lazy loading des composants de visualisation (priorité : `coordinate-plane`, `discriminant-viz`, `scatter-plot` qui sont les plus lourds en calcul SVG)
- Conversion des visualisations statiques (non interactives) vers des images SVG pré-générées
- Mise en cache des visualisations côté serveur pour les utilisateurs `free` sans interaction

---

## 📈 Métriques — Avant / Après

### Couverture en types de visualisation

| Indicateur | Phase 1 (avant) | Phase 3 (après) |
|---|---|---|
| Types distincts disponibles | **7** types actifs | **25** types actifs |
| Couverture du curriculum primaire | ~40% (types inadaptés) | **100%** (types dédiés) |
| Couverture du curriculum secondaire | ~70% | **100%** |
| Types réellement différenciés | 4-5 (forte redondance) | 25 (forte spécialisation) |

### Réduction de la sur-utilisation de `area-rectangle`

| Niveau | Occurrences avant | Occurrences après | Réduction |
|---|---|---|---|
| Primaire 1-3 | 6 occurrences | 3 occurrences | -50% |
| Primaire 4-6 | 8 occurrences | 5 occurrences | -37% |
| Total | **14 occurrences** | **8 occurrences** | **-43%** |

`area-rectangle` est maintenant réservé aux chapitres où il est pédagogiquement le plus pertinent (multiplication, périmètres, surfaces).

### Distribution équilibrée des types (Phase 3)

Les 5 types les plus utilisés dans le curriculum global :

| Type | Nb chapitres | % du total |
|---|---|---|
| `number-line` | 22 | 52% |
| `bar-model` | 16 | 38% |
| `statistics-bars` | 14 | 33% |
| `balance` | 12 | 28% |
| `coordinate-plane` | 8 | 19% |

Les types fortement spécialisés (`coin-counter`, `clock-face`, `truth-table`, `discriminant-viz`) restent concentrés sur 1 à 2 chapitres — signe d'une conception ciblée et non générique.

---

## 🗂️ Référence des Fichiers Sources

Tous les composants de visualisation se trouvent dans le répertoire :

```
src/components/visualizations/
```

Les configurations de mapping curriculum (types assignés par chapitre) sont déclarées dans :

```
src/lib/curriculum/
  primaire.ts      — 30 chapitres primaires avec leurs 4 types
  secondaire.ts    — 12 chapitres secondaires avec leurs 4 types
```

Les pages de rendu dynamique utilisent ces configurations via :

```
src/app/ecole/[niveau]/[chapitre]/page.tsx
```

---

*Roadmap maintenue par l'équipe Kisakata — kisakata.com*
*Plateforme éducative pour le peuple Basakata, République Démocratique du Congo*
