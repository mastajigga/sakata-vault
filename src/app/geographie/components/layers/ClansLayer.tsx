"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type {
  FillLayer,
  LineLayer,
  SymbolLayer,
  CircleLayer,
} from "react-map-gl";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface ClansLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  pointsData?: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>;
}

const CLAN_COLORS: Record<string, string> = {
  Badju: "#C4A035",
  Bambe: "#2E8B57",
  Nsane: "#8B7355",
};

export default function ClansLayer({ data, pointsData }: ClansLayerProps) {
  const sourceId = "clans-source";
  const pointsSourceId = "clans-points-source";

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
        ] as never,
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

  // Icône clan — cercle avec glow
  const iconLayer: CircleLayer = useMemo(
    () => ({
      id: "clans-icon",
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
      source: pointsSourceId,
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
    <>
      <Source id={sourceId} type="geojson" data={data}>
        <Layer {...fillLayer} />
        <Layer {...outlineLayer} />
      </Source>
      {pointsData ? (
        <Source
          id={pointsSourceId}
          type="geojson"
          data={pointsData}
        >
          <Layer {...iconGlowLayer} />
          <Layer {...iconLayer} />
          <Layer {...labelLayer} />
        </Source>
      ) : null}
    </>
  );
}
