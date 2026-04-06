"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Trees,
  Users,
  Languages,
  MapPin,
  MessageCircle,
  ChevronDown,
  ChevronUp,
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
};

export default function LayerToggle({ layers, onToggle }: LayerToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = layers.filter((l) => l.visible).length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(10, 31, 21, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(196, 160, 53, 0.2)",
        minWidth: "200px",
      }}
    >
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-white/5"
        style={{
          color: "var(--or-ancestral)",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>
          Couches ({activeCount}/{layers.length})
        </span>
        {isOpen ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </button>

      {/* Liste des couches */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-2 pb-2 space-y-0.5">
              {layers.map((layer) => {
                const Icon = iconMap[layer.icon] || MapPin;
                return (
                  <button
                    key={layer.id}
                    onClick={() => onToggle(layer.id as LayerId)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                    title={layer.description}
                  >
                    {/* Toggle indicator */}
                    <div
                      className="w-8 h-5 rounded-full relative transition-colors duration-300 flex-shrink-0"
                      style={{
                        background: layer.visible
                          ? "rgba(196, 160, 53, 0.6)"
                          : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                        style={{
                          left: layer.visible ? "14px" : "2px",
                          background: layer.visible
                            ? "var(--or-ancestral)"
                            : "rgba(255, 255, 255, 0.3)",
                        }}
                      />
                    </div>

                    {/* Icon */}
                    <Icon
                      size={14}
                      style={{
                        color: layer.visible
                          ? "var(--or-ancestral)"
                          : "rgba(212, 221, 215, 0.4)",
                        flexShrink: 0,
                      }}
                    />

                    {/* Label */}
                    <div className="flex flex-col items-start min-w-0">
                      <span
                        className="text-xs font-medium truncate"
                        style={{
                          color: layer.visible
                            ? "var(--ivoire-ancien)"
                            : "rgba(212, 221, 215, 0.4)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {layer.label}
                      </span>
                      {layer.labelSkt && (
                        <span
                          className="text-[10px] italic truncate"
                          style={{
                            color: "rgba(196, 160, 53, 0.5)",
                            fontFamily: "var(--font-geist-serif)",
                          }}
                        >
                          {layer.labelSkt}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}