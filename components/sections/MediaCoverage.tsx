'use client'

import { useState, useRef, useEffect } from 'react'
import { Tv, Star, Phone, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/forms/ContactForm'

const MEDIA_VIDEO_URL = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/video-entretien-chaudiere.mp4'

export default function MediaCoverage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Seek to first frame on mount so the video thumbnail shows the reportage, not a black frame
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const show = () => { v.currentTime = 0.001 }
    if (v.readyState >= 1) {
      show()
    } else {
      v.addEventListener('loadedmetadata', show, { once: true })
    }
  }, [])

  function togglePlay() {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Vidéo */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-2 shadow-elevated">
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={MEDIA_VIDEO_URL}
                    className="w-full h-auto rounded-xl object-cover"
                    preload="metadata"
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-elevated transition-all hover:scale-110"
                      aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-primary" />
                      ) : (
                        <Play className="w-6 h-6 text-primary ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                      VU À LA TV
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Texte */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-6">
                <Tv className="w-8 h-8 text-white" />
                <h2 className="text-3xl md:text-4xl font-bold">Au JT de M6</h2>
              </div>

              <div className="space-y-6 mb-8">
                <p className="text-lg leading-relaxed text-white/90">
                  Sylvie, victime d&apos;un malaise à cause d&apos;une fuite de monoxyde de
                  carbone qui s&apos;échappait de sa chaudière, témoigne sur M6.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  David Vanmarcke, gérant de Mon P&apos;tit Dépanneur, est intervenu
                  immédiatement pour résoudre cette situation d&apos;urgence et
                  potentiellement mortelle.
                </p>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-rating text-rating" />
                  ))}
                </div>
                <span className="text-white font-semibold">Recommandé par nos clients</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary border-white hover:bg-white/90 font-semibold px-8"
                  onClick={() => setIsFormOpen(true)}
                >
                  Recevoir un devis
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 font-bold px-8"
                >
                  <a href="tel:0328534868" className="inline-flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    03 28 53 48 68
                  </a>
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
        description="Suite à votre demande de devis, nous vous recontacterons rapidement pour évaluer vos besoins et vous proposer une solution sur-mesure."
      />
    </>
  )
}
