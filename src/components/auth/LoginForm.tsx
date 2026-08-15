"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { setupWorkspaceAfterAuth } from "@/lib/auth/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getAuthErrorMessage(code: string | null) {
  switch (code) {
    case "auth":
      return "Unable to sign in. Please try again.";
    case "workspace":
      return "Signed in, but workspace setup failed. Please try again.";
    case "config":
      return "Authentication is not configured.";
    default:
      return null;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/inbox";
  const urlError = getAuthErrorMessage(searchParams.get("error"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    try {
      await setupWorkspaceAfterAuth();
      router.replace(nextPath);
      router.refresh();
    } catch {
      setLoading(false);
      setError("Unable to prepare your workspace. Please try again.");
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your IndisStack workspace and support inbox."
      footer={
        <p className="text-sm text-[var(--muted)]">
          New to IndisStack?{" "}
          <Link
            href="/signup"
            className="text-[var(--foreground)] underline decoration-[var(--border)] underline-offset-4 hover:decoration-[var(--foreground)]"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
            minLength={8}
          />
        </label>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
