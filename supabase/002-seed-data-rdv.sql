-- ============================================================================
-- MIGRATION 002 : Seed des données pour la prise de RDV
-- ============================================================================
-- Projet : Mon p'tit Dépanneur — Feature /rdv
-- Date   : 2026-05-12
-- Usage  : À exécuter APRÈS 001-create-tables-rdv.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SERVICES (5)
-- ----------------------------------------------------------------------------

INSERT INTO rdv_services (slug, nom, description, duree_minutes, est_devis, ordre) VALUES
  ('entretien-chaudiere', 'Entretien chaudière', 'Entretien annuel obligatoire de votre chaudière gaz', 60, FALSE, 1),
  ('devis-remplacement-chaudiere', 'Devis remplacement chaudière', 'Visite d''étude pour le remplacement de votre chaudière', 120, TRUE, 2),
  ('devis-renovation-sdb', 'Devis rénovation salle de bains', 'Visite d''étude pour la rénovation de votre salle de bains', 120, TRUE, 3),
  ('devis-pac', 'Devis pompe à chaleur', 'Visite d''étude pour l''installation d''une pompe à chaleur', 120, TRUE, 4),
  ('devis-clim', 'Devis climatisation', 'Visite d''étude pour l''installation d''une climatisation', 120, TRUE, 5)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. VILLES (39)
-- ----------------------------------------------------------------------------

INSERT INTO rdv_villes (code_postal, nom) VALUES
  ('59000', 'Lille'),
  ('59100', 'Roubaix'),
  ('59110', 'La Madeleine'),
  ('59112', 'Annœullin'),
  ('59113', 'Seclin'),
  ('59115', 'Leers'),
  ('59120', 'Loos'),
  ('59126', 'Linselles'),
  ('59130', 'Lambersart'),
  ('59134', 'Beaucamps-Ligny'),
  ('59136', 'Wavrin'),
  ('59139', 'Wattignies'),
  ('59155', 'Faches-Thumesnil'),
  ('59160', 'Lomme'),
  ('59170', 'Croix'),
  ('59184', 'Sainghin-en-Weppes'),
  ('59193', 'Erquinghem-Lys'),
  ('59200', 'Tourcoing'),
  ('59250', 'Halluin'),
  ('59251', 'Allennes-les-Marais'),
  ('59260', 'Hellemmes-Lille'),
  ('59270', 'Bailleul'),
  ('59280', 'Armentières'),
  ('59290', 'Wasquehal'),
  ('59390', 'Lys-lez-Lannoy'),
  ('59420', 'Mouvaux'),
  ('59508', 'Lannoy'),
  ('59510', 'Hem'),
  ('59520', 'Marquette-lez-Lille'),
  ('59636', 'Tressin'),
  ('59650', 'Villeneuve-d''Ascq'),
  ('59700', 'Marcq-en-Barœul'),
  ('59777', 'Euralille'),
  ('59790', 'Ronchin'),
  ('59800', 'Lille (centre)'),
  ('59830', 'Bondues'),
  ('59840', 'Pérenchies'),
  ('59850', 'Nieppe'),
  ('59930', 'La Chapelle-d''Armentières')
ON CONFLICT (code_postal) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. TECHNICIENS (5)
-- ----------------------------------------------------------------------------

INSERT INTO rdv_techniciens (prenom, email_workspace, ordre) VALUES
  ('Mathis', 'mathis@monptitdepanneur.fr', 1),
  ('Enzo', 'enzo@monptitdepanneur.fr', 2),
  ('Jean-Baptiste', 'jean-baptiste@monptitdepanneur.fr', 3),
  ('Hugo', 'hugo1@monptitdepanneur.fr', 4),
  ('David', 'david@monptitdepanneur.fr', 5)
ON CONFLICT (email_workspace) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. COMPÉTENCES (technicien × service)
-- ----------------------------------------------------------------------------

