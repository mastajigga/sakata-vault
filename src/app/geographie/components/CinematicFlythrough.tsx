"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MapRef } from "react-map-gl";
import { TERRITORY_CENTER } from "../lib/mapStyles";

interface CinematicFlythroughProps {
  mapRef: React.MutableRefObject<MapRef | null>;
  onComplete: () => void;
}

/**
 * Animation d'ouverture cinématique.
 * Simule un survol du territoire avec GSAP-like camera transitions.
 */
export default function CinematicFlythrough({
  mapRef,
  onComplete,
}: CinematicFlythroughProps) {
  const [phase, setPhase] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const flythroughPhases = [
    // Phase 0: Vue satellite haute
    {
      longitude: TERRITORY_CENTER.longitude,
      latitude: TERRITORY_CENTER.latitude,
      zoom: 5.5,
      pitch: 0,
      bearing: 0,
      duration: 0,
    },
    // Phase 1: Descente vers Mushie (Confluence Mfimi/Kasaï)
    {
      longitude: 16.9,
      latitude: -3.0,
      zoom: 11,
      pitch: 65,
      bearing: -45,
      duration: 4000,
    },
    // Phase 2: Passage au-dessus de Nioki
    {
      longitude: 17.68,
      latitude: -2.71,
      zoom: 10,
      pitch: 50,
      bearing: 15,
      duration: 3500,
    },
    // Phase 3: Arrivée sur Kutu (Bord du lac Mai-Ndombe)
    {
      longitude: 18.13,
      latitude: -2.72,
      zoom: 9.5,
      pitch: 60,
      bearing: -20,
      duration: 4000,
    },
  ];

  useEffect(() => {
    // Phase initiale immédiate
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [flythroughPhases[0].longitude, flythroughPhases[0].latitude],
      zoom: flythroughPhases[0].zoom,
      pitch: flythroughPhases[0].pitch,
      bearing: flythroughPhases[0].bearing,
      duration: 0,
      essential: true,
    });

    // Phase 1: Après 1.5s
    const t1 = setTimeout(() => {
      setPhase(1);
      setTextOpacity(0);
      map.flyTo({
        center: [flythroughPhases[1].longitude, flythroughPhases[1].latitude],
        zoom: flythroughPhases[1].zoom,
        pitch: flythroughPhases[1].pitch,
        bearing: flythroughPhases[1].bearing,
        duration: flythroughPhases[1].duration,
        essential: true,
      });
    }, 1500);

    // Phase 2: Après 6s
    const t2 = setTimeout(() => {
      setPhase(2);
      map.flyTo({
        center: [flythroughPhases[2].longitude, flythroughPhases[2].latitude],
        zoom: flythroughPhases[2].zoom,
        pitch: flythroughPhases[2].pitch,
        bearing: flythroughPhases[2].bearing,
        duration: flythroughPhases[2].duration,
        essential: true,
      });
    }, 6000);

    // Phase 3: Après 10s
    const t3 = setTimeout(() => {
      setPhase(3);
      map.flyTo({
        center: [flythroughPhases[3].longitude, flythroughPhases[3].latitude],
        zoom: flythroughPhases[3].zoom,
        pitch: flythroughPhases[3].pitch,
        bearing: flythroughPhases[3].bearing,
        duration: flythroughPhases[3].duration,
        essential: true,
      });
    }, 10000);

    // Fin: Après 15s
    const t4 = setTimeout(() => {
      onComplete();
    }, 15000);

    timeoutRefs.current = [t1, t2, t3, t4];

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [mapRef, onComplete]);

  const titles = [
    {
      title: "Territoire Basakata",
      subtitle: "Au cœur de l'écosystème Mai-Ndombe",
    },
    {
      title: "Confluence Mushie",
      subtitle: "Là où la Mfimie rencontre le Kasaï",
    },
    {
      title: "Cité de Nioki",
      subtitle: "Plateforme économique et historique",
    },
    {
      title: "Port de Kutu",
      subtitle: "Sentinelle du lac Mai-Ndombe",
    },
  ];

  const currentTitle = titles[phase] || titles[0];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      {/* Overlay sombre */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Texte central */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: textOpacity, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase mb-3"
          style={{
            color: "var(--or-ancestral)",
            fontFamily: "var(--font-geist-mono)",
            textShadow: "0 0 40px rgba(196, 160, 53, 0.3)",
          }}
        >
          {currentTitle.title}
        </h1>
        <p
          className="text-sm md:text-base tracking-[0.1em] italic"
          style={{
            color: "var(--brume-matinale)",
            fontFamily: "var(--font-geist-serif)",
          }}
        >
          {currentTitle.subtitle}
        </p>
      </motion.div>

      {/* Indicateur de progression */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
        {flythroughPhases.map((_, i) => (
          <motion.div
            key={i}
            className="w-8 h-1 rounded-full"
            style={{
              background:
                i <= phase
                  ? "var(--or-ancestral)"
                  : "rgba(255, 255, 255, 0.15)",
            }}
            animate={{
              scaleX: i === phase ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: i === phase ? Infinity : 0,
            }}
          />
        ))}
      </div>

      {/* Bouton skip */}
      <button
        className="absolute bottom-6 right-6 pointer-events-auto px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
        style={{
          color: "var(--brume-matinale)",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={onComplete}
      >
        Passer
      </button>
    </div>
  );
}