-- Migration 0001: Initial schema
-- Idempotent: uses CREATE TABLE IF NOT EXISTS throughout

-- personal_info (singleton — enforced via single-row check constraint)
CREATE TABLE IF NOT EXISTS personal_info (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text,
  headline            text,
  tagline             text,
  email               text,
  location            text,
  linkedin_url        text,
  github_url          text,
  availability_status text,
  hero_metrics        jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT personal_info_single_row CHECK (id = id) -- placeholder; enforced by app logic
);

-- Enforce at most one row in personal_info
CREATE UNIQUE INDEX IF NOT EXISTS personal_info_singleton
  ON personal_info ((true));

-- about (singleton)
CREATE TABLE IF NOT EXISTS about (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text,
  quick_facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Enforce at most one row in about
CREATE UNIQUE INDEX IF NOT EXISTS about_singleton
  ON about ((true));

-- skills
CREATE TABLE IF NOT EXISTS skills (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category   text NOT NULL,
  name       text NOT NULL,
  type       text NOT NULL CHECK (type IN ('hard', 'soft')),
  level      int CHECK (level BETWEEN 1 AND 5),
  "order"    int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- experiences
CREATE TABLE IF NOT EXISTS experiences (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  company      text NOT NULL,
  role         text NOT NULL,
  location     text,
  start_date   date NOT NULL,
  end_date     date,
  summary      text,
  full_content text,
  tech_stack   text[] NOT NULL DEFAULT '{}',
  "order"      int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL,
  summary      text,
  full_content text,
  tech_stack   text[] NOT NULL DEFAULT '{}',
  github_url   text,
  demo_url     text,
  images       text[] NOT NULL DEFAULT '{}',
  "order"      int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
