"use server";

import { z } from "zod";
import { envoyerEmailContactEquipe } from "@/lib/brevo/emails";
import { createAdminClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  message: z.string().min(10).max(5000),
  consentement: z.literal(true, {
    message: "Vous devez accepter pour continuer",
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { success: true }
  | { success: false; error: string };

export async function envoyerContactAction(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const result = await envoyerEmailContactEquipe(parsed.data);

  if (!result.success) {
    console.error("[envoyerContactAction] Échec envoi:", result.error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi. Réessayez ou appelez le 03 28 53 48 68.",
    };
  }

  // Stockage en base (best effort : un échec ici ne fait PAS échouer l'envoi)
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
    });
    if (error) {
      console.error("[envoyerContactAction] Erreur INSERT contact_messages:", error.message);
    }
  } catch (err) {
    console.error("[envoyerContactAction] Erreur stockage:", err);
  }

  return { success: true };
}
