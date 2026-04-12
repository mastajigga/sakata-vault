"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BARS = [
  { denominator: 1, label: "1 entier" },
  { denominator: 2, label: "Moitiés" },
  { denominator: 3, label: "Tiers" },
  { denominator: 4, label: "Quarts" },
];

export default function FractionBar() {
  const [selected, setSelected] = useState<{ barIdx: number; parts: number } | null>({
    barIdx: 1,
    parts: 1,
  });

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Barres de fractions</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Partager le manioc en parts égales</p>

      {/* Barres */}
      <div className="space-y-3 mb-6">
        {BARS.map((bar, barIdx) => {
          const isActive = selected?.barIdx === barIdx;
          const activeParts = isActive ? (selected?.parts ?? 0) : 0;

          return (
            <div key={barIdx}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[rgba(212,221,215,0.5)] w-16">{bar.label}</span>
                <div className="flex flex-1 gap-[2px] h-8">
                  {Array.from({ length: bar.denominator }).map((_, partIdx) => {
                    const filled = isActive && partIdx < activeParts;
                    return (
                      <motion.button
                        key={partIdx}
                        type="button"
                        onClick={() => {
                          const newParts = partIdx + 1;
                          setSelected({ barIdx, parts: newParts });
                        }}
                        animate={{
                          backgroundColor: filled
                            ? "rgba(196,160,53,0.75)"
                            : "rgba(30,55,40,0.6)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 rounded border border-[rgba(196,160,53,0.3)] hover:border-[rgba(196,160,53,0.6)] transition-colors cursor-pointer"
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-mono text-[var(--or-ancestral)] w-12 text-right">
                  {isActive && activeParts > 0
                    ? `${activeParts}/${bar.denominator}`
                    : `1/${bar.denominator}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info sélection */}
      {selected && (
        <motion.div
          key={`${selected.barIdx}-${selected.parts}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] px-4 py-3 text-center"
        >
          <p className="font-mono text-[var(--or-ancestral)] text-lg font-bold">
            {selected.parts}/{BARS[selected.barIdx].denominator}
          </p>
          <p className="text-xs text-[rgba(212,221,215,0.5)] mt-1">
            {selected.parts} part{selected.parts > 1 ? "s" : ""} sur {BARS[selected.barIdx].denominator} — {BARS[selected.barIdx].label}
          </p>
          {BARS[selected.barIdx].denominator === 4 && selected.parts === 2 && (
            <p className="text-xs text-[rgba(196,160,53,0.8)] mt-1">2/4 = 1/2</p>
          )}
        </motion.div>
      )}

      <p className="text-xs text-[rgba(212,221,215,0.4)] mt-4 text-center">
        Clique sur une case pour colorer les parts
      </p>
    </motion.div>
  );
}
