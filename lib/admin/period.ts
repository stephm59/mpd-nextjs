import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from "date-fns";

export type PeriodPreset = "month" | "last-month" | "3-months" | "12-months" | "custom";

export interface Period {
  from: Date;
  to: Date;
  preset: PeriodPreset;
  label: string;
}

/**
 * Résout la période en fonction des searchParams.
 * Si aucun param ou param invalide → "month" (défaut).
 */
export function resolvePeriod(searchParams: {
  period?: string;
  from?: string;
  to?: string;
}): Period {
  const now = new Date();
  const preset = searchParams.period as PeriodPreset;

  if (preset === "custom" && searchParams.from && searchParams.to) {
    const from = parseISO(searchParams.from);
    const to = parseISO(searchParams.to);
    if (isValid(from) && isValid(to) && from <= to) {
      return {
        from: startOfDay(from),
        to: endOfDay(to),
        preset: "custom",
        label: `Du ${from.toLocaleDateString("fr-FR")} au ${to.toLocaleDateString("fr-FR")}`,
      };
    }
  }

  switch (preset) {
    case "last-month": {
      const lastMonth = subMonths(now, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
        preset: "last-month",
        label: "Mois précédent",
      };
    }
    case "3-months":
      return {
        from: startOfMonth(subMonths(now, 2)),
        to: endOfMonth(now),
        preset: "3-months",
        label: "3 derniers mois",
      };
    case "12-months":
      return {
        from: startOfMonth(subMonths(now, 11)),
        to: endOfMonth(now),
        preset: "12-months",
        label: "12 derniers mois",
      };
    case "month":
    default:
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
        preset: "month",
        label: "Ce mois",
      };
  }
}
