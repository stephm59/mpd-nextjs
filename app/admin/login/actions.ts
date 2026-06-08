"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
    redirect("/admin/login?error=missing_fields");
  }

  const supabase = await createSupabaseAuthClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  });

  if (error) {
    console.error("[loginAction] Erreur Supabase Auth:", error.message);
    redirect("/admin/login?error=invalid_credentials");
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
