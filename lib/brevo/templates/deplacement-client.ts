import { genererEmailHTML } from "./email-base";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatPrice } from "@/lib/rdv/format";
import { formatInTimeZone } from "date-fns-tz";

const COULEUR_PRIMAIRE = "#062D7A";

export interface DeplacementData {
  reference: string;
  client_prenom: string;
  client_nom: string;
  client_email: string;
  client_adresse: string;
  client_complement: string | null;
  service_nom: string;
  marque_nom: string | null;
  ancienne_date_debut: string;
  ancienne_date_fin: string;
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
  ville_nom: string;
  ville_cp: string;
  prix_centimes: number;
  deplace_par: "client" | "equipe";
}

function formatCreneau(debut: string, fin: string): { dateLong: string; plage: string } {
  const dateDebut = new Date(debut);
  const dateFin = new Date(fin);
  return {
    dateLong: `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`,
    plage: `${formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm")} - ${formatInTimeZone(dateFin, "Europe/Paris", "HH:mm")}`,
  };
}

export function genererEmailDeplacementClient(data: DeplacementData): {
  subject: string;
  html: string;
} {
  const ancien = formatCreneau(data.ancienne_date_debut, data.ancienne_date_fin);
  const nouveau = formatCreneau(data.date_debut, data.date_fin);

  const intro =
    data.deplace_par === "equipe"
      ? "Nous avons dû décaler votre rendez-vous. Voici votre nouveau créneau."
      : "Votre rendez-vous a bien été déplacé. Voici votre nouveau créneau.";

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #0f172a;">
      Bonjour ${data.client_prenom},
    </h1>
    <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #475569;">
      ${intro}
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">
        Référence
      </p>
      <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.1em; color: ${COULEUR_PRIMAIRE}; font-family: monospace;">
        ${data.reference}
      </p>
    </div>

    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 0 0 12px; background-color: #f8fafc;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">
        Ancien créneau
      </p>
      <p style="margin: 0; font-size: 15px; color: #94a3b8; text-decoration: line-through;">
        ${ancien.dateLong} · ${ancien.plage}
      </p>
    </div>

    <div style="border: 2px solid ${COULEUR_PRIMAIRE}; border-radius: 8px; padding: 16px 20px; margin: 0 0 30px; background-color: #eff6ff;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${COULEUR_PRIMAIRE};">
        Nouveau créneau
      </p>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">
        ${nouveau.dateLong}
      </p>
      <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #0f172a;">
        ${nouveau.plage}
      </p>
    </div>

    <h2 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #0f172a;">
      Détails de l'intervention
    </h2>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">Service</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">
          ${data.service_nom}${data.marque_nom ? ' · ' + data.marque_nom : ''}
        </td>
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
        <td style="padding: 14px 16px; font-size: 14px; color: #64748b;">Tarif TTC</td>
        <td style="padding: 14px 16px; font-size: 16px; font-weight: 700; color: #0f172a; text-align: right;">${formatPrice(data.prix_centimes)}</td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
      Une question ? Appelez-nous au <strong>03 28 53 48 68</strong>.
    </p>
  `;

  return {
    subject: `Votre RDV a été déplacé — ${data.reference}`,
    html: genererEmailHTML({
      title: `Déplacement de votre RDV - Mon p'tit Dépanneur`,
      preheader: `Nouveau créneau : ${nouveau.dateLong} de ${nouveau.plage}.`,
      content,
    }),
  };
}
