"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { SymbolLayer, CircleLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ClansLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>;
}

const CLAN_COLORS: Record<string, string> = {
  Badju: "#C4A035",
  Bambe: "#2E8B57",
  Nsane: "#8B7355",
};

export default function ClansLayer({ data }: ClansLayerProps) {
  const sourceId = "clans-source";

  // Icône clan — cercle avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "clans-icon",
      type: "circle",
      source: sourceId,
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
          "Badju", CLAN_COLORS.Badju,
          "Bambe", CLAN_COLORS.Bambe,
          "Nsane", CLAN_COLORS.Nsane,
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
      id: "clans-icon-glow",
      type: "circle",
      source: sourceId,
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
          "Badju", CLAN_COLORS.Badju,
          "Bambe", CLAN_COLORS.Bambe,
          "Nsane", CLAN_COLORS.Nsane,
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
      id: "clans-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 10,
          6, 12,
          8, 15,
          10, 18,
          12, 24,
          14, 30,
        ],
        "text-anchor": "top",
        "text-offset": [0, 1.5],
        "text-allow-overlap": false,
        "text-padding": 2,
      },
      paint: {
        "text-color": KISAKATA_COLORS.sableDoux,
        "text-halo-color": KISAKATA_COLORS.foretNocturne,
        "text-halo-width": 3,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  return (
    <Source id={sourceId} type="geojson" data={data as unknown as GeoJSONSourceRaw["data"]}>
      <Layer {...iconGlowLayer} />
      <Layer {...iconLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
}
