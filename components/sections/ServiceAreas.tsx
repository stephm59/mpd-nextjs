import { MapPin } from 'lucide-react'

const zones = [
  'Lille', 'Vieux-Lille', 'Lambersart', 'La Madeleine', 'Saint-André-lez-Lille',
  'Lomme', 'Villeneuve-d\'Ascq', 'Marcq-en-Barœul', 'Bondues', 'Wambrechies',
  'Roncq', 'Wasquehal', 'Roubaix', 'Tourcoing', 'Croix',
  'Wattrelos', 'Mouvaux', 'Hem', 'Lys-lez-Lannoy', 'Lannoy',
]

export default function ServiceAreas() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Notre zone d&apos;intervention
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nous intervenons rapidement à Lille et dans toute la métropole lilloise —
            chauffage, plomberie, serrurerie, vitrerie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-elevated h-80 lg:h-full min-h-80">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=place_id:ChIJozkbGo_VwkcR1vXT4diHCcU"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mon p'tit Dépanneur — carte"
            />
          </div>

          {/* Zones */}
          <div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">21 Rue Édouard Delesalle</p>
                  <p className="text-muted-foreground">59000 Lille</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-4">
                Communes desservies
              </h3>
              <div className="flex flex-wrap gap-2">
                {zones.map((zone) => (
                  <span
                    key={zone}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {zone}
                  </span>
                ))}
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  + toute la MEL
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Intervention en moins d&apos;une heure dans Lille et ses communes limitrophes.
                  Disponibles 7j/7 pour vos urgences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
