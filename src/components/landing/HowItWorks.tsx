"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/landing/Reveal";

const STEPS = [
  {
    id: "01",
    title: "Understand",
    description:
      "Read the conversation. Identify intent, context and urgency.",
  },
  {
    id: "02",
    title: "Decide",
    description:
      "Determine the safest and most useful next action.",
  },
  {
    id: "03",
    title: "Act",
    description:
      "Move routine cases forward without unnecessary manual work.",
  },
  {
    id: "04",
    title: "Escalate",
    description: "Know when a human should take over.",
  },
] as const;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const buttons = stepRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (buttons.length === 0) return;

    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const index = buttons.indexOf(visible[0].target as HTMLButtonElement);
        if (index >= 0) setActive(index);
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-15% 0px -35% 0px",
      },
    );

    buttons.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="scroll-mt-24 border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
        <Reveal>
          <p className="eyebrow">How IndisStack thinks</p>
          <h2 className="font-display mt-5 max-w-2xl text-[2rem] leading-[1.15] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.5rem]">
            A product intelligence system — not a workflow checklist.
          </h2>
        </Reveal>

        <div className="mt-14">
          <div className="relative h-px w-full bg-[var(--border)]">
            <div
              className="how-progress absolute inset-y-0 left-0 h-px bg-[var(--accent)]"
              style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          <div className="relative mt-10 hidden lg:block" aria-hidden="true">
            <div className="absolute left-[12.5%] right-[12.5%] top-[1.125rem] h-px bg-[var(--border)]">
              <div
                className="how-node-line absolute inset-y-0 left-0 h-px bg-[var(--accent)]"
                style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex justify-center">
                  <span
                    className={`how-node relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-[0.625rem] font-mono ${
                      index <= active
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]"
                    }`}
                  >
                    {step.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const isActive = index === active;
              return (
                <Reveal key={step.id} delay={(index + 1) as 1 | 2 | 3 | 4}>
                  <button
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`h-full w-full rounded-[var(--radius)] border p-6 text-left transition duration-500 sm:p-7 ${
                      isActive
                        ? "how-step-active"
                        : "border-[var(--border)] bg-transparent hover:border-[var(--foreground)]/25"
                    }`}
                  >
                    <span className="block font-mono text-[0.6875rem] text-[var(--muted)] lg:hidden">
                      {step.id}
                    </span>
                    <span
                      className={`mt-4 block text-[1.0625rem] tracking-[-0.015em] lg:mt-0 ${
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--foreground)]"
                      }`}
                      role="heading"
                      aria-level={3}
                    >
                      {step.title}
                    </span>
                    <span className="mt-3 block text-sm leading-[1.65] text-[var(--muted)]">
                      {step.description}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
