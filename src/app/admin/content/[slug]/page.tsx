import { DB_TABLES } from "@/lib/constants/db";
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Save, Globe, ArrowLeft, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { translateArticle, LanguageCode } from "@/lib/translate";

const languages: { label: string; code: LanguageCode }[] = [
  { label: "Français", code: "fr" },
  { label: "Kisakata", code: "skt" },
  { label: "Lingala", code: "lin" },
  { label: "Swahili", code: "swa" },
  { label: "Tshiluba", code: "tsh" },
];

const ArticleEditor = () => {
  const { slug } = useParams();
  const router = useRouter();
  const isNew = slug === "new";
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<LanguageCode>("fr");
  
  const [article, setArticle] = useState<any>({
    slug: "",
    category: "culture",
    featured_image: "",
    title: { fr: "" },
    content: { fr: "" },
    summary: { fr: "" }
  });

  useEffect(() => {
    if (!isNew) {
      const fetchArticle = async () => {
        const { data, error } = await supabase
          .from(DB_TABLES.ARTICLES)
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (!error && data) {
          setArticle(data);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from(DB_TABLES.ARTICLES)
      .upsert(article);

    if (error) {
      alert("Erreur de sauvegarde: " + error.message);
    } else {
      router.push("/admin/content");
    }
    setSaving(false);
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const missingLangs = languages
        .map(l => l.code)
        .filter(code => code !== "fr");
      
      const updatedArticle = await translateArticle(article, missingLangs);
      setArticle(updatedArticle);
    } catch (e) {
      console.error(e);
    }
    setTranslating(false);
  };

  const updateField = (lang: LanguageCode, field: string, value: string) => {
    setArticle((prev: any) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  if (loading) return (
    <div className="py-24 text-center animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
      Lecture du grimoire...
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content" className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-1">
            <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>
              {isNew ? "Création" : "Édition"}
            </span>
            <h1 className="font-display text-3xl font-bold">
               {isNew ? "Nouveau Récit" : article.title.fr || article.slug}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoTranslate}
            disabled={translating || !article.title.fr}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold text-sm disabled:opacity-30"
          >
            {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Traduction Automatique
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-or-ancestral text-foret-nocturne font-bold hover:scale-105 transition-all text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Sauvegarder
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Metadata */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
              <h3 className="font-display text-lg font-bold border-b border-white/5 pb-4">Paramètres</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Slug permanent</label>
                <input 
                  type="text" 
                  value={article.slug}
                  disabled={!isNew}
                  onChange={(e) => setArticle({...article, slug: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-or-ancestral/50 transition-all text-sm"
                  placeholder="nom-de-l-article"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Catégorie</label>
                <select 
                  value={article.category}
                  onChange={(e) => setArticle({...article, category: e.target.value})}
                  className="w-full bg-[var(--foret-nocturne)] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-or-ancestral/50 transition-all text-sm appearance-none"
                >
                  <option value="histoire">Histoire</option>
                  <option value="culture">Culture</option>
                  <option value="sagesse">Sagesse</option>
                  <option value="langue">Langue & Proverbes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Image de couverture (URL)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={article.featured_image}
                    onChange={(e) => setArticle({...article, featured_image: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 outline-none focus:border-or-ancestral/50 transition-all text-sm"
                    placeholder="/images/..."
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                </div>
              </div>
           </div>
        </div>

        {/* Right Side: Content Editor */}
        <div className="lg:col-span-8 space-y-8">
           {/* Language Tabs */}
           <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-fit">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setActiveTab(lang.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === lang.code ? 'bg-or-ancestral text-foret-nocturne' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                >
                  {lang.label}
                </button>
              ))}
           </div>

           <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Titre ({activeTab})</label>
                <input 
                  type="text" 
                  value={article.title[activeTab] || ""}
                  onChange={(e) => updateField(activeTab, "title", e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-3xl font-display font-bold outline-none focus:border-or-ancestral transition-all"
                  placeholder="Écrivez le titre ici..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Résumé ({activeTab})</label>
                <textarea 
                  value={article.summary[activeTab] || ""}
                  onChange={(e) => updateField(activeTab, "summary", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-or-ancestral/50 transition-all text-sm italic h-24 resize-none"
                  placeholder="Bref aperçu du récit..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Contenu (Markdown - {activeTab})</label>
                <textarea 
                  value={article.content[activeTab] || ""}
                  onChange={(e) => updateField(activeTab, "content", e.target.value)}
                  className="w-full bg-[#050C09] border border-white/5 rounded-[2rem] p-8 outline-none focus:border-white/20 transition-all font-body leading-relaxed h-[400px] resize-none"
                  placeholder="Laissez parler les ancêtres..."
                />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
