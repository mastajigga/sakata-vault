"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Cpu, Zap, RefreshCw, AudioLines, Search, Database, Send, Bot, User, Volume2, Wand2, History, Loader2, Check, ExternalLink } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
  sources?: { title: string; namespace: string; score: number }[];
}

const AIOrchestrationPage = () => {
  const [isIndexing, setIsIndexing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const stats = [
    { name: "Vecteurs Pinecone", value: "1,520+", icon: Database, color: "text-or-ancestral" },
    { name: "Narrations Audio", value: "42", icon: AudioLines, color: "text-emerald-400" },
    { name: "Modèle", value: "Gemini 1.5 Pro", icon: Brain, color: "text-blue-400" },
    { name: "Latence Moyenne", value: "1.2s", icon: Zap, color: "text-amber-400" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleReindex = () => {
    setIsIndexing(true);
    setTimeout(() => setIsIndexing(false), 3000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.content }] 
      }));

      const res = await fetch("/api/admin/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = { 
        role: "model", 
        content: data.answer,
        sources: data.sources
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateVoice = async () => {
     setIsGeneratingVoice(true);
     try {
        const res = await fetch("/api/admin/ai/voice", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ 
              text: "Bienvenue dans le sanctuaire des Sakata. Je suis le Vieux Sage, gardien de nos traditions et de notre mémoire collective.",
              voice: "Puck" 
           }),
        });

        const data = await res.json();
        if (data.audioUrl) {
           const audio = new Audio(data.audioUrl);
           audio.play();
        } else {
           alert("Erreur de synthèse : " + (data.error || "Inconnue"));
        }
     } catch (err) {
        console.error("Voice error:", err);
     } finally {
        setIsGeneratingVoice(false);
     }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Intelligence Artificielle</span>
          <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Orchestration du Vieux Sage</h1>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTÈME OPÉRATIONNEL
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-or-ancestral/30 transition-all cursor-default"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{stat.name}</p>
            <p className="text-2xl font-mono font-bold text-ivoire-ancien mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chat Interface */}
        <div className="xl:col-span-2 space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-or-ancestral/10 flex items-center justify-center text-or-ancestral">
                       <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-display text-lg font-bold">Dialogue Sémantique</h3>
                       <p className="text-[10px] opacity-40 uppercase tracking-widest">Requêtes Mémoire Pinecone</p>
                    </div>
                 </div>
                 <button onClick={() => setMessages([])} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                    <History className="w-4 h-4" />
                 </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide">
                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                       <Bot className="w-12 h-12" />
                       <div>
                          <p className="text-sm italic">"Posez-moi une question sur les secrets de Lemvia."</p>
                          <p className="text-[10px] uppercase tracking-widest mt-2">Le Vieux Sage vous écoute...</p>
                       </div>
                    </div>
                 ) : (
                    messages.map((msg, i) => (
                       <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={i}
                          className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                       >
                          <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-white/10" : "bg-or-ancestral/20 text-or-ancestral"}`}>
                             {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`max-w-[80%] space-y-4`}>
                             <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === "user" ? "bg-white/5 border border-white/10 rounded-tr-none" : "bg-white/10 rounded-tl-none text-ivoire-ancien"}`}>
                                {msg.content}
                             </div>
                             {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                   {msg.sources.map((src, j) => (
                                      <div key={j} className="px-3 py-1.5 rounded-full bg-black/20 border border-white/5 text-[10px] flex items-center gap-2 group cursor-pointer hover:border-or-ancestral/50 transition-colors">
                                         <Search className="w-3 h-3 opacity-40 group-hover:text-or-ancestral" />
                                         <span className="opacity-60">{src.title}</span>
                                         <span className="font-mono text-[8px] text-or-ancestral">{(src.score * 100).toFixed(0)}%</span>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>
                       </motion.div>
                    ))
                 )}
                 {isTyping && (
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-or-ancestral/20 flex items-center justify-center text-or-ancestral animate-pulse">
                          <Bot className="w-4 h-4" />
                       </div>
                       <div className="p-4 rounded-2xl bg-white/5 animate-pulse flex gap-2">
                          <div className="w-1.5 h-1.5 bg-or-ancestral rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-or-ancestral rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-or-ancestral rounded-full animate-bounce [animation-delay:0.4s]" />
                       </div>
                    </div>
                 )}
                 <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="mt-8 relative">
                 <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Interroger la mémoire collective..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-5 focus:border-or-ancestral/50 outline-none transition-all text-sm backdrop-blur-xl"
                 />
                 <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-or-ancestral text-foret-nocturne rounded-xl hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
           {/* Pinecone Health */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6"
           >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Database className="w-5 h-5 text-or-ancestral" />
                   <h3 className="font-display font-bold">Mémoire Pinecone</h3>
                </div>
                <button 
                  onClick={handleReindex}
                  disabled={isIndexing}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                  title="Réindexer"
                >
                   <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
                </button>
             </div>
             
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                   <span>Index : sakata-primary</span>
                   <span className="text-emerald-400 underline decoration-dotted">Synchronisé</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-or-ancestral w-3/4 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                </div>
                <div className="flex justify-between text-[8px] opacity-40 font-mono">
                   <span>1,524 Vecteurs</span>
                   <span>75% Capacity</span>
                </div>
             </div>
           </motion.div>

           {/* Voice Preview System */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6"
           >
              <div className="flex items-center gap-3">
                 <AudioLines className="w-5 h-5 text-emerald-400" />
                 <h3 className="font-display font-bold">Voix Gemini 3.1</h3>
              </div>

              <p className="text-xs opacity-60 leading-relaxed">
                 Générez des narrations automatiques avec la fidélité multimodale de Gemini 1.5 Pro.
              </p>

              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-[10px] font-bold text-center">Sage Sakata</div>
                 <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-[10px] font-bold text-center opacity-40">Griot (Prévu)</div>
              </div>

              <button 
                onClick={handleGenerateVoice}
                disabled={isGeneratingVoice}
                className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                 {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> }
                 {isGeneratingVoice ? "Synthèse vocale..." : "Tester la voix Gemini"}
              </button>
           </motion.div>

           {/* Orchestration Logs */}
           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                 <Cpu className="w-5 h-5 text-blue-400" />
                 <h3 className="font-display font-bold">Orchestration</h3>
              </div>
              <div className="space-y-4 font-mono text-[9px] opacity-40">
                 {[
                    { time: "23:26:01", msg: "Pinecone query success" },
                    { time: "23:25:45", msg: "Gemini embedding generated" },
                    { time: "23:24:12", msg: "User session validated" },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-3">
                       <span className="text-or-ancestral">{log.time}</span>
                       <span>{log.msg}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIOrchestrationPage;
