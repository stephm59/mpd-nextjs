-- 014 — Plancher de réservation en ligne
--
-- Contexte : l'équipe est surchargée (août 2026) et ne veut plus recevoir de
-- réservations en ligne avant le 14 septembre 2026.
--
-- Le paramètre `date_premiere_reservation` fixe le premier jour réservable.
-- Format attendu : YYYY-MM-DD.
--
-- Comportement :
--   - paramètre absent, vide ou mal formé  → aucun plancher (fonctionnement normal)
--   - date passée                          → aucun effet (le délai minimum reprend la main)
--   - date future                          → aucun créneau proposé avant cette date
--
-- Ne s'applique QU'À la réservation en ligne par les clients.
-- La création manuelle depuis /admin/rdv/nouveau reste libre : si un client
-- appelle, l'équipe doit pouvoir le caler quand elle veut.
--
-- Pour lever le blocage : vider la valeur ou supprimer la ligne.
--   UPDATE rdv_parametres SET valeur = '' WHERE cle = 'date_premiere_reservation';

INSERT INTO rdv_parametres (cle, valeur, description)
VALUES (
  'date_premiere_reservation',
  '2026-09-14',
  'Premier jour réservable en ligne (YYYY-MM-DD). Vide = pas de blocage. Ne s''applique pas à la création admin.'
)
ON CONFLICT (cle) DO UPDATE
  SET valeur = EXCLUDED.valeur,
      description = EXCLUDED.description;
