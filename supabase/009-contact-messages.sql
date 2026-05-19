-- ============================================================================
-- MIGRATION 009 : Table des messages reçus via le formulaire de contact
-- ============================================================================
-- Projet : Mon p'tit Dépanneur
-- Date   : 2026-05-19
-- Objectif : Stocker les messages du formulaire /rdv?tab=contact en plus
--           de l'envoi email Brevo (pour audit + compteur admin)
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages(created_at DESC);

SELECT 'contact_messages' AS table_name, COUNT(*) AS rows FROM contact_messages;
