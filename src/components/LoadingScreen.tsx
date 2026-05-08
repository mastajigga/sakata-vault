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
              {/* Anneau 1 : Arc doré discontinu qui défile — visible car interrompu */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="0.6"
                strokeDasharray="80 184"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0, -264] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Anneau 2 : Arc fin discontinu, sens inverse */}
              <motion.circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="rgba(212,221,215,0.2)"
                strokeWidth="0.5"
                strokeDasharray="55 171"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0, 226] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Anneau 3 : Petit arc rapide — éclat de lumière */}
              <motion.circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="rgba(240,237,229,0.25)"
                strokeWidth="0.4"
                strokeDasharray="30 158"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0, -188] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* === SCEAU RIVIÈRE & FORÊT (logo doré central) === */}
              <motion.g
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Halo lumineux */}
                <circle cx="50" cy="48" r="28" fill="rgba(196,160,53,0.06)" />

                {/* Arrière-plan : arbres latéraux */}
                <g opacity="0.5">
                  {/* Arbre gauche */}
                  <line x1="26" y1="68" x2="26" y2="32" stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="26" y1="48" x2="18" y2="38" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
                  <line x1="26" y1="42" x2="32" y2="34" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
                  <ellipse cx="26" cy="32" rx="10" ry="12" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.6" />
                  <ellipse cx="26" cy="28" rx="6" ry="7" fill="none" stroke="url(#goldGradient)" strokeWidth="0.4" opacity="0.4" />
                  {/* Arbre droit */}
                  <line x1="74" y1="68" x2="74" y2="34" stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="74" y1="50" x2="68" y2="42" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
                  <line x1="74" y1="44" x2="80" y2="36" stroke="url(#goldGradient)" strokeWidth="0.6" strokeLinecap="round" />
                  <ellipse cx="74" cy="34" rx="9" ry="11" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.6" />
                  <ellipse cx="74" cy="30" rx="5" ry="6" fill="none" stroke="url(#goldGradient)" strokeWidth="0.4" opacity="0.4" />
                </g>

                {/* Arbre central */}
                <g>
                  <path d="M50 70 L50 22" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* Racines */}
                  <path d="M50 70 Q44 74 40 72" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                  <path d="M50 70 Q56 74 60 72" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                  {/* Branches */}
                  <path d="M50 42 Q42 36 36 30" stroke="url(#goldGradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
                  <path d="M50 42 Q58 36 64 30" stroke="url(#goldGradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
                  <path d="M50 34 Q48 26 44 20" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                  <path d="M50 34 Q52 26 56 20" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                  {/* Feuillage */}
                  <ellipse cx="36" cy="30" rx="10" ry="8" fill="none" stroke="url(#goldGradient)" strokeWidth="0.7" />
                  <ellipse cx="64" cy="30" rx="10" ry="8" fill="none" stroke="url(#goldGradient)" strokeWidth="0.7" />
                  <ellipse cx="50" cy="22" rx="12" ry="10" fill="none" stroke="url(#goldGradient)" strokeWidth="0.7" />
                  <ellipse cx="50" cy="18" rx="8" ry="6" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.7" />
                </g>

                {/* Rivière sinueuse */}
                <path
                  d="M10 80 Q20 76 30 78 Q40 80 50 77 Q60 74 70 76 Q80 78 90 75"
                  stroke="rgba(196,160,53,0.5)"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M12 77 Q22 73 32 75 Q42 77 50 74 Q60 71 68 73 Q78 75 88 72"
                  stroke="rgba(196,160,53,0.2)"
                  strokeWidth="0.6"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Lucioles / gouttes */}
                <circle cx="38" cy="76" r="0.8" fill="rgba(240,237,229,0.6)" />
                <circle cx="55" cy="74" r="0.6" fill="rgba(240,237,229,0.5)" />
                <circle cx="70" cy="75" r="0.7" fill="rgba(240,237,229,0.4)" />
              </motion.g>

              <defs>
                <radialGradient id="goldGradient">
                  <stop offset="0%" stopColor="rgba(240,237,229,0.9)" />
                  <stop offset="40%" stopColor="rgba(196,160,53,0.6)" />
                  <stop offset="100%" stopColor="rgba(196,160,53,0)" />
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
