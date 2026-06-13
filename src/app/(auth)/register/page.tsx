"use client";

import { SITE_NAME } from "@/lib/constants";
import { fetchCsrfToken, signUp } from "@/lib/auth/auth-client";
import { LogoMark } from "@/shared/components/LogoMark";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function passwordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak" };
  if (score <= 3) return { score, label: "Fair" };
  return { score, label: "Strong" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const pwd = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    const website = formData.get("website") as string;

    if (pwd !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (pwd.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();
      const result = await signUp(email, pwd, name, { csrfToken, website });
      if (result.error) {
        setError(
          typeof result.error.message === "string"
            ? result.error.message
            : "Registration failed",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
            <LogoMark />
            <span className="font-serif text-base font-semibold tracking-[0.15em] uppercase sm:text-lg">
              {SITE_NAME}
            </span>
          </div>
          <h1 className="text-xl font-medium sm:text-2xl">Create Account</h1>
          <p className="mt-2 text-sm text-muted">
            Register to access the admin dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-sm border border-border bg-card p-5 shadow-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full border border-border py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-border py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border py-2.5 pr-10 pl-10 text-sm focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= strength.score
                          ? strength.score <= 2
                            ? "bg-red-400"
                            : strength.score <= 3
                              ? "bg-yellow-400"
                              : "bg-green-500"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">{strength.label} password</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-border py-2.5 pr-4 pl-10 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent py-3 text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
