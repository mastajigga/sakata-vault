"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { computeSatellitePosition } from "./ConstellationLayout";
import type { ConstellationItem } from "./useConstellationActions";

interface SatelliteProps {
  item: ConstellationItem;
  index: number;
  total: number;
  radius: number;
  open: boolean;
  onSelect: () => void;
}

export default function Satellite({ item, index, total, radius, open, onSelect }: SatelliteProps) {
  const { dx, dy } = computeSatellitePosition(index, total, radius);
  const Icon = item.icon;
  const isPrimary = item.isPrimary;

  // The satellite's "open" position is dx/dy away from the FAB.
  // At rest, all satellites collapse onto the FAB (0,0) and fade out.
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
      }}
      initial={false}
      animate={{
        x: open ? dx : 0,
        y: open ? dy : 0,
        opacity: open ? 1 : 0,
        scale: open ? 1 : 0.4,
      }}
      transition={{
        duration: open ? 0.45 : 0.25,
        delay: open ? 0.05 + index * 0.04 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={item.href}
        onClick={onSelect}
        aria-label={item.label}
        className={`pointer-events-auto absolute flex flex-col items-center gap-1.5 ${
          isPrimary ? "" : ""
        }`}
        style={{
          // Center the link block on the computed point.
          transform: `translate(-50%, -50%)`,
        }}
      >
        {/* Label pill */}
        <motion.span
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ delay: open ? 0.15 + index * 0.04 : 0, duration: 0.25 }}
          className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border backdrop-blur-md ${
            isPrimary
              ? "bg-or-ancestral/95 text-foret-nocturne border-or-ancestral"
              : "bg-foret-nocturne/85 text-ivoire-ancien/85 border-or-ancestral/20"
          }`}
        >
          {item.label}
        </motion.span>

        {/* Orb */}
        <motion.span
          whileTap={{ scale: 0.92 }}
          className={`relative flex items-center justify-center rounded-full border ${
            isPrimary
              ? "w-14 h-14 bg-gradient-to-br from-or-ancestral to-or-ancestral/60 border-or-ancestral text-foret-nocturne shadow-[0_8px_24px_rgba(181,149,81,0.45)]"
              : "w-12 h-12 bg-foret-nocturne/95 border-or-ancestral/35 text-ivoire-ancien backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
          }`}
        >
          <Icon className={isPrimary ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2} />
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-foret-nocturne">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
          {/* Subtle inner glow for primary */}
          {isPrimary && (
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0%, transparent 60%)",
              }}
            />
          )}
        </motion.span>
      </Link>
    </motion.div>
  );
}
