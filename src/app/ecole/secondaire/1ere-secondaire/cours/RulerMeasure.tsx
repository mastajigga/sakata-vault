"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RulerMeasure() {
  const [length, setLength] = useState(14);

  const rulerWidth = 560; // viewBox width for 30 cm
  const cmToPx = rulerWidth / 30;
  const objectWidth = length * cmToPx;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Règle interactive</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Mesurer la pirogue de pêche</p>

      {/* Résultat */}
      <div className="text-center mb-6">
        <span className="font-mono text-5xl font-bold text-[var(--or-ancestral)]">{length} cm</span>
      </div>

      {/* Règle SVG */}
      <div className="overflow-x-auto mb-6">
        <svg viewBox="0 0 580 130" className="w-full min-w-[300px]" aria-label={`Règle mesurant ${length} cm`}>
          {/* Corps de la règle */}
          <rect x="10" y="60" width={rulerWidth} height="36" rx="4"
            fill="rgba(196,160,53,0.08)" stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />

          {/* Graduations */}
          {Array.from({ length: 31 }).map((_, i) => {
            const x = 10 + i * cmToPx;
            const isMajor = i % 5 === 0;
            return (
              <g key={i}>
                <line x1={x} y1="60" x2={x} y2={isMajor ? "48" : "54"}
                  stroke="rgba(212,221,215,0.5)" strokeWidth={isMajor ? 1.5 : 1} />
                {isMajor && (
                  <text x={x} y="44" textAnchor="middle" fontSize="9"
                    fill="rgba(212,221,215,0.55)" fontFamily="'Geist Mono', monospace">{i}</text>
                )}
                {/* mm */}
                {Array.from({ length: 9 }).map((_, j) => {
                  const xmm = x + (j + 1) * (cmToPx / 10);
                  if (xmm > 10 + rulerWidth) return null;
                  return (
                    <line key={j} x1={xmm} y1="60" x2={xmm} y2="63"
                      stroke="rgba(212,221,215,0.2)" strokeWidth="0.7" />
                  );
                })}
              </g>
            );
          })}

          {/* Pirogue — l'objet mesuré */}
          <motion.g
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* Corps pirogue */}
            <motion.ellipse
              cx={10 + objectWidth / 2}
              cy="105"
              rx={Math.max(objectWidth / 2, 4)}
              ry="14"
              fill="rgba(80,50,20,0.7)"
              stroke="rgba(196,160,53,0.5)"
              strokeWidth="1.5"
              animate={{ rx: Math.max(objectWidth / 2, 4) }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
            <text x={10 + objectWidth / 2} y="109" textAnchor="middle"
              fontSize="9" fill="rgba(240,237,229,0.6)" fontFamily="sans-serif">🛶</text>
          </motion.g>

          {/* Flèche de mesure animée */}
          <motion.g
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* Flèche double */}
            <motion.line
              x1={10}
              y1="76"
              x2={10 + objectWidth}
              y2="76"
              stroke="rgba(196,160,53,0.7)"
              strokeWidth="1.5"
              animate={{ x2: 10 + objectWidth }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
            {/* Pointe gauche */}
            <polygon points={`10,73 10,79 5,76`} fill="rgba(196,160,53,0.7)" />
            {/* Pointe droite animée */}
            <motion.polygon
              animate={{ points: `${10 + objectWidth},73 ${10 + objectWidth},79 ${15 + objectWidth},76` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              fill="rgba(196,160,53,0.7)"
            />
          </motion.g>
        </svg>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={30}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
      />
      <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
        <span>1 cm</span>
        <span>15 cm</span>
        <span>30 cm</span>
      </div>
    </motion.div>
  );
}
