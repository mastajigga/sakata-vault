"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";

interface ChiefdomsLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
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

export default function ChiefdomsLayer({ data }: ChiefdomsLayerProps) {
  const sourceId = "chiefdoms-source";

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

  const labelLayer: SymbolLayer = useMemo(
    () => ({
      id: "chiefdoms-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular"],
        "text-size": 11,
        "text-anchor": "center",
        "text-offset": [0, 0],
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#F0EDE5",
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