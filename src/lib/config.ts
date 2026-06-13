export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
export const IS_DEMO = APP_MODE === "demo";
export const IS_PRODUCTION = APP_MODE === "production";

/** Enable Better Auth phone-number OTP (production mode only). */
export const ENABLE_PHONE_OTP =
  process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === "true";
export const IS_PHONE_OTP_AVAILABLE = IS_PRODUCTION && ENABLE_PHONE_OTP;
