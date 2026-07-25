-- One-time cutover: Clerk → first-party auth
-- WARNING: drops clerk_id; users without email/password cannot sign in until re-register.
-- Prefer on empty/dev DBs. Review before running in production.

BEGIN;

-- Drop Clerk bridge
ALTER TABLE IF EXISTS users DROP COLUMN IF EXISTS clerk_id;

-- Auth fields on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Backfill placeholder emails for any legacy rows so NOT NULL/UNIQUE can apply
UPDATE users
SET email = COALESCE(NULLIF(email, ''), 'legacy-' || id::text || '@invalid.local')
WHERE email IS NULL OR email = '';

ALTER TABLE users ALTER COLUMN email SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
  END IF;
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'users.email has duplicates — resolve before UNIQUE constraint';
END $$;

CREATE TABLE IF NOT EXISTS sessions (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  user_agent text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS oauth_accounts_provider_account_uidx
  ON oauth_accounts(provider, provider_account_id);

COMMIT;
