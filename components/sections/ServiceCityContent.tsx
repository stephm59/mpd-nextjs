'use client'

import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import ServiceCityHero from './ServiceCityHero'
import ServiceCityIntro from './ServiceCityIntro'
import CtaBlock from './CtaBlock'
import WhyChooseUs from './WhyChooseUs'
import TeamProximity from './TeamProximity'
import InsurancePartners from './InsurancePartners'
import MediaCoverage from './MediaCoverage'
import BeforeAfter from './BeforeAfter'
import QualityLabels from './QualityLabels'
import BrandPartners from './BrandPartners'
import ServiceCityZones from './ServiceCityZones'

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
  position?: number | null
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
  cover_image_url: string | null
  published_at: string | null
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

  return (
    <>
      {/* 1. Hero vidéo */}
      <ServiceCityHero page={page} />

      {/* 2. Intro texte (circular video + h2 + description) */}
      <ServiceCityIntro page={page} />

      {/* 3. CTA */}
      <CtaBlock
        id="devis"
        title="Besoin d'une intervention ?"
        subtitle="Contactez-nous pour un devis gratuit et sans engagement"
      />

      {/* 4. Prestations */}
      {offers.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
              Nos prestations {service.name.toLowerCase()} à {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
                  {offer.emoji && <div className="text-3xl mb-3">{offer.emoji}</div>}
                  <h3 className="font-bold text-lg text-foreground mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{offer.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. M6 media coverage */}
      <MediaCoverage />

      {/* 6. Avis clients — localisés en priorité */}
      {testimonials.length > 0 && (() => {
        const cityName = city.name.toLowerCase()
        const local = testimonials.filter(t => t.location?.toLowerCase().includes(cityName))
        const others = testimonials.filter(t => !t.location?.toLowerCase().includes(cityName))
        const displayed = [...local, ...others].slice(0, 6)
        return (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-primary fill-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Ce que disent nos clients
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Plus de 600 avis positifs sur Google témoignent de notre engagement envers la qualité.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {displayed.map((t) => {
                  const parts = t.author_name.split(' ')
                  const displayName = `${parts[0]}${parts[1] ? ' ' + parts[1].charAt(0) + '.' : ''}`
                  return (
                    <div key={t.id} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-elevated transition-shadow">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'fill-rating text-rating' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 italic leading-relaxed mb-4">&quot;{t.content}&quot;</blockquote>
                      <div className="font-semibold text-gray-900">{displayName}</div>
                      {t.location && t.location.trim() && (
                        <div className="text-sm text-muted-foreground">{t.location}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* 7. Pourquoi nous */}
      <div className="bg-muted/50">
        <WhyChooseUs />
      </div>

      {/* 8. Équipe */}
      <TeamProximity />

      {/* 9. Assurances */}
      <InsurancePartners />

      {/* 10. FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={faq.id || i} className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="font-bold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. CTA final */}
      <CtaBlock
        title={page.cta_title || `Prêt à faire appel à nos services ?`}
        subtitle="Demandez votre devis personnalisé dès maintenant"
      />

      {/* 12. Zones */}
      {page.zones_text && (
        <ServiceCityZones zonesText={page.zones_text} cityName={city.name} />
      )}

      {/* 13. Avant/Après (sauf climatisation) */}
      {service.slug !== 'climatisation' && <BeforeAfter />}

      {/* 14. Labels qualité */}
      <div className="bg-muted/50">
        <QualityLabels />
      </div>

      {/* 15. Partenaires marques */}
      <BrandPartners />

      {/* 16. Blog */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Nos conseils</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/carnet/${post.slug}`} className="group block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
                    <div className="relative h-40 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image_url ?? ''}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget
                          el.style.display = 'none'
                          const parent = el.parentElement
                          if (parent) parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">💡</div>'
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3">
                        Lire <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
