import { createHash } from "crypto";
import { IS_DEMO } from "@/lib/config";
import { pixels } from "./service";

export interface MetaConversionUserData {
  email?: string;
  phone?: string;
}

export interface MetaConversionCustomData {
  value?: number;
  currency?: string;
}

export interface MetaConversionEventInput {
  pixelId: string;
  accessToken: string;
  eventName: string;
  userData: MetaConversionUserData;
  customData?: MetaConversionCustomData;
  testEventCode?: string;
}

function hashUserData(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export async function sendMetaConversionEvent(
  input: MetaConversionEventInput,
): Promise<{ success: boolean }> {
  if (IS_DEMO) {
    console.log("[demo] Meta Conversion API event:", {
      pixelId: input.pixelId,
      eventName: input.eventName,
    });
    return { success: true };
  }

  const userData: Record<string, string> = {};
  if (input.userData.email) {
    userData.em = hashUserData(input.userData.email);
  }
  if (input.userData.phone) {
    userData.ph = hashUserData(input.userData.phone);
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: userData,
        ...(input.customData
          ? {
              custom_data: {
                ...(input.customData.value !== undefined
                  ? { value: input.customData.value }
                  : {}),
                ...(input.customData.currency
                  ? { currency: input.customData.currency }
                  : {}),
              },
            }
          : {}),
      },
    ],
  };

  if (input.testEventCode) {
    payload.test_event_code = input.testEventCode;
  }

  const url = `https://graph.facebook.com/v21.0/${input.pixelId}/events?access_token=${encodeURIComponent(input.accessToken)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Meta Conversion API error:", body);
    return { success: false };
  }

  return { success: true };
}

export async function fireMetaConversionsForSite(
  eventName: string,
  userData: MetaConversionUserData,
  customData?: MetaConversionCustomData,
): Promise<void> {
  const allPixels = await pixels.getPixels();
  const metaPixels = allPixels.filter(
    (pixel) =>
      pixel.platform === "meta" && pixel.enabled && pixel.accessToken,
  );

  await Promise.all(
    metaPixels.map((pixel) =>
      sendMetaConversionEvent({
        pixelId: pixel.pixelId,
        accessToken: pixel.accessToken!,
        eventName,
        userData,
        customData,
        testEventCode: pixel.testEventCode,
      }),
    ),
  );
}
