"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import FabButton from "./FabButton";
import Satellite from "./Satellite";
import { useConstellationActions, useFabRestIcon } from "./useConstellationActions";
import { useScrollDirection } from "./useScrollDirection";
import { computeRadius } from "./ConstellationLayout";

/**
 * Mobile-only constellation navigator.
 * - Anchored bottom-right via FabButton (which is portal-free, lives in normal flow).
 * - When opened, satellites + backdrop are portaled to <body> to escape stacking.
 */
export default function ConstellationNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { primary, satellites } = useConstellationActions();
  const RestIcon = useFabRestIcon();
  const scrollDirection = useScrollDirection();

  useEffect(() => { setMounted(true); }, []);

  // Close on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Compute satellite radius based on viewport.
  const radius = useMemo(() => {
    if (typeof window === "undefined") return 140;
    return computeRadius(window.innerHeight, window.innerWidth);
  }, [open]);

  const allItems = useMemo(() => {
    const list = [...satellites];
    if (primary) list.push(primary);
    return list;
  }, [satellites, primary]);

  // Combined badge for the FAB at rest (sum of all satellite badges).
  const totalBadge = useMemo(
    () => satellites.reduce((sum, s) => sum + (s.badge || 0), 0),
    [satellites]
  );

  // Hide the FAB on scroll-down (only when closed) — keeps reading/contemplation clean.
  const fabHidden = scrollDirection === "down" && !open;

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop + satellites portaled to body to escape any transformed ancestor */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="constellation-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-[58]"
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(11, 23, 20, 0.78)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              {/* Tracer lines from FAB centre to each satellite */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <radialGradient id="constellation-glow" cx="100%" cy="100%" r="50%">
                    <stop offset="0%" stopColor="rgba(232, 192, 120, 0.5)" />
                    <stop offset="100%" stopColor="rgba(181, 149, 81, 0)" />
                  </radialGradient>
                </defs>
              </svg>

              {/* Satellites layer — anchored to bottom-right like the FAB */}
              <div
                className="absolute pointer-events-none"
                style={{
                  right: 20 + 32, // FAB right offset + half its width (64/2)
                  bottom: "calc(20px + env(safe-area-inset-bottom, 0px) + 32px)",
                  width: 0,
                  height: 0,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {allItems.map((item, i) => (
                  <Satellite
                    key={item.id}
                    item={item}
                    index={i}
                    total={allItems.length}
                    radius={radius}
                    open={open}
                    onSelect={() => setOpen(false)}
                  />
                ))}

                {/* Sparkle particles (constellation flavor) */}
                {[
                  { top: -50, left: -90, delay: 0.2 },
                  { top: -120, left: -40, delay: 0.5 },
                  { top: -80, left: -160, delay: 0.8 },
                ].map((p, i) => (
                  <motion.span
                    key={`sparkle-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeInOut",
                    }}
                    className="absolute w-1 h-1 rounded-full bg-or-ancestral pointer-events-none"
                    style={{
                      top: p.top,
                      left: p.left,
                      boxShadow: "0 0 8px rgba(232, 192, 120, 0.8)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* The FAB itself stays in place, always rendered (portal-free for accessibility & focus order) */}
      <FabButton
        open={open}
        onToggle={() => setOpen((v) => !v)}
        RestIcon={RestIcon}
        badge={totalBadge}
        hidden={fabHidden}
      />
    </>
  );
}
