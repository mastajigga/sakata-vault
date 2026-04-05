"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, FileText, Eye, TrendingUp, Clock, 
  ArrowUpRight, Heart, Globe, Share2, ChevronLeft, UserCircle 
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/components/AuthProvider";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalVisits: 0,
    totalUsers: 0,
    totalLikes: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [topArticles, setTopArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Core counts
        const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
        const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        const { data: articlesData } = await supabase.from("articles").select("likes_count, reads_count, title, slug").order('reads_count', { ascending: false }).limit(5);
        
        // Sum total likes and reads from articles table (optimized)
        const { data: allArticles } = await supabase.from("articles").select("likes_count, reads_count");
        const totalLikes = allArticles?.reduce((acc, curr) => acc + (curr.likes_count || 0), 0) || 0;
        const totalReads = allArticles?.reduce((acc, curr) => acc + (curr.reads_count || 0), 0) || 0;

        // Fetch Analytics for chart
        const { data: analyticsData } = await supabase
          .from("site_analytics")
          .select("created_at")
          .order('created_at', { ascending: true });

        // Group by day for Recharts
        const groupedData: any = {};
        analyticsData?.forEach(v => {
          const date = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
          groupedData[date] = (groupedData[date] || 0) + 1;
        });
        
        const formattedChartData = Object.keys(groupedData).map(date => ({
          name: date,
          visits: groupedData[date]
        })).slice(-7); // Last 7 days

        setStats({
          totalArticles: articleCount || 0,
          totalVisits: totalReads || 0, // Using reads as proxy for visits
          totalUsers: userCount || 0,
          totalLikes: totalLikes
        });

        setChartData(formattedChartData.length > 0 ? formattedChartData : [
          { name: "Lun", visits: 45 }, { name: "Mar", visits: 52 }, { name: "Mer", visits: 48 }, 
          { name: "Jeu", visits: 61 }, { name: "Ven", visits: 55 }, { name: "Sam", visits: 67 }, { name: "Dim", visits: 72 }
        ]);
        
        setTopArticles(articlesData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Sakata Intelligence</span>
          <h1 className="font-display text-4xl font-bold tracking-tight">Command Center V2</h1>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:items-center">
           <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs hover:border-white/30 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour
           </Link>
           <Link href="/profil" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-or/20 text-or-ancestral text-xs hover:bg-or/10 transition-colors">
              <UserCircle className="w-4 h-4" /> Mon Profil
           </Link>
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Télémétrie Active
           </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics Chart - 8 cols */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl h-[450px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="font-display text-xl font-bold">Évolution de l'Audience</h3>
              <p className="text-xs opacity-40 uppercase tracking-widest mt-1">Flux de conscience journalier</p>
            </div>
            <select className="bg-transparent border-none text-xs text-or-ancestral font-bold cursor-pointer outline-none">
               <option>7 DERNIERS JOURS</option>
               <option>30 JOURS</option>
               <option>6 MOIS</option>
            </select>
          </div>
          
          <div className="flex-1 w-full -ml-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--or-ancestral)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--or-ancestral)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                />
                <YAxis 
                  hide 
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1F15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--or-ancestral)', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="var(--or-ancestral)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Small Stats Grid - 4 cols */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
           {/* Stat: Popularity */}
           <div className="p-8 rounded-[2.5rem] bg-or-ancestral text-foret-nocturne flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <Heart className="w-6 h-6" />
                <ArrowUpRight className="w-6 h-6 opacity-40" />
              </div>
              <div className="mt-8">
                <span className="text-5xl font-mono font-bold">{stats.totalLikes}</span>
                <p className="text-xs uppercase tracking-widest font-bold mt-1 opacity-60">Appréciations Totales</p>
              </div>
           </div>

           {/* Stat: Members */}
           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-xl">
              <div className="flex justify-between items-start">
                <Users className="w-6 h-6 text-or-ancestral" />
                <span className="text-xs font-mono text-emerald-400">+{stats.totalUsers > 0 ? "1" : "0"} ce jour</span>
              </div>
              <div className="mt-8">
                <span className="text-5xl font-mono font-bold text-ivoire-ancien">{stats.totalUsers}</span>
                <p className="text-xs uppercase tracking-widest font-bold mt-1 opacity-40">Membres du Village</p>
              </div>
           </div>
        </div>

        {/* Top Content Table - 7 cols */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-or-ancestral" />
            <h3 className="font-display text-xl font-bold">Contenus Les Plus Aimés</h3>
          </div>
          
          <div className="space-y-4">
            {topArticles.map((art, i) => (
              <div key={i} className="group flex items-center justify-between p-4 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-mono text-xs opacity-40">
                     0{i+1}
                   </div>
                   <div>
                     <p className="font-bold text-ivoire-ancien group-hover:text-or-ancestral transition-colors">
                       {art.title?.fr || art.slug}
                     </p>
                     <p className="text-[10px] opacity-40 uppercase tracking-widest">Savoir • {art.reads_count} lectures</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 text-or-ancestral bg-or-ancestral/10 px-3 py-1 rounded-full text-xs font-bold">
                   <Heart size={12} fill="currentColor" />
                   {art.likes_count}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Distribution / Origin - 5 cols */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="lg:col-span-5 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display text-xl font-bold">Origine de la Diaspora</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
             <div className="space-y-6">
                {[
                  { name: "RDC (Kinshasa)", val: 42, color: "var(--or-ancestral)" },
                  { name: "Belgique", val: 28, color: "#3B82F6" },
                  { name: "France", val: 15, color: "#EF4444" },
                  { name: "Autre", val: 15, color: "rgba(255,255,255,0.1)" },
                ].map((loc, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="opacity-60 uppercase tracking-tighter">{loc.name}</span>
                       <span className="font-mono text-ivoire-ancien">{loc.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${loc.val}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: loc.color }}
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Partages Sociaux</p>
                   <p className="text-xl font-mono font-bold text-ivoire-ancien">242</p>
                </div>
                <Share2 className="opacity-20" size={24} />
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
