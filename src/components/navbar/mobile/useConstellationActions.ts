"use client";

import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Users, GraduationCap, Bell, User, Plus, Pen, MessageCirclePlus,
  TreePine, Compass, ShieldCheck, LogIn, Map, MessageCircle, MoreHorizontal, ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications } from "@/hooks/forum/useNotifications";
import { useGlobalUnreadCount } from "@/hooks/chat/useGlobalUnreadCount";
import { ROUTES } from "@/lib/constants/routes";
import { canModerate } from "@/lib/constants/business";

export type BatchKey = "essentiel" | "decouverte";

export interface ConstellationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** When defined, tap navigates to this URL. */
  href?: string;
  badge?: number;
  /** Marker for the central context-action satellite (rendered larger, styled gold). */
  isPrimary?: boolean;
  /** When defined, tap toggles to a different batch instead of navigating. */
  switchTo?: BatchKey;
}

export interface ConstellationActions {
  primary: ConstellationItem | null;
  /** 4 destinations + 1 switcher, per batch. */
  batches: Record<BatchKey, ConstellationItem[]>;
}

export function useConstellationActions(): ConstellationActions {
  const pathname = usePathname() || "/";
  const { user, contributorStatus, effectiveRole } = useAuth();
  const { unreadCount: notifUnread } = useNotifications();
  const chatUnread = useGlobalUnreadCount();

  // ---- Context-aware primary (optional, golden, larger) ----
  let primary: ConstellationItem | null = null;
  if (pathname.startsWith("/forum/") && pathname.split("/").length === 3) {
    primary = { id: "new-thread", label: "Nouveau sujet", icon: Plus, href: `${pathname}/new`, isPrimary: true };
  } else if (pathname.startsWith("/forum/thread/")) {
    primary = { id: "reply", label: "Répondre", icon: Pen, href: `${pathname}#reply`, isPrimary: true };
  } else if (pathname.startsWith("/chat")) {
    primary = { id: "new-chat", label: "Nouvelle conversation", icon: MessageCirclePlus, href: "/chat?new=1", isPrimary: true };
  } else if (pathname.startsWith("/genealogie")) {
    primary = { id: "add-member", label: "Ajouter un membre", icon: TreePine, href: "/genealogie?add=1", isPrimary: true };
  } else if (pathname === "/savoir") {
    primary = contributorStatus !== "approved"
      ? { id: "become-contrib", label: "Devenir contributeur", icon: Pen, href: ROUTES.CONTRIBUTEUR, isPrimary: true }
      : { id: "write-article", label: "Écrire un article", icon: Pen, href: ROUTES.ARTICLE_NEW, isPrimary: true };
  }

  const isStaff = canModerate(effectiveRole);

  // ---- Batch A — Essentiel (4 destinations + 1 switcher) ----
  const essentiel: ConstellationItem[] = [
    { id: "home", label: "Accueil", icon: Home, href: "/" },
    { id: "savoir", label: "Savoir", icon: BookOpen, href: ROUTES.SAVOIR },
    { id: "community", label: "Communauté", icon: Users, href: ROUTES.FORUM, badge: chatUnread > 0 ? chatUnread : undefined },
    user
      ? { id: "notifs", label: "Notifications", icon: Bell, href: "/notifications", badge: notifUnread > 0 ? notifUnread : undefined }
      : { id: "auth", label: "Se connecter", icon: LogIn, href: ROUTES.AUTH },
    { id: "more", label: "Découverte", icon: MoreHorizontal, switchTo: "decouverte" },
  ];

  // ---- Batch B — Découverte (4 destinations + 1 switcher back) ----
  const decouverte: ConstellationItem[] = [
    { id: "ecole", label: "École", icon: GraduationCap, href: ROUTES.ECOLE },
    { id: "geo", label: "Géographie", icon: Map, href: ROUTES.GEOGRAPHIE },
    { id: "membres", label: "Membres", icon: Users, href: ROUTES.MEMBRES },
    user
      ? { id: "chat", label: "Messagerie", icon: MessageCircle, href: ROUTES.CHAT, badge: chatUnread > 0 ? chatUnread : undefined }
      : { id: "compass", label: "Découvrir", icon: Compass, href: ROUTES.GEOGRAPHIE },
    { id: "back", label: "Essentiel", icon: ArrowLeft, switchTo: "essentiel" },
  ];

  // For staff, replace the chat slot in Découverte with Modération + add Profil to essentiel.
  if (isStaff) {
    decouverte[3] = { id: "moderation", label: "Modération", icon: ShieldCheck, href: ROUTES.ADMIN_FORUM };
  }

  return {
    primary,
    batches: { essentiel, decouverte },
  };
}

/** Icon shown on the FAB at rest, depending on the current route. */
export function useFabRestIcon(): LucideIcon {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/forum/thread/")) return Pen;
  if (pathname.startsWith("/forum/") && pathname.split("/").length === 3) return Plus;
  if (pathname.startsWith("/chat")) return MessageCirclePlus;
  if (pathname.startsWith("/genealogie")) return TreePine;
  if (pathname.startsWith("/profil")) return User;
  return Compass;
}
