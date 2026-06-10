export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
export const IS_DEMO = APP_MODE === "demo";
export const IS_PRODUCTION = APP_MODE === "production";
