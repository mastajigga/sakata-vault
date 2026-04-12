"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CoordinatePlane() {
  const [px, setPx] = useState(3);
  const [py, setPy] = useState(2);

  const size = 320, cells = 10, cell = size / cells;
  const ox = size / 2, oy = size / 2;
  const sx = ox + px * cell, sy = oy - py * cell;

  const quadrant = px >= 0 && py >= 0 ? "I" : px < 0 && py >= 0 ? "II" : px < 0 && py < 0 ? "III" : "IV";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Plan cartésien</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Déplace les curseurs pour placer le point ({px} ; {py})</p>

      <div className="flex flex-col items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl border border-[rgba(196,160,53,0.1)]">
          <rect width={size} height={size} fill="rgba(4,17,13,0.5)" />
          {/* Grille */}
          {Array.from({ length: cells + 1 }).map((_, i) => (
            <g key={i}>
              <line x1={i * cell} y1={0} x2={i * cell} y2={size} stroke="rgba(196,160,53,0.08)" strokeWidth="1" />
              <line x1={0} y1={i * cell} x2={size} y2={i * cell} stroke="rgba(196,160,53,0.08)" strokeWidth="1" />
            </g>
          ))}
          {/* Axes */}
          <line x1={ox} y1={0} x2={ox} y2={size} stroke="rgba(196,160,53,0.45)" strokeWidth="2" />
          <line x1={0} y1={oy} x2={size} y2={oy} stroke="rgba(196,160,53,0.45)" strokeWidth="2" />
          {/* Labels axes */}
          <text x={size - 12} y={oy - 6} fontSize="12" fill="rgba(196,160,53,0.7)" fontFamily="monospace">x</text>
          <text x={ox + 6} y={14} fontSize="12" fill="rgba(196,160,53,0.7)" fontFamily="monospace">y</text>
          {/* Quadrants */}
          {[["I", ox + 12, oy - 12], ["II", 8, oy - 12], ["III", 8, oy + 22], ["IV", ox + 12, oy + 22]].map(([q, x, y]) => (
            <text key={q as string} x={x as number} y={y as number} fontSize="11" fill="rgba(212,221,215,0.2)" fontFamily="monospace">{q}</text>
          ))}
          {/* Pointillés vers axes */}
          <line x1={sx} y1={sy} x2={sx} y2={oy} stroke="rgba(196,160,53,0.3)" strokeWidth="1" strokeDasharray="4,3" />
          <line x1={sx} y1={sy} x2={ox} y2={sy} stroke="rgba(196,160,53,0.3)" strokeWidth="1" strokeDasharray="4,3" />
          {/* Point */}
          <motion.circle cx={sx} cy={sy} r={7} fill="var(--or-ancestral)"
            animate={{ cx: sx, cy: sy }} transition={{ type: "spring", stiffness: 200, damping: 20 }} />
          <motion.text x={sx + 10} y={sy - 10} fontSize="12" fill="var(--ivoire-ancien)" fontFamily="monospace"
            animate={{ x: sx + 10, y: sy - 10 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            ({px} ; {py})
          </motion.text>
        </svg>

        <div className="w-full space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-mono">x</label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{px}</span>
            </div>
            <input type="range" min="-5" max="5" step="1" value={px} onChange={e => setPx(+e.target.value)}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-mono">y</label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{py}</span>
            </div>
            <input type="range" min="-5" max="5" step="1" value={py} onChange={e => setPy(+e.target.value)}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
          </div>
          <p className="text-xs text-center text-[rgba(212,221,215,0.45)]">Point dans le quadrant {quadrant}</p>
        </div>
      </div>
    </motion.div>
  );
}
