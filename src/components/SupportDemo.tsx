"use client";

import { useState } from "react";
import {
  analyzeMessage,
  EXAMPLE_MESSAGES,
  type AnalysisResult,
  type ExampleKey,
} from "@/lib/mockAnalysis";

const EXAMPLE_CHIPS: { key: ExampleKey; label: string }[] = [
  { key: "payment", label: "Payment issue" },
  { key: "delivery", label: "Delivery delay" },
  { key: "return", label: "Return request" },
];

const BUILT_FOR_INDIA = [
  { title: "Hindi", description: "Devanagari script and formal Hindi phrasing" },
  { title: "Hinglish", description: "Mixed Hindi–English as customers actually type" },
  { title: "English", description: "Standard English support messages" },
  { title: "Structured actions", description: "Intent, priority, and ticket routing" },
  { title: "Human handoff", description: "Escalation when confidence is low" },
];

function IndisStackLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M4 18V6l8 4.5L20 6v12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10.5V18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function priorityStyles(priority: AnalysisResult["priority"]) {
  switch (priority) {
    case "High":
      return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
    case "Medium":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
    case "Low":
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
  }
}

function confidenceColor(confidence: number) {
  if (confidence >= 85) return "from-indigo-400 to-cyan-400";
  if (confidence >= 75) return "from-amber-400 to-orange-400";
  return "from-rose-400 to-red-400";
}

export default function SupportDemo() {
  const [message, setMessage] = useState<string>(EXAMPLE_MESSAGES.payment);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleAnalyze() {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setResult(analyzeMessage(message));
      setIsAnalyzing(false);
    }, 600);
  }

  function handleExampleClick(key: ExampleKey) {
    setMessage(EXAMPLE_MESSAGES[key]);
    setResult(null);
  }

  const showEscalation = result !== null && result.confidence < 75;

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03]" />

      <header className="relative z-10 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <IndisStackLogo />
            <span className="text-lg font-semibold tracking-tight text-white">
              IndisStack Support
            </span>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Model demo
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:py-14">
        <section className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            AI that understands{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              how India speaks.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Classify Hindi, Hinglish, and English support requests into reliable
            actions.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
            <label
              htmlFor="customer-message"
              className="mb-3 block text-sm font-medium text-slate-300"
            >
              Customer message
            </label>
            <textarea
              id="customer-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setResult(null);
              }}
              rows={6}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0c1220] px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Type a customer message in Hindi, Hinglish, or English…"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleExampleClick(chip.key)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-200"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!message.trim() || isAnalyzing}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing…" : "Analyze message"}
            </button>
          </section>

          <section className="flex flex-col">
            {result ? (
              <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Analysis result
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyles(result.priority)}`}
                  >
                    {result.priority} priority
                  </span>
                </div>

                {showEscalation && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                    <span className="mt-0.5 text-amber-400" aria-hidden="true">
                      ⚠
                    </span>
                    <div>
                      <p className="text-sm font-medium text-amber-200">
                        Escalate to human
                      </p>
                      <p className="mt-0.5 text-xs text-amber-300/80">
                        Confidence is below 75%. Route this conversation to a
                        support agent.
                      </p>
                    </div>
                  </div>
                )}

                <dl className="space-y-4">
                  <ResultRow label="Intent" value={result.intent} mono />
                  <ResultRow label="Language" value={result.language} />
                  <ResultRow label="Priority" value={result.priority} />
                  <ResultRow
                    label="Recommended action"
                    value={result.recommendedAction}
                  />
                </dl>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Confidence</span>
                    <span className="font-mono font-medium text-white">
                      {result.confidence}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${confidenceColor(result.confidence)}`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-indigo-300/80">
                    Suggested reply
                  </p>
                  <p className="text-sm leading-relaxed text-slate-200">
                    &ldquo;{result.suggestedReply}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-xl text-indigo-400">
                  ◈
                </div>
                <p className="text-sm font-medium text-slate-400">
                  No analysis yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Enter a message or pick an example, then click Analyze message.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#070b14]/60 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-500 sm:text-left">
            Built for India
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {BUILT_FOR_INDIA.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-200">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function ResultRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-slate-200 ${mono ? "font-mono text-indigo-200" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
