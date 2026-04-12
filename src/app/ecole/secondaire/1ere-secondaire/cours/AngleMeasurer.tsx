"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AngleMeasurer() {
  const [angle, setAngle] = useState(45);
  const cx = 160, cy = 160, r = 130;
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + r * Math.cos(-rad);
  const y2 = cy + r * Math.sin(-rad);
  const arcR = 50;
  const largeArc = angle > 180 ? 1 : 0;
  const arcX = cx + arcR * Math.cos(-rad);
  const arcY = cy + arcR * Math.sin(-rad);
  const arcPath = `M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcX} ${arcY}`;
  const label = angle < 90 ? "Aigu" : angle === 90 ? "Droit ✓" : angle < 180 ? "Obtus" : "Plat";
  const color = angle === 90 ? "rgba(100,200,140,0.9)" : angle < 90 ? "var(--or-ancestral)" : "rgba(196,130,53,0.9)";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Rapporteur interactif</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-4">Ajuste l'angle et observe sa classification</p>

      <div className="flex flex-col items-center gap-5">
        <svg width="320" height="200" viewBox="0 0 320 200" className="rounded-xl border border-[rgba(196,160,53,0.1)]">
          <rect width="320" height="200" fill="rgba(4,17,13,0.5)" />
          {/* Demi-cercle rapporteur */}
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="rgba(196,160,53,0.04)" stroke="rgba(196,160,53,0.25)" strokeWidth="1.5" />
          {/* Graduations */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180].map(deg => {
            const a = (deg * Math.PI) / 180;
            const x1 = cx + (r - 10) * Math.cos(Math.PI - a), y1 = cy - (r - 10) * Math.sin(Math.PI - a);
            const xt = cx + (r + 12) * Math.cos(Math.PI - a), yt = cy - (r + 12) * Math.sin(Math.PI - a);
            return (
              <g key={deg}>
                <line x1={cx + r * Math.cos(Math.PI - a)} y1={cy - r * Math.sin(Math.PI - a)} x2={x1} y2={y1}
                  stroke="rgba(196,160,53,0.3)" strokeWidth="1" />
                <text x={xt} y={yt + 4} fontSize="9" fill="rgba(196,160,53,0.5)" textAnchor="middle" fontFamily="monospace">{deg}</text>
              </g>
            );
          })}
          {/* Rayon fixe */}
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="rgba(212,221,215,0.4)" strokeWidth="2" />
          {/* Rayon mobile */}
          <motion.line x1={cx} y1={cy} x2={x2} y2={y2}
            stroke={color} strokeWidth="2.5"
            animate={{ x2, y2 }} transition={{ type: "spring", stiffness: 150, damping: 20 }} />
          {/* Arc */}
          <motion.path d={arcPath} fill="none" stroke={color} strokeWidth="2" opacity="0.7"
            animate={{ d: arcPath }} transition={{ type: "spring", stiffness: 80 }} />
          {/* Angle label */}
          <text x={cx + 22} y={cy - 18} fontSize="13" fill={color} fontFamily="monospace" fontWeight="bold">{angle}°</text>
          <circle cx={cx} cy={cy} r={4} fill={color} />
        </svg>

        <div className="w-full">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-[rgba(212,221,215,0.7)]">Angle</label>
            <span className="text-sm font-bold" style={{ color }}>{angle}° — {label}</span>
          </div>
          <input type="range" min="0" max="180" step="1" value={angle} onChange={e => setAngle(+e.target.value)}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
        </div>
      </div>
    </motion.div>
  );
}
