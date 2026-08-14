"use client";

import HeroVisual from "@/components/HeroVisual";
import MessageAnalyzer from "@/components/MessageAnalyzer";

const NAV_LINKS = [
  { label: "Research", href: "#research" },
  { label: "Models", href: "#product" },
  { label: "Developers", href: "#developers" },
] as const;

const CREDIBILITY = [
  "Built for Hindi · Hinglish · English",
  "Structured actions",
  "Human handoff",
  "Private deployment",
] as const;

const PRINCIPLES = [
  {
    title: "Indian language depth",
    description:
      "Models trained to read Devanagari, Romanized Hindi, and code-mixed phrasing as customers actually write it — not textbook translations.",
  },
  {
    title: "Structured outputs",
    description:
      "Every inference returns typed intents, priorities, and recommended actions your systems can route, audit, and measure.",
  },
  {
    title: "Safe escalation",
    description:
      "Confidence thresholds trigger human handoff before uncertain responses reach customers or downstream workflows.",
  },
] as const;

function scrollTo(href: string) {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5"
          aria-label="Main"
        >
          <a
            href="#"
            className="text-[0.9375rem] font-medium tracking-tight text-[var(--foreground)]"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            IndisStack
          </a>

          <ul className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => scrollTo("#product")}
            className="shrink-0 border border-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--foreground)] hover:text-[var(--background)]"
          >
            Try Support
          </button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24 lg:pb-28 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-[0.8125rem] font-medium tracking-[0.08em] text-[var(--accent)] uppercase">
                India-native language intelligence
              </p>
              <h1 className="mt-5 max-w-xl text-[2.5rem] font-medium leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem]">
                Models that understand how India communicates.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                IndisStack builds reliable AI for Hindi, Hinglish, and
                multilingual customer conversations.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo("#product")}
                  className="border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)]"
                >
                  Try the demo
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("#research")}
                  className="px-5 py-2.5 text-sm font-medium text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
                >
                  View research
                </button>
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* Credibility strip */}
        <section
          className="border-y border-[var(--border)]"
          aria-label="Capabilities"
        >
          <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
            {CREDIBILITY.map((item) => (
              <li
                key={item}
                className="text-[0.8125rem] text-[var(--muted)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Product */}
        <section
          id="product"
          className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
        >
          <div className="max-w-2xl">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
              IndisStack Support
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Route, prioritize, and resolve customer conversations with
              structured, auditable AI outputs.
            </p>
          </div>

          <div
            id="developers"
            className="mt-12 scroll-mt-24"
          >
            <MessageAnalyzer />
          </div>
        </section>

        {/* Research / principles */}
        <section
          id="research"
          className="border-t border-[var(--border)] bg-[var(--surface)] scroll-mt-20"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            <h2 className="max-w-xl text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
              Built for reliability, not just fluent text.
            </h2>

            <div className="mt-14 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
              {PRINCIPLES.map((card) => (
                <article
                  key={card.title}
                  className="bg-[var(--surface)] p-8 sm:p-10"
                >
                  <h3 className="text-base font-medium text-[var(--foreground)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              IndisStack
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Multilingual AI infrastructure for India.
            </p>
          </div>
          <a
            href="mailto:hello@indisstack.in"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
          >
            hello@indisstack.in
          </a>
        </div>
      </footer>
    </div>
  );
}
