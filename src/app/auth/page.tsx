"use client";

import React, { useState } from "react";
import { supabase } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const AuthPage = () => {
  const { t } = useLanguage();
  const { user, connectionError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setMessage(null);
    setSignupSuccess(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log(`Starting ${isSignUp ? "SignUp" : "SignIn"} process...`);

    const { data, error } = isSignUp 
      ? await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: fullName }
          }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Auth error:", error.message);
      setMessage({ type: "error", text: error.message });
    } else {
      console.log("Auth success:", data);
      if (isSignUp) {
        setSignupSuccess(true);
      } else {
        setMessage({ type: "success", text: t("nav.login") + "..." });
      }
    }
    setLoading(false);
  };

  return (
    <main className="grain-overlay min-h-[100dvh] bg-foret-nocturne flex flex-col overflow-hidden">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md p-1 rounded-[2.5rem] relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(242, 238, 221, 0.1) 0%, transparent 100%)",
            border: "1px solid rgba(242, 238, 221, 0.05)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="bg-[#0A1F15]/90 p-10 rounded-[2.4rem] space-y-8 relative z-10">
            <AnimatePresence mode="wait">
              {signupSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 text-center"
                >
                  <div className="w-20 h-20 bg-or-ancestral/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-or-ancestral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl font-bold text-ivoire-ancien">
                      {t("auth.signupSuccessTitle")}
                    </h2>
                    <p className="text-ivoire-ancien/60 text-sm leading-relaxed">
                      {t("auth.signupSuccessMessage")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSignupSuccess(false)}
                    className="w-full py-4 rounded-xl font-bold bg-ivoire-ancien text-foret-nocturne hover:bg-white transition-all transform active:scale-95"
                  >
                    {t("auth.signupSuccessAction")}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={isSignUp ? "signup" : "login"}
                  initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-8"
                >
                <div className="text-center space-y-2">
                  <span className="eyebrow block" style={{ color: "var(--or-ancestral)" }}>
                    {isSignUp ? "Nouveau Cycle" : "Sanctuaire Numérique"}
                  </span>
                  <h1 className="font-display text-3xl font-bold text-ivoire-ancien">
                    {isSignUp ? "Créer un Compte" : "Se Connecter"}
                  </h1>
                </div>

                {connectionError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                  >
                    <p className="font-bold mb-1">⚠️ Rupture de liaison</p>
                    {connectionError}
                  </motion.div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                  {isSignUp && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-mono uppercase tracking-widest opacity-40 ml-4">
                        Nom Complet
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-or-ancestral/50 outline-none transition-all text-ivoire-ancien"
                        placeholder="Jean Sakata"
                        required={isSignUp}
                      />
                    </motion.div>
                  )}

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
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl text-sm ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}
                    >
                      {message.text}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98] relative overflow-hidden"
                    style={{
                      background: isSignUp ? "var(--ivoire-ancien)" : "var(--or-ancestral)",
                      color: "var(--foret-nocturne)",
                      opacity: loading ? 0.7 : 1,
                      boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)"
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Murmure aux anciens...
                      </span>
                    ) : (isSignUp ? "Rejoindre le Sanctuaire" : "Entrer dans le Sanctuaire")}
                  </button>
                </form>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="w-full text-xs font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span>{isSignUp ? "Déjà un gardien ?" : "Nouveau venu ?"}</span>
                      <span className="text-or-ancestral font-bold">{isSignUp ? "Se connecter" : "S'inscrire"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center pt-8 border-t border-white/5">
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
