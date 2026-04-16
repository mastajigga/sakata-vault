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
  onLoadingProgress?: (progress: number) => void;
}

const DATA_FILES = [
  { key: "rivers", url: "/geographie/data/rivers.geojson" },
  { key: "subtribes", url: "/geographie/data/subtribes.geojson" },
  { key: "villages", url: "/geographie/data/villages.geojson" },
  { key: "chiefdoms", url: "/geographie/data/chiefdoms.geojson" },
  { key: "chiefdomsPoints", url: "/geographie/data/chiefdoms-points.geojson" },
  { key: "subtribesPoints", url: "/geographie/data/subtribes-points.geojson" },
  { key: "dialects", url: "/geographie/data/dialects.geojson" },
  { key: "dialectsPoints", url: "/geographie/data/dialects-points.geojson" },
  { key: "clans", url: "/geographie/data/clans.geojson" },
  { key: "clansPoints", url: "/geographie/data/clans-points.geojson" },
  { key: "forest", url: "/geographie/data/forest.geojson" },
  { key: "forestPoints", url: "/geographie/data/forest-points.geojson" },
  { key: "riversPoints", url: "/geographie/data/rivers-points.geojson" },
];

const MapContainer = forwardRef<MapRef, MapContainerProps>(
  ({ seasonProgress, visibleLayers, onFeatureClick, onLoadingProgress }, ref) => {
    const [data, setData] = useState<Record<string, any>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      let loadedCount = 0;
      const total = DATA_FILES.length;

      const loadAll = async () => {
        try {
          // Use a staggered approach or just Promise.all if the server can handle it
          // Promise.all is faster for the user if the server is fast.
          const results = await Promise.all(
            DATA_FILES.map(async (file) => {
              const res = await fetch(file.url);
              const json = await res.json();
              loadedCount++;
              onLoadingProgress?.((loadedCount / total) * 100);
              return { key: file.key, json };
            })
          );

          const newData = results.reduce((acc, curr) => {
            acc[curr.key] = curr.json;
            return acc;
          }, {} as Record<string, any>);

          setData(newData);
          setIsLoaded(true);
        } catch (error) {
          console.error("Error loading GeoJSON data:", error);
        }
      };

      loadAll();
    }, [onLoadingProgress]);

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
            type: "subtribe", // Consistency with GeographieClient
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        } else if (layerId?.startsWith("clans")) {
          onFeatureClick({
            type: "clan",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        }
      },
      [onFeatureClick]
    );

    const interactiveLayerIds = useMemo(
      () => ["rivers-water-main", "rivers-water-tributary", "subtribes-fill", "villages-circle", "chiefdoms-fill", "clans-fill"],
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

          {/* Couches de données */}
          {isLoaded && (
            <>
              {isVisible("forest") && data.forest && (
                <ForestLayer data={data.forest} pointsData={data.forestPoints} />
              )}
              {isVisible("clans") && data.clans && (
                <ClansLayer data={data.clans} pointsData={data.clansPoints} />
              )}
              {isVisible("chiefdoms") && data.chiefdoms && (
                <ChiefdomsLayer data={data.chiefdoms} pointsData={data.chiefdomsPoints} />
              )}
              {isVisible("dialects") && data.dialects && (
                <DialectsLayer data={data.dialects} pointsData={data.dialectsPoints} />
              )}
              {isVisible("subtribes") && data.subtribes && (
                <SubtribesLayer data={data.subtribes} pointsData={data.subtribesPoints} />
              )}
              {isVisible("hydro") && data.rivers && (
                <HydrographyLayer
                  data={data.rivers}
                  seasonProgress={seasonProgress}
                />
              )}
              {isVisible("villages") && data.villages && (
                <VillagesLayer data={data.villages} />
              )}
            </>
          )}
        </Map>
      </div>
    );
  }
);

MapContainer.displayName = "MapContainer";
export default MapContainer;