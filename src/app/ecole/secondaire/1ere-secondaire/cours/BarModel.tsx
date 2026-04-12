"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BarModel() {
  const [total, setTotal] = useState(20);
  const [partA, setPartA] = useState(12);

  const partB = total - partA;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Modèle de barre</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Problèmes de partage au village</p>

      {/* Formule */}
      <div className="text-center mb-6">
        <span className="font-mono text-3xl font-bold text-[var(--or-ancestral)]">
          {partA} + {partB} = {total}
        </span>
      </div>

      {/* Barre totale */}
      <div className="mb-3">
        <p className="text-xs text-[rgba(212,221,215,0.5)] mb-1">Total</p>
        <div className="relative h-10 rounded-lg bg-[rgba(196,160,53,0.15)] border border-[rgba(196,160,53,0.35)] flex items-center justify-center">
          <span className="font-mono text-[var(--or-ancestral)] font-bold">{total}</span>
          <span className="absolute right-3 text-xs text-[rgba(212,221,215,0.4)]">= {partA} + {partB}</span>
        </div>
      </div>

      {/* Barre divisée */}
      <div className="mb-6">
        <p className="text-xs text-[rgba(212,221,215,0.5)] mb-1">Parties</p>
        <div className="flex h-10 gap-[2px] rounded-lg overflow-hidden border border-[rgba(196,160,53,0.25)]">
          <motion.div
            animate={{ flex: partA }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="bg-[rgba(196,160,53,0.55)] flex items-center justify-center min-w-[2rem]"
          >
            <span className="font-mono text-sm font-bold text-[rgba(20,10,0,0.9)]">{partA}</span>
          </motion.div>
          <motion.div
            animate={{ flex: partB }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="bg-[rgba(60,120,80,0.5)] flex items-center justify-center min-w-[2rem]"
          >
            <span className="font-mono text-sm font-bold text-[rgba(240,237,229,0.8)]">{partB}</span>
          </motion.div>
        </div>
        <div className="flex text-xs text-[rgba(212,221,215,0.4)] mt-1">
          <span className="flex-1 text-center">Partie A</span>
          <span className="flex-1 text-center">Partie B</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Total : {total}</label>
          <input
            type="range" min={2} max={50} value={total}
            onChange={(e) => {
              const t = Number(e.target.value);
              setTotal(t);
              setPartA(Math.min(partA, t - 1));
            }}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
        </div>
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Partie A : {partA}</label>
          <input
            type="range" min={1} max={total - 1} value={partA}
            onChange={(e) => setPartA(Number(e.target.value))}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
