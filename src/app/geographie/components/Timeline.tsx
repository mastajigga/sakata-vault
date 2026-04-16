"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronRight, ChevronLeft } from "lucide-react";

const ERAS = [
  { id: "pre", label: "Origines", period: "IXe - XIVe", desc: "Migrations ancestrales depuis les grands lacs vers le bassin du Congo." },
  { id: "king", label: "Royaumes", period: "XVe - XIXe", desc: "Âge d'or des chefferies Sakata et structuration sociale autour des rivières." },
  { id: "col", label: "Contact", period: "1880 - 1960", desc: "Période de mutation culturelle et administrative sous l'ère coloniale." },
  { id: "mod", label: "Présent", period: "1960 - 2026", desc: "Préservation numérique et renaissance de l'identité Sakata moderne." },
];

interface TimelineProps {
  onEraChange?: (eraId: string) => void;
}

const Timeline = ({ onEraChange }: TimelineProps) => {
  const [activeEra, setActiveEra] = useState("mod");

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-or-ancestral/10 border border-or-ancestral/20 flex items-center justify-center text-or-ancestral">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest text-ivoire-ancien uppercase">Chronologie</h3>
            <p className="text-[9px] text-or-ancestral/50 font-mono uppercase">Échelles de Temps</p>
          </div>
        </div>

        <div className="flex gap-2">
            <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-ivoire-ancien/30 hover:text-ivoire-ancien transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-ivoire-ancien/30 hover:text-ivoire-ancien transition-colors">
              <ChevronRight size={14} />
            </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-1 px-2">
        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => {
                setActiveEra(era.id);
                onEraChange?.(era.id);
              }}
              className="group relative flex-1 flex flex-col items-center outline-none"
            >
              {/* Line indicator */}
              <div className="w-full px-2 mb-4">
                 <div className={`h-[2px] transition-all duration-700 rounded-full ${
                   isActive ? "bg-or-ancestral shadow-[0_0_15px_rgba(196,160,53,0.5)]" : "bg-white/10"
                 }`} />
              </div>
              
              <span className={`text-[10px] font-mono tracking-tighter mb-1 transition-colors duration-300 ${
                isActive ? "text-or-ancestral" : "text-white/20"
              }`}>
                {era.period}
              </span>

              <span className={`text-[11px] font-bold tracking-wide transition-all duration-300 ${
                isActive ? "text-ivoire-ancien scale-110" : "text-ivoire-ancien/30 group-hover:text-ivoire-ancien/50"
              }`}>
                {era.label}
              </span>

              {/* Active Marker */}
              {isActive && (
                <motion.div
                  layoutId="activePointer"
                  className="absolute -top-1 w-2 h-2 rounded-full bg-or-ancestral animate-pulse"
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Description Panel */}
      <div className="mt-4 mx-4 p-3 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-or-ancestral/20 group-hover:bg-or-ancestral transition-colors duration-500" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEra}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-1"
          >
            <p className="text-[10px] text-ivoire-ancien uppercase tracking-widest font-bold">
               Chroniques des {ERAS.find(e => e.id === activeEra)?.label}
            </p>
            <p className="text-[11px] leading-relaxed text-ivoire-ancien/60 italic font-body">
              {ERAS.find(e => e.id === activeEra)?.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timeline;
