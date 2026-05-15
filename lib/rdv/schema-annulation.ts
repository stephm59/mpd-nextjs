import { z } from "zod";

export const annulationSchema = z.object({
  token: z.string().uuid({ message: "Token d'annulation invalide" }),
});

export type AnnulationInput = z.infer<typeof annulationSchema>;
