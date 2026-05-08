"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import { Plus, Users, ChevronDown, ChevronUp, Trash2, Sparkles, RotateCcw, Eye, EyeOff, X } from "lucide-react";

const Tree3D = dynamic(() => import("./Tree3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-xs uppercase tracking-widest text-or-ancestral/60 animate-pulse">
        Convocation des ancêtres…
      </div>
    </div>
  ),
});

interface FamilyMember {
  id: string;
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null; // legacy
  relation: string;
  birth_year?: number | null;
  origin_village?: string | null;
  clan?: string | null;
  parent_id?: string | null;
  children?: FamilyMember[];
}

const RELATIONS = [
  "Moi", "Père", "Mère", "Frère", "Sœur",
  "Grand-père paternel", "Grand-mère paternelle",
  "Grand-père maternel", "Grand-mère maternelle",
  "Oncle paternel", "Tante paternelle",
  "Oncle maternel", "Tante maternelle",
  "Cousin", "Cousine", "Fils", "Fille",
  "Neveu", "Nièce", "Conjoint(e)",
];

function fullName(m: { first_name?: string | null; last_name?: string | null; name?: string | null }): string {
  const fn = m.first_name?.trim();
  const ln = m.last_name?.trim();
  if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
  return m.name || "—";
}

function buildTree(members: FamilyMember[]): FamilyMember[] {
  const map = new Map<string, FamilyMember>();
  members.forEach((m) => { m.children = []; map.set(m.id, m); });
  const roots: FamilyMember[] = [];
  members.forEach((m) => {
    if (m.parent_id && map.has(m.parent_id)) map.get(m.parent_id)!.children!.push(m);
    else roots.push(m);
  });
  return roots;
}

