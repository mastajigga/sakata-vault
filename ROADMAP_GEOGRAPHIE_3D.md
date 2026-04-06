# Roadmap — Section Géographie Immersive 3D
## « Voyage au Cœur du Territoire Basakata »

> *"La terre ne ment pas. Elle garde la mémoire de ceux qui l'ont foulée."*

---

## Vue d'ensemble

La section Géographie de Kisakata.com sera une expérience immersive unique : une carte 3D interactive du territoire traditionnel des Basakata (Territoire de Kutu, Province Mai-Ndombe, RDC), enrichie d'animations saisonnières, de couches culturelles et de fonctionnalités communautaires.

L'objectif : transformer une simple carte en un **récit spatial vivant**, où chaque rivière, chaque village, chaque forêt raconte une histoire — et où la communauté peut contribuer à cette mémoire collective.

---

## Stack Technologique

### Moteur cartographique principal

| Technologie | Rôle | Pourquoi ce choix |
|---|---|---|
| **MapLibre GL JS** (v5+) | Carte de base 3D avec terrain | Open-source (fork Mapbox), léger (~42 KB gzip), excellent support terrain-rgb, React-friendly, styling puissant |
| **react-map-gl** (endpoint MapLibre) | Wrapper React | Intégration idiomatique avec Next.js App Router, hooks natifs, gestion déclarative des layers |
| **Deck.gl** | Couches de données animées | GPU-accelerated, animations de flux (rivières), heatmaps culturelles, time-series pour les saisons |

### Données d'élévation & terrain

| Source | Résolution | Usage |
|---|---|---|
| **SRTM 30m** (NASA/Digital Earth Africa) | 30m | Terrain 3D haute résolution pour le territoire Kutu |
| **Terrain-RGB tiles** (auto-hébergé ou MapTiler) | Variable | Tuiles DEM converties pour MapLibre `raster-dem` source |
| **Global Forest Watch** | 30m | Couverture forestière historique (animation avant/après) |

### Animation & effets visuels

| Technologie | Rôle |
|---|---|
| **GSAP + ScrollTrigger** | Animations de survol cinématique (camera fly-through), timelines narratives |
| **Framer Motion** | Transitions UI (panneaux, modals, sidebars), entrées/sorties de composants |
| **Three.js + React Three Fiber** | Éléments 3D spéciaux : modèles de pirogues, arbres, effets d'eau avancés |
| **Shaders GLSL personnalisés** | Animation réaliste de l'eau (lac Mai-Ndombe), brume atmosphérique |

### Backend & communauté

| Technologie | Rôle |
|---|---|
| **Supabase (existant)** | Stockage des annotations, commentaires, photos/vidéos, votes. Realtime pour discussions en direct |
| **Supabase Storage** | Upload de photos/vidéos communautaires géolocalisées |
| **PostGIS** (via Supabase) | Requêtes géospatiales (points dans un rayon, intersections de polygones) |
| **RLS Policies** | Sécurité des données communautaires par rôle |

### Design & UI

| Technologie | Rôle |
|---|---|
| **Tailwind CSS v3** | Styling (cohérent avec le design system existant) |
| **CSS Variables** | Palette V1 "Brume de la Rivière" / V3 "Terre & Ciel" |
| **Lucide React** | Iconographie |
| **Radix UI** (via patterns existants) | Composants accessibles (tooltips, dropdowns, modals) |

---

## Architecture des composants

