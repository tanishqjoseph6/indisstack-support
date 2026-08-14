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

export default function MessageAnalyzer() {
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
    <div className="border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[var(--border)]">
        <div className="p-6 sm:p-8">
          <label
            htmlFor="customer-message"
            className="mb-3 block text-[0.8125rem] font-medium tracking-wide text-[var(--muted)]"
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
            className="w-full resize-none border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Type a customer message in Hindi, Hinglish, or English…"
          />

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => handleExampleClick(chip.key)}
                className="text-xs text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!message.trim() || isAnalyzing}
            className="mt-8 border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isAnalyzing ? "Analyzing…" : "Analyze message"}
          </button>
        </div>

        <div className="border-t border-[var(--border)] p-6 sm:p-8 lg:border-t-0">
          {result ? (
            <AnalysisPanel result={result} showEscalation={showEscalation} />
          ) : (
            <div className="flex h-full min-h-[280px] flex-col justify-center">
              <p className="text-sm text-[var(--muted)]">Analysis output</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
                Enter a message or select an example, then run analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisPanel({
  result,
  showEscalation,
}: {
  result: AnalysisResult;
  showEscalation: boolean;
}) {
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--muted)]">
          Result
        </p>
        <p className="text-xs text-[var(--muted)]">{result.priority} priority</p>
      </div>

      {showEscalation && (
        <div
          className="mb-6 border-l-2 border-[var(--accent)] py-1 pl-4"
          role="status"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Escalate to human
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Confidence is below 75%. Route this conversation to a support agent.
          </p>
        </div>
      )}

      <dl className="space-y-5">
        <ResultRow label="Intent" value={result.intent} mono />
        <ResultRow label="Language" value={result.language} />
        <ResultRow label="Priority" value={result.priority} />
        <ResultRow label="Recommended action" value={result.recommendedAction} />
      </dl>

      <div className="mt-8">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-[var(--muted)]">Confidence</span>
          <span className="font-mono text-[var(--foreground)]">
            {result.confidence}%
          </span>
        </div>
        <div className="h-px w-full bg-[var(--border)]">
          <div
            className="h-px bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--muted)]">
          Suggested reply
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
          &ldquo;{result.suggestedReply}&rdquo;
        </p>
      </div>
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
      <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-[var(--foreground)] ${mono ? "font-mono text-[0.8125rem]" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
