// Point d'entrée unique — réexporte les deux clients
// Server Components : import { createServerClient } from '@/lib/supabase'
// Client Components : import { supabase } from '@/lib/supabase'
export { createServerClient } from './supabase/server'
export { supabase } from './supabase/client'
export type { Database, Tables, TablesInsert, TablesUpdate } from './supabase/types'

import { createServerClient } from './supabase/server'

export async function getAllBlogPosts() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at, service_id, services(name, slug)')
    .eq('published', true)
    .order('published_at', { ascending: false })
  return (data ?? []) as unknown as Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    cover_image_url: string | null
    published_at: string | null
    service_id: string | null
    services: { name: string; slug: string } | null
  }>
}

export async function getRelatedBlogPosts(
  serviceId: string,
  excludeSlug: string,
  limit = 3
) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at')
    .eq('published', true)
    .eq('service_id', serviceId)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
