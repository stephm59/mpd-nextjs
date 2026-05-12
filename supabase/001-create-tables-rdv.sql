-- ============================================================================
-- MIGRATION 001 : Création des tables pour la prise de RDV en ligne
-- ============================================================================
-- Projet : Mon p'tit Dépanneur — Feature /rdv
-- Date   : 2026-05-12
-- Usage  : À exécuter dans le SQL Editor de Supabase (Dashboard > SQL Editor)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------

-- Pour les UUIDs (déjà actif sur Supabase mais on s'assure)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. FONCTION updated_at (trigger générique)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. TABLE : rdv_services
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  nom         TEXT NOT NULL,
  description TEXT,
  duree_minutes INTEGER NOT NULL,
  est_devis   BOOLEAN NOT NULL DEFAULT FALSE,
  ordre       INTEGER NOT NULL DEFAULT 0,
  est_actif   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_services_slug ON rdv_services(slug);
CREATE INDEX IF NOT EXISTS idx_rdv_services_actif ON rdv_services(est_actif) WHERE est_actif = TRUE;

CREATE TRIGGER trigger_rdv_services_updated_at
  BEFORE UPDATE ON rdv_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_services IS 'Services proposés dans le tunnel de prise de RDV';
COMMENT ON COLUMN rdv_services.duree_minutes IS 'Durée du créneau en minutes (60 pour entretien, 120 pour devis)';
COMMENT ON COLUMN rdv_services.est_devis IS 'TRUE si gratuit (devis), FALSE si payant (entretien)';

-- ----------------------------------------------------------------------------
-- 4. TABLE : rdv_villes
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_villes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_postal TEXT NOT NULL UNIQUE,
  nom         TEXT NOT NULL,
  est_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT code_postal_format CHECK (code_postal ~ '^[0-9]{5}$')
);

CREATE INDEX IF NOT EXISTS idx_rdv_villes_code_postal ON rdv_villes(code_postal);
CREATE INDEX IF NOT EXISTS idx_rdv_villes_active ON rdv_villes(est_active) WHERE est_active = TRUE;

CREATE TRIGGER trigger_rdv_villes_updated_at
  BEFORE UPDATE ON rdv_villes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_villes IS 'Codes postaux couverts par MPD pour la prise de RDV';

-- ----------------------------------------------------------------------------
-- 5. TABLE : rdv_tarifs_ville
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_tarifs_ville (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id  UUID NOT NULL REFERENCES rdv_services(id) ON DELETE CASCADE,
  ville_id    UUID NOT NULL REFERENCES rdv_villes(id) ON DELETE CASCADE,
  prix_centimes INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(service_id, ville_id)
);

CREATE INDEX IF NOT EXISTS idx_rdv_tarifs_service ON rdv_tarifs_ville(service_id);
CREATE INDEX IF NOT EXISTS idx_rdv_tarifs_ville ON rdv_tarifs_ville(ville_id);

CREATE TRIGGER trigger_rdv_tarifs_ville_updated_at
  BEFORE UPDATE ON rdv_tarifs_ville
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_tarifs_ville IS 'Grille tarifaire : prix d''un service dans une ville donnée';
COMMENT ON COLUMN rdv_tarifs_ville.prix_centimes IS 'Prix en centimes (9100 = 91€). 0 = gratuit (devis)';

