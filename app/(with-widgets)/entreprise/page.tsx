import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: "L'entreprise Mon p'tit Dépanneur - Artisans à Lille depuis 10 ans",
  description: "Découvrez Mon p'tit Dépanneur, votre artisan de confiance à Lille. Plomberie, chauffage, serrurerie, vitrerie. Certifié RGE, 20 partenaires assureurs.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/entreprise' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: "Mon p'tit Dépanneur",
  description: "Entreprise de dépannage et d'intervention rapide à Lille",
  url: 'https://www.monptitdepanneur.fr',
  telephone: '03 28 53 48 68',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '21 Rue Edouard Delesalle',
    addressLocality: 'Lille',
    postalCode: '59000',
    addressCountry: 'FR',
  },
  openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-17:00'],
}

export default function EntreprisePage() {
  return (
    <>
      <Script
        id="json-ld-entreprise"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Notre entreprise</h1>
            <p className="text-xl opacity-90">Votre artisan de confiance à Lille depuis plus de 10 ans</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Services */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Plomberie', icon: '🔧', desc: 'Dépannage, réparation et installation' },
                { name: 'Chauffage', icon: '🔥', desc: 'Chaudières, pompes à chaleur, radiateurs' },
                { name: 'Serrurerie', icon: '🔑', desc: "Ouverture de porte, blindage, installation" },
                { name: 'Vitrerie', icon: '🪟', desc: 'Remplacement de vitres, double vitrage' },
              ].map(service => (
                <div key={service.name} className="bg-white rounded-xl p-6 shadow-card text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Valeurs */}
          <section className="bg-gray-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Réactivité', desc: 'Intervention en moins de 2h' },
                { title: 'Qualité', desc: 'Travaux garantis et certifiés' },
                { title: 'Transparence', desc: 'Devis gratuit sans surprise' },
                { title: 'Proximité', desc: 'Artisans locaux, vous connaissent' },
              ].map(v => (
                <div key={v.title} className="text-center">
                  <h3 className="font-bold text-xl text-primary mb-2">{v.title}</h3>
                  <p className="text-gray-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certifications</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['RGE', 'Qualibat', 'QualiPAC', 'Professionnel du Gaz'].map(cert => (
                <div key={cert} className="bg-primary text-white px-6 py-3 rounded-full font-semibold">
                  {cert}
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
            <p className="text-xl opacity-90 mb-6">21 Rue Edouard Delesalle, 59000 Lille</p>
            <a
              href="tel:0328534868"
              className="inline-block bg-white text-primary font-bold text-xl px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              03 28 53 48 68
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
