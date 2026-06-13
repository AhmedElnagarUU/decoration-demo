/**
 * Sends an OTP code via SMS. Uses Twilio when configured; otherwise logs in development.
 */
export function sendSmsOtp(phoneNumber: string, code: string): void {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (accountSid && authToken && fromNumber) {
    const body = new URLSearchParams({
      To: phoneNumber,
      From: fromNumber,
      Body: `Your ${process.env.NEXT_PUBLIC_SITE_NAME ?? "Elara"} verification code is: ${code}`,
    });

    void fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    ).catch((err) => {
      console.error("[SMS] Failed to send OTP:", err);
    });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Phone OTP] ${phoneNumber}: ${code}`);
    return;
  }

  console.error(
    "[SMS] No provider configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
  );
}
