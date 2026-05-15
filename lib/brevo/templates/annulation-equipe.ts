import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import type { AnnulationData } from "./annulation-client";

export function genererEmailAnnulationEquipe(data: AnnulationData): { subject: string; html: string } {
  const dateDebut = new Date(data.date_debut);
  const dateFin = new Date(data.date_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const content = `
    <h1 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #b91c1c;">
      ⚠️ Annulation client
    </h1>

    <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #475569;">
      Un client vient d'annuler son rendez-vous via le site.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%;">Référence</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a; font-family: monospace;">${data.reference}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Client</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${data.client_prenom} ${data.client_nom}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Email</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">${data.client_email}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">RDV prévu le</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #b91c1c;">${dateLong} de ${heureDebut} à ${heureFin}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Service</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Technicien</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">${data.technicien_prenom}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; vertical-align: top;">Adresse</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">
          ${data.client_adresse}${data.client_complement ? '<br>' + data.client_complement : ''}<br>${data.ville_cp} ${data.ville_nom}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #64748b;">Motif</td>
        <td style="padding: 10px 14px; font-size: 13px; color: #0f172a;">Annulé par le client via le site</td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
      Le créneau est désormais libre. Le client a reçu un email de confirmation d'annulation.
    </p>
  `;

  return {
    subject: `⚠️ Annulation : ${data.client_prenom} ${data.client_nom} - RDV du ${dateLong}`,
    html: genererEmailHTML({
      title: `Annulation RDV - ${data.reference}`,
      preheader: `${data.client_prenom} ${data.client_nom} a annulé son RDV du ${dateLong}.`,
      content,
    }),
  };
}
