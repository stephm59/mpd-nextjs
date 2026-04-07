import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
      {/* Hero article */}
      <div className="bg-gray-50 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {post.services && (
            <Link
              href={`/${post.services.slug}-lille`}
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wide mb-4 hover:underline"
            >
              {post.services.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
          )}
          {post.published_at && (
            <time className="block mt-4 text-sm text-gray-400">
              Publié le {new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>

      {/* Image de couverture */}
      {resolveBlogImage(post.cover_image_url) && (
        <div className="container mx-auto px-4 max-w-4xl mb-8">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <Image
              src={resolveBlogImage(post.cover_image_url)!}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Contenu */}
      <article className="container mx-auto px-4 max-w-4xl pb-12">
        {post.content && (
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:mx-auto prose-li:text-gray-700 prose-strong:text-gray-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
