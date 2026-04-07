import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: "Le Carnet de Mon p'tit Dépanneur - Conseils Plomberie, Chauffage, Serrurerie",
  description: "Conseils pratiques et guides pour la plomberie, le chauffage, la serrurerie et la vitrerie à Lille. Articles rédigés par nos artisans.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/carnet' },
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
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Le Carnet</h1>
            <p className="text-xl opacity-90">Conseils et guides de nos artisans</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(posts ?? []).map((post: any) => (
              <article key={post.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-shadow">
                {post.cover_image_url && (
                  <div className="relative h-48">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
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
            ))}
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
