import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase/server'
import { generateServiceCityJsonLd } from '@/lib/jsonld'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceCityContent from '@/components/sections/ServiceCityContent'

const SERVICES = [
  'plombier',
  'chauffagiste',
  'pompe-a-chaleur',
  'climatisation',
  'renovation-salle-de-bains',
  'serrurier',
  'vitrier',
]

function parseSlug(slug: string): { serviceSlug: string; citySlug: string } | null {
  for (const service of SERVICES) {
    if (slug.startsWith(service + '-') && slug.length > service.length + 1) {
      return { serviceSlug: service, citySlug: slug.slice(service.length + 1) }
    }
  }
  return null
}

export async function generateStaticParams() {
  const supabase = createServerClient()

  const { data: pages } = await supabase
    .from('service_city_pages')
    .select('services(slug), cities(slug)')
    .eq('published', true)

  if (!pages) return []

  return pages.map((page: any) => ({
    slug: `${page.services.slug}-${page.cities.slug}`,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return {}

  const supabase = createServerClient()
  const { data: page } = await supabase
    .from('service_city_pages')
    .select('meta_title, meta_description, services(slug, name), cities(slug, name)')
    .eq('published', true)
    .filter('services.slug', 'eq', parsed.serviceSlug)
    .filter('cities.slug', 'eq', parsed.citySlug)
    .maybeSingle()

  if (!page) return {}
  const p = page as any

  const title = p.meta_title || `${p.services.name} à ${p.cities.name} | Mon p'tit Dépanneur`
  const description = p.meta_description || `${p.services.name} à ${p.cities.name} - Intervention rapide 24/7. Devis gratuit.`

  return {
    title,
    description,
    alternates: { canonical: `https://www.monptitdepanneur.fr/${slug}` },
    openGraph: { title, description, url: `https://www.monptitdepanneur.fr/${slug}` },
  }
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) notFound()

  const { serviceSlug, citySlug } = parsed
  const supabase = createServerClient()

  const { data: pageData } = await supabase
    .from('service_city_pages')
    .select('*, services(id, slug, name), cities(id, slug, name)')
    .eq('published', true)
    .filter('services.slug', 'eq', serviceSlug)
    .filter('cities.slug', 'eq', citySlug)
    .maybeSingle()

  if (!pageData) notFound()

  const page = pageData as any

  const [{ data: offers }, { data: faqs }, { data: genericFaqs }, { data: testimonials }, { data: blogPosts }] =
    await Promise.all([
      supabase
        .from('service_city_offers')
        .select('*')
        .eq('page_id', page.id)
        .order('position'),
      supabase
        .from('service_city_faqs')
        .select('*')
        .eq('service_id', page.services.id)
        .eq('city_id', page.cities.id)
        .eq('published', true)
        .order('position'),
      supabase
        .from('service_faqs_generic')
        .select('*')
        .eq('service_id', page.services.id)
        .eq('published', true)
        .order('position'),
      supabase
        .from('testimonials')
        .select('*')
        .eq('published', true)
        .or(`service_id.eq.${page.services.id},city_id.eq.${page.cities.id}`)
        .limit(6),
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, published_at')
        .eq('published', true)
        .eq('service_id', page.services.id)
        .limit(3),
    ])

  const allFaqs = [...(faqs ?? []), ...(genericFaqs ?? [])]

  const jsonLd = generateServiceCityJsonLd(
    {
      id: page.id,
      services: page.services,
      cities: page.cities,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      cta_subtitle: page.cta_subtitle,
    },
    offers ?? [],
    allFaqs,
    testimonials ?? []
  )

  return (
    <>
      <Script
        id={`json-ld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <ServiceCityContent
          page={page}
          offers={offers ?? []}
          faqs={allFaqs}
          testimonials={testimonials ?? []}
          blogPosts={blogPosts ?? []}
        />
      </main>
      <Footer />
    </>
  )
}
