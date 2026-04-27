"use client";

import { DB_TABLES } from "@/lib/constants/db";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Save, ArrowLeft, Loader2, Sparkles,
  Image as ImageIcon, Trash2, GripVertical,
  Type, Quote, Heading2, AlignLeft, AlignCenter, AlignRight,
  AudioLines, Layers, Library, Search, X, Volume2, Play,
  Film, UploadCloud, CheckCircle2, AlertCircle, Info, Clock, FileVideo,
} from "lucide-react";
import Link from "next/link";
import { translateArticle, LanguageCode } from "@/lib/translate";
import { ContentBlock } from "@/types/i18n";
import { motion, Reorder, AnimatePresence } from "framer-motion";

const languages: { label: string; code: LanguageCode }[] = [
  { label: "Français", code: "fr" },
  { label: "Kisakata", code: "skt" },
  { label: "Lingala", code: "lin" },
  { label: "Swahili", code: "swa" },
  { label: "Tshiluba", code: "tsh" },
];

// ─────────────────────────────────────────────
// Toast Notification System (Brume Design)
// ─────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) => (
  <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => {
        const palette = {
          success: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", icon: <CheckCircle2 className="w-5 h-5" /> },
          error: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300", icon: <AlertCircle className="w-5 h-5" /> },
          info: { bg: "bg-or-ancestral/10", border: "border-or-ancestral/30", text: "text-or-ancestral", icon: <Info className="w-5 h-5" /> },
        }[toast.type];
        return (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border ${palette.bg} ${palette.border} ${palette.text} backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[320px] max-w-[420px]`}
          >
            <div className="flex-shrink-0 mt-0.5">{palette.icon}</div>
            <p className="flex-1 text-sm leading-relaxed font-medium">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);

// ─────────────────────────────────────────────
// Block Editor (unchanged behavior, slight visual polish)
// ─────────────────────────────────────────────
const BlockEditor = ({
  blocks,
  onChange
}: {
  blocks: ContentBlock[],
  onChange: (blocks: ContentBlock[]) => void
}) => {
  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      body: type === "text" || type === "heading" ? "" : undefined,
      url: type === "image" ? "" : undefined,
      alignment: type === "image" ? "full" : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-4">
        {blocks.map((block) => (
          <Reorder.Item
            key={block.id}
            value={block}
            className="group relative bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all"
          >
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing p-2">
               <GripVertical className="w-5 h-5 text-ivoire-ancien" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                {block.type === "text" && (
                  <textarea
                    value={block.body || ""}
                    onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                    className="w-full bg-transparent outline-none text-ivoire-ancien/80 leading-relaxed min-h-[100px] resize-none"
                    placeholder="Écrivez votre paragraphe..."
                  />
                )}

                {block.type === "heading" && (
                  <input
                    type="text"
                    value={block.body || ""}
                    onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                    className="w-full bg-transparent outline-none text-2xl font-display font-bold text-ivoire-ancien"
                    placeholder="Titre de section..."
                  />
                )}

                {block.type === "image" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={block.url || ""}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 pl-10 outline-none focus:border-or-ancestral/50 text-sm"
                          placeholder="URL de l'image (ex: /images/...)"
                        />
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      </div>
                      <div className="flex bg-black/20 rounded-xl p-1 border border-white/10">
                        {(["left", "full", "right", "sidebar"] as const).map(align => (
                           <button
                             key={align}
                             onClick={() => updateBlock(block.id, { alignment: align })}
                             title={align === "sidebar" ? "Afficher dans la barre latérale" : `Alignement ${align}`}
                             className={`p-2 rounded-lg transition-all ${block.alignment === align ? 'bg-or-ancestral text-foret-nocturne' : 'opacity-40 hover:opacity-100'}`}
                           >
                             {align === "left" && <AlignLeft className="w-4 h-4" />}
                             {align === "full" && <AlignCenter className="w-4 h-4" />}
                             {align === "right" && <AlignRight className="w-4 h-4" />}
                             {align === "sidebar" && <Layers className="w-4 h-4" />}
                           </button>
                         ))}
                       </div>
                     </div>
                     {block.url && (
                       <div className={`rounded-xl overflow-hidden border border-white/5 bg-black/20 transition-all ${
                         block.alignment === 'full' ? 'w-full' :
                         block.alignment === 'sidebar' ? 'w-1/3 border-or-ancestral/30 shadow-[0_0_15px_rgba(193,107,52,0.1)]' :
                         'w-1/2 mx-auto'
                       }`}>
                         <img src={block.url} alt="" className="w-full h-auto object-cover opacity-60" />
                       </div>
                     )}
                    <input
                      type="text"
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      className="w-full bg-transparent italic text-xs opacity-40 outline-none"
                      placeholder="Légende de l'image..."
                    />
                  </div>
                )}

                {block.type === "quote" && (
                   <div className="space-y-4 pl-4 border-l-2 border-or-ancestral/30 bg-or-ancestral/5 py-4 px-6 rounded-r-xl">
                      <textarea
                        value={block.body || ""}
                        onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                        className="w-full bg-transparent outline-none text-ivoire-ancien/90 italic font-display text-lg"
                        placeholder="La parole du sage..."
                      />
                      <input
                        type="text"
                        value={block.caption || ""}
                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                        className="w-full bg-transparent text-sm opacity-60 font-bold outline-none"
                        placeholder="- Auteur ou Source"
                      />
                   </div>
                )}
              </div>

              <button
                onClick={() => removeBlock(block.id)}
                className="p-2 text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex items-center justify-center gap-4 py-8 border-2 border-dashed border-white/5 rounded-[2rem]">
        <button onClick={() => addBlock("text")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Type className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Paragraphe</span>
        </button>
        <button onClick={() => addBlock("heading")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Heading2 className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Titre</span>
        </button>
        <button onClick={() => addBlock("image")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><ImageIcon className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Image</span>
        </button>
        <button onClick={() => addBlock("quote")} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-or-ancestral group-hover:text-foret-nocturne transition-all"><Quote className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Citation</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Hero Video Upload Card (NEW — drag/drop, big preview)
// ─────────────────────────────────────────────
const HeroVideoCard = ({
  videoUrl,
  uploading,
  progress,
  onFile,
  onRemove,
}: {
  videoUrl: string;
  uploading: boolean;
  progress: number;
  onFile: (f: File) => void;
  onRemove: () => void;
}) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  if (videoUrl && !uploading) {
    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-video bg-black/40 rounded-2xl overflow-hidden border border-or-ancestral/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Vidéo Active</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-all text-xs font-bold uppercase tracking-wider"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Retirer la vidéo héro
        </button>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-or-ancestral/30 bg-gradient-to-br from-foret-nocturne to-black flex flex-col items-center justify-center gap-4 p-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-or-ancestral/0 via-or-ancestral/20 to-or-ancestral/0 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--or-ancestral)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-or-ancestral animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-or-ancestral font-bold text-sm">Téléversement en cours…</p>
            <p className="text-ivoire-ancien/40 text-xs mt-1">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${
          dragOver
            ? "border-2 border-or-ancestral bg-or-ancestral/10 scale-[1.01]"
            : "border-2 border-dashed border-white/10 hover:border-or-ancestral/50 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            dragOver ? "bg-or-ancestral text-foret-nocturne scale-110" : "bg-white/5 text-ivoire-ancien/60 group-hover:bg-or-ancestral/20 group-hover:text-or-ancestral"
          }`}>
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-ivoire-ancien">
              {dragOver ? "Déposez votre vidéo ici" : "Téléverser une vidéo héro"}
            </p>
            <p className="text-[11px] text-ivoire-ancien/40 mt-1">
              Glissez-déposez ou cliquez · MP4, WebM, MOV · 50 MB max
            </p>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        className="hidden"
      />
    </>
  );
};

