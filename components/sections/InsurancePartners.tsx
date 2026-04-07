import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'

const insurers = [
  'MAAF', 'GAN', 'MACIF', 'Groupama', 'MMA', 'Allianz',
  'AXA', 'Generali', 'Aviva', 'GMF', 'MAIF', 'Matmut',
]

export default function InsurancePartners() {
  const doubled = [...insurers, ...insurers]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nos partenaires assurances
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Nous sommes agréés par plus de 20 compagnies d&apos;assurances pour faciliter vos démarches et
            vous garantir une prise en charge rapide de vos sinistres.
          </p>
        </div>

        {/* Infinite scroll strip */}
        <div className="overflow-hidden mb-12">
          <div className="flex gap-8 animate-scroll-continuous w-max">
            {doubled.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex-shrink-0 w-32 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm"
              >
                <span className="font-bold text-primary text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-4xl mx-auto p-8 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-primary">Prise en charge directe</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Grâce à nos agréments, nous pouvons intervenir directement sur demande de votre assurance et vous éviter
              l&apos;avance de frais dans la plupart des cas.
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
