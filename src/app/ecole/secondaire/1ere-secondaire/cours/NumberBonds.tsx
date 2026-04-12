"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NumberBonds() {
  const [total, setTotal] = useState(7);
  const [split, setSplit] = useState(3);

  const partA = split;
  const partB = total - split;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Ponts numériques</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Partager les poissons en deux paniers</p>

      {/* Diagramme SVG */}
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 300 200" className="w-full max-w-xs" aria-label="Ponts numériques">
          {/* Cercle central */}
          <circle cx="150" cy="50" r="36" fill="rgba(196,160,53,0.15)" stroke="rgba(196,160,53,0.5)" strokeWidth="2" />
          <text x="150" y="56" textAnchor="middle" fontSize="22" fontWeight="bold" fill="rgba(240,237,229,0.95)" fontFamily="'Geist Mono', monospace">{total}</text>

          {/* Lignes */}
          <line x1="115" y1="75" x2="75" y2="145" stroke="rgba(196,160,53,0.4)" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="185" y1="75" x2="225" y2="145" stroke="rgba(196,160,53,0.4)" strokeWidth="2" strokeDasharray="4 2" />

          {/* Cercle gauche (partie A) */}
          <motion.circle
            cx="70" cy="160" r="30"
            fill="rgba(60,100,75,0.5)"
            stroke="rgba(100,180,130,0.5)"
            strokeWidth="2"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 0.4, delay: 0.1 }}
            key={partA}
          />
          <motion.text
            x="70" y="166"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="rgba(240,237,229,0.9)"
            fontFamily="'Geist Mono', monospace"
            key={`a-${partA}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >{partA}</motion.text>

          {/* Cercle droit (partie B) */}
          <motion.circle
            cx="230" cy="160" r="30"
            fill="rgba(60,100,75,0.5)"
            stroke="rgba(100,180,130,0.5)"
            strokeWidth="2"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 0.4, delay: 0.1 }}
            key={partB}
          />
          <motion.text
            x="230" y="166"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="rgba(240,237,229,0.9)"
            fontFamily="'Geist Mono', monospace"
            key={`b-${partB}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >{partB}</motion.text>
        </svg>
      </div>

      {/* Formule */}
      <div className="text-center mb-6">
        <p className="text-lg font-mono text-[var(--or-ancestral)]">
          {partA} + {partB} = {total}
        </p>
      </div>

      {/* Slider décomposition */}
      <div className="mb-4">
        <label className="text-xs text-[rgba(212,221,215,0.6)] mb-2 block">Ajuster la décomposition : {partA} + {partB}</label>
        <input
          type="range"
          min={0}
          max={total}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
        />
      </div>

      {/* Slider total */}
      <div>
        <label className="text-xs text-[rgba(212,221,215,0.6)] mb-2 block">Changer le total (2–20) : {total}</label>
        <input
          type="range"
          min={2}
          max={20}
          value={total}
          onChange={(e) => {
            const newTotal = Number(e.target.value);
            setTotal(newTotal);
            setSplit(Math.min(split, newTotal));
          }}
          className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
        />
      </div>
    </motion.div>
  );
}
