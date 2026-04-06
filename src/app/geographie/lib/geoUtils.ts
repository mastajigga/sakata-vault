/**
 * Utilitaires géospatiaux pour la section Géographie.
 * Fonctions pures, testables, sans dépendance DOM.
 */

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export interface GeoBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

/**
 * Calcule la distance en km entre deux points (formule de Haversine).
 */
export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Vérifie si un point est dans les limites du territoire.
 */
export function isPointInBounds(point: GeoPoint, bounds: GeoBounds): boolean {
  return (
    point.longitude >= bounds.west &&
    point.longitude <= bounds.east &&
    point.latitude >= bounds.south &&
    point.latitude <= bounds.north
  );
}

/**
 * Interpole entre deux valeurs (pour animations saisonnières).
 * t = 0 → saison sèche, t = 1 → saison des pluies
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Interpole une couleur hex entre deux valeurs.
 */
export function lerpColor(colorA: string, colorB: string, t: number): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  if (!a || !b) return colorA;

  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));

  return `rgb(${r}, ${g}, ${bl})`;
}

/**
 * Interpole entre deux polygones GeoJSON (même nombre de points).
 * Utilisé pour le morphing saisonnier du lac.
 */
export function interpolatePolygon(
  dryCoords: number[][],
  wetCoords: number[][],
  t: number
): number[][] {
  const len = Math.min(dryCoords.length, wetCoords.length);
  return Array.from({ length: len }, (_, i) => [
    lerp(dryCoords[i][0], wetCoords[i][0], t),
    lerp(dryCoords[i][1], wetCoords[i][1], t),
  ]);
}

/**
 * Génère des points le long d'un LineString pour simuler des particules de flux.
 * speed: facteur de vitesse (1 = normal)
 */
export function generateFlowParticles(
  lineCoords: number[][],
  count: number,
  offset: number
): number[][] {
  const particles: number[][] = [];
  const totalSegments = lineCoords.length - 1;

  for (let i = 0; i < count; i++) {
    const position = ((i / count) + offset) % 1;
    const segIndex = Math.floor(position * totalSegments);
    const segT = (position * totalSegments) - segIndex;

    if (segIndex < totalSegments) {
      const start = lineCoords[segIndex];
      const end = lineCoords[segIndex + 1];
      particles.push([
        lerp(start[0], end[0], segT),
        lerp(start[1], end[1], segT),
      ]);
    }
  }

  return particles;
}

/**
 * Calcule le centre géométrique d'un ensemble de points.
 */
export function centroid(points: GeoPoint[]): GeoPoint {
  if (points.length === 0) return { longitude: 0, latitude: 0 };

  const sum = points.reduce(
    (acc, p) => ({
      longitude: acc.longitude + p.longitude,
      latitude: acc.latitude + p.latitude,
    }),
    { longitude: 0, latitude: 0 }
  );

  return {
    longitude: sum.longitude / points.length,
    latitude: sum.latitude / points.length,
  };
}

/**
 * Formate des coordonnées en notation DMS (degrés, minutes, secondes).
 */
export function toDMS(decimal: number, isLatitude: boolean): string {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFull = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = Math.round((minutesFull - minutes) * 60);

  const direction = isLatitude
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';

  return `${degrees}°${minutes}′${seconds}″ ${direction}`;
}

// --- Helpers privés ---

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
