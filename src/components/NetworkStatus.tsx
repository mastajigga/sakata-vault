"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

/**
 * NetworkStatus — détecteur de connectivité réseau.
 *
 * Écoute les événements `online`/`offline` du navigateur et affiche
 * une bannière discrète quand l'utilisateur perd la connexion.
 * La bannière disparaît automatiquement au retour de la connexion.
 */
export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // État initial
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Afficher brièvement la confirmation de reconnexion
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Bannière hors-ligne */}
      {!isOnline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium"
          style={{
            backgroundColor: "rgba(196, 160, 53, 0.95)", // or-ancestral
            color: "var(--foret-nocturne)",
            backdropFilter: "blur(8px)",
          }}
        >
          <WifiOff size={14} strokeWidth={2} />
          <span>Connexion perdue — mode hors-ligne</span>
        </motion.div>
      )}

      {/* Bannière de reconnexion (temporaire) */}
      {showRestored && isOnline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium"
          style={{
            backgroundColor: "rgba(15, 44, 36, 0.95)", // emerald-deep
            color: "var(--or-ancestral)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Wifi size={14} strokeWidth={2} />
          <span>Connexion rétablie</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
