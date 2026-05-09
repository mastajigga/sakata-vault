"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FabButton from "@/components/navbar/mobile/FabButton";
import Satellite from "@/components/navbar/mobile/Satellite";
import { computeRadius } from "@/components/navbar/mobile/ConstellationLayout";
import { useScrollDirection } from "@/components/navbar/mobile/useScrollDirection";
import { useAuth } from "@/components/AuthProvider";
import {
  useAdminConstellationActions,
  useAdminFabRestIcon,
  type AdminBatchKey,
  type AdminConstellationItem,
} from "./useAdminConstellationActions";

type NavState =
  | { kind: "batch"; key: AdminBatchKey }
  | { kind: "submenu"; parent: AdminConstellationItem; parentBatch: AdminBatchKey };

/**
 * Mobile-only admin constellation. Bottom-LEFT anchored, mirrors the main
 * navigator visually so users instinctively distinguish "admin tools"
 * (left) from "site navigation" (right).
 */
export default function AdminConstellationNav() {
  const pathname = usePathname() || "/admin";
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navState, setNavState] = useState<NavState>({ kind: "batch", key: "pilotage" });
  const { batches } = useAdminConstellationActions(role);
  const RestIcon = useAdminFabRestIcon(pathname);
  const scrollDirection = useScrollDirection();

  useEffect(() => { setMounted(true); }, []);

  // Close + reset on route change.
  useEffect(() => {
    setOpen(false);
    setNavState({ kind: "batch", key: "pilotage" });
  }, [pathname]);

  // Reset to default batch when fully closed.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setNavState({ kind: "batch", key: "pilotage" }), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape: pop submenu, then close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navState.kind === "submenu") setNavState({ kind: "batch", key: navState.parentBatch });
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, navState]);

  // Body scroll lock.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const radius = useMemo(() => {
    if (typeof window === "undefined") return 195;
    return computeRadius(window.innerHeight, window.innerWidth);
  }, [open, navState]);

  const visibleItems = useMemo<AdminConstellationItem[]>(() => {
    if (navState.kind === "batch") return batches[navState.key];
    const children = navState.parent.children || [];
    const back: AdminConstellationItem = {
      id: `back-${navState.parent.id}`,
      label: "Retour",
      icon: ArrowLeft,
      isBack: true,
    };
    return [...children, back];
  }, [navState, batches]);

  const levelKey = navState.kind === "batch" ? `b:${navState.key}` : `s:${navState.parent.id}`;
  const fabHidden = scrollDirection === "down" && !open;

  if (!mounted) return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="admin-constellation-overlay"
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
              {/* Breadcrumb when in a sub-menu */}
              {navState.kind === "submenu" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 left-0 right-0 text-center pointer-events-none"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-or-ancestral/70">
                    Command Center · {navState.parent.label}
                  </p>
                </motion.div>
              )}

              {/* Satellites layer — anchored bottom-LEFT (mirror of main nav) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: 20 + 32, // FAB left offset + half its width (64/2)
                  bottom: "calc(20px + env(safe-area-inset-bottom, 0px) + 32px)",
                  width: 0,
                  height: 0,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {visibleItems.map((item, i) => (
                  <Satellite
                    key={`${levelKey}-${item.id}`}
                    item={item as any /* AdminConstellationItem ≡ ConstellationItem at runtime */}
                    index={i}
                    total={visibleItems.length}
                    radius={radius}
                    open={open}
                    side="left"
                    onSelect={() => setOpen(false)}
                    onSwitch={(target) => setNavState({ kind: "batch", key: target as AdminBatchKey })}
                    onExpand={(parent) => {
                      const parentBatch = navState.kind === "batch" ? navState.key : navState.parentBatch;
                      setNavState({ kind: "submenu", parent: parent as AdminConstellationItem, parentBatch });
                    }}
                    onBack={() => {
                      if (navState.kind === "submenu") {
                        setNavState({ kind: "batch", key: navState.parentBatch });
                      }
                    }}
                  />
                ))}

                {/* Sparkles mirrored */}
                {[
                  { top: -50, right: -90, delay: 0.2 },
                  { top: -120, right: -40, delay: 0.5 },
                  { top: -80, right: -160, delay: 0.8 },
                ].map((p, i) => (
                  <motion.span
                    key={`a-sparkle-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                    className="absolute w-1 h-1 rounded-full bg-or-ancestral pointer-events-none"
                    style={{
                      top: p.top,
                      right: p.right,
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
        side="left"
        hidden={fabHidden}
      />
    </>
  );
}
