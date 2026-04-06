"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { LineLayer, SymbolLayer, CircleLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface HydrographyLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  seasonProgress: number;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

export default function HydrographyLayer({
  data,
  seasonProgress,
  pointsData,
}: HydrographyLayerProps) {
  const sourceId = "rivers-source";
  const pointsSourceId = "rivers-points-source";

  const waterColor = useMemo(() => {
    const r = Math.round(12 + seasonProgress * 4);
    const g = Math.round(41 + seasonProgress * 10);
    const b = Math.round(32 + seasonProgress * 8);
    return `rgb(${r}, ${g}, ${b})`;
  }, [seasonProgress]);

  const riverWidth = 2.5 + seasonProgress * 2;
  const dashGap = 6 - seasonProgress * 2;
  const dashLength = 6 + seasonProgress * 5;

  const lineLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-line",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": waterColor,
        "line-width": riverWidth,
        "line-opacity": 0.9,
      },
    }),
    [waterColor, riverWidth]
  );

  const animatedLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-animated",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-color": KISAKATA_COLORS.orAncestral,
        "line-width": riverWidth * 0.5,
        "line-opacity": 0.4 + seasonProgress * 0.3,
        "line-dasharray": [dashLength, dashGap],
      },
    }),
    [riverWidth, seasonProgress, dashLength, dashGap]
  );

  // Icône rivière — cercle bleu avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "rivers-icon",
      type: "circle",
      source: pointsSourceId,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 5,
          6, 7,
          8, 9,
          10, 12,
          12, 16,
          14, 22,
        ],
        "circle-color": "#4A90D9",
        "circle-stroke-color": "#F0EDE5",
        "circle-stroke-width": 2,
        "circle-opacity": 0.95,
      },
    }),
    []
  );

  const iconGlowLayer: CircleLayer = useMemo(
    () => ({
      id: "rivers-icon-glow",
      type: "circle",
      source: pointsSourceId,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 10,
          6, 14,
          8, 18,
          10, 24,
          12, 32,
          14, 44,
        ],
        "circle-color": "#4A90D9",
        "circle-opacity": 0.2,
        "circle-blur": 1,
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "rivers-label",
      type: "symbol",
      source: pointsSourceId,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 9,
          6, 11,
          8, 14,
          10, 17,
          12, 22,
          14, 28,
        ],
        "text-anchor": "top",
        "text-offset": [0, 1.5],
        "text-allow-overlap": false,
        "text-padding": 2,
      },
      paint: {
        "text-color": "#7EB8DA",
        "text-halo-color": "#0A1F15",
        "text-halo-width": 3,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  return (
    <>
      <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
        <Layer {...lineLayer} />
        <Layer {...animatedLayer} />
      </Source>
      {pointsData && (
        <Source id={pointsSourceId} type="geojson" data={pointsData as unknown as GeoJSONSourceRaw["data"]}>
          <Layer {...iconGlowLayer} />
          <Layer {...iconLayer} />
          <Layer {...labelLayer} />
        </Source>
      )}
    </>
  );
}