"use client";

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
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  profiles?: {
    username: string;
    email: string;
    avatar_url: string | null;
  };
}

export default function ContributionRequestsPage() {
  const { user, userRole } = useAuth() as any;
  const [requests, setRequests] = useState<ContributionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Check admin access
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Accès Refusé</h1>
          <p className="text-slate-400">Seuls les administrateurs peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let query = supabase
          .from("contribution_requests")
          .select(`
            *,
            profiles:user_id (username, email, avatar_url)
          `)
          .order("created_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRequests(data || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filter]);

  const handleReview = async (requestId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("contribution_requests")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          notes: reviewNotes || null,
        })
        .eq("id", requestId);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: newStatus, reviewed_at: new Date().toISOString(), notes: reviewNotes || null }
            : req
        )
      );

      setReviewingId(null);
      setReviewNotes("");
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Rejetée",
    };
    return labels[status] || status;
  };

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Demandes de Contribution</h1>
          <p className="text-slate-400">Gérez les demandes pour devenir documentaliste culturel ou contributeur</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f
                  ? "bg-amber-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {f === "all" ? "Toutes" : getStatusLabel(f)}
              <span className="ml-2 text-sm">
                ({requests.filter((r) => f === "all" || r.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800">
              <p className="text-slate-400">Aucune demande à afficher</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-slate-700 bg-slate-900/30 p-6 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {request.profiles?.avatar_url ? (
                      <img
                        src={request.profiles.avatar_url}
                        alt={request.profiles.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                        <span className="text-amber-400 font-bold">
                          {request.profiles?.username[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {request.profiles?.username}
                      </h3>
                      <p className="text-sm text-slate-400">{request.profiles?.email}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                          {request.request_type === "article_writer"
                            ? "Documentaliste Culturel"
                            : "Contributeur"}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                          {getStatusIcon(request.status)}
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </div>
                </div>

                {/* Message */}
                {request.message && (
                  <div className="mb-4 p-4 bg-slate-800/50 rounded border border-slate-700">
                    <p className="text-sm text-slate-300">{request.message}</p>
                  </div>
                )}

                {/* Review Section */}
                {request.status === "pending" && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-slate-700">
                    {reviewingId === request.id ? (
                      <>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Notes de révision (optionnel)"
                          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none text-sm resize-none h-20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(request.id, "approved")}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReview(request.id, "rejected")}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition flex items-center justify-center gap-2"
                          >
                            <X size={16} />
                            Rejeter
                          </button>
                          <button
                            onClick={() => {
                              setReviewingId(null);
                              setReviewNotes("");
                            }}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => setReviewingId(request.id)}
                        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                      >
                        Examiner
                      </button>
                    )}
                  </div>
                )}

                {/* Reviewed Info */}
                {request.reviewed_at && (
                  <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
                    <p>
                      Examinée le {format(new Date(request.reviewed_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                    {request.notes && (
                      <p className="mt-2 text-slate-300">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
