'use client'

import { useState, useRef } from 'react'
import { Wrench, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BUBBLE_VIDEO_URL,
  PLUMBER_VIDEO_URL,
  HEATING_VIDEO_URL,
  CLIMATISATION_VIDEO_URL,
  HEAT_PUMP_VIDEO_URL,
  LOCKSMITH_VIDEO_URL,
  GLAZIER_VIDEO_URL,
  BATHROOM_VIDEO_URL,
  SERVICE_POSTER,
} from '@/config/media'

interface Props {
  page: {
    h2_intro: string | null
    intro_description: string | null
    services: { name: string; slug: string }
    cities: { name: string }
  }
}

function getVideoUrl(serviceSlug: string): string {
  if (serviceSlug.includes('plomb')) return PLUMBER_VIDEO_URL
  if (serviceSlug.includes('chauffagiste')) return HEATING_VIDEO_URL
  if (serviceSlug.includes('climatisation')) return CLIMATISATION_VIDEO_URL
  if (serviceSlug.includes('pompe-a-chaleur')) return HEAT_PUMP_VIDEO_URL
  if (serviceSlug.includes('serrurier')) return LOCKSMITH_VIDEO_URL
  if (serviceSlug.includes('vitrier')) return GLAZIER_VIDEO_URL
  if (serviceSlug.includes('salle-de-bains')) return BATHROOM_VIDEO_URL
  return BUBBLE_VIDEO_URL
}

export default function ServiceCityIntro({ page }: Props) {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrl = getVideoUrl(page.services.slug)

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
          {/* Circular video */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <div className="relative">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={SERVICE_POSTER}
                className="w-64 h-64 object-cover rounded-full border-4 border-primary shadow-elevated"
                style={{ objectPosition: 'center 25%' }}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-background/90"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-start mb-6">
              <Wrench className="w-8 h-8 text-primary mr-4 mt-1 flex-shrink-0" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {page.h2_intro || `${page.services.name} à ${page.cities.name} : notre expertise à votre service`}
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {page.intro_description ||
                  `Créée par David Vanmarcke il y a 20 ans, la société Mon p'tit Dépanneur emploie aujourd'hui 12 personnes et intervient dans les domaines suivants : Chauffage, serrurerie, plomberie & vitrerie. Basée à Lille, notre équipe se déplace chez vous, sur simple demande ou sur rendez-vous.`}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Basée à Lille, Mon p&apos;tit Dépanneur est agréée par une vingtaine de compagnies d&apos;assurances
                (Macif, Maaf, Gan, Groupama…). Les équipes se déplacent chez vous, sur simple demande ou sur rendez-vous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
