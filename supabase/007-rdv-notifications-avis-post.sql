-- ============================================================================
-- MIGRATION 007 : Ajout du type 'avis_post' à rdv_notifications
-- ============================================================================
-- Projet : Mon p'tit Dépanneur — Feature /rdv
-- Date   : 2026-05-17
-- Objectif : Permettre de tracer l'envoi de l'email d'avis Google post-RDV
-- ============================================================================

ALTER TABLE rdv_notifications
DROP CONSTRAINT IF EXISTS rdv_notifications_type_check;

ALTER TABLE rdv_notifications
ADD CONSTRAINT rdv_notifications_type_check
CHECK (type IN ('rappel_j1', 'confirmation', 'annulation', 'notif_equipe', 'avis_post'));

-- Vérification
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'rdv_notifications'::regclass
  AND conname = 'rdv_notifications_type_check';
