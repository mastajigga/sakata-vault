"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlgebraicTiles() {
  const [x2, setX2] = useState(1);
  const [x, setX] = useState(3);
  const [u, setU] = useState(2);

  const expr =
    (x2 > 0 ? `${x2 > 1 ? x2 : ""}x²` : "") +
    (x > 0 ? ` + ${x > 1 ? x : ""}x` : "") +
    (u > 0 ? ` + ${u}` : "") ||
    "0";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Tuiles algébriques</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-5">Chaque tuile représente un terme du polynôme</p>

      {/* Zone de tuiles */}
      <div className="min-h-[100px] rounded-2xl bg-[rgba(4,17,13,0.4)] border border-[rgba(196,160,53,0.1)] p-4 flex flex-wrap gap-3 items-end mb-5">
        <AnimatePresence>
          {Array.from({ length: x2 }).map((_, i) => (
            <motion.div key={`x2-${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="w-14 h-14 rounded-lg bg-[rgba(80,140,200,0.25)] border-2 border-[rgba(80,140,200,0.6)] flex items-center justify-center text-[rgba(80,140,200,0.9)] font-bold text-lg">
              x²
            </motion.div>
          ))}
          {Array.from({ length: x }).map((_, i) => (
            <motion.div key={`x-${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="w-8 h-14 rounded-lg bg-[rgba(100,180,120,0.25)] border-2 border-[rgba(100,180,120,0.6)] flex items-center justify-center text-[rgba(100,180,120,0.9)] font-bold">
              x
            </motion.div>
          ))}
          {Array.from({ length: u }).map((_, i) => (
            <motion.div key={`u-${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              className="w-8 h-8 rounded-md bg-[rgba(196,160,53,0.25)] border-2 border-[rgba(196,160,53,0.6)] flex items-center justify-center text-[var(--or-ancestral)] font-bold text-sm">
              1
            </motion.div>
          ))}
        </AnimatePresence>
        {x2 === 0 && x === 0 && u === 0 && (
          <p className="text-sm text-[rgba(212,221,215,0.3)]">Ajoute des tuiles avec les curseurs ↓</p>
        )}
      </div>

      {/* Expression */}
      <div className="rounded-xl bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] p-3 text-center mb-5">
        <p className="font-mono text-xl text-[var(--ivoire-ancien)]">{expr.trim().replace(/^\+\s*/, "")}</p>
      </div>

      {/* Contrôles */}
      <div className="space-y-3">
        {([["x² (bleu)", x2, setX2, 3, "rgba(80,140,200,0.7)"], ["x (vert)", x, setX, 6, "rgba(100,180,120,0.7)"], ["1 (or)", u, setU, 9, "var(--or-ancestral)"]] as [string, number, (v: number) => void, number, string][]).map(([label, val, set, max, color]) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-[rgba(212,221,215,0.7)]">{label}</label>
              <span className="text-sm font-bold" style={{ color }}>{val}</span>
            </div>
            <input type="range" min="0" max={max} step="1" value={val} onChange={e => set(+e.target.value)}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
