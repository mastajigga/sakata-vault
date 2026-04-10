"use client";

import { useState, useCallback, useEffect } from "react";

export interface CommunityPin {
  id: string;
  title: string;
  description: string;
  annotation_type: "photo" | "video" | "story" | "memory" | "question" | "proverb" | "historical";
  coordinates: [number, number];
  user_name?: string;
  media_urls?: string[];
  likes_count: number;
  is_verified: boolean;
  created_at: string;
}

/**
 * Hook pour gérer les épingles communautaires.
 * Actuellement avec des données mockées, prêt pour l'intégration Supabase.
 */
export function useCommunityPins() {
  const [pins, setPins] = useState<CommunityPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données simulées
  const mockPins: CommunityPin[] = [
    {
      id: "1",
      title: "Village de mon grand-père",
      description: "Ici se trouvait le village de mon grand-père, un lieu de mémoire pour notre famille.",
      annotation_type: "story",
      user_name: "Jean-Pierre M.",
      likes_count: 12,
      coordinates: [17.75, -2.95],
      is_verified: true,
      created_at: "2026-04-01",
    },
    {
      id: "2",
      title: "Pêche collective sur la Lebili",
      description: "Photo de la pêche annuelle collective sur la rivière Lebili.",
      annotation_type: "photo",
      user_name: "Marie K.",
      likes_count: 24,
      coordinates: [17.68, -2.82],
      is_verified: false,
      created_at: "2026-03-28",
    },
    {
      id: "3",
      title: "Proverbe du jour",
      description: "\"La rivière ne tarit pas, elle change de chemin.\" — Proverbe sakata",
      annotation_type: "proverb",
      user_name: "Sage Mboko",
      likes_count: 45,
      coordinates: [17.82, -2.92],
      is_verified: true,
      created_at: "2026-03-25",
    },
  ];

  const fetchPins = useCallback(async (bounds?: { west: number; south: number; east: number; north: number }) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Remplacer par l'appel Supabase
      // const { data, error } = await supabasePublic
      //   .from("map_annotations")
      //   .select("*")
      //   .gte("location", bounds?.west)
      //   .lte("location", bounds?.east);
      
      setPins(bounds ? mockPins : mockPins);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPin = useCallback(async (pin: Omit<CommunityPin, "id" | "likes_count" | "is_verified" | "created_at">) => {
    // TODO: Appel Supabase pour créer l'épingle
    const newPin: CommunityPin = {
      ...pin,
      id: `pin-${Date.now()}`,
      likes_count: 0,
      is_verified: false,
      created_at: new Date().toISOString().split("T")[0],
    };
    setPins((prev) => [...prev, newPin]);
    return newPin;
  }, []);

  const deletePin = useCallback(async (pinId: string) => {
    // TODO: Appel Supabase pour supprimer
    setPins((prev) => prev.filter((p) => p.id !== pinId));
  }, []);

  const likePin = useCallback(async (pinId: string) => {
    // TODO: Appel Supabase pour voter
    setPins((prev) =>
      prev.map((p) =>
        p.id === pinId ? { ...p, likes_count: p.likes_count + 1 } : p
      )
    );
  }, []);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  return {
    pins,
    loading,
    error,
    fetchPins,
    createPin,
    deletePin,
    likePin,
  };
}