"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ContributorBadge } from "@/components/badges/ContributorBadge";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "@/lib/constants/routes";
import { motion } from "framer-motion";
import { FileText, Plus, AlertCircle, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title: string;
  status: "draft" | "review" | "published";
  created_at: string;
  updated_at: string;
  views?: number;
}

export default function ContributorPage() {
  const { user, role, isLoading } = useAuth() as any;
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
  });
  const [contributorStatus, setContributorStatus] = useState<string>("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.AUTH);
      return;
    }

    if (!isLoading && user) {
      fetchContributorData();
    }
  }, [user, isLoading, router]);

  const fetchContributorData = async () => {
    try {
      // Fetch contributor status
      const { data: profile } = await supabase
        .from("profiles")
        .select("contributor_status")
        .eq("id", user.id)
        .single();

      setContributorStatus(profile?.contributor_status || "none");

      // Fetch articles
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, status, created_at, updated_at")
        .eq("author_id", user.id)
        .order("updated_at", { ascending: false });

      if (articlesData) {
        setArticles(articlesData);
        setStats({
          total: articlesData.length,
          published: articlesData.filter((a) => a.status === "published").length,
          draft: articlesData.filter((a) => a.status === "draft").length,
          totalViews: 0, // TODO: stats d'analytics
        });
      }
    } catch (error) {
      console.error("Error fetching contributor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-32 pb-24 px-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-[#C16B34]/30 border-t-[#C16B34] mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const isApproved = contributorStatus === "approved";
  const isPending = contributorStatus === "pending";
  const isRejected = contributorStatus === "rejected";

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href={ROUTES.HOME} className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-white">Espace Contributeur</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-light mb-4">
            Espace Contributeur
          </h1>
          <p className="text-gray-400 mb-6">
            Gérez vos articles et consultez votre statut de contributeur.
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <ContributorBadge status={contributorStatus as any} size="lg" />
          </div>
        </motion.div>

        {/* Content by status */}
        {!isApproved && contributorStatus === "none" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center"
          >
            <BookOpen size={48} className="mx-auto mb-4 text-[#C16B34] opacity-50" />
            <h2 className="text-2xl font-light mb-3">Devenez contributeur</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Partagez votre savoir et contribuez à la transmission des traditions Sakata.
              Lisez notre guide pour en savoir plus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={ROUTES.PROFIL}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#C16B34] hover:bg-[#a85a2a] text-white rounded-lg transition-colors"
              >
                Demander l'accès
              </Link>
              <Link
                href={ROUTES.CONTRIBUTEUR_GUIDE}
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 hover:border-white/40 rounded-lg transition-colors"
              >
                Lire le guide
              </Link>
            </div>
          </motion.div>
        )}

        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-[#C16B34]/30 bg-[#C16B34]/10 backdrop-blur-sm p-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-[#C16B34] mt-1 shrink-0" />
              <div>
                <h2 className="text-xl font-light mb-2">Demande en attente d'approbation</h2>
                <p className="text-gray-400 mb-4">
                  Votre demande pour devenir contributeur est en cours d'examen.
                  Nos équipes vous répondront dans les 48 heures.
                </p>
                <Link
                  href={ROUTES.CONTRIBUTEUR_GUIDE}
                  className="text-[#C16B34] hover:underline text-sm"
                >
                  En savoir plus sur le processus →
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {isRejected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-8 mb-12"
          >
            <h2 className="text-xl font-light mb-2 text-red-400">Demande rejetée</h2>
            <p className="text-gray-400 mb-4">
              Malheureusement, votre demande n'a pas pu être approuvée cette fois-ci.
              Vous pouvez repostuler après avoir amélioré votre profil.
            </p>
            <Link
              href={ROUTES.PROFIL}
              className="text-red-400 hover:underline text-sm"
            >
              Repostuler →
            </Link>
          </motion.div>
        )}

        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Quick Actions */}
            <div className="mb-12">
              <Link
                href={ROUTES.ARTICLE_NEW}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C16B34] hover:bg-[#a85a2a] text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                Écrire un article
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6"
              >
                <p className="text-gray-400 text-sm mb-2">Total d'articles</p>
                <p className="text-3xl font-light">{stats.total}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6"
              >
                <p className="text-gray-400 text-sm mb-2">Publiés</p>
                <p className="text-3xl font-light text-green-400">{stats.published}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6"
              >
                <p className="text-gray-400 text-sm mb-2">Brouillons</p>
                <p className="text-3xl font-light text-[#C16B34]">{stats.draft}</p>
              </motion.div>
            </div>

            {/* Articles */}
            {articles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-light mb-6">Mes articles</h2>
                <div className="space-y-3">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`${ROUTES.ARTICLE_NEW}?id=${article.id}`}
                      className="block p-4 rounded-lg border border-white/10 hover:border-[#C16B34]/50 bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-[#C16B34]" />
                            <h3 className="text-lg font-light group-hover:text-[#C16B34] transition-colors">
                              {article.title || "Sans titre"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400">
                            Modifié le {new Date(article.updated_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            article.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : article.status === "review"
                              ? "bg-[#C16B34]/20 text-[#C16B34]"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {article.status === "published"
                            ? "Publié"
                            : article.status === "review"
                            ? "En révision"
                            : "Brouillon"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {articles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center py-12"
              >
                <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-4">Aucun article pour le moment</p>
                <Link
                  href={ROUTES.ARTICLE_NEW}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#C16B34] text-[#C16B34] hover:bg-[#C16B34]/10 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  Créer votre premier article
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
