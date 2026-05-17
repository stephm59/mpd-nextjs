import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmailAvisPostRdv } from "@/lib/brevo/emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Cron quotidien : envoie l'email "demande d'avis Google" 24h après la fin du RDV.
 * Schedule : 08h UTC (= 10h Paris été / 09h Paris hiver).
 * Idempotent : check rdv_notifications avant chaque envoi.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();

  // Fenêtre : RDV terminés entre -26h et -22h (centrée sur -24h)
  const now = new Date();
  const finMin = new Date(now.getTime() - 26 * 60 * 60 * 1000);
  const finMax = new Date(now.getTime() - 22 * 60 * 60 * 1000);

  const { data: rdvs, error: fetchError } = await supabase
    .from("rdv_reservations")
    .select(`
      id,
      reference,
      creneau_fin,
      statut,
      client_prenom,
      client_email,
      service:rdv_services(nom, est_devis),
      technicien:rdv_techniciens(prenom)
    `)
    .gte("creneau_fin", finMin.toISOString())
    .lte("creneau_fin", finMax.toISOString())
    .neq("statut", "annule");

  if (fetchError) {
    console.error("[cron avis-post-rdv] Erreur fetch:", fetchError);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  if (!rdvs || rdvs.length === 0) {
    return NextResponse.json({ envoyes: 0, skipped: 0, message: "Aucun RDV éligible" });
  }

  let envoyes = 0;
  let skipped = 0;
  let erreurs = 0;

  for (const rdv of rdvs) {
    const { data: dejaEnvoyee } = await supabase
      .from("rdv_notifications")
      .select("id")
      .eq("reservation_id", rdv.id)
      .eq("type", "avis_post")
      .limit(1);

    if (dejaEnvoyee && dejaEnvoyee.length > 0) {
      skipped++;
      continue;
    }

    const service = rdv.service as { nom?: string; est_devis?: boolean } | null;
    const technicien = rdv.technicien as { prenom?: string } | null;

    if (!rdv.client_email || !service?.nom || !technicien?.prenom) {
      console.warn(`[cron avis-post-rdv] Données manquantes pour RDV ${rdv.reference}`);
      erreurs++;
      continue;
    }

    const result = await envoyerEmailAvisPostRdv({
      client_prenom: rdv.client_prenom ?? "Madame/Monsieur",
      client_email: rdv.client_email,
      technicien_prenom: technicien.prenom,
      service_nom: service.nom,
      est_devis: service.est_devis ?? false,
      reference: rdv.reference ?? "",
    });

    await supabase.from("rdv_notifications").insert({
      reservation_id: rdv.id,
      type: "avis_post",
      canal: "email",
      envoyee_at: new Date().toISOString(),
      brevo_message_id: result.success ? result.messageId ?? null : null,
      succes: result.success,
      erreur: result.success ? null : result.error ?? null,
    });

    if (result.success) {
      envoyes++;
    } else {
      erreurs++;
    }
  }

  return NextResponse.json({
    envoyes,
    skipped,
    erreurs,
    total: rdvs.length,
  });
}
