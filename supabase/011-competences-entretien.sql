-- ============================================================================
-- MIGRATION 011 : Retrait David & Enzo de l'entretien chaudière
-- Validé par David (réunion mai 2026). Exécutée manuellement le 2026-05-20.
-- Après cette migration, l'entretien chaudière est assuré par Mathis + JB.
-- (Hugo déjà désactivé en migration 010.)
-- ============================================================================

DELETE FROM rdv_competences
WHERE service_id = (SELECT id FROM rdv_services WHERE slug = 'entretien-chaudiere')
  AND technicien_id IN (
    SELECT id FROM rdv_techniciens
    WHERE email_workspace IN (
      'david@monptitdepanneur.fr',
      'enzo@monptitdepanneur.fr'
    )
  );

-- Vérification : qui reste sur l'entretien chaudière ? (attendu : Mathis, Jean-Baptiste)
SELECT t.prenom
FROM rdv_competences c
JOIN rdv_techniciens t ON t.id = c.technicien_id
JOIN rdv_services s ON s.id = c.service_id
WHERE s.slug = 'entretien-chaudiere' AND t.est_actif = TRUE
ORDER BY t.ordre;
