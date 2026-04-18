"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MapRef } from "react-map-gl";
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
import { cn } from "@/lib/utils";

export type SelectedFeature = {
  type: "river" | "village" | "subtribe" | "clan" | "community_pin" | "province";
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
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [showFlythrough, setShowFlythrough] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    if (!map || !isStyleLoaded) return;

    const brightnessValue = brightness / 100;
    
    // In Mapbox Standard, we use setFog for atmosphere
    map.setFog({
      "color": `hsl(140, 25%, ${brightnessValue * 15}%)`,
      "high-color": `hsl(210, 30%, ${brightnessValue * 30}%)`,
      "space-color": `hsl(210, 50%, ${brightnessValue * 5}%)`,
      "horizon-blend": 0.5,
    } as any);
  }, [brightness, isReady, isStyleLoaded]);

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
          onStyleLoad={() => setIsStyleLoaded(true)}
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
        {isReady && hudVisible && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "absolute z-30 pointer-events-auto transition-all duration-500",
              isMobile ? "top-20 left-4" : "top-24 left-10"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-or-ancestral/10 border border-or-ancestral/20 flex items-center justify-center text-or-ancestral shadow-lg">
                   <History size={isMobile ? 14 : 18} />
                </div>
                <h1 className="text-sm md:text-lg font-bold tracking-widest text-ivoire-ancien uppercase">Command Center</h1>
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-or-ancestral/40">
                 <span>{isMobile ? "Sakata" : "Sakata Digital Hub"}</span>
                 <span className="w-1 h-1 rounded-full bg-or-ancestral/20" />
                 <span>{isMobile ? "v2.0" : "Exploration Territoriale v2.0"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Toggle (Mobile Focus) */}
      <AnimatePresence>
        {isReady && isMobile && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setHudVisible(!hudVisible)}
            className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-[#0A1F15]/80 backdrop-blur-xl border border-or-ancestral/30 flex items-center justify-center text-or-ancestral shadow-[0_0_20px_rgba(0,0,0,0.4)] pointer-events-auto active:scale-90 transition-transform"
          >
            {hudVisible ? <X size={24} /> : <Globe2 size={24} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dashboard Layout */}
      {isReady && (
        <div className={cn(
          "absolute inset-0 z-30 pointer-events-none flex flex-col transition-all duration-700",
          isMobile ? "pt-20 px-4 pb-24" : "pt-24 md:pt-32 p-4 md:p-6",
          !hudVisible && "opacity-0 scale-95 pointer-events-none"
        )}>
          
          {/* Top Section */}
          <div className="flex justify-between items-start">
             <div className={cn("h-1 transition-all", isMobile ? "w-0" : "w-80")} />
             <div className="pointer-events-auto flex gap-3">
                <button 
                  onClick={() => !isMobile && setHudVisible(!hudVisible)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 text-[9px] md:text-[10px] font-mono text-ivoire-ancien/60 hover:text-ivoire-ancien hover:bg-black/60 transition-all uppercase tracking-widest shadow-xl"
                >
                  <Settings2 size={12} />
                  {!isMobile && (hudVisible ? "Masquer HUD" : "Afficher HUD")}
                  {isMobile && "Système"}
                </button>
             </div>
          </div>

          {/* Center Section */}
          <div className={cn(
            "flex-1 flex justify-between gap-6 md:gap-12 mt-4 md:mt-8 mb-4 md:mb-8 overflow-hidden min-h-0",
            isMobile ? "flex-col overflow-y-auto" : "flex-row"
          )}>
            
            {/* Left Column (Info / Selection) */}
            <Sidebar position="left" isMobile={isMobile} className="pointer-events-auto flex flex-col gap-4 md:gap-6 h-auto md:h-full md:max-h-[600px] shrink-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                 {selectedFeature ? (
                   <div className="relative">
                     <button 
                       onClick={() => setSelectedFeature(null)}
                       className="absolute top-0 right-0 p-2 text-ivoire-ancien/40 hover:text-ivoire-ancien transition-colors sm:hidden"
                     >
                       <X size={16} />
                     </button>
                     <InfoPanel 
                       feature={selectedFeature} 
                       onClose={() => setSelectedFeature(null)} 
                     />
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8 opacity-20">
                      <Globe2 size={isMobile ? 32 : 40} className="mb-4 text-or-ancestral" />
                      <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-ivoire-ancien leading-relaxed">
                        Explorez le territoire
                      </p>
                   </div>
                 )}
              </div>

              {!isMobile && (
                <div className="mt-auto pt-6 border-t border-white/5">
                   <SeasonSlider 
                     progress={seasonProgress} 
                     onProgressChange={setSeasonProgress}
                     isAnimating={isSeasonAnimating}
                     onToggleAnimation={() => setIsSeasonAnimating(!isSeasonAnimating)}
                   />
                </div>
              )}
            </Sidebar>

            {/* Right Column (Controls) */}
            <Sidebar position="right" isMobile={isMobile} className="pointer-events-auto flex flex-col gap-6 md:gap-8 h-auto md:h-full md:max-h-[600px] shrink-0">
              <div className="space-y-6 md:space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                 <LayerToggle layers={layers} onToggle={toggleLayer} />
                 {!isMobile && <BrightnessControl brightness={brightness} onBrightnessChange={setBrightness} />}
              </div>

              <div className="mt-auto space-y-3">
                 <button 
                  onClick={() => setShowFlythrough(true)}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral hover:bg-or-ancestral/20 transition-all group shadow-inner"
                 >
                    <div className="flex items-center gap-3">
                      <Waves size={16} className="group-hover:animate-pulse" />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">3D Projection</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-or-ancestral animate-pulse shadow-[0_0_5px_rgba(196,160,53,0.5)]" />
                 </button>
              </div>
            </Sidebar>
          </div>

          {/* Bottom Section (Timeline) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={cn(
              "max-w-4xl mx-auto w-full pointer-events-auto mt-auto mb-6",
              isMobile ? "hidden" : "block"
            )}
          >
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl relative group">
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
