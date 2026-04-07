import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const BASE_URL = 'https://www.monptitdepanneur.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/entreprise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/avis`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/carnet`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Service-city pages
  const { data: servicePages } = await supabase
    .from('service_city_pages')
    .select('services(slug), cities(slug), updated_at')
    .eq('published', true)

  const serviceCityPages: MetadataRoute.Sitemap = (servicePages ?? []).map((page: any) => ({
    url: `${BASE_URL}/${page.services.slug}-${page.cities.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map(post => ({
    url: `${BASE_URL}/carnet/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...serviceCityPages, ...blogPages]
}
