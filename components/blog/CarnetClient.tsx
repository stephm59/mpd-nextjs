'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { BUBBLE_VIDEO_URL, HERO_POSTER } from '@/config/media'
import { resolveBlogImage } from '@/lib/blog-image'

// Mots-clés présents dans le slug pour afficher le badge "Populaire"
const POPULAR_POST_KEYWORDS = [
  'fuite',
  'urgence',
  'chaudiere',
  'code-erreur',
  'panne',
  'prix',
  'cout',
  'comment',
  'depannage',
  'serrure-bloquee',
  'vitre-cassee',
  'robinet',
  'installation',
]

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  service_id: string | null
  services: { name: string; slug: string } | null
}

interface Props {
  initialPosts: Post[]
}

function isPopular(slug: string): boolean {
  return POPULAR_POST_KEYWORDS.some(kw => slug.includes(kw))
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

export default function CarnetClient({ initialPosts }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  // Catégories distinctes issues des articles
  const categories = useMemo(() => {
    const seen = new Set<string>()
    const cats: { id: string; name: string }[] = []
    for (const post of initialPosts) {
      if (post.service_id && post.services && !seen.has(post.service_id)) {
        seen.add(post.service_id)
        cats.push({ id: post.service_id, name: post.services.name })
      }
    }
    return cats.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [initialPosts])

  // Filtrage client-side
  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return initialPosts.filter(post => {
      if (selectedServiceId && post.service_id !== selectedServiceId) return false
      if (term) {
        const inTitle = post.title.toLowerCase().includes(term)
        const inExcerpt = post.excerpt?.toLowerCase().includes(term) ?? false
        if (!inTitle && !inExcerpt) return false
      }
      return true
    })
  }, [initialPosts, searchTerm, selectedServiceId])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero vidéo */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Le Carnet</h1>
          <p className="text-xl text-white/85 mb-8">Conseils et guides de nos artisans</p>

          {/* Barre de recherche */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/95 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-elevated text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Filtres catégories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setSelectedServiceId(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedServiceId === null
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Tous les articles
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedServiceId(selectedServiceId === cat.id ? null : cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedServiceId === cat.id
                    ? 'bg-primary text-white shadow-card'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Résultats */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => {
              const imgSrc = resolveBlogImage(post.cover_image_url)
              const popular = isPopular(post.slug)
              return (
                <article key={post.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow relative">
                  {popular && (
                    <span className="absolute top-3 left-3 z-10 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      Populaire
                    </span>
                  )}
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
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
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
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-2">Aucun article trouvé.</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-primary hover:underline text-sm">
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
