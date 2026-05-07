"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingScreen - Version "Sceau de Lumière"
 * Un design épuré centré sur un emblème SVG animé pour une transition hypnotique.
 */
const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          role="status"
          aria-label="Chargement de la transmission..."
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[var(--foret-nocturne)]"
        >
          {/* 1. ATMOSPHÈRE DE FOND */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,160,53,0.06),transparent_60%),linear-gradient(180deg,#06140f_0%,var(--foret-nocturne)_100%)]" />
          
          {/* Brumes diffuses pour la texture organique */}
          <div className="absolute inset-0 opacity-40 blur-[100px]">
            <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[5 0%] rounded-full bg-[rgba(212,221,215,0.1)]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[rgba(196,160,53,0.05)]" />
          </div>

          {/* 2. LE SCEAU (SVG CENTRAL) */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="h-[55vw] w-[55vw] max-h-[55vh] max-w-[55vh] drop-shadow-[0_0_30px_rgba(196,160,53,0.3)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Halo central de base */}
              <circle cx="50" cy="50" r="30" className="fill-[rgba(196,160,53,0.03)]" />

              {/* Anneau 1 : Le grand cercle rotatif (interrompu) - L'horizon de la brume */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="0.4"
                strokeDasharray="180 120"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Anneau 2 : Rotation inverse, très fin - Le flux de l'eau */}
              <motion.circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="rgba(212,221,215,0.15)"
                strokeWidth="0.2"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Anneau 3 : Pulsation de lumière - Le cœur du savoir */}
              <motion.circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke="rgba(196,160,53,0.3)"
                strokeWidth="0.8"
                animate={{ 
                  scale: [1, 1.15, 1], 
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <defs>
                <radialGradient id="goldGradient">
                  <stop offset="0%" stopColor="rgba(240,237,229,0.9)" />
                  <stop offset="40%" stopColor="rgba(196,160,53,0.6)" />
                  <stop offset="100%" stopColor="ring(196,160,53,0)" />
                </radialGradient>
              </defs>
            </svg>

            {/* Texte minimaliste : Un souffle de présence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-[10px] uppercase tracking-[0.8em] text-[rgba(212,221,215,0.4)] font-light">
                Sakata
              </span>
            </motion.div>
          </div>

          {/* 3. LA RIVIÈRE ÉPHÉMÈRE (L'élément de mouvement horizontal) */}
          <div className="absolute left-[-20%] right-[-20%] top-[75%] h-[1px] opacity-30">
             <div className="h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(233,196,106,0.4),transparent)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
