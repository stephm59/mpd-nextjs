import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BUBBLE_VIDEO_URL, HERO_POSTER } from '@/config/media'
import { resolveBlogImage } from '@/lib/blog-image'

export const metadata: Metadata = {
  title: "Le Carnet de Mon p'tit Dépanneur - Conseils Plomberie, Chauffage, Serrurerie",
  description: "Conseils pratiques et guides pour la plomberie, le chauffage, la serrurerie et la vitrerie à Lille. Articles rédigés par nos artisans.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/carnet' },
}

function getServiceEmoji(serviceSlug?: string): string {
  if (!serviceSlug) return '💡'
  if (serviceSlug.includes('chauffag') || serviceSlug.includes('pompe')) return '🔥'
  if (serviceSlug.includes('plomb')) return '🔧'
  if (serviceSlug.includes('serrurier')) return '🔒'
  if (serviceSlug.includes('vitrier')) return '🪟'
  if (serviceSlug.includes('salle-de-bains')) return '🚿'
  if (serviceSlug.includes('climatisation')) return '❄️'
  return '💡'
}

function getPlaceholderBg(serviceSlug?: string): string {
  if (!serviceSlug) return 'bg-gray-100'
  if (serviceSlug.includes('chauffag') || serviceSlug.includes('pompe')) return 'bg-blue-100'
  if (serviceSlug.includes('plomb')) return 'bg-cyan-100'
  if (serviceSlug.includes('serrurier')) return 'bg-green-100'
  if (serviceSlug.includes('vitrier')) return 'bg-purple-100'
  if (serviceSlug.includes('salle-de-bains')) return 'bg-orange-100'
  return 'bg-gray-100'
}

export default async function CarnetPage() {
  const supabase = createServerClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at, services(name, slug)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero vidéo */}
        <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <video
            src={BUBBLE_VIDEO_URL}
            poster={HERO_POSTER}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Le Carnet</h1>
            <p className="text-xl text-white/90">Conseils et guides de nos artisans</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(posts ?? []).map((post: any) => {
              const imgSrc = resolveBlogImage(post.cover_image_url)
              return (
              <article key={post.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
                {imgSrc ? (
                  <div className="relative h-48">
                    <Image
                      src={imgSrc}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`h-48 flex items-center justify-center ${getPlaceholderBg(post.services?.slug)}`}>
                    <span className="text-5xl">{getServiceEmoji(post.services?.slug)}</span>
                  </div>
                )}
                <div className="p-6">
                  {post.services && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {post.services.name}
                    </span>
                  )}
                  <h2 className="text-xl font-bold mt-2 mb-3 text-gray-900 line-clamp-2">
                    <Link href={`/carnet/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {post.published_at && (
                      <time className="text-xs text-gray-400">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </time>
                    )}
                    <Link
                      href={`/carnet/${post.slug}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Lire →
                    </Link>
                  </div>
                </div>
              </article>
              )
            })}
          </div>

          {(!posts || posts.length === 0) && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Aucun article disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
