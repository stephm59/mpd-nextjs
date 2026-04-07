import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'

const BASE = 'https://www.monptitdepanneur.fr/lovable-uploads'

const logos = [
  { name: 'MAAF', url: `${BASE}/28ae24a9-b5f4-4997-a612-e7ba2a0bff44.png` },
  { name: 'GAN', url: `${BASE}/65ca6d72-0b3a-4c6b-a32e-8c4f4afc3f3d.png` },
  { name: 'MACIF', url: `${BASE}/7461c7f1-0ba7-4640-a674-74f63cf1cb23.png` },
  { name: 'Groupama', url: `${BASE}/8a07e6ad-843e-4660-b254-036e01df515c.png` },
  { name: 'MMA', url: `${BASE}/76d744d1-b8eb-4306-86cd-c8061399fd55.png` },
  { name: 'Allianz', url: `${BASE}/33d47f5d-ba2c-4f20-b9ca-d9baf196c0de.png` },
  { name: 'AXA', url: `${BASE}/b4975621-639f-4629-84e5-023dce0f8ad6.png` },
  { name: 'Generali', url: `${BASE}/133efda8-3643-486f-99e5-2c19ee840096.png` },
  { name: 'Aviva', url: `${BASE}/542b1ee7-5410-4cc0-98e6-c34d63b35624.png` },
  { name: 'GMF', url: `${BASE}/027311f7-9636-468c-8cb1-ff71ede5f2e2.png` },
  { name: 'MAIF', url: `${BASE}/b2ce8324-e480-47de-b73f-024bafc114a8.png` },
  { name: 'Matmut', url: `${BASE}/c9471c83-2b5d-4ed2-93ec-ff12c79df400.png` },
]

const doubled = [...logos, ...logos]

export default function InsurancePartners() {
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
            vous garantir une prise en charge rapide de vos sinistres
          </p>
        </div>

        {/* Infinite scroll strip */}
        <div className="overflow-hidden mb-12">
          <div className="flex gap-12 animate-scroll-continuous w-max">
            {doubled.map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex-shrink-0 w-40 h-24 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={`Logo ${logo.name}`}
                  className="max-h-20 max-w-40 object-contain"
                  loading="lazy"
                />
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
