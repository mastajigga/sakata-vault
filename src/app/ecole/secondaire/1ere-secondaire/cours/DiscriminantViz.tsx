"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DiscriminantViz() {
  const [delta, setDelta] = useState(16);

  const w = 340, h = 240, ox = w / 2, oy = h / 2;
  const a = 1, bCoef = 0;
  // Δ = b²-4ac → c = (b²-Δ)/(4a) = -Δ/4
  const c = -delta / 4;
  const pts: { x: number; y: number }[] = [];
  for (let px = -8; px <= 8; px += 0.15) {
    pts.push({ x: px, y: a * px * px + bCoef * px + c });
  }
  const scaleX = 28, scaleY = 14;
  const toSvg = (x: number, y: number) => ({ sx: ox + x * scaleX, sy: oy - y * scaleY });

  const pathD = pts.map((p, i) => {
    const { sx, sy } = toSvg(p.x, p.y);
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ");

  const roots = delta > 0
    ? [(-bCoef + Math.sqrt(delta)) / (2 * a), (-bCoef - Math.sqrt(delta)) / (2 * a)]
    : delta === 0
    ? [-bCoef / (2 * a)]
    : [];

  const caseLabel = delta > 0 ? "Deux solutions réelles" : delta === 0 ? "Une solution double" : "Aucune solution réelle";
  const caseColor = delta > 0 ? "rgba(100,200,140,0.8)" : delta === 0 ? "var(--or-ancestral)" : "rgba(200,100,100,0.8)";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Discriminant et parabole</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-4">Δ = b² − 4ac détermine le nombre de solutions</p>

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-xl border border-[rgba(196,160,53,0.1)] mb-4 w-full">
        <rect width={w} height={h} fill="rgba(4,17,13,0.5)" />
        <line x1={0} y1={oy} x2={w} y2={oy} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
        <line x1={ox} y1={0} x2={ox} y2={h} stroke="rgba(196,160,53,0.35)" strokeWidth="1.5" />
        <motion.path d={pathD} stroke="var(--or-ancestral)" strokeWidth="2.5" fill="none"
          animate={{ d: pathD }} transition={{ type: "spring", stiffness: 80, damping: 15 }} />
        {roots.map((r, i) => {
          const { sx, sy } = toSvg(r, 0);
          return <motion.circle key={i} cx={sx} cy={sy} r={6}
            fill={caseColor} stroke="var(--foret-nocturne)" strokeWidth="2"
            animate={{ cx: sx }} transition={{ type: "spring", stiffness: 120 }} />;
        })}
      </svg>

      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <label className="text-sm text-[rgba(212,221,215,0.7)]">Discriminant Δ</label>
          <span className="text-sm font-bold" style={{ color: caseColor }}>Δ = {delta}</span>
        </div>
        <input type="range" min="-20" max="36" step="1" value={delta} onChange={e => setDelta(+e.target.value)}
          className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]" />
      </div>

      <div className="rounded-xl p-4 border" style={{ borderColor: caseColor.replace("0.8", "0.3"), background: caseColor.replace("0.8", "0.07") }}>
        <p className="text-sm font-bold mb-1" style={{ color: caseColor }}>{caseLabel}</p>
        <p className="text-xs text-[rgba(212,221,215,0.6)]">
          {delta > 0 ? `x₁ = ${roots[0]?.toFixed(2)}  et  x₂ = ${roots[1]?.toFixed(2)}` :
           delta === 0 ? `x = ${roots[0]?.toFixed(2)} (racine double)` :
           "La parabole ne coupe pas l'axe des x"}
        </p>
      </div>
    </motion.div>
  );
}
