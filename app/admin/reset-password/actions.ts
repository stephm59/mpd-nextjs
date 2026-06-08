"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    redirect("/admin/reset-password?error=missing_email");
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;
  const redirectTo = `${baseUrl}/admin/reset-password/confirm`;

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email as string, {
    redirectTo,
  });

  if (error) {
    console.error("[requestPasswordResetAction] Erreur Supabase Auth:", error.message);
  }

  // ⚠️ Toujours rediriger vers /sent même si l'email n'existe pas (sécurité : ne pas
  // révéler quels emails sont enregistrés)
  redirect("/admin/reset-password?sent=1");
}
