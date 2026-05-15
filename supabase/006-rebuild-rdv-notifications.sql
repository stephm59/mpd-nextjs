-- ============================================================================
-- MIGRATION 006 : Reconstruction de rdv_notifications avec schéma Brevo propre
-- ============================================================================
-- Projet : Mon p'tit Dépanneur - Feature /rdv
-- Date   : 2026-05-15
-- Objectif : Schéma initial était pour Resend (resend_id, statut text),
--            on refait propre pour Brevo (canal email/sms, succes boolean)
-- ============================================================================

-- Safety check : confirmer que la table est vide avant DROP
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM rdv_notifications) > 0 THEN
    RAISE EXCEPTION 'Table rdv_notifications contient des données ! Annulation.';
  END IF;
END $$;

-- Drop and recreate
DROP TABLE IF EXISTS rdv_notifications CASCADE;

CREATE TABLE rdv_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES rdv_reservations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  canal TEXT NOT NULL,
  envoyee_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  brevo_message_id TEXT,
  succes BOOLEAN NOT NULL DEFAULT TRUE,
  erreur TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE rdv_notifications
  ADD CONSTRAINT rdv_notifications_type_check
  CHECK (type IN ('rappel_j1', 'confirmation', 'annulation', 'notif_equipe'));

ALTER TABLE rdv_notifications
  ADD CONSTRAINT rdv_notifications_canal_check
  CHECK (canal IN ('email', 'sms'));

CREATE INDEX idx_rdv_notifications_reservation
  ON rdv_notifications(reservation_id);

CREATE INDEX idx_rdv_notifications_type_canal
  ON rdv_notifications(type, canal, envoyee_at);

COMMENT ON TABLE rdv_notifications IS 'Historique des notifications envoyees (email/SMS) pour les RDV - schema Brevo';

-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rdv_notifications'
ORDER BY ordinal_position;
