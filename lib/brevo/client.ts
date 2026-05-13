import "server-only";
import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is not defined in environment variables");
}

if (!process.env.BREVO_SENDER_EMAIL) {
  throw new Error("BREVO_SENDER_EMAIL is not defined in environment variables");
}

export const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const BREVO_SENDER = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: process.env.BREVO_SENDER_NAME ?? "Mon P'tit Dépanneur",
} as const;
