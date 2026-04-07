'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/forms/ContactForm'

export default function TeamProximity() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Photo équipe */}
            <div className="order-2 lg:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/mpd-photo-equipe.webp"
                alt="Équipe Mon p'tit Dépanneur"
                className="w-auto max-w-full h-auto rounded-2xl shadow-elevated"
                loading="lazy"
              />
            </div>

            {/* Texte */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Un service de proximité et de confiance
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Basés à Lille, nous intervenons dans toute la métropole lilloise. Notre
                engagement : vous offrir un service de qualité avec le sourire, dans le
                respect des délais et des budgets convenus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                  onClick={() => setIsFormOpen(true)}
                >
                  Contactez-nous
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 font-bold px-8"
                >
                  <a href="tel:0328534868" className="flex items-center gap-2">
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
        title="Nous contacter"
        description="Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais."
      />
    </>
  )
}