```
src/app/geographie/
├── page.tsx                         # Page serveur — metadata SEO, données initiales
├── layout.tsx                       # Layout avec sidebar rétractable
│
├── components/
│   ├── MapContainer.tsx             # Conteneur principal MapLibre + terrain 3D
│   ├── TerrainMap.tsx               # Configuration MapLibre (sources, layers, camera)
│   ├── CinematicFlythrough.tsx      # Animation d'ouverture GSAP (survol du lac → territoire)
│   │
│   ├── layers/
│   │   ├── HydrographyLayer.tsx     # Rivières animées (Deck.gl PathLayer + flow animation)
│   │   ├── SeasonalWaterLayer.tsx   # Niveaux d'eau saisonniers (morph GeoJSON polygons)
│   │   ├── ForestCoverLayer.tsx     # Couverture forestière (toggle avant/après)
│   │   ├── SubtribesLayer.tsx       # Zones des sous-tribus (polygones colorés + labels)
│   │   ├── DialectsLayer.tsx        # Zones dialectales (choropleth interactif)
│   │   ├── VillagesLayer.tsx        # Points de villages + nécropoles + ports historiques
│   │   └── CommunityPinsLayer.tsx   # Épingles communautaires (photos, vidéos, commentaires)
│   │
│   ├── panels/
│   │   ├── InfoPanel.tsx            # Panneau latéral avec détails (rivière, village, etc.)
│   │   ├── SeasonSlider.tsx         # Curseur temporel saison sèche ↔ saison des pluies
│   │   ├── LayerToggle.tsx          # Contrôle des couches (forêt, eau, tribus, dialectes)
│   │   ├── TimelineSlider.tsx       # Curseur historique (époque coloniale → aujourd'hui)
│   │   └── LegendPanel.tsx          # Légende dynamique selon les couches actives
│   │
│   ├── community/
│   │   ├── PinCreator.tsx           # Formulaire pour ajouter un point (photo/vidéo/texte)
│   │   ├── PinDetail.tsx            # Vue détaillée d'un pin communautaire
│   │   ├── CommentThread.tsx        # Discussion en temps réel sur un point
│   │   ├── MediaUploader.tsx        # Upload photo/vidéo avec géolocalisation
│   │   └── CommunityFeed.tsx        # Flux des contributions récentes
│   │
│   ├── audio/
│   │   ├── DialectPlayer.tsx        # Lecteur audio pour exemples de dialectes
│   │   └── AmbientSounds.tsx        # Sons d'ambiance (eau, forêt, oiseaux) selon le zoom
│   │
│   └── 3d/
│       ├── WaterShader.tsx          # Shader GLSL pour le lac Mai-Ndombe
│       ├── PirogueModel.tsx         # Modèle 3D de pirogue sur les rivières
│       └── TreeCanopy.tsx           # Modèle de canopée forestière
│
├── hooks/
│   ├── useMapCamera.ts             # Contrôle programmatique de la caméra
│   ├── useSeasonAnimation.ts       # Logique d'interpolation saisonnière
│   ├── useLayerVisibility.ts       # État des couches visibles
│   ├── useCommunityPins.ts         # CRUD + Realtime des pins communautaires
│   └── useTerrainData.ts           # Chargement des données d'élévation
│
├── data/
│   ├── rivers.geojson              # Tracés des rivières (Lebili, Lekobe, Molibampei, etc.)
│   ├── subtribes.geojson           # Polygones des sous-tribus (Bobai, Waria, Bayi, etc.)
│   ├── dialects.geojson            # Zones dialectales (waria, kebai, mokan, etc.)
│   ├── villages.geojson            # Points de villages, ports, sites historiques
│   ├── forest-cover-2000.geojson   # Couverture forestière 2000
│   ├── forest-cover-2025.geojson   # Couverture forestière 2025
│   ├── water-dry-season.geojson    # Contours lac/rivières en saison sèche
│   └── water-wet-season.geojson    # Contours lac/rivières en saison des pluies
│
└── lib/
    ├── mapStyles.ts                # Style MapLibre personnalisé (palette Kisakata)
    ├── terrainConfig.ts            # Configuration des tuiles terrain-rgb
    └── geoUtils.ts                 # Utilitaires géospatiaux (distance, bounds, etc.)
```

---

## Schema de base de données (nouvelles tables Supabase)

```sql
-- =============================================
-- TABLE: map_annotations (épingles communautaires)
-- =============================================
CREATE TABLE map_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  annotation_type TEXT NOT NULL CHECK (annotation_type IN (
    'photo', 'video', 'story', 'memory', 'question', 'proverb', 'historical'
  )),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  village_name TEXT,
  dialect_zone TEXT,
  likes_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,   -- validé par un admin/contributor
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index géospatial pour requêtes performantes
CREATE INDEX idx_annotations_location ON map_annotations USING GIST (location);

-- =============================================
-- TABLE: map_comments (discussions sur les points)
-- =============================================
CREATE TABLE map_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_id UUID REFERENCES map_annotations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES map_comments(id),  -- réponses imbriquées
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: map_annotation_votes (likes/upvotes)
-- =============================================
CREATE TABLE map_annotation_votes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_id UUID REFERENCES map_annotations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, annotation_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: map_layers_metadata (config des couches)
-- =============================================
CREATE TABLE map_layers_metadata (
  id TEXT PRIMARY KEY,  -- ex: 'hydro', 'forest', 'subtribes'
  name_fr TEXT NOT NULL,
  name_skt TEXT,
  description_fr TEXT,
  is_default_visible BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  icon TEXT  -- nom d'icône Lucide
);

-- =============================================
-- RLS Policies
-- =============================================
ALTER TABLE map_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_annotation_votes ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Annotations visibles par tous"
  ON map_annotations FOR SELECT USING (true);

-- Création pour utilisateurs authentifiés
CREATE POLICY "Créer annotation si authentifié"
  ON map_annotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Modification par le propriétaire ou admin
CREATE POLICY "Modifier sa propre annotation"
  ON map_annotations FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Suppression par le propriétaire ou admin
CREATE POLICY "Supprimer sa propre annotation"
  ON map_annotations FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Comments : lecture publique, écriture authentifiée
CREATE POLICY "Comments visibles par tous"
  ON map_comments FOR SELECT USING (true);

CREATE POLICY "Commenter si authentifié"
  ON map_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Votes : un vote par utilisateur par annotation
CREATE POLICY "Voter si authentifié"
  ON map_annotation_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Voir les votes"
  ON map_annotation_votes FOR SELECT USING (true);

CREATE POLICY "Retirer son vote"
  ON map_annotation_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour likes_count
CREATE OR REPLACE FUNCTION update_annotation_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE map_annotations SET likes_count = likes_count + 1
    WHERE id = NEW.annotation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE map_annotations SET likes_count = likes_count - 1
    WHERE id = OLD.annotation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_annotation_likes
AFTER INSERT OR DELETE ON map_annotation_votes
FOR EACH ROW EXECUTE FUNCTION update_annotation_likes_count();
```

