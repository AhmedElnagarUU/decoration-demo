"use client";

import { SITE_NAME } from "@/lib/constants";
import { fetchCsrfToken, signIn } from "@/lib/auth/auth-client";
import { LogoMark } from "@/shared/components/LogoMark";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const website = formData.get("website") as string;

    try {
      const csrfToken = await fetchCsrfToken();
      const result = await signIn(email, password, { csrfToken, website });
      if (result.error) {
        setError(
          typeof result.error.message === "string"
            ? result.error.message
            : "Invalid credentials",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Login failed. Please try again.");
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
          <h1 className="text-xl font-medium sm:text-2xl">Admin Login</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage your site content
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
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent py-3 text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
