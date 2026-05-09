"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FabButton from "./FabButton";
import Satellite from "./Satellite";
import {
  useConstellationActions,
  useFabRestIcon,
  type BatchKey,
  type ConstellationItem,
} from "./useConstellationActions";
import { useScrollDirection } from "./useScrollDirection";
import { computeRadius } from "./ConstellationLayout";

/**
 * Navigation state machine.
 * - "batch" : root level, user sees one of the two top batches.
 * - "submenu": drilled into a specific item with sub-options.
 */
type NavState =
  | { kind: "batch"; key: BatchKey }
  | { kind: "submenu"; parent: ConstellationItem; parentBatch: BatchKey };

/**
 * Mobile-only constellation navigator.
 * - FAB stays in normal flow (focus + accessibility friendly).
 * - Backdrop + satellites portaled to <body> to escape transformed ancestors.
 */
export default function ConstellationNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navState, setNavState] = useState<NavState>({ kind: "batch", key: "essentiel" });
  const { primary, batches } = useConstellationActions();
  const RestIcon = useFabRestIcon();
  const scrollDirection = useScrollDirection();

  useEffect(() => { setMounted(true); }, []);

  // Close on route change + reset nav.
  useEffect(() => {
    setOpen(false);
    setNavState({ kind: "batch", key: "essentiel" });
  }, [pathname]);

  // Reset nav when fully closed.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setNavState({ kind: "batch", key: "essentiel" }), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape (or pop one level if in submenu).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navState.kind === "submenu") {
        setNavState({ kind: "batch", key: navState.parentBatch });
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, navState]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Compute satellite radius based on viewport.
  const radius = useMemo(() => {
    if (typeof window === "undefined") return 195;
    return computeRadius(window.innerHeight, window.innerWidth);
  }, [open, navState]);

  // Resolve the current visible items based on navigation state.
  // In submenu mode: children + a synthetic "back" satellite at the end.
  const visibleItems = useMemo<ConstellationItem[]>(() => {
    if (navState.kind === "batch") {
      const base = batches[navState.key];
      return primary ? [...base, primary] : base;
    }
    // submenu
    const children = navState.parent.children || [];
    const back: ConstellationItem = {
      id: `back-${navState.parent.id}`,
      label: "Retour",
      icon: ArrowLeft,
      isBack: true,
    };
    return [...children, back];
  }, [navState, batches, primary]);

  // Combined badge for the FAB at rest.
  const totalBadge = useMemo(() => {
    if (navState.kind !== "batch") return 0;
    return batches[navState.key].reduce((sum, s) => sum + (s.badge || 0), 0);
  }, [navState, batches]);

  // Stable key prefix used to remount satellites when the level changes
  // — this re-fires the entry animation on drill-in / drill-out / batch swap.
  const levelKey = navState.kind === "batch" ? `b:${navState.key}` : `s:${navState.parent.id}`;

  // Hide the FAB on scroll-down (only when closed).
  const fabHidden = scrollDirection === "down" && !open;

  if (!mounted) return null;

  return (
    <>
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
              {/* Breadcrumb shown when in a submenu */}
              {navState.kind === "submenu" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 left-0 right-0 text-center pointer-events-none"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-or-ancestral/70">
                    {navState.parentBatch === "essentiel" ? "Essentiel" : "Découverte"} · {navState.parent.label}
                  </p>
                </motion.div>
              )}

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
                {visibleItems.map((item, i) => (
                  <Satellite
                    key={`${levelKey}-${item.id}`}
                    item={item}
                    index={i}
                    total={visibleItems.length}
                    radius={radius}
                    open={open}
                    onSelect={() => setOpen(false)}
                    onSwitch={(target) => setNavState({ kind: "batch", key: target })}
                    onExpand={(parent) => {
                      const parentBatch = navState.kind === "batch" ? navState.key : navState.parentBatch;
                      setNavState({ kind: "submenu", parent, parentBatch });
                    }}
                    onBack={() => {
                      if (navState.kind === "submenu") {
                        setNavState({ kind: "batch", key: navState.parentBatch });
                      }
                    }}
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
