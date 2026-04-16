"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type { FillLayer, LineLayer, SymbolLayer, CircleLayer } from "react-map-gl";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface SubtribesLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

export default function SubtribesLayer({ data, pointsData }: SubtribesLayerProps) {
  const sourceId = "subtribes-source";
  const pointsSourceId = "subtribes-points-source";

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

  // Icône sous-tribu — cercle avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "subtribes-icon",
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
          "Bobai", tribeColors.Bobai,
          "Waria", tribeColors.Waria,
          "Bayi", tribeColors.Bayi,
          "Nkundo", tribeColors.Nkundo,
          "Ntomba", tribeColors.Ntomba,
          tribeColors.default,
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
      id: "subtribes-icon-glow",
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
          "Bobai", tribeColors.Bobai,
          "Waria", tribeColors.Waria,
          "Bayi", tribeColors.Bayi,
          "Nkundo", tribeColors.Nkundo,
          "Ntomba", tribeColors.Ntomba,
          tribeColors.default,
        ],
        "circle-opacity": 0.2,
        "circle-blur": 1,
      },
    }),
    []
  );

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "subtribes-label",
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
        "text-color": KISAKATA_COLORS.ivoireAncien,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 3,
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
          <Layer {...iconGlowLayer} />
          <Layer {...iconLayer} />
          <Layer {...labelLayer} />
        </Source>
      )}
    </>
  );
}