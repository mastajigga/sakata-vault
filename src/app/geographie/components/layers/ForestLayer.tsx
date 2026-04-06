"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, CircleLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ForestLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

export default function ForestLayer({ data, pointsData }: ForestLayerProps) {
  const sourceId = "forest-source";
  const pointsSourceId = "forest-points-source";

  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "forest-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "type"],
          "forest", KISAKATA_COLORS.forest,
          "savanna", KISAKATA_COLORS.savanna,
          KISAKATA_COLORS.forest,
        ],
        "fill-opacity": [
          "match",
          ["get", "type"],
          "forest", 0.45,
          "savanna", 0.3,
          0.4,
        ],
      },
    }),
    []
  );

  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "forest-outline",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": [
          "match",
          ["get", "type"],
          "forest", "#1A4A2E",
          "savanna", "#6B8E23",
          "#1A4A2E",
        ],
        "line-width": 1,
        "line-opacity": 0.4,
      },
    }),
    []
  );

  // Icône forêt/savane — cercle avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "forest-icon",
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
        "circle-color": [
          "match",
          ["get", "type"],
          "forest", KISAKATA_COLORS.forest,
          "savanna", KISAKATA_COLORS.savanna,
          KISAKATA_COLORS.forest,
        ],
        "circle-stroke-color": "#F0EDE5",
        "circle-stroke-width": 2,
        "circle-opacity": 0.95,
      },
    }),
    []
  );

  const iconGlowLayer: CircleLayer = useMemo(
    () => ({
      id: "forest-icon-glow",
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
        "circle-color": [
          "match",
          ["get", "type"],
          "forest", KISAKATA_COLORS.forest,
          "savanna", KISAKATA_COLORS.savanna,
          KISAKATA_COLORS.forest,
        ],
        "circle-opacity": 0.2,
        "circle-blur": 1,
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "forest-label",
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
        "text-color": KISAKATA_COLORS.brumMatinale,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 3,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  return (
    <>
      <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
        <Layer {...fillLayer} />
        <Layer {...outlineLayer} />
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