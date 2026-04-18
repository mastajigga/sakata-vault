"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type { FillLayer, LineLayer, SymbolLayer } from "react-map-gl";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ProvincesLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

export default function ProvincesLayer({ data, pointsData }: ProvincesLayerProps) {
  const sourceId = "provinces-source";
  const pointsSourceId = "provinces-points-source";

  // Configuration des calques de remplissage
  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "provinces-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "shapeName"],
          "Mai-Ndombe", KISAKATA_COLORS.orAncestral, // Highlight Mai-Ndombe
          KISAKATA_COLORS.ivoireAncien, // Default color for others
        ] as any,
        "fill-opacity": [
          "match",
          ["get", "shapeName"],
          "Mai-Ndombe", 0.25,
          0.1,
        ] as any,
      },
    }),
    []
  );

  // Bordures des provinces
  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "provinces-outline",
      type: "line",
      source: sourceId,
      paint: {
        "line-color": [
          "match",
          ["get", "shapeName"],
          "Mai-Ndombe", KISAKATA_COLORS.orAncestral,
          KISAKATA_COLORS.ivoireAncien,
        ] as any,
        "line-width": [
          "match",
          ["get", "shapeName"],
          "Mai-Ndombe", 2.5,
          1,
        ] as any,
        "line-opacity": 0.5,
      },
    }),
    []
  );

  // Labels des provinces (points générés par script)
  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "provinces-label",
      type: "symbol",
      source: pointsSourceId,
      layout: {
        "text-field": ["get", "shapeName"],
        "text-font": ["Open Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 10,
          8, 14,
          10, 18,
        ],
        "text-anchor": "center",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": [
          "match",
          ["get", "shapeName"],
          "Mai-Ndombe", KISAKATA_COLORS.orAncestral,
          KISAKATA_COLORS.ivoireAncien,
        ] as any,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 2,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  return (
    <>
      <Source id={sourceId} type="geojson" data={data}>
        <Layer {...fillLayer} />
        <Layer {...outlineLayer} />
      </Source>
      {pointsData && (
        <Source id={pointsSourceId} type="geojson" data={pointsData}>
          <Layer {...labelLayer} />
        </Source>
      )}
    </>
  );
}