function MemberNode({ member, onAddChild, onDelete, onFocus, focusedId, depth = 0 }: {
  member: FamilyMember;
  onAddChild: (id: string) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  focusedId: string | null;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!member.children?.length;
  const isFocused = focusedId === member.id;
  const isRoot = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${depth > 0 ? "ml-5 border-l border-or-ancestral/15 pl-4 py-1" : ""}`}
    >
      <button
        onClick={() => onFocus(member.id)}
        className={`w-full group flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all text-left ${
          isFocused
            ? "bg-or-ancestral/10 border border-or-ancestral/30"
            : "border border-transparent hover:border-or-ancestral/15 hover:bg-white/[0.02]"
        }`}
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all ${
          isRoot
            ? "bg-gradient-to-br from-or-ancestral/40 to-or-ancestral/10 border border-or-ancestral/40 text-ivoire-ancien"
            : "bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral"
        }`}>
          {isRoot ? "✦" : "•"}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${isFocused ? "text-or-ancestral" : "text-ivoire-ancien"}`}>
            {fullName(member)}
          </p>
          <p className="text-[10px] text-ivoire-ancien/45 font-mono truncate">
            {member.relation}
            {member.birth_year ? ` · ${member.birth_year}` : ""}
            {member.origin_village ? ` · ${member.origin_village}` : ""}
            {member.clan ? ` · ${member.clan}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onAddChild(member.id); }}
            className="p-1.5 rounded-md hover:bg-or-ancestral/10 hover:text-or-ancestral transition-colors"
            title="Ajouter un descendant"
          >
            <Plus className="w-3.5 h-3.5" />
          </span>
          {!isRoot && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); if (confirm(`Retirer ${fullName(member)} de l'arbre ?`)) onDelete(member.id); }}
              className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
              title="Retirer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          )}
          {hasChildren && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="p-1.5 rounded-md text-ivoire-ancien/40 hover:text-ivoire-ancien transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {member.children!.map((c) => (
              <MemberNode key={c.id} member={c} onAddChild={onAddChild} onDelete={onDelete} onFocus={onFocus} focusedId={focusedId} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const emptyForm = { first_name: "", last_name: "", relation: "Moi", birth_year: "", origin_village: "", clan: "" };

export default function ArbreGenealogique() {
  const { user } = useAuth() as any;
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from(DB_TABLES.FAMILY_TREE)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (error) console.error("[Genealogie] fetch", error);
    if (data) setMembers(data as FamilyMember[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = async () => {
    if (!user) return;
    if (!form.first_name.trim()) {
      setFormError("Le prénom est requis.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const { error } = await supabase.from(DB_TABLES.FAMILY_TREE).insert({
      user_id: user.id,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      // Keep legacy `name` synced for backward compatibility
      name: [form.first_name.trim(), form.last_name.trim()].filter(Boolean).join(" "),
      relation: form.relation,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      origin_village: form.origin_village.trim() || null,
      clan: form.clan.trim() || null,
      parent_id: parentId,
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message || "Erreur lors de l'ajout.");
      console.error("[Genealogie] insert", error);
      return;
    }
    await fetchMembers();
    setForm(emptyForm);
    setShowForm(false);
    setParentId(null);
  };

  const deleteMember = async (id: string) => {
    await supabase.from(DB_TABLES.FAMILY_TREE).delete().eq("id", id);
    if (focusedId === id) setFocusedId(null);
    await fetchMembers();
  };

  const tree = buildTree(members);
  const memberCount = members.length;
  const generations = members.length ? Math.max(...members.map((m) => {
    let depth = 0;
    let cur: FamilyMember | undefined = m;
    const map = new Map(members.map((x) => [x.id, x]));
    while (cur?.parent_id) { cur = map.get(cur.parent_id); depth++; if (depth > 50) break; }
    return depth;
  })) + 1 : 0;

  if (!user) {
    return (
      <main className="min-h-screen bg-foret-nocturne flex items-center justify-center">
        <p className="text-ivoire-ancien/60">Connectez-vous pour voir votre arbre.</p>
      </main>
    );
  }

  const inputBase = "w-full rounded-xl bg-white/5 border border-white/10 focus:border-or-ancestral/50 px-4 py-3 text-sm text-ivoire-ancien placeholder-ivoire-ancien/30 outline-none transition-all";

  return (
    <main className="relative min-h-screen bg-foret-nocturne overflow-hidden">
      {/* Decorative aura */}
      <div className="pointer-events-none fixed top-1/4 -left-40 w-[600px] h-[600px] bg-or-ancestral/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none fixed bottom-0 -right-40 w-[600px] h-[600px] bg-or-ancestral/5 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-or-ancestral/20 bg-or-ancestral/5">
              <Sparkles className="w-3 h-3 text-or-ancestral" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-or-ancestral">Généalogie sacrée</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-ivoire-ancien tracking-tight">
              Mon{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-or-ancestral to-ivoire-ancien">
                Arbre
              </span>
            </h1>
            <p className="text-ivoire-ancien/55 max-w-xl text-sm md:text-base leading-relaxed">
              Chaque branche raconte une histoire. Ajoutez vos parents, grands-parents et ancêtres,
              et regardez la rivière de votre lignée prendre forme dans la brume.
            </p>
          </div>

          {/* Stats */}
          {memberCount > 0 && (
            <div className="flex gap-3">
              {[
                { v: memberCount, l: "Âmes" },
                { v: generations, l: "Générations" },
                { v: tree.length, l: "Racines" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-or-ancestral/15 text-center min-w-[80px]"
                >
                  <p className="font-display text-2xl font-bold text-or-ancestral">{s.v}</p>
                  <p className="text-[9px] uppercase tracking-widest opacity-50 mt-0.5">{s.l}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* === 3D Canvas === */}
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7"
          >
            {showCanvas && (
              <div
                className="relative h-[420px] md:h-[560px] rounded-[2rem] overflow-hidden border border-or-ancestral/15"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(181,149,81,0.06) 0%, rgba(11,23,20,0.95) 70%)",
                }}
              >
                <Tree3D
                  members={members.map((m) => ({
                    id: m.id,
                    first_name: m.first_name,
                    last_name: m.last_name,
                    name: m.name,
                    relation: m.relation,
                    parent_id: m.parent_id,
                  }))}
                  focusedId={focusedId}
                  onNodeClick={(id) => setFocusedId(id)}
                  autoRotate={autoRotate}
                />

                {/* Top-right canvas controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    onClick={() => setAutoRotate((v) => !v)}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                      autoRotate
                        ? "bg-or-ancestral/15 border-or-ancestral/30 text-or-ancestral"
                        : "bg-white/5 border-white/10 text-ivoire-ancien/50 hover:text-ivoire-ancien"
                    }`}
                    title={autoRotate ? "Pause rotation" : "Reprendre rotation"}
                  >
                    <RotateCcw className={`w-4 h-4 ${autoRotate ? "animate-[spin_8s_linear_infinite]" : ""}`} />
                  </button>
                  <button
                    onClick={() => setShowCanvas(false)}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-ivoire-ancien/50 hover:text-ivoire-ancien backdrop-blur-md transition-all md:hidden"
                    title="Masquer la vue"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom-left hint */}
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                  <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-ivoire-ancien/35">
                    Clic-glisser pour orienter · molette pour zoomer
                  </p>
                </div>

                {/* Top-left focus card */}
                <AnimatePresence>
                  {focusedId && (() => {
                    const f = members.find((m) => m.id === focusedId);
                    if (!f) return null;
                    return (
                      <motion.div
                        key="focus-card"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute top-4 left-4 z-20 max-w-xs p-4 rounded-2xl border border-or-ancestral/20 backdrop-blur-xl"
                        style={{ background: "rgba(11,23,20,0.7)" }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-or-ancestral/60">{f.relation}</p>
                            <p className="font-display text-lg font-bold text-ivoire-ancien">{fullName(f)}</p>
                          </div>
                          <button
                            onClick={() => setFocusedId(null)}
                            className="p-1 rounded-md hover:bg-white/10 text-ivoire-ancien/50 hover:text-ivoire-ancien transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="space-y-1 text-xs text-ivoire-ancien/70">
                          {f.birth_year && <p>Né(e) ~{f.birth_year}</p>}
                          {f.origin_village && <p>Village : <span className="text-or-ancestral/80">{f.origin_village}</span></p>}
                          {f.clan && <p>Clan : <span className="text-or-ancestral/80">{f.clan}</span></p>}
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            )}

            {!showCanvas && (
              <button
                onClick={() => setShowCanvas(true)}
                className="w-full py-4 rounded-2xl border border-or-ancestral/20 bg-or-ancestral/5 text-or-ancestral text-sm font-bold flex items-center justify-center gap-2 hover:bg-or-ancestral/10 transition-all"
              >
                <Eye className="w-4 h-4" /> Afficher la vision 3D
              </button>
            )}
          </motion.section>

          {/* === Side panel: form + list === */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Add button / form */}
            <div
              className="rounded-[1.75rem] p-1"
              style={{
                background: "linear-gradient(135deg, rgba(181,149,81,0.15) 0%, rgba(242,238,221,0.02) 100%)",
                border: "1px solid rgba(181,149,81,0.15)",
              }}
            >
              <div className="bg-foret-nocturne/85 rounded-[1.65rem] p-6 backdrop-blur-md">
                {!showForm ? (
                  <button
                    onClick={() => { setParentId(null); setShowForm(true); setFormError(null); }}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-or-ancestral/25 rounded-xl text-or-ancestral hover:border-or-ancestral/50 hover:bg-or-ancestral/5 transition-all font-mono text-xs uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un membre de la famille
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-or-ancestral/70">Nouvelle âme</span>
                        <h3 className="font-display text-lg font-bold text-ivoire-ancien">
                          {parentId ? "Descendant de…" : "Membre de la famille"}
                        </h3>
                      </div>
                      <button
                        onClick={() => { setShowForm(false); setParentId(null); setFormError(null); }}
                        className="p-1.5 rounded-md text-ivoire-ancien/40 hover:text-ivoire-ancien hover:bg-white/5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Prénom <span className="text-or-ancestral/70 normal-case tracking-normal">*</span></label>
                        <input
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          placeholder="Fortuné"
                          className={inputBase}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Nom</label>
                        <input
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          placeholder="Tshali"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Relation</label>
                      <select
                        value={form.relation}
                        onChange={(e) => setForm({ ...form, relation: e.target.value })}
                        className={inputBase}
                      >
                        {RELATIONS.map((r) => <option key={r} value={r} className="bg-foret-nocturne">{r}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Année naiss.</label>
                        <input
                          type="number"
                          value={form.birth_year}
                          onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                          placeholder="1982"
                          className={inputBase}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Village</label>
                        <input
                          value={form.origin_village}
                          onChange={(e) => setForm({ ...form, origin_village: e.target.value })}
                          placeholder="Inongo"
                          className={inputBase}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Clan</label>
                        <input
                          value={form.clan}
                          onChange={(e) => setForm({ ...form, clan: e.target.value })}
                          placeholder="Banju"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    {formError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                      >
                        {formError}
                      </motion.p>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={addMember}
                        disabled={submitting || !form.first_name.trim()}
                        className="flex-1 py-3 rounded-xl bg-or-ancestral text-foret-nocturne font-bold transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ boxShadow: "0 8px 24px rgba(181, 149, 81, 0.2)" }}
                      >
                        {submitting ? "Inscription…" : "Inscrire dans l'arbre"}
                      </button>
                      <button
                        onClick={() => { setShowForm(false); setParentId(null); setFormError(null); }}
                        className="px-5 py-3 rounded-xl border border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien hover:bg-white/5 text-sm transition-all"
                      >
                        Annuler
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* List */}
            <div
              className="rounded-[1.75rem] p-1"
              style={{
                background: "linear-gradient(135deg, rgba(242,238,221,0.06) 0%, transparent 100%)",
                border: "1px solid rgba(242,238,221,0.05)",
              }}
            >
              <div className="bg-foret-nocturne/70 rounded-[1.65rem] p-5 backdrop-blur-md min-h-[180px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Lignée</span>
                  {memberCount > 0 && (
                    <span className="text-[10px] font-mono opacity-40">{memberCount} âme{memberCount > 1 ? "s" : ""}</span>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-8 text-ivoire-ancien/40 text-xs animate-pulse">
                    Convocation des ancêtres…
                  </div>
                ) : tree.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-10 h-10 text-or-ancestral/20 mx-auto mb-3" />
                    <p className="text-ivoire-ancien/50 text-sm">Votre arbre est encore vierge.</p>
                    <p className="text-ivoire-ancien/30 text-xs mt-1">Commencez par vous-même.</p>
                  </div>
                ) : (
                  <div className="space-y-0.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-hide">
                    {tree.map((m) => (
                      <MemberNode
                        key={m.id}
                        member={m}
                        onAddChild={(id) => { setParentId(id); setShowForm(true); }}
                        onDelete={deleteMember}
                        onFocus={(id) => setFocusedId(id === focusedId ? null : id)}
                        focusedId={focusedId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Proverbe */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-xs text-ivoire-ancien/25 italic mt-16 max-w-xl mx-auto leading-relaxed"
        >
          « Mowei te akoyebe na nzela ya bankoko na ye »
          <br />
          <span className="text-[10px] not-italic font-mono uppercase tracking-widest text-ivoire-ancien/30 mt-1 block">
            L'enfant ne se connaît qu'à travers ses ancêtres.
          </span>
        </motion.p>
      </div>
    </main>
  );
}
