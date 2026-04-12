"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function MultiplicationGrid() {
  const [factorA, setFactorA] = useState(3);
  const [factorB, setFactorB] = useState(4);

  const result = factorA * factorB;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Grille de multiplication</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Tables de multiplication</p>

      {/* Résultat */}
      <div className="text-center mb-6">
        <span className="font-mono text-4xl font-bold text-[var(--or-ancestral)]">
          {factorA} × {factorB} = {result}
        </span>
      </div>

      {/* Grille 10×10 */}
      <div className="overflow-x-auto mb-6">
        <div
          className="grid gap-[2px] mx-auto"
          style={{
            gridTemplateColumns: `repeat(10, minmax(0, 1fr))`,
            maxWidth: "320px",
          }}
        >
          {Array.from({ length: 100 }).map((_, idx) => {
            const row = Math.floor(idx / 10) + 1;
            const col = (idx % 10) + 1;
            const isHighlighted = row <= factorA && col <= factorB;
            return (
              <motion.div
                key={idx}
                animate={{
                  backgroundColor: isHighlighted
                    ? "rgba(196,160,53,0.75)"
                    : "rgba(30,55,40,0.5)",
                  borderColor: isHighlighted
                    ? "rgba(196,160,53,0.9)"
                    : "rgba(60,90,70,0.4)",
                }}
                transition={{ duration: 0.18, delay: isHighlighted ? (row - 1) * 0.02 + (col - 1) * 0.01 : 0 }}
                className="aspect-square rounded-sm border text-[8px] font-mono flex items-center justify-center text-transparent"
              />
            );
          })}
        </div>
        <p className="text-center text-xs text-[rgba(212,221,215,0.4)] mt-2">
          {factorA} rangées × {factorB} colonnes = {result} cases
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Facteur A : {factorA}</label>
          <input
            type="range" min={1} max={10} value={factorA}
            onChange={(e) => setFactorA(Number(e.target.value))}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
        </div>
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Facteur B : {factorB}</label>
          <input
            type="range" min={1} max={10} value={factorB}
            onChange={(e) => setFactorB(Number(e.target.value))}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
