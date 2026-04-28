"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";
import { formatTempAdminRemaining } from "@/lib/constants/business";

interface TempAdminBadgeProps {
  expiresAt: string | null;
}

/**
 * Badge visible quand l'utilisateur courant est admin_temp actif.
 * Affiche le temps restant avec mise à jour automatique chaque minute.
 * Pulse rouge quand il reste moins d'1h.
 */
export default function TempAdminBadge({ expiresAt }: TempAdminBadgeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(i);
  }, []);

  if (!expiresAt) return null;

  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return null;

  const isUrgent = ms < 60 * 60 * 1000; // moins d'1h

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
        isUrgent
          ? "bg-red-500/15 border-red-500/40 text-red-300"
          : "bg-or-ancestral/15 border-or-ancestral/40 text-or-ancestral"
      }`}
      title="Vous êtes administrateur temporaire"
    >
      <motion.span
        animate={isUrgent ? { rotate: [0, 15, -15, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Hourglass className="w-3.5 h-3.5" />
      </motion.span>
      <span>Admin Temp · {formatTempAdminRemaining(expiresAt)}</span>
    </motion.div>
  );
}
