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

/**
 * Hand-tuned angle sequences (in degrees) for small satellite counts.
 * The arc opens to the upper-left from the bottom-right FAB anchor.
 * Last gap is widened so the topmost satellite's label clears the one
 * just below it (≥ 32px vertical breathing room).
 */
const ANGLE_SEQUENCES: Record<number, number[]> = {
  3: [180, 220, 260],
  4: [180, 205, 235, 268],
  5: [180, 198, 220, 240, 268],
  6: [180, 195, 215, 235, 252, 270],
};

export function computeSatellitePosition(
  index: number,
  total: number,
  radius: number,
): SatellitePosition {
  const sequence = ANGLE_SEQUENCES[total];
  let angle: number;
  if (sequence) {
    angle = sequence[index] ?? 180;
  } else {
    // Uniform fallback for unexpected counts.
    const t = total <= 1 ? 0.5 : index / (total - 1);
    angle = 180 + t * 90;
  }
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * radius;
  const dy = Math.sin(rad) * radius;
  return { dx, dy, angle };
}

export function computeRadius(viewportH: number, viewportW: number): number {
  if (viewportH < 600) return 155;
  if (viewportW < 380) return 175;
  if (viewportW < 420) return 195;
  return 215;
}
