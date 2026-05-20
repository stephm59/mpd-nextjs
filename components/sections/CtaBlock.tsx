import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  return (
    <section id={id} className="py-12 bg-gradient-to-r from-primary to-primary-light">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 font-bold"
          >
            <Link href="/rdv?tab=contact">Recevoir un devis gratuit</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-accent text-white hover:bg-accent/90 font-bold"
          >
            <Link href="/rdv" className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prendre rdv
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
