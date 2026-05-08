"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Flag, Trash2, Ban, CheckCircle2, UserX, Clock, Bell, Search, Archive, RefreshCw, RotateCcw } from "lucide-react";
import ModerationActionModal, { type ActionKind } from "./ModerationActionModal";
import { useAuth } from "@/components/AuthProvider";

type Tab = "reports" | "banned" | "deleted" | "search";

type Report = {
  id: string;
  category: string;
  description: string | null;
  status: string;
  created_at: string;
  reporter: { id: string; username: string | null; nickname: string | null } | null;
  post: {
    id: string;
    content: string;
    author_id: string;
    thread_id: string;
    deleted_at: string | null;
    author: { id: string; username: string | null; nickname: string | null; banned_until: string | null } | null;
  } | null;
};

type ModUser = {
  id: string;
  username: string | null;
  nickname: string | null;
  avatar_url: string | null;
  role: string;
  banned_until: string | null;
  ban_reason: string | null;
  deleted_at: string | null;
  deletion_reason: string | null;
  permanent_delete_at: string | null;
};

const formatRelative = (iso: string) => {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  if (diff < 60000) return "à l'instant";
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)} h`;
  return new Date(iso).toLocaleDateString("fr-FR");
};

const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";

export default function ForumModerationPage() {
  const { role } = useAuth();
  const fullAdmin = role === "admin";

  const [activeTab, setActiveTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedUsers, setBannedUsers] = useState<ModUser[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<ModUser[]>([]);
  const [searchUsers, setSearchUsers] = useState<ModUser[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKind, setModalKind] = useState<ActionKind | null>(null);
  const [modalContext, setModalContext] = useState<any>({});

  const openAction = (kind: ActionKind, context: any) => {
    setModalKind(kind);
    setModalContext(context);
    setModalOpen(true);
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/moderation/reports?status=pending");
      const j = await res.json();
      if (res.ok) setReports(j.reports);
    } finally { setLoading(false); }
  }, []);

  const fetchBanned = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/moderation/users?filter=banned");
      const j = await res.json();
      if (res.ok) setBannedUsers(j.users);
    } finally { setLoading(false); }
  }, []);

  const fetchDeleted = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/moderation/users?filter=deleted");
      const j = await res.json();
      if (res.ok) setDeletedUsers(j.users);
    } finally { setLoading(false); }
  }, []);

  const fetchSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchUsers([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/moderation/users?filter=search&q=${encodeURIComponent(q)}`);
      const j = await res.json();
      if (res.ok) setSearchUsers(j.users);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "reports") fetchReports();
    if (activeTab === "banned") fetchBanned();
    if (activeTab === "deleted") fetchDeleted();
  }, [activeTab, fetchReports, fetchBanned, fetchDeleted]);

  const refresh = () => {
    if (activeTab === "reports") fetchReports();
    if (activeTab === "banned") fetchBanned();
    if (activeTab === "deleted") fetchDeleted();
    if (activeTab === "search") fetchSearch(searchQ);
  };

  const tabs: { key: Tab; label: string; count?: number; icon: React.ReactNode }[] = [
    { key: "reports", label: "Signalements", count: reports.length, icon: <Flag className="w-3.5 h-3.5" /> },
    { key: "banned", label: "Bannis", count: bannedUsers.length, icon: <Ban className="w-3.5 h-3.5" /> },
    { key: "deleted", label: "Corbeille", count: deletedUsers.length, icon: <Archive className="w-3.5 h-3.5" /> },
    { key: "search", label: "Rechercher", icon: <Search className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Mboka</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Modération du Forum</h1>
          <p className="text-sm opacity-50">Veiller à la paix de la place du village.</p>
        </div>
        <button onClick={refresh} className="self-start md:self-end p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all" title="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === t.key
                ? "bg-or-ancestral/15 text-or-ancestral border border-or-ancestral/30"
                : "opacity-50 hover:opacity-100 border border-transparent"
            }`}
          >
            {t.icon}
            {t.label}
            {typeof t.count === "number" && <span className="opacity-60 font-mono">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* === SIGNALEMENTS === */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {reports.length === 0 && !loading && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
              <Flag className="w-8 h-8 mx-auto opacity-20 mb-3" />
              <p className="opacity-40 italic">Aucun signalement en attente. Le village est paisible.</p>
            </div>
          )}
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-[1.75rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col lg:flex-row gap-6"
            >
              <div className="w-10 h-10 rounded-xl bg-or-ancestral/10 flex items-center justify-center flex-shrink-0 text-or-ancestral">
                <Flag className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-or-ancestral/15 text-or-ancestral px-2.5 py-1 rounded-full">
                    {report.category}
                  </span>
                  <span className="text-xs opacity-40 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {formatRelative(report.created_at)}
                  </span>
                  {report.reporter && (
                    <span className="text-xs opacity-50">
                      Signalé par <strong>{report.reporter.nickname || report.reporter.username}</strong>
                    </span>
                  )}
                </div>

                {report.description && (
                  <p className="text-xs opacity-60 italic">Motif : {report.description}</p>
                )}

                {report.post ? (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="opacity-50">Auteur :</span>
                      <span className="font-bold text-ivoire-ancien">
                        {report.post.author?.nickname || report.post.author?.username || "Inconnu"}
                      </span>
                      {report.post.deleted_at && (
                        <span className="text-[10px] uppercase tracking-widest text-red-400/70 ml-auto">déjà supprimé</span>
                      )}
                    </div>
                    <p className="text-sm text-ivoire-ancien/80 whitespace-pre-wrap break-words">
                      {report.post.content.slice(0, 300)}
                      {report.post.content.length > 300 && "..."}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs opacity-40 italic">Post supprimé ou introuvable.</p>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:w-44 flex-shrink-0">
                {report.post && !report.post.deleted_at && (
                  <button
                    onClick={() => openAction("delete_post", {
                      postId: report.post!.id,
                      reportId: report.id,
                      userId: report.post!.author_id,
                      username: report.post!.author?.username,
                      nickname: report.post!.author?.nickname,
                      excerpt: report.post!.content,
                    })}
                    className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                )}
                {report.post?.author && (
                  <>
                    <button
                      onClick={() => openAction("warn_user", {
                        userId: report.post!.author!.id,
                        postId: report.post!.id,
                        username: report.post!.author!.username,
                        nickname: report.post!.author!.nickname,
                        excerpt: report.post!.content,
                      })}
                      className="px-3 py-2.5 rounded-xl bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral text-xs font-bold hover:bg-or-ancestral/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5" /> Avertir
                    </button>
                    <button
                      onClick={() => openAction("ban_user", {
                        userId: report.post!.author!.id,
                        username: report.post!.author!.username,
                        nickname: report.post!.author!.nickname,
                      })}
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivoire-ancien text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Ban className="w-3.5 h-3.5" /> Bannir
                    </button>
                  </>
                )}
                <button
                  onClick={() => openAction("dismiss_report", { reportId: report.id })}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-ivoire-ancien/60 text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Rejeter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* === BANNIS === */}
      {activeTab === "banned" && (
        <UserList
          users={bannedUsers}
          loading={loading}
          emptyText="Aucun utilisateur banni actuellement."
          renderActions={(u) => (
            <>
              <button
                onClick={() => openAction("unban_user", { userId: u.id, username: u.username, nickname: u.nickname })}
                className="px-3 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral text-xs font-bold hover:bg-or-ancestral/20 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Débannir
              </button>
            </>
          )}
          renderMeta={(u) => (
            <>
              <span className="text-[10px] uppercase tracking-widest text-red-400">
                Banni jusqu'au {formatDate(u.banned_until)}
              </span>
              {u.ban_reason && <p className="text-xs opacity-60 italic">"{u.ban_reason}"</p>}
            </>
          )}
        />
      )}

      {/* === CORBEILLE === */}
      {activeTab === "deleted" && (
        <UserList
          users={deletedUsers}
          loading={loading}
          emptyText="La corbeille est vide."
          renderActions={(u) => (
            fullAdmin ? (
              <button
                onClick={() => openAction("restore_user", { userId: u.id, username: u.username, nickname: u.nickname })}
                className="px-3 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral text-xs font-bold hover:bg-or-ancestral/20 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurer
              </button>
            ) : null
          )}
          renderMeta={(u) => (
            <>
              <span className="text-[10px] uppercase tracking-widest opacity-50">
                Supprimé le {formatDate(u.deleted_at)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-red-400/70">
                Purge auto le {formatDate(u.permanent_delete_at)}
              </span>
              {u.deletion_reason && <p className="text-xs opacity-60 italic">"{u.deletion_reason}"</p>}
            </>
          )}
        />
      )}

      {/* === RECHERCHE === */}
      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchSearch(searchQ)}
              placeholder="Username ou surnom..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-or-ancestral/50 rounded-xl px-4 py-3 outline-none text-sm text-ivoire-ancien"
            />
            <button
              onClick={() => fetchSearch(searchQ)}
              className="px-5 rounded-xl bg-or-ancestral text-foret-nocturne text-sm font-bold hover:bg-or-ancestral/90 transition-all"
            >
              Rechercher
            </button>
          </div>
          <UserList
            users={searchUsers}
            loading={loading}
            emptyText={searchQ ? "Aucun utilisateur trouvé." : "Saisissez une requête."}
            renderActions={(u) => (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => openAction("warn_user", { userId: u.id, username: u.username, nickname: u.nickname })} className="px-2.5 py-1.5 rounded-lg bg-or-ancestral/10 text-or-ancestral text-[10px] font-bold uppercase tracking-widest border border-or-ancestral/20 hover:bg-or-ancestral/20"><Bell className="w-3 h-3 inline mr-1" />Avertir</button>
                {!u.banned_until || new Date(u.banned_until) < new Date() ? (
                  <button onClick={() => openAction("ban_user", { userId: u.id, username: u.username, nickname: u.nickname })} className="px-2.5 py-1.5 rounded-lg bg-white/5 text-ivoire-ancien text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10"><Ban className="w-3 h-3 inline mr-1" />Bannir</button>
                ) : (
                  <button onClick={() => openAction("unban_user", { userId: u.id, username: u.username, nickname: u.nickname })} className="px-2.5 py-1.5 rounded-lg bg-or-ancestral/10 text-or-ancestral text-[10px] font-bold uppercase tracking-widest border border-or-ancestral/20"><RotateCcw className="w-3 h-3 inline mr-1" />Débannir</button>
                )}
                {!u.deleted_at && (
                  <button onClick={() => openAction("soft_delete_user", { userId: u.id, username: u.username, nickname: u.nickname })} className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20"><UserX className="w-3 h-3 inline mr-1" />Corbeille</button>
                )}
              </div>
            )}
            renderMeta={(u) => (
              <span className="text-[10px] uppercase tracking-widest opacity-50">
                {u.role}{u.banned_until && new Date(u.banned_until) > new Date() ? " · banni" : ""}{u.deleted_at ? " · corbeille" : ""}
              </span>
            )}
          />
        </div>
      )}

      {/* Charte */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-7 rounded-[1.75rem] bg-or-ancestral/95 text-foret-nocturne">
        <div className="flex items-center gap-3 mb-3">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-display text-lg font-bold">Rappel de la Charte</h3>
        </div>
        <p className="text-sm leading-relaxed opacity-80">
          La place du village est sacrée. Toute action de modération est consignée dans les journaux et reste consultable par les anciens.
        </p>
      </motion.div>

      <ModerationActionModal
        open={modalOpen}
        kind={modalKind}
        context={modalContext}
        onClose={() => setModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}

function UserList({ users, loading, emptyText, renderActions, renderMeta }: {
  users: ModUser[];
  loading: boolean;
  emptyText: string;
  renderActions: (u: ModUser) => React.ReactNode;
  renderMeta: (u: ModUser) => React.ReactNode;
}) {
  if (!loading && users.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
        <p className="opacity-40 italic">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u.id} className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-or-ancestral/10 border border-or-ancestral/20 flex items-center justify-center text-or-ancestral font-bold uppercase">
              {(u.nickname || u.username || "?")[0]}
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-bold text-ivoire-ancien truncate">{u.nickname || u.username || "—"}</p>
              {u.username && <p className="text-xs opacity-50 truncate">@{u.username}</p>}
              <div className="flex flex-col gap-0.5">{renderMeta(u)}</div>
            </div>
          </div>
          <div className="flex-shrink-0">{renderActions(u)}</div>
        </div>
      ))}
    </div>
  );
}
