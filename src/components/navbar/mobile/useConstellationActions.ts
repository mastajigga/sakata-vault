"use client";

import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Users, GraduationCap, Bell, User, Plus, Pen, MessageCirclePlus,
  TreePine, Compass, ShieldCheck, LogIn, Map, MessageCircle, MoreHorizontal, ArrowLeft,
  Calendar, Languages, Sigma, BookMarked, ScrollText, Sparkles,
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
  /** When defined, tap toggles to a different top-level batch. */
  switchTo?: BatchKey;
  /** Sub-options shown when the user drills into this item. */
  children?: ConstellationItem[];
  /** Marker for "go back to previous level". Rendered as a return-styled control. */
  isBack?: boolean;
}

export interface ConstellationActions {
  primary: ConstellationItem | null;
  /** Top-level batches: 4 destinations + 1 switcher each. */
  batches: Record<BatchKey, ConstellationItem[]>;
}

export function useConstellationActions(): ConstellationActions {
  const pathname = usePathname() || "/";
  const { user, contributorStatus, effectiveRole } = useAuth();
  const { unreadCount: notifUnread } = useNotifications();
  const chatUnread = useGlobalUnreadCount();
  const isStaff = canModerate(effectiveRole);
  const isApprovedContributor = contributorStatus === "approved";

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
    primary = isApprovedContributor
      ? { id: "write-article", label: "Écrire un article", icon: Pen, href: ROUTES.ARTICLE_NEW, isPrimary: true }
      : { id: "become-contrib", label: "Devenir contributeur", icon: Pen, href: ROUTES.CONTRIBUTEUR, isPrimary: true };
  }

  // ---- Sub-menus ----
  const savoirChildren: ConstellationItem[] = [
    { id: "savoir-articles", label: "Articles", icon: BookOpen, href: ROUTES.SAVOIR },
    { id: "savoir-langue", label: "Langue", icon: Languages, href: ROUTES.LANGUE },
    isApprovedContributor
      ? { id: "savoir-write", label: "Écrire", icon: Pen, href: ROUTES.ARTICLE_NEW }
      : { id: "savoir-contrib", label: "Contribuer", icon: Pen, href: ROUTES.CONTRIBUTEUR },
  ];

  const communauteChildren: ConstellationItem[] = [
    { id: "comm-forum", label: "Forum", icon: Users, href: ROUTES.FORUM },
    { id: "comm-membres", label: "Membres", icon: User, href: ROUTES.MEMBRES },
    user
      ? { id: "comm-chat", label: "Messagerie", icon: MessageCircle, href: ROUTES.CHAT, badge: chatUnread > 0 ? chatUnread : undefined }
      : { id: "comm-arbre", label: "Mon arbre", icon: TreePine, href: ROUTES.GENEALOGIE },
    { id: "comm-calendrier", label: "Calendrier", icon: Calendar, href: ROUTES.CALENDRIER },
  ];

  const ecoleChildren: ConstellationItem[] = [
    { id: "ecole-primaire", label: "Primaire", icon: BookMarked, href: "/ecole/primaire" },
    { id: "ecole-secondaire", label: "Secondaire", icon: Sigma, href: "/ecole/secondaire" },
    { id: "ecole-langue", label: "Langue", icon: Languages, href: ROUTES.LANGUE },
  ];

  const moderationChildren: ConstellationItem[] = [
    { id: "mod-forum", label: "Signalements", icon: ShieldCheck, href: ROUTES.ADMIN_FORUM },
    { id: "mod-logs", label: "Journaux", icon: ScrollText, href: ROUTES.ADMIN_LOGS },
    { id: "mod-users", label: "Membres", icon: Users, href: ROUTES.ADMIN_USERS },
  ];

  // ---- Batch A — Essentiel ----
  const essentiel: ConstellationItem[] = [
    { id: "home", label: "Accueil", icon: Home, href: "/" },
    { id: "savoir", label: "Savoir", icon: BookOpen, children: savoirChildren },
    { id: "community", label: "Communauté", icon: Users, children: communauteChildren, badge: chatUnread > 0 ? chatUnread : undefined },
    user
      ? { id: "notifs", label: "Notifications", icon: Bell, href: "/notifications", badge: notifUnread > 0 ? notifUnread : undefined }
      : { id: "auth", label: "Se connecter", icon: LogIn, href: ROUTES.AUTH },
    { id: "more", label: "Découverte", icon: MoreHorizontal, switchTo: "decouverte" },
  ];

  // ---- Batch B — Découverte ----
  const decouverte: ConstellationItem[] = [
    { id: "ecole", label: "École", icon: GraduationCap, children: ecoleChildren },
    { id: "geo", label: "Géographie", icon: Map, href: ROUTES.GEOGRAPHIE },
    user
      ? { id: "profile", label: "Mon profil", icon: User, href: ROUTES.PROFIL }
      : { id: "compass", label: "Découvrir", icon: Compass, href: ROUTES.GEOGRAPHIE },
    isStaff
      ? { id: "moderation", label: "Modération", icon: ShieldCheck, children: moderationChildren }
      : { id: "premium", label: "Premium", icon: Sparkles, href: ROUTES.PREMIUM },
    { id: "back", label: "Essentiel", icon: ArrowLeft, switchTo: "essentiel" },
  ];

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
