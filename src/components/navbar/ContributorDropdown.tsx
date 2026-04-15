"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Users, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { UserRole } from "@/components/AuthProvider";

interface ContributorDropdownProps {
  role: UserRole | null;
  isApproved?: boolean;
  articleCount?: number;
}

export function ContributorDropdown({
  role,
  isApproved = false,
  articleCount = 0,
}: ContributorDropdownProps) {
  const [open, setOpen] = useState(false);

  // Admin/Manager: voir demandes de contribution
  if (role === "admin" || role === "manager") {
    return (
      <div className="relative group">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C16B34] relative"
        >
          Contributions
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
              className="absolute right-0 mt-2 w-56 rounded-lg bg-black/80 border border-white/10 backdrop-blur-lg shadow-xl z-40 overflow-hidden"
            >
              <Link
                href={ROUTES.CONTRIBUTION_REQUESTS}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <Users size={16} className="text-[#C16B34]" />
                <div>
                  <p className="text-sm font-medium">Demandes de contribution</p>
                  <p className="text-xs text-gray-400">Gérer les candidatures</p>
                </div>
              </Link>

              <Link
                href={ROUTES.ADMIN}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard size={16} className="text-[#C16B34]" />
                <div>
                  <p className="text-sm font-medium">Tableau de bord admin</p>
                  <p className="text-xs text-gray-400">Gestion complète</p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Contributor approuvé: espace contributeur
  if (role === "contributor" && isApproved) {
    return (
      <div className="relative group">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#C16B34] relative"
        >
          Espace contributeur
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
              className="absolute right-0 mt-2 w-56 rounded-lg bg-black/80 border border-white/10 backdrop-blur-lg shadow-xl z-40 overflow-hidden"
            >
              <Link
                href={ROUTES.ARTICLE_NEW}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <FileText size={16} className="text-[#C16B34]" />
                <div>
                  <p className="text-sm font-medium">Écrire un article</p>
                  <p className="text-xs text-gray-400">Créer ou modifier</p>
                </div>
              </Link>

              <Link
                href={ROUTES.CONTRIBUTEUR}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard size={16} className="text-[#C16B34]" />
                <div>
                  <p className="text-sm font-medium">Mon tableau de bord</p>
                  <p className="text-xs text-gray-400">
                    {articleCount} article{articleCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}
