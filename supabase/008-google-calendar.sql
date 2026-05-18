-- ============================================================================
-- MIGRATION 008 : Google Calendar OAuth + intégration RDV
-- ============================================================================
-- Projet : Mon p'tit Dépanneur
-- Date   : 2026-05-18
-- Objectif : Stocker le refresh token OAuth de David et lier les RDV aux
--           événements Google Calendar
-- ============================================================================

-- Table : tokens OAuth (1 ligne par compte autorisateur, en pratique David seul)
CREATE TABLE IF NOT EXISTS google_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_email TEXT UNIQUE NOT NULL,
  refresh_token TEXT NOT NULL,
  access_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_google_oauth_tokens_email ON google_oauth_tokens(google_email);

-- Email Workspace de chaque technicien (pour cibler son calendrier)
ALTER TABLE rdv_techniciens
  ADD COLUMN IF NOT EXISTS email_google TEXT;

-- ID de l'événement Google Calendar associé au RDV
ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS google_event_id TEXT,
  ADD COLUMN IF NOT EXISTS google_event_calendar_id TEXT,
  ADD COLUMN IF NOT EXISTS google_event_created_at TIMESTAMPTZ;

-- Vérification
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE (table_name = 'google_oauth_tokens')
   OR (table_name IN ('rdv_techniciens', 'rdv_reservations') AND column_name LIKE 'google_%')
   OR (table_name = 'rdv_techniciens' AND column_name = 'email_google')
ORDER BY table_name, column_name;
