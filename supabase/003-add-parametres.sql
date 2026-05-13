-- ============================================================================
-- MIGRATION 003 : Table paramètres rdv_parametres
-- ============================================================================
-- Projet : Mon p'tit Dépanneur — Feature /rdv
-- Date   : 2026-05-13
-- Objectif : Ajouter la table de configuration runtime (max RDV/jour, horaires)
-- ============================================================================

-- 1. Table de paramètres clé/valeur pour configuration runtime
CREATE TABLE IF NOT EXISTS rdv_parametres (
  cle           TEXT PRIMARY KEY,
  valeur        TEXT NOT NULL,
  description   TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE rdv_parametres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique paramètres"
  ON rdv_parametres FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE TRIGGER trigger_rdv_parametres_updated_at
  BEFORE UPDATE ON rdv_parametres
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_parametres IS 'Configuration runtime du système de RDV';

-- 2. Seed des paramètres initiaux
INSERT INTO rdv_parametres (cle, valeur, description) VALUES
  ('max_rdv_jour_total', '5', 'Nombre maximum de RDV en ligne par jour (toute l''équipe)'),
  ('delai_minimum_jours', '1', 'Délai minimum entre aujourd''hui et la date de RDV (en jours)'),
  ('jours_visibles_futur', '30', 'Nombre de jours visibles dans le futur pour la prise de RDV'),
  ('horaires_lundi_jeudi', '08:00-12:00,13:00-17:00', 'Plages horaires lundi à jeudi'),
  ('horaires_vendredi', '08:00-12:00,13:00-16:00', 'Plages horaires vendredi'),
  ('jours_ouvres', 'lundi,mardi,mercredi,jeudi,vendredi', 'Jours d''ouverture en liste séparée par virgule')
ON CONFLICT (cle) DO NOTHING;

-- ============================================================================
-- FIN DE LA MIGRATION 003
-- ============================================================================
