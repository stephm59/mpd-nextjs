'use client'

import { useState } from 'react'
import { Star, Clock, Shield, Wrench, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ContactForm from '@/components/forms/ContactForm'
import { HERO_VIDEO_URL, HERO_POSTER } from '@/config/media'

const features = [
  { icon: Clock, title: 'Intervention < 1h', description: 'Dans Lille et environs', color: 'text-accent' },
  { icon: Shield, title: 'Garantie décennale', description: 'Travaux assurés', color: 'text-success' },
  { icon: Wrench, title: 'Devis gratuit', description: 'Sans engagement', color: 'text-primary-light' },
  { icon: Star, title: 'Artisan de confiance', description: 'Service de qualité', color: 'text-accent' },
]

interface Props {
  title?: string
  subtitle?: string
}

export default function HomeHero({ title, subtitle }: Props = {}) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-visible pt-20 pb-20">
        {/* Background video */}
        <div className="absolute inset-0">
          <video
            src={HERO_VIDEO_URL}
            poster={HERO_POSTER}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              {title ?? (
                <>
                  Mon p&apos;tit dépanneur, votre artisan de confiance{' '}
                  <span className="block text-rating">depuis plus de 20 ans</span>
                </>
              )}
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {subtitle ?? 'à Lille & ses alentours'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated text-lg font-bold"
                onClick={() => setIsFormOpen(true)}
              >
                Demander un devis
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-black/20 hover:bg-white hover:text-primary transition-colors text-lg"
                aria-label="Appeler Mon p'tit Dépanneur"
              >
                <a href="tel:0328534868" className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  03 28 53 48 68
                </a>
              </Button>
            </div>

            {/* Rating */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 mb-16">
              <div className="flex items-center justify-center">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-rating text-rating" />
                ))}
                <div className="relative w-5 h-5">
                  <Star className="absolute inset-0 w-5 h-5 text-white/40" />
                  <div className="overflow-hidden w-1/2 h-full absolute inset-0">
                    <Star className="w-5 h-5 fill-rating text-rating" />
                  </div>
                </div>
              </div>
              <span className="text-white/90 md:ml-2 text-center">
                4,5/5 sur plus de 600 avis clients
              </span>
            </div>
          </div>
        </div>

        {/* Feature cards — overlapping bottom */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-[-60px] md:bottom-[-70px] w-full max-w-6xl px-4 z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="p-6 bg-card/95 backdrop-blur-sm border-none shadow-card hover:shadow-elevated transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Demander un devis gratuit"
        description="Remplissez ce formulaire et nous vous recontacterons rapidement pour établir votre devis personnalisé et sans engagement."
      />
    </>
  )
}
