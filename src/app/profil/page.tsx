"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/schemas/validation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { ContributorBadge } from "@/components/badges/ContributorBadge";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import { ROUTES } from "@/lib/constants/routes";
import { DB_TABLES, DB_BUCKETS } from "@/lib/constants/db";
import Link from "next/link";
import { resolveStorageUrl } from "@/lib/supabase/storage-utils";
import { MemberImage } from "@/components/MemberImage";
import {
  User,
  Mail,
  MapPin,
  AlignLeft,
  AtSign,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronLeft,
  LayoutDashboard,
  ImagePlus,
  Loader2,
  Globe,
  Lock,
  Trash2,
  Plus,
  Bell,
  BellOff
} from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

type ProfileFormData = {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  username?: string;
  bio?: string;
  location?: string;
};

const ProfilePage = () => {
  const { user, role, subscriptionTier, isLoading: authLoading } = useAuth() as any;
  const { t } = useLanguage();
  const { isSupported: pushSupported, isSubscribed: pushSubscribed, isLoading: pushLoading, subscribe: subscribePush, unsubscribe: unsubscribePush } = usePushNotifications();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const nickname = watch("nickname");
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  
  const [contributorStatus, setContributorStatus] = useState<string>("none");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subEndDate, setSubEndDate] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyage du timer success à l'unmount
  useEffect(() => () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); }, []);

  // Gallery Context
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [uploadVisibility, setUploadVisibility] = useState<string>("public");
  const [galleryUploading, setGalleryUploading] = useState(false);

  useEffect(() => {
    if (user) {
      let mounted = true;
      const fetchProfile = async () => {
        // Safety timeout
        const safetyTimeout = setTimeout(() => {
          if (mounted) {
            console.warn("[Profile] Fetch timeout (>8s).");
            setApiError("Délai d'attente dépassé lors du chargement de votre profil.");
          }
        }, 8000);

        try {
          const { data, error } = await supabase
            .from(DB_TABLES.PROFILES)
            .select("*")
            .eq("id", user.id)
            .single();

          if (!mounted) return;

          if (data) {
            reset({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              nickname: data.nickname || "",
              username: data.username || "",
              bio: data.bio || "",
              location: data.location || "",
            });
            setContributorStatus(data.contributor_status || "none");
            setAvatarUrl(data.avatar_url || null);
            setSubStatus(data.subscription_status || null);
            setSubEndDate(data.subscription_end_date || null);
          }
        } catch (err) {
          if (mounted) console.error("Error fetching profile:", err);
        } finally {
          if (mounted) clearTimeout(safetyTimeout);
        }
      };

      const fetchGallery = async () => {
        try {
          const { data, error } = await supabase
            .from(DB_TABLES.PROFILE_GALLERY)
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (mounted && data && !error) setGalleryItems(data);
        } catch (err) {
          if (mounted) console.error("Error fetching gallery:", err);
        }
      };

      fetchProfile();
      fetchGallery();

      return () => { mounted = false; };
    }
  }, [user, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setApiError(null);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/${Math.random()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from(DB_TABLES.PROFILES)
        .update({ avatar_url: publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (formData: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    setApiError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from(DB_TABLES.PROFILES)
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setApiError(updateError.message);
    } else {
      setSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleRequestContributor = async () => {
    if (!user || contributorStatus !== "none") return;

    setLoading(true);
    const { error: updateError } = await supabase
      .from(DB_TABLES.PROFILES)
      .update({
        contributor_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setApiError(updateError.message);
    } else {
      setContributorStatus("pending");
      setSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handlePortal = async () => {
    if (!user) return;
    try {
      setPortalLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erreur lors de l'ouverture du portail.");
    } catch {
      alert("Erreur de connexion au portail Stripe.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    try {
      setGalleryUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from(DB_TABLES.USER_GALLERY)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(DB_TABLES.USER_GALLERY)
        .getPublicUrl(filePath);

      let determinedType = 'image';
      if (file.type.startsWith('video/')) determinedType = 'video';
      else if (file.type === 'application/pdf') determinedType = 'pdf';

      const { error: dbError, data: insertedData } = await supabase
        .from(DB_TABLES.PROFILE_GALLERY)
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_type: determinedType,
          visibility: uploadVisibility
        })
        .select()
        .single();

      if (dbError) throw dbError;
      if (insertedData) {
        setGalleryItems(prev => [insertedData, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Erreur lors de l'envoi du fichier.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, fileUrl: string) => {
    if (!user) return;
    try {
      // Opt: Delete from storage bucket if desired. Since path is publicUrl, extracting path requires regex.
      // Skipping bucket deletion for brevity, just DB deletion for now.
      const { error } = await supabase.from(DB_TABLES.PROFILE_GALLERY).delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return (
    <main className="min-h-[100dvh] bg-foret-nocturne pt-32 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto w-full">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-56 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="h-32 bg-white/5 rounded-2xl" />
        </div>
      </div>
    </main>
  );

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-foret-nocturne flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display text-or-ancestral mb-4">Accès Interdit</h1>
          <p className="text-ivoire-ancien/60 mb-6">Veuillez vous connecter pour accéder à votre sanctuaire.</p>
          <a href="/auth" className="btn-primary">Connexion</a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-foret-nocturne">
      
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Navigation Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-ivoire-ancien/60 hover:text-or-ancestral transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          {role && ["admin", "manager", "contributor"].includes(role) && (
             <Link 
               href="/admin" 
               className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-or/20 bg-white/5 text-or-ancestral text-xs font-bold uppercase tracking-widest hover:bg-or/10 transition-all"
             >
               <LayoutDashboard className="w-4 h-4" />
               Centre de Commandement
             </Link>
          )}
        </motion.div>

        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-or-ancestral mb-2">
            {t("profile.title")}
          </h1>
          <p className="text-ivoire-ancien/60 max-w-2xl">
            {t("profile.subtitle")}
          </p>

          {/* Contributor Status Badge */}
          <div className="mt-4">
            <ContributorBadge
              status={contributorStatus as "approved" | "pending" | "rejected" | "none"}
              size="lg"
            />
          </div>
        </motion.div>

        {/* Layout with Bento-style sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Prénom
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input
                      {...register("first_name")}
                      type="text"
                      className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all ${
                        errors.first_name ? "border-red-500/50" : "border-white/10"
                      }`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  {errors.first_name && <p className="text-[10px] text-red-400">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Nom
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input
                      {...register("last_name")}
                      type="text"
                      className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all ${
                        errors.last_name ? "border-red-500/50" : "border-white/10"
                      }`}
                      placeholder="Votre nom"
                    />
                  </div>
                  {errors.last_name && <p className="text-[10px] text-red-400">{errors.last_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Surnom
                  </label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input
                      {...register("nickname")}
                      type="text"
                      className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all ${
                        errors.nickname ? "border-red-500/50" : "border-white/10"
                      }`}
                      placeholder="Surnom public"
                    />
                  </div>
                  {errors.nickname && <p className="text-[10px] text-red-400">{errors.nickname.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    {t("profile.username")}
                  </label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input
                      {...register("username")}
                      type="text"
                      className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all ${
                        errors.username ? "border-red-500/50" : "border-white/10"
                      }`}
                      placeholder="Nom d'esprit"
                    />
                  </div>
                  {errors.username && <p className="text-[10px] text-red-400">{errors.username.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                  {t("profile.location")}
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                  <input
                    {...register("location")}
                    type="text"
                    className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all ${
                      errors.location ? "border-red-500/50" : "border-white/10"
                    }`}
                    placeholder="Ville, Pays ou Territoire"
                  />
                </div>
                {errors.location && <p className="text-[10px] text-red-400">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                  {t("profile.bio")}
                </label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-6 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                  <textarea
                    {...register("bio")}
                    className={`w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all min-h-[120px] ${
                      errors.bio ? "border-red-500/50" : "border-white/10"
                    }`}
                    placeholder="Partagez quelques mots sur votre lien avec la culture Sakata..."
                  />
                </div>
                {errors.bio && <p className="text-[10px] text-red-400">{errors.bio.message}</p>}
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  {success && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-green-400 font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Parole enregistrée avec succès
                    </motion.span>
                  )}
                  {apiError && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-red-400 font-medium flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {apiError}
                    </motion.span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isDirty}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-or-ancestral text-foret-nocturne font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{ boxShadow: "0 0 20px rgba(181, 149, 81, 0.2)" }}
                >
                  <Save className="w-4 h-4" />
                  {t("profile.saveChanges")}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Sidebar Section: Status & Contributor Request */}
          <div className="space-y-6">
            
            {/* Account Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-or/20 p-1 bg-foret-nocturne relative z-10 shadow-2xl shadow-black/40 overflow-hidden">
                      <MemberImage profile={{ ...user, avatar_url: avatarUrl }} />
                    </div>
                  
                  <label 
                    className={`absolute bottom-0 right-0 p-2 rounded-full bg-or-ancestral text-foret-nocturne cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Changer d'image"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4" />
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploading}
                    />
                  </label>
                </div>
                <h3 className="text-lg font-display text-ivoire-ancien font-bold mb-1">
                  {nickname || (firstName ? `${firstName} ${lastName}` : user.email?.split("@")[0])}
                </h3>
                <div className="flex items-center gap-1.5 text-ivoire-ancien/40 text-xs mb-4">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
                
                <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-widest text-or-ancestral/40 mb-2">Statut Spirituel</span>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                    role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    contributorStatus === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    contributorStatus === 'pending' ? 'bg-or/10 text-or border border-or/20' :
                    'bg-white/5 text-ivoire-ancien/50 border border-white/10'
                  }`}>
                    {role === 'admin' ? 'Gardien Suprême (Admin)' : 
                     contributorStatus === 'approved' ? t("profile.statusApproved") :
                     contributorStatus === 'pending' ? t("profile.statusPending") :
                     t("profile.statusNone")}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className={`p-6 rounded-2xl border overflow-hidden relative ${
                subscriptionTier === 'premium'
                  ? 'border-[var(--or-ancestral)]/30 bg-[var(--or-ancestral)]/[0.04]'
                  : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded ${subscriptionTier === 'premium' ? 'bg-[var(--or-ancestral)]/20' : 'bg-white/5'}`}>
                    <Lock className={`w-4 h-4 ${subscriptionTier === 'premium' ? 'text-[var(--or-ancestral)]' : 'text-ivoire-ancien/40'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ivoire-ancien">Mon Abonnement</h3>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      subscriptionTier === 'premium' ? 'text-[var(--or-ancestral)]' : 'text-ivoire-ancien/30'
                    }`}>
                      {subscriptionTier === 'premium' ? '✦ Gardien de l\'Héritage' : 'Accès Libre'}
                    </span>
                  </div>
                </div>

                {subscriptionTier === 'premium' ? (
                  <>
                    {subStatus && (
                      <p className="text-[11px] text-ivoire-ancien/50 mb-1">
                        Statut : <span className={`font-semibold ${subStatus === 'active' ? 'text-green-400' : 'text-amber-400'}`}>
                          {subStatus === 'active' ? 'Actif' : subStatus === 'past_due' ? 'Paiement en retard' : subStatus}
                        </span>
                      </p>
                    )}
                    {subEndDate && (
                      <p className="text-[11px] text-ivoire-ancien/40 mb-4">
                        Renouvellement : {new Date(subEndDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    <button
                      onClick={handlePortal}
                      disabled={portalLoading}
                      className="w-full py-2.5 rounded-xl border border-[var(--or-ancestral)]/40 text-[var(--or-ancestral)] text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-[var(--or-ancestral)] hover:text-white flex items-center justify-center gap-2"
                    >
                      {portalLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      Gérer mon abonnement
                    </button>
                    <p className="text-[9px] text-ivoire-ancien/20 mt-2 text-center">Via le portail sécurisé Stripe</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-ivoire-ancien/50 leading-relaxed mb-4">
                      Débloquez l'accès illimité aux archives et soutenez la préservation culturelle.
                    </p>
                    <Link href={ROUTES.PREMIUM}>
                      <span className="block w-full py-2.5 rounded-xl bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-[11px] font-bold uppercase tracking-widest text-center transition-all hover:bg-[var(--or-ancestral)] hover:text-white">
                        Passer à Premium — 4.99€/mois
                      </span>
                    </Link>
                  </>
                )}
              </div>
              {subscriptionTier === 'premium' && (
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[var(--or-ancestral)]/10 blur-[60px] rounded-full pointer-events-none" />
              )}
            </motion.div>

            {/* Contributor Request Card */}
            {(role === 'user' && (contributorStatus === 'none' || contributorStatus === 'pending' || contributorStatus === 'rejected')) && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl border border-or/10 bg-or-ancestral/[0.02] overflow-hidden relative"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded bg-or-ancestral/10">
                      <FileText className="w-4 h-4 text-or-ancestral" />
                    </div>
                    <h3 className="text-sm font-bold text-ivoire-ancien">
                      {t("profile.contributorRequestTitle")}
                    </h3>
                  </div>
                  <p className="text-xs text-ivoire-ancien/60 leading-relaxed mb-6">
                    {t("profile.contributorRequestText")}
                  </p>
                  
                  {contributorStatus === 'none' || contributorStatus === 'rejected' ? (
                    <button 
                      onClick={handleRequestContributor}
                      disabled={loading}
                      className="w-full py-3 rounded-xl border border-or-ancestral/30 text-or-ancestral text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-or-ancestral hover:text-foret-nocturne"
                    >
                      {t("profile.contributorRequestAction")}
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-xl bg-white/5 flex items-center justify-center gap-2 text-ivoire-ancien/40 text-[11px] font-bold uppercase tracking-widest border border-white/5">
                      <Clock className="w-3 h-3" />
                      Requête en cours d'examen
                    </div>
                  )}
                </div>
                
                {/* Visual texture */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-or-ancestral/10 blur-[60px] rounded-full" />
              </motion.div>
            )}

          </div>

          {/* Push Notifications Card */}
          {pushSupported && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-or-ancestral/10">
                    {pushSubscribed ? (
                      <Bell className="w-4 h-4 text-or-ancestral" />
                    ) : (
                      <BellOff className="w-4 h-4 text-ivoire-ancien/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ivoire-ancien">Notifications</h3>
                    <p className="text-xs text-ivoire-ancien/50 mt-0.5">
                      {pushSubscribed
                        ? "Vous recevez les notifications de nouveaux messages."
                        : "Activez les notifications pour ne rien manquer."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={pushSubscribed ? unsubscribePush : subscribePush}
                  disabled={pushLoading}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    pushSubscribed
                      ? "bg-[var(--or-ancestral)] border-[var(--or-ancestral)]"
                      : "bg-white/10 border-white/10"
                  }`}
                  aria-checked={pushSubscribed}
                  role="switch"
                  title={pushSubscribed ? "Désactiver les notifications" : "Activer les notifications"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                      pushSubscribed ? "translate-x-5 ml-0.5" : "translate-x-0 ml-0.5"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-display font-medium text-or-ancestral mb-1">Ma Galerie</h2>
              <p className="text-ivoire-ancien/60 text-sm">Gérez les fichiers et photos visibles sur votre profil public ou privé.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-full border border-white/5">
              <select 
                title="Visibilité des nouveaux fichiers"
                className="bg-transparent text-ivoire-ancien text-xs font-bold uppercase tracking-widest outline-none pr-2 ml-2 appearance-none cursor-pointer"
                value={uploadVisibility}
                onChange={(e) => setUploadVisibility(e.target.value)}
              >
                <option value="public" className="bg-foret-nocturne">Publique</option>
                <option value="private" className="bg-foret-nocturne">Privée</option>
              </select>
              <label 
                className={`py-2 px-4 rounded-full bg-or-ancestral text-foret-nocturne text-xs font-bold uppercase tracking-widest cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${galleryUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Ajouter
                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
              </label>
            </div>
          </div>

          {galleryItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl">
              <ImagePlus className="w-12 h-12 text-or-ancestral/30 mb-4" />
              <p className="text-ivoire-ancien/40 font-medium">Votre galerie est vide.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  {item.file_type === 'image' ? (
                    <img 
                      src={resolveStorageUrl(item.file_url, "user_gallery")} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 p-4 text-center">
                      <FileText className="w-8 h-8 text-ivoire-ancien/50 mb-2" />
                    </div>
                  )}
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
                      {item.visibility === 'public' ? <Globe className="w-3 h-3 text-green-400" /> : <Lock className="w-3 h-3 text-red-400" />}
                      {item.visibility === 'public' ? 'Publique' : 'Privé'}
                    </div>
                    <button 
                      onClick={() => handleDeleteGalleryItem(item.id, item.file_url)}
                      className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default ProfilePage;
