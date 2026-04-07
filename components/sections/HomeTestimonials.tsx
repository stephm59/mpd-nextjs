'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Tables } from '@/lib/supabase/types'

interface Props {
  initialData: Tables<'testimonials'>[]
}

export default function HomeTestimonials({ initialData }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (initialData.length === 0) return null

  const avgRating = initialData.reduce((s, t) => s + t.rating, 0) / initialData.length
  const perView = 3
  const maxIndex = Math.max(0, initialData.length - perView)
  const visible = initialData.slice(currentIndex, currentIndex + perView)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-primary fill-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ce que disent nos clients
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Plus de 600 avis positifs sur Google témoignent de notre engagement envers la qualité et la satisfaction client.
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-rating text-rating' : 'text-gray-300'}`} />
            ))}
            <span className="text-muted-foreground ml-2">
              {avgRating.toFixed(1)}/5 ({initialData.length} avis)
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {maxIndex > 0 && (
            <>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow"
                onClick={() => setCurrentIndex((i) => (i === 0 ? maxIndex : i - 1))}
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow"
                onClick={() => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1))}
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((t) => {
              const parts = t.author_name.split(' ')
              const displayName = `${parts[0]}${parts[1] ? ' ' + parts[1].charAt(0) + '.' : ''}`
              return (
                <Card key={t.id} className="p-8 bg-card border border-border hover:shadow-elevated transition-shadow h-full">
                  <CardContent className="p-0">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-rating text-rating" />
                      ))}
                    </div>
                    <blockquote className="text-foreground italic text-lg leading-relaxed mb-6">
                      &quot;{t.content}&quot;
                    </blockquote>
                    <div className="font-semibold text-foreground mb-1">{displayName}</div>
                    <div className="text-muted-foreground text-sm">{t.location ?? 'Région lilloise'}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
