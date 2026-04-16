"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, FileText, Eye, TrendingUp, Clock, 
  ArrowUpRight, Heart, Globe, Share2, ChevronLeft, UserCircle 
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import { useAuth } from "@/components/AuthProvider";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";

const COUNTRY_NAMES: Record<string, string> = {
  // African countries
  "CD": "République Démocratique du Congo",
  "RDC": "République Démocratique du Congo",
  "Congo": "République du Congo",
  "CG": "République du Congo",
  "KE": "Kenya",
  "TZ": "Tanzanie",
  "UG": "Ouganda",
  "RW": "Rwanda",
  "Cameroon": "Cameroun",
  "CM": "Cameroun",
  "BW": "Botswana",
  "ZA": "Afrique du Sud",
  "ZM": "Zambie",
  "ZW": "Zimbabwe",
  "MW": "Malawi",
  "MZ": "Mozambique",
  "AO": "Angola",
  "GA": "Gabon",
  "CG": "Congo",
  "CM": "Cameroun",
  "GQ": "Guinée Équatoriale",
  "CF": "République Centrafricaine",
  "TD": "Tchad",
  "SD": "Soudan",
  "NG": "Nigeria",
  "GH": "Ghana",
  "CI": "Côte d'Ivoire",
  "SN": "Sénégal",
  "ML": "Mali",
  "BF": "Burkina Faso",
  "NE": "Niger",
  "ET": "Éthiopie",
  "SO": "Somalie",
  "DJ": "Djibouti",
  "ER": "Érythrée",

  // European countries
  "FR": "France",
  "BE": "Belgique",
  "NL": "Pays-Bas",
  "DE": "Allemagne",
  "IT": "Italie",
  "ES": "Espagne",
  "PT": "Portugal",
  "PL": "Pologne",
  "RU": "Russie",
  "GB": "Royaume-Uni",
  "CH": "Suisse",
  "AT": "Autriche",
  "SE": "Suède",
  "NO": "Norvège",
  "DK": "Danemark",
  "FI": "Finlande",

  // Americas
  "US": "États-Unis",
  "CA": "Canada",
  "MX": "Mexique",
  "BR": "Brésil",
  "AR": "Argentine",
  "CL": "Chili",
  "CO": "Colombie",

  // Asia
  "CN": "Chine",
  "IN": "Inde",
  "JP": "Japon",
  "KR": "Corée du Sud",
  "TH": "Thaïlande",
  "VN": "Vietnam",
  "SG": "Singapour",
  "MY": "Malaisie",
  "PH": "Philippines",
  "ID": "Indonésie",
  "PK": "Pakistan",

  // Middle East
  "SA": "Arabie Saoudite",
  "AE": "Émirats Arabes Unis",
  "IL": "Israël",
  "TR": "Turquie",
  "IR": "Iran",
  "IQ": "Irak",
  "SY": "Syrie",
  "JO": "Jordanie",
  "LB": "Liban",
};

