"use client";

// @ts-ignore - react-map-gl/maplibre is the correct import for MapLibre
import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface SubtribesLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

/**
 * Couche des sous-tribus — polygones colorés avec labels.
 */
export default function SubtribesLayer({ data }: SubtribesLayerProps) {
  const sourceId = "subtribes-source";

  const tribeColors: Record<string, string> = {
    Bobai: "#C4A035",
    Waria: "#B87333",
    Bayi: "#0F2C24",
    Nkundo: "#2A3A20",
    Ntomba: "#1A3528",
    default: "#1A3528",
  };

  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "subtribes-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "name"],
          ...Object.entries(tribeColors).flatMap(([name, color]) =>
            name !== "default" ? [name, color] : []
          ),
          tribeColors.default,
        ] as any,
        "fill-opacity": 0.35,
      },
    }),
    []
  );

  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "subtribes-outline",
      type: "line",
      source: sourceId,
      paint: {
        "line-color": KISAKATA_COLORS.orAncestral,
        "line-width": 1.5,
        "line-opacity": 0.6,
        "line-dasharray": [4, 2],
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "subtribes-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular"],
        "text-size": 12,
        "text-anchor": "center",
        "text-allow-overlap": false,
        "text-ignore-placement": false,
      },
      paint: {
        "text-color": KISAKATA_COLORS.ivoireAncien,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
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