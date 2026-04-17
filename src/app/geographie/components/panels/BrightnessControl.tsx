"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface BrightnessControlProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
}

const BrightnessControl: React.FC<BrightnessControlProps> = ({
  brightness,
  onBrightnessChange,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-or-ancestral/60">
            Éclat du Ciel
          </span>
          <span className="text-[11px] font-semibold text-ivoire-ancien/90">Luminosité du Monde</span>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
          {brightness < 50 ? (
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-or-ancestral" />
          )}
        </div>
      </div>

      {/* Slider & Meter */}
      <div className="space-y-3">
        <div className="relative h-6 flex items-center">
          <div className="absolute inset-x-0 h-[2px] bg-white/10 rounded-full" />
          <div 
            className="absolute left-0 h-[2px] bg-or-ancestral shadow-[0_0_10px_rgba(196,160,53,0.3)] transition-all duration-300"
            style={{ width: `${brightness}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute w-3 h-3 rounded-full bg-or-ancestral border-2 border-[var(--foret-nocturne)] shadow-lg pointer-events-none transition-all duration-300"
            style={{ left: `calc(${brightness}% - 6px)` }}
          />
        </div>

        <div className="flex justify-between items-end">
          <span className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Nocturne</span>
          <span className="text-[14px] font-mono font-bold text-or-ancestral">{brightness}%</span>
          <span className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Solaire</span>
        </div>
      </div>

      {/* Quick presets - Integrated style */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/20 border border-white/5">
        {[
          { label: "Nuit", value: 15 },
          { label: "Aube", value: 40 },
          { label: "Jour", value: 75 },
          { label: "Zénith", value: 100 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onBrightnessChange(preset.value)}
            className={`text-[8px] font-medium py-1.5 px-1 rounded-lg transition-all duration-300 border ${
              brightness === preset.value
                ? "bg-or-ancestral/10 border-or-ancestral/20 text-or-ancestral"
                : "bg-transparent border-transparent text-ivoire-ancien/40 hover:bg-white/5"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrightnessControl;