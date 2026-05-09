"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down" | null;

/**
 * Tracks vertical scroll direction with a small dead-zone to avoid jitter.
 * Returns "down" while scrolling down past `threshold`, "up" otherwise.
 * Returns null while at the top of the page (FAB stays visible).
 */
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < threshold) {
        ticking = false;
        return;
      }
      if (y < 80) {
        setDirection(null);
      } else if (delta > 0) {
        setDirection("down");
      } else {
        setDirection("up");
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
