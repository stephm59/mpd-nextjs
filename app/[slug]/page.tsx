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

async function fetchPageBySlug(serviceSlug: string, citySlug: string) {
  const supabase = createServerClient()
  const [{ data: service }, { data: city }] = await Promise.all([
    supabase.from('services').select('id, slug, name').eq('slug', serviceSlug).maybeSingle(),
    supabase.from('cities').select('id, slug, name').eq('slug', citySlug).maybeSingle(),
  ])
  if (!service || !city) return null

  const { data: page } = await supabase
    .from('service_city_pages')
    .select('*')
    .eq('published', true)
    .eq('service_id', service.id)
    .eq('city_id', city.id)
    .maybeSingle()

  if (!page) return null
  return { ...page, services: service, cities: city }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return {}

  const page = await fetchPageBySlug(parsed.serviceSlug, parsed.citySlug)
  if (!page) return {}

  const title = page.meta_title || `${page.services.name} à ${page.cities.name} | Mon p'tit Dépanneur`
  const description = page.meta_description || `${page.services.name} à ${page.cities.name} - Intervention rapide 24/7. Devis gratuit.`

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

  const page = await fetchPageBySlug(serviceSlug, citySlug)

  if (!page) notFound()

  const supabase = createServerClient()
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
