import Link from 'next/link'

interface Offer {
  id: string
  title: string
  description: string
  emoji: string | null
  icon_name: string | null
}

interface Faq {
  id?: string
  question: string
  answer: string
}

interface Testimonial {
  id: string
  author_name: string
  content: string
  rating: number
  location: string | null
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
}

interface PageData {
  id: string
  h1: string | null
  h2_intro: string | null
  intro_description: string | null
  cta_title: string | null
  cta_subtitle: string
  zones_text: string | null
  services: { id: string; name: string; slug: string }
  cities: { id: string; name: string; slug: string }
}

interface Props {
  page: PageData
  offers: Offer[]
  faqs: Faq[]
  testimonials: Testimonial[]
  blogPosts: BlogPost[]
}

export default function ServiceCityContent({ page, offers, faqs, testimonials, blogPosts }: Props) {
  const { services: service, cities: city } = page
  const h1 = page.h1 || `${service.name} à ${city.name}`

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{h1}</h1>
          {page.h2_intro && (
            <p className="text-xl opacity-90 mb-6 max-w-2xl">{page.h2_intro}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:0328534868"
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              📞 03 28 53 48 68
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/20 border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              Devis gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      {page.intro_description && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed">{page.intro_description}</p>
          </div>
        </section>
      )}

      {/* Offres */}
      {offers.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nos prestations {service.name.toLowerCase()} à {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="bg-white rounded-xl p-6 shadow-card">
                  {offer.emoji && <div className="text-3xl mb-3">{offer.emoji}</div>}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{offer.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Avis clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map(t => (
                <div key={t.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <span key={i} className={i <= t.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">&quot;{t.content}&quot;</p>
                  <p className="font-semibold text-gray-900 text-sm">{t.author_name}</p>
                  {t.location && <p className="text-xs text-gray-500">{t.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={faq.id || i} className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles liés */}
      {blogPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos conseils</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <Link key={post.id} href={`/carnet/${post.slug}`} className="group block">
                  <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {page.cta_title || `Besoin d'un ${service.name.toLowerCase()} à ${city.name} ?`}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-xl mx-auto">{page.cta_subtitle}</p>
          {page.zones_text && (
            <p className="text-sm opacity-80 mb-8">{page.zones_text}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0328534868"
              className="inline-block bg-yellow-400 text-blue-900 font-bold text-xl px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              📞 03 28 53 48 68
            </a>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary font-bold text-xl px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Devis gratuit
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
