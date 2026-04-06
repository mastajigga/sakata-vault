"use client";

import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const LEGEND_ITEMS = [
  {
    category: "Hydrographie",
    items: [
      { color: "#0C2920", label: "Rivières & cours d'eau", type: "line" },
      { color: "#1a4a5a", label: "Lac Mai-Ndombe", type: "fill" },
    ],
  },
  {
    category: "Chefferies",
    items: [
      { color: "#C4A035", label: "Mabie (Ndwakombe)", type: "fill" },
      { color: "#B87333", label: "Mbamushie (Mongobele)", type: "fill" },
      { color: "#8B6914", label: "Mbantin (Kempa)", type: "fill" },
      { color: "#A0522D", label: "Lemvia-Nord (Mbaizakwi)", type: "fill" },
      { color: "#CD853F", label: "Batere (Nsobie)", type: "fill" },
      { color: "#D2691E", label: "Lemvia-Sud (Ikoko)", type: "fill" },
      { color: "#DEB887", label: "Nduele (Nselekoko)", type: "fill" },
    ],
  },
  {
    category: "Localités",
    items: [
      { color: "#F0EDE5", label: "Villages", type: "circle" },
      { color: "#C4A035", label: "Ports historiques", type: "circle" },
    ],
  },
  {
    category: "Sous-tribus",
    items: [
      { color: "rgba(196, 160, 53, 0.2)", label: "Territoires claniques", type: "fill" },
    ],
  },
];

interface LegendPanelProps {
  className?: string;
}

export default function LegendPanel({ className = "" }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-xl overflow-hidden backdrop-blur-md ${className}`}
      style={{
        background: "rgba(10, 31, 21, 0.85)",
        border: "1px solid rgba(196, 160, 53, 0.15)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: "var(--or-ancestral, #C4A035)" }} />
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "var(--or-ancestral, #C4A035)" }}
          >
            Légende
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 opacity-50" style={{ color: "var(--brume-matinale, #D4DDD7)" }} />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-50" style={{ color: "var(--brume-matinale, #D4DDD7)" }} />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 max-h-96 overflow-y-auto">
          {LEGEND_ITEMS.map((category) => (
            <div key={category.category}>
              <h4
                className="text-[9px] font-bold tracking-[0.15em] uppercase mb-2 opacity-60"
                style={{ color: "var(--brume-matinale, #D4DDD7)" }}
              >
                {category.category}
              </h4>
              <div className="space-y-1.5">
                {category.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.type === "line" && (
                      <div
                        className="w-6 h-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    {item.type === "fill" && (
                      <div
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    {item.type === "circle" && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--ivoire-ancien, #F0EDE5)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Info box */}
          <div
            className="mt-4 p-3 rounded-lg text-[9px] leading-relaxed"
            style={{
              background: "rgba(196, 160, 53, 0.08)",
              border: "1px solid rgba(196, 160, 53, 0.15)",
              color: "var(--brume-matinale, #D4DDD7)",
            }}
          >
            <p className="font-bold mb-1" style={{ color: "var(--or-ancestral, #C4A035)" }}>
              Territoire de Kutu
            </p>
            <p>~18 000 km² • 7 chefferies • ~300 000 habitants</p>
            <p className="mt-1">Province Mai-Ndombe, RDC</p>
          </div>
        </div>
      )}
    </div>
  );
}