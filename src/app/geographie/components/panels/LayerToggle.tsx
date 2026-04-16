"use client";

import React from "react";
import {
  Droplets,
  Trees,
  Users,
  Languages,
  MapPin,
  MessageCircle,
  Map,
  Layers,
} from "lucide-react";
import type { LayerState, LayerId } from "../../hooks/useLayerVisibility";

interface LayerToggleProps {
  layers: LayerState[];
  onToggle: (id: LayerId) => void;
}

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  trees: Trees,
  users: Users,
  languages: Languages,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  map: Map,
};

export default function LayerToggle({ layers, onToggle }: LayerToggleProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-or-ancestral/60" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            Matrices & Calques
          </span>
        </div>
      </div>

      {/* Grid of Toggles */}
      <div className="grid grid-cols-1 gap-2">
        {layers.map((layer) => {
          const Icon = iconMap[layer.icon] || MapPin;
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id as LayerId)}
              className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${
                layer.visible
                  ? "bg-or-ancestral/5 border-or-ancestral/20"
                  : "bg-black/20 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  layer.visible ? "bg-or-ancestral text-foret-nocturne" : "bg-white/5 text-ivoire-ancien/40"
                }`}>
                  <Icon size={14} />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[11px] font-medium transition-colors ${
                    layer.visible ? "text-ivoire-ancien" : "text-ivoire-ancien/40"
                  }`}>
                    {layer.label}
                  </span>
                  {layer.labelSkt && (
                    <span className="text-[9px] italic text-or-ancestral/40 leading-none">
                      {layer.labelSkt}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px] ${
                layer.visible 
                  ? "bg-or-ancestral shadow-or-ancestral/50 scale-125" 
                  : "bg-white/10 shadow-transparent scale-100"
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}