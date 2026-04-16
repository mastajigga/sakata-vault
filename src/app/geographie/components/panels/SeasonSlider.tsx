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
  
  // Interpolation de la couleur du slider
  const dryColor = "#E8C670"; // amber light
  const wetColor = "#4A90D9"; // blue
  
  const trackColor = isDrySeason ? dryColor : wetColor;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
            {isDrySeason ? <Sun size={14} className="text-or-ancestral" /> : <CloudRain size={14} className="text-blue-400" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono tracking-widest uppercase text-white/30">Cycle Naturel</span>
            <span className="text-xs font-semibold text-ivoire-ancien">{seasonLabel}</span>
          </div>
        </div>

        <button
          onClick={onToggleAnimation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border ${
            isAnimating 
              ? "bg-or-ancestral/10 border-or-ancestral/30 text-or-ancestral" 
              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
          }`}
        >
          {isAnimating ? <Pause size={10} /> : <Play size={10} />}
          <span className="text-[10px] font-mono uppercase tracking-tighter">{isAnimating ? "Actif" : "Statique"}</span>
        </button>
      </div>

      {/* Slider Area */}
      <div className="relative group">
        <div className="flex justify-between items-center mb-2 px-1">
           <span className="text-[8px] font-mono text-or-ancestral/50 uppercase tracking-widest">Sec</span>
           <span className="text-[12px] font-mono text-ivoire-ancien/60">{Math.round(progress * 100)}%</span>
           <span className="text-[8px] font-mono text-blue-400/50 uppercase tracking-widest">Pluies</span>
        </div>

        <div className="relative h-2 flex items-center">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <div 
              className="absolute left-0 h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${progress * 100}%`,
                background: `linear-gradient(to right, ${dryColor}20, ${trackColor})`,
                boxShadow: `0 0 15px ${trackColor}30`
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress * 100}
              onChange={(e) => onProgressChange(Number(e.target.value) / 100)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <motion.div
              className="absolute pointer-events-none w-4 h-4 rounded-full bg-white border-2 shadow-lg z-10"
              style={{
                left: `calc(${progress * 100}% - 8px)`,
                borderColor: trackColor,
                boxShadow: `0 0 10px ${trackColor}60`
              }}
              animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: isAnimating ? Infinity : 0 }}
            />
        </div>
      </div>
    </div>
  );
}