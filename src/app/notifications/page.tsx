"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, MessageCircle, AtSign, CheckCheck, Hourglass, ShieldOff,
  Megaphone, Clock, Crown, Sparkles, ArrowLeft, Inbox,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications, type ForumNotification } from "@/hooks/forum/useNotifications";

const ICON_MAP: Record<string, any> = {
  reply: MessageCircle,
  thread_reply: MessageCircle,
  mention: AtSign,
  temp_admin_granted: Hourglass,
  temp_admin_revoked: ShieldOff,
  temp_admin_expired: ShieldOff,
  temp_admin_expiring_soon: Clock,
  system_announcement: Megaphone,
  subscription_granted: Crown,
  subscription_revoked: Sparkles,
};

const TONE_MAP: Record<string, string> = {
  temp_admin_granted: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20",
  temp_admin_revoked: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  temp_admin_expired: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  temp_admin_expiring_soon: "text-red-400 bg-red-500/10 border-red-500/20",
  system_announcement: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  subscription_granted: "text-or-ancestral bg-or-ancestral/15 border-or-ancestral/30",
  subscription_revoked: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  reply: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20",
  thread_reply: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20",
  mention: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20",
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "à l'instant";
  if (diff < 3_600_000) return `il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `il y a ${Math.floor(diff / 3_600_000)} h`;
  return date.toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
};

const formatExpiresAt = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
};

const getMessage = (n: ForumNotification): string => {
  const actorName = n.actor?.nickname || n.actor?.username || "Quelqu'un";
  const threadTitle = n.thread?.title || "votre message";
  switch (n.type) {
    case "reply":
      return `${actorName} a répondu à votre message dans « ${threadTitle} »`;
    case "mention":
      return `${actorName} vous a mentionné dans « ${threadTitle} »`;
    case "thread_reply":
      return `${actorName} a posté dans « ${threadTitle} »`;
    case "temp_admin_granted":
      return `${actorName} vous a accordé le rôle d'Administrateur Temporaire jusqu'au ${formatExpiresAt(n.metadata?.expires_at)}.`;
    case "temp_admin_revoked":
      return `${actorName} a révoqué votre rôle d'Administrateur Temporaire.`;
    case "temp_admin_expiring_soon":
      return `Votre rôle d'Administrateur Temporaire expire bientôt (${formatExpiresAt(n.metadata?.expires_at)}).`;
    case "temp_admin_expired":
      return "Votre rôle d'Administrateur Temporaire a expiré.";
    case "system_announcement":
      return n.metadata?.message || "Annonce système";
    case "subscription_granted": {
      const tier = (n.metadata as any)?.tier === "elite" ? "Elite" : "Premium";
      const exp = (n.metadata as any)?.expires_at;
      const until = exp ? ` jusqu'au ${formatExpiresAt(exp)}` : " (illimité)";
      return `${actorName} vous a offert un abonnement ${tier}${until}.`;
    }
    case "subscription_revoked":
      return `Votre abonnement Premium a été révoqué par ${actorName}.`;
    default:
      return `${actorName} a interagi avec vous`;
  }
};

const getLink = (n: ForumNotification): string => {
  if (n.type.startsWith("temp_admin")) return "/admin";
  if (n.type === "subscription_granted" || n.type === "subscription_revoked") return "/savoir";
  if (n.type === "system_announcement") return "/";
  if (n.thread?.slug) return `/forum/thread/${n.thread.slug}`;
  return "/forum";
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="min-h-[100dvh] bg-foret-nocturne flex items-center justify-center">
        <p className="text-ivoire-ancien/40 font-mono text-xs uppercase tracking-widest animate-pulse">
          Convocation des messages…
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] bg-foret-nocturne overflow-hidden">
      {/* Aura */}
      <div className="pointer-events-none fixed top-1/3 -right-40 w-[500px] h-[500px] bg-or-ancestral/10 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-or-ancestral hover:text-ivoire-ancien transition-colors mb-8 text-xs uppercase tracking-widest font-mono"
        >
          <ArrowLeft size={14} /> Retour à l'accueil
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-2">
            <span className="eyebrow flex items-center gap-2" style={{ color: "var(--or-ancestral)" }}>
              <Bell className="w-3 h-3" /> Cloche du sanctuaire
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ivoire-ancien tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-ivoire-ancien/55">
              Toutes les paroles qui vous ont été adressées, par ordre chronologique.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="px-3 py-1.5 rounded-full bg-or-ancestral/15 border border-or-ancestral/30 text-or-ancestral text-[10px] font-mono uppercase tracking-widest">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/30 text-or-ancestral text-xs font-bold hover:bg-or-ancestral/20 transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tout marquer lu
              </button>
            )}
          </div>
        </motion.header>

        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center text-ivoire-ancien/40 font-mono text-xs uppercase tracking-widest animate-pulse">
            Chargement…
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2rem]"
          >
            <Inbox className="w-10 h-10 text-or-ancestral/20 mx-auto mb-4" />
            <p className="text-ivoire-ancien/50 italic">Aucune notification pour l'instant.</p>
            <p className="text-ivoire-ancien/30 text-xs mt-1">Le silence du village est paisible.</p>
          </motion.div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {notifications.map((n, i) => {
                const Icon = ICON_MAP[n.type] || Bell;
                const tone = TONE_MAP[n.type] || "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20";
                const isUnread = !n.read_at;
                return (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  >
                    <Link
                      href={getLink(n)}
                      onClick={() => { if (isUnread) markRead(n.id); }}
                      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                        isUnread
                          ? "bg-or-ancestral/[0.04] border-or-ancestral/20 hover:border-or-ancestral/40"
                          : "bg-white/[0.02] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${tone}`}>
                        <Icon className="w-4 h-4" />
                      </span>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className={`text-sm leading-relaxed ${isUnread ? "text-ivoire-ancien" : "text-ivoire-ancien/70"}`}>
                          {getMessage(n)}
                        </p>
                        {(n.metadata as any)?.reason && (
                          <p className="text-xs italic text-ivoire-ancien/50">"{(n.metadata as any).reason}"</p>
                        )}
                        <p className="text-[10px] font-mono uppercase tracking-widest text-ivoire-ancien/35">
                          {formatDate(n.created_at)}
                        </p>
                      </div>

                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-or-ancestral mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(181,149,81,0.6)]" />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </main>
  );
}
