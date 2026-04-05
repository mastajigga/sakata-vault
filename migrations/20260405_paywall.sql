-- Migration: Paywall System

-- Add is_premium column to articles 
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Add subscription_tier column to profiles ('free', 'premium', 'elite')
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- Grant access to the new columns for the frontend
-- Note: Assuming table already has public RLS, this column addition will inherit the select rules.
