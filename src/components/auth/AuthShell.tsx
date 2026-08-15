import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--background)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6">
          <Link
            href="/"
            className="wordmark text-[0.9375rem] text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            IndisStack
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12 sm:px-6">
        <div className="auth-card border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
          <p className="eyebrow">Account</p>
          <h1 className="font-display mt-4 text-[2rem] leading-[1.15] tracking-[-0.025em] text-[var(--foreground)]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 border-t border-[var(--border)] pt-6">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
