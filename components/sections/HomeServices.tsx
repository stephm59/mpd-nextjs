import Link from 'next/link'

const SERVICES = [
  { name: 'Plombier Lille', href: '/plombier-lille', icon: '🔧', desc: 'Fuite, débouchage, installation' },
  { name: 'Chauffagiste Lille', href: '/chauffagiste-lille', icon: '🔥', desc: 'Chaudière, entretien, panne' },
  { name: 'Pompe à chaleur', href: '/pompe-a-chaleur-lille', icon: '♨️', desc: 'Installation et dépannage PAC' },
  { name: 'Climatisation', href: '/climatisation-lille', icon: '❄️', desc: 'Pose et maintenance clim' },
  { name: 'Salle de bains', href: '/renovation-salle-de-bains-lille', icon: '🛁', desc: 'Rénovation complète' },
  { name: 'Serrurier Lille', href: '/serrurier-lille', icon: '🔑', desc: 'Ouverture de porte, blindage' },
  { name: 'Vitrier Lille', href: '/vitrier-lille', icon: '🪟', desc: 'Remplacement de vitres' },
]

export default function HomeServices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos services</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Des artisans qualifiés pour tous vos besoins à Lille et sa métropole
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICES.map(service => (
            <Link
              key={service.href}
              href={service.href}
              className="group bg-white border-2 border-gray-100 rounded-xl p-6 text-center hover:border-primary hover:shadow-soft transition-all"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500">{service.desc}</p>
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-primary text-white rounded-xl p-6 text-center hover:bg-primary/90 transition-colors"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold mb-1">Urgence ?</h3>
            <p className="text-sm opacity-90">Appelez-nous maintenant</p>
          </Link>
        </div>
      </div>
    </section>
  )
}
