-- ============================================================================
-- MIGRATION 004 : Ajout colonnes manquantes à rdv_reservations
-- ============================================================================
-- Projet : Mon p'tit Dépanneur — Feature /rdv
-- Date   : 2026-05-13
-- Usage  : À exécuter dans le SQL Editor de Supabase (Dashboard > SQL Editor)
-- Note   : creneau_debut / creneau_fin restent tels quels (pas de rename)
-- ============================================================================

ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS client_prenom TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS reference TEXT;

-- Référence unique (utilisée comme identifiant lisible pour le client)
CREATE UNIQUE INDEX IF NOT EXISTS idx_rdv_reservations_reference
  ON rdv_reservations(reference)
  WHERE reference IS NOT NULL;

COMMENT ON COLUMN rdv_reservations.client_prenom IS 'Prénom du client (séparé du nom)';
COMMENT ON COLUMN rdv_reservations.notes IS 'Notes libres du client lors de la réservation';
COMMENT ON COLUMN rdv_reservations.reference IS 'Référence courte unique format RDV-XXXXXX';

-- Après cette migration : régénérer les types TypeScript
-- npx supabase gen types typescript --project-id bpwqdkznbmqwvvxpthhl > lib/supabase/types.ts

-- ============================================================================
-- FIN DE LA MIGRATION 004
-- ============================================================================
