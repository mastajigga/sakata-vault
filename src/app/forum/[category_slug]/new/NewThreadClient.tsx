"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { MarkdownEditor } from "@/components/forum/MarkdownEditor";
import { Loader2 } from "lucide-react";

export default function NewThreadClient({ categoryId, categorySlug }: { categoryId: string, categorySlug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
        <label htmlFor="title" className="block text-sm font-medium text-[#F2EEDD]/70 mb-2 uppercase tracking-wide">
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
          className="w-full bg-[#122A1E]/50 border border-[#B59551]/20 rounded-xl px-4 py-3 text-[#F2EEDD] placeholder-[#F2EEDD]/30 focus:outline-none focus:border-[#B59551]/50 focus:ring-1 focus:ring-[#B59551]/50 transition-all font-light text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F2EEDD]/70 mb-2 uppercase tracking-wide">
          Message
        </label>
        <MarkdownEditor value={content} onChange={setContent} minHeight="min-h-[400px]" />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="bg-[#B59551] text-[#0A1F15] px-8 py-3 rounded-xl font-medium transition-all hover:bg-[#F2EEDD] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
