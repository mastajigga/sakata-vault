"use client";

import {
  LayoutDashboard, FileText, Sparkles, MessageSquare, ScrollText, Image as ImageIcon,
  Bell, Notebook, Users, Home, MoreHorizontal, ArrowLeft, Settings, ShieldCheck, ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { canModerate } from "@/lib/constants/business";
import type { UserRole } from "@/lib/constants/business";

export type AdminBatchKey = "pilotage" | "outils";

export interface AdminConstellationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  switchTo?: AdminBatchKey;
  children?: AdminConstellationItem[];
  isBack?: boolean;
}

export interface AdminConstellationActions {
  batches: Record<AdminBatchKey, AdminConstellationItem[]>;
}

/**
 * Admin-specific constellation: bottom-LEFT FAB, two batches (Pilotage / Outils)
 * with a switcher each. Sub-menus for Modération and Aide.
 */
export function useAdminConstellationActions(role: UserRole | null): AdminConstellationActions {
  const isAdmin = role === "admin" || role === "temp_admin";
  const isManager = isAdmin || role === "manager";
  const isStaff = canModerate(role);
  const isModerator = role === "moderator";

  // ---- Sub-menus ----
  const moderationChildren: AdminConstellationItem[] = [
    { id: "mod-forum", label: "Signalements", icon: MessageSquare, href: ROUTES.ADMIN_FORUM },
    { id: "mod-logs", label: "Journaux", icon: ScrollText, href: ROUTES.ADMIN_LOGS },
    isAdmin
      ? { id: "mod-users", label: "Membres", icon: Users, href: ROUTES.ADMIN_USERS }
      : { id: "mod-back-home", label: "Retour site", icon: Home, href: "/" },
  ];

  const helpChildren: AdminConstellationItem[] = [
    { id: "help-hub", label: "Centre d'aide", icon: Notebook, href: "/admin/help" },
    { id: "help-notes", label: "Mes notes", icon: FileText, href: "/admin/help/notes" },
    { id: "help-changelog", label: "Changelog", icon: ScrollText, href: ROUTES.HELP_CHANGELOG },
  ];

  // ---- Moderator-only condensed batch (limited routes) ----
  if (isModerator) {
    return {
      batches: {
        pilotage: [
          { id: "mod-forum", label: "Signalements", icon: MessageSquare, href: ROUTES.ADMIN_FORUM },
          { id: "mod-logs", label: "Journaux", icon: ScrollText, href: ROUTES.ADMIN_LOGS },
          { id: "mod-back", label: "Retour site", icon: Home, href: "/" },
          { id: "outils", label: "Outils", icon: MoreHorizontal, switchTo: "outils" },
        ],
        outils: [
          { id: "help-hub", label: "Aide", icon: Notebook, href: "/admin/help" },
          { id: "help-changelog", label: "Changelog", icon: ScrollText, href: ROUTES.HELP_CHANGELOG },
          { id: "back-pilotage", label: "Pilotage", icon: ArrowLeft, switchTo: "pilotage" },
        ],
      },
    };
  }

  // ---- Batch A — Pilotage (4 + switcher) ----
  const pilotage: AdminConstellationItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "articles", label: "Articles", icon: FileText, href: "/admin/content" },
    isStaff
      ? { id: "moderation", label: "Modération", icon: ShieldCheck, children: moderationChildren }
      : { id: "media", label: "Médiathèque", icon: ImageIcon, href: "/admin/media" },
    isAdmin
      ? { id: "users", label: "Membres", icon: Users, href: ROUTES.ADMIN_USERS }
      : { id: "media-fb", label: "Médiathèque", icon: ImageIcon, href: "/admin/media" },
    { id: "outils", label: "Outils", icon: MoreHorizontal, switchTo: "outils" },
  ];

  // ---- Batch B — Outils (4 + switcher) ----
  const outils: AdminConstellationItem[] = [
    isManager
      ? { id: "ai", label: "Orchestration IA", icon: Sparkles, href: "/admin/ai" }
      : { id: "media", label: "Médiathèque", icon: ImageIcon, href: "/admin/media" },
    isManager
      ? { id: "notif", label: "Notifications", icon: Bell, href: "/admin/notifications" }
      : { id: "help-hub-2", label: "Aide", icon: Notebook, href: "/admin/help" },
    { id: "help", label: "Aide", icon: Notebook, children: helpChildren },
    { id: "site", label: "Retour site", icon: Home, href: "/" },
    { id: "back-pilotage", label: "Pilotage", icon: ArrowLeft, switchTo: "pilotage" },
  ];

  return {
    batches: { pilotage, outils },
  };
}

/**
 * Admin FAB rest icon — varies by current admin route to give a contextual hint.
 */
export function useAdminFabRestIcon(pathname: string): LucideIcon {
  if (pathname.startsWith("/admin/forum")) return ShieldAlert;
  if (pathname.startsWith("/admin/logs")) return ScrollText;
  if (pathname.startsWith("/admin/content") || pathname.startsWith("/admin/article")) return FileText;
  if (pathname.startsWith("/admin/users")) return Users;
  if (pathname.startsWith("/admin/ai")) return Sparkles;
  if (pathname.startsWith("/admin/media")) return ImageIcon;
  if (pathname.startsWith("/admin/notifications")) return Bell;
  if (pathname.startsWith("/admin/help")) return Notebook;
  return Settings;
}
