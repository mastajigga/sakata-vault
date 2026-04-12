"use client";

import { useState } from "react";
import { motion } from "framer-motion";

function toAngle(value: number, max: number) {
  return (value / max) * 360 - 90;
}

export default function ClockFace() {
  const [hours, setHours] = useState(14);
  const [minutes, setMinutes] = useState(30);

  const displayHours = hours % 12 || 12;
  const hourAngle = toAngle(displayHours + minutes / 60, 12);
  const minuteAngle = toAngle(minutes, 60);

  const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Horloge analogique</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Le pêcheur part à 5h, revient à 18h</p>

      {/* Affichage numérique */}
      <div className="text-center mb-4">
        <span className="font-mono text-5xl font-bold text-[var(--or-ancestral)]">{timeString}</span>
        <p className="text-xs text-[rgba(212,221,215,0.4)] mt-1">
          {hours < 12 ? "Matin" : hours < 18 ? "Après-midi" : "Soir"}
        </p>
      </div>

      {/* Cadran SVG */}
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 200 200" className="w-48 h-48" aria-label={`Horloge affichant ${timeString}`}>
          {/* Cadran */}
          <circle cx="100" cy="100" r="96" fill="rgba(10,25,17,0.7)" stroke="rgba(196,160,53,0.4)" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="3" fill="rgba(196,160,53,0.9)" />

          {/* Marquages des heures */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 82 * Math.cos(rad);
            const y1 = 100 + 82 * Math.sin(rad);
            const x2 = 100 + 90 * Math.cos(rad);
            const y2 = 100 + 90 * Math.sin(rad);
            const tx = 100 + 72 * Math.cos(rad);
            const ty = 100 + 72 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(196,160,53,0.6)" strokeWidth="2" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                  fontSize="10" fill="rgba(212,221,215,0.7)" fontFamily="'Geist Mono', monospace">
                  {i === 0 ? 12 : i}
                </text>
              </g>
            );
          })}

          {/* Aiguille des heures */}
          <motion.line
            x1="100" y1="100"
            x2={100 + 50 * Math.cos((hourAngle * Math.PI) / 180)}
            y2={100 + 50 * Math.sin((hourAngle * Math.PI) / 180)}
            stroke="rgba(240,237,229,0.9)"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              x2: 100 + 50 * Math.cos((hourAngle * Math.PI) / 180),
              y2: 100 + 50 * Math.sin((hourAngle * Math.PI) / 180),
            }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />

          {/* Aiguille des minutes */}
          <motion.line
            x1="100" y1="100"
            x2={100 + 72 * Math.cos((minuteAngle * Math.PI) / 180)}
            y2={100 + 72 * Math.sin((minuteAngle * Math.PI) / 180)}
            stroke="rgba(196,160,53,0.9)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              x2: 100 + 72 * Math.cos((minuteAngle * Math.PI) / 180),
              y2: 100 + 72 * Math.sin((minuteAngle * Math.PI) / 180),
            }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Heures : {hours}h</label>
          <input
            type="range" min={0} max={23} value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
          <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
            <span>0h</span>
            <span>12h</span>
            <span>23h</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-[rgba(212,221,215,0.6)] mb-1 block">Minutes : {minutes}min</label>
          <input
            type="range" min={0} max={59} value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
          />
          <div className="flex justify-between text-xs text-[rgba(212,221,215,0.4)] mt-1">
            <span>0</span>
            <span>30</span>
            <span>59</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
