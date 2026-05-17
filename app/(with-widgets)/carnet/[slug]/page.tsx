import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { createServerClient } from '@/lib/supabase/server'
import { getRelatedBlogPosts } from '@/lib/supabase'
import { generateBlogPostJsonLd } from '@/lib/jsonld'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostContent from '@/components/sections/BlogPostContent'

export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)

  return (posts ?? []).map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return {}

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || ''

  return {
    title,
    description,
    alternates: { canonical: `https://www.monptitdepanneur.fr/carnet/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.monptitdepanneur.fr/carnet/${slug}`,
      type: 'article',
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, services(name, slug)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const [{ data: faqs }, relatedPosts] = await Promise.all([
    supabase
      .from('blog_post_faqs')
      .select('*')
      .eq('blog_post_id', post.id)
      .order('position'),
    post.service_id
      ? getRelatedBlogPosts(post.service_id, slug, 3)
      : Promise.resolve([]),
  ])

  const jsonLd = generateBlogPostJsonLd(post)

  return (
    <>
      <Script
        id={`json-ld-blog-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <BlogPostContent post={post as any} faqs={faqs ?? []} relatedPosts={relatedPosts} />
      </main>
      <Footer />
    </>
  )
}
