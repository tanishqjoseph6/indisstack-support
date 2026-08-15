"use client";

import { useEffect, useState } from "react";

const STAGE_COUNT = 4;

export default function HeroDecisionVisual() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStage(STAGE_COUNT - 1);
      return;
    }

    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % STAGE_COUNT);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="hero-decision-visual relative"
      data-stage={stage}
      aria-hidden="true"
    >
      <div className="visual-ambient pointer-events-none absolute -inset-8 rounded-[28px] sm:-inset-12" />

      <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div
          className="hero-workflow-progress"
          style={{ height: `${((stage + 1) / STAGE_COUNT) * 100}%` }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
          </div>
          <p className="font-mono text-[0.625rem] tracking-[0.04em] text-[var(--muted)]">
            indisstack · decision
          </p>
          <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-[0.12em] text-[var(--muted)]">
            Live preview
          </span>
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-7">
          <p className="eyebrow mb-5 text-[var(--muted)]">
            Conversation → Decision
          </p>

          <div className="space-y-2.5">
            <div
              className={`hero-flow-block rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 ${
                stage >= 0 ? "hero-flow-active" : ""
              }`}
            >
              <p className="text-[0.625rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                Customer
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-[1.55] text-[var(--foreground)]">
                &ldquo;Payment debit ho gaya but order confirm nahi hua&hellip;&rdquo;
              </p>
            </div>

            <FlowDivider label="Understand" active={stage >= 1} />

            <div
              className={`grid gap-2 transition-opacity duration-500 sm:grid-cols-3 ${
                stage >= 1 ? "opacity-100" : "opacity-40"
              }`}
            >
              <MetaChip label="Intent" value="payment_verify" active={stage >= 1} />
              <MetaChip label="Language" value="Hinglish" active={stage >= 1} />
              <MetaChip label="Priority" value="High" active={stage >= 1} />
            </div>

            <FlowDivider label="Decide" active={stage >= 2} />

            <div
              className={`human-required rounded-[10px] border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-4 text-[var(--background)] ${
                stage >= 2 ? "hero-flow-active" : "opacity-40"
              }`}
            >
              <p className="text-[0.625rem] uppercase tracking-[0.14em] text-[var(--background)]/55">
                Recommended action
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug tracking-[-0.01em]">
                Escalate to payments team — do not auto-resolve
              </p>
              <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-[var(--background)]/12 pt-3">
                <span className="font-mono text-[0.6875rem] text-[var(--background)]/65">
                  Confidence 92%
                </span>
                <span
                  className={`human-badge rounded-md bg-[var(--background)] px-2 py-1 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] ${
                    stage >= 2 ? "human-badge-active" : ""
                  }`}
                >
                  Human required
                </span>
              </div>
            </div>

            <FlowDivider label="Action / Escalate" active={stage >= 3} />

            <div
              className={`grid gap-2 transition-opacity duration-500 sm:grid-cols-2 ${
                stage >= 3 ? "opacity-100" : "opacity-40"
              }`}
            >
              <OutcomeChip
                title="Act"
                description="Routine cases move forward"
                active={stage >= 3}
              />
              <OutcomeChip
                title="Escalate"
                description="Sensitive cases stop for review"
                accent
                active={stage >= 3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowDivider({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 px-0.5 py-1">
      <div
        className={`flow-connector-line flex-1 ${active ? "flow-connector-active" : ""}`}
      />
      <span
        className={`flow-stage-label shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] ${
          active ? "text-[var(--accent)]" : "text-[var(--muted)]"
        }`}
      >
        {label}
      </span>
      <div
        className={`flow-connector-line flex-1 ${active ? "flow-connector-active" : ""}`}
      />
    </div>
  );
}

function MetaChip({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[10px] border bg-[var(--background)] px-3 py-2.5 transition duration-500 ${
        active
          ? "border-[var(--accent)]/30"
          : "border-[var(--border)]"
      }`}
    >
      <p className="text-[0.5625rem] uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-[0.75rem] text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function OutcomeChip({
  title,
  description,
  accent,
  active,
}: {
  title: string;
  description: string;
  accent?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[10px] border px-3.5 py-3 transition duration-500 ${
        accent
          ? active
            ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
            : "border-[var(--accent)]/25 bg-[var(--accent-soft)]"
          : active
            ? "border-[var(--foreground)]/20 bg-[var(--background)]"
            : "border-[var(--border)] bg-[var(--background)]"
      }`}
    >
      <p className="text-[0.8125rem] tracking-[-0.01em] text-[var(--foreground)]">
        {title}
      </p>
      <p className="mt-0.5 text-[0.75rem] leading-relaxed text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}