---

## Phases de développement

### Phase 1 — Fondations & Carte 3D de base (Semaines 1–3)

**Objectif :** Afficher le territoire de Kutu en 3D avec terrain réaliste et navigation fluide.

| Tâche | Détail | Livrable |
|---|---|---|
| **1.1** Setup MapLibre + react-map-gl | Installation, configuration Next.js, composant `MapContainer.tsx` | Carte vide fonctionnelle |
| **1.2** Intégration terrain-rgb | Conversion SRTM 30m → tuiles terrain-rgb (via `gdal2tiles` ou MapTiler), source `raster-dem` dans MapLibre | Relief 3D visible du territoire |
| **1.3** Style cartographique Kisakata | Style MapLibre custom avec la palette V1/V3 (forêt nocturne, or ancestral, cuivre artisanal), labels en français + kisakata | Carte visuellement intégrée au site |
| **1.4** Caméra initiale | Centrage sur Kutu (2°30′–3°30′ S / 16°30′–19° E), limites de zoom, pitch 3D par défaut (60°) | Navigation contrainte au territoire |
| **1.5** Animation d'ouverture | Fly-through GSAP : vue satellite haute → descente vers le lac Mai-Ndombe → vue terrain | Première impression immersive |
| **1.6** Responsive & mobile | Touch controls, adaptation du pitch/bearing, panneau bottom-sheet mobile | Expérience tactile fluide |

**Dépendances techniques :**
- Installer : `maplibre-gl`, `react-map-gl`, `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/mapbox`
- Configurer le hosting des tuiles terrain-rgb (Supabase Storage ou CDN externe)
- Créer la route `/geographie` dans l'App Router

---

### Phase 2 — Réseau hydrographique vivant (Semaines 4–6)

**Objectif :** Animer les rivières et le lac Mai-Ndombe avec variations saisonnières.

