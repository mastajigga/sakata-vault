"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import { 
  Users, Shield, ShieldCheck, ShieldAlert, UserPlus, Search, 
  MoreHorizontal, Eye, X, Mail, MapPin, Calendar, Activity,
  Award, MessageSquare, Heart 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserDetailsModal = ({ user, onClose }: { user: any, onClose: () => void }) => {
  if (!user) return null;

  const activities = user.metadata?.activities || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl bg-foret-nocturne border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative h-32 bg-gradient-to-r from-or-ancestral/20 to-foret-nocturne border-b border-white/5 flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/60 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 overflow-y-auto scrollbar-hide">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-black border-4 border-foret-nocturne flex items-center justify-center text-4xl font-display font-bold text-or-ancestral overflow-hidden shadow-xl">
                 {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : (user.nickname ? user.nickname[0] : "?")}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.subscription_tier === 'premium' ? 'bg-or-ancestral text-foret-nocturne' : 'bg-white/5 text-white/40'}`}>
                {user.subscription_tier || 'free'}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                {user.role || 'user'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-ivoire-ancien">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-or-ancestral/60">@{user.nickname || user.username || 'n/a'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Mail className="w-4 h-4 opacity-40" />
                    <span>{user.email || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <MapPin className="w-4 h-4 opacity-40" />
                    <span>{user.location || 'Localisation inconnue'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Calendar className="w-4 h-4 opacity-40" />
                    <span>Inscrit le {user.created_at ? new Date(user.created_at).toLocaleDateString() : '???'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-white/30 truncate">
                    <Shield className="w-4 h-4 opacity-40" />
                    <span>ID: {user.id}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-white/40">
                  "{user.bio || user.short_bio || "Pas de biographie pour ce marcheur."}"
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-or-ancestral/50">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <Award className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Points</p>
                    <p className="text-lg font-display font-bold">1,240</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <MessageSquare className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Forum</p>
                    <p className="text-lg font-display font-bold">42</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest font-bold text-white/20 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activités récentes
                </h3>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {activities.length > 0 ? (
                  activities.map((activity: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-or-ancestral">
                          {activity.type}
                        </span>
                        <span className="text-[9px] opacity-30 font-mono">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {activity.details || "Pas de détails spécifiés."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-xs opacity-30 italic">Aucune activité enregistrée.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const UserManagementPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(DB_TABLES.PROFILES)
      .select("*")
      .order("updated_at", { ascending: false, nullsFirst: false });
    
    if (!error && data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from(DB_TABLES.PROFILES)
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
    } else {
      alert("Erreur lors du changement de rôle: " + error.message);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "manager": return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "contributor": return <Shield className="w-4 h-4 text-or-ancestral" />;
      default: return <Users className="w-4 h-4 opacity-40" />;
    }
  };

  const openUserDetails = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const filteredProfiles = profiles.filter(p => 
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.nickname && p.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.first_name && p.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.last_name && p.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleResetPassword = async (email: string) => {
    if (!email) return;
    if (confirm(`Etes-vous sûr de vouloir envoyer un e-mail de réinitialisation de mot de passe à ${email} ?`)) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        alert("Erreur de réinitialisation: " + error.message);
      } else {
        alert("E-mail de réinitialisation envoyé avec succès !");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Etes-vous certain de vouloir restreindre cet utilisateur de la plateforme (suppression logique) ?")) {
       const { error } = await supabase.from(DB_TABLES.PROFILES).update({ role: "deleted", first_name: "[Supprimé]" }).eq("id", userId);
       if (!error) {
          setProfiles(profiles.filter(p => p.id !== userId));
          alert("Utilisateur retiré avec succès de la liste active.");
       } else {
          alert("Erreur lors de la suppression: " + error.message);
       }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Sanctuaire</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Gardiens & Fidèles</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher un membre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
          Appel de la communauté...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest opacity-40 font-bold">Membre</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest opacity-40 font-bold">Rôle Actuel</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest opacity-40 font-bold">Dernière Connexion</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest opacity-40 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={profile.id} 
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase">
                        {profile.email ? profile.email[0] : (profile.nickname ? profile.nickname[0] : "?")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ivoire-ancien">
                          {profile.nickname ? profile.nickname : (profile.first_name ? `${profile.first_name} ${profile.last_name || ""}` : "Anonyme")}
                        </p>
                        <p className="text-xs opacity-40 font-mono">{profile.email || "Email non synchronisé"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(profile.role)}
                      <span className="text-xs font-bold capitalize">{profile.role || "user"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs opacity-40 font-mono">
                      {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Jamais"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openUserDetails(profile)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 text-ivory-ancien/60"
                        title="Voir le profil complet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <select 
                        value={profile.role || "user"}
                        onChange={(e) => updateRole(profile.id, e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase outline-none focus:border-or-ancestral/50 transition-all"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="contributor">Contributeur</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Administrateur</option>
                      </select>
                      
                      {profile.email && (
                        <button 
                          onClick={() => handleResetPassword(profile.email)}
                          className="p-2 bg-white/5 hover:bg-or-ancestral/20 hover:text-or-ancestral rounded-lg transition-colors border border-white/5"
                          title="Réinitialiser le mot de passe"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteUser(profile.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-white/5"
                        title="Supprimer l'utilisateur"
                      >
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredProfiles.length === 0 && (
            <div className="py-24 text-center">
              <p className="opacity-40 italic">La place du village est déserte.</p>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && (
          <UserDetailsModal 
            user={selectedUser} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementPage;
