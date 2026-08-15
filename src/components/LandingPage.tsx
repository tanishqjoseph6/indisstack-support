"use client";

import Link from "next/link";
import SiteNav from "@/components/landing/SiteNav";
import DecisionEngine from "@/components/landing/DecisionEngine";
import Differentiator from "@/components/landing/Differentiator";
import HeroDecisionVisual from "@/components/landing/HeroDecisionVisual";
import HowItWorks from "@/components/landing/HowItWorks";
import ProblemSection from "@/components/landing/ProblemSection";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Reveal from "@/components/landing/Reveal";
import TrustStrip from "@/components/landing/TrustStrip";
import { useNavSentinel } from "@/components/landing/useInView";
import MessageAnalyzer from "@/components/MessageAnalyzer";

const USE_CASES = [
  {
    title: "Delivery issues",
    description: "Delays, tracking gaps, and missed ETAs with clear next steps.",
  },
  {
    title: "Returns & refunds",
    description: "Auditable return flows that escalate when money is disputed.",
  },
  {
    title: "Size exchanges",
    description: "Fit and variant swaps with structured pickup recommendations.",
  },
  {
    title: "Payment problems",
    description: "Debits without confirmation, double charges, failed payments.",
  },
  {
    title: "Order questions",
    description: "Status, address changes, cancellations, and coupon issues.",
  },
  {
    title: "Sensitive escalations",
    description: "Account security, abuse, and unclear messages that need a person.",
  },
] as const;

function scrollTo(href: string) {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const navSentinelRef = useNavSentinel();

  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden">
      <div ref={navSentinelRef} className="nav-sentinel" aria-hidden="true" />
      <SiteNav scrollTo={scrollTo} />

      <main>
        {/* 1. Hero — unchanged */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 landing-glow" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pb-36 lg:pt-24">
            <div className="flex max-w-xl flex-col">
              <p className="eyebrow hero-rise hero-rise-1">
                Customer support intelligence
              </p>
              <h1 className="font-display hero-rise hero-rise-2 mt-6 text-[2.75rem] leading-[1.12] tracking-[-0.028em] text-[var(--foreground)] sm:text-[3.35rem] lg:text-[3.75rem] lg:leading-[1.1]">
                AI support that thinks before it replies.
              </h1>
              <p className="hero-rise hero-rise-3 mt-7 max-w-[28rem] text-[1.05rem] leading-[1.7] text-[var(--muted)]">
                IndisStack understands every customer conversation, makes the
                right decision, and helps your team resolve issues faster.
              </p>
              <div className="hero-rise hero-rise-4 mt-9 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo("#start-building")}
                  className="btn-primary rounded-lg border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2.5 text-sm tracking-[-0.01em] text-[var(--background)]"
                >
                  Start Building
                </button>
                <Link
                  href="/inbox"
                  className="btn-secondary rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm tracking-[-0.01em] text-[var(--foreground)]"
                >
                  View Demo
                </Link>
              </div>
              <p className="hero-rise hero-rise-5 mt-8 font-mono text-[0.6875rem] tracking-[0.04em] text-[var(--muted)]">
                Conversation → Understanding → Decision → Action / Escalation
              </p>
            </div>

            <div className="hero-visual-in min-w-0">
              <HeroDecisionVisual />
            </div>
          </div>
        </section>

        {/* 2. Trust / positioning strip */}
        <TrustStrip />

        {/* 3. The problem */}
        <ProblemSection />

        {/* 4. How IndisStack thinks */}
        <HowItWorks />

        {/* 5. Product showcase */}
        <section
          id="showcase"
          className="scroll-mt-24 border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
            <Reveal>
              <p className="eyebrow">Product</p>
              <h2 className="font-display mt-5 max-w-2xl text-[2rem] leading-[1.15] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.65rem]">
                From conversation to resolution.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-[1.7] text-[var(--muted)]">
                See exactly how IndisStack turns customer messages into
                structured decisions.
              </p>
            </Reveal>
          </div>

          <Reveal className="px-5 sm:px-6" delay={1}>
            <div className="mx-auto w-full max-w-[88rem]">
              <ProductShowcase />
            </div>
          </Reveal>

          <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-6 sm:pb-32">
            <Reveal className="mt-10" delay={2}>
              <Link
                href="/inbox"
                className="inline-flex items-center text-sm tracking-[-0.01em] text-[var(--foreground)] underline decoration-[var(--border)] underline-offset-4 transition hover:decoration-[var(--foreground)]"
              >
                Open the full Support Inbox demo
              </Link>
            </Reveal>
          </div>
        </section>

        {/* 6. Decision engine */}
        <DecisionEngine />

        {/* 7. Use cases */}
        <section
          id="use-cases"
          className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
            <Reveal>
              <p className="eyebrow">Use cases</p>
              <h2 className="font-display mt-5 max-w-xl text-[2rem] leading-[1.15] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.5rem]">
                Built for the conversations Indian D2C teams see every day.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((useCase, index) => (
                <Reveal
                  key={useCase.title}
                  delay={(Math.min((index % 4) + 1, 4) as 1 | 2 | 3 | 4)}
                >
                  <article className="use-case-cell h-full bg-[var(--surface)] px-7 py-8">
                    <h3 className="text-[0.9375rem] tracking-[-0.01em] text-[var(--foreground)]">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.65] text-[var(--muted)]">
                      {useCase.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Differentiator */}
        <Differentiator />

        {/* Message analyzer — preserved functionality */}
        <section
          id="start-building"
          className="scroll-mt-24 border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
            <Reveal>
              <p className="eyebrow">Try it</p>
              <h2 className="font-display mt-5 max-w-2xl text-[2rem] leading-[1.15] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.5rem]">
                Analyze a customer message.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-[1.7] text-[var(--muted)]">
                Paste a Hindi, Hinglish, or English support message. See intent,
                priority, recommended action, and whether a human should take
                over.
              </p>
            </Reveal>

            <div id="developers" className="mt-12 scroll-mt-24">
              <MessageAnalyzer />
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="final-cta border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-28 sm:px-6 sm:py-40 lg:py-48">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="final-cta-headline font-display text-[2.15rem] leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] sm:text-[3.15rem] lg:text-[3.5rem]">
                  Turn every support conversation into a decision.
                </h2>
                <p className="final-cta-body mx-auto mt-7 max-w-xl text-base leading-[1.7] text-[var(--muted)] sm:text-lg">
                  Give your team AI that understands context, takes action, and
                  knows when a human should step in.
                </p>
                <div className="final-cta-actions mt-11 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollTo("#start-building")}
                    className="btn-primary rounded-lg border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 text-sm tracking-[-0.01em] text-[var(--background)]"
                  >
                    Start Building
                  </button>
                  <Link
                    href="/inbox"
                    className="btn-secondary rounded-lg border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm tracking-[-0.01em] text-[var(--foreground)]"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-16">
          <div>
            <p className="wordmark text-sm text-[var(--foreground)]">
              IndisStack
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              AI-powered customer support intelligence.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              <li>
                <a
                  href="#product"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#product");
                  }}
                >
                  Product
                </a>
              </li>
              <li>
                <Link
                  href="/inbox"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  Demo
                </Link>
              </li>
              <li>
                <a
                  href="#use-cases"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#use-cases");
                  }}
                >
                  Use Cases
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@indisstack.in"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  Terms
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--muted)]">
              © 2026 IndisStack. All rights reserved.
            </p>
            <a
              href="mailto:hello@indisstack.in"
              className="text-xs text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              hello@indisstack.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
