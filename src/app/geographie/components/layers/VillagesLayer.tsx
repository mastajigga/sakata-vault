"use client";

// @ts-ignore - react-map-gl/maplibre is the correct import for MapLibre
import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type { CircleLayer, SymbolLayer } from "react-map-gl";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface VillagesLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

/**
 * Couche des villages, ports et sites historiques.
 */
export default function VillagesLayer({ data }: VillagesLayerProps) {
  const sourceId = "villages-source";

  // Couche d'aura (halo) pour l'effet "The Hub"
  const haloLayer: CircleLayer = useMemo(
    () => ({
      id: "villages-halo",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": KISAKATA_COLORS.orAncestral,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6, ["*", ["get", "importance"], 1.5],
          12, ["*", ["get", "importance"], 3],
        ],
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6, 0.2,
          10, 0.4,
          14, 0.1,
        ],
        "circle-blur": 1.5,
      },
    }),
    []
  );

  const circleLayer: CircleLayer = useMemo(
    () => ({
      id: "villages-circle",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": [
          "match",
          ["get", "type"],
          "city", "#FFFFFF",
          "town", KISAKATA_COLORS.orAncestral,
          "village", KISAKATA_COLORS.ivoireAncien,
          KISAKATA_COLORS.ivoireAncien,
        ] as any,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6, ["match", ["get", "type"], "city", 4, "town", 3, 2],
          12, ["match", ["get", "type"], "city", 8, "town", 6, 4],
        ],
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1,
        "circle-opacity": 0.9,
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "villages-label",
      type: "symbol",
      source: sourceId,
      minzoom: 8,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 10,
          12, 14,
        ],
        "text-anchor": "top",
        "text-offset": [0, 1.2],
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": KISAKATA_COLORS.ivoireAncien,
        "text-halo-color": "#000000",
        "text-halo-width": 2,
      },
    }),
    []
  );

  return (
    <Source id={sourceId} type="geojson" data={data}>
      <Layer {...haloLayer} />
      <Layer {...circleLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
}