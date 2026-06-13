import type { OtpStrategy } from "@/lib/config";

function getTwilioCredentials() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  };
}

function getOtpMessage(code: string): string {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Elara";
  return `Your ${siteName} verification code is: ${code}`;
}

function toWhatsAppAddress(phoneNumber: string): string {
  const normalized = phoneNumber.trim();
  if (normalized.startsWith("whatsapp:")) return normalized;
  return `whatsapp:${normalized}`;
}

async function sendTwilioMessage(
  to: string,
  from: string,
  body: string,
  channel: OtpStrategy,
): Promise<void> {
  const { accountSid, authToken } = getTwilioCredentials();
  if (!accountSid || !authToken) return;

  const payload = new URLSearchParams({ To: to, From: from, Body: body });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`[OTP:${channel}] Twilio delivery failed:`, error);
    throw new Error(`Failed to send OTP via ${channel}`);
  }
}

function sendSmsOtp(phoneNumber: string, code: string): void {
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const { accountSid, authToken } = getTwilioCredentials();

  if (accountSid && authToken && fromNumber) {
    void sendTwilioMessage(phoneNumber, fromNumber, getOtpMessage(code), "sms").catch(
      (err) => console.error("[OTP:sms] Failed to send:", err),
    );
    return;
  }

  logDevOtp("sms", phoneNumber, code);
}

function sendWhatsAppOtp(phoneNumber: string, code: string): void {
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  const { accountSid, authToken } = getTwilioCredentials();

  if (accountSid && authToken && fromNumber) {
    const from = fromNumber.startsWith("whatsapp:")
      ? fromNumber
      : toWhatsAppAddress(fromNumber);

    void sendTwilioMessage(
      toWhatsAppAddress(phoneNumber),
      from,
      getOtpMessage(code),
      "whatsapp",
    ).catch((err) => console.error("[OTP:whatsapp] Failed to send:", err));
    return;
  }

  logDevOtp("whatsapp", phoneNumber, code);
}

function logDevOtp(channel: OtpStrategy, phoneNumber: string, code: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Phone OTP:${channel}] ${phoneNumber}: ${code}`);
    return;
  }

  if (channel === "whatsapp") {
    console.error(
      "[OTP:whatsapp] No provider configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM.",
    );
    return;
  }

  console.error(
    "[OTP:sms] No provider configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
  );
}

export function sendOtp(
  phoneNumber: string,
  code: string,
  strategy: OtpStrategy,
): void {
  if (strategy === "whatsapp") {
    sendWhatsAppOtp(phoneNumber, code);
    return;
  }

  sendSmsOtp(phoneNumber, code);
}
