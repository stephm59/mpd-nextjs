"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password");
  const passwordConfirm = formData.get("password_confirm");

  if (typeof password !== "string" || !password) {
    redirect("/admin/reset-password/confirm?error=missing_password");
  }

  if (password.length < 8) {
    redirect("/admin/reset-password/confirm?error=password_too_short");
  }

  if (password !== passwordConfirm) {
    redirect("/admin/reset-password/confirm?error=passwords_mismatch");
  }

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.auth.updateUser({
    password: password as string,
  });

  if (error) {
    console.error("[updatePasswordAction] Erreur Supabase Auth:", error.message);
    redirect("/admin/reset-password/confirm?error=update_failed");
  }

  redirect("/admin?password_updated=1");
}
