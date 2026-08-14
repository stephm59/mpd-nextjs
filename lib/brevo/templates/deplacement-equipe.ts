import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";
import type { DeplacementData } from "./deplacement-client";

const COULEUR_PRIMAIRE = "#062D7A";

function formatCreneau(debut: string, fin: string): string {
  const dateDebut = new Date(debut);
  const dateFin = new Date(fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  return `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()} · ${heureDebut} - ${heureFin}`;
}

export function genererEmailDeplacementEquipe(data: DeplacementData): {
  subject: string;
  html: string;
} {
  const ancien = formatCreneau(data.ancienne_date_debut, data.ancienne_date_fin);
  const nouveau = formatCreneau(data.date_debut, data.date_fin);
  const auteur = data.deplace_par === "client" ? "le client" : "l'équipe";

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0f172a;">
      RDV déplacé par ${auteur}
    </h1>
    <p style="margin: 0 0 25px; font-size: 15px; line-height: 1.5; color: #475569;">
      Référence <strong style="font-family: monospace;">${data.reference}</strong> —
      l'agenda Google a été mis à jour automatiquement.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Ancien créneau</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #94a3b8; text-align: right; text-decoration: line-through;">${ancien}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Nouveau créneau</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 700; color: ${COULEUR_PRIMAIRE}; text-align: right;">${nouveau}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Technicien</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">${data.technicien_prenom}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Service</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Client</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.client_prenom} ${data.client_nom}<br>
          <span style="color: #64748b; font-weight: 400;">${data.client_email}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; vertical-align: top;">Adresse</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.client_adresse}${data.client_complement ? '<br><span style="color: #64748b; font-weight: 400;">' + data.client_complement + '</span>' : ''}
          <br><span style="color: #64748b; font-weight: 400;">${data.ville_cp} ${data.ville_nom}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; font-size: 14px; color: #64748b;">Tarif TTC</td>
        <td style="padding: 14px 16px; font-size: 15px; font-weight: 700; color: #0f172a; text-align: right;">${formatPrice(data.prix_centimes)}</td>
      </tr>
    </table>
  `;

  return {
    subject: `RDV déplacé (${auteur}) — ${data.reference}`,
    html: genererEmailHTML({
      title: `RDV déplacé - Mon p'tit Dépanneur`,
      preheader: `${data.reference} : ${nouveau}`,
      content,
    }),
  };
}
