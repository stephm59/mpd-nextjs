'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/forms/ContactForm'

interface Props {
  title?: string
  subtitle?: string
  id?: string
}

export default function CtaBlock({
  title = "Besoin d'une intervention ?",
  subtitle = 'Contactez-nous pour un devis gratuit et sans engagement',
  id,
}: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <section id={id} className="py-12 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 font-bold"
              onClick={() => setIsFormOpen(true)}
            >
              Recevoir un devis gratuit
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 font-bold"
            >
              <a href="tel:0328534868" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                03 28 53 48 68
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={title}
        description="Décrivez-nous votre projet et recevez un devis personnalisé et gratuit dans les plus brefs délais."
      />
    </>
  )
}
