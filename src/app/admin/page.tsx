"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, FileText, Eye, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/components/AuthProvider";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalVisits: 842, // Simulated for now or fetched from analytics
    totalUsers: 0,
    activeContributors: 3
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      
      setStats(prev => ({
        ...prev,
        totalArticles: articleCount || 0,
        totalUsers: userCount || 0
      }));
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Vue d'ensemble</span>
        <h1 className="font-display text-4xl font-bold">Tableau de Bord</h1>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Total Articles */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-or-ancestral/10 rounded-xl">
              <FileText className="w-6 h-6 text-or-ancestral" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">+12%</span>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-bold font-mono">{stats.totalArticles}</span>
            <p className="text-xs opacity-40 uppercase tracking-widest mt-2 font-bold">Articles Sacata</p>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">+4</span>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-bold font-mono">{stats.totalUsers}</span>
            <p className="text-xs opacity-40 uppercase tracking-widest mt-2 font-bold">Contributeurs</p>
          </div>
        </motion.div>

        {/* Site Visits */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-8 rounded-[2rem] bg-or-ancestral text-foret-nocturne flex flex-col justify-between md:col-span-1 lg:col-span-2"
          style={{ boxShadow: "0 20px 40px rgba(181, 149, 81, 0.15)" }}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-black/10 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-black/40" />
          </div>
          <div className="mt-8">
            <span className="text-5xl font-bold font-mono tracking-tighter">{stats.totalVisits}</span>
            <p className="text-xs text-black/60 uppercase tracking-widest mt-2 font-bold">Visites ce mois</p>
          </div>
        </motion.div>

        {/* Recent Activity Mini-List */}
        <div className="md:col-span-3 lg:col-span-4 p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Activités Récentes</h3>
              <Clock className="w-4 h-4 opacity-20" />
           </div>
           <div className="space-y-4">
              {[
                { user: "Mas. Fortuné", action: "a traduit l'article 'Rite Ngongo'", time: "Il y a 2h" },
                { user: "Sys. Bot", action: "a sauvegardé une nouvelle visite", time: "Il y a 5 min" },
                { user: "Admin", action: "a mis à jour les rôles", time: "Hier" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {activity.user[0]}
                    </div>
                    <p className="text-sm">
                      <span className="font-bold">{activity.user}</span> <span className="opacity-60">{activity.action}</span>
                    </p>
                  </div>
                  <span className="text-[10px] opacity-40 font-mono whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
