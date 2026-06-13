export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
export const IS_DEMO = APP_MODE === "demo";
export const IS_PRODUCTION = APP_MODE === "production";

/** Enable Better Auth phone-number OTP (production mode only). */
export const ENABLE_PHONE_OTP =
  process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === "true";
export const IS_PHONE_OTP_AVAILABLE = IS_PRODUCTION && ENABLE_PHONE_OTP;

export type OtpStrategy = "sms" | "whatsapp";

function parseOtpStrategy(value?: string): OtpStrategy {
  const normalized = value?.toLowerCase().trim();
  if (normalized === "whatsapp" || normalized === "whats") return "whatsapp";
  return "sms";
}

/** OTP delivery channel configured via OTP_STRATEGY (sms | whatsapp). */
export const OTP_STRATEGY = parseOtpStrategy(process.env.OTP_STRATEGY);

/** Client-visible OTP channel for UI copy (mirrors OTP_STRATEGY via next.config). */
export const CLIENT_OTP_STRATEGY = parseOtpStrategy(
  process.env.NEXT_PUBLIC_OTP_STRATEGY,
);

export function getOtpDeliveryLabel(strategy: OtpStrategy = CLIENT_OTP_STRATEGY): string {
  return strategy === "whatsapp" ? "WhatsApp" : "SMS";
}

export function getOtpDeliveryHint(strategy: OtpStrategy = CLIENT_OTP_STRATEGY): string {
  return strategy === "whatsapp"
    ? "Include your country code. We'll send a one-time code via WhatsApp."
    : "Include your country code. We'll text you a one-time code via SMS.";
}
