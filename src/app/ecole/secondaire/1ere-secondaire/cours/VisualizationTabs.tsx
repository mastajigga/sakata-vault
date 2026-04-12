"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Visualization } from "@/app/ecole/data/mathematics-curriculum";
import BalanceVisualization from "./BalanceVisualization";
import VennVisualization from "./VennVisualization";
import FunctionPlot from "./FunctionPlot";
import SystemVisualization from "./SystemVisualization";
import AngleTriangle from "./AngleTriangle";
import ProportionVisualization from "./ProportionVisualization";
import ParabolaVisualization from "./ParabolaVisualization";
import PythagoreanSquares from "./PythagoreanSquares";
import StatisticsViz from "./StatisticsViz";
import PieChartViz from "./PieChartViz";

interface VisualizationTabsProps {
  visualizations: Visualization[];
}

const renderVisualization = (type: Visualization["type"]) => {
  switch (type) {
    case "balance": return <BalanceVisualization />;
    case "venn": return <VennVisualization />;
    case "function-plot": return <FunctionPlot />;
    case "system": return <SystemVisualization />;
    case "angle-triangle": return <AngleTriangle />;
    case "proportion": return <ProportionVisualization />;
    case "parabola": return <ParabolaVisualization />;
    case "pythagorean-squares": return <PythagoreanSquares />;
    case "statistics-bars": return <StatisticsViz />;
    case "pie-chart": return <PieChartViz />;
    case "number-line": return <div className="text-center py-8 text-[rgba(212,221,215,0.6)]">Droite des nombres — À venir</div>;
    case "place-value-grid": return <div className="text-center py-8 text-[rgba(212,221,215,0.6)]">Grille de valeurs — À venir</div>;
    case "area-rectangle": return <div className="text-center py-8 text-[rgba(212,221,215,0.6)]">Surface rectangulaire — À venir</div>;
    case "fraction-circle": return <div className="text-center py-8 text-[rgba(212,221,215,0.6)]">Cercle de fractions — À venir</div>;
    case "timeline": return <div className="text-center py-8 text-[rgba(212,221,215,0.6)]">Ligne de temps — À venir</div>;
    case "none": return null;
    default: return null;
  }
};

export default function VisualizationTabs({ visualizations }: VisualizationTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeViz = visualizations[activeIndex];

  if (!activeViz || visualizations.length === 0) return null;

  return (
    <div className="mt-10">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 border-b border-[rgba(196,160,53,0.2)] pb-4 mb-6">
        {visualizations.map((viz, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeIndex === index
                ? "bg-[rgba(196,160,53,0.15)] text-[var(--or-ancestral)] border border-[rgba(196,160,53,0.4)]"
                : "text-[rgba(212,221,215,0.65)] hover:text-[rgba(212,221,215,0.85)] border border-transparent"
            }`}
          >
            {viz.title}
          </button>
        ))}
      </div>

      {/* Tab content with animation */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {activeViz.description && (
          <p className="mb-4 text-sm text-[rgba(212,221,215,0.6)]">
            {activeViz.description}
          </p>
        )}
        <div className="rounded-[1.2rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.3)] p-6 md:p-8">
          {renderVisualization(activeViz.type)}
        </div>
      </motion.div>
    </div>
  );
}
