import type { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CarnetClient from '@/components/blog/CarnetClient'

export const metadata: Metadata = {
  title: "Le Carnet de Mon p'tit Dépanneur - Conseils Plomberie, Chauffage, Serrurerie",
  description: "Conseils pratiques et guides pour la plomberie, le chauffage, la serrurerie et la vitrerie à Lille. Articles rédigés par nos artisans.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/carnet' },
}

export default async function CarnetPage() {
  const posts = await getAllBlogPosts()

  return (
    <>
      <Header />
      <CarnetClient initialPosts={posts} />
      <Footer />
    </>
  )
}
