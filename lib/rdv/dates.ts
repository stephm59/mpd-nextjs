import { addDays, addMinutes, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { fromZonedTime } from "date-fns-tz";

const TZ = "Europe/Paris";

/**
 * Au-delà de ce délai minimum (paramètre `delai_minimum_jours`), le tunnel affiche
 * le bandeau « Prochaines disponibilités à partir du … » : sinon le client tombe
 * sur des semaines grisées sans explication.
 */
export const SEUIL_BANDEAU_DELAI_JOURS = 7;

/**
 * Convertit une date "YYYY-MM-DD" en Date au minuit local.
 * Même convention que startOfDay() pour rester cohérent avec le reste du module.
 * Retourne null si la chaîne est absente ou mal formée (on ignore alors le plancher).
 */
export function parseDatePlancher(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Premier jour réservable = max(aujourd'hui + délai minimum, date plancher).
 *
 * Le plancher (paramètre `date_premiere_reservation`) sert à fermer la réservation
 * en ligne jusqu'à une date donnée quand l'équipe est surchargée.
 * Absent ou dépassé → comportement normal piloté par le seul délai minimum.
 */
export function getDatePremierJourReservable(
  delaiMinimumJours: number,
  datePlancher?: string | Date | null
): Date {
  const parDelai = startOfDay(addDays(new Date(), delaiMinimumJours));
  const plancher =
    datePlancher instanceof Date ? startOfDay(datePlancher) : parseDatePlancher(datePlancher);
  if (!plancher) return parDelai;
  return plancher > parDelai ? plancher : parDelai;
}

export function getDateDernierJourReservable(
  delaiMinimumJours: number,
  joursVisiblesFutur: number,
  datePlancher?: string | Date | null
): Date {
  const premier = getDatePremierJourReservable(delaiMinimumJours, datePlancher);
  return addDays(premier, joursVisiblesFutur);
}

export function getJourSemaine(date: Date): string {
  return format(date, "EEEE", { locale: fr }).toLowerCase();
}

export function formatJourLong(date: Date): string {
  const formatted = format(date, "EEEE d MMMM", { locale: fr });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatJourCourt(date: Date): string {
  const formatted = format(date, "EEE dd/MM", { locale: fr });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatHeure(date: Date): string {
  return format(date, "HH:mm");
}

export function parsePlageHoraire(
  plage: string
): { debutH: number; debutM: number; finH: number; finM: number } | null {
  const match = plage.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) return null;
  return {
    debutH: parseInt(match[1], 10),
    debutM: parseInt(match[2], 10),
    finH: parseInt(match[3], 10),
    finM: parseInt(match[4], 10),
  };
}

export function genererCreneauxJour(
  jour: Date,
  plages: string[],
  dureeMinutes: number
): Array<{ debut: Date; fin: Date }> {
  const creneaux: Array<{ debut: Date; fin: Date }> = [];

  for (const plage of plages) {
    const parsed = parsePlageHoraire(plage);
    if (!parsed) continue;

    // Construit "YYYY-MM-DD" à partir du jour (en se basant sur les composantes locales du Date 'jour')
    const y = jour.getFullYear();
    const m = String(jour.getMonth() + 1).padStart(2, "0");
    const d = String(jour.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    // Interprète les heures de plage comme étant en Europe/Paris, converties en instant UTC correct
    const plageDebut = fromZonedTime(
      `${dateStr}T${String(parsed.debutH).padStart(2, "0")}:${String(parsed.debutM).padStart(2, "0")}:00`,
      TZ
    );
    const plageFin = fromZonedTime(
      `${dateStr}T${String(parsed.finH).padStart(2, "0")}:${String(parsed.finM).padStart(2, "0")}:00`,
      TZ
    );

    // Pas de progression : 60min par défaut, ou dureeMinutes si plus court
    // (ex : ballon 30min garde son pas 30min ; 2h/3h/4h passent à un pas 1h)
    const pasMinutes = Math.min(dureeMinutes, 60);

    let cursor = new Date(plageDebut);
    while (true) {
      const finCreneau = addMinutes(cursor, dureeMinutes);
      if (finCreneau > plageFin) break;
      creneaux.push({ debut: new Date(cursor), fin: finCreneau });
      cursor = addMinutes(cursor, pasMinutes);
    }
  }

  return creneaux;
}
