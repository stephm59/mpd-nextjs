'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { LOGO_URL } from '@/config/media'

const NAV_LINKS = [
  { label: 'Plomberie', href: '/plombier-lille' },
  { label: 'Chauffage', href: '/chauffagiste-lille' },
  { label: 'Climatisation', href: '/climatisation-lille' },
  { label: 'Pompe à chaleur', href: '/pompe-a-chaleur-lille' },
  { label: 'Salle de bains', href: '/renovation-salle-de-bains-lille' },
  { label: 'Serrurerie', href: '/serrurier-lille' },
  { label: 'Vitrerie', href: '/vitrier-lille' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={LOGO_URL}
            alt="Mon p'tit Dépanneur"
            width={scrolled ? 100 : 120}
            height={scrolled ? 40 : 48}
            className="transition-all duration-300"
            unoptimized
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:0328534868"
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Phone size={16} />
            03 28 53 48 68
          </a>
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            Devis gratuit
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t mt-4 space-y-3">
              <a
                href="tel:0328534868"
                className="flex items-center gap-2 text-primary font-semibold px-4"
              >
                <Phone size={16} />
                03 28 53 48 68
              </a>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block bg-primary text-white font-semibold px-4 py-3 rounded-lg text-center hover:bg-primary/90"
              >
                Devis gratuit
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
