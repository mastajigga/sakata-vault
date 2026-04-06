"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook pour l'animation saisonnière.
 * seasonProgress: 0 = saison sèche, 1 = saison des pluies.
 * Peut être contrôlé manuellement (slider) ou auto-animé (cycle).
 */
export function useSeasonAnimation(cycleDurationMs: number = 12000) {
  const [seasonProgress, setSeasonProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Cycle sinusoïdal : 0 → 1 → 0 → 1...
      const progress = (Math.sin((elapsed / cycleDurationMs) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      setSeasonProgress(progress);

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [cycleDurationMs]
  );

  const toggleAnimation = useCallback(() => {
    setIsAnimating((prev) => {
      if (prev) {
        // Arrêter
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return false;
      } else {
        // Démarrer
        startTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(animate);
        return true;
      }
    });
  }, [animate]);

  // Cleanup à la destruction
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    /** 0 = saison sèche, 1 = saison des pluies */
    seasonProgress,
    /** Contrôle manuel du curseur */
    setSeasonProgress,
    /** Animation cyclique en cours */
    isAnimating,
    /** Démarrer/arrêter l'animation automatique */
    toggleAnimation,
  };
}
