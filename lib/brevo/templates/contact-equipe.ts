import { genererEmailHTML } from "./email-base";

export interface ContactEquipeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function genererEmailContactEquipe(data: ContactEquipeData): {
  subject: string;
  html: string;
} {
  const subject = `📩 Nouveau contact : ${data.firstName} ${data.lastName}`;

  const content = `
    <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0f172a;">
      Nouveau formulaire de contact
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #64748b;">
      Reçu via le site monptitdepanneur.fr
    </p>

    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 0 0 20px;">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
        Coordonnées
      </h2>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 4px 0; width: 100px; font-size: 13px; color: #64748b;">Nom :</td>
          <td style="padding: 4px 0; font-size: 14px; color: #0f172a; font-weight: 500;">
            ${data.firstName} ${data.lastName}
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Email :</td>
          <td style="padding: 4px 0; font-size: 14px; color: #0f172a;">
            <a href="mailto:${data.email}" style="color: #062D7A; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Téléphone :</td>
          <td style="padding: 4px 0; font-size: 14px; color: #0f172a;">
            <a href="tel:${data.phone.replace(/\s/g, "")}" style="color: #062D7A; text-decoration: none;">${data.phone}</a>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
        Message
      </h2>
      <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>

    <p style="margin: 20px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
      Pensez à rappeler le client dans l'heure pour une bonne expérience.
    </p>
  `;

  return {
    subject,
    html: genererEmailHTML({
      title: `Nouveau contact - Mon p'tit Dépanneur`,
      preheader: `${data.firstName} ${data.lastName} a envoyé un message via le site.`,
      content,
    }),
  };
}
