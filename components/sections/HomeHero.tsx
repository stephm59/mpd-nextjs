import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 to-blue-700 text-white pt-20">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Votre Dépanneur à Lille<br />
          <span className="text-yellow-400">24h/24 – 7j/7</span>
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-4 max-w-2xl mx-auto">
          Plombier, Chauffagiste, Serrurier, Vitrier
        </p>
        <p className="text-lg opacity-80 mb-10 max-w-xl mx-auto">
          Intervention rapide sur Lille et sa métropole. Devis gratuit, travaux garantis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:0328534868"
            className="bg-yellow-400 text-blue-900 font-bold text-xl px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            📞 03 28 53 48 68
          </a>
          <Link
            href="/contact"
            className="bg-white/20 backdrop-blur border-2 border-white text-white font-bold text-xl px-8 py-4 rounded-xl hover:bg-white/30 transition-colors"
          >
            Devis gratuit
          </Link>
        </div>
      </div>
    </section>
  )
}
