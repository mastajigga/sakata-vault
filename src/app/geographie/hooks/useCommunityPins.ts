"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";

export interface CommunityPin {
  id: string;
  title: string;
  description: string;
  annotation_type: "photo" | "video" | "story" | "memory" | "question" | "proverb" | "historical";
  coordinates: [number, number]; // [longitude, latitude]
  user_id?: string;
  user_name?: string;
  media_urls?: string[];
  likes_count: number;
  is_verified: boolean;
  created_at: string;
}

function rowToPin(row: any): CommunityPin {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    annotation_type: row.annotation_type,
    coordinates: [row.longitude, row.latitude],
    user_id: row.user_id ?? undefined,
    user_name: row.user_name ?? undefined,
    media_urls: row.media_urls ?? [],
    likes_count: row.likes_count ?? 0,
    is_verified: row.is_verified ?? false,
    created_at: row.created_at,
  };
}

/**
 * Hook pour gérer les épingles communautaires.
 * Branché sur Supabase — table `community_pins`.
 */
export function useCommunityPins() {
  const [pins, setPins] = useState<CommunityPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPins = useCallback(async (bounds?: { west: number; south: number; east: number; north: number }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await withRetry<any[]>(() => {
        let q = supabase
          .from(DB_TABLES.COMMUNITY_PINS)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (bounds) {
          q = q
            .gte("longitude", bounds.west)
            .lte("longitude", bounds.east)
            .gte("latitude", bounds.south)
            .lte("latitude", bounds.north);
        }

        return q;
      });
      if (fetchError) throw fetchError;
      setPins((data ?? []).map(rowToPin));
    } catch (err) {
      console.error("[useCommunityPins] fetchPins:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPin = useCallback(async (
    pin: Omit<CommunityPin, "id" | "likes_count" | "is_verified" | "created_at">
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error: insertError } = await withRetry(() =>
        supabase
          .from(DB_TABLES.COMMUNITY_PINS)
          .insert({
            title: pin.title,
            description: pin.description,
            annotation_type: pin.annotation_type,
            longitude: pin.coordinates[0],
            latitude: pin.coordinates[1],
            user_id: user.id,
            user_name: pin.user_name,
            media_urls: pin.media_urls ?? [],
          })
          .select()
          .single()
      );

      if (insertError) throw insertError;
      const newPin = rowToPin(data);
      setPins((prev) => [newPin, ...prev]);
      return newPin;
    } catch (err) {
      console.error("[useCommunityPins] createPin:", err);
      throw err;
    }
  }, []);

  const deletePin = useCallback(async (pinId: string) => {
    // Optimistic update
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    try {
      const { error: deleteError } = await withRetry(() =>
        supabase
          .from(DB_TABLES.COMMUNITY_PINS)
          .delete()
          .eq("id", pinId)
      );
      if (deleteError) {
        // Rollback on error — refetch
        console.error("[useCommunityPins] deletePin:", deleteError);
        fetchPins();
      }
    } catch (err) {
      console.error("[useCommunityPins] deletePin:", err);
      fetchPins();
    }
  }, [fetchPins]);

  const likePin = useCallback(async (pinId: string) => {
    // Optimistic update
    setPins((prev) =>
      prev.map((p) => p.id === pinId ? { ...p, likes_count: p.likes_count + 1 } : p)
    );
    try {
      const { error: rpcError } = await supabase.rpc("increment_pin_likes", { pin_id: pinId });
      if (rpcError) {
        // Fallback: direct update
        const pin = pins.find((p) => p.id === pinId);
        if (pin) {
          await withRetry(() =>
            supabase
              .from(DB_TABLES.COMMUNITY_PINS)
              .update({ likes_count: pin.likes_count + 1 })
              .eq("id", pinId)
          );
        }
      }
    } catch (err) {
      console.error("[useCommunityPins] likePin:", err);
    }
  }, [pins]);

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
