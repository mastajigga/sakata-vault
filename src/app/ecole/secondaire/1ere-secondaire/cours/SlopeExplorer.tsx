"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SlopeExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);

  const size = 300, cell = 30, ox = size / 2, oy = size / 2;
  const toSvg = (x: number, y: number) => ({ sx: ox + x * cell, sy: oy - y * cell });
  const getY = (x: number) => a * x + b;
  const p1 = toSvg(-4.5, getY(-4.5));
  const p2 = toSvg(4.5, getY(4.5));

  // Triangle de pente entre x=1 et x=2
  const t1 = toSvg(1, getY(1));
  const t2 = toSvg(2, getY(1));
  const t3 = toSvg(2, getY(2));

  const slopeLabel = a > 0 ? "Croissante ↗" : a < 0 ? "Décroissante ↘" : "Horizontale →";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Explorateur de pente</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-4">La pente indique de combien monte (ou descend) la droite par pas de 1</p>

      <div className="flex flex-col items-center gap-5">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl border border-[rgba(196,160,53,0.1)]">
          <rect width={size} height={size} fill="rgba(4,17,13,0.5)" />
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <line x1={i * cell} y1={0} x2={i * cell} y2={size} stroke="rgba(196,160,53,0.07)" strokeWidth="1" />
              <line x1={0} y1={i * cell} x2={size} y2={i * cell} stroke="rgba(196,160,53,0.07)" strokeWidth="1" />
            </g>
          ))}
          <line x1={ox} y1={0} x2={ox} y2={size} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
          <line x1={0} y1={oy} x2={size} y2={oy} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
          {/* Droite */}
          <motion.line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy}
            stroke="var(--or-ancestral)" strokeWidth="2.5"
            animate={{ x1: p1.sx, y1: p1.sy, x2: p2.sx, y2: p2.sy }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }} />
          {/* Triangle de pente */}
          {a !== 0 && (
            <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
              <line x1={t1.sx} y1={t1.sy} x2={t2.sx} y2={t2.sy} stroke="rgba(100,200,140,0.6)" strokeWidth="2" strokeDasharray="4,2" />
              <line x1={t2.sx} y1={t2.sy} x2={t3.sx} y2={t3.sy} stroke="rgba(200,100,100,0.7)" strokeWidth="2" />
              <text x={(t1.sx + t2.sx) / 2} y={t1.sy + 14} fontSize="10" fill="rgba(100,200,140,0.8)" textAnchor="middle" fontFamily="monospace">+1</text>
              <text x={t2.sx + 10} y={(t2.sy + t3.sy) / 2} fontSize="10" fill="rgba(200,100,100,0.8)" fontFamily="monospace">{a > 0 ? "+" : ""}{a}</text>
            </motion.g>
          )}
          {/* Point ordonnée à l'origine */}
          <circle cx={ox} cy={oy - b * cell} r={5} fill="var(--or-ancestral)" />
        </svg>

        <div className="w-full rounded-xl bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] p-4 text-center">
          <p className="font-mono text-lg text-[var(--ivoire-ancien)]">
            y = <span className="text-[var(--or-ancestral)]">{a}x</span>
            {b !== 0 && <span> {b > 0 ? "+ " : "− "}<span className="text-[var(--amber-light)]">{Math.abs(b)}</span></span>}
          </p>
          <p className="text-xs text-[rgba(212,221,215,0.5)] mt-1">{slopeLabel} · Pente = {a}</p>
        </div>

        <div className="w-full space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-[rgba(212,221,215,0.7)]">Pente (a)</label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{a}</span>
            </div>
            <input type="range" min="-4" max="4" step="0.5" value={a} onChange={e => setA(+e.target.value)}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-[rgba(212,221,215,0.7)]">Ordonnée à l'origine (b)</label>
              <span className="text-sm font-bold text-[var(--amber-light)]">{b}</span>
            </div>
            <input type="range" min="-4" max="4" step="1" value={b} onChange={e => setB(+e.target.value)}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