-- ----------------------------------------------------------------------------
-- 6. TABLE : rdv_techniciens
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_techniciens (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom          TEXT NOT NULL,
  email_workspace TEXT NOT NULL UNIQUE,
  google_refresh_token TEXT,
  google_calendar_id TEXT,
  ordre           INTEGER NOT NULL DEFAULT 0,
  est_actif       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_techniciens_email ON rdv_techniciens(email_workspace);
CREATE INDEX IF NOT EXISTS idx_rdv_techniciens_actif ON rdv_techniciens(est_actif) WHERE est_actif = TRUE;

CREATE TRIGGER trigger_rdv_techniciens_updated_at
  BEFORE UPDATE ON rdv_techniciens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_techniciens IS 'Techniciens MPD avec leurs comptes Google Workspace';
COMMENT ON COLUMN rdv_techniciens.google_refresh_token IS 'Token OAuth long-life pour accès agenda (chiffré côté app)';

-- ----------------------------------------------------------------------------
-- 7. TABLE : rdv_competences (techniciens × services)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_competences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technicien_id UUID NOT NULL REFERENCES rdv_techniciens(id) ON DELETE CASCADE,
  service_id    UUID NOT NULL REFERENCES rdv_services(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(technicien_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_rdv_competences_tech ON rdv_competences(technicien_id);
CREATE INDEX IF NOT EXISTS idx_rdv_competences_service ON rdv_competences(service_id);

COMMENT ON TABLE rdv_competences IS 'Association technicien × service (qui fait quoi)';

-- ----------------------------------------------------------------------------
-- 8. TABLE : rdv_marques_chaudiere
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_marques_chaudiere (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom           TEXT NOT NULL UNIQUE,
  technicien_specialiste_id UUID REFERENCES rdv_techniciens(id) ON DELETE SET NULL,
  exclusif      BOOLEAN NOT NULL DEFAULT FALSE,
  ordre         INTEGER NOT NULL DEFAULT 0,
  est_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_marques_active ON rdv_marques_chaudiere(est_active) WHERE est_active = TRUE;

CREATE TRIGGER trigger_rdv_marques_updated_at
  BEFORE UPDATE ON rdv_marques_chaudiere
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_marques_chaudiere IS 'Marques de chaudière. WOLF est exclusif à JB.';
COMMENT ON COLUMN rdv_marques_chaudiere.exclusif IS 'TRUE = seul le spécialiste peut intervenir (ex: WOLF)';

-- ----------------------------------------------------------------------------
-- 9. TABLE : rdv_reservations
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_reservations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id        UUID NOT NULL REFERENCES rdv_services(id) ON DELETE RESTRICT,
  technicien_id     UUID NOT NULL REFERENCES rdv_techniciens(id) ON DELETE RESTRICT,
  ville_id          UUID NOT NULL REFERENCES rdv_villes(id) ON DELETE RESTRICT,
  marque_id         UUID REFERENCES rdv_marques_chaudiere(id) ON DELETE SET NULL,
  client_nom        TEXT NOT NULL,
  client_email      TEXT NOT NULL,
  client_telephone  TEXT NOT NULL,
  client_adresse    TEXT NOT NULL,
  client_complement TEXT,
  creneau_debut     TIMESTAMPTZ NOT NULL,
  creneau_fin       TIMESTAMPTZ NOT NULL,
  prix_centimes     INTEGER NOT NULL DEFAULT 0,
  statut            TEXT NOT NULL DEFAULT 'confirme'
                    CHECK (statut IN ('confirme', 'annule', 'effectue', 'no_show')),
  google_event_id   TEXT,
  user_agent        TEXT,
  ip_address        INET,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT creneau_coherent CHECK (creneau_fin > creneau_debut)
);

CREATE INDEX IF NOT EXISTS idx_rdv_reservations_creneau ON rdv_reservations(creneau_debut);
CREATE INDEX IF NOT EXISTS idx_rdv_reservations_tech_creneau ON rdv_reservations(technicien_id, creneau_debut);
CREATE INDEX IF NOT EXISTS idx_rdv_reservations_statut ON rdv_reservations(statut);
CREATE INDEX IF NOT EXISTS idx_rdv_reservations_email ON rdv_reservations(client_email);
CREATE INDEX IF NOT EXISTS idx_rdv_reservations_created ON rdv_reservations(created_at DESC);

CREATE TRIGGER trigger_rdv_reservations_updated_at
  BEFORE UPDATE ON rdv_reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE rdv_reservations IS 'Réservations effectuées via le tunnel /rdv';
COMMENT ON COLUMN rdv_reservations.prix_centimes IS 'Prix figé au moment de la résa (pour traçabilité historique)';
COMMENT ON COLUMN rdv_reservations.google_event_id IS 'ID de l''événement Google Calendar correspondant';

-- ----------------------------------------------------------------------------
-- 10. TABLE : rdv_notifications
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rdv_notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id  UUID NOT NULL REFERENCES rdv_reservations(id) ON DELETE CASCADE,
  type            TEXT NOT NULL
                  CHECK (type IN ('confirmation_client', 'rappel_client_j1', 'notification_equipe')),
  destinataire    TEXT NOT NULL,
  statut          TEXT NOT NULL DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente', 'envoye', 'echec')),
  resend_id       TEXT,
  erreur_message  TEXT,
  envoye_a        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_notifications_reservation ON rdv_notifications(reservation_id);
CREATE INDEX IF NOT EXISTS idx_rdv_notifications_statut ON rdv_notifications(statut);
CREATE INDEX IF NOT EXISTS idx_rdv_notifications_type ON rdv_notifications(type);

COMMENT ON TABLE rdv_notifications IS 'Journal des emails envoyés pour chaque réservation';

-- ----------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

ALTER TABLE rdv_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_villes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_tarifs_ville ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_techniciens ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_marques_chaudiere ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique services actifs"
  ON rdv_services FOR SELECT
  TO anon, authenticated
  USING (est_actif = TRUE);

CREATE POLICY "Lecture publique villes actives"
  ON rdv_villes FOR SELECT
  TO anon, authenticated
  USING (est_active = TRUE);

CREATE POLICY "Lecture publique tarifs"
  ON rdv_tarifs_ville FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Lecture publique techniciens actifs (sans tokens)"
  ON rdv_techniciens FOR SELECT
  TO anon, authenticated
  USING (est_actif = TRUE);

CREATE POLICY "Lecture publique competences"
  ON rdv_competences FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Lecture publique marques actives"
  ON rdv_marques_chaudiere FOR SELECT
  TO anon, authenticated
  USING (est_active = TRUE);

COMMENT ON POLICY "Lecture publique techniciens actifs (sans tokens)" ON rdv_techniciens IS
  'Le code applicatif DOIT exclure google_refresh_token des SELECT publics.';

-- ============================================================================
-- FIN DE LA MIGRATION 001
-- ============================================================================