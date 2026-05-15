import "server-only";
import { brevoClient, BREVO_SENDER } from "./client";
import {
  genererEmailConfirmationClient,
  type ConfirmationClientData,
} from "./templates/confirmation-client";
import {
  genererEmailAnnulationClient,
  type AnnulationData,
} from "./templates/annulation-client";
import { genererEmailAnnulationEquipe } from "./templates/annulation-equipe";

const EQUIPE_EMAIL = "contact@monptitdepanneur.fr";
const EQUIPE_NAME = "Mon p'tit Dépanneur";

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

/**
 * Envoie l'email d'annulation au client.
 * Ne jette pas d'erreur : si Brevo plante, on log et on continue.
 */
export async function envoyerEmailAnnulationClient(
  data: AnnulationData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailAnnulationClient(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{
        email: data.client_email,
        name: `${data.client_prenom} ${data.client_nom}`,
      }],
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailAnnulationClient] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailAnnulationClient] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Envoie l'email d'alerte annulation à l'équipe MPD.
 * Destinataire hardcodé pour l'instant (à externaliser en env var plus tard).
 */
export async function envoyerEmailAnnulationEquipe(
  data: AnnulationData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailAnnulationEquipe(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{ email: EQUIPE_EMAIL, name: EQUIPE_NAME }],
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailAnnulationEquipe] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailAnnulationEquipe] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}
