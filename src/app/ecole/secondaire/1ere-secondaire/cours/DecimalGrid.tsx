"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function DecimalGrid() {
  const [count, setCount] = useState(35);

  const decimal = (count / 100).toFixed(2);
  const fraction = `${count}/100`;
  const percent = `${count}%`;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Grille décimale 10×10</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">100 graines de palme — combien j&apos;en ai planté ?</p>

      {/* Affichage triple */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "Fraction", value: fraction },
          { label: "Décimal", value: decimal },
          { label: "Pourcentage", value: percent },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] p-3 text-center">
            <p className="text-[10px] text-[rgba(212,221,215,0.5)] mb-1">{label}</p>
            <p className="font-mono text-[var(--or-ancestral)] font-bold text-base">{value}</p>
          </div>
        ))}
      </div>

      {/* Grille 10×10 */}
      <div
        className="grid gap-[2px] mx-auto mb-6"
        style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))", maxWidth: "280px" }}
      >
        {Array.from({ length: 100 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              backgroundColor: idx < count
                ? "rgba(196,160,53,0.75)"
                : "rgba(30,55,40,0.5)",
            }}
            transition={{ duration: 0.08, delay: idx < count ? idx * 0.005 : 0 }}
            className="aspect-square rounded-[2px] border border-[rgba(60,90,70,0.3)]"
          />
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
      />
      <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </motion.div>
  );
}
