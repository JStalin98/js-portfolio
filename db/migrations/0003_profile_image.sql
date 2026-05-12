-- Migration 0003: add profile_image_url to personal_info
-- Idempotent: ADD COLUMN IF NOT EXISTS is safe to run multiple times.

ALTER TABLE public.personal_info
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT DEFAULT NULL;
