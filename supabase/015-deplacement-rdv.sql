-- 015 — Déplacement de rendez-vous
--
-- Permet de décaler un RDV existant au lieu de l'annuler et d'en reprendre un.
--
-- Deux entrées :
--   - le client, via le lien reçu par email (règle des 48h, une seule fois)
--   - l'équipe, depuis /admin/rdv/[id] (aucune limite)
--
-- Le lien client réutilise `annulation_token` : c'est déjà un secret par
-- réservation envoyé dans les emails, pas besoin d'un second jeton.

ALTER TABLE rdv_reservations
  ADD COLUMN IF NOT EXISTS deplace_at timestamptz,
  ADD COLUMN IF NOT EXISTS deplace_par text,
  ADD COLUMN IF NOT EXISTS nb_deplacements_client integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS creneau_debut_initial timestamptz;

COMMENT ON COLUMN rdv_reservations.deplace_at IS
  'Date du dernier déplacement du RDV. NULL = jamais déplacé.';
COMMENT ON COLUMN rdv_reservations.deplace_par IS
  'Qui a déplacé en dernier : client | equipe.';
COMMENT ON COLUMN rdv_reservations.nb_deplacements_client IS
  'Nombre de déplacements faits par le client. Le lien email est refusé au-delà de 1.';
COMMENT ON COLUMN rdv_reservations.creneau_debut_initial IS
  'Créneau d''origine, conservé au premier déplacement pour garder la trace.';

-- Garde-fou : deplace_par ne peut valoir que client ou equipe.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rdv_reservations_deplace_par_check'
  ) THEN
    ALTER TABLE rdv_reservations
      ADD CONSTRAINT rdv_reservations_deplace_par_check
      CHECK (deplace_par IS NULL OR deplace_par IN ('client', 'equipe'));
  END IF;
END $$;
