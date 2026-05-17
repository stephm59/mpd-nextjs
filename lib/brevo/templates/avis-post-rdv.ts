import { genererEmailHTML } from "./email-base";

const GOOGLE_REVIEW_URL = "https://g.page/r/Cdb10-HYhwnFEAE/review";

export interface AvisPostRdvData {
  client_prenom: string;
  client_email: string;
  technicien_prenom: string;
  service_nom: string;
  est_devis: boolean;
  reference: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function genererEmailAvisPostRdv(data: AvisPostRdvData): {
  subject: string;
  html: string;
} {
  const subject = data.est_devis
    ? "Comment s'est passée notre visite ? 🙏"
    : "Comment s'est passée notre intervention ? 🙏";

  const verbeAction = data.est_devis ? "est passé chez vous" : "est intervenu chez vous";
  const nomActe = data.est_devis ? "visite" : "intervention";

  const subjectMail = `Retour sur RDV ${data.reference}`;
  const bodyMail = `Bonjour,\n\nJe souhaite vous faire part d'un retour sur l'intervention du ${data.reference} :\n\n`;

  const content = `
    <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a;">
      Bonjour ${escapeHtml(data.client_prenom)},
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; color: #334155; line-height: 1.6;">
      Hier, <strong>${escapeHtml(data.technicien_prenom)}</strong> ${verbeAction} pour
      <strong>${escapeHtml(data.service_nom)}</strong>. Nous espérons que tout s'est bien passé.
    </p>

    <p style="margin: 0 0 24px; font-size: 15px; color: #334155; line-height: 1.6;">
      Votre avis sur Google nous aide énormément à être visible auprès des
      particuliers de Lille qui cherchent un dépanneur de confiance. Cela prend
      30 secondes et fait toute la différence pour notre activité locale.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${GOOGLE_REVIEW_URL}"
         style="display: inline-block; background: #062D7A; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
        ⭐ Laisser un avis sur Google
      </a>
    </div>

    <p style="margin: 24px 0 0; font-size: 14px; color: #64748b; line-height: 1.5; text-align: center;">
      Merci d'avance pour votre soutien !<br>
      L'équipe Mon p'tit Dépanneur
    </p>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 20px;">

    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
      Un problème avec la ${nomActe} ?
      <a href="mailto:contact@monptitdepanneur.fr?subject=${encodeURIComponent(subjectMail)}&body=${encodeURIComponent(bodyMail)}"
         style="color: #64748b; text-decoration: underline;">
        Écrivez-nous directement
      </a>, nous nous en occupons rapidement.
    </p>

    <p style="margin: 12px 0 0; font-size: 11px; color: #cbd5e1; text-align: center;">
      Référence : ${escapeHtml(data.reference)}
    </p>
  `;

  return {
    subject,
    html: genererEmailHTML({
      title: subject,
      preheader: `${data.client_prenom}, votre avis sur ${data.service_nom} aide notre activité locale.`,
      content,
    }),
  };
}
