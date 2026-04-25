"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface ArticleSection {
  id: string;
  type: "paragraph" | "heading";
  heading?: string;
  text: string;
  images: ArticleImage[];
}

export interface ArticleImage {
  id: string;
  url: string;
  caption: string;
}

export interface ArticleSource {
  id: string;
  title: string;
  url: string;
  author?: string;
  date?: string;
}

export interface ArticleContent {
  sections: ArticleSection[];
  sources: ArticleSource[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  featured_image_url?: string;
  hero_video_url?: string;
  content: ArticleContent;
  status: "draft" | "submitted_for_review" | "published" | "rejected";
  requires_premium: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export function useArticleEditor(initialArticle?: Article) {
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [sections, setSections] = useState<ArticleSection[]>(
    initialArticle?.content.sections || []
  );
  const [sources, setSources] = useState<ArticleSource[]>(
    initialArticle?.content.sources || []
  );
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialArticle?.hero_video_url || "");
  const [requiresPremium, setRequiresPremium] = useState(
    initialArticle?.requires_premium || false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }, []);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (!initialArticle) {
      setSlug(generateSlug(newTitle));
    }
  }, [initialArticle, generateSlug]);

  const addSection = useCallback((afterId?: string) => {
    const newSection: ArticleSection = {
      id: Math.random().toString(36).substr(2, 9),
      type: "paragraph",
      text: "",
      images: [],
    };

    if (afterId) {
      const index = sections.findIndex((s) => s.id === afterId);
      setSections([...sections.slice(0, index + 1), newSection, ...sections.slice(index + 1)]);
    } else {
      setSections([...sections, newSection]);
    }
  }, [sections]);

  const updateSection = useCallback(
    (id: string, updates: Partial<ArticleSection>) => {
      setSections(
        sections.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        )
      );
    },
    [sections]
  );

  const deleteSection = useCallback(
    (id: string) => {
      setSections(sections.filter((s) => s.id !== id));
    },
    [sections]
  );

  const addImageToSection = useCallback(
    (sectionId: string, image: ArticleImage) => {
      updateSection(sectionId, {
        images: [
          ...(sections.find((s) => s.id === sectionId)?.images || []),
          image,
        ],
      });
    },
    [sections, updateSection]
  );

  const removeImageFromSection = useCallback(
    (sectionId: string, imageId: string) => {
      updateSection(sectionId, {
        images: (sections.find((s) => s.id === sectionId)?.images || []).filter(
          (img) => img.id !== imageId
        ),
      });
    },
    [sections, updateSection]
  );

  const addSource = useCallback(
    (source: Omit<ArticleSource, "id">) => {
      setSources([
        ...sources,
        { ...source, id: Math.random().toString(36).substr(2, 9) },
      ]);
    },
    [sources]
  );

  const updateSource = useCallback(
    (id: string, updates: Partial<ArticleSource>) => {
      setSources(
        sources.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        )
      );
    },
    [sources]
  );

  const deleteSource = useCallback(
    (id: string) => {
      setSources(sources.filter((s) => s.id !== id));
    },
    [sources]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(`articles/${fileName}`, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("article-images")
          .getPublicUrl(`articles/${fileName}`);

        return publicUrl;
      } catch (err) {
        console.error("Image upload error:", err);
        setError("Erreur lors de l'upload de l'image");
        return null;
      }
    },
    []
  );

  const uploadVideo = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          setError("Vidéo trop volumineux. Maximum 50MB");
          return null;
        }

        const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
        if (!validTypes.includes(file.type)) {
          setError("Format vidéo non supporté. Utilisez MP4, WebM ou MOV");
          return null;
        }

        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("article-videos")
          .upload(`articles/${fileName}`, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("article-videos")
          .getPublicUrl(`articles/${fileName}`);

        setHeroVideoUrl(publicUrl);
        return publicUrl;
      } catch (err) {
        console.error("Video upload error:", err);
        setError("Erreur lors de l'upload de la vidéo");
        return null;
      }
    },
    []
  );

  const saveArticle = useCallback(
    async (
      status: "draft" | "submitted_for_review" = "draft"
    ): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        if (!title.trim()) {
          setError("Le titre est requis");
          return null;
        }

        if (!slug.trim()) {
          setError("Le slug est requis");
          return null;
        }

        if (sections.length === 0) {
          setError("Au moins une section est requise");
          return null;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Non authentifié");
          return null;
        }

        const articleData = {
          title,
          slug,
          content: { sections, sources },
          status,
          requires_premium: requiresPremium,
          hero_video_url: heroVideoUrl || null,
          author_id: user.id,
        };

        let result;
        if (initialArticle) {
          result = await supabase
            .from("articles")
            .update(articleData)
            .eq("id", initialArticle.id)
            .select()
            .single();
        } else {
          result = await supabase
            .from("articles")
            .insert([articleData])
            .select()
            .single();
        }

        if (result.error) throw result.error;

        return result.data?.id || null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [title, slug, sections, sources, requiresPremium, heroVideoUrl, initialArticle]
  );

  return {
    title,
    setTitle: handleTitleChange,
    slug,
    setSlug,
    sections,
    addSection,
    updateSection,
    deleteSection,
    addImageToSection,
    removeImageFromSection,
    sources,
    addSource,
    updateSource,
    deleteSource,
    heroVideoUrl,
    setHeroVideoUrl,
    requiresPremium,
    setRequiresPremium,
    uploadImage,
    uploadVideo,
    saveArticle,
    loading,
    error,
    setError,
  };
}
