import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Réservation introuvable
      </h1>
      <p className="text-muted-foreground mb-6">
        La référence que vous avez consultée n&apos;existe pas ou a expiré.
      </p>
      <Card className="mb-6">
        <CardContent className="p-6 text-sm text-left">
          <p className="font-semibold text-foreground mb-2">Que faire ?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Vérifiez que vous avez bien copié la référence complète (format RDV-XXXXXX)</li>
            <li>• Consultez votre email de confirmation pour retrouver le bon lien</li>
            <li>• Contactez-nous au 03 28 53 48 68 si le problème persiste</li>
          </ul>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button asChild>
          <Link href="/rdv">
            Réserver un rendez-vous
          </Link>
        </Button>
      </div>
    </main>
  );
}
