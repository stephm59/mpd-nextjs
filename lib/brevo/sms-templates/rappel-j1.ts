import { formatInTimeZone } from "date-fns-tz";

export interface RappelJ1SmsData {
  date_debut: string;
  date_fin: string;
  technicien_prenom: string;
}

/**
 * Génère le contenu SMS rappel J-1.
 * Affiche un CRENEAU (ex: "entre 14h00 et 16h00") et non une heure précise.
 * Format sans accent ni apostrophe pour rester GSM-7 (1 SMS = 160 chars).
 */
export function genererSmsRappelJ1(data: RappelJ1SmsData): string {
  const debut = formatInTimeZone(new Date(data.date_debut), "Europe/Paris", "HH'h'mm");
  const fin = formatInTimeZone(new Date(data.date_fin), "Europe/Paris", "HH'h'mm");
  return `Rappel: votre RDV Mon ptit Depanneur demain entre ${debut} et ${fin} avec ${data.technicien_prenom}. Pour annuler: 03 28 53 48 68`;
}
