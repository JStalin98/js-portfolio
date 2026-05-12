-- Migration 0002: Row Level Security
-- Idempotent: drops each policy before recreating it

-- ─── Enable RLS on all tables ───────────────────────────────────────────────

ALTER TABLE personal_info    ENABLE ROW LEVEL SECURITY;
ALTER TABLE about            ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ─── personal_info ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "personal_info: public select"  ON personal_info;
DROP POLICY IF EXISTS "personal_info: admin insert"   ON personal_info;
DROP POLICY IF EXISTS "personal_info: admin update"   ON personal_info;
DROP POLICY IF EXISTS "personal_info: admin delete"   ON personal_info;

CREATE POLICY "personal_info: public select"
  ON personal_info FOR SELECT
  USING (true);

CREATE POLICY "personal_info: admin insert"
  ON personal_info FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "personal_info: admin update"
  ON personal_info FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "personal_info: admin delete"
  ON personal_info FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── about ───────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "about: public select"  ON about;
DROP POLICY IF EXISTS "about: admin insert"   ON about;
DROP POLICY IF EXISTS "about: admin update"   ON about;
DROP POLICY IF EXISTS "about: admin delete"   ON about;

CREATE POLICY "about: public select"
  ON about FOR SELECT
  USING (true);

CREATE POLICY "about: admin insert"
  ON about FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "about: admin update"
  ON about FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "about: admin delete"
  ON about FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── skills ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "skills: public select"  ON skills;
DROP POLICY IF EXISTS "skills: admin insert"   ON skills;
DROP POLICY IF EXISTS "skills: admin update"   ON skills;
DROP POLICY IF EXISTS "skills: admin delete"   ON skills;

CREATE POLICY "skills: public select"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "skills: admin insert"
  ON skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "skills: admin update"
  ON skills FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "skills: admin delete"
  ON skills FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── experiences ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "experiences: public select"  ON experiences;
DROP POLICY IF EXISTS "experiences: admin insert"   ON experiences;
DROP POLICY IF EXISTS "experiences: admin update"   ON experiences;
DROP POLICY IF EXISTS "experiences: admin delete"   ON experiences;

CREATE POLICY "experiences: public select"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "experiences: admin insert"
  ON experiences FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "experiences: admin update"
  ON experiences FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "experiences: admin delete"
  ON experiences FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── projects ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "projects: public select"  ON projects;
DROP POLICY IF EXISTS "projects: admin insert"   ON projects;
DROP POLICY IF EXISTS "projects: admin update"   ON projects;
DROP POLICY IF EXISTS "projects: admin delete"   ON projects;

CREATE POLICY "projects: public select"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "projects: admin insert"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects: admin update"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "projects: admin delete"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── contact_messages ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "contact_messages: public insert"  ON contact_messages;
DROP POLICY IF EXISTS "contact_messages: admin select"   ON contact_messages;
DROP POLICY IF EXISTS "contact_messages: admin update"   ON contact_messages;
DROP POLICY IF EXISTS "contact_messages: admin delete"   ON contact_messages;

CREATE POLICY "contact_messages: public insert"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contact_messages: admin select"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "contact_messages: admin update"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "contact_messages: admin delete"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');
