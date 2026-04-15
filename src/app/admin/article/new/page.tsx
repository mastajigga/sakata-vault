"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArticleEditor } from "@/components/ArticleEditor";
import { useAuth } from "@/components/AuthProvider";
import { ROUTES } from "@/lib/constants/routes";
import { ChevronLeft } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();
  const { role } = useAuth() as any;

  if (role !== "admin" && role !== "contributor") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-slate-400">Seuls les contributeurs peuvent créer des articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href={ROUTES.CONTRIBUTEUR}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Retour au tableau de bord
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nouvel Article</h1>
          <p className="text-slate-400">Rédigez un article pour enrichir la connaissance Sakata</p>
        </div>
        <ArticleEditor onSave={(id) => {
          router.push(`/admin/article/${id}/review`);
        }} />
      </div>
    </div>
  );
}
