'use client'

import { MapPin, Phone, Clock } from 'lucide-react'
import ContactForm from '@/components/forms/ContactForm'

export function ContactSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl p-6 shadow-card">
        <ContactForm inline />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-4">Nos coordonnées</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Adresse</p>
                <p className="text-muted-foreground text-sm">
                  21 Rue Edouard Delesalle<br />
                  59000 Lille
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Téléphone</p>
                <a href="tel:0328534868" className="text-primary hover:underline font-semibold">
                  03 28 53 48 68
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Horaires</p>
                <p className="text-muted-foreground text-sm">Lundi - Vendredi : 8h00 – 17h30</p>
                <p className="text-muted-foreground text-sm">Samedi - Dimanche : Fermé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
