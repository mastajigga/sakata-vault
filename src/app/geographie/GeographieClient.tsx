"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import MapContainer from "./components/MapContainer";
import InfoPanel from "./components/panels/InfoPanel";
import LayerToggle from "./components/panels/LayerToggle";
import SeasonSlider from "./components/panels/SeasonSlider";
import CinematicFlythrough from "./components/CinematicFlythrough";
import CommunityFeed from "./components/community/CommunityFeed";
import { useLayerVisibility, type LayerId } from "./hooks/useLayerVisibility";
import { useSeasonAnimation } from "./hooks/useSeasonAnimation";
// @ts-ignore
import type { MapRef } from "react-map-gl/maplibre";

export interface SelectedFeature {
  type: "river" | "village" | "subtribe" | "community_pin";
  properties: Record<string, unknown>;
  coordinates?: [number, number];
}

export default function GeographieClient() {
  const mapRef = useRef<MapRef | null>(null);
  const [showFlythrough, setShowFlythrough] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [showCommunityFeed, setShowCommunityFeed] = useState(false);

  const { layers, toggleLayer, isLayerVisible } = useLayerVisibility();
  const { seasonProgress, setSeasonProgress, isAnimating, toggleAnimation } =
    useSeasonAnimation();

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
            {/* Toggle des couches — en haut à droite */}
            <motion.div
              className="absolute top-24 right-4 z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LayerToggle
                layers={layers}
                onToggle={toggleLayer}
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

            {/* Coordonnées et info en bas à gauche */}
            <motion.div
              className="absolute bottom-24 left-4 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p
                className="text-xs opacity-50"
                style={{
                  color: "var(--brume-matinale)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                Territoire de Kutu — ~18 000 km² — Province Mai-Ndombe
              </p>
            </motion.div>
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
