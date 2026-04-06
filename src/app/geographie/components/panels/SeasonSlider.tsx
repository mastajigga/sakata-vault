"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, CloudRain, Play, Pause } from "lucide-react";

interface SeasonSliderProps {
  progress: number;
  onProgressChange: (value: number) => void;
  isAnimating: boolean;
  onToggleAnimation: () => void;
}

export default function SeasonSlider({
  progress,
  onProgressChange,
  isAnimating,
  onToggleAnimation,
}: SeasonSliderProps) {
  const isDrySeason = progress < 0.5;
  const seasonLabel = isDrySeason ? "Saison sèche" : "Saison des pluies";
  const seasonIcon = isDrySeason ? Sun : CloudRain;
  const SeasonIcon = seasonIcon;

  // Interpolation de la couleur du slider
  const dryColor = "#E8C670"; // amber light
  const wetColor = "#0C2920"; // eau sombre
  const r = Math.round(
    parseInt(dryColor.slice(1, 3), 16) +
      (parseInt(wetColor.slice(1, 3), 16) - parseInt(dryColor.slice(1, 3), 16)) * progress
  );
  const g = Math.round(
    parseInt(dryColor.slice(3, 5), 16) +
      (parseInt(wetColor.slice(3, 5), 16) - parseInt(dryColor.slice(3, 5), 16)) * progress
  );
  const b = Math.round(
    parseInt(dryColor.slice(5, 7), 16) +
      (parseInt(wetColor.slice(5, 7), 16) - parseInt(dryColor.slice(5, 7), 16)) * progress
  );
  const trackColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <div
      className="rounded-2xl px-6 py-4"
      style={{
        background: "rgba(10, 31, 21, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(196, 160, 53, 0.2)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <SeasonIcon
            size={16}
            style={{
              color: isDrySeason ? dryColor : "#4A90D9",
            }}
          />
          <span
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              color: "var(--or-ancestral)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {seasonLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px] opacity-50"
            style={{
              color: "var(--brume-matinale)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {Math.round(progress * 100)}%
          </span>
          <button
            onClick={onToggleAnimation}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-white/10"
            style={{
              color: "var(--or-ancestral)",
            }}
          >
            {isAnimating ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full h-8 flex items-center">
        {/* Track background */}
        <div
          className="absolute inset-x-0 h-1.5 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />

        {/* Track progress */}
        <div
          className="absolute left-0 h-1.5 rounded-full transition-colors duration-300"
          style={{
            width: `${progress * 100}%`,
            background: trackColor,
            boxShadow: `0 0 8px ${trackColor}40`,
          }}
        />

        {/* Labels aux extrémités */}
        <span
          className="absolute left-0 text-[9px] -translate-y-4"
          style={{
            color: dryColor,
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Sec
        </span>
        <span
          className="absolute right-0 text-[9px] -translate-y-4"
          style={{
            color: "#4A90D9",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Pluies
        </span>

        {/* Thumb */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress * 100}
          onChange={(e) => onProgressChange(Number(e.target.value) / 100)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ margin: 0 }}
        />
        <motion.div
          className="absolute pointer-events-none w-5 h-5 rounded-full border-2 shadow-lg"
          style={{
            left: `calc(${progress * 100}% - 10px)`,
            background: "var(--or-ancestral)",
            borderColor: "var(--foret-nocturne)",
            boxShadow: "0 0 12px rgba(196, 160, 53, 0.4)",
          }}
          animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: isAnimating ? Infinity : 0 }}
        />
      </div>
    </div>
  );
}