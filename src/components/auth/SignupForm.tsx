"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { setupWorkspaceAfterAuth } from "@/lib/auth/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();

    if (!trimmedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: trimmedFirstName ? { first_name: trimmedFirstName } : undefined,
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      setLoading(false);
      setNotice("Check your email to confirm your account, then sign in.");
      return;
    }

    try {
      await setupWorkspaceAfterAuth();
      router.replace("/inbox");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Account created, but workspace setup failed. Please sign in.");
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Start with your own IndisStack workspace."
      footer={
        <p className="text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--foreground)] underline decoration-[var(--border)] underline-offset-4 hover:decoration-[var(--foreground)]"
          >
            Sign in
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
        {notice ? (
          <p className="auth-notice" role="status">
            {notice}
          </p>
        ) : null}

        <label className="auth-field">
          <span>First name (optional)</span>
          <input
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={loading}
          />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
            minLength={8}
          />
        </label>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
