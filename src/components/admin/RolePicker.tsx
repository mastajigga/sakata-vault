"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, Gavel, Pen, User as UserIcon, Hourglass, ChevronDown, Check, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Role = "user" | "contributor" | "moderator" | "manager" | "admin" | "temp_admin";

type RoleMeta = {
  value: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind tone tokens (text/bg/border) using brume palette */
  tone: { text: string; bg: string; border: string; ring: string };
  /** Hierarchy index for sort/disable logic */
  weight: number;
};

const ROLE_META: Record<Role, RoleMeta> = {
  admin: {
    value: "admin",
    label: "Administrateur",
    description: "Tous pouvoirs sur le sanctuaire",
    icon: ShieldAlert,
    tone: { text: "text-red-300", bg: "bg-red-500/10", border: "border-red-500/30", ring: "ring-red-500/40" },
    weight: 100,
  },
  temp_admin: {
    value: "temp_admin",
    label: "Admin temporaire",
    description: "Accès admin limité dans le temps",
    icon: Hourglass,
    tone: { text: "text-or-ancestral", bg: "bg-or-ancestral/10", border: "border-or-ancestral/30", ring: "ring-or-ancestral/40" },
    weight: 90,
  },
  manager: {
    value: "manager",
    label: "Manager",
    description: "Gestion contenus & modération",
    icon: ShieldCheck,
    tone: { text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30", ring: "ring-emerald-500/40" },
    weight: 50,
  },
  moderator: {
    value: "moderator",
    label: "Modérateur",
    description: "Veille du forum & journaux",
    icon: Gavel,
    tone: { text: "text-or-ancestral", bg: "bg-or-ancestral/10", border: "border-or-ancestral/25", ring: "ring-or-ancestral/40" },
    weight: 40,
  },
  contributor: {
    value: "contributor",
    label: "Contributeur",
    description: "Création d'articles & médias",
    icon: Pen,
    tone: { text: "text-ivoire-ancien", bg: "bg-ivoire-ancien/8", border: "border-ivoire-ancien/20", ring: "ring-ivoire-ancien/30" },
    weight: 30,
  },
  user: {
    value: "user",
    label: "Utilisateur",
    description: "Accès standard à la communauté",
    icon: UserIcon,
    tone: { text: "text-ivoire-ancien/70", bg: "bg-white/5", border: "border-white/10", ring: "ring-white/20" },
    weight: 10,
  },
};

const VISIBLE_ORDER: Role[] = ["admin", "manager", "moderator", "contributor", "user"];

interface Props {
  value: Role | null | undefined;
  onChange: (next: Role) => void | Promise<void>;
  /** Role of the actor making the change (used to grey out forbidden options) */
  actorRole?: Role | null;
  /** True if the target row is the actor themselves — prevents self-demotion etc. */
  isSelf?: boolean;
  /** Disable everything (e.g. row is locked) */
  disabled?: boolean;
  /** When true, show a "Admin temp." readonly chip and lock the picker (because the active grant is the source of truth) */
  showTempAdminLock?: boolean;
}

/**
 * Animated, brume-styled role picker.
 * - Compact pill button showing current role with icon + color.
 * - Click to open a glassmorphism panel with all options.
 * - Permission rules:
 *   - Only an actor with role `admin` can assign or remove the `admin` role.
 *   - `temp_admin` cannot modify any other admin (caller must enforce this; here we just disable).
 *   - Others (`manager`) can assign roles up to `moderator`.
 */
export default function RolePicker({
  value,
  onChange,
  actorRole,
  isSelf = false,
  disabled = false,
  showTempAdminLock = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Role | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = (value || "user") as Role;
  const currentMeta = ROLE_META[current] ?? ROLE_META.user;

  // close on outside click + esc
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const isOptionAllowed = (r: Role): { allowed: boolean; reason?: string } => {
    if (isSelf) return { allowed: false, reason: "Vous ne pouvez pas modifier votre propre rôle" };
    // admin assignment locked to real admin
    if (r === "admin" && actorRole !== "admin") return { allowed: false, reason: "Réservé aux administrateurs titulaires" };
    // remove admin from someone else also requires admin
    if (current === "admin" && actorRole !== "admin") return { allowed: false, reason: "Seul un admin peut rétrograder un admin" };
    // manager cannot promote to manager (only admin)
    if (r === "manager" && actorRole !== "admin") return { allowed: false, reason: "Réservé aux administrateurs" };
    return { allowed: true };
  };

  const handleSelect = async (r: Role) => {
    if (r === current) {
      setOpen(false);
      return;
    }
    const check = isOptionAllowed(r);
    if (!check.allowed) return;
    try {
      setPending(r);
      await onChange(r);
      setOpen(false);
    } finally {
      setPending(null);
    }
  };

  // Locked state when subject is an active temp_admin (the grant is canonical)
  if (showTempAdminLock) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${ROLE_META.temp_admin.tone.border} ${ROLE_META.temp_admin.tone.bg} ${ROLE_META.temp_admin.tone.text}`}
        title="Le rôle est piloté par le grant temp_admin actif"
      >
        <Hourglass className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Admin temp.</span>
        <Lock className="w-3 h-3 opacity-60" />
      </div>
    );
  }

  const Icon = currentMeta.icon;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger pill */}
      <motion.button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all
          ${currentMeta.tone.border} ${currentMeta.tone.bg} ${currentMeta.tone.text}
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-110"}
          ${open ? `ring-2 ${currentMeta.tone.ring} ring-offset-2 ring-offset-foret-nocturne` : ""}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">{currentMeta.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-60"
        >
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden bg-foret-nocturne/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-50 right-0 mt-2 w-72 origin-top-right rounded-2xl p-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(242,238,221,0.10) 0%, rgba(242,238,221,0.02) 100%)",
                border: "1px solid rgba(242,238,221,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)",
              }}
            >
              <div className="bg-foret-nocturne/90 rounded-[0.95rem] py-2 overflow-hidden">
                <div className="px-3 pt-2 pb-3">
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em] opacity-40">Rôle de la guilde</span>
                </div>

                <ul className="space-y-0.5 px-1.5 pb-1.5" role="listbox">
                  {VISIBLE_ORDER.map((r, i) => {
                    const meta = ROLE_META[r];
                    const RowIcon = meta.icon;
                    const isCurrent = r === current;
                    const { allowed, reason } = isOptionAllowed(r);
                    const isPending = pending === r;

                    return (
                      <motion.li
                        key={r}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={isCurrent}
                          disabled={!allowed && !isCurrent}
                          title={!allowed ? reason : undefined}
                          onClick={() => handleSelect(r)}
                          className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all relative group
                            ${isCurrent
                              ? `${meta.tone.bg} ${meta.tone.border} border`
                              : allowed
                                ? "hover:bg-white/5 border border-transparent"
                                : "opacity-30 cursor-not-allowed border border-transparent"}`}
                        >
                          {/* Icon orb */}
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${meta.tone.bg} ${meta.tone.border}`}
                          >
                            <RowIcon className={`w-3.5 h-3.5 ${meta.tone.text}`} />
                          </span>

                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <p className={`text-xs font-bold ${isCurrent ? meta.tone.text : "text-ivoire-ancien"}`}>
                                {meta.label}
                              </p>
                              {!allowed && !isCurrent && (
                                <Lock className="w-3 h-3 opacity-40" />
                              )}
                            </div>
                            <p className="text-[10px] text-ivoire-ancien/40 leading-relaxed">
                              {meta.description}
                            </p>
                          </div>

                          {/* State indicator */}
                          <span className="flex-shrink-0 self-center w-5 h-5 flex items-center justify-center">
                            {isPending ? (
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-or-ancestral/40 border-t-or-ancestral rounded-full"
                              />
                            ) : isCurrent ? (
                              <Check className={`w-3.5 h-3.5 ${meta.tone.text}`} />
                            ) : null}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="border-t border-white/5 mt-1 pt-2 px-3 pb-2">
                  <p className="text-[9px] text-ivoire-ancien/30 italic leading-relaxed">
                    Les modifications sont consignées dans le registre des anciens.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
