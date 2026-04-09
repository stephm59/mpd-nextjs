'use client'

import { useState, useRef } from 'react'
import { Wrench, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GENERAL_VIDEO_URL, SERVICE_POSTER } from '@/config/media'

export default function About() {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start max-w-6xl mx-auto">
          {/* Circular video — desktop only */}
          <div className="hidden md:flex flex-shrink-0 justify-center lg:justify-start">
            <div className="relative">
              <video
                ref={videoRef}
                src={GENERAL_VIDEO_URL}
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
                Dépannage, réparation, installation. On s&apos;occupe de tout !
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Créée par David Vanmarcke il y a 20 ans, la société Mon p&apos;tit Dépanneur emploie aujourd&apos;hui 12 personnes et
                intervient dans les domaines suivants : Chauffage (installation de chaudière, réparation, entretien), serrurerie (porte
                bloquée, barillet à changer), plomberie (installation et entretien de cumulus, réparation de fuites) &amp; vitrerie
                (remplacement de petites vitres cassées)…
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Basée à Lille, Mon p&apos;tit Dépanneur est agréée par une vingtaine de compagnies d&apos;assurances (Macif, Maaf, Gan,
                Groupama…). Les équipes se déplacent chez vous, sur simple demande ou sur rendez-vous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
