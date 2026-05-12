-- Migration 0004: add images column to experiences
-- Idempotent — safe to run multiple times

ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
