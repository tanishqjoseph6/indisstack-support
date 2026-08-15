import Reveal from "@/components/landing/Reveal";

export default function TrustStrip() {
  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-5 py-28 sm:px-6 sm:py-36 lg:py-44">
        <Reveal>
          <blockquote className="trust-statement font-display max-w-4xl text-[1.75rem] leading-[1.28] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.25rem] lg:text-[2.65rem] lg:leading-[1.22]">
            Support is not just about answering.
            <br />
            <span className="text-[var(--muted)]">
              It&apos;s about knowing what should happen next.
            </span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
