import Link from 'next/link'
import { Droplets, Flame, Wind, Thermometer, Bath, Lock, Square } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  { id: 1, title: 'Plombier à Lille', description: 'Réparation de fuites, débouchage de canalisations, remplacement de robinetterie et installation sanitaire.', icon: Droplets, emoji: '🔧', href: '/plombier-lille' },
  { id: 2, title: 'Chauffagiste à Lille', description: 'Installation, entretien et dépannage de tous types de systèmes de chauffage pour votre confort.', icon: Flame, emoji: '🔥', href: '/chauffagiste-lille' },
  { id: 3, title: 'Climatisation à Lille', description: 'Installation et maintenance de systèmes de climatisation pour un confort optimal toute l\'année.', icon: Wind, emoji: '❄️', href: '/climatisation-lille' },
  { id: 4, title: 'Pompe à chaleur à Lille', description: 'Solutions écologiques et économiques avec installation et maintenance de pompes à chaleur.', icon: Thermometer, emoji: '♻️', href: '/pompe-a-chaleur-lille' },
  { id: 5, title: 'Salle de bains à Lille', description: 'Rénovation complète, modernisation et aménagement de votre salle de bains sur mesure.', icon: Bath, emoji: '🚿', href: '/renovation-salle-de-bains-lille' },
  { id: 6, title: 'Serrurier à Lille', description: "Ouverture de porte, changement de serrure, blindage et sécurisation de votre domicile.", icon: Lock, emoji: '🔒', href: '/serrurier-lille' },
  { id: 7, title: 'Vitrier à Lille', description: 'Remplacement de vitres cassées, pose de double vitrage et réparation de fenêtres.', icon: Square, emoji: '🪟', href: '/vitrier-lille' },
]

export default function HomeServices() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos services à Lille et dans la métropole
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            12 artisans qualifiés, du dépannage d&apos;urgence à l&apos;installation complète
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={service.href}>
              <Card className="hover:shadow-elevated transition-all duration-300 border-border/50 transform hover:scale-[1.02] cursor-pointer h-full">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">{service.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
