"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ShieldAlert, Flag, Trash2, Ban, CheckCircle2, UserX, Clock } from "lucide-react";

const ForumModerationPage = () => {
  const [activeTab, setActiveTab] = useState<"reports" | "recent">("reports");

  const reports = [
    { id: 1, user: "KongoLover42", content: "Ceci est un test de message signalé pour voir comment l'admin réagit.", reason: "Spam", date: "Il y a 10 min" },
    { id: 2, user: "Anonyme", content: "Vente de produits suspects ici lien.com", reason: "Publicité interdite", date: "Il y a 1h" },
  ];

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Mboka</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Modération du Forum</h1>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           <button 
             onClick={() => setActiveTab("reports")}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "reports" ? "bg-red-500/20 text-red-400" : "opacity-40"}`}
           >
             Signalements ({reports.length})
           </button>
           <button 
             onClick={() => setActiveTab("recent")}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "recent" ? "bg-white/10 text-ivoire-ancien" : "opacity-40"}`}
           >
             Activité Récente
           </button>
        </div>
      </header>

      {/* Reports Section */}
      <div className="space-y-6">
        {activeTab === "reports" ? (
          reports.map((report, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={report.id}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-400">
                <Flag className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-ivoire-ancien">{report.user}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{report.reason}</span>
                    <span className="text-xs opacity-40 flex items-center gap-1"><Clock className="w-3 h-3" /> {report.date}</span>
                 </div>
                 <p className="text-sm opacity-60 italic">"{report.content}"</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                 <button className="flex-1 md:flex-none p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/10 group">
                    <CheckCircle2 className="w-5 h-5 mx-auto group-hover:scale-110" />
                 </button>
                 <button className="flex-1 md:flex-none p-4 rounded-2xl bg-white/5 text-ivoire-ancien/40 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 group">
                    <Trash2 className="w-5 h-5 mx-auto group-hover:scale-110" />
                 </button>
                 <button className="flex-1 md:flex-none p-4 rounded-2xl bg-white/5 text-ivoire-ancien/40 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 group">
                    <UserX className="w-5 h-5 mx-auto group-hover:scale-110" />
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="opacity-40 italic">Flux d'activité en temps réel activé.</p>
          </div>
        )}
      </div>

      {/* Moderation Rules Sidebar could go here or bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] bg-or-ancestral text-foret-nocturne"
      >
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="font-display text-xl font-bold">Rappel de la Charte</h3>
        </div>
        <p className="text-sm font-medium leading-relaxed opacity-80">
          La place du village (Mboka) est un lieu sacré d'échange. Toute parole portant atteinte à la dignité des ancêtres, à la paix de la communauté ou propageant des mensonges doit être purifiée avec fermeté et sagesse.
        </p>
      </motion.div>
    </div>
  );
};

export default ForumModerationPage;
