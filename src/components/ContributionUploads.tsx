"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Image, Video, FileText, Loader2, Check, X, Camera, Film } from "lucide-react";

type UploadCategory = "photo" | "video" | "texte";

interface UploadState {
  file: File | null;
  title: string;
  loading: boolean;
  status: "idle" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

const CATEGORIES: {
  key: UploadCategory;
  label: string;
  icon: typeof Image;
  description: string;
  acceptedTypes: string;
  hint: string;
}[] = [
  {
    key: "photo",
    label: "Photos",
    icon: Camera,
    description: "Images, photos d'archives, illustrations",
    acceptedTypes: "image/jpeg,image/png,image/webp,image/gif",
    hint: "JPEG, PNG, WebP, GIF — 10MB max",
  },
  {
    key: "video",
    label: "Vidéos",
    icon: Film,
    description: "Vidéos documentaires, témoignages, danses",
    acceptedTypes: "video/mp4,video/webm",
    hint: "MP4, WebM — 10MB max",
  },
  {
    key: "texte",
    label: "Textes & Documents",
    icon: FileText,
    description: "Articles, transcriptions, PDF, documents",
    acceptedTypes: ".txt,.pdf,.doc,.docx,.md",
    hint: "TXT, PDF, DOC, DOCX, MD — 10MB max",
  },
];

export default function ContributionUploads() {
  const [activeCategory, setActiveCategory] = useState<UploadCategory>("photo");
  const [uploads, setUploads] = useState<Record<UploadCategory, UploadState>>({
    photo: { file: null, title: "", loading: false, status: "idle" },
    video: { file: null, title: "", loading: false, status: "idle" },
    texte: { file: null, title: "", loading: false, status: "idle" },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const state = uploads[activeCategory];

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploads((prev) => ({
        ...prev,
        [activeCategory]: { ...prev[activeCategory], file, status: "idle", error: undefined },
      }));
    },
    [activeCategory]
  );

  const handleUpload = useCallback(async () => {
    const current = uploads[activeCategory];
    if (!current.file) return;

    setUploads((prev) => ({
      ...prev,
      [activeCategory]: { ...prev[activeCategory], loading: true, status: "uploading" },
    }));

    try {
      const formData = new FormData();
      formData.append("file", current.file);
      formData.append("category", activeCategory);
      formData.append("title", current.title);

      const res = await fetch("/api/contributor/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      setUploads((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          loading: false,
          status: "success",
          url: data.url,
        },
      }));

      // Reset after 3s
      setTimeout(() => {
        setUploads((prev) => ({
          ...prev,
          [activeCategory]: {
            file: null,
            title: "",
            loading: false,
            status: "idle",
            url: undefined,
          },
        }));
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);
    } catch (err: any) {
      setUploads((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          loading: false,
          status: "error",
          error: err.message,
        },
      }));
    }
  }, [activeCategory, uploads]);

  const handleReset = useCallback(() => {
    setUploads((prev) => ({
      ...prev,
      [activeCategory]: { file: null, title: "", loading: false, status: "idle", error: undefined },
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [activeCategory]);

  const activeCategoryConfig = CATEGORIES.find((c) => c.key === activeCategory)!;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8">
      <h2 className="text-2xl font-light mb-2 flex items-center gap-3">
        <Upload size={24} className="text-[var(--or-ancestral)]" />
        Déposer un contenu
      </h2>
      <p className="text-gray-400 text-sm mb-8">
        Partagez vos photos, vidéos ou documents avec la communauté Sakata.
        Tous les contenus sont examinés avant publication.
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--or-ancestral)]/20 border border-[var(--or-ancestral)]/40 text-[var(--or-ancestral)]"
                  : "border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Upload zone */}
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{activeCategoryConfig.description}</p>

        {/* File input */}
        {state.status !== "success" && (
          <>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                state.file
                  ? "border-[var(--or-ancestral)]/50 bg-[var(--or-ancestral)]/5"
                  : "border-white/10 hover:border-white/30 hover:bg-white/5"
              }`}
            >
              {state.file ? (
                <div className="space-y-2">
                  <FileText size={32} className="mx-auto text-[var(--or-ancestral)]" />
                  <p className="text-white font-medium">{state.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(state.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 flex items-center justify-center mx-auto">
                    <Upload size={24} className="text-[var(--or-ancestral)]" />
                  </div>
                  <p className="text-white font-medium">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-gray-500">{activeCategoryConfig.hint}</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={activeCategoryConfig.acceptedTypes}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Title */}
            {state.file && (
              <input
                type="text"
                value={state.title}
                onChange={(e) =>
                  setUploads((prev) => ({
                    ...prev,
                    [activeCategory]: { ...prev[activeCategory], title: e.target.value },
                  }))
                }
                placeholder={`Titre de votre ${activeCategoryConfig.label.toLowerCase()} (optionnel)`}
                maxLength={200}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[var(--or-ancestral)] focus:outline-none text-sm"
              />
            )}
          </>
        )}

        {/* Status feedback */}
        {state.status === "uploading" && (
          <div className="flex items-center gap-3 rounded-lg bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 p-4">
            <Loader2 size={20} className="animate-spin text-[var(--or-ancestral)]" />
            <p className="text-sm text-gray-300">Upload en cours...</p>
          </div>
        )}

        {state.status === "success" && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-400" />
              <p className="text-sm text-green-400 font-medium">Upload réussi !</p>
            </div>
            <p className="text-xs text-gray-400">
              Votre contenu sera examiné par l'équipe avant publication.
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <X size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-400 font-medium">Erreur</p>
              <p className="text-xs text-red-300">{state.error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {state.file && state.status !== "uploading" && state.status !== "success" && (
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={state.loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--or-ancestral)] hover:opacity-90 text-white rounded-lg transition-opacity disabled:opacity-50 text-sm font-medium"
            >
              <Upload size={16} />
              Envoyer
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
