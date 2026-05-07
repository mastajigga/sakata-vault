"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";

const mistLayers = [
  "top-[8%] left-[-18%] h-36 w-[68vw] opacity-45 sakata-mist-drift-slow",
  "top-[34%] right-[-24%] h-44 w-[78vw] opacity-35 sakata-mist-drift-medium",
  "bottom-[18%] left-[-22%] h-40 w-[72vw] opacity-40 sakata-mist-drift-fast",
];

const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useLanguage();
  const message = t("loading.message") || "Transmission des savoirs...";

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Chargement de la prochaine page"
          initial={{ opacity: 0, clipPath: "inset(0 0 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[var(--foret-nocturne)]"
        >
          {/* Fond forêt + eau sombre */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(196,160,53,0.12),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(12,41,32,0.95),transparent_42%),linear-gradient(180deg,#06140f_0%,var(--foret-nocturne)_46%,#020806_100%)]" />

          {/* Grain discret */}
          <div className="absolute inset-0 opacity-[0.045] sakata-loading-grain" />

          {/* Brumes animées */}
          <div className="absolute inset-0 blur-2xl">
            {mistLayers.map((className, index) => (
              <div
                key={index}
                className={`absolute rounded-full bg-[linear-gradient(90deg,transparent,rgba(212,221,215,0.42),rgba(240,237,229,0.18),transparent)] ${className}`}
              />
            ))}
          </div>

          {/* Halos dorés */}
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(196,160,53,0.10)] sakata-gold-pulse" />
          <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,160,53,0.12),transparent_68%)] sakata-mist-breathe" />

          {/* Rivière lumineuse */}
          <div className="absolute left-[-10%] right-[-10%] top-[58%] h-px overflow-visible opacity-80">
            <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(212,221,215,0.12),rgba(233,196,106,0.95),rgba(212,221,215,0.12),transparent)] sakata-river-shimmer" />
            <div className="mx-auto mt-[-1px] h-10 w-[62vw] rounded-full bg-[rgba(196,160,53,0.08)] blur-2xl" />
          </div>

          {/* Centre narratif */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 1.02 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] bg-[rgba(10,31,21,0.46)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.32em] text-[rgba(212,221,215,0.62)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--or-ancestral)] shadow-[0_0_18px_rgba(196,160,53,0.9)]" />
              La brume s&apos;ouvre
            </div>

            <motion.div
              animate={{ opacity: [0.72, 1, 0.72], scale: [1, 1.025, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-display text-5xl font-bold tracking-[-0.07em] text-[var(--or-ancestral)] sm:text-7xl"
              style={{ textShadow: "0 0 54px rgba(196, 160, 53, 0.42)" }}
            >
              SAKATA
            </motion.div>

            <p className="mt-5 max-w-md text-sm leading-7 text-[rgba(240,237,229,0.72)] sm:text-base">
              La nouvelle page arrive. Les savoirs se rassemblent derrière la brume.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex gap-2.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block h-2 w-2 rounded-full bg-[var(--or-ancestral)]"
                    animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.25, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
                  />
                ))}
              </div>

              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(212,221,215,0.52)]">
                {message}
              </span>
            </div>
          </motion.div>

          {/* Voile de sortie : donne l'effet page révélée par la brume */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,rgba(6,20,15,0.82),transparent)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
