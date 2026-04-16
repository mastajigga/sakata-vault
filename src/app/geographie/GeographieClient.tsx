"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MapRef } from "react-map-gl/maplibre";
import MapContainer from "./components/MapContainer";
import Sidebar from "./components/panels/Sidebar";
import InfoPanel from "./components/panels/InfoPanel";
import LayerToggle from "./components/panels/LayerToggle";
import BrightnessControl from "./components/panels/BrightnessControl";
import SeasonSlider from "./components/panels/SeasonSlider";
import Timeline from "./components/Timeline";
import CinematicFlythrough from "./components/CinematicFlythrough";
import { useLayerVisibility } from "./hooks/useLayerVisibility";
import { History, Waves, Settings2, Globe2, X } from "lucide-react";
import Navbar from "@/components/Navbar";

export type SelectedFeature = {
  type: "river" | "village" | "subtribe" | "clan" | "community_pin";
  properties: any;
  coordinates?: [number, number];
};

export default function GeographieClient() {
  const mapRef = useRef<MapRef>(null);
  const { layers, toggleLayer } = useLayerVisibility();
  
  const [seasonProgress, setSeasonProgress] = useState(0.3);
  const [isSeasonAnimating, setIsSeasonAnimating] = useState(false);
  const [brightness, setBrightness] = useState(75);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showFlythrough, setShowFlythrough] = useState(false);

  // Simulation/Animation de la saison
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSeasonAnimating) {
      interval = setInterval(() => {
        setSeasonProgress((prev) => (prev >= 1 ? 0 : prev + 0.005));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isSeasonAnimating]);

  // Reveal when loading is finished
  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => setIsReady(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  // Map settings update based on brightness
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const brightnessValue = brightness / 100;
    const rasterLayer = map.getLayer("osm-base");

    if (rasterLayer) {
      map.setPaintProperty("osm-base", "raster-brightness-max", Math.max(0.15, brightnessValue * 0.8));
      map.setPaintProperty("osm-base", "raster-opacity", Math.max(0.15, brightnessValue * 0.6));
    }

    map.setSky({
      "sky-color": `hsl(210, 30%, ${brightnessValue * 30}%)`,
      "sky-horizon-blend": 0.5,
      "horizon-color": `hsl(150, 20%, ${brightnessValue * 20}%)`,
      "horizon-fog-blend": 0.8,
      "fog-color": `hsl(140, 25%, ${brightnessValue * 15}%)`,
      "fog-ground-blend": 0.9,
    });
  }, [brightness, isReady]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050B08] selection:bg-or-ancestral/30 text-ivoire-ancien">
      
      {/* Navbar Integration */}
      <AnimatePresence>
        {isReady && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute left-0 right-0 top-0 z-[60]"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Screen */}
      <AnimatePresence>
        {!isReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 z-[100] bg-[#050B08] flex flex-col items-center justify-center p-8"
          >
            <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
               {/* Decorative rings */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border border-or-ancestral/10 rounded-full" 
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 border border-or-ancestral/5 rounded-full border-dashed" 
               />
               
               <div className="relative text-center">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Globe2 size={48} className="text-or-ancestral mx-auto mb-4" />
                  </motion.div>
                  <h1 className="text-xl font-display font-bold tracking-[0.3em] text-ivoire-ancien uppercase mb-1">Kisakata</h1>
                  <p className="text-[10px] font-mono tracking-widest text-or-ancestral/60 uppercase">Cartographie Sacrée</p>
               </div>
            </div>

            <div className="w-48 h-[2px] bg-white/5 rounded-full mb-4 overflow-hidden relative">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-or-ancestral shadow-[0_0_10px_rgba(196,160,53,0.5)]"
                 initial={{ width: 0 }}
                 animate={{ width: `${loadingProgress}%` }}
               />
            </div>
            <p className="text-[10px] font-mono text-ivoire-ancien/30 uppercase tracking-[0.2em] animate-pulse">
               Récupération des données territoriales... {Math.round(loadingProgress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          seasonProgress={seasonProgress}
          visibleLayers={layers}
          onFeatureClick={setSelectedFeature}
          onLoadingProgress={setLoadingProgress}
        />
      </div>

      {/* Background Overlay / Noise Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] mix-blend-overlay bg-[url('/textures/noise.png')]" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Subtle HUD edges */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-black/60 to-transparent" />
      </div>

      {/* Header Info (Appears after loading) */}
      <AnimatePresence>
        {isReady && (
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-24 left-10 z-30 pointer-events-auto"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-or-ancestral/10 border border-or-ancestral/20 flex items-center justify-center text-or-ancestral shadow-lg">
                   <History size={18} />
                </div>
                <h1 className="text-lg font-bold tracking-widest text-ivoire-ancien uppercase">Command Center</h1>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-or-ancestral/40">
                 <span>Sakata Digital Hub</span>
                 <span className="w-1 h-1 rounded-full bg-or-ancestral/20" />
                 <span>Exploration Territoriale v2.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Layout */}
      {isReady && (
        <div className="absolute inset-0 pt-32 p-8 z-30 pointer-events-none flex flex-col justify-between">
          
          {/* Top Section */}
          <div className="flex justify-between items-start">
             <div className="w-80 h-1" />
             <div className="pointer-events-auto flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-mono text-ivoire-ancien/60 hover:text-ivoire-ancien hover:bg-black/60 transition-all uppercase tracking-widest shadow-xl">
                  <Settings2 size={12} />
                  Système
                </button>
             </div>
          </div>

          {/* Center Section */}
          <div className="flex flex-1 justify-between gap-12 mt-12 mb-12">
            
            {/* Left Column */}
            <Sidebar position="left" className="pointer-events-auto flex flex-col gap-6 h-[calc(100vh-450px)] min-h-[400px]">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                 {selectedFeature ? (
                   <div className="relative">
                     <button 
                       onClick={() => setSelectedFeature(null)}
                       className="absolute top-0 right-0 p-2 text-ivoire-ancien/40 hover:text-ivoire-ancien transition-colors"
                     >
                       <X size={16} />
                     </button>
                     <InfoPanel 
                       feature={selectedFeature} 
                       onClose={() => setSelectedFeature(null)} 
                     />
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                      <Globe2 size={40} className="mb-4 text-or-ancestral" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ivoire-ancien leading-relaxed">
                        Sélectionnez une entité sur la carte pour explorer son essence
                      </p>
                   </div>
                 )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <SeasonSlider 
                   progress={seasonProgress} 
                   onProgressChange={setSeasonProgress}
                   isAnimating={isSeasonAnimating}
                   onToggleAnimation={() => setIsSeasonAnimating(!isSeasonAnimating)}
                 />
              </div>
            </Sidebar>

            {/* Right Column */}
            <Sidebar position="right" className="pointer-events-auto flex flex-col gap-8 h-[calc(100vh-450px)] min-h-[400px]">
              <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                 <LayerToggle layers={layers} onToggle={toggleLayer} />
                 <BrightnessControl brightness={brightness} onBrightnessChange={setBrightness} />
              </div>

              <div className="mt-auto space-y-3">
                 <button 
                  onClick={() => setShowFlythrough(true)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral hover:bg-or-ancestral/20 transition-all group shadow-inner"
                 >
                    <div className="flex items-center gap-3">
                      <Waves size={16} className="group-hover:animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Projection 3D</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-or-ancestral animate-pulse shadow-[0_0_5px_rgba(196,160,53,0.5)]" />
                 </button>
              </div>
            </Sidebar>
          </div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-4xl mx-auto w-full pointer-events-auto"
          >
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative group">
               <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-or-ancestral/30 rounded-tl-sm group-hover:border-or-ancestral/60 transition-colors" />
               <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-or-ancestral/30 rounded-tr-sm group-hover:border-or-ancestral/60 transition-colors" />
               
               <Timeline />
            </div>
            
            {/* Status indicators */}
            <div className="mt-4 flex justify-center items-center gap-6 text-[9px] font-mono uppercase tracking-[0.2em] text-white/20">
               <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-or-ancestral animate-pulse" />
                  <span>Flux de Données Actif</span>
               </div>
               <div className="w-px h-2 bg-white/5" />
               <span>Bassin de Lukenie</span>
               <div className="w-px h-2 bg-white/5" />
               <span>Lat: 2.85°S / Lon: 20.42°E</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cinematic Overlays */}
      <AnimatePresence>
        {showFlythrough && (
          <CinematicFlythrough 
            mapRef={mapRef} 
            onComplete={() => setShowFlythrough(false)} 
          />
        )}
      </AnimatePresence>

      {/* Global Dimming Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ 
          backgroundColor: "rgba(0,0,0,0.8)", 
          opacity: 1 - (brightness / 100) 
        }} 
      />
    </div>
  );
}
