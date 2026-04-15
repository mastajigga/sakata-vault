"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, ChevronDown, LogOut, Settings, FileText, Users } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { UserRole } from "@/components/AuthProvider";

interface UserMenuProps {
  userName: string;
  subscriptionTier: string | null;
  role: UserRole | null;
  isApprovedContributor: boolean;
  onSignOut: () => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function UserMenu({
  userName,
  subscriptionTier,
  role,
  isApprovedContributor,
  onSignOut,
  open,
  onOpen,
  onClose,
}: UserMenuProps) {

  return (
    <div className="relative group">
      <button
        onClick={() => (open ? onClose() : onOpen())}
        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-semibold transition-all border"
        style={{
          background: subscriptionTier === "premium"
            ? "rgba(193, 107, 52, 0.08)"
            : "rgba(181, 149, 81, 0.05)",
          borderColor: subscriptionTier === "premium"
            ? "rgba(193,107,52,0.4)"
            : "rgba(181,149,81,0.2)",
          color: subscriptionTier === "premium" ? "#C16B34" : "var(--or-ancestral)",
        }}
      >
        <div className="relative">
          <UserCircle className="w-5 h-5 opacity-80" />
        </div>
        <span className="max-w-[120px] truncate">{userName}</span>
        {subscriptionTier === "premium" && (
          <span className="text-[9px] font-mono bg-[#C16B34]/20 text-[#C16B34] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Premium
          </span>
        )}
        <ChevronDown
          size={14}
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
            {/* Profile */}
            <Link
              href={ROUTES.PROFIL}
              onClick={() => onClose()}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
            >
              <UserCircle size={16} style={{ color: "var(--or-ancestral)" }} />
              <div>
                <p className="text-sm font-medium">Mon profil</p>
                <p className="text-xs text-gray-400">Gérer mon compte</p>
              </div>
            </Link>

            {/* Contributions — visible for admin/manager/approved contributors */}
            {role && ["admin", "manager", "contributor"].includes(role) && (
              <>
                {role === "admin" || role === "manager" ? (
                  <Link
                    href={ROUTES.CONTRIBUTION_REQUESTS}
                    onClick={() => onClose()}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <Users size={16} style={{ color: "var(--or-ancestral)" }} />
                    <div>
                      <p className="text-sm font-medium">Demandes de contribution</p>
                      <p className="text-xs text-gray-400">Gérer les candidatures</p>
                    </div>
                  </Link>
                ) : null}

                {isApprovedContributor && (
                  <Link
                    href={ROUTES.ARTICLE_NEW}
                    onClick={() => onClose()}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <FileText size={16} style={{ color: "var(--or-ancestral)" }} />
                    <div>
                      <p className="text-sm font-medium">Écrire un article</p>
                      <p className="text-xs text-gray-400">Créer ou modifier</p>
                    </div>
                  </Link>
                )}

                {isApprovedContributor && (
                  <Link
                    href={ROUTES.CONTRIBUTEUR}
                    onClick={() => onClose()}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <FileText size={16} style={{ color: "var(--or-ancestral)" }} />
                    <div>
                      <p className="text-sm font-medium">Mon tableau de bord</p>
                      <p className="text-xs text-gray-400">Mes articles</p>
                    </div>
                  </Link>
                )}
              </>
            )}

            {/* Help & Documentation */}
            <Link
              href={ROUTES.HELP_PHILOSOPHY}
              onClick={() => onClose()}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
            >
              <FileText size={16} style={{ color: "var(--or-ancestral)" }} />
              <div>
                <p className="text-sm font-medium">Aide</p>
                <p className="text-xs text-gray-400">Documentation et guides</p>
              </div>
            </Link>

            {/* Admin Center */}
            {(role === "admin" || role === "manager") && (
              <Link
                href={ROUTES.CONTRIBUTION_REQUESTS}
                onClick={() => onClose()}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <Users size={16} style={{ color: "var(--or-ancestral)" }} />
                <div>
                  <p className="text-sm font-medium">Admin Center</p>
                  <p className="text-xs text-gray-400">Gestion du site</p>
                </div>
              </Link>
            )}

            {/* Sign Out */}
            <button
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <LogOut size={16} className="text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">Déconnexion</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
