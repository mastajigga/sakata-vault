"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Shield, ShieldCheck, ShieldAlert, UserPlus, Search, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const UserManagementPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
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
      .from("profiles")
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

  const filteredProfiles = profiles.filter(p => 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                        {profile.email ? profile.email[0].toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ivoire-ancien">{profile.full_name || "Anonyme"}</p>
                        <p className="text-xs opacity-40 font-mono">{profile.email}</p>
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
    </div>
  );
};

export default UserManagementPage;
