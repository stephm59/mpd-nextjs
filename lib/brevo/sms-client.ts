import "server-only";
import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_SMS_API_KEY) {
  throw new Error("BREVO_SMS_API_KEY is not defined in environment variables");
}

if (!process.env.BREVO_SMS_SENDER) {
  throw new Error("BREVO_SMS_SENDER is not defined in environment variables");
}

export const brevoSmsClient = new BrevoClient({
  apiKey: process.env.BREVO_SMS_API_KEY,
});

export const SMS_SENDER = process.env.BREVO_SMS_SENDER;
