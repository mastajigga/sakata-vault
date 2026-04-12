"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const DATA = [
  { x: 1, y: 12 }, { x: 2, y: 18 }, { x: 3, y: 15 }, { x: 4, y: 24 },
  { x: 5, y: 20 }, { x: 6, y: 28 }, { x: 7, y: 25 }, { x: 8, y: 32 },
  { x: 9, y: 29 }, { x: 10, y: 35 },
];

export default function ScatterPlot() {
  const [showTrend, setShowTrend] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const w = 320, h = 240, pad = 40;
  const xMax = 12, yMax = 40;
  const toSvg = (x: number, y: number) => ({
    sx: pad + (x / xMax) * (w - pad * 2),
    sy: h - pad - (y / yMax) * (h - pad * 2),
  });

  // Régression linéaire simple
  const n = DATA.length;
  const sumX = DATA.reduce((s, d) => s + d.x, 0);
  const sumY = DATA.reduce((s, d) => s + d.y, 0);
  const sumXY = DATA.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = DATA.reduce((s, d) => s + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const tr1 = toSvg(1, slope * 1 + intercept);
  const tr2 = toSvg(10, slope * 10 + intercept);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Nuage de points</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-4">Jours en mer vs kg pêchés — tendance générale</p>

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-xl border border-[rgba(196,160,53,0.1)] mb-4 w-full">
        <rect width={w} height={h} fill="rgba(4,17,13,0.5)" />
        {/* Axes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
        <text x={w / 2} y={h - 6} fontSize="10" fill="rgba(196,160,53,0.6)" textAnchor="middle" fontFamily="monospace">Jours en mer</text>
        <text x={10} y={h / 2} fontSize="10" fill="rgba(196,160,53,0.6)" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90, 10, ${h / 2})`}>kg pêchés</text>
        {/* Droite de tendance */}
        {showTrend && (
          <motion.line x1={tr1.sx} y1={tr1.sy} x2={tr2.sx} y2={tr2.sy}
            stroke="rgba(100,200,140,0.7)" strokeWidth="2" strokeDasharray="6,3"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6 }} />
        )}
        {/* Points */}
        {DATA.map((d, i) => {
          const { sx, sy } = toSvg(d.x, d.y);
          return (
            <motion.g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <circle cx={sx} cy={sy} r={hovered === i ? 8 : 5}
                fill={hovered === i ? "var(--or-ancestral)" : "rgba(196,160,53,0.7)"}
                stroke={hovered === i ? "var(--ivoire-ancien)" : "none"} strokeWidth="1.5" />
              {hovered === i && (
                <text x={sx + 10} y={sy - 8} fontSize="10" fill="var(--ivoire-ancien)" fontFamily="monospace">
                  ({d.x}j, {d.y}kg)
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      <button onClick={() => setShowTrend(t => !t)}
        className={`w-full rounded-xl py-2 text-sm font-medium transition-all border ${showTrend ? "bg-[rgba(100,200,140,0.12)] border-[rgba(100,200,140,0.4)] text-[rgba(100,200,140,0.9)]" : "bg-[rgba(196,160,53,0.08)] border-[rgba(196,160,53,0.25)] text-[var(--or-ancestral)]"}`}>
        {showTrend ? "Masquer la tendance" : "Afficher la droite de tendance"}
      </button>
    </motion.div>
  );
}
