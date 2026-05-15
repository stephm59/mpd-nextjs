"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/admin/session";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    redirect("/admin/login?error=1");
  }

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD is not defined");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
