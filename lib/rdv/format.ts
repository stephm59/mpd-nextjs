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

/**
 * Formate le montant à recevoir pour la description Google Calendar.
 * Gère les 3 cas : prix libre (mode perso admin), prix standard (tunnel/admin standard), inconnu.
 *
 * Exemples :
 *   formatMontantPourGoogleCalendar(9100, null) → "Montant à recevoir : 91,00 € (chèque ou espèces)"
 *   formatMontantPourGoogleCalendar(null, "Devis") → "Montant à recevoir : Devis (chèque ou espèces)"
 *   formatMontantPourGoogleCalendar(null, null) → "Montant à recevoir : à définir"
 */
export function formatMontantPourGoogleCalendar(
  prixCentimes: number | null | undefined,
  prixLibre: string | null | undefined
): string {
  if (prixLibre && prixLibre.trim()) {
    return `Montant à recevoir : ${prixLibre.trim()} (chèque ou espèces)`;
  }
  if (prixCentimes && prixCentimes > 0) {
    const montantFormate = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(prixCentimes / 100);
    return `Montant à recevoir : ${montantFormate} (chèque ou espèces)`;
  }
  return `Montant à recevoir : à définir`;
}
