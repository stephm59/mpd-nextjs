import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmailRappelJ1 } from "@/lib/brevo/emails";
import { envoyerSmsRappelJ1 } from "@/lib/brevo/sms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Route cron appelée chaque jour à 17h UTC (18h Paris hiver / 19h Paris été).
 * Envoie les rappels J-1 (SMS + email) pour les RDV de demain.
 * Sécurité : header Authorization: Bearer CRON_SECRET requis.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maintenant = new Date();
  const demain = new Date(maintenant);
  demain.setDate(demain.getDate() + 1);

  const debutDemain = new Date(demain.getFullYear(), demain.getMonth(), demain.getDate(), 0, 0, 0);
  const finDemain = new Date(demain.getFullYear(), demain.getMonth(), demain.getDate(), 23, 59, 59);

  const supabase = createAdminClient();

  const { data: rdvsArappeler, error: fetchError } = await supabase
    .from("rdv_reservations")
    .select(`
      id, reference,
      client_prenom, client_nom, client_email, client_telephone,
      client_adresse, client_complement,
      creneau_debut, creneau_fin, prix_centimes,
      tiers_telephone,
      service:rdv_services(nom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom),
      technicien:rdv_techniciens(prenom)
    `)
    .eq("statut", "confirme")
    .gte("creneau_debut", debutDemain.toISOString())
    .lte("creneau_debut", finDemain.toISOString())
    .is("annule_at", null);

  if (fetchError) {
    console.error("[cron/rappels-j1] Erreur fetch:", fetchError);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  if (!rdvsArappeler || rdvsArappeler.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Aucun RDV à rappeler pour demain",
      count: 0,
    });
  }

  const resultats: Array<{
    reference: string;
    email: string;
    sms: string;
    sms_tiers: string;
  }> = [];

  for (const rdv of rdvsArappeler) {
    const { data: dejaEnvoyeList } = await supabase
      .from("rdv_notifications")
      .select("id")
      .eq("reservation_id", rdv.id)
      .eq("type", "rappel_j1")
      .eq("succes", true)
      .limit(1);

    if (dejaEnvoyeList && dejaEnvoyeList.length > 0) {
      resultats.push({ reference: rdv.reference ?? "", email: "skip", sms: "skip", sms_tiers: "skip" });
      continue;
    }

    if (!rdv.reference || !rdv.client_prenom) {
      console.warn("[cron/rappels-j1] RDV avec données incomplètes:", rdv.id);
      resultats.push({ reference: rdv.reference ?? "", email: "skip", sms: "skip", sms_tiers: "skip" });
      continue;
    }

    const emailData = {
      reference: rdv.reference,
      client_prenom: rdv.client_prenom,
      client_nom: rdv.client_nom,
      service_nom: rdv.service?.nom ?? "Intervention",
      marque_nom: rdv.marque?.nom ?? null,
      date_debut: rdv.creneau_debut,
      date_fin: rdv.creneau_fin,
      technicien_prenom: rdv.technicien?.prenom ?? "Notre technicien",
      client_adresse: rdv.client_adresse,
      client_complement: rdv.client_complement,
      ville_nom: rdv.ville?.nom ?? "",
      ville_cp: rdv.ville?.code_postal ?? "",
      prix_centimes: rdv.prix_centimes,
    };

    const smsData = {
      date_debut: rdv.creneau_debut,
      date_fin: rdv.creneau_fin,
      technicien_prenom: rdv.technicien?.prenom ?? "notre technicien",
    };

    const tiersTel =
      rdv.tiers_telephone && rdv.tiers_telephone.trim().length > 0
        ? rdv.tiers_telephone
        : null;

    const [emailResult, smsResult, smsTiersResult] = await Promise.allSettled([
      envoyerEmailRappelJ1(
        { email: rdv.client_email, prenom: rdv.client_prenom, nom: rdv.client_nom },
        emailData
      ),
      envoyerSmsRappelJ1(rdv.client_telephone, smsData),
      tiersTel
        ? envoyerSmsRappelJ1(tiersTel, smsData)
        : Promise.resolve({ success: true, messageId: undefined, error: undefined } as const),
    ]);

    const emailOK = emailResult.status === "fulfilled" && emailResult.value.success;
    const smsOK = smsResult.status === "fulfilled" && smsResult.value.success;
    const smsTiersOK = tiersTel
      ? smsTiersResult.status === "fulfilled" && smsTiersResult.value.success
      : null;

    const emailMessageId =
      emailOK && emailResult.status === "fulfilled" ? emailResult.value.messageId ?? null : null;
    const emailErreur =
      !emailOK && emailResult.status === "fulfilled"
        ? emailResult.value.error ?? null
        : emailResult.status === "rejected"
          ? String(emailResult.reason)
          : null;

    const smsMessageId =
      smsOK && smsResult.status === "fulfilled" ? smsResult.value.messageId ?? null : null;
    const smsErreur =
      !smsOK && smsResult.status === "fulfilled"
        ? smsResult.value.error ?? null
        : smsResult.status === "rejected"
          ? String(smsResult.reason)
          : null;

    const smsTiersMessageId =
      tiersTel && smsTiersOK && smsTiersResult.status === "fulfilled"
        ? smsTiersResult.value.messageId ?? null
        : null;
    const smsTiersErreur =
      tiersTel && !smsTiersOK
        ? smsTiersResult.status === "fulfilled"
          ? smsTiersResult.value.error ?? null
          : String((smsTiersResult as PromiseRejectedResult).reason)
        : null;

    const notifications: Array<{
      reservation_id: string;
      type: string;
      canal: string;
      succes: boolean;
      brevo_message_id: string | null;
      erreur: string | null;
    }> = [
      {
        reservation_id: rdv.id,
        type: "rappel_j1",
        canal: "email",
        succes: emailOK,
        brevo_message_id: emailMessageId,
        erreur: emailErreur,
      },
      {
        reservation_id: rdv.id,
        type: "rappel_j1",
        canal: "sms",
        succes: smsOK,
        brevo_message_id: smsMessageId,
        erreur: smsErreur,
      },
    ];

    if (tiersTel) {
      notifications.push({
        reservation_id: rdv.id,
        type: "rappel_j1",
        canal: "sms",
        succes: smsTiersOK as boolean,
        brevo_message_id: smsTiersMessageId,
        erreur: smsTiersErreur,
      });
    }

    await supabase.from("rdv_notifications").insert(notifications);

    resultats.push({
      reference: rdv.reference,
      email: emailOK ? "ok" : "fail",
      sms: smsOK ? "ok" : "fail",
      sms_tiers: tiersTel ? (smsTiersOK ? "ok" : "fail") : "skip",
    });
  }

  return NextResponse.json({
    success: true,
    count: rdvsArappeler.length,
    resultats,
  });
}