| Tâche | Détail | Livrable |
|---|---|---|
| **2.1** GeoJSON des rivières | Tracer les 18+ rivières (Lebili, Lekobe, Molibampei, Lemomo, etc.) avec attributs (nom, longueur, navigabilité) | Fichier `rivers.geojson` complet |
| **2.2** Deck.gl PathLayer animé | Animation de flux sur les rivières (particules qui suivent le tracé), direction du courant | Rivières "vivantes" |
| **2.3** GeoJSON lac saisonnier | Deux polygones du lac Mai-Ndombe : saison sèche (~2 000 km²) et saison des pluies (~2 500 km²) | Fichiers wet/dry GeoJSON |
| **2.4** Slider saisonnier | Composant `SeasonSlider.tsx` : curseur qui interpole entre les deux états (morphing GeoJSON + couleur de l'eau) | Contrôle interactif des saisons |
| **2.5** Shader d'eau | GLSL shader sur Three.js pour le lac : reflets, ondulations, transparence variable selon la saison | Eau réaliste |
| **2.6** Info au clic sur rivière | Clic sur une rivière → panneau latéral avec : nom, nom kisakata, longueur, villages traversés, points de pêche, lien culturel | Panneau informatif contextuel |
| **2.7** Points de pêche & ports | Marqueurs sur les anciens ports (Nioki, Kilako) et zones de pêche avec icônes personnalisées | Couche historique maritime |

**Animation clé :** Le slider saisonnier interpole simultanément :
- La surface du lac (morph polygone)
- L'opacité/largeur des rivières (plus intenses en saison des pluies)
- La couleur de l'eau (plus sombre en crue)
- La végétation riveraine (plus dense en saison humide)

---

### Phase 3 — Couches écologiques & forestières (Semaines 7–9)

**Objectif :** Visualiser la forêt, la savane et l'évolution environnementale.

| Tâche | Détail | Livrable |
|---|---|---|
| **3.1** Données Global Forest Watch | Téléchargement des tuiles de couverture forestière 2000 vs 2024 pour la zone | Raster tiles processed |
| **3.2** Layer forêt toggle | Bascule visuelle entre forêt dense (nord) et savane (sud), avec dégradé de couleurs | Couche superposable |
| **3.3** Animation avant/après | Slider temporel : couverture forestière année par année (2000 → 2025), palette vert → brun | Visualisation de la déforestation |
| **3.4** Zones Ramsar | Polygone de la zone humide Tumba-Ngiri-Mai-Ndombe avec info popup | Couche conservation |
| **3.5** 3D canopée | React Three Fiber : instanced mesh d'arbres stylisés qui apparaissent/disparaissent selon la couverture | Effet visuel immersif |
| **3.6** Infos écologiques | Panneaux explicatifs : agriculture sur brûlis, sols, pluviométrie (>2 000 mm/an), projets REDD+ | Contenu éducatif contextuel |

---

### Phase 4 — Carte ethnographique & linguistique (Semaines 10–12)

**Objectif :** Cartographier les sous-tribus, dialectes et frontières ethniques.

| Tâche | Détail | Livrable |
|---|---|---|
| **4.1** Polygones sous-tribus | GeoJSON des zones : Bobai, Waria/Dia, Bayi, Nkundo, Ntomba + attributs culturels | `subtribes.geojson` |
| **4.2** Choropleth interactif | Deck.gl GeoJsonLayer avec couleurs distinctes par sous-tribu, hover avec nom + population estimée | Carte des sous-tribus |
| **4.3** Zones dialectales | Overlay des dialectes kisakata (waria, kebai, mokan, kengengei, kitere/kintuntulu) | `dialects.geojson` |
| **4.4** Lecteur audio dialectes | Composant `DialectPlayer.tsx` : cliquer sur une zone → écouter un exemple audio du dialecte local | Immersion sonore |
| **4.5** Frontières voisins | Polygones simplifiés des peuples voisins (Baboma, Basengele, Bayanzi, Nkundo-ipanga) avec labels | Contexte géo-ethnique |
| **4.6** Recherche par lignée | Champ de recherche "Ma famille vient de…" → zoom sur le bobla correspondant | Fonctionnalité identitaire |

---

### Phase 5 — Fonctionnalités communautaires (Semaines 13–16)

**Objectif :** Permettre à la communauté de contribuer à la carte vivante.

| Tâche | Détail | Livrable |
|---|---|---|
| **5.1** Migration Supabase | Créer les tables `map_annotations`, `map_comments`, `map_annotation_votes` + RLS | Schema en production |
| **5.2** CRUD annotations | Hook `useCommunityPins.ts` : créer, lire, modifier, supprimer des épingles | API communautaire |
| **5.3** Formulaire d'épingle | `PinCreator.tsx` : clic sur la carte → formulaire (titre, type, description, photo/vidéo) | Interface de contribution |
| **5.4** Upload média | `MediaUploader.tsx` : upload vers Supabase Storage, compression côté client, géolocalisation EXIF | Stockage média |
| **5.5** Détail d'épingle | `PinDetail.tsx` : vue enrichie avec galerie photo, vidéo player, infos de l'auteur | Consultation des contributions |
| **5.6** Commentaires Realtime | `CommentThread.tsx` : Supabase Realtime pour discussion en direct sur chaque point | Chat contextuel |
| **5.7** Système de votes | Like/upvote avec animation, compteur temps réel, trigger Postgres pour likes_count | Engagement communautaire |
| **5.8** Modération | Interface admin pour valider/rejeter les contributions, flag `is_verified` | Qualité du contenu |
| **5.9** Flux communautaire | `CommunityFeed.tsx` : sidebar avec les contributions récentes, filtrables par type | Découverte sociale |

---

### Phase 6 — Dimension historique & temporelle (Semaines 17–19)

**Objectif :** Ajouter la profondeur historique avec une timeline interactive.

| Tâche | Détail | Livrable |
|---|---|---|
| **6.1** Timeline slider | Curseur couvrant : pré-colonial → colonial → indépendance → province Mai-Ndombe (2015) → aujourd'hui | Navigation temporelle |
| **6.2** Villages historiques | Points des villages anciens, nécropoles ancestrales, sites des sociétés secrètes historiques | Couche archéologique |
| **6.3** Routes de pirogues | Tracés des routes commerciales fluviales historiques avec animation de parcours | Patrimoine maritime |
| **6.4** Évolution administrative | Polygones des frontières administratives à travers les époques (ex-Bandundu → Mai-Ndombe) | Contexte politique |
| **6.5** Défis contemporains | Couches thématiques : déforestation active, production de charbon, zones d'urbanisation, routes vers Kinshasa/Inongo/Bandundu | Enjeux actuels |

---

### Phase 7 — Polish, Performance & Sons (Semaines 20–22)

**Objectif :** Expérience premium, performante et sensorielle.

| Tâche | Détail | Livrable |
|---|---|---|
| **7.1** Sons d'ambiance | `AmbientSounds.tsx` : sons contextuels (eau/forêt/oiseaux) qui varient selon le zoom et la position | Immersion sonore |
| **7.2** Modèle pirogue 3D | GLB optimisé d'une pirogue traditionnelle, posée sur les rivières navigables | Élément 3D signature |
| **7.3** Performance mobile | Code splitting agressif, lazy loading des couches Deck.gl, LOD (Level of Detail) pour le terrain | LCP < 3s mobile |
| **7.4** Prefers-reduced-motion | Désactivation des animations lourdes (shaders, particules, fly-through) pour l'accessibilité | WCAG compliance |
| **7.5** SEO & metadata | Structured data GeoJSON-LD, meta tags dynamiques, alt text pour les visuels de carte | Référencement |
| **7.6** Tutoriel interactif | Overlay de première visite : guide les gestes (zoom, rotation, clic) avec animation | Onboarding utilisateur |
| **7.7** Mode hors-ligne partiel | Service Worker pour cache des tuiles terrain et GeoJSON statiques | Résilience réseau |

---

## Dépendances npm à installer

```bash
# Moteur cartographique
npm install maplibre-gl react-map-gl

# Visualisation de données
npm install @deck.gl/core @deck.gl/layers @deck.gl/mapbox @deck.gl/geo-layers

# 3D avancé (éléments spéciaux)
npm install @react-three/fiber @react-three/drei three

# Audio
npm install howler
npm install -D @types/howler

# Utilitaires géospatiaux
npm install @turf/turf

# Compression média côté client
npm install browser-image-compression
```

---

## Estimation & priorisation

| Phase | Durée | Priorité | Dépendance |
|---|---|---|---|
| **Phase 1** — Fondations 3D | 3 semaines | Critique | Aucune |
| **Phase 2** — Hydrographie | 3 semaines | Critique | Phase 1 |
| **Phase 3** — Écologie | 3 semaines | Haute | Phase 1 |
| **Phase 4** — Ethnographie | 3 semaines | Haute | Phase 1 |
| **Phase 5** — Communauté | 4 semaines | Haute | Phase 1 + Supabase |
| **Phase 6** — Histoire | 3 semaines | Moyenne | Phase 2 + Phase 4 |
| **Phase 7** — Polish | 3 semaines | Moyenne | Toutes |

**Durée totale estimée : 22 semaines (~5.5 mois)**

Les phases 2, 3, 4 et 5 peuvent être parallélisées après la phase 1, réduisant la durée à **~14 semaines (~3.5 mois)** avec deux développeurs.

---

## Indicateurs de succès

- Temps de chargement initial de la carte < 3 secondes (LCP)
- 60 FPS sur desktop, 30 FPS minimum sur mobile
- Nombre de contributions communautaires par mois
- Temps moyen passé sur la section Géographie (objectif : >3 minutes)
- Score Lighthouse Performance > 85
- Accessibilité WCAG AA sur tous les panneaux informatifs

---

## Risques & mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Données géographiques imprécises pour la zone | Élevé | Croiser SRTM + Digital Earth Africa + validation communautaire |
| Performance mobile avec 3D + couches | Élevé | LOD progressif, lazy loading, mode "lite" sans 3D |
| Faible contribution communautaire au lancement | Moyen | Pré-remplir avec du contenu éditorial, gamification (badges) |
| Bundle size excessif (MapLibre + Deck.gl + Three.js) | Moyen | Code splitting par route, dynamic imports, tree shaking |
| Absence de données audio des dialectes | Moyen | Partenariat avec locuteurs natifs, enregistrement participatif |

---

*Ce document est vivant. Il sera mis à jour au fur et à mesure de l'avancement du projet.*

*Dernière mise à jour : 6 avril 2026*
