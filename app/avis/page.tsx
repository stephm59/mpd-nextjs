import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: "Avis clients - Mon p'tit Dépanneur Lille",
  description: "Découvrez les avis de nos clients satisfaits. Plombier, chauffagiste et serrurier à Lille reconnus pour leur réactivité et leur professionnalisme.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/avis' },
}

export default async function AvisPage() {
  const supabase = createServerClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, services(name), cities(name)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const avgRating =
    testimonials && testimonials.length > 0
      ? testimonials.reduce((s: number, t: any) => s + t.rating, 0) / testimonials.length
      : 5

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Avis de nos clients</h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="text-2xl">{i <= Math.round(avgRating) ? '⭐' : '☆'}</span>
                ))}
              </div>
              <span className="text-2xl font-bold">{avgRating.toFixed(1)}/5</span>
              <span className="opacity-80">({testimonials?.length ?? 0} avis)</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(testimonials ?? []).map((t: any) => (
              <div key={t.id} className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={i <= t.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.content}&quot;</p>
                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-900">{t.author_name}</p>
                  {(t.location || t.cities?.name) && (
                    <p className="text-sm text-gray-500">{t.location || t.cities?.name}</p>
                  )}
                  {t.services?.name && (
                    <p className="text-xs text-primary mt-1">{t.services.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
