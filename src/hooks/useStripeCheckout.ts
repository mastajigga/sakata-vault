"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

interface CheckoutResponse {
  success: boolean;
  sessionId?: string;
  error?: string;
  message?: string;
}

export function useStripeCheckout() {
  const { user, subscriptionTier } = useAuth() as any;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user already has active premium subscription
  const canPurchase = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error: fetchError } = await supabase
        .from("chat_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .eq("tier", "premium")
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows found (expected)
        console.error("Error checking subscription:", fetchError);
        return true; // Allow checkout if error
      }

      // If subscription exists and is still valid
      if (data && new Date(data.current_period_end) > new Date()) {
        return false;
      }

      return true;
    } catch (err) {
      console.error("useStripeCheckout.canPurchase:", err);
      return true;
    }
  }, [user?.id]);

  // Create a checkout session
  const createCheckoutSession = useCallback(
    async (priceId: string): Promise<CheckoutResponse> => {
      if (!user?.id) {
        return { success: false, error: "Utilisateur non authentifié" };
      }

      if (subscriptionTier === "premium") {
        return { success: false, error: "Vous êtes déjà Premium" };
      }

      setLoading(true);
      setError(null);

      try {
        // Verify user can purchase
        const canBuy = await canPurchase();
        if (!canBuy) {
          return { success: false, error: "Vous êtes déjà Premium" };
        }

        // Create checkout session
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            userId: user.id,
            email: user.email,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          return { success: false, error: errData.error || "Erreur checkout" };
        }

        const data = await response.json();

        if (data.sessionId) {
          // Store session ID in sessionStorage to prevent accidental reloads
          sessionStorage.setItem("stripe_session_id", data.sessionId);
        }

        return { success: true, sessionId: data.sessionId };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [user?.id, subscriptionTier, canPurchase]
  );

  return {
    loading,
    error,
    createCheckoutSession,
    canPurchase,
    isAlreadyPremium: subscriptionTier === "premium",
  };
}
