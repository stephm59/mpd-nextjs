import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContenuCGV } from '@/components/legal/ContenuCGV'

export const metadata: Metadata = {
  title: "Conditions générales de vente - Mon p'tit Dépanneur",
  description: "CGV - Mon p'tit Dépanneur, prestations de plomberie, chauffage, serrurerie à Lille.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/cgv' },
  robots: { index: true, follow: true },
}

export default function CgvPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions générales de vente</h1>
          <div className="bg-white rounded-xl p-8 shadow-card prose prose-gray max-w-none">
            <ContenuCGV />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
