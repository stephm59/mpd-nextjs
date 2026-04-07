'use client'

import { useState } from 'react'
import { ZoomIn, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

const R2 = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev'

const transformations = [
  {
    id: 1,
    before: `${R2}/salle-de-bains-avant-1.jpg`,
    after: `${R2}/salle-de-bains-apres-1.jpg`,
    label: 'Salle de bains complète',
    location: 'Lille',
  },
  {
    id: 2,
    before: `${R2}/salle-de-bains-avant-2.jpg`,
    after: `${R2}/salle-de-bains-apres-2.jpg`,
    label: 'Douche à l\'italienne',
    location: 'Villeneuve-d\'Ascq',
  },
  {
    id: 3,
    before: `${R2}/salle-de-bains-avant-3.jpg`,
    after: `${R2}/salle-de-bains-apres-3.jpg`,
    label: 'Rénovation complète',
    location: 'Marcq-en-Barœul',
  },
  {
    id: 4,
    before: `${R2}/salle-de-bains-avant-4.jpg`,
    after: `${R2}/salle-de-bains-apres-4.jpg`,
    label: 'Modernisation salle de bains',
    location: 'La Madeleine',
  },
  {
    id: 5,
    before: `${R2}/salle-de-bains-avant-5.jpg`,
    after: `${R2}/salle-de-bains-apres-5.jpg`,
    label: 'Pose de carrelage',
    location: 'Lambersart',
  },
  {
    id: 6,
    before: `${R2}/salle-de-bains-avant-6.jpg`,
    after: `${R2}/salle-de-bains-apres-6.jpg`,
    label: 'Réfection totale',
    location: 'Bondues',
  },
]

export default function BeforeAfter() {
  const [lightbox, setLightbox] = useState<{ index: number; type: 'before' | 'after' } | null>(null)

  function prev() {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index - 1 + transformations.length) % transformations.length })
  }

  function next() {
    if (!lightbox) return
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % transformations.length })
  }

  const current = lightbox ? transformations[lightbox.index] : null

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Camera className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Avant / Après : nos réalisations
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Découvrez les transformations réalisées par nos équipes dans les salles de bains
              de nos clients à Lille et dans la métropole lilloise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {transformations.map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="grid grid-cols-2 gap-1">
                  <div
                    className="relative aspect-square overflow-hidden cursor-pointer group"
                    onClick={() => setLightbox({ index, type: 'before' })}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.before}
                      alt={`Avant - ${item.label}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded">
                      AVANT
                    </div>
                  </div>
                  <div
                    className="relative aspect-square overflow-hidden cursor-pointer group"
                    onClick={() => setLightbox({ index, type: 'after' })}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.after}
                      alt={`Après - ${item.label}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute top-2 left-2 bg-success/90 text-white text-xs font-bold px-2 py-1 rounded">
                      APRÈS
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && current && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Précédent"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Suivant"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-2xl w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.type === 'before' ? current.before : current.after}
              alt={`${lightbox.type === 'before' ? 'Avant' : 'Après'} - ${current.label}`}
              className="w-full rounded-xl max-h-[80vh] object-contain"
            />
            <p className="text-white text-center mt-4 font-semibold">
              {lightbox.type === 'before' ? 'Avant' : 'Après'} — {current.label} ({current.location})
            </p>
          </div>
        </div>
      )}
    </>
  )
}
