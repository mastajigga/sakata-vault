"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Search, Filter, Download, Globe, Smartphone, Maximize2 } from "lucide-react";
import type { AnalyticsRecord } from "../types";

interface FilterState {
  searchTerm: string;
  language: string;
  deviceType: string;
  country: string;
  dateRange: "24_hours" | "7_days" | "30_days" | "all";
}

const AnalyticsPage = () => {
  const { user, role, isLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    language: "all",
    deviceType: "all",
    country: "all",
    dateRange: "7_days",
  });
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "language">("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const COUNTRY_NAMES: Record<string, string> = {
    "CD": "République Démocratique du Congo",
    "RDC": "République Démocratique du Congo",
    "FR": "France",
    "BE": "Belgique",
    "US": "États-Unis",
    "CA": "Canada",
    "BR": "Brésil",
    "KE": "Kenya",
    "TZ": "Tanzanie",
    "UG": "Ouganda",
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingData(true);
      try {
        let dateFilter = new Date();
        if (filters.dateRange === "24_hours") dateFilter.setDate(dateFilter.getDate() - 1);
        else if (filters.dateRange === "7_days") dateFilter.setDate(dateFilter.getDate() - 7);
        else if (filters.dateRange === "30_days") dateFilter.setDate(dateFilter.getDate() - 30);
        else if (filters.dateRange === "all") dateFilter = new Date("2000-01-01");

        const { data, error } = await supabase
          .from(DB_TABLES.SITE_ANALYTICS)
          .select("created_at, language, session_id, metadata, ip_address, referrer, path")
          .gte("created_at", dateFilter.toISOString())
          .order("created_at", { ascending: false })
          .limit(10000) as { data: AnalyticsRecord[]; error: any };

        if (error) throw error;
        setAnalyticsData(data || []);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAnalytics();
  }, [filters.dateRange]);

  const filteredData = useMemo(() => {
    let filtered = analyticsData;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.path?.toLowerCase().includes(term) ||
          item.ip_address?.includes(term) ||
          item.referrer?.toLowerCase().includes(term) ||
          item.session_id?.includes(term)
      );
    }

    if (filters.language !== "all") {
      filtered = filtered.filter((item) => item.language === filters.language);
    }

    if (filters.deviceType !== "all") {
      filtered = filtered.filter((item) => item.metadata?.device_type === filters.deviceType);
    }

    if (filters.country !== "all") {
      filtered = filtered.filter((item) => item.metadata?.country === filters.country);
    }

    // Apply sorting
    if (sortBy === "date_asc") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "language") {
      filtered.sort((a, b) => (a.language || "").localeCompare(b.language || ""));
    }

    return filtered;
  }, [analyticsData, filters, sortBy]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueLanguages = useMemo(() => {
    return Array.from(new Set(analyticsData.map((item) => item.language).filter(Boolean)));
  }, [analyticsData]);

  const uniqueDeviceTypes = useMemo(() => {
    return Array.from(new Set(analyticsData.map((item) => item.metadata?.device_type).filter(Boolean)));
  }, [analyticsData]);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(analyticsData.map((item) => item.metadata?.country).filter(Boolean)));
  }, [analyticsData]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      fr: "Français",
      en: "English",
      ln: "Lingala",
      skt: "Sakata",
      swa: "Swahili",
      tsh: "Tshiluba",
    };
    return langMap[lang] || lang;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-or-ancestral flex items-center gap-3">
          <Globe className="w-8 h-8" />
          Logs d'activité utilisateurs
        </h1>
        <p className="text-ivoire-ancien/60">Consultez les logs complets de l'activité sur la plateforme</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
        >
          <p className="text-sm text-ivoire-ancien/60 mb-2">Total d'enregistrements</p>
          <p className="text-2xl font-bold text-or-ancestral">{filteredData.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
        >
          <p className="text-sm text-ivoire-ancien/60 mb-2">Visites uniques (session)</p>
          <p className="text-2xl font-bold text-or-ancestral">
            {new Set(analyticsData.map((item) => item.session_id).filter(Boolean)).size}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
        >
          <p className="text-sm text-ivoire-ancien/60 mb-2">Langues</p>
          <p className="text-2xl font-bold text-or-ancestral">{uniqueLanguages.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
        >
          <p className="text-sm text-ivoire-ancien/60 mb-2">Pays</p>
          <p className="text-2xl font-bold text-or-ancestral">{uniqueCountries.length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-or-ancestral" />
          <h2 className="text-lg font-semibold text-ivoire-ancien">Filtres</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-ivoire-ancien/80 mb-2">Période</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-ivoire-ancien focus:outline-none focus:border-or-ancestral"
            >
              <option value="24_hours">Dernières 24h</option>
              <option value="7_days">Derniers 7 jours</option>
              <option value="30_days">Derniers 30 jours</option>
              <option value="all">Tous les logs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivoire-ancien/80 mb-2">Langue</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-ivoire-ancien focus:outline-none focus:border-or-ancestral"
            >
              <option value="all">Toutes</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {formatLanguage(lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivoire-ancien/80 mb-2">Appareil</label>
            <select
              value={filters.deviceType}
              onChange={(e) => handleFilterChange("deviceType", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-ivoire-ancien focus:outline-none focus:border-or-ancestral"
            >
              <option value="all">Tous</option>
              {uniqueDeviceTypes.map((device) => (
                <option key={device} value={device}>
                  {device === "mobile" ? "Mobile" : "Desktop"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivoire-ancien/80 mb-2">Pays</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-ivoire-ancien focus:outline-none focus:border-or-ancestral"
            >
              <option value="all">Tous</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {COUNTRY_NAMES[country] || country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivoire-ancien/80 mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ivoire-ancien/40" />
              <input
                type="text"
                placeholder="URL, IP, session..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pl-10 text-ivoire-ancien placeholder-ivoire-ancien/40 focus:outline-none focus:border-or-ancestral"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sort & Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-ivoire-ancien/60">Trier par:</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-ivoire-ancien focus:outline-none focus:border-or-ancestral"
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="language">Langue</option>
          </select>
        </div>
        <p className="text-sm text-ivoire-ancien/60">
          Page {currentPage} sur {totalPages || 1} ({filteredData.length} résultats)
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Chemin</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Langue</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Appareil</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Pays</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">IP</th>
                <th className="px-4 py-3 text-left text-ivoire-ancien/80 font-semibold">Référent</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingData ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ivoire-ancien/60">
                    Chargement des données...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ivoire-ancien/60">
                    Aucun enregistrement trouvé
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-ivoire-ancien/80 whitespace-nowrap">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3 text-ivoire-ancien/80 max-w-xs truncate" title={item.path}>
                      {item.path}
                    </td>
                    <td className="px-4 py-3 text-ivoire-ancien/80">{formatLanguage(item.language)}</td>
                    <td className="px-4 py-3 text-ivoire-ancien/80">
                      {item.metadata?.device_type === "mobile" ? (
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-4 h-4" /> Mobile
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-4 h-4" /> Desktop
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ivoire-ancien/80">{COUNTRY_NAMES[item.metadata?.country] || item.metadata?.country}</td>
                    <td className="px-4 py-3 text-ivoire-ancien/80 font-mono text-xs">{item.ip_address || "-"}</td>
                    <td className="px-4 py-3 text-ivoire-ancien/80 max-w-xs truncate text-xs" title={item.referrer || ""}>
                      {item.referrer ? new URL(item.referrer).hostname : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-ivoire-ancien hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-or-ancestral/20 text-or-ancestral border border-or-ancestral/50"
                    : "bg-white/10 border border-white/20 text-ivoire-ancien hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-ivoire-ancien hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
