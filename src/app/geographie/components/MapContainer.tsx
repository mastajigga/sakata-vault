"use client";

import React, { forwardRef, useCallback, useMemo, useEffect, useState } from "react";
// @ts-ignore - react-map-gl/maplibre is the correct import for MapLibre
import Map, { Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import { kisakataMapStyle, DEFAULT_VIEW_STATE } from "../lib/mapStyles";
import HydrographyLayer from "./layers/HydrographyLayer";
import SubtribesLayer from "./layers/SubtribesLayer";
import VillagesLayer from "./layers/VillagesLayer";
import ChiefdomsLayer from "./layers/ChiefdomsLayer";
import DialectsLayer from "./layers/DialectsLayer";
import ClansLayer from "./layers/ClansLayer";
import ForestLayer from "./layers/ForestLayer";
import type { SelectedFeature } from "../GeographieClient";
import type { LayerState } from "../hooks/useLayerVisibility";

interface MapContainerProps {
  seasonProgress: number;
  visibleLayers: LayerState[];
  onFeatureClick: (feature: SelectedFeature) => void;
}

const MapContainer = forwardRef<MapRef, MapContainerProps>(
  ({ seasonProgress, visibleLayers, onFeatureClick }, ref) => {
  const [riversData, setRiversData] = useState<GeoJSON.FeatureCollection<GeoJSON.LineString> | null>(null);
  const [subtribesData, setSubtribesData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null>(null);
  const [villagesData, setVillagesData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point> | null>(null);
  const [chiefdomsData, setChiefdomsData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);
  const [dialectsData, setDialectsData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);
  const [clansData, setClansData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);
  const [forestData, setForestData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);

    useEffect(() => {
      fetch("/geographie/data/rivers.geojson")
        .then((r) => r.json())
        .then(setRiversData)
        .catch(console.error);

      fetch("/geographie/data/subtribes.geojson")
        .then((r) => r.json())
        .then(setSubtribesData)
        .catch(console.error);

      fetch("/geographie/data/villages.geojson")
        .then((r) => r.json())
        .then(setVillagesData)
        .catch(console.error);

      fetch("/geographie/data/chiefdoms.geojson")
        .then((r) => r.json())
        .then(setChiefdomsData)
        .catch(console.error);

      fetch("/geographie/data/dialects.geojson")
        .then((r) => r.json())
        .then(setDialectsData)
        .catch(console.error);

      fetch("/geographie/data/clans.geojson")
        .then((r) => r.json())
        .then(setClansData)
        .catch(console.error);

      fetch("/geographie/data/forest.geojson")
        .then((r) => r.json())
        .then(setForestData)
        .catch(console.error);
    }, []);

    const isVisible = useCallback(
      (id: string) => visibleLayers.find((l) => l.id === id)?.visible ?? false,
      [visibleLayers]
    );

    const handleClick = useCallback(
      (e: MapLayerMouseEvent) => {
        const features = e.features;
        if (!features || features.length === 0) return;

        const feature = features[0];
        const layerId = feature.layer?.id;

        if (layerId?.startsWith("rivers")) {
          onFeatureClick({
            type: "river",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        } else if (layerId?.startsWith("subtribes")) {
          onFeatureClick({
            type: "subtribe",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        } else if (layerId?.startsWith("villages")) {
          onFeatureClick({
            type: "village",
            properties: feature.properties ?? {},
            coordinates: (feature.geometry as { type: "Point"; coordinates: [number, number] })?.coordinates,
          });
        } else if (layerId?.startsWith("chiefdoms")) {
          onFeatureClick({
            type: "subtribe",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        }
      },
      [onFeatureClick]
    );

    const interactiveLayerIds = useMemo(
      () => ["rivers-line", "subtribes-fill", "villages-circle", "chiefdoms-fill"],
      []
    );

    return (
      <div className="absolute inset-0">
        <Map
          ref={ref}
          initialViewState={DEFAULT_VIEW_STATE}
          style={{ width: "100%", height: "100%" }}
          mapStyle={kisakataMapStyle as any}
          terrain={{ source: "terrain-dem", exaggeration: 1.8 }}
          maxPitch={80}
          interactiveLayerIds={interactiveLayerIds}
          onClick={handleClick}
          cursor="pointer"
          attributionControl={false}
        >
          <NavigationControl position="top-left" showCompass showZoom visualizePitch />

          {/* Couche forêt & savane — en arrière-plan */}
          {isVisible("forest") && forestData && (
            <ForestLayer data={forestData} />
          )}

          {/* Couche clans — strata sociaux */}
          {isVisible("clans") && clansData && (
            <ClansLayer data={clansData} />
          )}

          {/* Couche chefferies — 7 chefferies */}
          {isVisible("chiefdoms") && chiefdomsData && (
            <ChiefdomsLayer data={chiefdomsData} />
          )}

          {/* Couche dialectes — 6 zones dialectales */}
          {isVisible("dialects") && dialectsData && (
            <DialectsLayer data={dialectsData} />
          )}

          {/* Couche sous-tribus */}
          {isVisible("subtribes") && subtribesData && (
            <SubtribesLayer data={subtribesData} />
          )}

          {/* Couche rivières */}
          {isVisible("hydro") && riversData && (
            <HydrographyLayer
              data={riversData}
              seasonProgress={seasonProgress}
            />
          )}

          {/* Couche villages et ports */}
          {isVisible("villages") && villagesData && (
            <VillagesLayer data={villagesData} />
          )}
        </Map>
      </div>
    );
  }
);

MapContainer.displayName = "MapContainer";
export default MapContainer;