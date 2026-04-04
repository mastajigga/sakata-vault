"use client";

import React, { useState } from "react";
import { supabase } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const AuthPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      if (isSignUp) {
        setMessage({ type: "success", text: "Compte créé ! Vérifiez vos emails (ou essayez de vous connecter si la confirmation est désactivée)." });
      } else {
        setMessage({ type: "success", text: "Connexion réussie ! Redirection..." });
      }
    }
    setLoading(false);
  };

  return (
    <main className="grain-overlay min-h-screen bg-foret-nocturne flex flex-col">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md p-1 rounded-[2.5rem]"
          style={{
            background: "linear-gradient(135deg, rgba(242, 238, 221, 0.1) 0%, transparent 100%)",
            border: "1px solid rgba(242, 238, 221, 0.05)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="bg-[#0A1F15]/80 p-10 rounded-[2.4rem] space-y-8">
            <div className="text-center space-y-2">
              <span className="eyebrow block" style={{ color: "var(--or-ancestral)" }}>
                Sanctuaire Numérique
              </span>
              <h1 className="font-display text-3xl font-bold text-ivoire-ancien">
                {isSignUp ? "Créer un Compte" : "Se Connecter"}
              </h1>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest opacity-40 ml-4">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-ivoire-ancien"
                  placeholder="nom@village.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest opacity-40 ml-4">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-ivoire-ancien"
                  placeholder="••••••••"
                  required
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                  {message.text}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                style={{
                  background: isSignUp ? "var(--ivoire-ancien)" : "var(--or-ancestral)",
                  color: "var(--foret-nocturne)",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)"
                }}
              >
                {loading ? "Murmure aux anciens..." : (isSignUp ? "Rejoindre le Sanctuaire" : "Entrer dans le Sanctuaire")}
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-xs font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                {isSignUp ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs opacity-40 leading-relaxed italic">
                &quot;Le savoir est une rivière, celui qui y puise doit d'abord s'incliner.&quot;
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default AuthPage;
