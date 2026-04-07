import type { Tables } from '@/lib/supabase/types'

interface Props {
  initialData: Tables<'testimonials'>[]
}

export default function HomeTestimonials({ initialData }: Props) {
  if (initialData.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-400 text-2xl">★★★★★</span>
            <span className="font-bold text-gray-700">
              {(initialData.reduce((s, t) => s + t.rating, 0) / initialData.length).toFixed(1)}/5
            </span>
            <span className="text-gray-500">({initialData.length} avis)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialData.map(t => (
            <div key={t.id} className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={i <= t.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.content}&quot;</p>
              <div className="border-t pt-3">
                <p className="font-semibold text-gray-900">{t.author_name}</p>
                {t.location && <p className="text-sm text-gray-500">{t.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
