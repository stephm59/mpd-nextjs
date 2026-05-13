import "server-only";
import { brevoClient, BREVO_SENDER } from "./client";
import {
  genererEmailConfirmationClient,
  type ConfirmationClientData,
} from "./templates/confirmation-client";

export interface EnvoyerEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoie l'email de confirmation au client après réservation réussie.
 * Ne jette pas d'erreur : si Brevo plante, on log et on continue (la résa reste créée).
 */
export async function envoyerEmailConfirmationClient(
  destinataire: { email: string; prenom: string; nom: string },
  data: ConfirmationClientData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailConfirmationClient(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{
        email: destinataire.email,
        name: `${destinataire.prenom} ${destinataire.nom}`,
      }],
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailConfirmationClient] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailConfirmationClient] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}
