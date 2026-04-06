"use client";

import { useCallback, useRef } from "react";
// @ts-ignore
import type { MapRef } from "react-map-gl/maplibre";

interface CameraOptions {
  longitude: number;
  latitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  duration?: number;
}

/**
 * Hook pour contrôler programmatiquement la caméra de la carte.
 */
export function useMapCamera() {
  const animationRef = useRef<number | null>(null);

  const flyTo = useCallback((map: MapRef | null, options: CameraOptions) => {
    if (!map) return;

    map.flyTo({
      center: [options.longitude, options.latitude],
      zoom: options.zoom ?? map.getZoom(),
      pitch: options.pitch ?? map.getPitch(),
      bearing: options.bearing ?? map.getBearing(),
      duration: options.duration ?? 2000,
      essential: true,
    });
  }, []);

  const easeTo = useCallback((map: MapRef | null, options: CameraOptions) => {
    if (!map) return;

    map.easeTo({
      center: [options.longitude, options.latitude],
      zoom: options.zoom ?? map.getZoom(),
      pitch: options.pitch ?? map.getPitch(),
      bearing: options.bearing ?? map.getBearing(),
      duration: options.duration ?? 1500,
    });
  }, []);

  const jumpTo = useCallback((map: MapRef | null, options: CameraOptions) => {
    if (!map) return;

    map.jumpTo({
      center: [options.longitude, options.latitude],
      zoom: options.zoom,
      pitch: options.pitch,
      bearing: options.bearing,
    });
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  return {
    flyTo,
    easeTo,
    jumpTo,
    cancelAnimation,
  };
}