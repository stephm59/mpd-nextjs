'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Calendar, Phone } from 'lucide-react'
import { TunnelReservation } from '@/components/rdv/TunnelReservation'
import { ContactSection } from '@/components/rdv/ContactSection'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Service = Database['public']['Tables']['rdv_services']['Row']
type Ville = Database['public']['Tables']['rdv_villes']['Row']
type Marque = Database['public']['Tables']['rdv_marques_chaudiere']['Row']

interface Props {
  services: Service[]
  villes: Ville[]
  marques: Marque[]
}

export function RdvContactTabs({ services, villes, marques }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentTab = searchParams.get('tab') === 'contact' ? 'contact' : 'rdv'

  function changeTab(tab: 'rdv' | 'contact') {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'contact') {
      params.set('tab', 'contact')
    } else {
      params.delete('tab')
    }
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    router.push(url, { scroll: false })
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-muted rounded-lg p-1 gap-1" role="tablist">
          <button
            role="tab"
            aria-selected={currentTab === 'rdv'}
            onClick={() => changeTab('rdv')}
            className={cn(
              'flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-md font-medium text-sm transition-all',
              currentTab === 'rdv'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>Prendre RDV</span>
          </button>
          <button
            role="tab"
            aria-selected={currentTab === 'contact'}
            onClick={() => changeTab('contact')}
            className={cn(
              'flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-md font-medium text-sm transition-all',
              currentTab === 'contact'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Phone className="w-4 h-4" />
            <span>Nous contacter</span>
          </button>
        </div>
      </div>

      {currentTab === 'rdv' ? (
        <>
          <TunnelReservation services={services} villes={villes} marques={marques} />

          <div className="mt-8 rounded-lg border border-urgent/30 bg-urgent/5 p-4 text-sm text-foreground">
            <p>
              <strong>Important :</strong> si votre chaudière est en panne, ne réservez pas en ligne.{" "}
              <a href="tel:0328534868" className="text-urgent font-semibold underline">
                Contactez-nous directement par téléphone
              </a>
              {" "}ou{" "}
              <button
                type="button"
                onClick={() => changeTab('contact')}
                className="text-urgent font-semibold underline"
              >
                écrivez-nous
              </button>
              {" "}pour un dépannage rapide.
            </p>
          </div>
        </>
      ) : (
        <ContactSection />
      )}
    </div>
  )
}
