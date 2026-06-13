import { ENABLE_PHONE_OTP } from "@/lib/config";
import { SITE_NAME } from "@/lib/constants";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { isValidPhoneNumber } from "./phone";
import { sendSmsOtp } from "./sms";

function createAuth() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/revylo";
  const client = new MongoClient(uri);
  const db = client.db();

  const plugins = [];

  if (ENABLE_PHONE_OTP) {
    const siteSlug = SITE_NAME.toLowerCase().replace(/\s+/g, "-");
    plugins.push(
      phoneNumber({
        otpLength: 6,
        expiresIn: 300,
        allowedAttempts: 3,
        phoneNumberValidator: isValidPhoneNumber,
        sendOTP: ({ phoneNumber: phone, code }) => {
          sendSmsOtp(phone, code);
        },
        signUpOnVerification: {
          getTempEmail: (phone) => {
            const digits = phone.replace(/\D/g, "");
            return `${digits}@phone.${siteSlug}.local`;
          },
          getTempName: (phone) => phone,
        },
      }),
    );
  }

  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    plugins,
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}

export const auth = createAuth();

export type Session = typeof auth.$Infer.Session;
