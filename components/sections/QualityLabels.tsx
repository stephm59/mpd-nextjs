import { Award } from 'lucide-react'

const BASE = 'https://www.monptitdepanneur.fr/lovable-uploads'

const certifications = [
  { name: 'RGE – QUALIBAT-RGE', logo: `${BASE}/05858230-8cb9-41c4-ac57-7030103db388.png`, alt: 'Certification RGE QUALIBAT' },
  { name: 'Professionnel du gaz', logo: `${BASE}/1e6bb0ad-0b6b-4587-8142-96ffc506adc6.png`, alt: 'Certification Professionnel du gaz' },
  { name: 'Artisan', logo: `${BASE}/d1edd0f6-ab9a-4b14-95a7-a0bbe5f86f8a.png`, alt: 'Label Artisan' },
]

export default function QualityLabels() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nos labels qualité
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Des certifications officielles qui garantissent notre expertise et votre sérénité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {certifications.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 text-center border border-gray-100">
              <div className="flex items-center justify-center mb-6 h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logo} alt={c.alt} className="max-h-20 max-w-full object-contain" loading="lazy" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{c.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
