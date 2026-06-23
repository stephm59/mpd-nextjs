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
import {
  genererEmailNotificationEquipe,
  type NotificationEquipeData,
} from "./templates/notification-equipe";
import {
  genererEmailRappelJ1,
  type RappelJ1EmailData,
} from "./templates/rappel-j1";
import {
  genererEmailContactEquipe,
  type ContactEquipeData,
} from "./templates/contact-equipe";
import {
  genererEmailAvisPostRdv,
  type AvisPostRdvData,
} from "./templates/avis-post-rdv";

const EQUIPE_EMAIL = process.env.EMAIL_EQUIPE ?? "contact@monptitdepanneur.fr";
const EQUIPE_NAME = process.env.EMAIL_EQUIPE_NAME ?? "Mon p'tit Dépanneur";
const REPLY_TO_EMAIL = process.env.EMAIL_REPLY_TO ?? "monptitdepanneur@gmail.com";
const REPLY_TO_NAME = "Mon p'tit Dépanneur";

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
  data: ConfirmationClientData,
  cc?: string[]
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailConfirmationClient(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      replyTo: { email: REPLY_TO_EMAIL, name: REPLY_TO_NAME },
      to: [{
        email: destinataire.email,
        name: `${destinataire.prenom} ${destinataire.nom}`,
      }],
      ...(cc && cc.length > 0 ? { cc: cc.map((email) => ({ email })) } : {}),
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
  data: AnnulationData,
  cc?: string[]
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailAnnulationClient(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      replyTo: { email: REPLY_TO_EMAIL, name: REPLY_TO_NAME },
      to: [{
        email: data.client_email,
        name: `${data.client_prenom} ${data.client_nom}`,
      }],
      ...(cc && cc.length > 0 ? { cc: cc.map((email) => ({ email })) } : {}),
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
 * Construit la liste des destinataires équipe.
 * Toujours inclut EQUIPE_EMAIL. Ajoute le tech si fourni et différent de l'équipe.
 */
function buildDestinatairesEquipe(
  techEmail: string | null,
  techPrenom: string
): Array<{ email: string; name: string }> {
  const to = [{ email: EQUIPE_EMAIL, name: EQUIPE_NAME }];
  if (techEmail && techEmail.toLowerCase() !== EQUIPE_EMAIL.toLowerCase()) {
    to.push({ email: techEmail, name: techPrenom });
  }
  return to;
}

/**
 * Envoie l'email d'alerte annulation à l'équipe MPD (+ technicien attribué si fourni).
 */
export async function envoyerEmailAnnulationEquipe(
  data: AnnulationData,
  techEmail: string | null
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailAnnulationEquipe(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: buildDestinatairesEquipe(techEmail, data.technicien_prenom),
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

/**
 * Envoie l'email de notification équipe pour une nouvelle réservation.
 * Destinataires : équipe (toujours) + tech attribué (si techEmail fourni et différent).
 */
export async function envoyerEmailNotificationEquipe(
  data: NotificationEquipeData,
  techEmail: string | null
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailNotificationEquipe(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: buildDestinatairesEquipe(techEmail, data.technicien_prenom),
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailNotificationEquipe] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailNotificationEquipe] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Envoie l'email de rappel J-1 au client (la veille du RDV).
 */
export async function envoyerEmailRappelJ1(
  destinataire: { email: string; prenom: string; nom: string },
  data: RappelJ1EmailData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailRappelJ1(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      replyTo: { email: REPLY_TO_EMAIL, name: REPLY_TO_NAME },
      to: [{
        email: destinataire.email,
        name: `${destinataire.prenom} ${destinataire.nom}`,
      }],
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailRappelJ1] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailRappelJ1] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Envoie l'email du formulaire de contact à l'équipe MPD.
 * replyTo = email du visiteur → Ophélie peut répondre directement au client.
 */
export async function envoyerEmailContactEquipe(
  data: ContactEquipeData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailContactEquipe(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{ email: EQUIPE_EMAIL, name: EQUIPE_NAME }],
      replyTo: { email: data.email, name: `${data.firstName} ${data.lastName}` },
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailContactEquipe] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailContactEquipe] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Envoie l'email d'avis post-RDV (24h après la fin du RDV).
 * CTA Google review + lien problème discret.
 */
export async function envoyerEmailAvisPostRdv(
  data: AvisPostRdvData
): Promise<EnvoyerEmailResult> {
  try {
    const { subject, html } = genererEmailAvisPostRdv(data);

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: BREVO_SENDER,
      replyTo: { email: REPLY_TO_EMAIL, name: REPLY_TO_NAME },
      to: [{ email: data.client_email, name: data.client_prenom }],
      subject,
      htmlContent: html,
    });

    console.log(
      "[envoyerEmailAvisPostRdv] Email envoyé:",
      result.messageId ?? "(no messageId)"
    );

    return {
      success: true,
      messageId: result.messageId ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerEmailAvisPostRdv] Erreur:", message);
    return {
      success: false,
      error: message,
    };
  }
}
