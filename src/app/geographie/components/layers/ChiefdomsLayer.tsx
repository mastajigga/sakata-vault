"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, CircleLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";

interface ChiefdomsLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point>;
}

const CHIEFDOM_COLORS = [
  "#C4A035", // Mabie - or ancestral
  "#B87333", // Mbamushie - cuivre
  "#8B6914", // Mbantin - bronze
  "#A0522D", // Lemvia-Nord - sienna
  "#CD853F", // Batere - peru
  "#D2691E", // Lemvia-Sud - chocolate
  "#DEB887", // Nduele - burlywood
];

export default function ChiefdomsLayer({ data, pointsData }: ChiefdomsLayerProps) {
  const sourceId = "chiefdoms-source";
  const pointsSourceId = "chiefdoms-points-source";

  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "chiefdoms-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "name"],
          "Mabie", CHIEFDOM_COLORS[0],
          "Mbamushie", CHIEFDOM_COLORS[1],
          "Mbantin", CHIEFDOM_COLORS[2],
          "Lemvia-Nord", CHIEFDOM_COLORS[3],
          "Batere", CHIEFDOM_COLORS[4],
          "Lemvia-Sud", CHIEFDOM_COLORS[5],
          "Nduele", CHIEFDOM_COLORS[6],
          "#666666",
        ],
        "fill-opacity": 0.25,
      },
    }),
    []
  );

  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "chiefdoms-outline",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": [
          "match",
          ["get", "name"],
          "Mabie", CHIEFDOM_COLORS[0],
          "Mbamushie", CHIEFDOM_COLORS[1],
          "Mbantin", CHIEFDOM_COLORS[2],
          "Lemvia-Nord", CHIEFDOM_COLORS[3],
          "Batere", CHIEFDOM_COLORS[4],
          "Lemvia-Sud", CHIEFDOM_COLORS[5],
          "Nduele", CHIEFDOM_COLORS[6],
          "#666666",
        ],
        "line-width": 1.5,
        "line-opacity": 0.6,
      },
    }),
    []
  );

  // Icône de chefferie — cercle avec glow, toujours visible comme Google Maps
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "chiefdoms-icon",
      type: "circle",
      source: pointsSourceId,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 6,
          6, 8,
          8, 10,
          10, 14,
          12, 18,
          14, 24,
        ],
        "circle-color": [
          "match",
          ["get", "name"],
          "Mabie", CHIEFDOM_COLORS[0],
          "Mbamushie", CHIEFDOM_COLORS[1],
          "Mbantin", CHIEFDOM_COLORS[2],
          "Lemvia-Nord", CHIEFDOM_COLORS[3],
          "Batere", CHIEFDOM_COLORS[4],
          "Lemvia-Sud", CHIEFDOM_COLORS[5],
          "Nduele", CHIEFDOM_COLORS[6],
          "#666666",
        ],
        "circle-stroke-color": "#F0EDE5",
        "circle-stroke-width": 2,
        "circle-opacity": 0.95,
      },
    }),
    []
  );

  // Glow autour de l'icône
  const iconGlowLayer: CircleLayer = useMemo(
    () => ({
      id: "chiefdoms-icon-glow",
      type: "circle",
      source: pointsSourceId,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 12,
          6, 16,
          8, 20,
          10, 28,
          12, 36,
          14, 48,
        ],
        "circle-color": [
          "match",
          ["get", "name"],
          "Mabie", CHIEFDOM_COLORS[0],
          "Mbamushie", CHIEFDOM_COLORS[1],
          "Mbantin", CHIEFDOM_COLORS[2],
          "Lemvia-Nord", CHIEFDOM_COLORS[3],
          "Batere", CHIEFDOM_COLORS[4],
          "Lemvia-Sud", CHIEFDOM_COLORS[5],
          "Nduele", CHIEFDOM_COLORS[6],
          "#666666",
        ],
        "circle-opacity": 0.2,
        "circle-blur": 1,
      },
    }),
    []
  );

  // Label avec offset pour ne pas chevaucher l'icône
  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "chiefdoms-label",
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
          8, 13,
          10, 16,
          12, 20,
          14, 26,
        ],
        "text-anchor": "top",
        "text-offset": [0, 1.5],
        "text-allow-overlap": false,
        "text-padding": 2,
        "text-ignore-placement": false,
      },
      paint: {
        "text-color": "#F0EDE5",
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