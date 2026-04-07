'use client'

import { useState } from 'react'
import { ImageIcon, Search, X } from 'lucide-react'

const R2 = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev'

const transformations = [
  { url: `${R2}/sdb-1.webp`, alt: 'Rénovation salle de bains 1' },
  { url: `${R2}/sdb-10.webp`, alt: 'Rénovation salle de bains 2' },
  { url: `${R2}/sdb-3.webp`, alt: 'Rénovation salle de bains 3' },
  { url: `${R2}/sdb-5.webp`, alt: 'Rénovation salle de bains 4' },
  { url: `${R2}/sdb-8.webp`, alt: 'Rénovation salle de bains 5' },
  { url: `${R2}/sdb-9.webp`, alt: 'Rénovation salle de bains 6' },
]

export default function BeforeAfter() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ImageIcon className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Avant / Après
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Découvrez la transformation de nos interventions à travers quelques exemples de nos réalisations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {transformations.map((t, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setSelected(t.url)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.url}
                    alt={t.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-elevated">
                      <Search className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-elevated hover:bg-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelected(null) }}
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected}
              alt="Réalisation agrandie"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
