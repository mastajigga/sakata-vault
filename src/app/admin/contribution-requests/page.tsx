"use client";

import { DB_TABLES } from "@/lib/constants/db";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Clock, Loader2 } from "lucide-react";

interface ContributionRequest {
  id: string;
  user_id: string;
  request_type: "article_writer" | "contributor";
  contributor_type?: string | null;
  contributor_type_other?: string | null;
  origin?: string | null;
  motivation?: string | null;
  can_share?: string[] | null;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    nickname: string;
    username: string;
  };
}

const CONTRIBUTOR_TYPE_LABELS: Record<string, string> = {
  habitant_region: "🏠 Habitant de la région",
  scolaire: "📚 Scolaire / Étudiant",
  historien: "📜 Historien",
  anthropologue: "🔬 Anthropologue",
  photo: "📸 Photo / Vidéo",
  patrimoine: "🏛️ Patrimoine",
  autre: "✨ Autre",
};

const CAN_SHARE_LABELS: Record<string, string> = {
  photos: "Photos",
  videos: "Vidéos",
  articles: "Articles",
  temoignages: "Témoignages",
  archives_familiales: "Archives familiales",
  documents_historiques: "Documents historiques",
  audio: "Audio",
  autre: "Autre",
};

export default function ContributionRequestsPage() {
  const { role } = useAuth();
  const [requests, setRequests] = useState<ContributionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(DB_TABLES.CONTRIBUTION_REQUESTS)
        .select(`
          *,
          profiles:user_id (
            nickname,
            username
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id: string, userId: string, type: string, status: "approved" | "rejected") {
    try {
      setProcessingId(id);
      
      // Update the request status
      const { error: requestError } = await supabase
        .from(DB_TABLES.CONTRIBUTION_REQUESTS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (requestError) throw requestError;

      // If approved, update user role/status in profiles
      if (status === "approved") {
        const updates: any = {};
        if (type === "contributor") {
          updates.role = "contributor";
          updates.contributor_status = "approved";
        } else if (type === "article_writer") {
          // You might have specific logic for article writers
          updates.role = "contributor";
          updates.contributor_status = "approved";
        }

        const { error: profileError } = await supabase
          .from(DB_TABLES.PROFILES)
          .update(updates)
          .eq("id", userId);

        if (profileError) throw profileError;
      }

      await fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setProcessingId(null);
    }
  }

  if (role !== "admin" && role !== "manager") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-400">Accès réservé au Grand Conseil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--or-ancestral)] to-[#E8D5B5] bg-clip-text text-transparent">
          Demandes de Contribution
        </h1>
        <p className="text-gray-400">Gérez les nouveaux gardiens du savoir Sakata</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--or-ancestral)]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 border border-white/10 rounded-xl bg-white/5 text-center text-gray-500">
            Aucune demande en attente
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-6 border border-white/10 rounded-xl bg-black/40 backdrop-blur-md group hover:border-[var(--or-ancestral)]/30 transition-all duration-300 flex flex-col lg:flex-row lg:items-start gap-6"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-white">
                    {req.profiles?.nickname || req.profiles?.username || "Inconnu"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] border border-[var(--or-ancestral)]/30 capitalize">
                    {req.request_type === "article_writer" ? "Rédacteur" : "Contributeur"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    req.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                    req.status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                    "bg-red-500/10 text-red-500 border-red-500/30"
                  }`}>
                    {req.status === "pending" ? "En attente" : req.status === "approved" ? "Approuvé" : "Refusé"}
                  </span>
                  {req.contributor_type && (
                    <span className="text-xs text-[var(--or-ancestral)]/90">
                      {CONTRIBUTOR_TYPE_LABELS[req.contributor_type] || req.contributor_type}
                      {req.contributor_type === "autre" && req.contributor_type_other && (
                        <span className="text-gray-400"> — {req.contributor_type_other}</span>
                      )}
                    </span>
                  )}
                </div>

                {req.origin && (
                  <div className="text-xs">
                    <span className="font-mono uppercase tracking-widest text-ivoire-ancien/40 mr-2">Origine</span>
                    <span className="text-ivoire-ancien/80">{req.origin}</span>
                  </div>
                )}

                {req.motivation && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ivoire-ancien/40">Motivation</p>
                    <p className="text-sm text-ivoire-ancien/80 leading-relaxed whitespace-pre-wrap">"{req.motivation}"</p>
                  </div>
                )}

                {req.can_share && req.can_share.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ivoire-ancien/40">Peut partager</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.can_share.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md bg-or-ancestral/10 text-or-ancestral border border-or-ancestral/20"
                        >
                          {CAN_SHARE_LABELS[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {req.message && (
                  <p className="text-xs text-gray-400 italic border-l-2 border-white/10 pl-3">"{req.message}"</p>
                )}

                <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(req.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  <span className="text-gray-600">
                    ({formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: fr })})
                  </span>
                </div>
              </div>

              {req.status === "pending" && (
                <div className="flex items-center gap-2 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                  <button
                    onClick={() => updateStatus(req.id, req.user_id, req.request_type, "approved")}
                    disabled={processingId === req.id}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                    title="Approuver"
                  >
                    {processingId === req.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, req.user_id, req.request_type, "rejected")}
                    disabled={processingId === req.id}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    title="Refuser"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
