"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import NextImage from "next/image";
import { useArticleEditor, type ArticleSection, type ArticleImage } from "@/hooks/useArticleEditor";
import { Plus, Trash2, Upload, Loader2, AlertCircle, Save, X, Video } from "lucide-react";

interface ArticleEditorProps {
  articleId?: string;
  onSave?: (id: string) => void;
}

export function ArticleEditor({ onSave }: ArticleEditorProps) {
  const editor = useArticleEditor();
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    async (sectionId: string, files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      try {
        const file = files[0];
        // Resize image
        const canvas = document.createElement("canvas");
        const img = new Image();

        img.onload = async () => {
          const maxWidth = 1200;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            if (!blob) return;
            const url = await editor.uploadImage(new File([blob], file.name, { type: "image/webp" }));
            if (url) {
              editor.addImageToSection(sectionId, {
                id: Math.random().toString(36).substr(2, 9),
                url,
                caption: "",
              });
            }
            setUploading(false);
          }, "image/webp", 0.8);
        };

        img.src = URL.createObjectURL(file);
      } catch (err) {
        console.error("Image upload error:", err);
        setUploading(false);
      }
    },
    [editor]
  );

  const handleVideoUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploadingVideo(true);
      try {
        const file = files[0];
        // Pass articleId if available; if not, uploadVideo will auto-save the article
        await editor.uploadVideo(file, editor.articleId || undefined);
      } catch (err) {
        console.error("Video upload error:", err);
      } finally {
        setUploadingVideo(false);
      }
    },
    [editor]
  );

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!editor.title || editor.title.trim().length === 0) {
      errors.title = "Le titre est obligatoire";
    } else if (editor.title.trim().length < 5) {
      errors.title = "Le titre doit contenir au moins 5 caractères";
    } else if (editor.title.trim().length > 200) {
      errors.title = "Le titre ne doit pas dépasser 200 caractères";
    }

    // Slug validation
    if (!editor.slug || editor.slug.trim().length === 0) {
      errors.slug = "Le slug est obligatoire";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(editor.slug)) {
      errors.slug = "Le slug doit être en minuscules avec des tirets (a-z, 0-9, -)";
    }

    // Content validation
    const hasValidContent = editor.sections.some(
      (section) => section.text && section.text.trim().length > 0
    );
    if (!hasValidContent) {
      errors.content = "Vous devez ajouter au moins un paragraphe de contenu";
    }

    return errors;
  }, [editor.title, editor.slug, editor.sections]);

  const canSave = Object.keys(validationErrors).length === 0;

  const handleSaveArticle = useCallback(
    async (status: "draft" | "submitted_for_review") => {
      if (!canSave) return;
      const id = await editor.saveArticle(status);
      if (id && onSave) {
        onSave(id);
      }
    },
    [editor, onSave, canSave]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Error Alert — Server Error */}
      {editor.error && (
        <div className="flex gap-3 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm">{editor.error}</p>
          </div>
        </div>
      )}

      {/* Validation Errors Alert */}
      {!canSave && (
        <div className="flex gap-3 rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
          <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-300 text-sm font-medium mb-2">Veuillez corriger les erreurs suivantes:</p>
            <ul className="text-amber-200 text-sm space-y-1 list-disc list-inside">
              {Object.entries(validationErrors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Title Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Titre de l'article
          {validationErrors.title && <span className="text-red-400 ml-2">*</span>}
        </label>
        <input
          type="text"
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          placeholder="Titre principal de l'article"
          className={`w-full rounded-lg border px-4 py-3 text-white placeholder-slate-500 focus:outline-none text-lg font-semibold bg-slate-800 transition ${
            validationErrors.title
              ? "border-red-500 focus:border-red-500"
              : "border-slate-700 focus:border-amber-600"
          }`}
        />
        {validationErrors.title && (
          <p className="text-red-400 text-sm">{validationErrors.title}</p>
        )}
      </div>

      {/* Slug Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Slug (URL)
          {validationErrors.slug && <span className="text-red-400 ml-2">*</span>}
        </label>
        <input
          type="text"
          value={editor.slug}
          onChange={(e) => editor.setSlug(e.target.value)}
          placeholder="article-slug"
          className={`w-full rounded-lg border px-4 py-2 text-white placeholder-slate-500 focus:outline-none font-mono text-sm bg-slate-800 transition ${
            validationErrors.slug
              ? "border-red-500 focus:border-red-500"
              : "border-slate-700 focus:border-amber-600"
          }`}
        />
        {validationErrors.slug && (
          <p className="text-red-400 text-sm">{validationErrors.slug}</p>
        )}
      </div>

      {/* Premium Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requiresPremium"
          checked={editor.requiresPremium}
          onChange={(e) => editor.setRequiresPremium(e.target.checked)}
          className="rounded border-slate-600 bg-slate-800 text-amber-600 focus:ring-amber-600"
        />
        <label htmlFor="requiresPremium" className="text-sm font-medium text-slate-200">
          Contenu réservé aux abonnés Premium
        </label>
      </div>

      {/* Hero Video Section */}
      <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Video size={20} className="text-amber-600" />
          <h3 className="text-lg font-bold text-white">Vidéo Héro</h3>
        </div>

        {editor.heroVideoUrl ? (
          <div className="space-y-3">
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
              <video
                src={editor.heroVideoUrl}
                controls
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => editor.setHeroVideoUrl("")}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                  title="Supprimer la vidéo"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400">Vidéo héro configurée</p>
          </div>
        ) : (
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={uploadingVideo}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-600 hover:border-amber-600 rounded-lg text-slate-300 hover:text-amber-600 transition disabled:opacity-50 bg-slate-800/50"
          >
            {uploadingVideo ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Chargement vidéo...
              </>
            ) : (
              <>
                <Video size={18} />
                Ajouter une vidéo héro (MP4, WebM, MOV - Max 50MB)
              </>
            )}
          </button>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Contenu</h2>
          <button
            onClick={() => editor.addSection()}
            className="flex items-center gap-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition text-sm"
          >
            <Plus size={16} />
            Ajouter un paragraphe
          </button>
        </div>

        <div className="space-y-4">
          {editor.sections.map((section, idx) => (
            <div
              key={section.id}
              className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 space-y-3"
            >
              {/* Section Heading */}
              <input
                type="text"
                placeholder="Titre du paragraphe (optionnel)"
                value={section.heading || ""}
                onChange={(e) =>
                  editor.updateSection(section.id, { heading: e.target.value })
                }
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none font-semibold"
              />

              {/* Section Text */}
              <textarea
                value={section.text}
                onChange={(e) =>
                  editor.updateSection(section.id, { text: e.target.value })
                }
                placeholder="Contenu du paragraphe..."
                rows={4}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none resize-none"
              />

              {/* Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200">Images</label>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setActiveSectionId(section.id);
                    }}
                    disabled={uploading}
                    className="flex items-center gap-2 px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    Ajouter image
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {section.images.map((img) => (
                    <div key={img.id} className="rounded border border-slate-700 bg-slate-800 overflow-hidden">
                      <div className="relative w-full h-32">
                        <NextImage
                          src={img.url}
                          alt={img.caption || "Article image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Légende"
                          value={img.caption || ""}
                          onChange={(e) => {
                            const updatedImages = section.images.map((i) =>
                              i.id === img.id ? { ...i, caption: e.target.value } : i
                            );
                            editor.updateSection(section.id, { images: updatedImages });
                          }}
                          className="w-full rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          onClick={() => editor.removeImageFromSection(section.id, img.id)}
                          className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded transition"
                        >
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Section */}
              <button
                onClick={() => editor.deleteSection(section.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-sm"
              >
                <Trash2 size={16} />
                Supprimer cette section
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Sources</h2>
          <button
            onClick={() =>
              editor.addSource({
                title: "",
                url: "",
                author: "",
                date: "",
              })
            }
            className="flex items-center gap-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition text-sm"
          >
            <Plus size={16} />
            Ajouter source
          </button>
        </div>

        <div className="space-y-2">
          {editor.sources.map((source) => (
            <div
              key={source.id}
              className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 grid grid-cols-2 gap-3"
            >
              <input
                type="text"
                placeholder="Titre"
                value={source.title}
                onChange={(e) =>
                  editor.updateSource(source.id, { title: e.target.value })
                }
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none text-sm"
              />
              <input
                type="url"
                placeholder="URL"
                value={source.url}
                onChange={(e) =>
                  editor.updateSource(source.id, { url: e.target.value })
                }
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Auteur (optionnel)"
                value={source.author || ""}
                onChange={(e) =>
                  editor.updateSource(source.id, { author: e.target.value })
                }
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none text-sm"
              />
              <input
                type="date"
                value={source.date || ""}
                onChange={(e) =>
                  editor.updateSource(source.id, { date: e.target.value })
                }
                className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-600 focus:outline-none text-sm"
              />
              <button
                onClick={() => editor.deleteSource(source.id)}
                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition text-sm"
              >
                <Trash2 size={16} />
                Supprimer source
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-slate-700">
        <button
          onClick={() => handleSaveArticle("draft")}
          disabled={editor.loading || !canSave}
          title={!canSave ? "Veuillez corriger les erreurs avant de sauvegarder" : ""}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {editor.loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Enregistrer en brouillon
        </button>
        <button
          onClick={() => handleSaveArticle("submitted_for_review")}
          disabled={editor.loading || !canSave}
          title={!canSave ? "Veuillez corriger les erreurs avant de soumettre" : ""}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {editor.loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Soumettre pour validation
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (activeSectionId && e.target.files) {
            handleImageUpload(activeSectionId, e.target.files);
          }
        }}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={(e) => {
          if (e.target.files) {
            handleVideoUpload(e.target.files);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
