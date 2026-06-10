"use client";

import { SITE_NAME } from "@/lib/constants";
import { signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, name);
      if (result.error) {
        setError(
          typeof result.error.message === "string"
            ? result.error.message
            : "Registration failed",
        );
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="inline-block h-5 w-5 border-2 border-foreground" />
            <span className="font-serif text-lg font-semibold tracking-[0.15em] uppercase">
              {SITE_NAME}
            </span>
          </div>
          <h1 className="text-2xl font-medium">Create Account</h1>
          <p className="mt-2 text-sm text-muted">
            Register to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-sm bg-card p-8 shadow-sm">
          {error && (
            <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              minLength={6}
              className="w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
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
            <Link href="/dashboard/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
