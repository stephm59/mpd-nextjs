import type { Metadata } from 'next'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase/server'
import { generateHomeJsonLd } from '@/lib/jsonld'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// Sections — ordre exact du repo source (src/pages/Index.tsx)
import HomeHero from '@/components/sections/HomeHero'
import About from '@/components/sections/About'
import HomeServices from '@/components/sections/HomeServices'
import MediaCoverage from '@/components/sections/MediaCoverage'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import TeamProximity from '@/components/sections/TeamProximity'
import HomeTestimonials from '@/components/sections/HomeTestimonials'
import InsurancePartners from '@/components/sections/InsurancePartners'
import BeforeAfter from '@/components/sections/BeforeAfter'
import QualityLabels from '@/components/sections/QualityLabels'
import BrandPartners from '@/components/sections/BrandPartners'
import HomeBlog from '@/components/sections/HomeBlog'
import ServiceAreas from '@/components/sections/ServiceAreas'

export const metadata: Metadata = {
  title: "Mon p'tit Dépanneur : Chauffagiste, Serrurier, Plombier (Lille)",
  description: "Une chaudière à changer ? Une serrure à remplacer ? Une fuite d'eau à réparer ? Pour toute urgence : Mon p'tit Dépanneur (03 28 53 48 68)",
  alternates: { canonical: 'https://www.monptitdepanneur.fr' },
  keywords: 'plombier lille, chauffagiste lille, serrurier lille, dépannage lille, pompe à chaleur lille',
  openGraph: {
    title: "Mon p'tit Dépanneur : Chauffagiste, Serrurier, Plombier (Lille)",
    description: "Services de réparation d'urgence 24/7 - Chauffage, Plomberie, Serrurerie",
    url: 'https://www.monptitdepanneur.fr',
    images: [{ url: 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/mpd-photo-equipe.webp' }],
  },
}

export default async function HomePage() {
  const supabase = createServerClient()

  const [{ data: testimonials }, { data: posts }] = await Promise.all([
    supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, published_at, services(name, slug)')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(6),
  ])

  const jsonLd = generateHomeJsonLd()

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* 1 */} <HomeHero />
        {/* 2 */} <About />
        {/* 3 */} <HomeServices />
        {/* 4 */} <MediaCoverage />
        {/* 5 */} <WhyChooseUs />
        {/* 6 */} <TeamProximity />
        {/* 7 */} <HomeTestimonials initialData={testimonials ?? []} />
        {/* 8 */} <InsurancePartners />
        {/* 9 */} <BeforeAfter />
        {/* 10 */} <QualityLabels />
        {/* 11 */} <BrandPartners />
        {/* 12 */} <HomeBlog initialData={(posts ?? []) as any} />
        {/* 13 */} <ServiceAreas />
      </main>
      <Footer />
    </>
  )
}
