import { MapPin } from 'lucide-react'

export default function ServiceAreas() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Zones d&apos;intervention
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Nous nous déplaçons dans les quartiers de Lille (Vieux-Lille, Wazemmes, Vauban, Bois Blancs, Fives…) et dans les
            communes comme Marcq-en-Barœul, La Madeleine, Lambersart, Wasquehal, Villeneuve-d&apos;Ascq, Croix, Bondues…
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.7059302239863!2d3.0639534767775842!3d50.6325794742331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2d58f1a1b39a3%3A0xc50987d8e1d3f5d6!2sMon%20P&#39;tit%20D%C3%A9panneur!5e0!3m2!1sfr!2sfr!4v1757079283815!5m2!1sfr!2sfr"
              className="w-full h-96 md:h-[500px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zones d'intervention Mon p'tit Dépanneur - Lille et environs"
            />
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-elevated p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Notre siège social</h3>
            <p className="text-muted-foreground mb-1">Mon P&apos;tit Dépanneur</p>
            <p className="text-muted-foreground mb-2">21 Rue Édouard Delesalle, 59000 Lille</p>
            <p className="font-semibold text-primary">📞 03 28 53 48 68</p>
          </div>
        </div>
      </div>
    </section>
  )
}
