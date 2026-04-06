"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface DialectsLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

const DIALECT_COLORS: Record<string, string> = {
  Waria: "#7B68AE",
  Kebai: "#5F9EA0",
  Mokan: "#C4A035",
  Kengengei: "#CD853F",
  Kitere: "#B87333",
  Kintuntulu: "#8B6914",
};

export default function DialectsLayer({ data }: DialectsLayerProps) {
  const sourceId = "dialects-source";

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

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "dialects-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular"],
        "text-size": 10,
        "text-anchor": "center",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#E8C670",
        "text-halo-color": "#0A1F15",
        "text-halo-width": 2,
      },
    }),
    []
  );

  return (
    <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
      <Layer {...fillLayer} />
      <Layer {...outlineLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
}