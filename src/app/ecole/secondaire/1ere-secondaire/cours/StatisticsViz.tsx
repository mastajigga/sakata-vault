"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function StatisticsViz() {
  // Fish capture data: [Monday to Friday captures]
  const [data, setData] = useState([8, 12, 6, 10, 14]);

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];

  // Calculate statistics
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];

  // Mode (most frequent value)
  const frequency = new Map<number, number>();
  data.forEach((val) => frequency.set(val, (frequency.get(val) ?? 0) + 1));
  const mode = Array.from(frequency.entries()).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  const maxValue = Math.max(...data, mean + 2) + 1;
  const barWidth = 50;
  const barSpacing = 20;
  const chartHeight = 200;
  const chartWidth = days.length * (barWidth + barSpacing) + barSpacing;
  const svgWidth = chartWidth + 60;
  const svgHeight = chartHeight + 80;

  const yScale = chartHeight / maxValue;
  const chartStartX = 40;
  const chartStartY = 30;

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
            Statistiques — Organiser les données
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Captures de poissons par jour — Moyenne, médiane et mode
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="border border-[rgba(196,160,53,0.15)]">
            {/* Axes */}
            <line x1={chartStartX} y1={chartStartY + chartHeight} x2={chartStartX + chartWidth} y2={chartStartY + chartHeight} stroke="rgba(196,160,53,0.4)" strokeWidth="2" />
            <line x1={chartStartX} y1={chartStartY} x2={chartStartX} y2={chartStartY + chartHeight} stroke="rgba(196,160,53,0.4)" strokeWidth="2" />

            {/* Y-axis labels */}
            {Array.from({ length: 5 }).map((_, i) => {
              const value = Math.round((i * maxValue) / 4);
              const y = chartStartY + chartHeight - value * yScale;
              return (
                <g key={`y-label-${i}`}>
                  <text x={chartStartX - 8} y={y + 4} fontSize="10" fill="rgba(196,160,53,0.6)" textAnchor="end">
                    {value}
                  </text>
                  <line x1={chartStartX - 3} y1={y} x2={chartStartX} y2={y} stroke="rgba(196,160,53,0.3)" strokeWidth="1" />
                </g>
              );
            })}

            {/* Mean line */}
            <motion.line
              x1={chartStartX}
              y1={chartStartY + chartHeight - mean * yScale}
              x2={chartStartX + chartWidth}
              y2={chartStartY + chartHeight - mean * yScale}
              stroke="#ffb74d"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            />

            {/* Median line */}
            <motion.line
              x1={chartStartX}
              y1={chartStartY + chartHeight - median * yScale}
              x2={chartStartX + chartWidth}
              y2={chartStartY + chartHeight - median * yScale}
              stroke="#81c784"
              strokeWidth="2"
              strokeDasharray="6,2"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            />

            {/* Bars */}
            {data.map((value, idx) => {
              const x = chartStartX + barSpacing + idx * (barWidth + barSpacing);
              const y = chartStartY + chartHeight - value * yScale;
              const height = value * yScale;
              const isMode = value === mode;

              return (
                <motion.g key={`bar-${idx}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 + idx * 0.05 }} viewport={{ once: true }}>
                  {/* Bar */}
                  <motion.rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={isMode ? "var(--or-ancestral)" : "#4dd0e1"}
                    initial={{ y: chartStartY + chartHeight, height: 0 }}
                    whileInView={{ y, height }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                    viewport={{ once: true }}
                  />

                  {/* Value label on bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    fontSize="11"
                    fontWeight="bold"
                    fill="var(--ivoire-ancien)"
                    fontFamily="Geist Mono"
                    textAnchor="middle"
                  >
                    {value}
                  </text>

                  {/* Day label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartStartY + chartHeight + 18}
                    fontSize="11"
                    fill="rgba(196,160,53,0.6)"
                    fontFamily="Geist Mono"
                    textAnchor="middle"
                  >
                    {days[idx]}
                  </text>

                  {/* Mode indicator */}
                  {isMode && (
                    <motion.circle
                      cx={x + barWidth / 2}
                      cy={y - 15}
                      r="4"
                      fill="var(--or-ancestral)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                    />
                  )}
                </motion.g>
              );
            })}

            {/* Legend */}
            <g>
              <line x1={chartStartX + chartWidth + 25} y1={chartStartY + 20} x2={chartStartX + chartWidth + 40} y2={chartStartY + 20} stroke="#ffb74d" strokeWidth="2" strokeDasharray="4,4" />
              <text x={chartStartX + chartWidth + 50} y={chartStartY + 24} fontSize="10" fill="rgba(196,160,53,0.7)" fontFamily="Geist Mono">
                Moyenne
              </text>

              <line x1={chartStartX + chartWidth + 25} y1={chartStartY + 40} x2={chartStartX + chartWidth + 40} y2={chartStartY + 40} stroke="#81c784" strokeWidth="2" strokeDasharray="6,2" />
              <text x={chartStartX + chartWidth + 50} y={chartStartY + 44} fontSize="10" fill="rgba(196,160,53,0.7)" fontFamily="Geist Mono">
                Médiane
              </text>

              <rect x={chartStartX + chartWidth + 25} y={chartStartY + 52} width={8} height={8} fill="#4dd0e1" />
              <text x={chartStartX + chartWidth + 50} y={chartStartY + 59} fontSize="10" fill="rgba(196,160,53,0.7)" fontFamily="Geist Mono">
                Données
              </text>

              <rect x={chartStartX + chartWidth + 25} y={chartStartY + 72} width={8} height={8} fill="var(--or-ancestral)" />
              <text x={chartStartX + chartWidth + 50} y={chartStartY + 79} fontSize="10" fill="rgba(196,160,53,0.7)" fontFamily="Geist Mono">
                Mode
              </text>
            </g>
          </svg>
        </div>

        {/* Interactive data editor */}
        <div className="space-y-3">
          <p className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
            Ajuste les captures pour voir comment les mesures changent:
          </p>
          <div className="grid grid-cols-5 gap-3">
            {data.map((value, idx) => (
              <div key={`input-${idx}`}>
                <label className="text-xs text-[rgba(212,221,215,0.6)] block mb-1">{days[idx]}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={value}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[idx] = parseInt(e.target.value) || 1;
                    setData(newData);
                  }}
                  className="w-full px-2 py-1 text-sm bg-[rgba(196,160,53,0.1)] border border-[rgba(196,160,53,0.3)] rounded text-[var(--ivoire-ancien)] font-geist-mono"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Statistics summary */}
        <motion.div
          key={`${mean}-${median}-${mode}`}
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-[rgba(255,183,77,0.1)] rounded-lg p-3 border border-[rgba(255,183,77,0.3)]">
            <p className="text-xs text-[rgba(212,221,215,0.6)] font-geist-mono mb-1">Moyenne</p>
            <p className="text-lg font-bold text-[#ffb74d]">{mean.toFixed(2)}</p>
          </div>
          <div className="bg-[rgba(129,199,132,0.1)] rounded-lg p-3 border border-[rgba(129,199,132,0.3)]">
            <p className="text-xs text-[rgba(212,221,215,0.6)] font-geist-mono mb-1">Médiane</p>
            <p className="text-lg font-bold text-[#81c784]">{median.toFixed(2)}</p>
          </div>
          <div className="bg-[rgba(196,160,53,0.1)] rounded-lg p-3 border border-[rgba(196,160,53,0.3)]">
            <p className="text-xs text-[rgba(212,221,215,0.6)] font-geist-mono mb-1">Mode</p>
            <p className="text-lg font-bold text-[var(--or-ancestral)]">{mode}</p>
          </div>
        </motion.div>

        {/* Interpretation */}
        <div className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]">
          <p className="text-sm text-[rgba(212,221,215,0.8)]">
            La <strong>moyenne</strong> ({mean.toFixed(1)}) est sensible aux valeurs extrêmes.
            <br />
            La <strong>médiane</strong> ({median.toFixed(1)}) reflète la performance habituelle.
            <br />
            Le <strong>mode</strong> ({mode}) est la capture la plus fréquente.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
