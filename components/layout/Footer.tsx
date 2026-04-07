'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import ContactForm from '@/components/forms/ContactForm'

const googleBadgeStyles = `
.google-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.55rem .85rem;border:1px solid #e5e7eb;border-radius:999px;font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-decoration:none;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.google-badge:hover{box-shadow:0 4px 12px rgba(0,0,0,.12)}
.g-logo{font-weight:800;background:conic-gradient(from 0deg,#4285F4 0 25%,#EA4335 25% 50%,#FBBC05 50% 75%,#34A853 75% 100%);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:16px}
.g-text{color:#111827}
`

function generateServiceUrl(serviceName: string): string {
  const lower = serviceName.toLowerCase()
  const serviceMapping: Record<string, string> = {
    'plombier': 'plombier',
    'chauffagiste': 'chauffagiste',
    'vitrier': 'vitrier',
    'serrurier': 'serrurier',
    'pompe à chaleur': 'pompe-a-chaleur',
    'climatisation': 'climatisation',
    'rénovation salle de bains': 'renovation-salle-de-bains',
  }
  let serviceSlug = ''
  let cityPart = ''
  for (const [name, slug] of Object.entries(serviceMapping)) {
    if (lower.startsWith(name)) {
      serviceSlug = slug
      cityPart = lower.substring(name.length).trim()
      break
    }
  }
  if (!serviceSlug) return '#'
  let citySlug = cityPart
    .replace(/^(à|de|d'|du|des|le|la|les)\s+/g, '')
    .replace(/à /g, 'a-')
    .replace(/[éè]/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/'/g, '-')
    .replace(/ /g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
  const citySlugMapping: Record<string, string> = {
    'madeleine': 'la-madeleine',
    'saint-andre': 'saint-andre-lez-lille',
    'marcq': 'marcq-en-baroeul',
    'villeneuve': 'villeneuve-d-ascq',
  }
  if (citySlugMapping[citySlug]) citySlug = citySlugMapping[citySlug]
  return `/${serviceSlug}-${citySlug}`
}

const serviceLinks = {
  plomberie: ['Plombier Lille', "Plombier Vieux-Lille", "Plombier Villeneuve-d'Ascq", 'Plombier Marcq-en-Barœul', 'Plombier Bondues', 'Plombier La Madeleine', 'Plombier Lambersart', 'Plombier Saint-André-lez-Lille', 'Plombier Lomme'],
  chauffage: ['Chauffagiste Lille', 'Chauffagiste Vieux-Lille', "Chauffagiste Villeneuve-d'Ascq", 'Chauffagiste Marcq-en-Barœul', 'Chauffagiste Bondues', 'Chauffagiste La Madeleine', 'Chauffagiste Lambersart', 'Chauffagiste Saint-André-lez-Lille', 'Chauffagiste Lomme'],
  pac: ['Pompe à chaleur Lille', 'Pompe à chaleur Vieux-Lille', "Pompe à chaleur Villeneuve-d'Ascq", 'Pompe à chaleur Marcq-en-Barœul', 'Pompe à chaleur Bondues', 'Pompe à chaleur La Madeleine', 'Pompe à chaleur Lambersart', 'Pompe à chaleur Saint-André-lez-Lille', 'Pompe à chaleur Lomme'],
  clim: ['Climatisation Lille', 'Climatisation Vieux-Lille', "Climatisation Villeneuve-d'Ascq", 'Climatisation Marcq-en-Barœul', 'Climatisation Bondues', 'Climatisation La Madeleine', 'Climatisation Lambersart', 'Climatisation Saint-André-lez-Lille', 'Climatisation Lomme'],
  sdb: ['Rénovation salle de bains Lille', 'Rénovation salle de bains Vieux-Lille', "Rénovation salle de bains Villeneuve-d'Ascq", 'Rénovation salle de bains Marcq-en-Barœul', 'Rénovation salle de bains Bondues', 'Rénovation salle de bains La Madeleine', 'Rénovation salle de bains Lambersart', 'Rénovation salle de bains Saint-André-lez-Lille'],
  serrurier: ['Serrurier Lille', 'Serrurier Vieux-Lille', "Serrurier Villeneuve-d'Ascq", 'Serrurier Marcq-en-Barœul', 'Serrurier Bondues', 'Serrurier La Madeleine', 'Serrurier Lambersart', 'Serrurier Saint-André-lez-Lille', 'Serrurier Lomme'],
  vitrier: ['Vitrier Lille', 'Vitrier Vieux-Lille', "Vitrier Villeneuve-d'Ascq", 'Vitrier Marcq-en-Barœul', 'Vitrier Bondues', 'Vitrier La Madeleine', 'Vitrier Lambersart', 'Vitrier Saint-André-lez-Lille', 'Vitrier Lomme'],
}

export default function Footer() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: googleBadgeStyles }} />
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          {/* Top 3 cols */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/logo-mon-ptit-depanneur-contour-blanc.webp"
                alt="Mon p'tit Dépanneur"
                className="h-16 w-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-4">Mon p&apos;tit Dépanneur</h3>
              <p className="text-gray-300 leading-relaxed">
                Votre artisan de confiance à Lille et ses environs pour tous vos travaux de
                chauffage, plomberie, serrurerie et vitrerie.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-6">Accès rapide</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Nous écrire</Link></li>
                <li><Link href="/entreprise" className="text-gray-300 hover:text-white transition-colors">Notre société</Link></li>
                <li><Link href="/carnet" className="text-gray-300 hover:text-white transition-colors">Nos bons conseils</Link></li>
                <li><Link href="/avis" className="text-gray-300 hover:text-white transition-colors">Avis et Photos</Link></li>
                <li><Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">Mentions légales</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-6">Contact</h4>
              <div className="space-y-4">
                <a href="tel:0328534868" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  03 28 53 48 68
                </a>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  Contactez-nous
                </button>
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>21 Rue Edouard Delesalle,<br />59000 Lille</div>
                </div>
                <div className="mt-6">
                  <a
                    href="https://search.google.com/local/writereview?placeid=ChIJozkbGo_VwkcR1vXT4diHCcU"
                    target="_blank"
                    rel="noopener"
                    className="google-badge"
                    aria-label="Donner un avis Google"
                  >
                    <span className="g-logo">G</span>
                    <span className="g-text">Laisser un avis Google</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services grid - 2 rows of 4 */}
          <div className="space-y-12 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Plomberie', links: serviceLinks.plomberie },
                { title: 'Chauffage', links: serviceLinks.chauffage },
                { title: 'Pompe à chaleur', links: serviceLinks.pac },
                { title: 'Climatisation', links: serviceLinks.clim },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
                  <ul className="space-y-2">
                    {links.map((s) => (
                      <li key={s}>
                        <Link href={generateServiceUrl(s)} className="text-gray-400 hover:text-white transition-colors text-sm">
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Salle de bains', links: serviceLinks.sdb },
                { title: 'Serrurier', links: serviceLinks.serrurier },
                { title: 'Vitrerie', links: serviceLinks.vitrier },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
                  <ul className="space-y-2">
                    {links.map((s) => (
                      <li key={s}>
                        <Link href={generateServiceUrl(s)} className="text-gray-400 hover:text-white transition-colors text-sm">
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © Mon p&apos;tit Dépanneur - Tous droits réservés | Un site réalisé avec ❤️ par{' '}
              <a href="https://sprintzero.fr/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                Sprint Zéro
              </a>
            </p>
          </div>
        </div>
      </footer>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Contactez-nous"
        description="Posez-nous votre question ou demandez un devis gratuit. Nous vous répondons rapidement !"
      />
    </>
  )
}
