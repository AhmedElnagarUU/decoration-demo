"use client";

import {
  removePhoneNumber,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/auth/auth-client";
import { getOtpDeliveryHint, getOtpDeliveryLabel } from "@/lib/config";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { KeyRound, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

type PhoneOtpMode = "sign-in" | "link";

interface PhoneOtpFormProps {
  mode: PhoneOtpMode;
  onSuccess?: () => void;
  initialPhoneNumber?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

export function PhoneOtpForm({
  mode,
  onSuccess,
  initialPhoneNumber = "",
}: PhoneOtpFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");

    const normalized = normalizePhoneNumber(phoneNumber);
    if (!normalized || normalized.length < 8) {
      setError("Enter a valid phone number in international format (e.g. +1234567890)");
      setLoading(false);
      return;
    }

    try {
      const result = await sendPhoneOtp(normalized);
      if (result.error) {
        setError(getErrorMessage(result.error, "Failed to send verification code"));
      } else {
        setPhoneNumber(normalized);
        setStep("code");
        setOtpSent(true);
      }
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await verifyPhoneOtp(phoneNumber, code, {
        updatePhoneNumber: mode === "link",
      });

      if (result.error) {
        setError(getErrorMessage(result.error, "Invalid verification code"));
      } else {
        onSuccess?.();
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "phone") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Phone number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-border py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">{getOtpDeliveryHint()}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent py-3 text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Sending code..." : "Send verification code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {otpSent && (
        <div className="rounded bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Code sent to {phoneNumber} via {getOtpDeliveryLabel()}
        </div>
      )}

      <div>
        <label htmlFor="otp" className="mb-1.5 block text-sm font-medium">
          Verification code
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-border py-2.5 pr-4 pl-10 text-sm tracking-widest focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || code.length < 6}
        className="w-full bg-accent py-3 text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {loading
          ? mode === "sign-in"
            ? "Signing in..."
            : "Verifying..."
          : mode === "sign-in"
            ? "Verify & sign in"
            : "Verify phone number"}
      </button>

      <button
        type="button"
        onClick={() => {
          setStep("phone");
          setCode("");
          setOtpSent(false);
        }}
        className="w-full text-sm text-muted hover:text-foreground"
      >
        Use a different number
      </button>

      <button
        type="button"
        onClick={() => handleSendOtp()}
        disabled={loading}
        className="w-full text-sm text-accent hover:underline disabled:opacity-50"
      >
        Resend code
      </button>
    </form>
  );
}

interface PhoneSecurityCardProps {
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
  onUpdated: () => void;
}

export function PhoneSecurityCard({
  phoneNumber,
  phoneNumberVerified,
  onUpdated,
}: PhoneSecurityCardProps) {
  const [changing, setChanging] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const hasVerifiedPhone = Boolean(phoneNumber && phoneNumberVerified);

  async function handleRemove() {
    setRemoving(true);
    setError("");
    try {
      const result = await removePhoneNumber();
      if (result.error) {
        setError(getErrorMessage(result.error, "Failed to remove phone number"));
      } else {
        setChanging(false);
        onUpdated();
      }
    } catch {
      setError("Failed to remove phone number.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="rounded-sm border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-accent" />
        <div>
          <h2 className="text-lg font-medium">Phone sign-in</h2>
          <p className="mt-1 text-sm text-muted">
            Link a phone number to sign in with a one-time code sent via{" "}
            {getOtpDeliveryLabel()}.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {hasVerifiedPhone && !changing ? (
        <div className="space-y-4">
          <div className="rounded bg-background px-4 py-3 text-sm">
            <span className="text-muted">Verified number: </span>
            <span className="font-medium">{phoneNumber}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setChanging(true)}
              className="border border-border px-4 py-2 text-sm transition-colors hover:bg-background"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {removing ? "Removing..." : "Remove phone"}
            </button>
          </div>
        </div>
      ) : (
        <PhoneOtpForm
          mode="link"
          initialPhoneNumber={phoneNumber ?? ""}
          onSuccess={() => {
            setChanging(false);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
