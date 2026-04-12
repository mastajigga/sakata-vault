"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CountingBeads() {
  const [count, setCount] = useState(7);

  const row1 = Math.min(count, 10);
  const row2 = Math.max(0, count - 10);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Abaque — Boulier</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Compte comme au marché de Inongo</p>

      {/* Nombre central */}
      <div className="text-center mb-6">
        <span className="text-6xl font-bold text-[var(--or-ancestral)] font-mono">{count}</span>
      </div>

      {/* Rangée 1 */}
      <div className="mb-4">
        <p className="text-xs text-[rgba(212,221,215,0.5)] mb-2 text-center">Rangée 1 — unités (1 à 10)</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: i < row1 ? -4 : 4,
                backgroundColor: i < row1 ? "rgba(196,160,53,0.85)" : "rgba(60,80,65,0.6)",
                borderColor: i < row1 ? "rgba(196,160,53,1)" : "rgba(120,140,125,0.3)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.03 }}
              className="w-8 h-8 rounded-full border-2 shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Rangée 2 */}
      <div className="mb-6">
        <p className="text-xs text-[rgba(212,221,215,0.5)] mb-2 text-center">Rangée 2 — dizaines (11 à 20)</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: i < row2 ? -4 : 4,
                backgroundColor: i < row2 ? "rgba(196,160,53,0.85)" : "rgba(60,80,65,0.6)",
                borderColor: i < row2 ? "rgba(196,160,53,1)" : "rgba(120,140,125,0.3)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.03 }}
              className="w-8 h-8 rounded-full border-2 shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={20}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
      />
      <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
        <span>0</span>
        <span>10</span>
        <span>20</span>
      </div>
    </motion.div>
  );
}
