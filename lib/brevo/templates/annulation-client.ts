import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";

const COULEUR_PRIMAIRE = "#062D7A";

export interface AnnulationData {
  reference: string;
  client_prenom: string;
  client_nom: string;
  client_email: string;
  client_adresse: string;
  client_complement: string | null;
  service_nom: string;
  marque_nom: string | null;
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
  ville_nom: string;
  ville_cp: string;
  prix_centimes: number;
}

export function genererEmailAnnulationClient(data: AnnulationData): { subject: string; html: string } {
  const dateDebut = new Date(data.date_debut);
  const dateFin = new Date(data.date_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const urlReprise = `https://www.monptitdepanneur.fr/rdv`;

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #0f172a;">
      Bonjour ${data.client_prenom},
    </h1>
    <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #475569;">
      Votre rendez-vous a bien été <strong style="color: #64748b;">annulé</strong>. Nous vous confirmons les détails ci-dessous.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">
        Référence du rendez-vous annulé
      </p>
      <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.1em; color: #94a3b8; font-family: monospace; text-decoration: line-through;">
        ${data.reference}
      </p>
    </div>

    <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #0f172a;">
      Rendez-vous annulé
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; opacity: 0.75;">

      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Service</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569; text-align: right;">
          ${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Date prévue</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569; text-align: right; text-decoration: line-through;">${dateLong}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Créneau</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569; text-align: right; text-decoration: line-through;">${heureDebut} - ${heureFin}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Technicien</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #475569; text-align: right;">${data.technicien_prenom}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; font-size: 14px; color: #64748b; vertical-align: top;">Adresse</td>
        <td style="padding: 14px 16px; font-size: 14px; font-weight: 600; color: #475569; text-align: right;">
          ${data.client_adresse}${data.client_complement ? '<br><span style="color: #94a3b8; font-weight: 400;">' + data.client_complement + '</span>' : ''}
          <br><span style="color: #94a3b8; font-weight: 400;">${data.ville_cp} ${data.ville_nom}</span>
        </td>
      </tr>
    </table>

    <div style="background-color: #eff6ff; border-left: 4px solid ${COULEUR_PRIMAIRE}; padding: 16px 20px; border-radius: 4px; margin: 0 0 25px;">
      <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 700; color: ${COULEUR_PRIMAIRE};">
        Vous changez d'avis ?
      </h3>
      <p style="margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: #1e293b;">
        Vous pouvez reprendre un rendez-vous à tout moment en quelques clics, à la date qui vous arrange.
      </p>
      <a href="${urlReprise}" style="display: inline-block; background-color: ${COULEUR_PRIMAIRE}; color: #ffffff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Reprendre un rendez-vous
      </a>
    </div>

    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
      Pour toute question, contactez-nous au <strong>03 28 53 48 68</strong>.
    </p>
  `;

  return {
    subject: `Annulation de votre RDV — ${data.reference}`,
    html: genererEmailHTML({
      title: `Annulation de votre RDV - Mon p'tit Dépanneur`,
      preheader: `Votre rendez-vous du ${dateLong} a bien été annulé.`,
      content,
    }),
  };
}
