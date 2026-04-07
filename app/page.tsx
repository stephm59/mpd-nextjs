import type { Metadata } from 'next'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase/server'
import { generateHomeJsonLd } from '@/lib/jsonld'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomeHero from '@/components/sections/HomeHero'
import HomeServices from '@/components/sections/HomeServices'
import HomeTestimonials from '@/components/sections/HomeTestimonials'
import HomeBlog from '@/components/sections/HomeBlog'

export const metadata: Metadata = {
  title: "Mon p'tit Dépanneur : Chauffagiste, Serrurier, Plombier (Lille)",
  description: "Chauffagiste, Serrurier, Plombier à Lille - Intervention d'urgence 24/7 - Devis gratuit. Entreprise locale, disponible 7j/7.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr' },
  openGraph: {
    title: "Mon p'tit Dépanneur : Chauffagiste, Serrurier, Plombier (Lille)",
    description: "Services de réparation d'urgence 24/7 - Chauffage, Plomberie, Serrurerie",
    url: 'https://www.monptitdepanneur.fr',
    images: [{ url: 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-contour-blanc.webp' }],
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
      .select('id, title, slug, excerpt, cover_image_url, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3),
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
        <HomeHero />
        <HomeServices />
        <HomeTestimonials initialData={testimonials ?? []} />
        <HomeBlog initialData={posts ?? []} />
      </main>
      <Footer />
    </>
  )
}
