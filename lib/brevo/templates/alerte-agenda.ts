import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";

const COULEUR_ALERTE = "#b91c1c";

export type OperationAgenda = "creation" | "deplacement" | "annulation";

export interface AlerteAgendaData {
  reference: string;
  operation: OperationAgenda;
  client_prenom: string;
  client_nom: string;
  client_telephone: string;
  client_adresse: string;
  service_nom: string;
  technicien_prenom: string;
  technicien_email: string | null;
  date_debut: string;
  date_fin: string;
  erreur: string;
}

function formatCreneau(debut: string, fin: string): string {
  const dateDebut = new Date(debut);
  const dateFin = new Date(fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  return `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()} · ${heureDebut} - ${heureFin}`;
}

const CONSIGNES: Record<OperationAgenda, string> = {
  creation: "Le créneau n'est donc bloqué nulle part : il faut créer l'événement à la main dans l'agenda du technicien, sinon quelqu'un risque de réserver par-dessus.",
  deplacement:
    "L'agenda est donc resté sur l'ancien créneau : il faut déplacer l'événement à la main dans l'agenda du technicien.",
  annulation:
    "L'événement est donc toujours dans l'agenda du technicien alors que le rendez-vous est annulé : il faut le supprimer à la main.",
};

const TITRES: Record<OperationAgenda, string> = {
  creation: "Rendez-vous absent de l'agenda",
  deplacement: "Déplacement non répercuté dans l'agenda",
  annulation: "Annulation non répercutée dans l'agenda",
};

function ligne(label: string, valeur: string, gras = false): string {
  return `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">${label}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: ${gras ? "15px" : "14px"}; ${gras ? "font-weight: 700;" : ""} color: #0f172a; text-align: right;">${valeur}</td>
      </tr>`;
}

export function genererEmailAlerteAgenda(data: AlerteAgendaData): {
  subject: string;
  html: string;
} {
  const creneau = formatCreneau(data.date_debut, data.date_fin);

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: ${COULEUR_ALERTE};">
      ${TITRES[data.operation]}
    </h1>
    <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.5; color: #475569;">
      Le rendez-vous <strong style="font-family: monospace;">${data.reference}</strong> est bien enregistré
      et le client a reçu sa confirmation, mais Google Agenda n'a pas répondu.
      ${CONSIGNES[data.operation]}
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${ligne("Créneau", creneau, true)}
      ${ligne("Technicien", `${data.technicien_prenom}${data.technicien_email ? ` (${data.technicien_email})` : ""}`)}
      ${ligne("Service", data.service_nom)}
      ${ligne("Client", `${data.client_prenom} ${data.client_nom}`)}
      ${ligne("Téléphone", data.client_telephone)}
      ${ligne("Adresse", data.client_adresse)}
    </table>

    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
      Détail technique : ${data.erreur}
    </p>
  `;

  return {
    subject: `⚠️ À poser à la main dans l'agenda — ${data.reference}`,
    html: genererEmailHTML({
      title: TITRES[data.operation],
      preheader: `${data.reference} — ${creneau} — ${data.technicien_prenom}`,
      content,
    }),
  };
}
