"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { Undo2, Trash2, Loader2 } from "lucide-react";
import { DB_TABLES } from "@/lib/constants/db";
import { withRetry } from "@/lib/supabase-retry";

interface DeletedArticle {
  id: string;
  title: string;
  slug: string;
  deleted_at: string;
}

interface DeletedThread {
  id: string;
  title: string;
  slug: string;
  deleted_at: string;
}

export default function ArchivePage() {
  const { user } = useAuth();
  const [deletedArticles, setDeletedArticles] = useState<DeletedArticle[]>([]);
  const [deletedThreads, setDeletedThreads] = useState<DeletedThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadDeletedItems();
  }, [user]);

  const loadDeletedItems = async () => {
    try {
      setLoading(true);

      // Fetch deleted articles
      const { data: articles } = await supabase
        .from(DB_TABLES.ARTICLES)
        .select("id, title, slug, deleted_at")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      // Fetch deleted forum threads
      const { data: threads } = await supabase
        .from(DB_TABLES.FORUM_THREADS)
        .select("id, title, slug, deleted_at")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      setDeletedArticles((articles || []) as DeletedArticle[]);
      setDeletedThreads((threads || []) as DeletedThread[]);
    } catch (error) {
      console.error("Error loading deleted items:", error);
    } finally {
      setLoading(false);
    }
  };

  const recoverArticle = async (id: string) => {
    setRecovering(id);
    try {
      await withRetry(async () =>
        supabase
          .from(DB_TABLES.ARTICLES)
          .update({ deleted_at: null })
          .eq("id", id)
      );
      setDeletedArticles(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error recovering article:", error);
      alert("Erreur lors de la récupération de l'article");
    } finally {
      setRecovering(null);
    }
  };

  const recoverThread = async (id: string) => {
    setRecovering(id);
    try {
      await withRetry(async () =>
        supabase
          .from(DB_TABLES.FORUM_THREADS)
          .update({ deleted_at: null })
          .eq("id", id)
      );
      setDeletedThreads(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error recovering thread:", error);
      alert("Erreur lors de la récupération du sujet");
    } finally {
      setRecovering(null);
    }
  };

  const permanentlyDeleteArticle = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ? Cette action est irréversible.")) return;

    try {
      await withRetry(async () =>
        supabase
          .from(DB_TABLES.ARTICLES)
          .delete()
          .eq("id", id)
      );
      setDeletedArticles(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-stone-900 dark:text-white">Éléments Archivés</h1>

      {/* Deleted Articles */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-stone-800 dark:text-stone-200">
          Articles supprimés ({deletedArticles.length})
        </h2>
        {deletedArticles.length === 0 ? (
          <p className="text-stone-500 text-sm">Aucun article supprimé</p>
        ) : (
          <div className="space-y-2">
            {deletedArticles.map(article => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-white">{article.title}</h3>
                  <p className="text-xs text-stone-500">
                    Supprimé {new Date(article.deleted_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => recoverArticle(article.id)}
                    disabled={recovering === article.id}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition disabled:opacity-50"
                  >
                    <Undo2 size={14} />
                    Récupérer
                  </button>
                  <button
                    onClick={() => permanentlyDeleteArticle(article.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deleted Threads */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-stone-800 dark:text-stone-200">
          Sujets supprimés ({deletedThreads.length})
        </h2>
        {deletedThreads.length === 0 ? (
          <p className="text-stone-500 text-sm">Aucun sujet supprimé</p>
        ) : (
          <div className="space-y-2">
            {deletedThreads.map(thread => (
              <div
                key={thread.id}
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-white">{thread.title}</h3>
                  <p className="text-xs text-stone-500">
                    Supprimé {new Date(thread.deleted_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => recoverThread(thread.id)}
                    disabled={recovering === thread.id}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition disabled:opacity-50"
                  >
                    <Undo2 size={14} />
                    Récupérer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
