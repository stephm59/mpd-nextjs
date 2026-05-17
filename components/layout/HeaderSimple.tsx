'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'

export default function HeaderSimple() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="block" aria-label="Retour à l'accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-contour-blanc.webp"
              alt="Mon p'tit Dépanneur"
              className="h-12 md:h-14 w-auto"
              loading="eager"
            />
          </Link>

          <a
            href="tel:0328534868"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm text-sm font-semibold"
            aria-label="Appeler Mon p'tit Dépanneur"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">03 28 53 48 68</span>
            <span className="sm:hidden">Appeler</span>
          </a>
        </div>
      </div>
    </header>
  )
}
