import { formatInTimeZone } from "date-fns-tz";

export interface RappelJ1SmsData {
  date_debut: string;
  technicien_prenom: string;
}

/**
 * Génère le contenu SMS rappel J-1.
 * Format sans accent ni apostrophe pour rester GSM-7 (1 SMS max = 160 chars).
 */
export function genererSmsRappelJ1(data: RappelJ1SmsData): string {
  const heure = formatInTimeZone(new Date(data.date_debut), "Europe/Paris", "HH:mm");
  return `Rappel: votre RDV Mon ptit Depanneur demain a ${heure} avec ${data.technicien_prenom}. Pour annuler: 03 28 53 48 68`;
}
