import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
}

interface Props {
  initialData: BlogPost[]
}

export default function HomeBlog({ initialData }: Props) {
  if (initialData.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Le Carnet de conseils</h2>
          <p className="text-gray-600">Guides pratiques rédigés par nos artisans</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialData.map(post => (
            <article key={post.id} className="group">
              {post.cover_image_url && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/carnet/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
              )}
              <Link
                href={`/carnet/${post.slug}`}
                className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Lire l&apos;article →
              </Link>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/carnet"
            className="inline-block border-2 border-primary text-primary font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  )
}
