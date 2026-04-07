import { Award } from 'lucide-react'

const labels = [
  {
    id: 1,
    name: 'RGE Qualibat',
    description: 'Reconnu Garant de l\'Environnement — qualification nationale pour les travaux de rénovation énergétique.',
    icon: '🏅',
  },
  {
    id: 2,
    name: 'Professionnel du gaz',
    description: 'Certification qualifiée pour l\'installation, l\'entretien et la réparation des équipements à gaz.',
    icon: '🔥',
  },
  {
    id: 3,
    name: 'Artisan qualifié',
    description: 'Artisan certifié avec plus de 20 ans d\'expérience au service des habitants de Lille et de la métropole.',
    icon: '⭐',
  },
]

export default function QualityLabels() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nos certifications & labels qualité
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Des garanties concrètes pour vous assurer des travaux conformes aux normes,
            réalisés par des professionnels qualifiés et assurés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {labels.map((label) => (
            <div
              key={label.id}
              className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-6">{label.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-4">{label.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{label.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
