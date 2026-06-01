import { z } from "zod";

const TELEPHONE_FR_REGEX = /^0[1-9](\s?\d{2}){4}$|^0[1-9](\.\d{2}){4}$|^0[1-9]\d{8}$/;

export const reservationAdminSchema = z.object({
  service_id: z.string().uuid({ message: "Service invalide" }),
  ville_id: z.string().uuid({ message: "Ville invalide" }),
  marque_id: z.string().uuid().nullable(),
  technicien_id: z.string().uuid({ message: "Technicien invalide" }),
  date_debut: z.string().datetime({ message: "Date de début invalide" }),
  date_fin: z.string().datetime({ message: "Date de fin invalide" }),
  prix_centimes: z.number().int().nonnegative({ message: "Prix invalide" }),

  client_prenom: z.string().trim().min(2).max(50),
  client_nom: z.string().trim().min(2).max(50),
  client_email: z.string().trim().toLowerCase().email().max(100),
  client_telephone: z.string().trim().regex(TELEPHONE_FR_REGEX, {
    message: "Téléphone français invalide",
  }),
  client_adresse: z.string().trim().min(5).max(200),
  client_complement: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),

  envoyer_email_client: z.boolean().default(true),
});

export type ReservationAdminInput = z.infer<typeof reservationAdminSchema>;
