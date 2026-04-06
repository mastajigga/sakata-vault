"use client";

// @ts-ignore - react-map-gl/maplibre is the correct import for MapLibre
import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { CircleLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface VillagesLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

/**
 * Couche des villages, ports et sites historiques.
 */
export default function VillagesLayer({ data }: VillagesLayerProps) {
  const sourceId = "villages-source";

  const typeColors: Record<string, string> = {
    village: KISAKATA_COLORS.ivoireAncien,
    port: KISAKATA_COLORS.orAncestral,
    necropolis: "#9B8E80",
    historical: "#B87333",
    fishing: "#0C2920",
    default: KISAKATA_COLORS.ivoireAncien,
  };

  const circleLayer: CircleLayer = useMemo(
    () => ({
      id: "villages-circle",
      type: "circle",
      source: sourceId,
      paint: {
        "circle-color": [
          "match",
          ["get", "type"],
          ...Object.entries(typeColors).flatMap(([type, color]) =>
            type !== "default" ? [type, color] : []
          ),
          typeColors.default,
        ] as any,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6, 3,
          10, 5,
          14, 8,
        ],
        "circle-stroke-color": KISAKATA_COLORS.orAncestral,
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
      minzoom: 7,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, 9,
          12, 13,
        ],
        "text-anchor": "top",
        "text-offset": [0, 1.2],
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": KISAKATA_COLORS.sableDoux,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 1.5,
      },
    }),
    []
  );

  return (
    <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
      <Layer {...circleLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
}