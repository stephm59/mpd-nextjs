-- ============================================================================
-- MIGRATION 013 : Préparation de la prise de rdv par l'admin (Ophélie)
-- Exécutée manuellement dans le SQL Editor Supabase.
-- Ajoute les colonnes nécessaires pour les rdv personnalisés et le tiers en CC.
-- Toutes nullables : aucun impact sur les résas publiques existantes.
-- ============================================================================

-- 1. Rendre service_id nullable (pour les rdv personnalisés sans service en base)
ALTER TABLE rdv_reservations ALTER COLUMN service_id DROP NOT NULL;

-- 2. Colonnes pour le mode personnalisé
ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS service_nom_personnalise TEXT,
  ADD COLUMN IF NOT EXISTS duree_personnalisee_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS description_intervention TEXT,
  ADD COLUMN IF NOT EXISTS prix_libre TEXT;

-- 3. Colonnes pour le tiers en CC
ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS tiers_email TEXT,
  ADD COLUMN IF NOT EXISTS tiers_telephone TEXT;

-- 4. Contrainte : soit service_id, soit service_nom_personnalise (pas les deux vides)
ALTER TABLE rdv_reservations
  ADD CONSTRAINT service_ou_personnalise CHECK (
    service_id IS NOT NULL OR service_nom_personnalise IS NOT NULL
  );

-- 5. Documentation
COMMENT ON COLUMN rdv_reservations.service_nom_personnalise IS 'Nom libre de l''intervention pour les rdv personnalisés créés par l''admin';
COMMENT ON COLUMN rdv_reservations.duree_personnalisee_minutes IS 'Durée en minutes pour les rdv personnalisés (60, 120, 180, 240)';
COMMENT ON COLUMN rdv_reservations.description_intervention IS 'Description libre de l''intervention, affichée dans l''email de confirmation';
COMMENT ON COLUMN rdv_reservations.prix_libre IS 'Prix en texte libre pour les rdv personnalisés (ex: "350€ + matériel", "à confirmer")';
COMMENT ON COLUMN rdv_reservations.tiers_email IS 'Email d''un tiers à mettre en CC des notifications (optionnel)';
COMMENT ON COLUMN rdv_reservations.tiers_telephone IS 'Téléphone d''un tiers à inclure dans le SMS rappel (optionnel)';
