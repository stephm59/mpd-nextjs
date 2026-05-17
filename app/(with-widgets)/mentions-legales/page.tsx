import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: "Mentions légales - Mon p'tit Dépanneur",
  description: "Mentions légales de Mon p'tit Dépanneur, entreprise de dépannage à Lille.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/mentions-legales' },
  robots: { index: false, follow: false },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions légales</h1>

          <div className="bg-white rounded-xl p-8 shadow-card space-y-8 prose prose-gray max-w-none">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Éditeur du site</h2>
              <p className="text-gray-600 mt-4">
                <strong>Mon p&apos;tit Dépanneur</strong><br />
                21 Rue Edouard Delesalle<br />
                59000 Lille<br />
                Téléphone : 03 28 53 48 68<br />
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Hébergement</h2>
              <p className="text-gray-600 mt-4">
                Ce site est hébergé par Vercel Inc.<br />
                340 Pine Street, Suite 701<br />
                San Francisco, CA 94104, USA
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Propriété intellectuelle</h2>
              <p className="text-gray-600 mt-4">
                L&apos;ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d&apos;auteur.
                Toute reproduction est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Données personnelles</h2>
              <p className="text-gray-600 mt-4">
                Les données collectées via le formulaire de contact sont utilisées uniquement pour répondre
                à vos demandes et ne sont pas transmises à des tiers.
                Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression
                de vos données en nous contactant à l&apos;adresse ci-dessus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
              <p className="text-gray-600 mt-4">
                Ce site utilise Google Analytics pour analyser l&apos;audience. Ces cookies sont anonymisés
                et vous pouvez les désactiver dans les paramètres de votre navigateur.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
