import Reveal from "@/components/landing/Reveal";

export default function Differentiator() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-5 py-28 sm:px-6 sm:py-36 lg:py-44">
        <Reveal>
          <p className="eyebrow">Philosophy</p>
          <h2 className="differentiator-headline font-display mt-6 max-w-4xl text-[2.15rem] leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] sm:text-[3rem] lg:text-[3.5rem] lg:leading-[1.08]">
            Automation without blind automation.
          </h2>
          <p className="mt-10 max-w-2xl text-base leading-[1.75] text-[var(--muted)] sm:text-lg">
            IndisStack is designed to move routine work forward while keeping
            sensitive decisions in human hands.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