// ─────────────────────────────────────────────
// Main Article Editor
// ─────────────────────────────────────────────
const ArticleEditor = () => {
  const { slug } = useParams();
  const router = useRouter();
  const isNew = slug === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<LanguageCode>("fr");
  const [editorMode, setEditorMode] = useState<"text" | "blocks">("text");
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [article, setArticle] = useState<any>({
    slug: "",
    category: "culture",
    featured_image: "",
    hero_video_url: "",
    title: { fr: "" },
    content: { fr: "" },
    summary: { fr: "" },
    has_narrator: false
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<any[]>([]);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Mark as dirty when article changes
  const markDirty = () => setHasChanges(true);

  const fetchLibrary = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setLibraryFiles(data);
    } catch (err) {
      console.warn("[ArticleEditor] Library fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const stringToBlocks = (text: string): ContentBlock[] => {
    if (!text) return [];
    if (typeof text !== 'string') return text as any;
    return [{ id: Math.random().toString(36).substr(2, 9), type: "text", body: text }];
  };

  const handleVoiceGenerate = async () => {
    if (!article.content[activeTab]) return;
    setIsVoiceLoading(true);
    try {
      const text = Array.isArray(article.content[activeTab])
        ? article.content[activeTab].map((b: any) => b.body || "").join(" ")
        : article.content[activeTab];

      const res = await fetch("/api/admin/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.audioUrl) {
         setArticle({ ...article, has_narrator: true });
         markDirty();
         showToast("Narration IA générée avec succès — n'oubliez pas de sauvegarder", "success");
      } else {
        showToast("La génération vocale n'a renvoyé aucun audio", "error");
      }
    } catch (e) {
      console.error("[ArticleEditor] Voice generation failed:", {
        error: e instanceof Error ? e.message : String(e),
        slug,
        timestamp: new Date().toISOString(),
      });
      showToast("Erreur lors de la génération de la narration vocale", "error");
    } finally {
       setIsVoiceLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Hero Video Upload — DIRECT to Supabase Storage from browser
  // Bypasses Netlify Functions (which have a ~6MB payload limit
  // that was causing 500 errors on large videos)
  // ─────────────────────────────────────────────
  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Format non supporté — utilisez MP4, WebM ou MOV", "error");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(`Vidéo trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} MB) — max 50 MB`, "error");
      return;
    }

    setIsVideoUploading(true);
    setVideoUploadProgress(0);

    // Simulated progress — Supabase upload() doesn't expose progress events.
    // Tuned by file size: bigger files get slower fake progress.
    const fileSizeMB = file.size / 1024 / 1024;
    const progressStep = Math.max(2, 12 - fileSizeMB / 3); // slower for bigger files
    const progressInterval = setInterval(() => {
      setVideoUploadProgress(prev => {
        if (prev >= 92) return prev;
        return prev + Math.random() * progressStep;
      });
    }, 400);

    try {
      // Verify auth session — Supabase client uses this token automatically
      const sessionResult = await supabase.auth.getSession();
      if (!sessionResult.data.session) {
        showToast("Session expirée — veuillez vous reconnecter", "error");
        return;
      }

      // Build a clean filename — strip non-ASCII, keep extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const cleanName = file.name
        .replace(/\.[^.]+$/, "")          // remove extension
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")  // strip accents
        .replace(/[^a-zA-Z0-9-_]/g, "-")  // replace unsafe chars
        .replace(/-+/g, "-")
        .slice(0, 60);
      const articleRef = article.id || slug;
      const path = `articles/${articleRef}/${Date.now()}-${cleanName}.${ext}`;

      // Direct upload to Supabase Storage — no Netlify Function in the middle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("article-videos")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error("[ArticleEditor] Storage upload failed:", uploadError);
        const msg = uploadError.message?.includes("Bucket not found")
          ? "Bucket 'article-videos' introuvable — contactez l'administrateur"
          : uploadError.message?.includes("policy")
          ? "Permissions insuffisantes pour ce bucket"
          : `Échec du téléversement : ${uploadError.message}`;
        showToast(msg, "error");
        return;
      }

      if (!uploadData?.path) {
        showToast("Téléversement échoué — aucun chemin retourné", "error");
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("article-videos")
        .getPublicUrl(uploadData.path);

      if (!urlData?.publicUrl) {
        showToast("Impossible de générer l'URL publique de la vidéo", "error");
        return;
      }

      setVideoUploadProgress(100);
      setArticle({ ...article, hero_video_url: urlData.publicUrl });
      markDirty();
      showToast("Vidéo téléversée avec succès — sauvegardez l'article pour conserver", "success");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("[ArticleEditor] Video upload failed:", {
        error: error instanceof Error ? error.message : String(error),
        slug,
        timestamp: new Date().toISOString(),
      });
      showToast("Erreur réseau lors du téléversement — réessayez", "error");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsVideoUploading(false);
        setVideoUploadProgress(0);
      }, 600);
    }
  };

  useEffect(() => {
    if (!isNew) {
      const fetchArticle = async () => {
        const { data, error } = await supabase
          .from(DB_TABLES.ARTICLES)
          .select("*")
          .eq("slug", slug)
          .single();

        if (!error && data) {
          const firstContent = data.content?.fr;
          if (Array.isArray(firstContent) || (typeof firstContent === 'string' && firstContent.startsWith('['))) {
             setEditorMode("blocks");
             if (typeof firstContent === 'string') {
                try {
                   const parsed = JSON.parse(firstContent);
                   data.content.fr = parsed;
                } catch (error) {
                   console.warn("[ArticleEditor] Failed to parse JSON content:", error);
                }
             }
          }
          setArticle(data);
        }
        setLoading(false);
      };
      fetchArticle();
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...article };

    const { error } = await supabase
      .from(DB_TABLES.ARTICLES)
      .upsert(payload);

    if (error) {
      showToast(`Erreur de sauvegarde : ${error.message}`, "error");
      setSaving(false);
    } else {
      setLastSavedAt(new Date());
      setHasChanges(false);
      showToast("Article publié — redirection…", "success");
      setTimeout(() => router.push("/admin/content"), 800);
    }
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const missingLangs = languages.map(l => l.code).filter(code => code !== "fr");
      const updatedArticle = await translateArticle(article, missingLangs);
      setArticle(updatedArticle);
      markDirty();
      showToast("Traduction automatique terminée pour toutes les langues", "success");
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de la traduction automatique", "error");
    }
    setTranslating(false);
  };

  const updateField = (lang: LanguageCode, field: string, value: any) => {
    setArticle((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
    markDirty();
  };

  const toggleMode = () => {
    const newMode = editorMode === "text" ? "blocks" : "text";
    setEditorMode(newMode);
    if (newMode === "blocks") {
      updateField(activeTab, "content", stringToBlocks(article.content[activeTab]));
    } else {
      const blocks = article.content[activeTab] as ContentBlock[];
      if (Array.isArray(blocks)) {
         const text = blocks.map(b => b.body || "").join("\n\n");
         updateField(activeTab, "content", text);
      }
    }
  };

  if (loading) return (
    <div className="py-24 text-center animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
      Lecture du grimoire...
    </div>
  );

  // Save state badge
  const SaveStateBadge = () => {
    if (saving) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral text-[10px] font-bold uppercase tracking-widest">
          <Loader2 className="w-3 h-3 animate-spin" />
          Sauvegarde…
        </div>
      );
    }
    if (hasChanges) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          Modifications non sauvegardées
        </div>
      );
    }
    if (lastSavedAt) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
          <CheckCircle2 className="w-3 h-3" />
          Sauvegardé
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-8 pb-24 relative">
        {/* ───────────── Header ───────────── */}
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/content" className="p-2.5 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>
                  {isNew ? "Création" : "Édition"}
                </span>
                <SaveStateBadge />
                {article.has_narrator && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    <Volume2 className="w-3 h-3" /> VOIX ACTIVE
                  </div>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold">
                 {isNew ? "Nouveau Récit" : article.title.fr || article.slug}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-bold text-sm ${sidebarOpen ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien'}`}
            >
              <Library className="w-4 h-4" /> Médiathèque
            </button>

            <button
              onClick={handleVoiceGenerate}
              disabled={isVoiceLoading || !article.content[activeTab]}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all font-bold text-sm disabled:opacity-30"
            >
              {isVoiceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AudioLines className="w-4 h-4" />}
              Auto Voix
            </button>

            <button
              onClick={toggleMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien transition-all font-bold text-sm"
            >
              {editorMode === "text" ? <Type className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              {editorMode === "text" ? "Markdown" : "Blocs"}
            </button>

            <button
              onClick={handleAutoTranslate}
              disabled={translating || !article.title.fr}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold text-sm disabled:opacity-30"
            >
              {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Traduire tout
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-or-ancestral text-foret-nocturne font-bold hover:scale-105 transition-all text-sm shadow-[0_0_20px_rgba(193,107,52,0.2)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publier
            </button>
          </div>
        </header>

        {/* ───────────── Main Grid ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ─── Left Sidebar: Metadata & Hero Media ─── */}
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-28">

             {/* Hero Video — promoted to its own beautiful card */}
             <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    <FileVideo className="w-4 h-4 text-or-ancestral" />
                    Vidéo Héro
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Optionnel</span>
                </div>
                <HeroVideoCard
                  videoUrl={article.hero_video_url || ""}
                  uploading={isVideoUploading}
                  progress={videoUploadProgress}
                  onFile={handleVideoUpload}
                  onRemove={() => {
                    setArticle({ ...article, hero_video_url: "" });
                    markDirty();
                    showToast("Vidéo retirée — sauvegardez pour confirmer", "info");
                  }}
                />
             </div>

             {/* Structure & Metadata */}
             <div className="p-6 rounded-[2rem] bg-white/[0.04] border border-white/10 space-y-6">
                <h3 className="font-display text-lg font-bold border-b border-white/5 pb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-or-ancestral" /> Structure
                </h3>

                {editorMode === "blocks" && Array.isArray(article.content[activeTab]) && (
                  <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 scrollbar-hide -mx-2 px-2">
                    {(article.content[activeTab] as any[]).map((block, i) => (
                       <div key={block.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-[10px] transition-colors group">
                         <span className="opacity-20 font-mono w-4 text-center">{i+1}</span>
                         {block.type === "heading" ? <Heading2 className="w-3 h-3 text-or-ancestral flex-shrink-0" /> :
                          block.type === "image" ? <ImageIcon className="w-3 h-3 text-blue-400 flex-shrink-0" /> :
                          block.type === "quote" ? <Quote className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <Type className="w-3 h-3 opacity-40 flex-shrink-0" />}
                         <span className="truncate flex-1 opacity-60 group-hover:opacity-100">
                           {block.body ? block.body.substring(0, 24) + "..." : block.type.toUpperCase()}
                         </span>
                         {block.alignment === "sidebar" && <span className="bg-or-ancestral/20 text-or-ancestral px-1.5 rounded uppercase text-[9px] flex-shrink-0">Side</span>}
                       </div>
                    ))}
                  </div>
                )}

                <div className="space-y-5 pt-4 border-t border-white/5">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Slug (URL)</label>
                     <input
                       type="text"
                       value={article.slug}
                       disabled={!isNew}
                       onChange={(e) => { setArticle({...article, slug: e.target.value}); markDirty(); }}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-or-ancestral/50 transition-all text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Image Principale</label>
                     <div className="relative group">
                       <input
                         type="text"
                         value={article.featured_image}
                         onChange={(e) => { setArticle({...article, featured_image: e.target.value}); markDirty(); }}
                         placeholder="/images/..."
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 outline-none focus:border-or-ancestral/50 transition-all text-xs"
                       />
                       <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                     </div>
                     {article.featured_image && (
                       <img src={article.featured_image} className="w-full h-24 object-cover rounded-xl mt-2 opacity-70 border border-white/10" />
                     )}
                   </div>
                </div>
             </div>
          </div>

          {/* ─── Center: Content Editor ─── */}
          <div className={`${sidebarOpen ? 'lg:col-span-5' : 'lg:col-span-8'} space-y-8 transition-all duration-500`}>
             <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveTab(lang.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === lang.code ? 'bg-or-ancestral text-foret-nocturne shadow-md' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                  >
                    {lang.label}
                  </button>
                ))}
             </div>

             <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Titre ({activeTab})</label>
                  <input
                    type="text"
                    value={article.title[activeTab] || ""}
                    onChange={(e) => updateField(activeTab, "title", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-4xl font-display font-bold outline-none focus:border-or-ancestral transition-all"
                    placeholder="Le Secret des Ancêtres..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Préambule ({activeTab})</label>
                  <textarea
                    value={article.summary[activeTab] || ""}
                    onChange={(e) => updateField(activeTab, "summary", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-or-ancestral/50 transition-all text-sm italic h-24 resize-none"
                    placeholder="Un avant-goût du savoir..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold ml-2">Contenu ({activeTab})</label>
                  {editorMode === "text" ? (
                    <textarea
                      value={typeof article.content[activeTab] === 'string' ? article.content[activeTab] : JSON.stringify(article.content[activeTab])}
                      onChange={(e) => updateField(activeTab, "content", e.target.value)}
                      className="w-full bg-[#050C09] border border-white/5 rounded-[2.5rem] p-8 outline-none focus:border-white/20 transition-all font-body leading-relaxed h-[600px] resize-none text-ivoire-ancien/70"
                      placeholder="Épanchez votre sagesse..."
                    />
                  ) : (
                    <BlockEditor
                      blocks={Array.isArray(article.content[activeTab]) ? article.content[activeTab] : stringToBlocks(article.content[activeTab])}
                      onChange={(blocks) => updateField(activeTab, "content", blocks)}
                    />
                  )}
                </div>
             </div>
          </div>

          {/* ─── Right Sidebar: Media Library ─── */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="lg:col-span-3 space-y-6"
              >
                <div className="p-6 rounded-[2rem] bg-black/40 border border-blue-500/20 backdrop-blur-3xl h-[80vh] flex flex-col sticky top-28">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-display font-bold text-blue-400 flex items-center gap-2">
                       <Library className="w-4 h-4" /> Médiathèque
                     </h3>
                     <button onClick={() => setSidebarOpen(false)} className="opacity-40 hover:opacity-100">
                       <X className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="relative mb-6">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                     <input type="text" placeholder="Rechercher..." className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                     {libraryFiles.map((file, i) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden aspect-video bg-black/20 border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer">
                           <img src={file.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[8px] font-bold truncate">{file.name}</p>
                              <div className="flex gap-1 mt-1">
                                 <button
                                   onClick={() => {
                                     if (editorMode === "blocks") {
                                        const newBlock: ContentBlock = { id: Math.random().toString(36).substr(2, 9), type: "image", url: file.url, alignment: "sidebar" };
                                        updateField(activeTab, "content", [...(article.content[activeTab] || []), newBlock]);
                                     } else {
                                        updateField(activeTab, "content", (article.content[activeTab] || "") + `\n\n![${file.name}](${file.url})`);
                                     }
                                   }}
                                   className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-[8px] font-bold py-1 rounded"
                                 >
                                   SIDE
                                 </button>
                                 <button
                                   onClick={() => {
                                     if (editorMode === "blocks") {
                                        const newBlock: ContentBlock = { id: Math.random().toString(36).substr(2, 9), type: "image", url: file.url, alignment: "full" };
                                        updateField(activeTab, "content", [...(article.content[activeTab] || []), newBlock]);
                                     } else {
                                        updateField(activeTab, "content", (article.content[activeTab] || "") + `\n\n![${file.name}](${file.url})`);
                                     }
                                   }}
                                   className="flex-1 bg-white/20 hover:bg-white/40 text-[8px] font-bold py-1 rounded"
                                 >
                                   BLOC
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                     {libraryFiles.length === 0 && <p className="text-[10px] opacity-20 italic text-center py-10">Médiathèque vide</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ArticleEditor;
