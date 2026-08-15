import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — IndisStack",
  description: "Sign in to your IndisStack workspace.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-[var(--background)]" />}>
      <LoginForm />
    </Suspense>
  );
}
