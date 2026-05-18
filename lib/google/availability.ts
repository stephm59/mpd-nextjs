import { getFreeBusy, type BusySlot } from './calendar'
import { getPrimaryTokens } from './admin-storage'
import { createAdminClient } from '@/lib/supabase/admin'

export interface TechnicienBusy {
  technicienId: string
  email: string
  prenom: string
  busySlots: BusySlot[]
}

/**
 * Récupère les périodes d'occupation Google Calendar pour une liste de techs.
 *
 * Comportement de fallback :
 * - Si aucun token OAuth en base → retourne [] (le tunnel proposera tous les créneaux)
 * - Si un tech n'a pas d'email_google → ignoré (pas dans le résultat)
 * - Si l'appel Google échoue pour un tech → busySlots vide (= considéré comme libre)
 */
export async function getTechniciensBusy(
  technicienIds: string[],
  debut: Date,
  fin: Date
): Promise<TechnicienBusy[]> {
  const tokens = await getPrimaryTokens()
  if (!tokens) {
    console.warn('[getTechniciensBusy] Aucun token OAuth, freebusy skippé')
    return []
  }

  const supabase = createAdminClient()
  const { data: techs, error } = await supabase
    .from('rdv_techniciens')
    .select('id, prenom, email_google')
    .in('id', technicienIds)
    .not('email_google', 'is', null)

  if (error || !techs || techs.length === 0) {
    if (error) console.error('[getTechniciensBusy] Erreur Supabase:', error.message)
    return []
  }

  const results = await Promise.all(
    techs.map(async (tech) => {
      const email = tech.email_google!
      const busy = await getFreeBusy(email, debut, fin)
      return {
        technicienId: tech.id,
        email,
        prenom: tech.prenom,
        busySlots: busy,
      }
    })
  )

  return results
}

/**
 * Vérifie si un tech (via ses busy slots) est libre sur un créneau donné.
 */
export function isTechAvailable(
  busySlots: BusySlot[],
  creneauDebut: Date,
  creneauFin: Date
): boolean {
  return !busySlots.some(
    (slot) => slot.start < creneauFin && slot.end > creneauDebut
  )
}

/**
 * Pour une liste de techs et un créneau donné, retourne les IDs des techs libres.
 */
export function getTechsLibres(
  techsBusy: TechnicienBusy[],
  creneauDebut: Date,
  creneauFin: Date
): string[] {
  return techsBusy
    .filter((tech) => isTechAvailable(tech.busySlots, creneauDebut, creneauFin))
    .map((tech) => tech.technicienId)
}
