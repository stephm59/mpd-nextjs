-- ============================================================================
-- MIGRATION 010 : Ajustements RDV suite réunion MPD (mai 2026)
-- Exécutée manuellement dans le SQL Editor Supabase le 2026-05-20.
-- ============================================================================

-- 1. HUGO retiré des techniciens (désactivation, PAS de suppression :
--    réservations liées en ON DELETE RESTRICT)
UPDATE rdv_techniciens
SET est_actif = FALSE
WHERE email_workspace = 'hugo1@monptitdepanneur.fr';

-- 2. MARQUES DE CHAUDIÈRE : + ELM Leblanc, + Chaffoteaux & Maury
INSERT INTO rdv_marques_chaudiere (nom, ordre, exclusif) VALUES
  ('ELM Leblanc', 8, FALSE),
  ('Chaffoteaux & Maury', 9, FALSE)
ON CONFLICT (nom) DO NOTHING;

-- 3. SAINT-JANS-CAPPEL (CP 59270, partagé avec Bailleul)
--    3a. Lever la contrainte UNIQUE sur code_postal
ALTER TABLE rdv_villes DROP CONSTRAINT IF EXISTS rdv_villes_code_postal_key;

--    3b. Insérer la commune
INSERT INTO rdv_villes (code_postal, nom)
SELECT '59270', 'Saint-Jans-Cappel'
WHERE NOT EXISTS (
  SELECT 1 FROM rdv_villes WHERE nom = 'Saint-Jans-Cappel'
);

--    3c. Tarif entretien chaudière = 101 € (10100 centimes)
INSERT INTO rdv_tarifs_ville (service_id, ville_id, prix_centimes)
SELECT s.id, v.id, 10100
FROM rdv_services s, rdv_villes v
WHERE s.slug = 'entretien-chaudiere'
  AND v.nom = 'Saint-Jans-Cappel'
ON CONFLICT (service_id, ville_id) DO NOTHING;

--    3d. Tarifs devis (gratuits) pour cette nouvelle ville
INSERT INTO rdv_tarifs_ville (service_id, ville_id, prix_centimes)
SELECT s.id, v.id, 0
FROM rdv_services s, rdv_villes v
WHERE s.est_devis = TRUE
  AND v.nom = 'Saint-Jans-Cappel'
ON CONFLICT (service_id, ville_id) DO NOTHING;

-- 4. Calendrier de réservation : 60 jours visibles au lieu de 30
UPDATE rdv_parametres SET valeur = '60' WHERE cle = 'jours_visibles_futur';
