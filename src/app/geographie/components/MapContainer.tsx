"use client";

import React, { forwardRef, useCallback, useMemo, useEffect, useState } from "react";
// @ts-ignore - mapbox-gl is required for premium 3D
import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import * as topojson from "topojson-client";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl";
import { DEFAULT_VIEW_STATE } from "../lib/mapStyles";
import HydrographyLayer from "./layers/HydrographyLayer";
import SubtribesLayer from "./layers/SubtribesLayer";
import VillagesLayer from "./layers/VillagesLayer";
import ChiefdomsLayer from "./layers/ChiefdomsLayer";
import DialectsLayer from "./layers/DialectsLayer";
import ClansLayer from "./layers/ClansLayer";
import ForestLayer from "./layers/ForestLayer";
import ProvincesLayer from "./layers/ProvincesLayer";
import type { SelectedFeature } from "../GeographieClient";
import type { LayerState } from "../hooks/useLayerVisibility";

interface MapContainerProps {
  seasonProgress: number;
  visibleLayers: LayerState[];
  onFeatureClick: (feature: SelectedFeature) => void;
  onLoadingProgress?: (progress: number) => void;
  onStyleLoad?: () => void;
}

const DATA_FILES = [
  { key: "rivers", url: "/geographie/data/rivers.geojson" },
  { key: "riversPoints", url: "/geographie/data/rivers-points.geojson" },
  { key: "subtribes", url: "/geographie/data/subtribes.geojson" },
  { key: "subtribesPoints", url: "/geographie/data/subtribes-points.geojson" },
  { key: "villages", url: "/geographie/data/villages.geojson" },
  { key: "chiefdoms", url: "/geographie/data/chiefdoms.geojson" },
  { key: "chiefdomsPoints", url: "/geographie/data/chiefdoms-points.geojson" },
  { key: "dialects", url: "/geographie/data/dialects.geojson" },
  { key: "dialectsPoints", url: "/geographie/data/dialects-points.geojson" },
  { key: "clans", url: "/geographie/data/clans.geojson" },
  { key: "clansPoints", url: "/geographie/data/clans-points.geojson" },
  { key: "forest", url: "/geographie/data/forest.topojson" },
  { key: "forestPoints", url: "/geographie/data/forest-points.geojson" },
  { key: "provinces", url: "/geographie/data/provinces.geojson" },
  { key: "provincesPoints", url: "/geographie/data/provinces-points.geojson" },
];

const MapContainer = forwardRef<MapRef, MapContainerProps>(
  ({ seasonProgress, visibleLayers, onFeatureClick, onLoadingProgress, onStyleLoad }, ref) => {
    const [data, setData] = useState<Record<string, any>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Mapbox Access Token from .env.local
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    useEffect(() => {
      let mounted = true;
      let loadedCount = 0;
      const total = DATA_FILES.length;

      const loadAll = async () => {
        try {
          const results = await Promise.all(
            DATA_FILES.map(async (file) => {
              const res = await fetch(file.url);
              if (!res.ok) throw new Error(`Failed to load ${file.key}`);
              let json = await res.json();

              // Handle TopoJSON conversion
              if (file.url.endsWith(".topojson")) {
                const objectName = Object.keys(json.objects)[0];
                json = topojson.feature(json, json.objects[objectName]);
              }

              if (mounted) {
                loadedCount++;
                onLoadingProgress?.((loadedCount / total) * 100);
              }
              return { key: file.key, json };
            })
          );

          if (mounted) {
            const newData = results.reduce((acc: Record<string, any>, curr: any) => {
              acc[curr.key] = curr.json;
              return acc;
            }, {} as Record<string, any>);

            setData(newData);
            setIsLoaded(true);
          }
        } catch (error) {
          if (mounted) {
            console.error("Error loading GeoJSON data:", error);
          }
        }
      };

      loadAll();
      return () => { mounted = false; };
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
            type: "subtribe",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        } else if (layerId?.startsWith("clans")) {
          onFeatureClick({
            type: "clan",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        } else if (layerId?.startsWith("provinces")) {
          onFeatureClick({
            type: "province",
            properties: feature.properties ?? {},
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        }
      },
      [onFeatureClick]
    );

    const interactiveLayerIds = useMemo(
      () => ["rivers-water-main", "rivers-water-tributary", "subtribes-fill", "villages-circle", "chiefdoms-fill", "clans-fill", "provinces-fill"],
      []
    );

    return (
      <div className="absolute inset-0">
        <Map
          ref={ref}
          initialViewState={DEFAULT_VIEW_STATE}
          style={{ width: "100%", height: "100%" }}
          mapLib={mapboxgl as any}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/standard"
          projection={{ name: "globe" } as any}
          terrain={{ source: "mapbox-dem", exaggeration: 1.1 }}
          fog={{
            range: [0.5, 10],
            color: "#0A1F15",
            "high-color": "#1B2838",
            "space-color": "#010B14",
            "horizon-blend": 0.5,
          } as any}
          maxPitch={85}
          interactiveLayerIds={interactiveLayerIds}
          onClick={handleClick}
          cursor="pointer"
          attributionControl={false}
          onLoad={(e) => {
            const map = e.target;
            try {
              // 'dusk' est idéal pour l'aspect "Brume de la Rivière" de Sakata V1
              map.setConfigProperty('basemap', 'lightPreset', 'dusk');
              map.setConfigProperty('basemap', 'showRoadLabels', true);
              map.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
            } catch (err) {
              console.warn("Mapbox Standard config failed:", err);
            }
            onStyleLoad?.();
          }}
        >
          <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />
          
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
                <HydrographyLayer data={data.rivers} seasonProgress={seasonProgress} />
              )}
              {isVisible("provinces") && data.provinces && (
                <ProvincesLayer data={data.provinces} pointsData={data.provincesPoints} />
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