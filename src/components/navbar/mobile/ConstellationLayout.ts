/**
 * Computes positions for satellites arranged in an arc around a FAB
 * anchored at the bottom-right of the viewport.
 *
 * The arc opens to the upper-left (from 180° to 270°) so satellites
 * fan out away from the FAB into the visible page area.
 */
export interface SatellitePosition {
  /** translation X relative to the FAB centre (px) */
  dx: number;
  /** translation Y relative to the FAB centre (px) */
  dy: number;
  /** angle (degrees) used for tangent label placement */
  angle: number;
}

export function computeSatellitePosition(
  index: number,
  total: number,
  radius: number,
): SatellitePosition {
  // Arc from 180° (left) to 270° (up). Wrapping around the bottom-right anchor.
  const arcStart = 180;
  const arcEnd = 270;
  const span = arcEnd - arcStart;
  const t = total <= 1 ? 0.5 : index / (total - 1);
  const angle = arcStart + t * span;
  const rad = (angle * Math.PI) / 180;
  // Standard polar → cartesian, but DOM y-axis grows downward, so negate.
  const dx = Math.cos(rad) * radius;
  const dy = Math.sin(rad) * radius;
  return { dx, dy, angle };
}

export function computeRadius(viewportH: number, viewportW: number): number {
  // Generous spacing so each satellite (≈ 48px orb + label pill) has clear separation.
  if (viewportH < 600) return 150;
  if (viewportW < 380) return 165;
  if (viewportW < 420) return 180;
  return 200;
}
