import Link from 'next/link'
import Image from 'next/image'
import { LOGO_URL } from '@/config/media'

const SERVICES = [
  { label: 'Plombier Lille', href: '/plombier-lille' },
  { label: 'Chauffagiste Lille', href: '/chauffagiste-lille' },
  { label: 'Pompe à chaleur Lille', href: '/pompe-a-chaleur-lille' },
  { label: 'Climatisation Lille', href: '/climatisation-lille' },
  { label: 'Salle de bains Lille', href: '/renovation-salle-de-bains-lille' },
  { label: 'Serrurier Lille', href: '/serrurier-lille' },
  { label: 'Vitrier Lille', href: '/vitrier-lille' },
]

const QUICK_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'Notre entreprise', href: '/entreprise' },
  { label: 'Le Carnet', href: '/carnet' },
  { label: 'Avis clients', href: '/avis' },
  { label: 'Mentions légales', href: '/mentions-legales' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src={LOGO_URL}
                alt="Mon p'tit Dépanneur"
                width={120}
                height={48}
                unoptimized
                className="mb-4"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre artisan de confiance à Lille pour la plomberie, le chauffage,
              la serrurerie et la vitrerie. Disponible 24h/24.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4">Nos services</h3>
            <ul className="space-y-2">
              {SERVICES.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div>
                <a href="tel:0328534868" className="text-primary font-bold text-lg hover:underline">
                  03 28 53 48 68
                </a>
              </div>
              <p className="text-gray-400">
                21 Rue Edouard Delesalle<br />
                59000 Lille
              </p>
              <p className="text-gray-400">
                Lun-Ven : 8h00 – 19h00<br />
                Sam : 9h00 – 17h00<br />
                <span className="text-primary font-semibold">Urgences 24h/24</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {currentYear} Mon p&apos;tit Dépanneur – Tous droits réservés
          </p>
          <Link href="/mentions-legales" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}
