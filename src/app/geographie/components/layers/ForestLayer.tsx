"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ForestLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

export default function ForestLayer({ data }: ForestLayerProps) {
  const sourceId = "forest-source";

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

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "forest-label",
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
        "text-color": KISAKATA_COLORS.brumMatinale,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 1.5,
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