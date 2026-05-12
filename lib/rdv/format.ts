/**
 * Formate un prix en centimes vers un string en euros.
 * 9100 → "91 €"
 * 0 → "Gratuit"
 */
export function formatPrice(centimes: number): string {
  if (centimes === 0) return "Gratuit";
  const euros = centimes / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(euros);
}

/**
 * Formate une durée en minutes vers un string lisible.
 * 60 → "1h"
 * 120 → "2h"
 * 90 → "1h30"
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, "0")}`;
}
