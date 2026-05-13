export interface EmailBaseOptions {
  title: string;
  preheader: string;
  content: string;
}

const COULEUR_PRIMAIRE = "#062D7A";
const COULEUR_TEXTE = "#0f172a";
const COULEUR_TEXTE_MUTED = "#64748b";
const COULEUR_BORDURE = "#e2e8f0";
const COULEUR_FOND_DOUX = "#f8fafc";

const LOGO_URL = "https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-fond_bleu.png";
const SITE_URL = "https://www.monptitdepanneur.fr";
const TEL_MPD = "03 28 53 48 68";
const TEL_MPD_RAW = "+33328534868";

export function genererEmailHTML({ title, preheader, content }: EmailBaseOptions): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 0 !important; }
      .content-padding { padding: 20px !important; }
      .header-padding { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${COULEUR_FOND_DOUX}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${COULEUR_TEXTE};">

  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
    ${preheader}
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${COULEUR_FOND_DOUX};">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="container" style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <tr>
            <td class="header-padding" style="background-color: ${COULEUR_PRIMAIRE}; padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="Mon p'tit Dépanneur" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;">
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="background-color: ${COULEUR_FOND_DOUX}; padding: 30px; border-top: 1px solid ${COULEUR_BORDURE}; text-align: center; font-size: 13px; color: ${COULEUR_TEXTE_MUTED};">
              <p style="margin: 0 0 10px;">
                <strong style="color: ${COULEUR_TEXTE};">Mon p'tit Dépanneur</strong>
              </p>
              <p style="margin: 0 0 10px;">
                Plombier · Chauffagiste · Serrurier à Lille et alentours
              </p>
              <p style="margin: 0 0 15px;">
                📞 <a href="tel:${TEL_MPD_RAW}" style="color: ${COULEUR_PRIMAIRE}; text-decoration: none;">${TEL_MPD}</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color: ${COULEUR_PRIMAIRE}; text-decoration: none;">monptitdepanneur.fr</a>
              </p>
              <p style="margin: 15px 0 0; font-size: 11px; color: ${COULEUR_TEXTE_MUTED};">
                Cet email vous a été envoyé suite à votre réservation sur monptitdepanneur.fr
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
