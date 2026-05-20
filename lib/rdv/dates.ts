import { addDays, addMinutes, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { fromZonedTime } from "date-fns-tz";

const TZ = "Europe/Paris";

export function getDatePremierJourReservable(delaiMinimumJours: number): Date {
  return startOfDay(addDays(new Date(), delaiMinimumJours));
}

export function getDateDernierJourReservable(
  delaiMinimumJours: number,
  joursVisiblesFutur: number
): Date {
  const premier = getDatePremierJourReservable(delaiMinimumJours);
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

    let cursor = new Date(plageDebut);
    while (true) {
      const finCreneau = addMinutes(cursor, dureeMinutes);
      if (finCreneau > plageFin) break;
      creneaux.push({ debut: new Date(cursor), fin: finCreneau });
      cursor = finCreneau;
    }
  }

  return creneaux;
}
