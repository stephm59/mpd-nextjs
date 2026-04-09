import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { resolveBlogImage } from '@/lib/blog-image'

interface Faq {
  id: string
  question: string
  answer: string
  position: number | null
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
}

interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  updated_at: string
  meta_title: string | null
  meta_description: string | null
  services: { name: string; slug: string } | null
}

interface Props {
  post: Post
  faqs: Faq[]
  relatedPosts: RelatedPost[]
}

export default function BlogPostContent({ post, faqs, relatedPosts }: Props) {
  return (
    <>
      {/* Hero article — image de couverture en fond */}
      <section className="relative min-h-[50vh] flex items-end pb-12 pt-24">
        {resolveBlogImage(post.cover_image_url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveBlogImage(post.cover_image_url)!}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          {post.services && (
            <Link
              href={`/${post.services.slug}-lille`}
              className="inline-block text-xs font-bold text-white/90 bg-white/15 uppercase tracking-widest px-3 py-1 rounded-full mb-6 hover:bg-white/25 transition-colors"
            >
              {post.services.name}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl">{post.excerpt}</p>
          )}
          {post.published_at && (
            <time className="block mt-4 text-sm text-white/60">
              Publié le {new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          )}
        </div>
      </section>

      {/* Contenu */}
      <article className="container mx-auto px-4 max-w-4xl pb-12">
        {post.content && (
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:mx-auto prose-li:text-gray-700 prose-strong:text-gray-900 prose-blockquote:border-primary prose-blockquote:text-gray-600 prose-ul:my-4 prose-ol:my-4 prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqs.map(faq => (
                <div key={faq.id} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-primary text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Besoin d&apos;un professionnel ?</h2>
          <p className="opacity-90 mb-6">Intervention rapide à Lille et sa métropole</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0328534868"
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              📞 03 28 53 48 68
            </a>
            <Link
              href="/contact"
              className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Devis gratuit
            </Link>
          </div>
        </div>
      </article>

      {/* Articles liés */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedPosts.map(related => {
                const relatedImg = resolveBlogImage(related.cover_image_url)
                return (
                <article key={related.id} className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-shadow">
                  {relatedImg && (
                    <div className="relative h-40">
                      <Image
                        src={relatedImg}
                        alt={related.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      <Link href={`/carnet/${related.slug}`} className="hover:text-primary transition-colors">
                        {related.title}
                      </Link>
                    </h3>
                    {related.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                    )}
                  </div>
                </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
