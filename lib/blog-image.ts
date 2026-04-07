const R2_BASE = 'https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev'

/**
 * Resolves a blog post cover_image_url to an absolute URL.
 *
 * Patterns found in Supabase:
 * - "/blog-images/filename.webp"  → R2_BASE + "/filename.webp" (files at bucket root)
 * - "https://..."                 → use as-is
 * - null                          → null (caller shows placeholder)
 */
export function resolveBlogImage(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  if (url.startsWith('/blog-images/')) return R2_BASE + '/' + url.slice('/blog-images/'.length)
  return null
}
