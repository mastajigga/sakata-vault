"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, MessageCircle, Users2 } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useLanguage } from "@/components/LanguageProvider";
import { useGlobalUnreadCount } from "@/hooks/chat/useGlobalUnreadCount";

interface CommunityMenuProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function CommunityMenu({ open, onOpen, onClose }: CommunityMenuProps) {
  const { t } = useLanguage();
  const totalUnread = useGlobalUnreadCount();

  const submenu = [
    {
      label: t("nav.community"),
      description: "Discussions et débats",
      href: ROUTES.FORUM,
      icon: Users2,
    },
    {
      label: t("nav.members"),
      description: "Annuaire communautaire",
      href: ROUTES.MEMBRES,
      icon: Users,
    },
    {
      label: t("nav.chat"),
      description: "Messagerie privée",
      href: ROUTES.CHAT,
      icon: MessageCircle,
      badge: totalUnread > 0 ? totalUnread : undefined,
    },
  ];

  return (
    <div className="relative group">
      <button
        onClick={() => (open ? onClose() : onOpen())}
        className="flex items-center gap-2 text-sm font-medium transition-all relative"
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
        Communauté
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2.5 -top-1 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          />
        )}
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
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0 relative"
                >
                  <Icon size={16} style={{ color: "var(--or-ancestral)" }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-medium"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
