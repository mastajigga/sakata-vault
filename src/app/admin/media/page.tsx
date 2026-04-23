"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Search, Filter, Trash2, ExternalLink, Grid, List, Download } from "lucide-react";

const MediaLibraryPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const mediaItems = [
    { id: 1, name: "sakata_mask_detail.png", type: "Image", size: "1.2 MB", date: "23/04/2026", url: "/images/sakata_mask_detail.png" },
    { id: 2, name: "village_ritual.jpg", type: "Image", size: "2.4 MB", date: "22/04/2026", url: "/images/hero-bg.jpg" },
    { id: 3, name: "river_mist.png", type: "Image", size: "800 KB", date: "21/04/2026", url: "/images/sakata_mask_detail.png" },
  ];

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Archives Visuelles</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Médiathèque</h1>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
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
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input 
            type="text" 
            placeholder="Rechercher un média par nom ou tag..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" /> Filtres
        </button>
      </div>

      {/* Media Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/10"
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-foret-nocturne via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <p className="text-xs font-bold truncate">{item.name}</p>
                 <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{item.size} • {item.date}</p>
                 
                 <div className="flex gap-2 mt-4">
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-or-ancestral hover:text-foret-nocturne transition-colors">
                       <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}

          {/* Add Placeholder for "Upload" */}
          <button className="aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-or-ancestral/50 transition-all group">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-colors">
                <ImageIcon className="w-6 h-6" />
             </div>
             <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Ajouter Média</p>
          </button>
        </div>
      ) : (
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40">Média</th>
                    <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40">Taille</th>
                    <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40">Date</th>
                    <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {mediaItems.map(item => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                       <td className="px-8 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-black/20 flex-shrink-0" />
                          <span className="text-sm font-bold">{item.name}</span>
                       </td>
                       <td className="px-8 py-4 text-xs opacity-60 font-mono">{item.size}</td>
                       <td className="px-8 py-4 text-xs opacity-60">{item.date}</td>
                       <td className="px-8 py-4 text-right">
                          <button className="p-2 opacity-40 hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
