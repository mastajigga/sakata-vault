"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { authSchema, type AuthFormData } from "@/lib/schemas/validation";

const AuthPage = () => {
  const { t } = useLanguage();
  const { user, connectionError } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setApiError(null);
    setSignupSuccess(false);
    reset();
  };

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = isSignUp
        ? await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                first_name: data.firstName || "",
                last_name: data.lastName || "",
                full_name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
              },
              emailRedirectTo: `${window.location.origin}/profil`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

      if (result.error) {
        setApiError(result.error.message);
      } else if (isSignUp) {
        setSignupSuccess(true);
      }
    } catch (err: any) {
      setApiError(err?.message || "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grain-overlay min-h-[100dvh] bg-foret-nocturne flex flex-col overflow-hidden">
      
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
          <div className="bg-[var(--foret-nocturne)]/90 p-10 rounded-[2.4rem] space-y-8 relative z-10">
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

                {(connectionError || apiError) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                  >
                    <p className="font-bold mb-1">⚠️ Erreur</p>
                    {connectionError || apiError}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-40 ml-4">
                          Prénom
                        </label>
                        <input
                          {...register("firstName")}
                          type="text"
                          className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all text-ivoire-ancien text-sm ${
                            errors.firstName ? "border-red-500/50" : "border-white/10 focus:border-or-ancestral/50"
                          }`}
                          placeholder="Jean"
                        />
                        {errors.firstName && <p className="text-[10px] text-red-400">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest opacity-40 ml-4">
                          Nom
                        </label>
                        <input
                          {...register("lastName")}
                          type="text"
                          className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all text-ivoire-ancien text-sm ${
                            errors.lastName ? "border-red-500/50" : "border-white/10 focus:border-or-ancestral/50"
                          }`}
                          placeholder="Sakata"
                        />
                        {errors.lastName && <p className="text-[10px] text-red-400">{errors.lastName.message}</p>}
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest opacity-40 ml-4">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all text-ivoire-ancien ${
                        errors.email ? "border-red-500/50" : "border-white/10 focus:border-or-ancestral/50"
                      }`}
                      placeholder="nom@village.com"
                    />
                    {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest opacity-40 ml-4">
                      Mot de passe
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      className={`w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all text-ivoire-ancien ${
                        errors.password ? "border-red-500/50" : "border-white/10 focus:border-or-ancestral/50"
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-[10px] text-red-400">{errors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98] relative overflow-hidden"
                    style={{
                      background: isSignUp ? "var(--ivoire-ancien)" : "var(--or-ancestral)",
                      color: "var(--foret-nocturne)",
                      opacity: (isLoading || !isDirty) ? 0.7 : 1,
                      cursor: (isLoading || !isDirty) ? "not-allowed" : "pointer",
                      boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)",
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Murmure aux anciens...
                      </span>
                    ) : isSignUp
                      ? "Rejoindre le Sanctuaire"
                      : "Entrer dans le Sanctuaire"}
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
