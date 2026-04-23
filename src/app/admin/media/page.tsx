"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Search, Filter, Trash2, ExternalLink, Grid, List, Plus, Download, X, Copy, Check, Loader2 } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  metadata: {
    size: number;
    mimetype: string;
    lastModified: string;
  };
  created_at: string;
  url: string;
}

const MediaLibraryPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (Array.isArray(data)) setMediaItems(data);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (res.ok) await fetchMedia();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce média ? Cette action est irréversible.")) return;

    try {
      const res = await fetch(`/api/admin/media?fileName=${fileName}`, {
        method: "DELETE",
      });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Archives Visuelles</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Médiathèque</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white/10 text-or-ancestral" : "opacity-40"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-white/10 text-or-ancestral" : "opacity-40"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-or-ancestral text-foret-nocturne rounded-full text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-or-ancestral/10 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? "Transfert..." : "Ajouter" }
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un média par nom..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-or-ancestral/20 border-t-or-ancestral rounded-full mb-4" />
          <p className="text-or-ancestral font-mono tracking-widest uppercase text-xs">Ouverture des coffres...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <ImageIcon className="w-12 h-12 opacity-10 mx-auto mb-4" />
          <p className="opacity-40 italic">Aucun média trouvé.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id}
                  className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10"
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-foret-nocturne via-foret-nocturne/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-xs font-bold truncate text-ivoire-ancien">{item.name}</p>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">
                      {formatSize(item.metadata?.size || 0)} • {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => copyToClipboard(item.url, item.id)}
                          title="Copier le lien"
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-or-ancestral hover:text-foret-nocturne transition-all"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(item.name)}
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-widest opacity-40">Média</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-widest opacity-40">Taille</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-widest opacity-40">Date</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold tracking-widest opacity-40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(item => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-8 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/20 overflow-hidden flex-shrink-0 border border-white/5">
                          <img src={item.url} alt="" className="w-full h-full object-cover opacity-60" />
                        </div>
                        <span className="text-sm font-bold text-ivoire-ancien">{item.name}</span>
                      </td>
                      <td className="px-8 py-4 text-xs opacity-60 font-mono">{formatSize(item.metadata?.size || 0)}</td>
                      <td className="px-8 py-4 text-xs opacity-60">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => copyToClipboard(item.url, item.id)} className="p-2 opacity-40 hover:opacity-100 transition-all">
                              {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                           </button>
                           <button onClick={() => handleDelete(item.name)} className="p-2 opacity-40 hover:text-red-400 hover:opacity-100 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MediaLibraryPage;
