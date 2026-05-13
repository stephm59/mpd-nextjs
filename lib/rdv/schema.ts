import { z } from "zod";

const TELEPHONE_FR_REGEX = /^0[1-9](\s?\d{2}){4}$|^0[1-9](\.\d{2}){4}$|^0[1-9]\d{8}$/;

export const reservationSchema = z.object({
  service_id: z.string().uuid({ message: "Service invalide" }),
  ville_id: z.string().uuid({ message: "Ville invalide" }),
  marque_id: z.string().uuid().nullable(),
  technicien_id: z.string().uuid({ message: "Technicien invalide" }),
  date_debut: z.string().datetime({ message: "Date de début invalide" }),
  date_fin: z.string().datetime({ message: "Date de fin invalide" }),
  prix_centimes: z.number().int().nonnegative({ message: "Prix invalide" }),

  client_prenom: z
    .string()
    .trim()
    .min(2, { message: "Le prénom doit faire au moins 2 caractères" })
    .max(50, { message: "Le prénom est trop long" }),
  client_nom: z
    .string()
    .trim()
    .min(2, { message: "Le nom doit faire au moins 2 caractères" })
    .max(50, { message: "Le nom est trop long" }),
  client_email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Email invalide" })
    .max(100),
  client_telephone: z
    .string()
    .trim()
    .regex(TELEPHONE_FR_REGEX, {
      message: "Téléphone français invalide (format: 06 12 34 56 78)",
    }),
  client_adresse: z
    .string()
    .trim()
    .min(5, { message: "L'adresse doit faire au moins 5 caractères" })
    .max(200, { message: "L'adresse est trop longue" }),
  client_complement: z
    .string()
    .trim()
    .max(100, { message: "Le complément est trop long" })
    .optional()
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(500, { message: "Les notes sont trop longues" })
    .optional()
    .nullable(),
  cgv_acceptees: z
    .boolean()
    .refine((val) => val === true, {
      message: "Vous devez accepter les CGV pour réserver",
    }),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
