"use client";

import { DB_TABLES } from "@/lib/constants/db";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Save, Globe, ArrowLeft, Loader2, Sparkles, 
  Image as ImageIcon, Plus, Trash2, GripVertical, 
  Type, Quote, Heading2, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import Link from "next/link";
import { translateArticle, LanguageCode } from "@/lib/translate";
import { ContentBlock } from "@/types/i18n";
import { motion, Reorder } from "framer-motion";

const languages: { label: string; code: LanguageCode }[] = [
  { label: "Français", code: "fr" },
  { label: "Kisakata", code: "skt" },
  { label: "Lingala", code: "lin" },
  { label: "Swahili", code: "swa" },
  { label: "Tshiluba", code: "tsh" },
];

const BlockEditor = ({ 
  blocks, 
  onChange 
}: { 
  blocks: ContentBlock[], 
  onChange: (blocks: ContentBlock[]) => void 
}) => {
  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      body: type === "text" || type === "heading" ? "" : undefined,
      url: type === "image" ? "" : undefined,
      alignment: type === "image" ? "full" : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-4">
        {blocks.map((block) => (
          <Reorder.Item 
            key={block.id} 
            value={block}
            className="group relative bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all"
          >
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing p-2">
               <GripVertical className="w-5 h-5 text-ivoire-ancien" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                {block.type === "text" && (
                  <textarea 
                    value={block.body || ""}
                    onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                    className="w-full bg-transparent outline-none text-ivoire-ancien/80 leading-relaxed min-h-[100px] resize-none"
                    placeholder="Écrivez votre paragraphe..."
                  />
                )}

                {block.type === "heading" && (
                  <input 
                    type="text"
                    value={block.body || ""}
                    onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                    className="w-full bg-transparent outline-none text-2xl font-display font-bold text-ivoire-ancien"
                    placeholder="Titre de section..."
                  />
                )}

                {block.type === "image" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input 
                          type="text"
                          value={block.url || ""}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 pl-10 outline-none focus:border-or-ancestral/50 text-sm"
                          placeholder="URL de l'image (ex: /images/...)"
                        />
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      </div>
                      <div className="flex bg-black/20 rounded-xl p-1 border border-white/10">
                        {(["left", "full", "right"] as const).map(align => (
                          <button
                            key={align}
                            onClick={() => updateBlock(block.id, { alignment: align })}
                            className={`p-2 rounded-lg transition-all ${block.alignment === align ? 'bg-or-ancestral text-foret-nocturne' : 'opacity-40 hover:opacity-100'}`}
                          >
                            {align === "left" && <AlignLeft className="w-4 h-4" />}
                            {align === "full" && <AlignCenter className="w-4 h-4" />}
                            {align === "right" && <AlignRight className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    {block.url && (
                      <div className={`rounded-xl overflow-hidden border border-white/5 bg-black/20 ${block.alignment === 'full' ? 'w-full' : 'w-1/2 mx-auto'}`}>
                        <img src={block.url} alt="" className="w-full h-auto object-cover opacity-60" />
                      </div>
                    )}
                    <input 
                      type="text"
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      className="w-full bg-transparent italic text-xs opacity-40 outline-none"
                      placeholder="Légende de l'image..."
                    />
                  </div>
                )}

                {block.type === "quote" && (
                   <div className="space-y-4 pl-4 border-l-2 border-or-ancestral/30 bg-or-ancestral/5 py-4 px-6 rounded-r-xl">
                      <textarea 
                        value={block.body || ""}
                        onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                        className="w-full bg-transparent outline-none text-ivoire-ancien/90 italic font-display text-lg"
                        placeholder="La parole du sage..."
                      />
                      <input 
                        type="text"
                        value={block.caption || ""}
                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                        className="w-full bg-transparent text-sm opacity-60 font-bold outline-none"
                        placeholder="- Auteur ou Source"
                      />
                   </div>
                )}
              </div>

              <button 
                onClick={() => removeBlock(block.id)}
                className="p-2 text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex items-center justify-center gap-4 py-8 border-2 border-dashed border-white/5 rounded-[2rem]">
        <button onClick={() => addBlock("text")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Type className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Paragraphe</span>
        </button>
        <button onClick={() => addBlock("heading")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Heading2 className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Titre</span>
        </button>
        <button onClick={() => addBlock("image")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><ImageIcon className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Image</span>
        </button>
        <button onClick={() => addBlock("quote")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Quote className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Citation</span>
        </button>
      </div>
    </div>
  );
};

const ArticleEditor = () => {
  const { slug } = useParams();
  const router = useRouter();
  const isNew = slug === "new";
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<LanguageCode>("fr");
  const [editorMode, setEditorMode] = useState<"text" | "blocks">("text");
  
  const [article, setArticle] = useState<any>({
    slug: "",
    category: "culture",
    featured_image: "",
    title: { fr: "" },
    content: { fr: "" },
    summary: { fr: "" }
  });

  const stringToBlocks = (text: string): ContentBlock[] => {
    if (!text) return [];
    if (typeof text !== 'string') return text as any; // Already blocks?
    return [{ id: Math.random().toString(36).substr(2, 9), type: "text", body: text }];
  };

  const blocksToString = (blocks: ContentBlock[]): string => {
    // Simple serialization if needed for legacy components, but we aim for JSONB support
    return JSON.stringify(blocks);
  };

  useEffect(() => {
    if (!isNew) {
      const fetchArticle = async () => {
        const { data, error } = await supabase
          .from(DB_TABLES.ARTICLES)
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (!error && data) {
          // If content is already blocks (starts with [), set mode to blocks
          const firstContent = data.content?.fr;
          if (Array.isArray(firstContent) || (typeof firstContent === 'string' && firstContent.startsWith('['))) {
             setEditorMode("blocks");
             if (typeof firstContent === 'string') {
                try {
                   const parsed = JSON.parse(firstContent);
                   data.content.fr = parsed;
                } catch(e) {}
             }
          }
          setArticle(data);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    // Prepare for save: ensure all content is in correct format (stringified JSON for now to ensure compatibility)
    const payload = { ...article };
    
    const { error } = await supabase
      .from(DB_TABLES.ARTICLES)
      .upsert(payload);

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

  const updateField = (lang: LanguageCode, field: string, value: any) => {
    setArticle((prev: any) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  const toggleMode = () => {
    const newMode = editorMode === "text" ? "blocks" : "text";
    setEditorMode(newMode);
    
    // Convert current content
    if (newMode === "blocks") {
      updateField(activeTab, "content", stringToBlocks(article.content[activeTab]));
    } else {
      // Very crude back-conversion to text
      const blocks = article.content[activeTab] as ContentBlock[];
      if (Array.isArray(blocks)) {
         const text = blocks.map(b => b.body || "").join("\n\n");
         updateField(activeTab, "content", text);
      }
    }
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
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien transition-all font-bold text-sm"
          >
            Mode: {editorMode === "text" ? "Markdown" : "Blocs"}
          </button>

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
                {editorMode === "text" ? (
                  <textarea 
                    value={typeof article.content[activeTab] === 'string' ? article.content[activeTab] : JSON.stringify(article.content[activeTab])}
                    onChange={(e) => updateField(activeTab, "content", e.target.value)}
                    className="w-full bg-[#050C09] border border-white/5 rounded-[2rem] p-8 outline-none focus:border-white/20 transition-all font-body leading-relaxed h-[400px] resize-none"
                    placeholder="Laissez parler les ancêtres..."
                  />
                ) : (
                  <BlockEditor 
                    blocks={Array.isArray(article.content[activeTab]) ? article.content[activeTab] : stringToBlocks(article.content[activeTab])}
                    onChange={(blocks) => updateField(activeTab, "content", blocks)}
                  />
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
