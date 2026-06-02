import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";

const COULEUR_PRIMAIRE = "#062D7A";

export interface ConfirmationClientData {
  reference: string;
  client_prenom: string;
  service_nom: string;
  marque_nom: string | null;
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
  ville_nom: string;
  ville_cp: string;
  client_adresse: string;
  client_complement: string | null;
  prix_centimes: number;
  prix_libre?: string | null;
  description_intervention?: string | null;
  annulation_token: string;
}

export function genererEmailConfirmationClient(data: ConfirmationClientData): { subject: string; html: string } {
  const dateDebut = new Date(data.date_debut);
  const dateFin = new Date(data.date_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const urlConfirmation = `https://www.monptitdepanneur.fr/rdv/confirmation/${data.reference}`;
  const urlAnnulation = `https://www.monptitdepanneur.fr/rdv/annuler/${data.annulation_token}`;

  const prixAffiche = data.prix_libre && data.prix_libre.trim().length > 0
    ? data.prix_libre.trim()
    : formatPrice(data.prix_centimes);

  const aUnPrix = data.prix_centimes > 0 || (data.prix_libre !== null && data.prix_libre !== undefined && data.prix_libre.trim().length > 0);

  const descriptionPerso = data.description_intervention && data.description_intervention.trim().length > 0
    ? data.description_intervention.trim()
    : null;

  const mentionPaiement = aUnPrix
    ? `
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px 20px; border-radius: 4px; margin: 0 0 25px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #14532d;">
        <strong>Paiement sur place</strong> le jour de l'intervention, par chèque ou espèces. La carte bancaire n'est pas acceptée.
      </p>
    </div>`
    : '';

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #0f172a;">
      Bonjour ${data.client_prenom},
    </h1>
    <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #475569;">
      Votre rendez-vous est <strong style="color: #16a34a;">confirmé</strong> ! 🎉
    </p>

    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #0c4a6e;">
        Référence de votre réservation
      </p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.1em; color: ${COULEUR_PRIMAIRE}; font-family: monospace;">
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
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">${heureDebut} - ${heureFin}</td>
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
          ${prixAffiche}
        </td>
      </tr>
    </table>
    ${descriptionPerso ? `
    <div style="background-color: #fafafa; border-left: 3px solid ${COULEUR_PRIMAIRE}; padding: 14px 18px; border-radius: 4px; margin: 0 0 25px;">
      <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">
        Détails de l'intervention
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #334155; white-space: pre-wrap;">
        ${descriptionPerso}
      </p>
    </div>` : ''}
    ${mentionPaiement}

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 0 0 30px;">
          <a href="${urlConfirmation}" style="display: inline-block; background-color: ${COULEUR_PRIMAIRE}; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">
            Voir ma réservation
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #fefce8; border-left: 4px solid #facc15; padding: 16px 20px; border-radius: 4px; margin: 0 0 25px;">
      <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #713f12;">
        Et maintenant ?
      </h3>
      <ul style="margin: 0; padding: 0 0 0 18px; font-size: 14px; line-height: 1.6; color: #422006;">
        <li style="margin-bottom: 8px;">
          <strong>${data.technicien_prenom}</strong> vous appellera environ 30 minutes avant son arrivée.
        </li>
        <li style="margin-bottom: 8px;">
          Vous recevrez un rappel par SMS la veille de votre rendez-vous.
        </li>
        <li style="margin-bottom: 0;">
          En cas d'imprévu, contactez-nous au <strong>03 28 53 48 68</strong>.
        </li>
      </ul>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0 0;">
      <tr>
        <td align="center">
          <p style="margin: 0 0 8px; font-size: 13px; color: #94a3b8;">
            Vous ne pouvez plus venir ?
          </p>
          <a href="${urlAnnulation}" style="color: #dc2626; text-decoration: underline; font-size: 13px; font-weight: 500;">
            Annuler ce rendez-vous
          </a>
          <p style="margin: 4px 0 0; font-size: 11px; color: #cbd5e1;">
            (jusqu'à 48h avant le rendez-vous)
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 20px 0 0; font-size: 13px; color: #94a3b8; text-align: center;">
      Pour toute question, appelez-nous au 03 28 53 48 68.
    </p>
  `;

  return {
    subject: `Confirmation de votre RDV — ${data.reference}`,
    html: genererEmailHTML({
      title: `Confirmation de votre RDV - Mon p'tit Dépanneur`,
      preheader: `Votre RDV du ${dateLong} à ${heureDebut} est confirmé.`,
      content,
    }),
  };
}
