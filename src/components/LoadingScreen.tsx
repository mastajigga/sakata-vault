"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingScreen - Version "Emblème Vivant"
 * Vidéo WebM VP9 720p en fond plein écran.
 */
const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          role="status"
          aria-label="Chargement de la transmission..."
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
          className="fixed inset-0 z-[9998] overflow-hidden bg-[var(--foret-nocturne)]"
        >
          {/* VIDÉO D'EMBLÈME EN FOND */}
          <video
            ref={videoRef}
            src="/videos/loading-emblem.webm"
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.7 }}
          />

          {/* Superposition sombre pour texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,160,53,0.04),transparent_60%),linear-gradient(180deg,rgba(6,20,15,0.5)_0%,rgba(6,20,15,0.4)_100%)]" />

          {/* Brumes diffuses */}
          <div className="absolute inset-0 opacity-30 blur-[100px]">
            <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[rgba(212,221,215,0.08)]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[rgba(196,160,53,0.04)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
