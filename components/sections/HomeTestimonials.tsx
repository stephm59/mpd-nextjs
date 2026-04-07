import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Tables } from '@/lib/supabase/types'

interface Props {
  initialData: Tables<'testimonials'>[]
}

export default function HomeTestimonials({ initialData }: Props) {
  if (initialData.length === 0) return null

  const avgRating = initialData.reduce((s, t) => s + t.rating, 0) / initialData.length

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-primary fill-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ce que disent nos clients
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Plus de 600 avis positifs sur Google témoignent de notre engagement envers la qualité et la satisfaction client.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-rating text-rating' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-muted-foreground ml-2">
              {avgRating.toFixed(1)}/5 ({initialData.length} avis)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {initialData.map((t) => {
            const nameParts = t.author_name.split(' ')
            const displayName = `${nameParts[0]}${nameParts[1] ? ' ' + nameParts[1].charAt(0) + '.' : ''}`

            return (
              <Card key={t.id} className="p-8 bg-white border border-gray-200 hover:shadow-elevated transition-shadow">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-rating text-rating" />
                  ))}
                </div>
                <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-6">
                  &quot;{t.content}&quot;
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{displayName}</div>
                  <div className="text-gray-500 text-sm">{t.location ?? 'Région lilloise'}</div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
