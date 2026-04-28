"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, AtSign, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/forum/useNotifications";
import { MemberImage } from "@/components/MemberImage";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const formatRelative = (iso: string) => {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `il y a ${d} j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getNotifLink = (n: typeof notifications[number]) => {
    if (n.thread?.slug) return `/forum/thread/${n.thread.slug}`;
    return "/forum";
  };

  const getNotifMessage = (n: typeof notifications[number]) => {
    const actorName = n.actor?.nickname || n.actor?.username || "Quelqu'un";
    const threadTitle = n.thread?.title || "votre message";
    if (n.type === "reply") return `${actorName} a répondu à votre message dans « ${threadTitle} »`;
    if (n.type === "mention") return `${actorName} vous a mentionné dans « ${threadTitle} »`;
    if (n.type === "thread_reply") return `${actorName} a posté dans « ${threadTitle} »`;
    return `${actorName} a interagi avec vous`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full text-ivoire-ancien/60 hover:text-or-ancestral hover:bg-white/5 transition-all"
        aria-label={`${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`}
      >
        <motion.span
          animate={
            unreadCount > 0
              ? { rotate: [0, -8, 8, -8, 0] }
              : {}
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          key={unreadCount}
          className="inline-block"
        >
          <Bell className="w-5 h-5" />
        </motion.span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 md:w-96 max-h-[70vh] rounded-2xl border border-or-ancestral/30 bg-foret-nocturne/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="font-display text-sm font-bold text-ivoire-ancien">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-or-ancestral hover:text-or-ancestral/70 inline-flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Tout lire
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Bell className="w-8 h-8 mx-auto text-ivoire-ancien/20 mb-2" />
                  <p className="text-xs text-ivoire-ancien/40 italic">
                    Aucune notification.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {notifications.map((n) => {
                    const Icon = n.type === "mention" ? AtSign : MessageCircle;
                    return (
                      <li key={n.id}>
                        <Link
                          href={getNotifLink(n)}
                          onClick={() => {
                            if (!n.read_at) markRead(n.id);
                            setOpen(false);
                          }}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                            n.read_at ? "" : "bg-or-ancestral/5"
                          } hover:bg-white/[0.04]`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-or-ancestral/20 shrink-0">
                            <MemberImage profile={n.actor || {}} priority={false} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Icon className="w-3 h-3 text-or-ancestral shrink-0" />
                              {!n.read_at && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                              )}
                            </div>
                            <p className="text-[13px] text-ivoire-ancien/85 leading-snug line-clamp-2">
                              {getNotifMessage(n)}
                            </p>
                            <p className="text-[10px] text-ivoire-ancien/40 mt-1">
                              {formatRelative(n.created_at)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-white/5 text-center">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-[11px] text-or-ancestral hover:text-or-ancestral/70"
              >
                Voir toutes les notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
