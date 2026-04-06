"use client";

// @ts-ignore - react-map-gl/maplibre is the correct import for MapLibre
import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LineLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface HydrographyLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  seasonProgress: number;
}

/**
 * Couche hydrographique animée — rivières avec effet de flux saisonnier.
 */
export default function HydrographyLayer({
  data,
  seasonProgress,
}: HydrographyLayerProps) {
  const sourceId = "rivers-source";

  // Couleur de l'eau qui s'intensifie en saison des pluies
  const waterColor = useMemo(() => {
    const r = Math.round(12 + seasonProgress * 4);
    const g = Math.round(41 + seasonProgress * 10);
    const b = Math.round(32 + seasonProgress * 8);
    return `rgb(${r}, ${g}, ${b})`;
  }, [seasonProgress]);

  // Largeur des rivières selon la saison
  const riverWidth = 1.5 + seasonProgress * 1.5;

  // Animation dasharray selon la saison
  const dashGap = 8 - seasonProgress * 3;
  const dashLength = 4 + seasonProgress * 4;

  const lineLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-line",
      type: "line",
      source: sourceId,
      paint: {
        "line-color": waterColor,
        "line-width": riverWidth,
        "line-opacity": 0.85,
        "line-cap": "round",
        "line-join": "round",
      },
    }),
    [waterColor, riverWidth]
  );

  const animatedLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-animated",
      type: "line",
      source: sourceId,
      paint: {
        "line-color": KISAKATA_COLORS.orAncestral,
        "line-width": riverWidth * 0.6,
        "line-opacity": 0.3 + seasonProgress * 0.3,
        "line-dasharray": [dashLength, dashGap],
        "line-cap": "round",
      },
    }),
    [riverWidth, seasonProgress, dashLength, dashGap]
  );

  return (
    <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
      <Layer {...lineLayer} />
      <Layer {...animatedLayer} />
    </Source>
  );
}