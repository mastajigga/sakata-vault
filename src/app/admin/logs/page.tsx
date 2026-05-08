"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Filter, RefreshCw, Trash2, Bell, Ban, RotateCcw, UserX, Archive, Flag, CheckCircle2, XCircle, Gavel } from "lucide-react";

type Log = {
  id: string;
  action_type: string;
  reason: string | null;
  duration_hours: number | null;
  expires_at: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
  moderator_role: string | null;
  moderator: { id: string; username: string | null; nickname: string | null; role: string } | null;
  target_user: { id: string; username: string | null; nickname: string | null } | null;
  target_post_id: string | null;
  target_thread_id: string | null;
  target_report_id: string | null;
};

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; tone: string }> = {
  delete_post: { label: "Post supprimé", icon: <Trash2 className="w-3.5 h-3.5" />, tone: "text-red-400 bg-red-500/10 border-red-500/20" },
  delete_thread: { label: "Sujet supprimé", icon: <Trash2 className="w-3.5 h-3.5" />, tone: "text-red-400 bg-red-500/10 border-red-500/20" },
  warn_user: { label: "Avertissement", icon: <Bell className="w-3.5 h-3.5" />, tone: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20" },
  ban_user: { label: "Bannissement", icon: <Ban className="w-3.5 h-3.5" />, tone: "text-red-400 bg-red-500/10 border-red-500/20" },
  unban_user: { label: "Débannissement", icon: <RotateCcw className="w-3.5 h-3.5" />, tone: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20" },
  soft_delete_user: { label: "Compte → corbeille", icon: <UserX className="w-3.5 h-3.5" />, tone: "text-red-400 bg-red-500/10 border-red-500/20" },
  restore_user: { label: "Compte restauré", icon: <Archive className="w-3.5 h-3.5" />, tone: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20" },
  permanent_delete_user: { label: "Suppression définitive", icon: <UserX className="w-3.5 h-3.5" />, tone: "text-red-500 bg-red-500/15 border-red-500/30" },
  resolve_report: { label: "Signalement résolu", icon: <CheckCircle2 className="w-3.5 h-3.5" />, tone: "text-or-ancestral/80 bg-white/5 border-white/10" },
  dismiss_report: { label: "Signalement rejeté", icon: <XCircle className="w-3.5 h-3.5" />, tone: "text-ivoire-ancien/60 bg-white/5 border-white/10" },
  role_change: { label: "Rôle modifié", icon: <Gavel className="w-3.5 h-3.5" />, tone: "text-or-ancestral bg-or-ancestral/10 border-or-ancestral/20" },
};

const formatDate = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

const ACTION_FILTERS = [
  { value: "", label: "Toutes" },
  { value: "delete_post", label: "Suppressions post" },
  { value: "delete_thread", label: "Suppressions sujet" },
  { value: "warn_user", label: "Avertissements" },
  { value: "ban_user", label: "Bannissements" },
  { value: "unban_user", label: "Débannissements" },
  { value: "soft_delete_user", label: "Corbeille (utilisateurs)" },
  { value: "restore_user", label: "Restaurations" },
  { value: "resolve_report", label: "Signalements résolus" },
  { value: "dismiss_report", label: "Signalements rejetés" },
  { value: "role_change", label: "Changements de rôle" },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const fetchLogs = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const o = reset ? 0 : offset;
      const params = new URLSearchParams({ limit: String(limit), offset: String(o) });
      if (actionFilter) params.set("action", actionFilter);
      const res = await fetch(`/api/admin/moderation/logs?${params}`);
      const j = await res.json();
      if (res.ok) {
        setLogs(reset ? j.logs : [...logs, ...j.logs]);
        setTotal(j.total);
        if (reset) setOffset(0);
      }
    } finally { setLoading(false); }
  }, [offset, actionFilter, logs]);

  useEffect(() => {
    fetchLogs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter]);

  const loadMore = () => {
    setOffset((o) => o + limit);
  };
  useEffect(() => {
    if (offset > 0) fetchLogs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Mémoire des Anciens</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Journaux de modération</h1>
          <p className="text-sm opacity-50">Toute action de modération laisse une trace consultable.</p>
        </div>
        <button onClick={() => fetchLogs(true)} className="self-start md:self-end p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all" title="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 opacity-40" />
        {ACTION_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActionFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-widest transition-all ${
              actionFilter === f.value
                ? "bg-or-ancestral/15 text-or-ancestral border border-or-ancestral/30"
                : "bg-white/5 text-ivoire-ancien/50 border border-white/5 hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs opacity-40 font-mono">{total} entrée{total > 1 ? "s" : ""}</p>

      {logs.length === 0 && !loading ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
          <ScrollText className="w-8 h-8 mx-auto opacity-20 mb-3" />
          <p className="opacity-40 italic">Aucune action consignée pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => {
            const meta = ACTION_META[log.action_type] || { label: log.action_type, icon: <Flag className="w-3.5 h-3.5" />, tone: "text-ivoire-ancien/60 bg-white/5 border-white/10" };
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row gap-4 md:items-center"
              >
                <div className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 self-start ${meta.tone}`}>
                  {meta.icon}
                  {meta.label}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                    <span className="font-bold text-ivoire-ancien">
                      {log.moderator?.nickname || log.moderator?.username || "—"}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-mono">
                      {log.moderator_role || log.moderator?.role}
                    </span>
                    {log.target_user && (
                      <>
                        <span className="opacity-40">→</span>
                        <span className="text-or-ancestral/90">
                          {log.target_user.nickname || log.target_user.username || "—"}
                        </span>
                      </>
                    )}
                    {log.duration_hours && (
                      <span className="text-[10px] uppercase tracking-widest text-red-400/80 font-mono">
                        {log.duration_hours}h
                      </span>
                    )}
                  </div>
                  {log.reason && (
                    <p className="text-xs opacity-60 italic break-words">"{log.reason}"</p>
                  )}
                </div>

                <span className="text-[11px] opacity-40 font-mono whitespace-nowrap">
                  {formatDate(log.created_at)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {logs.length < total && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-4 rounded-2xl border border-white/10 text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 hover:border-or-ancestral/40 transition-all"
        >
          {loading ? "Chargement..." : "Charger plus"}
        </button>
      )}
    </div>
  );
}
