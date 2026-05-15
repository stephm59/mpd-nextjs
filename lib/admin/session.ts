import "server-only";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "admin-session";

function getSecret(): string {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is not defined");
  }
  return process.env.ADMIN_SESSION_SECRET;
}

function sign(value: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(value);
  return hmac.digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const timestamp = Date.now().toString();
  const signature = sign(timestamp);
  const value = `${timestamp}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const [timestamp, signature] = cookie.value.split(".");
  if (!timestamp || !signature) return false;

  const expectedSignature = sign(timestamp);
  if (signature !== expectedSignature) return false;

  const age = Date.now() - parseInt(timestamp, 10);
  if (age > 30 * 24 * 60 * 60 * 1000) return false;

  return true;
}
