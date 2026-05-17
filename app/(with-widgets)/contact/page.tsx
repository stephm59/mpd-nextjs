import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: "Comment contacter Mon p'tit Dépanneur ?",
  description: "Contactez Mon p'tit Dépanneur pour un devis gratuit ou une intervention d'urgence. Téléphone : 03 28 53 48 68. Disponible 24h/24.",
  alternates: { canonical: 'https://www.monptitdepanneur.fr/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Nous contacter</h1>
            <p className="text-xl opacity-90">Une urgence ? Un devis ? Nous sommes disponibles 24h/24.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Infos contact */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Adresse</p>
                      <p className="text-gray-600">21 Rue Edouard Delesalle<br />59000 Lille</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Téléphone</p>
                      <a href="tel:0328534868" className="text-primary hover:underline font-semibold text-lg">
                        03 28 53 48 68
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">🕐</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Horaires</p>
                      <p className="text-gray-600">Lun-Ven : 8h00 – 19h00</p>
                      <p className="text-gray-600">Sam : 9h00 – 17h00</p>
                      <p className="text-primary font-semibold">Urgences 24h/24</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="bg-white rounded-xl overflow-hidden shadow-card h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2531.8!2d3.0586!3d50.6365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDM4JzExLjQiTiAzwrAwMycxMS4wIkU!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-xl p-8 shadow-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Demander un devis gratuit</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