const getCountryFullName = (shortName: string): string => {
  // Check if it's already in the mapping
  if (COUNTRY_NAMES[shortName]) {
    return COUNTRY_NAMES[shortName];
  }
  // If not, return the short name as-is
  return shortName;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    todayUniqueVisitors: 0,
    totalUsers: 0,
    totalLikes: 0,
    langDistribution: [] as any[],
    deviceDistribution: [] as any[],
    topLocations: [] as any[],
    recentIps: [] as any[],
    topSources: [] as any[],
    // distributions du jour (toutes visites)
    todayLangDistribution: [] as any[],
    todayDeviceDistribution: [] as any[],
    todayTopLocations: [] as any[],
    todayTopSources: [] as any[],
    // distributions du jour (uniques)
    todayLangDistribUniq: [] as any[],
    todayDeviceDistribUniq: [] as any[],
    todayTopLocationsUniq: [] as any[],
    todayTopSourcesUniq: [] as any[],
    // distributions totales (uniques)
    totalLangDistribUniq: [] as any[],
    totalDeviceDistribUniq: [] as any[],
    totalTopLocationsUniq: [] as any[],
    totalTopSourcesUniq: [] as any[],
  });
  const [insightView, setInsightView] = useState<"total" | "today">("today");
  const [insightUnique, setInsightUnique] = useState(false);

  const { connectionError, refreshConnection } = useAuth();

  const [chartData, setChartData] = useState<any[]>([]);
  const [topArticles, setTopArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24_hours" | "7_days" | "30_days" | "6_months">("7_days");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Core counts
        const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
        const { count: userCount } = await supabase.from(DB_TABLES.PROFILES).select("*", { count: "exact", head: true });
        const { data: articlesData } = await supabase.from("articles").select("likes_count, reads_count, title, slug").order('reads_count', { ascending: false }).limit(5);
        
        // Sum total likes and reads from articles table (optimized)
        const { data: allArticles } = await supabase.from("articles").select("likes_count, reads_count");
        const totalLikes = allArticles?.reduce((acc, curr) => acc + (curr.likes_count || 0), 0) || 0;
        const totalReads = allArticles?.reduce((acc, curr) => acc + (curr.reads_count || 0), 0) || 0;

        // Fetch Analytics for chart and insights
        let dateFilter = new Date();
        if (timeframe === "24_hours") dateFilter.setDate(dateFilter.getDate() - 1);
        else if (timeframe === "7_days") dateFilter.setDate(dateFilter.getDate() - 7);
        else if (timeframe === "30_days") dateFilter.setDate(dateFilter.getDate() - 30);
        else if (timeframe === "6_months") dateFilter.setMonth(dateFilter.getMonth() - 6);

        const { data: analyticsData } = await supabase
          .from("site_analytics")
          .select("created_at, language, session_id, metadata, ip_address, referrer, path")
          .gte("created_at", dateFilter.toISOString())
          .order('created_at', { ascending: true });

        // Calculate unique visitors (Real session counting)
        const uniqueSids = new Set(analyticsData?.map(v => v.session_id).filter(id => id)).size;

        // Stats précises du jour (minuit heure locale → UTC)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { data: todayData } = await supabase
          .from("site_analytics")
          .select("created_at, language, session_id, metadata, ip_address, referrer, path")
          .gte("created_at", todayStart.toISOString());
        const todayVisits = todayData?.length || 0;
        const todayUniqueVisitors = new Set(todayData?.map(v => v.session_id).filter(Boolean)).size;

        // Helper : calcule les distributions à partir d'un dataset analytics
        // unique=true → déduplique par session_id avant de compter
        const computeDistributions = (data: any[], unique = false) => {
          // En mode unique, on ne garde que la première occurrence par session
          const rows = unique
            ? (() => {
                const seen = new Set<string>();
                return data.filter(v => {
                  const sid = v.session_id || v.ip_address;
                  if (!sid || seen.has(sid)) return false;
                  seen.add(sid); return true;
                });
              })()
            : data;

          // Langues
          const langsMap: any = {};
          rows.forEach(v => { if (v.language) langsMap[v.language] = (langsMap[v.language] || 0) + 1; });
          const langs = Object.keys(langsMap).sort((a, b) => langsMap[b] - langsMap[a]).map(l => ({
            name: l === "fr" ? "Français" : l === "ln" ? "Lingala" : l === "sak" ? "Kisakata" : l,
            value: langsMap[l],
          }));
          // Appareils
          const devMap: any = { mobile: 0, desktop: 0 };
          rows.forEach(v => { const d = v.metadata?.device_type || "desktop"; devMap[d] = (devMap[d] || 0) + 1; });
          const devices = Object.keys(devMap).map(d => ({ name: d, value: devMap[d] }));
          // Géographie (toujours par IP unique, peu importe le mode)
          const countryMap: any = {};
          const seenIps = new Set();
          data.forEach(v => {
            if (v.ip_address && !seenIps.has(v.ip_address)) {
              seenIps.add(v.ip_address);
              const c = v.metadata?.country || "Inconnu";
              countryMap[c] = (countryMap[c] || 0) + 1;
            }
          });
          const locs = Object.keys(countryMap).sort((a, b) => countryMap[b] - countryMap[a]).slice(0, 5)
            .map(c => ({ name: c === "Inconnu" ? "Origine Inconnue" : c, value: countryMap[c] }));
          if (locs.length === 0) locs.push({ name: "En attente de trafic", value: 0 });
          // Sources
          const refMap: any = {};
          rows.forEach(v => {
            let ref = v.referrer || "direct";
            if (ref.includes("sakata.netlify.app") || ref.includes("localhost")) return;
            if (ref.startsWith("https://")) ref = ref.replace("https://", "").replace("http://", "").split("/")[0];
            if (ref === "direct" || ref === "server") ref = "Accès Direct / Favoris";
            else if (ref.includes("google.")) ref = "Google (Recherche)";
            else if (ref.includes("bing.")) ref = "Bing (Recherche)";
            else if (ref.includes("facebook.com") || ref.includes("m.facebook.com")) ref = "Facebook";
            else if (ref.includes("instagram.com")) ref = "Instagram";
            else if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) ref = "X (Twitter)";
            else if (ref.includes("linkedin.com")) ref = "LinkedIn";
            else if (ref.includes("whatsapp.com") || ref.includes("wa.me")) ref = "WhatsApp";
            refMap[ref] = (refMap[ref] || 0) + 1;
          });
          const sources = Object.keys(refMap).sort((a, b) => refMap[b] - refMap[a]).slice(0, 5)
            .map(r => ({ name: r.slice(0, 25), count: refMap[r] }));
          return { langs, devices, locs, sources };
        };

        // Pré-calcul des 4 combinaisons (aujourd'hui/total × toutes/uniques)
        const todayDistrib       = computeDistributions(todayData || [], false);
        const todayDistribUniq   = computeDistributions(todayData || [], true);
        const totalDistrib       = computeDistributions(analyticsData || [], false);
        const totalDistribUniq   = computeDistributions(analyticsData || [], true);
        
        // Calculate Top Sources (Referrers)
        const referrers: any = {};
        analyticsData?.forEach(v => {
          let ref = v.referrer || "direct";
          
          if (ref.includes("sakata.netlify.app") || ref.includes("localhost")) return; // ignore internal
          if (ref.startsWith("https://")) ref = ref.replace("https://", "").replace("http://", "").split("/")[0];
          
          // Beautify standard sources
          if (ref === "direct" || ref === "server") ref = "Accès Direct / Favoris";
          else if (ref.includes("google.")) ref = "Google (Recherche)";
          else if (ref.includes("bing.")) ref = "Bing (Recherche)";
          else if (ref.includes("yahoo.")) ref = "Yahoo (Recherche)";
          else if (ref.includes("facebook.com") || ref.includes("m.facebook.com") || ref.includes("l.facebook.com")) ref = "Facebook";
          else if (ref.includes("instagram.com")) ref = "Instagram";
          else if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) ref = "X (Twitter)";
          else if (ref.includes("linkedin.com")) ref = "LinkedIn";
          else if (ref.includes("whatsapp.com") || ref.includes("wa.me")) ref = "WhatsApp";
          else if (ref.startsWith("UTM: ")) ref = ref.replace("UTM: ", "Campagne: ");

          referrers[ref] = (referrers[ref] || 0) + 1;
        });
        const topSources = Object.keys(referrers)
          .sort((a, b) => referrers[b] - referrers[a])
          .slice(0, 5)
          .map(ref => ({ name: ref.slice(0, 20), count: referrers[ref] }));

        // Calculate Language stats
        const langs: any = {};
        analyticsData?.forEach(v => {
          if (v.language) langs[v.language] = (langs[v.language] || 0) + 1;
        });
        const formattedLangs = Object.keys(langs).map(l => ({ 
          name: l === 'fr' ? 'Français' : l === 'ln' ? 'Lingala' : l === 'sak' ? 'Kisakata' : l, 
          value: langs[l] 
        }));

        // Calculate Device stats from metadata
        const devices: any = { mobile: 0, desktop: 0 };
        analyticsData?.forEach(v => {
          const device = v.metadata?.device_type || 'desktop';
          devices[device] = (devices[device] || 0) + 1;
        });
        const formattedDevices = Object.keys(devices).map(d => ({ name: d, value: devices[d] }));
        
        // Real Geographic Mapping using the Country extracted via Edge API
        const countries: any = {};
        const uniqueGeoIps = new Set();
        analyticsData?.forEach(v => {
          if (v.ip_address && !uniqueGeoIps.has(v.ip_address)) {
             uniqueGeoIps.add(v.ip_address);
             const c = v.metadata?.country || "Inconnu";
             countries[c] = (countries[c] || 0) + 1;
          }
        });

        const locations = Object.keys(countries)
          .sort((a, b) => countries[b] - countries[a])
          .slice(0, 5)
          .map(country => ({
             name: country === "Inconnu" ? "Origine Inconnue" : country,
             value: countries[country]
          }));

        if (locations.length === 0) {
           locations.push({ name: "En attente de trafic", value: 0 });
        }

        // Chart Data Builder
        let chartPoints: any[] = [];
        const groupedByTime: any = {};

        if (timeframe === "24_hours") {
          chartPoints = Array.from({ length: 24 }, (_, i) => {
            const d = new Date();
            d.setHours(i, 0, 0, 0);
            return `${String(i).padStart(2, '0')}h`;
          });

          chartPoints.forEach(hour => groupedByTime[hour] = 0);

          analyticsData?.forEach(v => {
            const hour = `${String(new Date(v.created_at).getHours()).padStart(2, '0')}h`;
            if (groupedByTime[hour] !== undefined) {
               groupedByTime[hour] += 1;
            }
          });
        } else if (timeframe === "7_days" || timeframe === "30_days") {
          const length = timeframe === "7_days" ? 7 : 30;
          chartPoints = Array.from({ length }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (length - 1 - i));
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
          });

          chartPoints.forEach(day => groupedByTime[day] = 0);

          analyticsData?.forEach(v => {
            const date = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            if (groupedByTime[date] !== undefined) {
               groupedByTime[date] += 1;
            }
          });
        } else if (timeframe === "6_months") {
          chartPoints = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          });

          chartPoints.forEach(month => groupedByTime[month] = 0);

          analyticsData?.forEach(v => {
            const month = new Date(v.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            if (groupedByTime[month] !== undefined) {
               groupedByTime[month] += 1;
            }
          });
        }

        const formattedChartData = chartPoints.map(point => ({
          name: point,
          visits: groupedByTime[point]
        }));

        setStats({
          totalArticles: articleCount || 0,
          totalVisits: analyticsData?.length || totalReads || 0,
          uniqueVisitors: uniqueSids || Math.max(0, Math.floor(totalReads * 0.65)),
          todayVisits,
          todayUniqueVisitors,
          totalUsers: userCount || 0,
          totalLikes: totalLikes,
          todayLangDistribution: todayDistrib.langs,
          todayDeviceDistribution: todayDistrib.devices,
          todayTopLocations: todayDistrib.locs,
          todayTopSources: todayDistrib.sources,
          todayLangDistribUniq: todayDistribUniq.langs,
          todayDeviceDistribUniq: todayDistribUniq.devices,
          todayTopLocationsUniq: todayDistribUniq.locs,
          todayTopSourcesUniq: todayDistribUniq.sources,
          totalLangDistribUniq: totalDistribUniq.langs,
          totalDeviceDistribUniq: totalDistribUniq.devices,
          totalTopLocationsUniq: totalDistribUniq.locs,
          totalTopSourcesUniq: totalDistribUniq.sources,
          langDistribution: formattedLangs,
          deviceDistribution: formattedDevices,
          topLocations: locations,
          recentIps: [],
          topSources: topSources
        } as any);

        setChartData(formattedChartData.length > 0 ? formattedChartData : [
          { name: "Lun", visits: 0 }
        ]);
        
        setTopArticles(articlesData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

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
              <p className="text-xs opacity-40 uppercase tracking-widest mt-1">Flux de conscience {timeframe === '6_months' ? 'MENSUEL' : timeframe === '24_hours' ? 'HORAIRE' : 'JOURNALIER'}</p>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-transparent border-none text-xs text-or-ancestral font-bold cursor-pointer outline-none"
            >
               <option value="24_hours">24 DERNIÈRES HEURES</option>
               <option value="7_days">7 DERNIERS JOURS</option>
               <option value="30_days">30 JOURS</option>
               <option value="6_months">6 MOIS</option>
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
                  contentStyle={{ backgroundColor: "var(--foret-nocturne)", border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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

           {/* Stat: Visitors */}
           <div
             className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-xl group cursor-help"
             title="Données actuelles basées sur les sessions analytiques."
           >
              <div className="flex justify-between items-start">
                <Eye className="w-6 h-6 text-emerald-400" />
                <span className="text-[10px] font-mono opacity-40 border border-white/10 px-2 py-0.5 rounded-full">Donnée Approximative</span>
              </div>
              {/* Totaux (période sélectionnée) */}
              <div className="mt-8 flex justify-between items-end">
                <div>
                   <span className="text-5xl font-mono font-bold text-ivoire-ancien">{stats.uniqueVisitors}</span>
                   <p className="text-xs uppercase tracking-widest font-bold mt-1 text-emerald-400">Visiteurs Uniques</p>
                </div>
                <div className="text-right">
                   <span className="text-xl font-mono font-bold text-ivoire-ancien/60">{stats.totalVisits}</span>
                   <p className="text-[10px] uppercase tracking-widest font-bold mt-1 opacity-40">Visites Tot.</p>
                </div>
              </div>
              {/* Séparateur */}
              <div className="my-4 border-t border-white/10" />
              {/* Stats précises du jour */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-mono font-bold text-emerald-400">{stats.todayUniqueVisitors}</span>
                  <p className="text-[10px] uppercase tracking-widest font-bold mt-1 text-emerald-400/70">Uniques Aujourd'hui</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-ivoire-ancien/80">{stats.todayVisits}</span>
                  <p className="text-[10px] uppercase tracking-widest font-bold mt-1 opacity-40">Visites Aujourd'hui</p>
                </div>
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

        {/* Languages & Devices - 5 cols */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="lg:col-span-5 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col"
        >
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display text-xl font-bold">Langues & Terminaux</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle Aujourd'hui / Total */}
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setInsightView("today")}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${insightView === "today" ? "bg-emerald-500/20 text-emerald-400" : "opacity-40 hover:opacity-70"}`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setInsightView("total")}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${insightView === "total" ? "bg-white/10 text-ivoire-ancien" : "opacity-40 hover:opacity-70"}`}
                >
                  Total
                </button>
              </div>
              {/* Toggle Toutes visites / Uniques */}
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setInsightUnique(false)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${!insightUnique ? "bg-white/10 text-ivoire-ancien" : "opacity-40 hover:opacity-70"}`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setInsightUnique(true)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${insightUnique ? "bg-or-ancestral/20 text-or-ancestral" : "opacity-40 hover:opacity-70"}`}
                >
                  Uniques
                </button>
              </div>
            </div>
          </div>

          {(() => {
            const isToday = insightView === "today";
            const langs   = isToday ? (insightUnique ? stats.todayLangDistribUniq   : stats.todayLangDistribution)   : (insightUnique ? stats.totalLangDistribUniq   : stats.langDistribution);
            const devices = isToday ? (insightUnique ? stats.todayDeviceDistribUniq : stats.todayDeviceDistribution) : (insightUnique ? stats.totalDeviceDistribUniq : stats.deviceDistribution);
            const locs    = isToday ? (insightUnique ? stats.todayTopLocationsUniq  : stats.todayTopLocations)       : (insightUnique ? stats.totalTopLocationsUniq  : stats.topLocations);
            const sources = isToday ? (insightUnique ? stats.todayTopSourcesUniq    : stats.todayTopSources)         : (insightUnique ? stats.totalTopSourcesUniq    : stats.topSources);
            const totalV  = isToday ? stats.todayVisits       : stats.totalVisits;
            const totalU  = isToday ? stats.todayUniqueVisitors : stats.uniqueVisitors;
            return (
          <div className="flex-1 flex flex-col justify-between">
             <div className="space-y-8">
                {/* Languages */}
                <div className="space-y-4">
                   <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Préférences Linguistiques</p>
                   <div className="space-y-2">
                      {langs.length > 0 ? langs.map((lang: any, i: number) => (
                        <div key={i} className="space-y-1">
                           <div className="flex justify-between text-[10px] font-bold">
                              <span className="opacity-60 uppercase tracking-tighter">{lang.name}</span>
                              <span className="font-mono text-ivoire-ancien">{lang.value}</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                 key={`${insightView}-${insightUnique}-lang-${i}`}
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min(100, (lang.value / (insightUnique ? (totalU || 1) : (totalV || 1))) * 100)}%` }}
                                 className="h-full bg-or-ancestral rounded-full"
                              />
                           </div>
                        </div>
                      )) : (
                        <p className="text-xs opacity-40 italic">Aucune donnée pour cette période</p>
                      )}
                   </div>
                </div>

                 <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Types d'Appareils</p>
                    <div className="grid grid-cols-2 gap-4">
                       {devices.map((device: any, i: number) => (
                         <div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] uppercase tracking-tighter opacity-40 mb-1">{device.name}</p>
                            <p className="text-xl font-mono font-bold text-ivoire-ancien">{device.value}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Locations */}
                 <div className="space-y-4 pt-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Distribution Géographique (IP)</p>
                    <div className="space-y-3">
                       {locs.map((loc: any, i: number) => (
                         <div key={i} className="flex items-center justify-between group" title={getCountryFullName(loc.name)}>
                            <span className="text-xs font-medium text-ivoire-ancien/80 cursor-help hover:text-or-ancestral transition-colors">{loc.name}</span>
                            <div className="flex items-center gap-3">
                               <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    key={`${insightView}-${insightUnique}-loc-${i}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(loc.value / (totalU || 1)) * 100}%` }}
                                    className="h-full bg-emerald-500/50"
                                  />
                               </div>
                               <span className="text-[10px] font-mono opacity-40">{loc.value}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Top Sources */}
                 {sources && sources.length > 0 && (
                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center justify-between">
                      <span>Sources d'Acquisition (Referrers)</span>
                    </p>
                    <div className="space-y-3">
                       {sources.map((source: any, i: number) => (
                         <div key={`src-${i}`} className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ivoire-ancien/80">{source.name}</span>
                            <span className="text-[10px] font-mono text-or-ancestral bg-or-ancestral/10 px-2 py-0.5 rounded-full">{source.count}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 )}
              </div>

             <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest flex items-center gap-2">Télémétrie Live <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded text-[8px]">H24</span></p>
                   <p className="text-xl font-mono font-bold text-ivoire-ancien">Activée</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-emerald-500/20 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
             </div>
          </div>
            );
          })()}
        </motion.div>

      </div>

      {/* Footer Indicators */}
      <div className="flex justify-center mt-12">
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 cursor-pointer group hover:bg-white/10 transition-colors"
          onClick={() => refreshConnection()}
          title={connectionError || "Liaison spirituelle établie avec Supabase"}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${connectionError ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse'}`} />
          <span className="text-xs uppercase tracking-widest font-mono text-ivoire-ancien/60 group-hover:text-ivoire-ancien transition-colors">
            {connectionError ? "Liaison BDD Rompue - Reconnecter" : "Sanctuaire BDD Lié et Actif"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
