"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Check, X, Loader2, AlertCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  content: any;
  status: string;
  requires_premium: boolean;
  profiles: { username: string; email: string };
}

export default function ArticleReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userRole } = useAuth() as any;

  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [autoApproveAuthor, setAutoApproveAuthor] = useState(false);

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-slate-400">Seuls les administrateurs peuvent valider les articles.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            profiles:author_id (username, email)
          `)
          .eq("id", articleId)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handlePublish = async (shouldAutoApprove = false) => {
    setReviewing(true);
    try {
      const updates: any = {
        status: "published",
        published_at: new Date().toISOString(),
      };

      if (shouldAutoApprove && article) {
        updates.auto_approved_users = [article.author_id];
      }

      const { error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", articleId);

      if (error) throw error;

      router.push("/admin/article");
    } catch (err) {
      console.error("Error publishing article:", err);
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    setReviewing(true);
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          status: "rejected",
          rejection_reason: reviewNotes || null,
        })
        .eq("id", articleId);

      if (error) throw error;

      router.push("/admin/article");
    } catch (err) {
      console.error("Error rejecting article:", err);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Article non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span>Par {article.profiles.username}</span>
            <span>({article.profiles.email})</span>
            {article.requires_premium && (
              <span className="px-2 py-1 bg-amber-600/20 text-amber-300 rounded text-xs">
                Contenu Premium
              </span>
            )}
          </div>
        </div>

        {/* Article Preview */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8 mb-8 space-y-8">
          {article.content.sections.map((section: any, idx: number) => (
            <div key={idx}>
              {section.heading && (
                <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
              )}
              <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                {section.text}
              </p>
              {section.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {section.images.map((img: any) => (
                    <figure key={img.id} className="space-y-2">
                      <img
                        src={img.url}
                        alt={img.caption || "Article image"}
                        className="w-full h-48 object-cover rounded"
                      />
                      {img.caption && (
                        <figcaption className="text-sm text-slate-400 italic">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Sources */}
          {article.content.sources.length > 0 && (
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-xl font-bold mb-4">Sources</h3>
              <ul className="space-y-2">
                {article.content.sources.map((source: any) => (
                  <li key={source.id} className="text-slate-300">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 transition"
                    >
                      {source.title}
                    </a>
                    {source.author && <span> — {source.author}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Review Panel */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6 space-y-4">
          <h2 className="text-xl font-bold">Validation</h2>

          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Notes de révision ou raison de rejet (optionnel)..."
            className="w-full rounded border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none resize-none h-24"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoApprove"
              checked={autoApproveAuthor}
              onChange={(e) => setAutoApproveAuthor(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-amber-600 focus:ring-amber-600"
            />
            <label htmlFor="autoApprove" className="text-sm text-slate-200">
              Approuver automatiquement les futurs articles de {article.profiles.username}
            </label>
          </div>

          {autoApproveAuthor && (
            <div className="flex gap-3 rounded bg-amber-500/10 border border-amber-500/30 p-3">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300">
                Les prochains articles de cet auteur seront publiés automatiquement.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handlePublish(autoApproveAuthor)}
              disabled={reviewing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {reviewing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              Publier
            </button>
            <button
              onClick={handleReject}
              disabled={reviewing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {reviewing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <X size={18} />
              )}
              Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
