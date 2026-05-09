"use client";

import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Users, GraduationCap, Bell, User, Plus, Pen, MessageCirclePlus,
  TreePine, Compass, ShieldCheck, LogIn, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications } from "@/hooks/forum/useNotifications";
import { useGlobalUnreadCount } from "@/hooks/chat/useGlobalUnreadCount";
import { ROUTES } from "@/lib/constants/routes";
import { canModerate } from "@/lib/constants/business";

export interface ConstellationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  /** Marker for the central context-action satellite (rendered larger, top of arc) */
  isPrimary?: boolean;
}

export interface ConstellationActions {
  primary: ConstellationItem | null;
  satellites: ConstellationItem[];
}

export function useConstellationActions(): ConstellationActions {
  const pathname = usePathname() || "/";
  const { user, role, effectiveRole, contributorStatus } = useAuth();
  const { unreadCount: notifUnread } = useNotifications();
  const chatUnread = useGlobalUnreadCount();

  // ---- Context-aware primary action ----
  let primary: ConstellationItem | null = null;
  if (pathname.startsWith("/forum/") && pathname.split("/").length === 3) {
    // /forum/[category_slug] (not the index)
    primary = { id: "new-thread", label: "Nouveau sujet", icon: Plus, href: `${pathname}/new`, isPrimary: true };
  } else if (pathname.startsWith("/forum/thread/")) {
    primary = { id: "reply", label: "Répondre", icon: Pen, href: `${pathname}#reply`, isPrimary: true };
  } else if (pathname.startsWith("/chat")) {
    primary = { id: "new-chat", label: "Nouvelle conversation", icon: MessageCirclePlus, href: "/chat?new=1", isPrimary: true };
  } else if (pathname.startsWith("/genealogie")) {
    primary = { id: "add-member", label: "Ajouter un membre", icon: TreePine, href: "/genealogie?add=1", isPrimary: true };
  } else if (pathname === "/savoir") {
    if (contributorStatus !== "approved") {
      primary = { id: "become-contrib", label: "Devenir contributeur", icon: Pen, href: ROUTES.CONTRIBUTEUR, isPrimary: true };
    } else {
      primary = { id: "write-article", label: "Écrire un article", icon: Pen, href: ROUTES.ARTICLE_NEW, isPrimary: true };
    }
  }

  // ---- Stable destination satellites ----
  const isStaff = canModerate(effectiveRole);

  const satellites: ConstellationItem[] = [
    { id: "home", label: "Accueil", icon: Home, href: "/" },
    { id: "savoir", label: "Savoir", icon: BookOpen, href: ROUTES.SAVOIR },
    { id: "community", label: "Communauté", icon: Users, href: ROUTES.FORUM, badge: chatUnread > 0 ? chatUnread : undefined },
    isStaff
      ? { id: "moderation", label: "Modération", icon: ShieldCheck, href: ROUTES.ADMIN_FORUM }
      : { id: "ecole", label: "École", icon: GraduationCap, href: ROUTES.ECOLE },
    user
      ? { id: "notifs", label: "Notifications", icon: Bell, href: "/notifications", badge: notifUnread > 0 ? notifUnread : undefined }
      : { id: "discover", label: "Découvrir", icon: Compass, href: ROUTES.GEOGRAPHIE },
    user
      ? { id: "profile", label: "Profil", icon: User, href: ROUTES.PROFIL }
      : { id: "auth", label: "Se connecter", icon: LogIn, href: ROUTES.AUTH },
  ];

  return { primary, satellites };
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
