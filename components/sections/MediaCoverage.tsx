'use client'

import { useState } from 'react'
import { Play, Pause, Tv } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/forms/ContactForm'

const R2 = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev'
const MEDIA_VIDEO_URL = `${R2}/video-entretien-chaudiere.mp4`
const MEDIA_POSTER = `${R2}/logo-mon-ptit-depanneur-contour-blanc.webp`

export default function MediaCoverage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)

  function handleRef(el: HTMLVideoElement | null) {
    setVideoEl(el)
  }

  function togglePlay() {
    if (!videoEl) return
    if (isPlaying) {
      videoEl.pause()
      setIsPlaying(false)
    } else {
      videoEl.play()
      setIsPlaying(true)
    }
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Video */}
              <div className="relative rounded-2xl overflow-hidden shadow-elevated group">
                <video
                  ref={handleRef}
                  src={MEDIA_VIDEO_URL}
                  poster={MEDIA_POSTER}
                  className="w-full aspect-video object-cover"
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-elevated"
                    aria-label={isPlaying ? 'Pause' : 'Lecture'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-primary" />
                    ) : (
                      <Play className="w-6 h-6 text-primary ml-1" />
                    )}
                  </button>
                </div>
                {/* VU À LA TV badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                  <Tv className="w-4 h-4" />
                  VU À LA TV
                </div>
              </div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Tv className="w-8 h-8 text-primary" />
                  <span className="text-primary font-semibold uppercase tracking-wide text-sm">
                    Vu sur M6
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Mon p&apos;tit Dépanneur à la télévision
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Notre savoir-faire reconnu a été mis en lumière lors d&apos;un reportage sur M6.
                  David, notre fondateur, vous explique comment entretenir votre chaudière pour
                  optimiser sa longévité et réduire votre consommation d&apos;énergie.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Depuis plus de 20 ans, nous intervenons à Lille et dans toute la métropole pour
                  dépanner, entretenir et installer vos équipements de chauffage, plomberie,
                  serrurerie et vitrerie.
                </p>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() => setIsFormOpen(true)}
                >
                  Demander un devis gratuit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Demander un devis gratuit"
        description="Remplissez ce formulaire et nous vous recontacterons rapidement."
      />
    </>
  )
}
