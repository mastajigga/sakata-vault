"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, HelpCircle, Sparkles, AudioLines, Library, 
  Layers, MessageSquare, Shield, Zap
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminHelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-or-ancestral text-foret-nocturne shadow-[0_0_30px_rgba(193,107,52,0.4)] hover:scale-110 transition-all z-40 group"
      >
        <HelpCircle className="w-6 h-6" />
        <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-foret-nocturne border border-white/10 text-[10px] font-bold text-ivoire-ancien opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          GUIDE DE L'ADMINISTRATEUR
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-foret-nocturne/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh]"
            >
              {/* Left Side: Navigation */}
              <div className="w-full md:w-64 bg-black/40 p-8 border-r border-white/5 space-y-8">
                 <div className="flex items-center gap-3 text-or-ancestral">
                    <Shield className="w-5 h-5" />
                    <span className="font-display font-bold text-lg">Sakata Help</span>
                 </div>
                 
                 <nav className="space-y-1">
                    <button className="w-full text-left p-3 rounded-xl bg-white/5 text-ivoire-ancien text-sm font-bold flex items-center gap-3">
                       <Zap className="w-4 h-4 text-orange-400" /> V3.1 Orchestration
                    </button>
                    <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-ivoire-ancien/40 text-sm font-bold flex items-center gap-3 transition-colors">
                       <MessageSquare className="w-4 h-4" /> Modération
                    </button>
                    <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-ivoire-ancien/40 text-sm font-bold flex items-center gap-3 transition-colors">
                       <Library className="w-4 h-4" /> Archivage
                    </button>
                 </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-12 overflow-y-auto space-y-12">
                 <header className="flex items-start justify-between">
                    <div className="space-y-4">
                       <h2 className="font-display text-4xl font-bold text-ivoire-ancien">Orchestration IA V3.1</h2>
                       <p className="text-ivoire-ancien/60 leading-relaxed max-w-xl">
                          Bienvenue dans la nouvelle ère du Hub Digital Sakata. Ces outils vous permettent d'automatiser et d'enrichir le contenu ancestral via l'intelligence artificielle.
                       </p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full opacity-40 hover:opacity-100 transition-all">
                       <X className="w-6 h-6" />
                    </button>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-orange-500/5 hover:border-orange-500/20 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                          <AudioLines className="w-6 h-6" />
                       </div>
                       <h4 className="font-bold text-lg">Narration Automatique</h4>
                       <p className="text-sm text-ivoire-ancien/40 leading-relaxed">
                          Dans l'éditeur d'article, cliquez sur **"Auto Voix"**. Le système utilisera Gemini Voice Preview pour générer une narration vocale premium basée sur votre texte.
                       </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-blue-500/5 hover:border-blue-500/20 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                          <Sparkles className="w-6 h-6" />
                       </div>
                       <h4 className="font-bold text-lg">Recherche Sémantique</h4>
                       <p className="text-sm text-ivoire-ancien/40 leading-relaxed">
                          Utilisez le menu **"Orchestration IA"** pour discuter directement avec votre base de données vectorielle (Pinecone). Posez vos questions sur la culture Sakata.
                       </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                          <Layers className="w-6 h-6" />
                       </div>
                       <h4 className="font-bold text-lg">Structure & Blocs</h4>
                       <p className="text-sm text-ivoire-ancien/40 leading-relaxed">
                          Le nouvel éditeur par blocs vous permet de voir la structure de votre récit en temps réel. Utilisez la barre latérale pour reordonner vos idées.
                       </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-or-ancestral/5 hover:border-or-ancestral/20 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-or-ancestral/10 flex items-center justify-center text-or-ancestral mb-4">
                          <Library className="w-6 h-6" />
                       </div>
                       <h4 className="font-bold text-lg">Médiathèque Intégrée</h4>
                       <p className="text-sm text-ivoire-ancien/40 leading-relaxed">
                          Accédez à tous vos médias directement dans l'éditeur. Glissez-les sur les côtés via l'option **"SIDE"** pour des mises en page plus complexes.
                       </p>
                    </div>
                 </div>

                 <footer className="pt-8 border-t border-white/5">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 flex items-center gap-4">
                       <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                       <p className="text-xs text-emerald-400 leading-relaxed">
                          **Astuce de Sage :** Sauvegardez toujours vos changements avant de générer une voix pour que l'IA utilise la version la plus récente de votre texte.
                       </p>
                    </div>
                 </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
