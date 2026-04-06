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
    <div
      className="absolute bottom-6 left-6 z-20 rounded-xl p-4 backdrop-blur-md"
      style={{
        background: "rgba(10, 31, 21, 0.85)",
        border: "1px solid rgba(196, 160, 53, 0.15)",
        minWidth: "200px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color: "var(--or-ancestral, #C4A035)" }}
        >
          Luminosité
        </span>
        <div className="flex items-center gap-1.5">
          <Moon className="w-3 h-3 opacity-50" style={{ color: "var(--brume-matinale, #D4DDD7)" }} />
          <Sun className="w-3 h-3 opacity-50" style={{ color: "var(--or-ancestral, #C4A035)" }} />
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={(e) => onBrightnessChange(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--eau-sombre, #0C2920) 0%, var(--or-ancestral, #C4A035) ${brightness}%, var(--brume-matinale, #D4DDD7) ${brightness}%, var(--brume-matinale, #D4DDD7) 100%)`,
          }}
        />
      </div>

      {/* Value display */}
      <div className="flex justify-between mt-2">
        <span className="text-[9px] opacity-40" style={{ color: "var(--brume-matinale, #D4DDD7)" }}>
          Nuit
        </span>
        <span
          className="text-[9px] font-mono"
          style={{ color: "var(--or-ancestral, #C4A035)" }}
        >
          {brightness}%
        </span>
        <span className="text-[9px] opacity-40" style={{ color: "var(--brume-matinale, #D4DDD7)" }}>
          Jour
        </span>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
        {[
          { label: "Nuit", value: 15 },
          { label: "Aube", value: 40 },
          { label: "Jour", value: 75 },
          { label: "Zénith", value: 100 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onBrightnessChange(preset.value)}
            className="flex-1 text-[8px] font-medium py-1 px-2 rounded transition-all"
            style={{
              background:
                brightness === preset.value
                  ? "rgba(196, 160, 53, 0.2)"
                  : "rgba(255, 255, 255, 0.03)",
              color:
                brightness === preset.value
                  ? "var(--or-ancestral, #C4A035)"
                  : "var(--brume-matinale, #D4DDD7)",
              opacity: brightness === preset.value ? 1 : 0.5,
              border:
                brightness === preset.value
                  ? "1px solid rgba(196, 160, 53, 0.3)"
                  : "1px solid transparent",
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrightnessControl;