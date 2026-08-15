"use client";

import Reveal from "@/components/landing/Reveal";
import { useInView } from "@/components/landing/useInView";

const LIMITATIONS = [
  "Route tickets",
  "Generate replies",
  "Categorize conversations",
] as const;

export default function ProblemSection() {
  const bridgeRef = useInView<HTMLDivElement>();

  return (
    <section
      id="product"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="grid gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">
          <Reveal>
            <p className="eyebrow">The problem</p>
            <h2 className="font-display mt-5 text-[2rem] leading-[1.12] tracking-[-0.028em] text-[var(--foreground)] sm:text-[2.65rem] lg:text-[2.85rem]">
              Most support tools stop at the reply.
            </h2>
            <p className="mt-7 max-w-lg text-base leading-[1.75] text-[var(--muted)]">
              Traditional support software can:
            </p>
            <ul className="mt-5 space-y-3">
              {LIMITATIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[var(--foreground)]"
                >
                  <span className="h-px w-5 shrink-0 bg-[var(--border)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-lg text-base leading-[1.75] text-[var(--muted)]">
              But it does not always understand the correct operational
              decision — what should actually happen next in your workflow.
            </p>
            <p className="mt-10 font-display text-[1.35rem] leading-snug tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.5rem]">
              IndisStack goes one step further.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div
              ref={bridgeRef}
              className="reply-decision-bridge rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-8 sm:p-10"
            >
              <div className="flex flex-col items-center gap-8 sm:gap-10">
                <div className="bridge-reply w-full text-center">
                  <p className="text-[0.625rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Traditional
                  </p>
                  <p className="mt-3 font-display text-[2rem] tracking-[-0.03em] text-[var(--muted)] sm:text-[2.35rem]">
                    Reply
                  </p>
                  <p className="mx-auto mt-3 max-w-[14rem] text-xs leading-relaxed text-[var(--muted)]">
                    A response is drafted. Judgment stays with the agent.
                  </p>
                </div>

                <div
                  className="bridge-connector flex w-full items-center gap-3"
                  aria-hidden="true"
                >
                  <span className="bridge-line bridge-line-left h-px flex-1 bg-[var(--border)]" />
                  <span className="bridge-arrow font-mono text-[0.625rem] text-[var(--accent)]">
                    →
                  </span>
                  <span className="bridge-line bridge-line-right h-px flex-1 bg-[var(--border)]" />
                </div>

                <div className="bridge-decision w-full rounded-[10px] border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-7 text-center text-[var(--background)]">
                  <p className="text-[0.625rem] uppercase tracking-[0.16em] text-[var(--background)]/50">
                    IndisStack
                  </p>
                  <p className="mt-3 font-display text-[2rem] tracking-[-0.03em] sm:text-[2.35rem]">
                    Decision
                  </p>
                  <p className="mx-auto mt-3 max-w-[14rem] text-xs leading-relaxed text-[var(--background)]/65">
                    Intent, action, and escalation — chosen before anyone
                    replies.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
