-- Migration: Contribution Requests System
-- Date: 2026-04-15
-- Purpose: Unified system for managing article writer contributions

CREATE TABLE IF NOT EXISTS public.contribution_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type varchar NOT NULL DEFAULT 'article_writer' CHECK (request_type IN ('article_writer', 'contributor')),
  status varchar NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message text,
  created_at timestamp DEFAULT now(),
  reviewed_at timestamp,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text COMMENT 'Admin notes during review'
);

CREATE INDEX IF NOT EXISTS idx_contribution_requests_user_id ON public.contribution_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_contribution_requests_status ON public.contribution_requests(status);
CREATE INDEX IF NOT EXISTS idx_contribution_requests_created_at ON public.contribution_requests(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contribution_requests_unique_pending ON public.contribution_requests(user_id, request_type) WHERE status = 'pending';

-- RLS
ALTER TABLE public.contribution_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON public.contribution_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
  ON public.contribution_requests FOR SELECT
  USING (
    (SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert own requests"
  ON public.contribution_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all requests"
  ON public.contribution_requests FOR UPDATE
  USING (
    (SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Service role bypass
CREATE POLICY "Service role all access"
  ON public.contribution_requests FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
