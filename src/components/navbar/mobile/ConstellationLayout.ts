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
 * Per-satellite radial offset to avoid label overlap on the upper part of the arc.
 * Odd-indexed satellites sit on an outer ring, creating a zig-zag.
 * Total ring delta tuned so each label has ≥ 32px vertical breathing room.
 */
const OFFSET_RING = 38;

export function computeSatellitePosition(
  index: number,
  total: number,
  radius: number,
): SatellitePosition {
  // Arc from 180° (left) to 270° (up), wrapping around the bottom-right anchor.
  const arcStart = 180;
  const arcEnd = 270;
  const span = arcEnd - arcStart;
  const t = total <= 1 ? 0.5 : index / (total - 1);
  const angle = arcStart + t * span;
  const rad = (angle * Math.PI) / 180;

  // Alternate radius: even indices on inner ring, odd on outer ring.
  // This breaks vertical alignment for adjacent satellites near the top of
  // the arc (where labels would otherwise overlap).
  const r = radius + (index % 2 === 1 ? OFFSET_RING : 0);

  const dx = Math.cos(rad) * r;
  const dy = Math.sin(rad) * r;
  return { dx, dy, angle };
}

export function computeRadius(viewportH: number, viewportW: number): number {
  // Inner ring radius. Outer ring sits +OFFSET_RING px further out.
  if (viewportH < 600) return 145;
  if (viewportW < 380) return 160;
  if (viewportW < 420) return 175;
  return 195;
}
