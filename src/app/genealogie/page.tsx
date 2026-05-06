"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Plus, User, Heart, Users, ChevronDown, ChevronUp, Link2, Trash2 } from "lucide-react";

interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relation: string;
  birth_year?: number;
  origin_village?: string;
  clan?: string;
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

function buildTree(members: FamilyMember[]): FamilyMember[] {
  const map = new Map<string, FamilyMember>();
  members.forEach(m => { m.children = []; map.set(m.id, m); });
  const roots: FamilyMember[] = [];
  members.forEach(m => {
    if (m.parent_id && map.has(m.parent_id)) {
      map.get(m.parent_id)!.children!.push(m);
    } else {
      roots.push(m);
    }
  });
  return roots;
}

function MemberNode({ member, onAddChild, onDelete, depth = 0 }: {
  member: FamilyMember; onAddChild: (id: string) => void;
  onDelete: (id: string) => void; depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = member.children && member.children.length > 0;

  return (
    <div className="ml-6 border-l-2 border-[rgba(196,160,53,0.15)] pl-4 py-1">
      <div className="flex items-center gap-3 py-2 group">
        <div className="w-9 h-9 rounded-full bg-[rgba(196,160,53,0.12)] border border-[rgba(196,160,53,0.2)] flex items-center justify-center text-sm shrink-0">
          {depth === 0 ? '⭐' : '👤'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ivoire-ancien)] truncate">
            {member.name}
          </p>
          <p className="text-xs text-[rgba(212,221,215,0.5)]">
            {member.relation}
            {member.birth_year && ` · né(e) ~${member.birth_year}`}
            {member.origin_village && ` · ${member.origin_village}`}
            {member.clan && ` · clan ${member.clan}`}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAddChild(member.id)} className="p-1 hover:text-[var(--or-ancestral)] transition-colors" title="Ajouter un lien">
            <Plus className="w-3.5 h-3.5" />
          </button>
          {depth > 0 && (
            <button onClick={() => onDelete(member.id)} className="p-1 hover:text-red-400 transition-colors" title="Retirer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-[rgba(212,221,215,0.4)]">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      {expanded && hasChildren && member.children!.map(child => (
        <MemberNode key={child.id} member={child} onAddChild={onAddChild} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ArbreGenealogique() {
  const { user } = useAuth() as any;
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", relation: "Moi", birth_year: "", origin_village: "", clan: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("family_tree")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (data) setMembers(data as FamilyMember[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = async () => {
    if (!user || !form.name) {
      setFormError("Le nom est requis.");
      return;
    }
    setFormError(null);
    const { data, error } = await supabase.from("family_tree").insert({
      user_id: user.id,
      name: form.name,
      relation: form.relation,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      origin_village: form.origin_village || null,
      clan: form.clan || null,
      parent_id: parentId,
    }).select().single();

    if (error) {
      setFormError(error.message || "Erreur lors de l'ajout.");
      console.error("[Genealogie] Erreur insert:", error);
      return;
    }
    if (data) {
      await fetchMembers();
      setForm({ name: "", relation: "Moi", birth_year: "", origin_village: "", clan: "" });
      setShowForm(false);
      setParentId(null);
      setFormError(null);
    }
  };

  const deleteMember = async (id: string) => {
    await supabase.from("family_tree").delete().eq("id", id);
    await fetchMembers();
  };

  const tree = buildTree(members);

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--foret-nocturne)] flex items-center justify-center">
        <p className="text-[rgba(212,221,215,0.6)]">Connectez-vous pour voir votre arbre.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--foret-nocturne)] py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-xs text-[var(--or-ancestral)] uppercase tracking-widest">Généalogie</span>
          <h1 className="text-3xl font-display font-bold text-[var(--ivoire-ancien)] mt-2">Mon Arbre</h1>
          <p className="text-[rgba(212,221,215,0.6)] mt-2 text-sm">
            Chaque branche raconte une histoire. Ajoutez vos parents, grands-parents, et ancêtres.
          </p>
        </motion.div>

        {/* Bouton ajouter racine */}
        <button
          onClick={() => { setParentId(null); setShowForm(!showForm); setFormError(null); }}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[rgba(196,160,53,0.2)] rounded-xl text-[rgba(196,160,53,0.6)] hover:border-[rgba(196,160,53,0.4)] hover:text-[var(--or-ancestral)] transition-all mb-8"
        >
          <Plus className="w-5 h-5" /> Ajouter un membre de la famille
        </button>

        {/* Formulaire */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl border border-[rgba(196,160,53,0.15)] bg-[rgba(10,31,21,0.6)] space-y-4">
            <input type="text" placeholder="Nom complet" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
            <select value={form.relation}
              onChange={e => setForm({...form, relation: e.target.value})}
              className="w-full rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-4 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none">
              {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Année naiss." value={form.birth_year}
                onChange={e => setForm({...form, birth_year: e.target.value})}
                className="rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
              <input type="text" placeholder="Village d'origine" value={form.origin_village}
                onChange={e => setForm({...form, origin_village: e.target.value})}
                className="rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
              <input type="text" placeholder="Clan" value={form.clan}
                onChange={e => setForm({...form, clan: e.target.value})}
                className="rounded-lg border border-[rgba(212,221,215,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2.5 text-white text-sm focus:border-[var(--or-ancestral)] outline-none" />
            </div>
            {formError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{formError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={addMember}
                className="flex-1 py-2.5 rounded-lg bg-[var(--or-ancestral)]/20 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] text-sm font-semibold hover:bg-[var(--or-ancestral)]/30 transition-all">
                Ajouter
              </button>
              <button onClick={() => { setShowForm(false); setParentId(null); }}
                className="px-4 py-2.5 rounded-lg border border-[rgba(212,221,215,0.1)] text-[rgba(212,221,215,0.6)] text-sm">
                Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* Arbre */}
        {loading ? (
          <div className="text-center py-12 text-[rgba(212,221,215,0.4)]">Chargement de l&apos;arbre...</div>
        ) : tree.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[rgba(196,160,53,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(212,221,215,0.5)] text-sm">
              Votre arbre est vide. Ajoutez votre premier membre.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[rgba(212,221,215,0.06)] bg-[rgba(10,31,21,0.4)] p-6">
            {tree.map(member => (
              <MemberNode key={member.id} member={member}
                onAddChild={(id) => { setParentId(id); setShowForm(true); }}
                onDelete={deleteMember} />
            ))}
          </div>
        )}

        {/* Proverbe */}
        <p className="text-center text-xs text-[rgba(212,221,215,0.2)] italic mt-12">
          « Mowei te akoyebe na nzela ya bankoko na ye » — L&apos;enfant ne se connaît qu&apos;à travers ses ancêtres.
        </p>
      </div>
    </main>
  );
}
