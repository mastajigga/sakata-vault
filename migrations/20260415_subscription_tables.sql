-- Migration: Subscription sessions and subscription tracking
-- Date: 2026-04-15
-- Purpose: Prevent double-charging and track Stripe subscription lifecycle

-- Table: subscription_sessions
-- Tracks individual checkout session attempts to prevent duplicates
CREATE TABLE IF NOT EXISTS public.subscription_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id varchar UNIQUE NOT NULL,
  stripe_subscription_id varchar,
  status varchar NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'failed')),
  created_at timestamp DEFAULT now(),
  completed_at timestamp,
  amount integer NOT NULL COMMENT 'Amount in cents',
  currency varchar NOT NULL DEFAULT 'EUR'
);

CREATE INDEX IF NOT EXISTS idx_subscription_sessions_user_id ON public.subscription_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sessions_status ON public.subscription_sessions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_sessions_stripe_session_id ON public.subscription_sessions(stripe_session_id);

-- Table: chat_subscriptions
-- Tracks active user subscriptions (single entry per user)
CREATE TABLE IF NOT EXISTS public.chat_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id varchar NOT NULL,
  stripe_subscription_id varchar,
  tier varchar NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  status varchar NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start timestamp NOT NULL,
  current_period_end timestamp NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_subscriptions_user_id ON public.chat_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_subscriptions_status ON public.chat_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_chat_subscriptions_tier ON public.chat_subscriptions(tier);

-- RLS: subscription_sessions
ALTER TABLE public.subscription_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.subscription_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all"
  ON public.subscription_sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS: chat_subscriptions
ALTER TABLE public.chat_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.chat_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all"
  ON public.chat_subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Helper function: Check if user has active premium subscription
CREATE OR REPLACE FUNCTION public.is_premium_subscriber(p_user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.chat_subscriptions
    WHERE user_id = p_user_id
      AND tier = 'premium'
      AND status = 'active'
      AND current_period_end > now()
  );
$$ LANGUAGE SQL STABLE;

-- Update profiles.subscription_tier based on chat_subscriptions
CREATE OR REPLACE TRIGGER tr_sync_subscription_tier
AFTER INSERT OR UPDATE ON public.chat_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.fn_sync_subscription_tier();

CREATE OR REPLACE FUNCTION public.fn_sync_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET subscription_tier = CASE
    WHEN NEW.tier = 'premium' AND NEW.status = 'active' THEN 'premium'
    ELSE 'free'
  END
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
