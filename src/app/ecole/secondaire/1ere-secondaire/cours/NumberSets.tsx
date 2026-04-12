"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const SETS = [
  { id: "R", label: "ℝ", name: "Réels", color: "rgba(196,160,53,0.12)", border: "rgba(196,160,53,0.4)", r: 170, examples: "π, √2, 0,333..., −7,5", desc: "Tous les nombres sur la droite numérique" },
  { id: "Q", label: "ℚ", name: "Rationnels", color: "rgba(100,180,120,0.12)", border: "rgba(100,180,120,0.5)", r: 130, examples: "1/2, 3/4, −2/5, 0,25", desc: "Fractions de deux entiers (b ≠ 0)" },
  { id: "Z", label: "ℤ", name: "Entiers relatifs", color: "rgba(80,140,200,0.12)", border: "rgba(80,140,200,0.5)", r: 90, examples: "−3, −1, 0, 1, 5, 100", desc: "Entiers positifs, négatifs et zéro" },
  { id: "N", label: "ℕ", name: "Naturels", color: "rgba(160,100,200,0.15)", border: "rgba(160,100,200,0.5)", r: 50, examples: "0, 1, 2, 3, 4, 5...", desc: "Entiers pour compter, positifs et zéro" },
];

export default function NumberSets() {
  const [active, setActive] = useState<string | null>(null);
  const cx = 180, cy = 185;
  const activeSet = SETS.find(s => s.id === active);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Ensembles de nombres</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Clique sur un cercle pour voir les exemples — ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</p>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <svg width="360" height="370" viewBox="0 0 360 370" className="shrink-0">
          {SETS.map((s, i) => (
            <motion.g key={s.id} onClick={() => setActive(active === s.id ? null : s.id)}
              style={{ cursor: "pointer" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
            >
              <circle cx={cx} cy={cy} r={s.r}
                fill={active === s.id ? s.color.replace("0.12", "0.25").replace("0.15", "0.3") : s.color}
                stroke={s.border} strokeWidth={active === s.id ? 2.5 : 1.5}
              />
              <text x={cx} y={cy - s.r + 22} textAnchor="middle"
                fontSize="18" fontWeight="bold" fill={s.border} fontFamily="serif">
                {s.label}
              </text>
            </motion.g>
          ))}
          {/* Label ℕ au centre */}
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="22" fontWeight="bold"
            fill="rgba(160,100,200,0.8)" fontFamily="serif" style={{ pointerEvents: "none" }}>ℕ</text>
        </svg>

        <div className="flex-1 min-h-[160px]">
          {activeSet ? (
            <motion.div key={activeSet.id}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-[rgba(196,160,53,0.2)] bg-[rgba(196,160,53,0.06)] p-5"
            >
              <p className="text-2xl font-bold mb-1" style={{ color: activeSet.border }}>{activeSet.label} — {activeSet.name}</p>
              <p className="text-sm text-[rgba(212,221,215,0.7)] mb-3">{activeSet.desc}</p>
              <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[rgba(212,221,215,0.45)] mb-1">Exemples</p>
              <p className="font-mono text-[var(--ivoire-ancien)]">{activeSet.examples}</p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-[rgba(212,221,215,0.4)] text-center">← Clique sur un cercle<br/>pour voir les exemples</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
