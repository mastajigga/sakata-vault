"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SHAPES = [
  {
    id: "circle",
    name: "Cercle",
    sides: 0,
    angles: "Aucun angle",
    symmetries: "Infinies",
    example: "Le tambour",
    svg: <circle cx="50" cy="50" r="40" />,
  },
  {
    id: "square",
    name: "Carré",
    sides: 4,
    angles: "4 angles droits (90°)",
    symmetries: "4",
    example: "Le panier carré",
    svg: <rect x="10" y="10" width="80" height="80" />,
  },
  {
    id: "triangle",
    name: "Triangle",
    sides: 3,
    angles: "3 angles",
    symmetries: "3",
    example: "Le toit de la case",
    svg: <polygon points="50,10 90,90 10,90" />,
  },
  {
    id: "rectangle",
    name: "Rectangle",
    sides: 4,
    angles: "4 angles droits (90°)",
    symmetries: "2",
    example: "La porte de la maison",
    svg: <rect x="5" y="20" width="90" height="60" />,
  },
];

export default function ShapeExplorer() {
  const [selected, setSelected] = useState(SHAPES[0]);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Explorateur de formes</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Clique sur une forme pour découvrir ses propriétés</p>

      {/* Formes */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {SHAPES.map((shape) => {
          const isActive = selected.id === shape.id;
          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => setSelected(shape)}
              className="flex flex-col items-center gap-2 focus:outline-none"
            >
              <motion.div
                animate={{
                  borderColor: isActive ? "rgba(196,160,53,0.8)" : "rgba(196,160,53,0.2)",
                  backgroundColor: isActive ? "rgba(196,160,53,0.12)" : "rgba(20,44,35,0.3)",
                  scale: isActive ? 1.06 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-full aspect-square rounded-xl border p-2"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.g
                    animate={{
                      fill: isActive ? "rgba(196,160,53,0.5)" : "rgba(100,160,120,0.3)",
                      stroke: isActive ? "rgba(196,160,53,0.9)" : "rgba(130,190,150,0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                    strokeWidth="3"
                    fillRule="evenodd"
                  >
                    {shape.svg}
                  </motion.g>
                </svg>
              </motion.div>
              <span className="text-xs text-[rgba(212,221,215,0.6)]">{shape.name}</span>
            </button>
          );
        })}
      </div>

      {/* Panneau d'info */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl bg-[rgba(196,160,53,0.07)] border border-[rgba(196,160,53,0.2)] p-4 space-y-2"
      >
        <p className="font-bold text-[var(--or-ancestral)] text-base">{selected.name}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-[rgba(212,221,215,0.5)]">Côtés :</span>
          <span className="text-[rgba(212,221,215,0.85)]">{selected.sides === 0 ? "0 (courbe)" : selected.sides}</span>
          <span className="text-[rgba(212,221,215,0.5)]">Angles :</span>
          <span className="text-[rgba(212,221,215,0.85)]">{selected.angles}</span>
          <span className="text-[rgba(212,221,215,0.5)]">Symétries :</span>
          <span className="text-[rgba(212,221,215,0.85)]">{selected.symmetries}</span>
          <span className="text-[rgba(212,221,215,0.5)]">Exemple :</span>
          <span className="text-[var(--or-ancestral)]">{selected.example}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
