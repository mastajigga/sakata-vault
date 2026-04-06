# Roadmap Géographie 3D — Kisakata

> *"La terre ne ment pas. Elle garde la mémoire de ceux qui l'ont foulée."*

## Vision

Créer une expérience cartographique immersive du territoire Sakata, combinant données géographiques, patrimoine culturel et interactivité communautaire.

---

## Phase 1 — Corrections urgentes

### 1.1 Supprimer les 3 traits noirs
- **Problème** : Lignes de rivières mal rendues (GeoJSON mal formatés)
- **Solution** : Vérifier et corriger les fichiers `rivers.geojson`, `subtribes.geojson`, `villages.geojson`
- **Fichiers** : `public/geographie/data/*.geojson`

### 1.2 Repositionner le contrôle de luminosité
- **Problème** : Masqué par d'autres éléments en bas à gauche
- **Solution** : Déplacer en haut à droite, sous le LayerToggle
- **Fichiers** : `src/app/geographie/GeographieClient.tsx`

### 1.3 Faire disparaître le titre "Territoire de Kutu"
- **Problème** : Reste affiché en permanence après le flythrough
- **Solution** : Ajouter un état `showTitle` qui passe à `false` après le flythrough
- **Fichiers** : `src/app/geographie/components/CinematicFlythrough.tsx`, `GeographieClient.tsx`

### 1.4 Augmenter la luminosité par défaut
- **Problème** : Carte encore trop sombre
- **Solution** : Passer le default brightness de 40% à 75%
- **Fichiers** : `src/app/geographie/GeographieClient.tsx`

---

## Phase 2 — Nouvelles fonctionnalités cartographiques

### 2.1 Couche des 7 chefferies
- **Données** : Polygones avec centres administratifs
  - Mabie (Ndwakombe)
  - Mbamushie (Mongobele)
  - Mbantin (Kempa)
  - Lemvia-Nord (Mbaizakwi)
  - Batere (Nsobie)
  - Lemvia-Sud (Ikoko)
  - Nduele (Nselekoko)
- **Fichiers** : `public/geographie/data/chiefdoms.geojson`, `src/app/geographie/components/layers/ChiefdomsLayer.tsx`

### 2.2 Couche des clans
- **Données** : 3 strata sociaux
  - Badju (haut rang)
  - Bambe (propriétaires terriens)
  - Nsane (commun)
- **Fichiers** : `public/geographie/data/clans.geojson`, `src/app/geographie/components/layers/ClansLayer.tsx`

### 2.3 Couche des dialectes
- **Données** : 6 zones dialectales
  - waria, kebai, mokan, kengengei, kitere, kintuntulu
- **Fichiers** : `public/geographie/data/dialects.geojson`, `src/app/geographie/components/layers/DialectsLayer.tsx`

### 2.4 Couche des ethnies voisines
- **Données** : Peuples limitrophes
  - Nord : Boma, Sengele, Ntomba, Nkundo-Mbelo, Nkundo-Mbindjankama
  - Est : Nkundo-Ipanga
  - Sud : Yanzi
- **Fichiers** : `public/geographie/data/neighbors.geojson`

### 2.5 Route migratoire animée
- **Données** : Parcours historique
  - Cameroun/Nigeria → RCA → Congo-Brazzaville → Bolobo → Mushie → Kutu
- **Fichiers** : `public/geographie/data/migration-route.geojson`, `src/app/geographie/components/layers/MigrationLayer.tsx`

### 2.6 Sites sacrés
- **Données** : Lieux de mémoire
  - Baobab de Biboko (île entre Kasai et Mfimi)
  - Arbres à palabres (nshima)
  - Sites de rites Ngongo
- **Fichiers** : `public/geographie/data/sacred-sites.geojson`

### 2.7 Légende interactive
- **Fonctionnalité** : Panneau de légende expliquant chaque couche
- **Fichiers** : `src/app/geographie/components/panels/LegendPanel.tsx`

### 2.8 Panneau "Info Territoire"
- **Données** : Statistiques clés
  - Superficie : ~18 000 km²
  - Population : ~300 000 Sakata
  - 7 chefferies, 50+ villages
  - Lac Mai-Ndombe : 120km × 50km
- **Fichiers** : `src/app/geographie/components/panels/TerritoryInfo.tsx`

---

## Phase 3 — Enrichissement contenu

### 3.1 Timeline historique
- **Périodes** :
  - Migration (IXe-Xe siècle)
  - Exploration (1882-1888)
  - Colonial (1885-1960)
  - Indépendance (1960-présent)
- **Fichiers** : `src/app/geographie/components/Timeline.tsx`

### 3.2 Profils des chefferies
- **Données** : Par chefferie
  - Nom du chef traditionnel
  - Population estimée
  - Particularités culturelles
  - Villages principaux
- **Fichiers** : `src/data/chiefdoms.ts`

### 3.3 Galerie multimédia
- **Contenu** : Photos, vidéos, enregistrements audio
  - Villages et rivières
  - Cérémonies traditionnelles
  - Extraits des 6 dialectes
- **Fichiers** : `public/media/geographie/`, `src/app/geographie/components/Gallery.tsx`

### 3.4 Page d'aide "Comment utiliser la carte"
- **Contenu** :
  - Navigation (zoom, rotation, inclinaison)
  - Couches disponibles
  - Recherche de lieux
  - Contrôle de luminosité
  - Saisons (sec/pluies)
  - Contribution communautaire
- **Fichiers** : `src/app/geographie/aide/page.tsx`

---

## Phase 4 — Optimisation et performance

### 4.1 Tuiles vectorielles
- Remplacer les tuiles raster OSM par des tuiles vectorielles MapTiler
- Meilleure performance et personnalisation

### 4.2 Données GeoJSON optimisées
- Simplification des géométries
- Chargement progressif par niveau de zoom

### 4.3 Mode hors-ligne
- Cache des données GeoJSON en localStorage
- Fonctionnalité basique sans connexion

---

## Données de référence

### Coordonnées du territoire
- **Centre** : 17.75°E, -2.95°S
- **Bornes** : 16.5°E à 19.0°E, -3.5°S à -2.5°S
- **Forme** : Triangle isocèle (225km × 80km)

### Hydrographie
- **Rivières** : Mfimi (nord), Lukenie (nord-est), Kasai (sud), Lukolela (est)
- **Lac** : Mai-Ndombe (120km × 50km)

### Démographie
- **Population** : ~300 000 Sakata (estimation 2016)
- **Densité** : ~5,16 hab/km²
- **Langues** : Kisakata (6 dialectes), Lingala, Français

---

## Sources

- Munsi, R.V. (2016). *The Sakata Society in the Congo*. Anthropological Institute Vol.3
- Nkiere, E. (1984). *Les Sakata du Zaïre*
- Van Everbroeck, N. (1952). *Religie en magie onder de Basakata*
- Vansina, J. (1966). *Kingdoms of the Savanna*
- Données OpenStreetMap, SRTM