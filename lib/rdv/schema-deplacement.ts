import { z } from "zod";

/** Déplacement demandé par le client via le lien reçu par email. */
export const deplacementClientSchema = z.object({
  token: z.string().uuid({ message: "Lien de déplacement invalide" }),
  date_debut: z.string().datetime({ message: "Date de début invalide" }),
  date_fin: z.string().datetime({ message: "Date de fin invalide" }),
  technicien_id: z.string().uuid({ message: "Technicien invalide" }),
});

export type DeplacementClientInput = z.infer<typeof deplacementClientSchema>;

/** Déplacement fait par l'équipe depuis l'admin (pas de token, pas de délai). */
export const deplacementAdminSchema = z.object({
  reservation_id: z.string().uuid({ message: "Réservation invalide" }),
  date_debut: z.string().datetime({ message: "Date de début invalide" }),
  date_fin: z.string().datetime({ message: "Date de fin invalide" }),
  technicien_id: z.string().uuid({ message: "Technicien invalide" }),
});

export type DeplacementAdminInput = z.infer<typeof deplacementAdminSchema>;

/** Délai minimum avant le RDV pour un déplacement en libre-service (heures). */
export const DELAI_DEPLACEMENT_HEURES = 48;

/** Nombre de déplacements autorisés au client sur un même RDV. */
export const MAX_DEPLACEMENTS_CLIENT = 1;
