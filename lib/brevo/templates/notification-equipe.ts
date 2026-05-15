import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";

export interface NotificationEquipeData {
  reference: string;
  client_prenom: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  client_adresse: string;
  client_complement: string | null;
  notes: string | null;
  service_nom: string;
  marque_nom: string | null;
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
  ville_nom: string;
  ville_cp: string;
  prix_centimes: number;
}

export function genererEmailNotificationEquipe(data: NotificationEquipeData): { subject: string; html: string } {
  const dateDebut = new Date(data.date_debut);
  const dateFin = new Date(data.date_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const content = `
    <h1 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #16a34a;">
      🔔 Nouvelle réservation reçue
    </h1>

    <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; text-align: center; margin: 0 0 25px;">
      <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #166534;">
        Référence
      </p>
      <p style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.08em; color: #14532d; font-family: monospace;">
        ${data.reference}
      </p>
    </div>

    <h2 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #0f172a;">
      Rendez-vous
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%;">Service</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Date</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${dateLong}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Créneau</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${heureDebut} - ${heureFin}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Technicien attribué</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #062D7A;">${data.technicien_prenom}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #64748b;">Tarif TTC</td>
        <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: #0f172a;">${formatPrice(data.prix_centimes)}</td>
      </tr>
    </table>

    <h2 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #0f172a;">
      Client
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 20px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%;">Nom</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">${data.client_prenom} ${data.client_nom}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Téléphone</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">
          <a href="tel:${data.client_telephone}" style="color: #062D7A; text-decoration: none; font-weight: 600;">${data.client_telephone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">Email</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">
          <a href="mailto:${data.client_email}" style="color: #062D7A; text-decoration: none;">${data.client_email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; ${data.notes ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 13px; color: #64748b; vertical-align: top;">Adresse</td>
        <td style="padding: 10px 14px; ${data.notes ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 13px; color: #0f172a;">
          ${data.client_adresse}${data.client_complement ? '<br>' + data.client_complement : ''}<br>${data.ville_cp} ${data.ville_nom}
        </td>
      </tr>
      ${data.notes ? `
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #64748b; vertical-align: top;">Précisions</td>
        <td style="padding: 10px 14px; font-size: 13px; color: #0f172a; font-style: italic;">${data.notes}</td>
      </tr>
      ` : ''}
    </table>

    <div style="background-color: #eff6ff; border-left: 4px solid #062D7A; padding: 14px 18px; border-radius: 4px;">
      <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #062D7A;">
        Action
      </p>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1e293b;">
        Le client recevra un email de confirmation. Pensez à préparer l'intervention.
      </p>
    </div>
  `;

  return {
    subject: `🔔 Nouveau RDV - ${data.client_prenom} ${data.client_nom} le ${dateLong}`,
    html: genererEmailHTML({
      title: `Nouveau RDV - ${data.reference}`,
      preheader: `${data.client_prenom} ${data.client_nom} - ${dateLong} ${heureDebut} - ${data.service_nom}`,
      content,
    }),
  };
}
