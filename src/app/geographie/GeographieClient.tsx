"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MapContainer from "./components/MapContainer";
import InfoPanel from "./components/panels/InfoPanel";
import LayerToggle from "./components/panels/LayerToggle";
import SeasonSlider from "./components/panels/SeasonSlider";
import BrightnessControl from "./components/panels/BrightnessControl";
import SearchPanel from "./components/panels/SearchPanel";
import LegendPanel from "./components/panels/LegendPanel";
import CinematicFlythrough from "./components/CinematicFlythrough";
import CommunityFeed from "./components/community/CommunityFeed";
import { useLayerVisibility, type LayerId } from "./hooks/useLayerVisibility";
import { useSeasonAnimation } from "./hooks/useSeasonAnimation";
// @ts-ignore
import type { MapRef } from "react-map-gl/maplibre";

export interface SelectedFeature {
  type: "river" | "village" | "subtribe" | "community_pin" | "clan";
  properties: Record<string, unknown>;
  coordinates?: [number, number];
}

export default function GeographieClient() {
  const mapRef = useRef<MapRef | null>(null);
  const [showFlythrough, setShowFlythrough] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [showCommunityFeed, setShowCommunityFeed] = useState(false);
  const [brightness, setBrightness] = useState(75); // Default: jour (75%)
  const [villagesData, setVillagesData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point> | null>(null);

  const { layers, toggleLayer, isLayerVisible } = useLayerVisibility();
  const { seasonProgress, setSeasonProgress, isAnimating, toggleAnimation } =
    useSeasonAnimation();

  // Charger les données des villages pour la recherche
  useEffect(() => {
    fetch("/geographie/data/villages.geojson")
      .then((r) => r.json())
      .then(setVillagesData)
      .catch(console.error);
  }, []);

  // Appliquer la luminosité au style de la carte
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const brightnessValue = brightness / 100;
    const rasterLayer = map.getLayer("osm-base");
    if (rasterLayer) {
      map.setPaintProperty("osm-base", "raster-brightness-max", Math.max(0.15, brightnessValue * 0.8));
      map.setPaintProperty("osm-base", "raster-opacity", Math.max(0.15, brightnessValue * 0.6));
    }

    // Ajuster le sky
    const skyColor = `hsl(210, 30%, ${brightnessValue * 30}%)`;
    const horizonColor = `hsl(150, 20%, ${brightnessValue * 20}%)`;
    const fogColor = `hsl(140, 25%, ${brightnessValue * 15}%)`;
    
    map.setSky({
      "sky-color": skyColor,
      "sky-horizon-blend": 0.5,
      "horizon-color": horizonColor,
      "horizon-fog-blend": 0.8,
      "fog-color": fogColor,
      "fog-ground-blend": 0.9,
    });
  }, [brightness]);

  const handleFlythroughComplete = useCallback(() => {
    setShowFlythrough(false);
  }, []);

  const handleFeatureClick = useCallback((feature: SelectedFeature) => {
    setSelectedFeature(feature);
    setShowCommunityFeed(false);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const handleSearchResultClick = useCallback((coordinates: [number, number], feature: { name: string; type?: string }) => {
    // Voler vers le résultat
    mapRef.current?.flyTo({
      center: coordinates,
      zoom: 12,
      pitch: 60,
      duration: 2000,
    });

    // Sélectionner le feature
    setSelectedFeature({
      type: "village",
      properties: { name: feature.name, type: feature.type },
      coordinates,
    });
  }, []);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[var(--foret-nocturne)]">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      {/* Carte 3D principale */}
      <MapContainer
        ref={mapRef}
        seasonProgress={seasonProgress}
        visibleLayers={layers}
        onFeatureClick={handleFeatureClick}
      />

      {/* Animation d'ouverture cinématique */}
      <AnimatePresence>
        {showFlythrough && (
          <CinematicFlythrough
            mapRef={mapRef}
            onComplete={handleFlythroughComplete}
          />
        )}
      </AnimatePresence>

      {/* Contrôles superposés (visibles après le fly-through) */}
      <AnimatePresence>
        {!showFlythrough && (
          <>
            {/* Barre de recherche — en haut à gauche */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SearchPanel
                villagesData={villagesData}
                onResultClick={handleSearchResultClick}
              />
            </motion.div>

            {/* Panneau droit — en haut à droite */}
            <motion.div
              className="absolute top-20 right-4 z-20 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Toggle des couches */}
              <LayerToggle
                layers={layers}
                onToggle={toggleLayer}
              />
              {/* Légende */}
              <LegendPanel />
            </motion.div>

            {/* Contrôle de luminosité — en bas à gauche */}
            <motion.div
              className="absolute bottom-20 left-4 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BrightnessControl
                brightness={brightness}
                onBrightnessChange={setBrightness}
              />
            </motion.div>

            {/* Slider saisonnier — en bas */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SeasonSlider
                progress={seasonProgress}
                onProgressChange={setSeasonProgress}
                isAnimating={isAnimating}
                onToggleAnimation={toggleAnimation}
              />
            </motion.div>

            {/* Bouton communauté — en bas à droite */}
            <motion.button
              className="absolute bottom-24 right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(10, 31, 21, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(196, 160, 53, 0.3)",
                color: "var(--or-ancestral)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              onClick={() => {
                setShowCommunityFeed(!showCommunityFeed);
                setSelectedFeature(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Communauté
            </motion.button>

            {/* Bouton aide — en bas à droite, sous communauté */}
            <Link
              href="/geographie/aide"
              className="absolute bottom-6 right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(10, 31, 21, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(196, 160, 53, 0.15)",
                color: "var(--brume-matinale)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Aide
            </Link>

          </>
        )}
      </AnimatePresence>

      {/* Panneau d'information latéral */}
      <AnimatePresence>
        {selectedFeature && (
          <InfoPanel
            feature={selectedFeature}
            onClose={handleClosePanel}
          />
        )}
      </AnimatePresence>

      {/* Flux communautaire */}
      <AnimatePresence>
        {showCommunityFeed && (
          <CommunityFeed
            onClose={() => setShowCommunityFeed(false)}
            onPinSelect={(pin: Record<string, unknown>) => {
              handleFeatureClick({
                type: "community_pin",
                properties: pin,
                coordinates: pin.coordinates as [number, number] | undefined,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />
    </main>
  );
}