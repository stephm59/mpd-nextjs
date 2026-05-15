import "server-only";
import { brevoSmsClient, SMS_SENDER } from "./sms-client";
import { genererSmsRappelJ1, type RappelJ1SmsData } from "./sms-templates/rappel-j1";

export interface EnvoyerSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Normalise un numéro français en format E.164 (+33XXXXXXXXX).
 * 0612345678 / 06 12 34 56 78 -> +33612345678
 */
function normaliserTelephoneFR(tel: string): string | null {
  const clean = tel.replace(/[\s.-]/g, "");
  if (/^0[1-9]\d{8}$/.test(clean)) {
    return "+33" + clean.substring(1);
  }
  if (/^\+33[1-9]\d{8}$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Envoie un SMS rappel J-1 au client via Brevo Transactional SMS.
 * Le numéro doit être un téléphone français (mobile ou fixe).
 */
export async function envoyerSmsRappelJ1(
  destinataire_telephone: string,
  data: RappelJ1SmsData
): Promise<EnvoyerSmsResult> {
  try {
    const telE164 = normaliserTelephoneFR(destinataire_telephone);
    if (!telE164) {
      console.error("[envoyerSmsRappelJ1] Numéro invalide:", destinataire_telephone);
      return { success: false, error: "Numéro de téléphone invalide" };
    }

    const content = genererSmsRappelJ1(data);

    const result = await brevoSmsClient.transactionalSms.sendTransacSms({
      sender: SMS_SENDER,
      recipient: telE164,
      content,
      type: "transactional",
    });

    console.log(
      "[envoyerSmsRappelJ1] SMS envoyé:",
      result.messageId,
      "credits restants:",
      result.remainingCredits ?? "?"
    );

    return {
      success: true,
      messageId: String(result.messageId),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[envoyerSmsRappelJ1] Erreur:", message);
    return { success: false, error: message };
  }
}
