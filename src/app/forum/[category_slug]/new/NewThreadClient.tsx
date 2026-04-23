"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MarkdownEditor } from "@/components/forum/MarkdownEditor";
import { Loader2 } from "lucide-react";
import { DB_TABLES } from "@/lib/constants/db";

export default function NewThreadClient({ categoryId, categorySlug }: { categoryId: string, categorySlug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour publier.");

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      // 1. Create Thread
      const { data: threadData, error: threadError } = await supabase
        .from('forum_threads')
        .insert({
          category_id: categoryId,
          title: title.trim(),
          slug,
          created_by: user.id
        })
        .select('id')
        .single();

      if (threadError) throw threadError;

      // 2. Create the first Post (Original Post)
      const { error: postError } = await supabase
        .from('forum_posts')
        .insert({
          thread_id: threadData.id,
          author_id: user.id,
          content: content.trim()
        });

      if (postError) throw postError;

      router.push(`/forum/thread/${slug}`);
      router.refresh();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la création du sujet.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center justify-between">
          <p>{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--ivoire-ancien)]/70 mb-2 uppercase tracking-wide">
          Titre du Sujet
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Un titre clair et évocateur..."
          required
          maxLength={120}
          className="w-full bg-[var(--eau-sombre)]/50 border border-[var(--or-ancestral)]/20 rounded-xl px-4 py-3 text-[var(--ivoire-ancien)] placeholder-[var(--ivoire-ancien)]/30 focus:outline-none focus:border-[var(--or-ancestral)]/50 focus:ring-1 focus:ring-[var(--or-ancestral)]/50 transition-all font-light text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--ivoire-ancien)]/70 mb-2 uppercase tracking-wide">
          Message
        </label>
        <MarkdownEditor value={content} onChange={setContent} minHeight="min-h-[400px]" />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="bg-[var(--or-ancestral)] text-[var(--foret-nocturne)] px-8 py-3 rounded-xl font-medium transition-all hover:bg-[var(--ivoire-ancien)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Publication...
            </>
          ) : (
            "Créer le Sujet"
          )}
        </button>
      </div>
    </form>
  );
}
