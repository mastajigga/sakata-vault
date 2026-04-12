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
import NumberLineViz from "./NumberLineViz";
import PlaceValueGrid from "./PlaceValueGrid";
import AreaRectangle from "./AreaRectangle";
import FractionCircle from "./FractionCircle";
import Timeline from "./Timeline";
import CountingBeads from "./CountingBeads";
import NumberBonds from "./NumberBonds";
import CoinCounter from "./CoinCounter";
import RulerMeasure from "./RulerMeasure";
import MultiplicationGrid from "./MultiplicationGrid";
import FractionBar from "./FractionBar";
import DecimalGrid from "./DecimalGrid";
import BarModel from "./BarModel";
import ShapeExplorer from "./ShapeExplorer";
import ClockFace from "./ClockFace";

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
    case "number-line": return <NumberLineViz />;
    case "place-value-grid": return <PlaceValueGrid />;
    case "area-rectangle": return <AreaRectangle />;
    case "fraction-circle": return <FractionCircle />;
    case "timeline": return <Timeline />;
    case "counting-beads": return <CountingBeads />;
    case "number-bonds": return <NumberBonds />;
    case "coin-counter": return <CoinCounter />;
    case "ruler-measure": return <RulerMeasure />;
    case "multiplication-grid": return <MultiplicationGrid />;
    case "fraction-bar": return <FractionBar />;
    case "decimal-grid": return <DecimalGrid />;
    case "bar-model": return <BarModel />;
    case "shape-explorer": return <ShapeExplorer />;
    case "clock-face": return <ClockFace />;
    case "none": return null;
    default: return null;
  }
};

export default function VisualizationTabs({ visualizations }: VisualizationTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeViz = visualizations[activeIndex];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < visualizations.length - 1) {
      setActiveIndex(index + 1);
    } else if (e.key === "Home") {
      setActiveIndex(0);
    } else if (e.key === "End") {
      setActiveIndex(visualizations.length - 1);
    }
  };

  if (!activeViz || visualizations.length === 0) return null;

  return (
    <div className="mt-10">
      {/* Tab buttons */}
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-[rgba(196,160,53,0.2)] pb-4 mb-6"
        aria-label="Visualisations du chapitre"
      >
        {visualizations.map((viz, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`viz-panel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)] focus:ring-offset-2 focus:ring-offset-[var(--foret-nocturne)] ${
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
        id={`viz-panel-${activeIndex}`}
        role="tabpanel"
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
