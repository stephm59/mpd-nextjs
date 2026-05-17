import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContenuPolitiqueConfidentialite } from '@/components/legal/ContenuPolitiqueConfidentialite'

export const metadata: Metadata = {
  title: "Politique de confidentialité - Mon p'tit Dépanneur",
  description: "Politique de confidentialité et traitement des données personnelles - Mon p'tit Dépanneur Lille.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/politique-de-confidentialite' },
  robots: { index: true, follow: true },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
          <div className="bg-white rounded-xl p-8 shadow-card prose prose-gray max-w-none">
            <ContenuPolitiqueConfidentialite />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
