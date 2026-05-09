"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";

interface FabButtonProps {
  open: boolean;
  onToggle: () => void;
  RestIcon: LucideIcon;
  badge?: number;
  hidden?: boolean;
}

export default function FabButton({ open, onToggle, RestIcon, badge, hidden }: FabButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu de navigation"}
      aria-expanded={open}
      animate={{
        y: hidden && !open ? 120 : 0,
        opacity: hidden && !open ? 0 : 1,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="md:hidden fixed z-[60] flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-or-ancestral/60"
      style={{
        width: 64,
        height: 64,
        right: 20,
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Pulsing halo (idle only) */}
      <AnimatePresence>
        {!open && (
          <motion.span
            key="halo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 0.0, 0.5], scale: [0.9, 1.4, 0.9] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(232,192,120,0.55) 0%, rgba(181,149,81,0.0) 65%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Open-state aura (broader, subtler) */}
      <AnimatePresence>
        {open && (
          <motion.span
            key="aura"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.6, scale: 1.3 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -inset-10 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(181,149,81,0.35) 0%, rgba(11,23,20,0) 65%)",
              filter: "blur(20px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Solid orb */}
      <motion.span
        animate={{
          rotate: open ? 90 : 0,
          scale: open ? 1.05 : 1,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center w-full h-full rounded-full text-foret-nocturne shadow-[0_10px_35px_rgba(181,149,81,0.45)] border border-or-ancestral/60"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #F5DDA1 0%, #E8C078 35%, #B59551 70%, #8B6B2E 100%)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-7 h-7" strokeWidth={2.4} />
            </motion.span>
          ) : (
            <motion.span
              key="rest"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.18 }}
            >
              <RestIcon className="w-7 h-7" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Inner highlight */}
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5) 0%, transparent 45%)",
          }}
        />

        {/* Badge */}
        {!open && badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-foret-nocturne shadow-md">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </motion.span>
    </motion.button>
  );
}
