"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PieChartViz() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Fish species and their frequencies
  const data = [
    { label: "Tilapia", count: 40, color: "#4dd0e1" },
    { label: "Carpe", count: 30, color: "#b39ddb" },
    { label: "Silure", count: 20, color: "#81c784" },
    { label: "Capitaine", count: 10, color: "#ffb74d" },
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const svgSize = 340;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = 100;

  // Helper to generate SVG path for pie slice
  const getSlicePath = (startAngle: number, endAngle: number, r: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + r * Math.cos(startRad);
    const y1 = centerY + r * Math.sin(startRad);
    const x2 = centerX + r * Math.cos(endRad);
    const y2 = centerY + r * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Calculate slice angles
  let currentAngle = 0;
  const slices = data.map((item) => {
    const sliceAngle = (item.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      sliceAngle,
      percentage: ((item.count / total) * 100).toFixed(1),
    };
  });

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h3 className="text-[1.2rem] font-outfit font-bold text-[var(--ivoire-ancien)] mb-2">
            Diagramme circulaire (camembert)
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Répartition des espèces pêchées — Chaque part proportionnelle à la fréquence
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="border border-[rgba(196,160,53,0.15)]">
            {/* Background circle */}
            <circle cx={centerX} cy={centerY} r={radius + 5} fill="rgba(196,160,53,0.05)" />

            {/* Pie slices */}
            {slices.map((slice, idx) => (
              <motion.g
                key={`slice-${idx}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {/* Slice path */}
                <motion.path
                  d={getSlicePath(slice.startAngle, slice.endAngle, radius)}
                  fill={slice.color}
                  stroke="var(--foret-nocturne)"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08, filter: "brightness(1.2)" }}
                />

                {/* Slice label */}
                {hoveredSlice === idx || slice.sliceAngle > 30 ? (
                  <motion.text
                    x={
                      centerX +
                      (radius * 0.6) * Math.cos(((slice.startAngle + slice.endAngle) / 2 - 90) * (Math.PI / 180))
                    }
                    y={
                      centerY +
                      (radius * 0.6) * Math.sin(((slice.startAngle + slice.endAngle) / 2 - 90) * (Math.PI / 180))
                    }
                    fontSize="12"
                    fontWeight="bold"
                    fill="var(--foret-nocturne)"
                    fontFamily="Geist Mono"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {slice.percentage}%
                  </motion.text>
                ) : null}
              </motion.g>
            ))}

            {/* Center circle for donut effect would go here */}
            <circle cx={centerX} cy={centerY} r={30} fill="var(--foret-nocturne)" />
            <text
              x={centerX}
              y={centerY}
              fontSize="14"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              fontFamily="Geist Mono"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Total
            </text>
            <text
              x={centerX}
              y={centerY + 18}
              fontSize="13"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              fontFamily="Geist Mono"
              textAnchor="middle"
            >
              {total}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {slices.map((slice, idx) => (
            <motion.div
              key={`legend-${idx}`}
              className="flex items-center gap-2 p-2 rounded border border-[rgba(196,160,53,0.2)] cursor-pointer hover:bg-[rgba(196,160,53,0.1)] transition-colors"
              onMouseEnter={() => setHoveredSlice(idx)}
              onMouseLeave={() => setHoveredSlice(null)}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: slice.color }}></div>
              <div className="flex-1 text-sm">
                <p className="text-[rgba(212,221,215,0.8)] font-geist-mono">{slice.label}</p>
                <p className="text-xs text-[rgba(212,221,215,0.5)]">
                  {slice.count} ({slice.percentage}%)
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Angle calculation reference */}
        <motion.div
          className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)] space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-geist-mono text-[var(--ivoire-ancien)] mb-2">
            Angles des secteurs:
          </p>
          {slices.map((slice, idx) => (
            <p key={`angle-${idx}`} className="text-xs font-geist-mono text-[rgba(212,221,215,0.7)]">
              {slice.label}: {((slice.percentage as any) / 100 * 360).toFixed(1)}° = {slice.percentage}% ×360°
            </p>
          ))}
        </motion.div>

        {/* Interpretation */}
        <div className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]">
          <p className="text-sm text-[rgba(212,221,215,0.8)]">
            Ce diagramme montre comment répartir un total (360°) proportionnellement à chaque catégorie.
            Plus la part est grande, plus large est le secteur circulaire.
            <br />
            <strong>Utilité:</strong> Voir d'un coup d'œil quelle espèce domine les captures.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
