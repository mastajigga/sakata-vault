/**
 * Configuration du terrain 3D pour la section Géographie.
 * Sources d'élévation, paramètres de rendu, niveaux de détail.
 */

export interface TerrainSource {
  url: string;
  tileSize: number;
  encoding: 'terrarium' | 'mapbox';
  maxzoom: number;
  attribution: string;
}

/**
 * Source d'élévation par défaut : tuiles Terrarium (open-source).
 * Résolution : ~30m à l'équateur (suffisant pour la zone Mai-Ndombe).
 */
export const DEFAULT_TERRAIN_SOURCE: TerrainSource = {
  url: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  tileSize: 256,
  encoding: 'terrarium',
  maxzoom: 14,
  attribution: '© AWS Terrain Tiles / SRTM',
};

/**
 * Source MapTiler (meilleure qualité, nécessite clé API).
 */
export function getMapTilerTerrainSource(apiKey: string): TerrainSource {
  return {
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${apiKey}`,
    tileSize: 256,
    encoding: 'mapbox',
    maxzoom: 12,
    attribution: '© MapTiler',
  };
}

/**
 * Paramètres de terrain selon le niveau de détail.
 */
export const TERRAIN_PRESETS = {
  /** Vue globale du territoire (zoom 5-8) */
  overview: {
    exaggeration: 2.0,
    hillshadeIntensity: 0.4,
  },
  /** Vue régionale (zoom 8-12) */
  regional: {
    exaggeration: 1.5,
    hillshadeIntensity: 0.5,
  },
  /** Vue locale / village (zoom 12+) */
  local: {
    exaggeration: 1.2,
    hillshadeIntensity: 0.6,
  },
} as const;

/**
 * Retourne le preset de terrain approprié selon le zoom.
 */
export function getTerrainPreset(zoom: number) {
  if (zoom < 8) return TERRAIN_PRESETS.overview;
  if (zoom < 12) return TERRAIN_PRESETS.regional;
  return TERRAIN_PRESETS.local;
}

/**
 * Points d'intérêt géographiques clés pour le fly-through.
 */
export const KEY_LOCATIONS = {
  lacMaiNdombe: {
    name: 'Lac Mai-Ndombe',
    nameKisakata: 'Iyâ ya Mai-Ndombe',
    longitude: 18.35,
    latitude: -2.0,
    zoom: 9,
    pitch: 60,
    bearing: 0,
    description: 'Un des plus grands lacs à eaux noires du bassin du Congo (~2 300 km²)',
  },
  kutuCentre: {
    name: 'Territoire de Kutu',
    nameKisakata: 'Kutu',
    longitude: 17.75,
    latitude: -2.95,
    zoom: 9,
    pitch: 55,
    bearing: -15,
    description: 'Cœur du territoire traditionnel Basakata (~18 000 km²)',
  },
  nioki: {
    name: 'Nioki',
    nameKisakata: 'Nioki',
    longitude: 17.68,
    latitude: -2.72,
    zoom: 12,
    pitch: 45,
    bearing: 20,
    description: 'Port historique sur la rivière Kasaï',
  },
  kilako: {
    name: 'Kilako',
    nameKisakata: 'Kilako',
    longitude: 17.90,
    latitude: -2.85,
    zoom: 12,
    pitch: 45,
    bearing: -10,
    description: 'Ancien port fluvial',
  },
  inongo: {
    name: 'Inongo',
    nameKisakata: 'Inongo',
    longitude: 18.28,
    latitude: -1.95,
    zoom: 11,
    pitch: 50,
    bearing: 30,
    description: 'Chef-lieu de la province Mai-Ndombe, sur les rives du lac',
  },
} as const;

/**
 * Séquence du fly-through cinématique d'ouverture.
 * Chaque étape définit une position de caméra et une durée de transition.
 */
export const FLYTHROUGH_SEQUENCE = [
  {
    // Vue satellite haute
    ...KEY_LOCATIONS.lacMaiNdombe,
    zoom: 6,
    pitch: 0,
    bearing: 0,
    duration: 0, // Position initiale, pas de transition
  },
  {
    // Descente vers le lac
    ...KEY_LOCATIONS.lacMaiNdombe,
    zoom: 9,
    pitch: 45,
    bearing: -20,
    duration: 3000,
  },
  {
    // Pan vers Kutu
    ...KEY_LOCATIONS.kutuCentre,
    zoom: 9,
    pitch: 55,
    bearing: -15,
    duration: 4000,
  },
  {
    // Vue finale immersive
    ...KEY_LOCATIONS.kutuCentre,
    zoom: 10,
    pitch: 60,
    bearing: 10,
    duration: 3000,
  },
] as const;
