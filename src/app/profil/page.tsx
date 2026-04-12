"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Link from "next/link";
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
  Plus
} from "lucide-react";

const ProfilePage = () => {
  const { user, role, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    username: "",
    bio: "",
    location: "",
  });
  
  const [contributorStatus, setContributorStatus] = useState<string>("none");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Gallery Context
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [uploadVisibility, setUploadVisibility] = useState<string>("public");
  const [galleryUploading, setGalleryUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            setFormData({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              nickname: data.nickname || "",
              username: data.username || "",
              bio: data.bio || "",
              location: data.location || "",
            });
            setContributorStatus(data.contributor_status || "none");
            setAvatarUrl(data.avatar_url || null);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };

      const fetchGallery = async () => {
        try {
          const { data, error } = await supabase
            .from("profile_gallery")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (data && !error) setGalleryItems(data);
        } catch (err) {
          console.error("Error fetching gallery:", err);
        }
      };

      fetchProfile();
      fetchGallery();
    }
  }, [user]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

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
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
      
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleRequestContributor = async () => {
    if (!user || contributorStatus !== "none") return;
    
    setLoading(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        contributor_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
      
    if (updateError) {
      setError(updateError.message);
    } else {
      setContributorStatus("pending");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    try {
      setGalleryUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from("user_gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("user_gallery")
        .getPublicUrl(filePath);

      let determinedType = 'image';
      if (file.type.startsWith('video/')) determinedType = 'video';
      else if (file.type === 'application/pdf') determinedType = 'pdf';

      const { error: dbError, data: insertedData } = await supabase
        .from("profile_gallery")
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
      setError(err.message || "Erreur lors de l'envoi du fichier.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, fileUrl: string) => {
    if (!user) return;
    try {
      // Opt: Delete from storage bucket if desired. Since path is publicUrl, extracting path requires regex.
      // Skipping bucket deletion for brevity, just DB deletion for now.
      const { error } = await supabase.from("profile_gallery").delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return null;

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
      <Navbar />
      
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
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Prénom
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Nom
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    Surnom
                  </label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all"
                      value={formData.nickname}
                      onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                      placeholder="Surnom public"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                    {t("profile.username")}
                  </label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Nom d'esprit"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                  {t("profile.location")}
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                  <input 
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ville, Pays ou Territoire"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-or-ancestral/60 ml-1">
                  {t("profile.bio")}
                </label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-6 w-4 h-4 text-or-ancestral/40 group-focus-within:text-or-ancestral transition-colors" />
                  <textarea 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ivoire-ancien focus:border-or-ancestral/50 focus:ring-0 outline-none transition-all min-h-[120px]"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Partagez quelques mots sur votre lien avec la culture Sakata..."
                  />
                </div>
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
                  {error && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-red-400 font-medium flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </motion.span>
                  )}
                </div>
                
                <button
                  disabled={loading}
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
                  <div className="w-24 h-24 rounded-full border-2 border-or/20 p-1 overflow-hidden shadow-2xl shadow-black/40">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-or-ancestral/10 flex items-center justify-center">
                        <User className="w-12 h-12 text-or-ancestral" />
                      </div>
                    )}
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
                  {formData.nickname || (formData.first_name ? `${formData.first_name} ${formData.last_name}` : user.email?.split("@")[0])}
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
                    <img src={item.file_url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
