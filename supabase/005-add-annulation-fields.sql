-- ============================================================================
-- MIGRATION 005 : Champs pour l'annulation des RDV
-- ============================================================================
-- Projet : Mon p'tit Dépanneur - Feature /rdv
-- Date   : 2026-05-13
-- Objectif : Permettre au client d'annuler son RDV via un lien sécurisé
-- ============================================================================

-- Activer l'extension uuid-ossp si pas déjà active (pour uuid_generate_v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS annulation_token UUID DEFAULT uuid_generate_v4() NOT NULL,
  ADD COLUMN IF NOT EXISTS annule_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS annule_par TEXT;

-- Index unique pour les lookups rapides par token
CREATE UNIQUE INDEX IF NOT EXISTS idx_rdv_reservations_annulation_token
  ON rdv_reservations(annulation_token);

-- Contrainte sur annule_par : valeurs autorisées
ALTER TABLE rdv_reservations
  DROP CONSTRAINT IF EXISTS rdv_reservations_annule_par_check;
ALTER TABLE rdv_reservations
  ADD CONSTRAINT rdv_reservations_annule_par_check
  CHECK (annule_par IS NULL OR annule_par IN ('client', 'equipe', 'systeme'));

-- Backfill : générer un token pour les réservations existantes
UPDATE rdv_reservations
  SET annulation_token = uuid_generate_v4()
  WHERE annulation_token IS NULL;

COMMENT ON COLUMN rdv_reservations.annulation_token IS 'Token UUID pour annulation sécurisée via lien email';
COMMENT ON COLUMN rdv_reservations.annule_at IS 'Timestamp de l''annulation (null si non annulé)';
COMMENT ON COLUMN rdv_reservations.annule_par IS 'Qui a annulé : client, equipe ou systeme';

-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rdv_reservations'
  AND column_name IN ('annulation_token', 'annule_at', 'annule_par')
ORDER BY column_name;
