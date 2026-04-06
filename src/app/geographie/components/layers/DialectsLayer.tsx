"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, CircleLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface DialectsLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

const DIALECT_COLORS: Record<string, string> = {
  Waria: "#7B68AE",
  Kebai: "#5F9EA0",
  Mokan: "#C4A035",
  Kengengei: "#CD853F",
  Kitere: "#B87333",
  Kintuntulu: "#8B6914",
};

export default function DialectsLayer({ data, pointsData }: DialectsLayerProps) {
  const sourceId = "dialects-source";
  const pointsSourceId = "dialects-points-source";

  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "dialects-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "name"],
          ...Object.entries(DIALECT_COLORS).flatMap(([name, color]) => [name, color]),
          "#666666",
        ] as any,
        "fill-opacity": 0.3,
      },
    }),
    []
  );

  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "dialects-outline",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": KISAKATA_COLORS.amberLight,
        "line-width": 1,
        "line-opacity": 0.5,
        "line-dasharray": [3, 2],
      },
    }),
    []
  );

  // Icône dialecte — cercle avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "dialects-icon",
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
          ["get", "name"],
          "Waria", DIALECT_COLORS.Waria,
          "Kebai", DIALECT_COLORS.Kebai,
          "Mokan", DIALECT_COLORS.Mokan,
          "Kengengei", DIALECT_COLORS.Kengengei,
          "Kitere", DIALECT_COLORS.Kitere,
          "Kintuntulu", DIALECT_COLORS.Kintuntulu,
          "#666666",
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
      id: "dialects-icon-glow",
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
          ["get", "name"],
          "Waria", DIALECT_COLORS.Waria,
          "Kebai", DIALECT_COLORS.Kebai,
          "Mokan", DIALECT_COLORS.Mokan,
          "Kengengei", DIALECT_COLORS.Kengengei,
          "Kitere", DIALECT_COLORS.Kitere,
          "Kintuntulu", DIALECT_COLORS.Kintuntulu,
          "#666666",
        ],
        "circle-opacity": 0.2,
        "circle-blur": 1,
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "dialects-label",
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
        "text-color": "#E8C670",
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