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

type SignupStep = "intro" | "identity" | "contact" | "security";

const STEP_ORDER: SignupStep[] = ["intro", "identity", "contact", "security"];

const AuthPage = () => {
  const { t } = useLanguage();
  const { user, connectionError } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState<SignupStep>("intro");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
    setValue,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const gender = watch("gender");

  React.useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setApiError(null);
    setSignupSuccess(false);
    setSignupStep("intro");
    reset();
  };

  const goNext = async () => {
    let fieldsToValidate: (keyof AuthFormData)[] = [];
    if (signupStep === "identity") fieldsToValidate = ["firstName", "lastName", "nickname", "username", "gender"];
    if (signupStep === "contact") fieldsToValidate = ["email", "address", "birthDate"];
    if (fieldsToValidate.length) {
      const ok = await trigger(fieldsToValidate);
      if (!ok) return;
      // Custom requireds
      if (signupStep === "identity" && !watch("gender")) {
        setApiError("Veuillez choisir votre genre");
        return;
      }
    }
    setApiError(null);
    const idx = STEP_ORDER.indexOf(signupStep);
    if (idx < STEP_ORDER.length - 1) setSignupStep(STEP_ORDER[idx + 1]);
  };

  const goBack = () => {
    setApiError(null);
    const idx = STEP_ORDER.indexOf(signupStep);
    if (idx > 0) setSignupStep(STEP_ORDER[idx - 1]);
  };

  const onSubmit = async (data: AuthFormData) => {
    if (isSignUp && signupStep !== "security") return;
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
                username: data.username,
                nickname: data.nickname,
                gender: data.gender,
                birth_date: data.birthDate || null,
                address: data.address || null,
              },
              emailRedirectTo: `${window.location.origin}/profil`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

      if (result.error) setApiError(result.error.message);
      else if (isSignUp) setSignupSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  // ==== STYLE HELPERS ====
  const inputClass = (hasError: boolean) =>
    `w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all text-ivoire-ancien text-sm ${
      hasError ? "border-red-500/50" : "border-white/10 focus:border-or-ancestral/50"
    }`;
  const labelClass = "text-[10px] font-mono uppercase tracking-widest opacity-40 ml-4";

  // ==== PROGRESS BAR ====
  const stepIndex = STEP_ORDER.indexOf(signupStep);
  const totalSteps = STEP_ORDER.length - 1; // exclude intro
  const progress = signupStep === "intro" ? 0 : (stepIndex / totalSteps) * 100;

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
                    onClick={() => { setSignupSuccess(false); toggleAuthMode(); }}
                    className="w-full py-4 rounded-xl font-bold bg-ivoire-ancien text-foret-nocturne hover:bg-white transition-all transform active:scale-95"
                  >
                    {t("auth.signupSuccessAction")}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={isSignUp ? `signup-${signupStep}` : "login"}
                  initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-7"
                >
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <span className="eyebrow block" style={{ color: "var(--or-ancestral)" }}>
                      {!isSignUp ? "Sanctuaire Numérique"
                        : signupStep === "intro" ? "Bienvenue"
                        : signupStep === "identity" ? "Étape 1 — Identité"
                        : signupStep === "contact" ? "Étape 2 — Contact"
                        : "Étape 3 — Sécurité"}
                    </span>
                    <h1 className="font-display text-3xl font-bold text-ivoire-ancien">
                      {!isSignUp ? "Se Connecter"
                        : signupStep === "intro" ? "Rejoindre le Sanctuaire"
                        : signupStep === "identity" ? "Qui êtes-vous ?"
                        : signupStep === "contact" ? "Comment vous joindre ?"
                        : "Protégez votre compte"}
                    </h1>
                  </div>

                  {/* Progress bar (signup only, not intro) */}
                  {isSignUp && signupStep !== "intro" && (
                    <div className="space-y-2">
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-or-ancestral"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-[9px] font-mono uppercase tracking-widest opacity-30 text-center">
                        {stepIndex} / {totalSteps}
                      </p>
                    </div>
                  )}

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

                  {/* === LOGIN === */}
                  {!isSignUp && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className={labelClass}>Email</label>
                        <input {...register("email")} type="email" className={inputClass(!!errors.email)} placeholder="nom@village.com" />
                        {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Mot de passe</label>
                        <input {...register("password")} type="password" className={inputClass(!!errors.password)} placeholder="••••••••" />
                        {errors.password && <p className="text-[10px] text-red-400">{errors.password.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                        style={{
                          background: "var(--or-ancestral)",
                          color: "var(--foret-nocturne)",
                          opacity: isLoading ? 0.7 : 1,
                          boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)",
                        }}
                      >
                        {isLoading ? "Murmure aux anciens..." : "Entrer dans le Sanctuaire"}
                      </button>
                    </form>
                  )}

                  {/* === SIGNUP — INTRO === */}
                  {isSignUp && signupStep === "intro" && (
                    <div className="space-y-6">
                      <div className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-or-ancestral">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="text-xs font-mono uppercase tracking-widest">Environ 2 minutes</p>
                        </div>
                        <p className="text-ivoire-ancien/70 text-sm leading-relaxed px-2">
                          Trois étapes seulement vous séparent du sanctuaire. Nous vous guiderons en douceur, comme on traverse la brume au lever du jour.
                        </p>
                      </div>
                      <ol className="space-y-3 text-sm text-ivoire-ancien/80">
                        {[
                          { n: "1", t: "Identité", d: "Votre nom, surnom & genre" },
                          { n: "2", t: "Contact", d: "Email, adresse, naissance" },
                          { n: "3", t: "Sécurité", d: "Choisir un mot de passe" },
                        ].map((s) => (
                          <li key={s.n} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                            <span className="w-7 h-7 flex-shrink-0 rounded-full bg-or-ancestral/20 text-or-ancestral text-xs font-bold flex items-center justify-center">{s.n}</span>
                            <div className="space-y-0.5">
                              <p className="font-bold text-ivoire-ancien">{s.t}</p>
                              <p className="text-[11px] text-ivoire-ancien/50">{s.d}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                      <button
                        onClick={goNext}
                        className="w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                        style={{ background: "var(--or-ancestral)", color: "var(--foret-nocturne)", boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)" }}
                      >
                        Commencer le voyage
                      </button>
                    </div>
                  )}

                  {/* === SIGNUP — IDENTITY === */}
                  {isSignUp && signupStep === "identity" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={labelClass}>Prénom</label>
                          <input {...register("firstName")} type="text" className={inputClass(!!errors.firstName)} placeholder="Jean" />
                          {errors.firstName && <p className="text-[10px] text-red-400">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>Nom</label>
                          <input {...register("lastName")} type="text" className={inputClass(!!errors.lastName)} placeholder="Sakata" />
                          {errors.lastName && <p className="text-[10px] text-red-400">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Surnom <span className="text-or-ancestral/60">(affiché en grand)</span></label>
                        <input {...register("nickname")} type="text" className={inputClass(!!errors.nickname)} placeholder="Jean le Sage" />
                        {errors.nickname && <p className="text-[10px] text-red-400">{errors.nickname.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Nom d'utilisateur <span className="text-red-400/60">(unique, définitif)</span></label>
                        <input {...register("username")} type="text" className={inputClass(!!errors.username)} placeholder="jean_sakata" />
                        {errors.username && <p className="text-[10px] text-red-400">{errors.username.message}</p>}
                      </div>

                      <div className="space-y-3">
                        <label className={labelClass}>Genre</label>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            { v: "male", label: "Homme", img: "/images/avatar-male.svg" },
                            { v: "female", label: "Femme", img: "/images/avatar-female.svg" },
                          ] as const).map((opt) => {
                            const selected = gender === opt.v;
                            return (
                              <button
                                key={opt.v}
                                type="button"
                                onClick={() => setValue("gender", opt.v, { shouldValidate: true })}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                                  selected
                                    ? "border-or-ancestral bg-or-ancestral/10"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                }`}
                              >
                                <div className={`w-16 h-16 rounded-full overflow-hidden transition-all ${selected ? "ring-2 ring-or-ancestral" : ""}`}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-xs font-mono uppercase tracking-widest ${selected ? "text-or-ancestral" : "text-ivoire-ancien/60"}`}>
                                  {opt.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-ivoire-ancien/30 text-center">Une image par défaut sera attribuée selon votre choix.</p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={goBack} className="px-6 py-4 rounded-2xl text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border border-white/10">
                          Retour
                        </button>
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex-1 py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                          style={{ background: "var(--or-ancestral)", color: "var(--foret-nocturne)" }}
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* === SIGNUP — CONTACT === */}
                  {isSignUp && signupStep === "contact" && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className={labelClass}>Email</label>
                        <input {...register("email")} type="email" className={inputClass(!!errors.email)} placeholder="nom@village.com" />
                        {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Adresse <span className="opacity-50">(facultatif)</span></label>
                        <input {...register("address")} type="text" className={inputClass(!!errors.address)} placeholder="Kinshasa, RDC" />
                        {errors.address && <p className="text-[10px] text-red-400">{errors.address.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Date de naissance <span className="opacity-50">(facultatif)</span></label>
                        <input
                          {...register("birthDate")}
                          type="date"
                          className={`${inputClass(!!errors.birthDate)} [color-scheme:dark]`}
                        />
                        {errors.birthDate && <p className="text-[10px] text-red-400">{errors.birthDate.message}</p>}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={goBack} className="px-6 py-4 rounded-2xl text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border border-white/10">
                          Retour
                        </button>
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex-1 py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                          style={{ background: "var(--or-ancestral)", color: "var(--foret-nocturne)" }}
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* === SIGNUP — SECURITY === */}
                  {isSignUp && signupStep === "security" && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="space-y-2">
                        <label className={labelClass}>Mot de passe</label>
                        <input {...register("password")} type="password" className={inputClass(!!errors.password)} placeholder="••••••••" />
                        {errors.password && <p className="text-[10px] text-red-400">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Confirmer le mot de passe</label>
                        <input {...register("confirmPassword")} type="password" className={inputClass(!!errors.confirmPassword)} placeholder="••••••••" />
                        {errors.confirmPassword && <p className="text-[10px] text-red-400">{errors.confirmPassword.message}</p>}
                      </div>

                      <p className="text-[10px] text-ivoire-ancien/40 ml-4 leading-relaxed">
                        Choisissez un mot de passe d'au moins 8 caractères. Saisissez-le deux fois pour éviter toute faute de frappe.
                      </p>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={goBack} disabled={isLoading} className="px-6 py-4 rounded-2xl text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border border-white/10">
                          Retour
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
                          style={{
                            background: "var(--ivoire-ancien)",
                            color: "var(--foret-nocturne)",
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)",
                          }}
                        >
                          {isLoading ? "Murmure aux anciens..." : "Rejoindre le Sanctuaire"}
                        </button>
                      </div>
                    </form>
                  )}

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
