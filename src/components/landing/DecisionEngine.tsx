import Reveal from "@/components/landing/Reveal";

const EXAMPLES = [
  {
    category: "Delivery",
    scenario: "Package delayed",
    outcome: "Recommend resolution",
    mode: "automate" as const,
  },
  {
    category: "Exchange",
    scenario: "Customer wants a size change",
    outcome: "Approve suggested action",
    mode: "automate" as const,
  },
  {
    category: "Payment",
    scenario: "Payment debited but order not confirmed",
    outcome: "Escalate to human",
    mode: "escalate" as const,
  },
] as const;

export default function DecisionEngine() {
  return (
    <section className="section-dark border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
        <Reveal>
          <p className="eyebrow">Decision engine</p>
          <h2 className="font-display mt-5 max-w-2xl text-[2rem] leading-[1.12] tracking-[-0.028em] sm:text-[2.65rem] lg:text-[2.85rem]">
            AI that knows when NOT to act.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--border)] lg:grid-cols-3">
          {EXAMPLES.map((example, index) => (
            <Reveal
              key={example.category}
              delay={(Math.min(index + 1, 3) as 1 | 2 | 3)}
            >
              <article
                className={`decision-card flex h-full flex-col px-7 py-8 sm:px-8 sm:py-10 ${
                  example.mode === "escalate"
                    ? "decision-escalate decision-card-escalate bg-[var(--accent-soft)]"
                    : "bg-[var(--surface)]"
                }`}
              >
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                  {example.category}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-[var(--foreground)]">
                  &ldquo;{example.scenario}&rdquo;
                </p>
                <div className="my-7 flex items-center gap-2">
                  <span className="h-px flex-1 bg-[var(--border)]" />
                  <span className="font-mono text-[0.5625rem] text-[var(--accent)]">
                    →
                  </span>
                  <span className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <p className="text-[1.0625rem] tracking-[-0.015em] text-[var(--foreground)]">
                  {example.outcome}
                </p>
                {example.mode === "escalate" && (
                  <p className="mt-6 text-[0.625rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                    Human escalation required
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
