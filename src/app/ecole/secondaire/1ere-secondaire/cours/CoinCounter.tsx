"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const COINS = [50, 25, 10, 5, 1];

function makeChange(target: number): Record<number, number> {
  const result: Record<number, number> = { 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 };
  let remaining = target;
  for (const coin of COINS) {
    result[coin] = Math.floor(remaining / coin);
    remaining = remaining % coin;
  }
  return result;
}

const COIN_COLORS: Record<number, string> = {
  50: "rgba(196,160,53,0.9)",
  25: "rgba(180,140,40,0.85)",
  10: "rgba(160,120,35,0.8)",
  5:  "rgba(130,100,30,0.75)",
  1:  "rgba(100,80,25,0.7)",
};

export default function CoinCounter() {
  const [target, setTarget] = useState(37);

  const change = useMemo(() => makeChange(target), [target]);
  const total = COINS.reduce((sum, c) => sum + change[c] * c, 0);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Compteur de pièces</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Payer au marché de la rivière</p>

      {/* Valeur cible */}
      <div className="text-center mb-6">
        <span className="font-mono text-5xl font-bold text-[var(--or-ancestral)]">{target} F</span>
        <p className="text-xs text-[rgba(212,221,215,0.5)] mt-1">Total payé : {total} F</p>
      </div>

      {/* Affichage des pièces */}
      <div className="space-y-3 mb-6">
        {COINS.map((coin) => (
          <div key={coin} className="flex items-center gap-3">
            <span className="text-xs font-mono text-[rgba(212,221,215,0.6)] w-10 text-right">{coin} F</span>
            <div className="flex flex-wrap gap-1 flex-1">
              {Array.from({ length: change[coin] }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 rounded-full border flex items-center justify-center shadow-md"
                  style={{
                    backgroundColor: COIN_COLORS[coin],
                    borderColor: "rgba(240,220,100,0.4)",
                  }}
                >
                  <span className="text-[8px] font-bold text-[rgba(20,10,0,0.9)]">{coin}</span>
                </motion.div>
              ))}
              {change[coin] === 0 && (
                <span className="text-xs text-[rgba(212,221,215,0.25)] italic">—</span>
              )}
            </div>
            <span className="text-xs font-mono text-[rgba(212,221,215,0.5)] w-12 text-right">
              {change[coin] > 0 ? `×${change[coin]}` : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={100}
        value={target}
        onChange={(e) => setTarget(Number(e.target.value))}
        className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
      />
      <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
        <span>1 F</span>
        <span>50 F</span>
        <span>100 F</span>
      </div>
    </motion.div>
  );
}
