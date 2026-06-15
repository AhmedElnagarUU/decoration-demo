"use client";

import { PhoneSecurityCard } from "@/features/auth/components/PhoneOtpForm";
import { IS_PHONE_OTP_AVAILABLE } from "@/lib/config";
import { useSession } from "@/lib/auth/auth-client";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  const { data: session, isPending, refetch } = useSession();

  if (!IS_PHONE_OTP_AVAILABLE) {
    return (
      <div>
        <h1 className="text-2xl font-medium">Security</h1>
        <p className="mt-2 text-sm text-muted">
          Phone OTP sign-in is not enabled for this environment.
        </p>
      </div>
    );
  }

  if (isPending) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-6 w-6 text-accent" />
        <div>
          <h1 className="text-2xl font-medium">Security OTP</h1>
          <p className="mt-1 text-sm text-muted">
            Add and verify your phone number for optional OTP sign-in.
          </p>
        </div>
      </div>

      <div data-tour="tour-phone-security">
        <PhoneSecurityCard
          phoneNumber={session?.user.phoneNumber}
          phoneNumberVerified={session?.user.phoneNumberVerified}
          onUpdated={() => refetch()}
        />
      </div>
    </div>
  );
}
