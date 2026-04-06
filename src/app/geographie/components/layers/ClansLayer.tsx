"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, LineLayer, SymbolLayer, GeoJSONSourceRaw } from "react-map-gl/maplibre";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ClansLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

const CLAN_COLORS: Record<string, string> = {
  Badju: "#C4A035",
  Bambe: "#2E8B57",
  Nsane: "#8B7355",
};

export default function ClansLayer({ data }: ClansLayerProps) {
  const sourceId = "clans-source";

  const fillLayer: FillLayer = useMemo(
    () => ({
      id: "clans-fill",
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": [
          "match",
          ["get", "name"],
          ...Object.entries(CLAN_COLORS).flatMap(([name, color]) => [name, color]),
          "#666666",
        ] as any,
        "fill-opacity": 0.25,
      },
    }),
    []
  );

  const outlineLayer: LineLayer = useMemo(
    () => ({
      id: "clans-outline",
      type: "line",
      source: sourceId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": KISAKATA_COLORS.cuivreArtisanal,
        "line-width": 1.5,
        "line-opacity": 0.6,
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
        "text-font": ["Open Sans Regular"],
        "text-size": 11,
        "text-anchor": "center",
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": KISAKATA_COLORS.sableDoux,
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