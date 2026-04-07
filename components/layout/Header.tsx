'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/forms/ContactForm'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Plombier', href: '/plombier-lille' },
  { name: 'Chauffage', href: '/chauffagiste-lille' },
  { name: 'Climatisation', href: '/climatisation-lille' },
  { name: 'Pompe à chaleur', href: '/pompe-a-chaleur-lille' },
  { name: 'Salle de bains', href: '/renovation-salle-de-bains-lille' },
  { name: 'Serrurier', href: '/serrurier-lille' },
  { name: 'Vitrier', href: '/vitrier-lille' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isScrolled = mounted && scrollY > 50
  const isCompact = scrollY > 100

  return (
    <>
      <header
        className={cn(
          'absolute top-0 inset-x-0 z-50 transition-all duration-300 will-change-transform',
          isScrolled
            ? 'fixed bg-white/80 backdrop-blur-md text-foreground shadow-sm'
            : 'text-white'
        )}
      >
        <div className="container mx-auto px-4">
          <div
            className={cn(
              'flex justify-between transition-all duration-300',
              isScrolled ? 'items-center' : 'items-start',
              isCompact ? 'py-2' : 'py-4'
            )}
          >
            {/* Logo */}
            <Link href="/" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-contour-blanc.webp"
                alt="Mon p'tit Dépanneur"
                className={cn(
                  'w-auto transition-all duration-300',
                  isScrolled ? 'h-12 md:h-16' : 'h-24 md:h-40'
                )}
                loading="eager"
              />
            </Link>

            {/* Desktop Nav */}
            <nav
              className={cn(
                'hidden lg:flex items-center space-x-6 transition-all duration-300',
                !isScrolled && 'pt-6'
              )}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'transition-colors duration-200 font-medium relative pb-1',
                    'hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-red-600 hover:after:rounded-full',
                    isScrolled
                      ? 'text-foreground/90 hover:text-foreground'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div
              className={cn(
                'flex items-center gap-4 transition-all duration-300',
                !isScrolled && 'pt-4'
              )}
            >
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-10 transition-colors duration-300',
                    isScrolled
                      ? 'bg-white text-foreground border-border hover:bg-secondary'
                      : 'bg-black text-white border-black hover:bg-black/90'
                  )}
                  onClick={() => setIsFormOpen(true)}
                >
                  Devis gratuit
                </Button>
              </div>
              <a
                href="tel:0328534868"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors shadow-lg h-10"
                aria-label="Appeler Mon p'tit Dépanneur"
              >
                <Phone className="w-5 h-5" />
                03 28 53 48 68
              </a>

              {/* Mobile burger */}
              <button
                className={cn(
                  'lg:hidden p-2 transition-colors duration-300',
                  isScrolled ? 'text-foreground' : 'text-white'
                )}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <nav
              className={cn(
                'lg:hidden mt-4 pb-4 border-t pt-4 rounded-lg',
                isScrolled
                  ? 'border-border bg-white/90 backdrop-blur-md'
                  : 'border-white/20 bg-black/60 backdrop-blur-md'
              )}
            >
              <div className="flex flex-col space-y-3 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'font-medium py-2 transition-colors duration-200',
                      isScrolled
                        ? 'text-foreground/90 hover:text-foreground'
                        : 'text-white/90 hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <a
                  href="tel:0328534868"
                  className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Phone className="w-4 h-4" />
                  03 28 53 48 68
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Demander un devis gratuit"
        description="Remplissez ce formulaire et nous vous recontacterons rapidement pour établir votre devis personnalisé et sans engagement."
      />
    </>
  )
}
