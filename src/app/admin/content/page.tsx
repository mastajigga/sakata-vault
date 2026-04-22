"use client";

import { DB_TABLES } from "@/lib/constants/db";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Edit2, Trash2, Globe, Plus, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { translateArticle, LanguageCode } from "@/lib/translate";

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(DB_TABLES.ARTICLES)
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleBulkTranslate = async () => {
    if (!confirm("Voulez-vous lancer la synchronisation de toutes les traductions manquantes ? Cela peut prendre quelques instants.")) return;
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    const langs: LanguageCode[] = ["fr", "skt", "lin", "swa", "tsh"];
    let count = 0;

    for (const article of articles) {
      const translated = await translateArticle(article, langs);
      
      const { error } = await supabase
        .from(DB_TABLES.ARTICLES)
        .update({
          title: translated.title,
          content: translated.content,
          summary: translated.summary
        })
        .eq("slug", article.slug);

      if (error) console.error(`Error syncing ${article.slug}:`, error);
      
      count++;
      setSyncProgress(Math.round((count / articles.length) * 100));
    }

    await fetchArticles();
    setIsSyncing(false);
    alert("La mémoire du sanctuaire est désormais riche de toutes les langues !");
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Êtes-vous sûr de vouloir effacer ce savoir de la mémoire numérique ?")) {
      const { error } = await supabase.from(DB_TABLES.ARTICLES).delete().eq("slug", slug);
      if (!error) {
        setArticles(articles.filter(a => a.slug !== slug));
      } else {
        alert("Une force mystérieuse empêche la suppression : " + error.message);
      }
    }
  };

  const filteredArticles = articles.filter(a => 
    JSON.stringify(a.title).toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.slug.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Contenu</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Gestion des Articles</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkTranslate}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-ivoire-ancien font-bold transition-all hover:bg-white/5 active:scale-95 disabled:opacity-50"
          >
            <Globe className={`w-5 h-5 ${isSyncing ? 'animate-spin text-or-ancestral' : ''}`} />
            {isSyncing ? `Synchronisation (${syncProgress}%)` : "Synchroniser tout"}
          </button>
          <Link 
            href="/admin/content/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-or-ancestral text-foret-nocturne font-bold transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Nouveau Récit
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
          Lecture des archives...
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={article.slug}
              className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/20 flex-shrink-0 border border-white/5">
                  <img 
                    src={(article.featured_image || "").replace('/articles/media/', '/media/') || "/images/sakata_mask_detail.png"} 
                    alt="" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-ivoire-ancien group-hover:text-or-ancestral transition-colors">
                    {article.title.fr || article.slug}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <div className="flex gap-1">
                      {["fr", "skt", "lin", "swa", "tsh"].map(lang => (
                        <span 
                          key={lang} 
                          className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold ${article.title[lang] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/content/${article.slug}`}
                  className="p-3 rounded-xl hover:bg-or-ancestral hover:text-foret-nocturne transition-all text-white/40"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(article.slug)}
                  className="p-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all text-white/40"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredArticles.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
              <p className="opacity-40 italic">Aucun savoir ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPage;
