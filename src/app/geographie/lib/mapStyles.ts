// @ts-ignore
import type * as maplibregl from "maplibre-gl";

/**
 * MapLibre Style — Kisakata "Brume de la Rivière"
 * Style cartographique custom utilisant la palette ancestrale du projet.
 * Compatible MapLibre GL JS v5+
 */

export const KISAKATA_COLORS = {
  // Palette V1 "Brume de la Rivière"
  foretNocturne: '#0A1F15',
  eauSombre: '#0C2920',
  brumMatinale: '#D4DDD7',
  ivoireAncien: '#F0EDE5',
  orAncestral: '#C4A035',
  amberLight: '#E8C670',
  emeraldDeep: '#0F2C24',

  // Palette V3 "Terre & Ciel"
  cielNocturne: '#1B2838',
  terreProfonde: '#2A1810',
  cuivreArtisanal: '#B87333',
  sableDoux: '#E8DCC8',
  cendreChauffe: '#9B8E80',

  // Couches cartographiques
  water: '#0C2920',
  waterDeep: '#081E18',
  rivenDeep: '#051410', // Nouveau : lit de la rivière profond
  eauProfonde: '#062018', // Nouveau : bleu-vert profond du Kasaï
  waterLabel: '#C4A035',
  forest: '#0F2C24',
  savanna: '#2A3A20',
  land: '#0D2419',
  road: '#1A3528',
  roadMajor: '#B87333',
  building: '#163024',
  borderLine: '#C4A035',
  contourLine: 'rgba(212, 221, 215, 0.1)',
} as const;

/**
 * Coordonnées centrales du territoire Basakata (Kutu, Mai-Ndombe)
 */
export const TERRITORY_CENTER = {
  longitude: 17.75,
  latitude: -2.95,
} as const;

export const TERRITORY_BOUNDS = {
  west: 16.5,
  south: -3.5,
  east: 19.0,
  north: -2.5,
} as const;

export const DEFAULT_VIEW_STATE = {
  longitude: TERRITORY_CENTER.longitude,
  latitude: TERRITORY_CENTER.latitude,
  zoom: 8,
  pitch: 55,
  bearing: -15,
  maxZoom: 16,
  minZoom: 5,
};

/**
 * Style MapLibre basé sur des tuiles OSM libres,
 * re-coloré avec la palette Kisakata.
 * Utilise les tuiles vectorielles OpenFreeMap ou MapTiler (free tier).
 */
export const kisakataMapStyle: maplibregl.StyleSpecification = {
  version: 8,
  name: 'Kisakata Brume',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
    'terrain-dem': {
      type: 'raster-dem',
      // Tuiles d'élévation open-source (à remplacer par SRTM auto-hébergé en prod)
      tiles: [
        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      encoding: 'terrarium',
      maxzoom: 14,
    },
  },
  terrain: {
    source: 'terrain-dem',
    exaggeration: 1.8, // Légère exagération pour l'effet dramatique
  },
  sky: {
    'sky-color': KISAKATA_COLORS.cielNocturne,
    'sky-horizon-blend': 0.5,
    'horizon-color': KISAKATA_COLORS.emeraldDeep,
    'horizon-fog-blend': 0.8,
    'fog-color': KISAKATA_COLORS.foretNocturne,
    'fog-ground-blend': 0.9,
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': KISAKATA_COLORS.foretNocturne,
      },
    },
    {
      id: 'osm-base',
      type: 'raster',
      source: 'osm-tiles',
      paint: {
        'raster-opacity': 0.6,
        'raster-saturation': -0.5,
        'raster-brightness-max': 0.7,
        'raster-contrast': 0.2,
      },
    },
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

/**
 * Style alternatif avec tuiles vectorielles (nécessite MapTiler key)
 * À utiliser quand on a un token MapTiler
 */
export function createVectorStyle(mapTilerKey: string): maplibregl.StyleSpecification {
  return {
    version: 8,
    name: 'Kisakata Brume Vector',
    sources: {
      'openmaptiles': {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${mapTilerKey}`,
      },
      'terrain-dem': {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${mapTilerKey}`,
        tileSize: 256,
      },
    },
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.8,
    },
    sky: {
      'sky-color': KISAKATA_COLORS.cielNocturne,
      'sky-horizon-blend': 0.5,
      'horizon-color': KISAKATA_COLORS.emeraldDeep,
      'horizon-fog-blend': 0.8,
      'fog-color': KISAKATA_COLORS.foretNocturne,
      'fog-ground-blend': 0.9,
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': KISAKATA_COLORS.foretNocturne,
        },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': KISAKATA_COLORS.water,
          'fill-opacity': 0.9,
        },
      },
      {
        id: 'landcover-forest',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        filter: ['==', 'class', 'wood'],
        paint: {
          'fill-color': KISAKATA_COLORS.forest,
          'fill-opacity': 0.6,
        },
      },
      {
        id: 'landcover-grass',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        filter: ['==', 'class', 'grass'],
        paint: {
          'fill-color': KISAKATA_COLORS.savanna,
          'fill-opacity': 0.4,
        },
      },
      {
        id: 'road-minor',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'minor', 'service']],
        paint: {
          'line-color': KISAKATA_COLORS.road,
          'line-width': 1,
          'line-opacity': 0.4,
        },
      },
      {
        id: 'road-major',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['all', ['==', '$type', 'LineString'], ['in', 'class', 'primary', 'secondary', 'trunk']],
        paint: {
          'line-color': KISAKATA_COLORS.roadMajor,
          'line-width': 2,
          'line-opacity': 0.5,
        },
      },
      {
        id: 'boundary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        paint: {
          'line-color': KISAKATA_COLORS.borderLine,
          'line-width': 1.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.6,
        },
      },
      {
        id: 'place-label',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        layout: {
          'text-field': '{name}',
          'text-font': ['Open Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 12, 16],
          'text-anchor': 'center',
        },
        paint: {
          'text-color': KISAKATA_COLORS.sableDoux,
          'text-halo-color': KISAKATA_COLORS.foretNocturne,
          'text-halo-width': 1.5,
        },
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  };
}
