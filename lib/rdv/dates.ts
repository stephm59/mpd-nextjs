import { addDays, addMinutes, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

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

    const plageDebut = new Date(jour);
    plageDebut.setHours(parsed.debutH, parsed.debutM, 0, 0);
    const plageFin = new Date(jour);
    plageFin.setHours(parsed.finH, parsed.finM, 0, 0);

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
