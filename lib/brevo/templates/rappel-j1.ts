import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";

const COULEUR_PRIMAIRE = "#062D7A";

export interface RappelJ1EmailData {
  reference: string;
  client_prenom: string;
  client_nom: string;
  service_nom: string;
  marque_nom: string | null;
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
  client_adresse: string;
  client_complement: string | null;
  ville_nom: string;
  ville_cp: string;
  prix_centimes: number;
}

export function genererEmailRappelJ1(data: RappelJ1EmailData): { subject: string; html: string } {
  const dateDebut = new Date(data.date_debut);
  const dateFin = new Date(data.date_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #0f172a;">
      Bonjour ${data.client_prenom},
    </h1>
    <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #475569;">
      Petit rappel pour votre rendez-vous <strong style="color: ${COULEUR_PRIMAIRE};">demain</strong> à <strong>${heureDebut}</strong>.
    </p>

    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #0c4a6e;">
        Référence
      </p>
      <p style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.1em; color: ${COULEUR_PRIMAIRE}; font-family: monospace;">
        ${data.reference}
      </p>
    </div>

    <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #0f172a;">
      Détails du rendez-vous
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Service</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Date</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">${dateLong}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Créneau</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: ${COULEUR_PRIMAIRE}; text-align: right;">${heureDebut} - ${heureFin}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Technicien</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">${data.technicien_prenom}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; vertical-align: top;">Adresse</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.client_adresse}${data.client_complement ? '<br><span style="color: #64748b; font-weight: 400;">' + data.client_complement + '</span>' : ''}
          <br><span style="color: #64748b; font-weight: 400;">${data.ville_cp} ${data.ville_nom}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; font-size: 16px; font-weight: 700; color: #0f172a;">Tarif TTC</td>
        <td style="padding: 14px 16px; font-size: 18px; font-weight: 700; color: ${COULEUR_PRIMAIRE}; text-align: right;">
          ${formatPrice(data.prix_centimes)}
        </td>
      </tr>
    </table>

    <div style="background-color: #fefce8; border-left: 4px solid #facc15; padding: 16px 20px; border-radius: 4px; margin: 0 0 25px;">
      <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #713f12;">
        Préparation du rendez-vous
      </h3>
      <ul style="margin: 0; padding: 0 0 0 18px; font-size: 14px; line-height: 1.6; color: #422006;">
        <li style="margin-bottom: 6px;">
          Assurez-vous d'être présent à l'adresse indiquée.
        </li>
        <li style="margin-bottom: 6px;">
          <strong>${data.technicien_prenom}</strong> vous appellera environ 30 minutes avant son arrivée.
        </li>
        <li style="margin-bottom: 0;">
          Préparez l'accès au lieu d'intervention si nécessaire (code, étage, parking).
        </li>
      </ul>
    </div>

    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
      Pour annuler ou décaler, appelez-nous au <strong>03 28 53 48 68</strong>.
    </p>
  `;

  return {
    subject: `Rappel : votre RDV demain à ${heureDebut}`,
    html: genererEmailHTML({
      title: `Rappel RDV - Mon p'tit Dépanneur`,
      preheader: `Votre RDV est prévu demain ${dateLong} à ${heureDebut}.`,
      content,
    }),
  };
}
