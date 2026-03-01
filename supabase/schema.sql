-- ============================================================
-- Urban Data Scout – Database Schema
-- Run this in Supabase → SQL Editor (New query)
-- ============================================================

-- ── Projects table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  description    TEXT,
  latitude       FLOAT       NOT NULL,
  longitude      FLOAT       NOT NULL,
  radius_meters  INTEGER     NOT NULL DEFAULT 1609,
  hearing_date   DATE,
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Reports table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  latitude    FLOAT       NOT NULL,
  longitude   FLOAT       NOT NULL,
  issue_type  TEXT        NOT NULL
                CHECK (issue_type IN ('flooding','traffic','noise','access','schools','other')),
  comment     TEXT        CHECK (char_length(comment) <= 500),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast report lookups per project
CREATE INDEX IF NOT EXISTS reports_project_id_idx ON reports(project_id);

-- ── Row Level Security ──────────────────────────────────────
-- Enable RLS on both tables (required for Supabase anon key access)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports  ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous users) can read active projects
CREATE POLICY "Public can view active projects"
  ON projects FOR SELECT
  USING (is_active = true);

-- Anyone can read reports (needed for dashboard)
CREATE POLICY "Public can view reports"
  ON reports FOR SELECT
  USING (true);

-- Anyone can submit a new report (resident flow)
CREATE POLICY "Public can submit reports"
  ON reports FOR INSERT
  WITH CHECK (
    -- Ensure the referenced project exists and is active
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
        AND projects.is_active = true
    )
  );

-- ── Auto-update updated_at on projects ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
