-- Apply on Neon/production if site_settings / questions.status are missing.
-- Safe to run multiple times.

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';

CREATE INDEX IF NOT EXISTS questions_status_idx ON questions (status);

CREATE TABLE IF NOT EXISTS site_settings (
  id serial PRIMARY KEY,
  questions_require_review boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO site_settings (id, questions_require_review)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (slug, name, description)
VALUES ('other', 'Other', 'Topics that do not fit the other categories')
ON CONFLICT (slug) DO NOTHING;
