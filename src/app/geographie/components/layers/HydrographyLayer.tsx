"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type { LineLayer, SymbolLayer } from "react-map-gl";
import { KISAKATA_COLORS } from "../../lib/mapStyles";

interface HydrographyLayerProps {
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  seasonProgress: number;
}

export default function HydrographyLayer({
  data,
  seasonProgress,
}: HydrographyLayerProps) {
  const sourceId = "rivers-source";

  // Couleur de l'eau qui change avec la saison
  const waterColor = useMemo(() => {
    const r = Math.round(15 + seasonProgress * 15);
    const g = Math.round(50 + seasonProgress * 30);
    const b = Math.round(80 + seasonProgress * 40);
    return `rgb(${r}, ${g}, ${b})`;
  }, [seasonProgress]);

  // Largeur des rivières principales
  const mainRiverWidth = 3 + seasonProgress * 2;
  // Largeur des affluents
  const tributaryWidth = 1.5 + seasonProgress * 1;

  // Couche de fond pour les rivières principales (Kasaï, Lukenie)
  const riverBedMain: LineLayer = useMemo(
    () => ({
      id: "rivers-bed-main",
      type: "line",
      source: sourceId,
      filter: ["in", "name", "Kasaï", "Lukenie", "Kasai", "Mfimi", "Fimi"],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#0A1628",
        "line-width": mainRiverWidth + 2,
        "line-opacity": 0.8,
      },
    }),
    [mainRiverWidth]
  );

  // Couche d'eau pour les rivières principales
  const riverWaterMain: LineLayer = useMemo(
    () => ({
      id: "rivers-water-main",
      type: "line",
      source: sourceId,
      filter: ["in", "name", "Kasaï", "Lukenie", "Kasai", "Mfimi", "Fimi"],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": waterColor,
        "line-width": mainRiverWidth,
        "line-opacity": 0.4, // Reduced for hybridization (let Mapbox Standard shine through)
        "line-blur": 2,      // Added for a soft "glow" effect
      },
    }),
    [waterColor, mainRiverWidth]
  );

  // Couche de fond pour les affluents
  const riverBedTributary: LineLayer = useMemo(
    () => ({
      id: "rivers-bed-tributary",
      type: "line",
      source: sourceId,
      filter: ["all", 
        ["!in", "name", "Kasaï", "Lukenie", "Kasai", "Mfimi", "Fimi"],
        ["!in", "name", "river", "canal", "stream"] // Filter out raw OSM tags
      ],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#0A1628",
        "line-width": tributaryWidth + 1,
        "line-opacity": 0.6,
      },
    }),
    [tributaryWidth]
  );

  // Couche d'eau pour les affluents
  const riverWaterTributary: LineLayer = useMemo(
    () => ({
      id: "rivers-water-tributary",
      type: "line",
      source: sourceId,
      filter: ["all", 
        ["!in", "name", "Kasaï", "Lukenie", "Kasai", "Mfimi", "Fimi"],
        ["!in", "name", "river", "canal", "stream"] // Filter out raw OSM tags
      ],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": waterColor,
        "line-width": tributaryWidth,
        "line-opacity": 0.8,
      },
    }),
    [waterColor, tributaryWidth]
  );

  // Reflet doré sur les rivières principales
  const riverHighlight: LineLayer = useMemo(
    () => ({
      id: "rivers-highlight",
      type: "line",
      source: sourceId,
      filter: ["in", "name", "Kasaï", "Lukenie", "Kasai", "Mfimi", "Fimi"],
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-color": KISAKATA_COLORS.orAncestral,
        "line-width": mainRiverWidth * 0.3,
        "line-opacity": 0.3 + seasonProgress * 0.2,
        "line-dasharray": [8, 12],
      },
    }),
    [mainRiverWidth, seasonProgress]
  );

  // Labels des rivières — placés directement sur les lignes
  const riverLabel: SymbolLayer = useMemo(
    () => ({
      id: "rivers-label",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name_skt"], // Focus on Kisakata names
        "text-font": ["Open Sans Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 10,
          7, 13,
          9, 16,
          11, 20,
          13, 26,
        ],
        "symbol-placement": "line",
        "symbol-spacing": 400,
        "text-keep-upright": true,
        "text-max-angle": 30,
        "text-letter-spacing": 0.15,
        "text-allow-overlap": false,
        "text-padding": 4,
      },
      paint: {
        "text-color": "#8BB8E0",
        "text-halo-color": "#0A1628",
        "text-halo-width": 3,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  // Labels des rivières en kisakata (plus petit, en dessous)
  const mainRiverLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-water-main",
      type: "line",
      source: sourceId,
      filter: ["!", ["has", "is_point"]],
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        // Simulation de profondeur : l'eau est plus sombre au centre
        "line-color": [
          "interpolate",
          ["linear"],
          ["zoom"],
          6, KISAKATA_COLORS.rivenDeep,
          12, KISAKATA_COLORS.eauProfonde,
        ] as any,
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          5, 1.5,
          10, 4,
          14, 12,
        ],
        // Effet de miroitement (specular reflection)
        "line-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, 0.6,
          12, 0.8,
        ],
        "line-blur": 0.5,
      },
    }),
    [seasonProgress]
  );

  // Couche de surface "Glow" pour les reflets du ciel
  const waterSurfaceLayer: LineLayer = useMemo(
    () => ({
      id: "rivers-water-surface",
      type: "line",
      source: sourceId,
      filter: ["!", ["has", "is_point"]],
      paint: {
        "line-color": KISAKATA_COLORS.ivoireAncien,
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          8, 0.5,
          14, 2,
        ],
        "line-opacity": 0.1,
        "line-blur": 2,
      },
    }),
    []
  );

  const riverLabelSkt: SymbolLayer = useMemo(
    () => ({
      id: "rivers-label-skt",
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": ["get", "name_skt"],
        "text-font": ["Open Sans Italic"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 8,
          7, 10,
          9, 12,
          11, 15,
          13, 18,
        ],
        "symbol-placement": "line",
        "symbol-spacing": 400,
        "text-keep-upright": true,
        "text-max-angle": 30,
        "text-letter-spacing": 0.1,
        "text-allow-overlap": false,
        "text-padding": 2,
      },
      paint: {
        "text-color": "#6A9ABF",
        "text-halo-color": "#0A1628",
        "text-halo-width": 2,
        "text-halo-blur": 1,
      },
    }),
    []
  );

  return (
    <Source id={sourceId} type="geojson" data={data}>
      {/* Fond des rivières */}
      <Layer {...riverBedMain} />
      <Layer {...riverBedTributary} />
      {/* Eau des rivières */}
      <Layer {...riverWaterMain} />
      <Layer {...riverWaterTributary} />
      {/* Reflet doré */}
      <Layer {...riverHighlight} />
      {/* Labels */}
      <Layer {...riverLabel} />
      <Layer {...riverLabelSkt} />
    </Source>
  );
}