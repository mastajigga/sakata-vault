"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const CLASSES = ["0–5 kg", "5–10 kg", "10–15 kg", "15–20 kg", "20–25 kg", "25–30 kg"];
const INIT = [4, 9, 14, 7, 3, 1];

export default function Histogram() {
  const [vals, setVals] = useState(INIT);
  const total = vals.reduce((a, b) => a + b, 0);
  const max = Math.max(...vals, 1);
  const mean = vals.reduce((s, v, i) => s + v * (i * 5 + 2.5), 0) / (total || 1);
  const mode = CLASSES[vals.indexOf(Math.max(...vals))];

  const change = (i: number, delta: number) =>
    setVals(v => v.map((x, j) => j === i ? Math.max(0, Math.min(20, x + delta)) : x));

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Histogramme — Poids des prises</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-5">Clique ＋/− pour ajuster les fréquences</p>

      <div className="flex items-end gap-2 h-44 mb-2">
        {vals.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[0.6rem] text-[rgba(212,221,215,0.6)]">{v}</span>
            <motion.div
              className="w-full rounded-t-md bg-[rgba(196,160,53,0.55)] border-t border-[rgba(196,160,53,0.7)]"
              animate={{ height: `${(v / max) * 130}px` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ minHeight: 4 }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        {CLASSES.map((c, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <p className="text-[0.55rem] text-center text-[rgba(212,221,215,0.5)] leading-tight">{c}</p>
            <div className="flex gap-0.5">
              <button onClick={() => change(i, 1)} className="w-4 h-4 rounded bg-[rgba(196,160,53,0.15)] text-[var(--or-ancestral)] text-[0.6rem] hover:bg-[rgba(196,160,53,0.3)] transition-all">+</button>
              <button onClick={() => change(i, -1)} className="w-4 h-4 rounded bg-[rgba(212,221,215,0.05)] text-[rgba(212,221,215,0.5)] text-[0.6rem] hover:bg-[rgba(212,221,215,0.1)] transition-all">−</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[["Total", `${total} pêches`], ["Moyenne", `≈ ${mean.toFixed(1)} kg`], ["Classe modale", mode]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-[rgba(196,160,53,0.07)] border border-[rgba(196,160,53,0.15)] p-3 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(212,221,215,0.45)] mb-1">{k}</p>
            <p className="text-sm font-bold text-[var(--ivoire-ancien)]">{v}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
