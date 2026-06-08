import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorCode = searchParams.get("error_code");
  const next = searchParams.get("next") ?? "/admin";

  // Cas spécifique : lien expiré ou déjà utilisé (Supabase renvoie error_code=otp_expired)
  // Rediriger vers la page reset-password pour demander un nouveau lien
  if (errorCode === "otp_expired") {
    console.error("[/auth/confirm] Lien expiré ou déjà utilisé");
    return NextResponse.redirect(`${origin}/admin/reset-password?error=link_expired`);
  }

  if (!code) {
    console.error("[/auth/confirm] Missing code parameter");
    return NextResponse.redirect(`${origin}/admin/login?error=invalid_link`);
  }

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[/auth/confirm] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${origin}/admin/login?error=invalid_link`);
  }

  // Code échangé contre une session, cookie posé. Redirect vers la page demandée.
  return NextResponse.redirect(`${origin}${next}`);
}
