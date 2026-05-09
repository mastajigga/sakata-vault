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
 * RIGHT-side FAB: arc opens upper-LEFT (180° → 270°).
 * LEFT-side FAB:  arc opens upper-RIGHT (mirrored, 360° → 270°).
 * Last gap widened so topmost satellite's label has ≥ 32px breathing room.
 */
const ANGLE_SEQUENCES_RIGHT: Record<number, number[]> = {
  3: [180, 220, 260],
  4: [180, 205, 235, 268],
  5: [180, 198, 220, 240, 268],
  6: [180, 195, 215, 235, 252, 270],
};

const ANGLE_SEQUENCES_LEFT: Record<number, number[]> = {
  3: [360, 320, 280],
  4: [360, 335, 305, 272],
  5: [360, 342, 320, 300, 272],
  6: [360, 345, 325, 305, 288, 270],
};

export type ConstellationSide = "right" | "left";

export function computeSatellitePosition(
  index: number,
  total: number,
  radius: number,
  side: ConstellationSide = "right",
): SatellitePosition {
  const sequences = side === "left" ? ANGLE_SEQUENCES_LEFT : ANGLE_SEQUENCES_RIGHT;
  const sequence = sequences[total];
  let angle: number;
  if (sequence) {
    angle = sequence[index] ?? sequence[0];
  } else {
    const t = total <= 1 ? 0.5 : index / (total - 1);
    angle = side === "left" ? 360 - t * 90 : 180 + t * 90;
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
