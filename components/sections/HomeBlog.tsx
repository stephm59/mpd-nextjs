'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lightbulb, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  services?: { name: string; slug: string } | null
}

interface Props {
  initialData: BlogPost[]
}

function getCategoryColor(serviceName?: string | null): string {
  const s = serviceName?.toLowerCase() ?? ''
  if (s.includes('pompe') || s.includes('chauffage')) return 'bg-blue-100 text-blue-700'
  if (s.includes('plomberie')) return 'bg-cyan-100 text-cyan-700'
  if (s.includes('serrurerie')) return 'bg-green-100 text-green-700'
  if (s.includes('vitrerie')) return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-700'
}

export default function HomeBlog({ initialData }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (initialData.length === 0) return null

  const perView = 3
  const maxIndex = Math.max(0, initialData.length - perView)
  const visible = initialData.slice(currentIndex, currentIndex + perView)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Les bons conseils de Mon p&apos;tit Dépanneur
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Nos experts partagent leurs conseils et astuces pour vous aider à mieux entretenir vos
            équipements et éviter les pannes
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 border-gray-300"
            onClick={() => setCurrentIndex((i) => (i === 0 ? maxIndex : i - 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 border-gray-300"
            onClick={() => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visible.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-elevated transition-all duration-300 transform hover:scale-105 bg-white border border-gray-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.cover_image_url ?? 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.services?.name)}`}>
                      {article.services?.name ?? 'Conseil'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <Link href={`/carnet/${article.slug}`}>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt ?? "Découvrez nos conseils d'experts pour mieux entretenir vos équipements."}
                  </p>
                  <Link
                    href={`/carnet/${article.slug}`}
                    className="flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
                  >
                    <span>Lire le bon conseil</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mb-8">
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

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
            <Link href="/carnet">
              Voir tous nos conseils
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