INSERT INTO rdv_competences (technicien_id, service_id)
SELECT t.id, s.id FROM rdv_techniciens t, rdv_services s
WHERE
  (t.email_workspace = 'mathis@monptitdepanneur.fr' AND s.slug = 'entretien-chaudiere')
  OR
  (t.email_workspace = 'enzo@monptitdepanneur.fr' AND s.slug IN (
    'entretien-chaudiere', 'devis-remplacement-chaudiere', 
    'devis-renovation-sdb', 'devis-pac', 'devis-clim'
  ))
  OR
  (t.email_workspace = 'jean-baptiste@monptitdepanneur.fr' AND s.slug = 'entretien-chaudiere')
  OR
  (t.email_workspace = 'hugo1@monptitdepanneur.fr' AND s.slug = 'entretien-chaudiere')
  OR
  (t.email_workspace = 'david@monptitdepanneur.fr' AND s.slug IN (
    'entretien-chaudiere', 'devis-remplacement-chaudiere', 'devis-renovation-sdb'
  ))
ON CONFLICT (technicien_id, service_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. MARQUES DE CHAUDIÈRE (8)
-- ----------------------------------------------------------------------------

INSERT INTO rdv_marques_chaudiere (nom, ordre, exclusif) VALUES
  ('Atlantic', 1, FALSE),
  ('De Dietrich', 2, FALSE),
  ('Frisquet', 3, FALSE),
  ('Saunier Duval', 4, FALSE),
  ('Vaillant', 5, FALSE),
  ('Viessmann', 6, FALSE),
  ('WOLF', 7, TRUE),
  ('Autre / je ne sais pas', 99, FALSE)
ON CONFLICT (nom) DO NOTHING;

UPDATE rdv_marques_chaudiere
SET technicien_specialiste_id = (
  SELECT id FROM rdv_techniciens WHERE email_workspace = 'jean-baptiste@monptitdepanneur.fr'
)
WHERE nom = 'WOLF';

-- ----------------------------------------------------------------------------
-- 6. TARIFS (service × ville × prix)
-- ----------------------------------------------------------------------------

WITH service_entretien AS (
  SELECT id FROM rdv_services WHERE slug = 'entretien-chaudiere'
),
villes_91 AS (
  SELECT id FROM rdv_villes WHERE code_postal IN (
    '59000','59110','59155','59790','59136','59130','59800','59160','59260',
    '59700','59510','59120','59520','59280','59113','59777','59112','59251',
    '59134','59184','59930','59850','59840','59139','59636','59193'
  )
),
villes_101 AS (
  SELECT id FROM rdv_villes WHERE code_postal IN (
    '59115','59390','59170','59508','59270','59830','59250','59650',
    '59200','59100','59290','59126','59420'
  )
)
INSERT INTO rdv_tarifs_ville (service_id, ville_id, prix_centimes)
SELECT s.id, v.id, 9100 FROM service_entretien s, villes_91 v
UNION ALL
SELECT s.id, v.id, 10100 FROM service_entretien s, villes_101 v
ON CONFLICT (service_id, ville_id) DO NOTHING;

INSERT INTO rdv_tarifs_ville (service_id, ville_id, prix_centimes)
SELECT s.id, v.id, 0
FROM rdv_services s, rdv_villes v
WHERE s.est_devis = TRUE
ON CONFLICT (service_id, ville_id) DO NOTHING;

-- ============================================================================
-- VÉRIFICATIONS
-- ============================================================================

DO $$
DECLARE
  nb_services INTEGER;
  nb_villes INTEGER;
  nb_techs INTEGER;
  nb_marques INTEGER;
  nb_competences INTEGER;
  nb_tarifs INTEGER;
BEGIN
  SELECT COUNT(*) INTO nb_services FROM rdv_services;
  SELECT COUNT(*) INTO nb_villes FROM rdv_villes;
  SELECT COUNT(*) INTO nb_techs FROM rdv_techniciens;
  SELECT COUNT(*) INTO nb_marques FROM rdv_marques_chaudiere;
  SELECT COUNT(*) INTO nb_competences FROM rdv_competences;
  SELECT COUNT(*) INTO nb_tarifs FROM rdv_tarifs_ville;

  RAISE NOTICE 'Services       : % (attendu 5)', nb_services;
  RAISE NOTICE 'Villes         : % (attendu 39)', nb_villes;
  RAISE NOTICE 'Techniciens    : % (attendu 5)', nb_techs;
  RAISE NOTICE 'Marques        : % (attendu 8)', nb_marques;
  RAISE NOTICE 'Compétences    : % (attendu 11)', nb_competences;
  RAISE NOTICE 'Tarifs         : % (attendu 195)', nb_tarifs;
END $$;

-- ============================================================================
-- FIN DE LA MIGRATION 002
-- ============================================================================