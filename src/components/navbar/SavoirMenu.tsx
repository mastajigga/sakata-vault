"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, GraduationCap, Map } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useLanguage } from "@/components/LanguageProvider";

interface SavoirMenuProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function SavoirMenu({ open, onOpen, onClose }: SavoirMenuProps) {
  const { t } = useLanguage();

  const submenu = [
    {
      label: "Articles",
      description: "Encyclopédie du patrimoine Sakata",
      href: ROUTES.SAVOIR,
      icon: BookOpen,
    },
    {
      label: "École",
      description: "Apprentissage mathématiques",
      href: ROUTES.ECOLE,
      icon: GraduationCap,
    },
    {
      label: "Géographie",
      description: "Carte interactive 3D",
      href: ROUTES.GEOGRAPHIE,
      icon: Map,
    },
  ];

  return (
    <div className="relative group">
      <button
        onClick={() => (open ? onClose() : onOpen())}
        className="flex items-center gap-2 text-sm font-medium transition-all"
        style={{
          color: "var(--brume-matinale)",
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.color = "var(--or-ancestral)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.opacity = "0.7";
          (e.target as HTMLElement).style.color = "var(--brume-matinale)";
        }}
      >
        {t("nav.knowledge")}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-56 rounded-lg bg-black/80 border border-white/10 backdrop-blur-lg shadow-xl z-40 overflow-hidden"
          >
            {submenu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
                >
                  <Icon size={16} style={{ color: "var(--or-ancestral)" }} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
