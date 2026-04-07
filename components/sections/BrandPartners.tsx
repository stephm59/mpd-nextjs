import { Handshake } from 'lucide-react'

const R2 = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev'

const brands = [
  { name: 'Vaillant', logo: `${R2}/logo-vaillant.webp` },
  { name: 'ELM Leblanc', logo: `${R2}/logo-elm-leblanc.webp` },
  { name: 'Viessmann', logo: `${R2}/logo-viessmann.webp` },
  { name: 'Atlantic', logo: `${R2}/logo-atlantic.webp` },
  { name: 'Saunier Duval', logo: `${R2}/logo-saunier-duval.webp` },
  { name: 'Frisquet', logo: `${R2}/logo-frisquet.webp` },
  { name: 'De Dietrich', logo: `${R2}/logo-de-dietrich.webp` },
  { name: 'Picard', logo: `${R2}/logo-picard.webp` },
  { name: 'Vachette', logo: `${R2}/logo-vachette.webp` },
  { name: 'Fichet', logo: `${R2}/logo-fichet.webp` },
  { name: 'Bricard', logo: `${R2}/logo-bricard.webp` },
  { name: 'JPM', logo: `${R2}/logo-jpm.webp` },
]

export default function BrandPartners() {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nos marques partenaires
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nous travaillons avec les meilleures marques du marché pour vous garantir
            des équipements fiables et durables.
          </p>
        </div>
      </div>

      {/* Infinite scroll strip */}
      <div className="relative">
        <div className="flex animate-scroll-continuous gap-12 w-max">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-16 w-36 grayscale hover:grayscale-0 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
