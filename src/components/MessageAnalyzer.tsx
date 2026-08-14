"use client";

import { useState } from "react";
import {
  formatConfidence,
  formatLanguage,
  formatPriority,
  MAX_MESSAGE_LENGTH,
  type AnalysisResponse,
} from "@/lib/analysis";
import { QUOTA_BILLING_ERROR_MESSAGE } from "@/lib/analysisErrors";
import { analyzeDemoMessage } from "@/lib/demoAnalysis";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { EXAMPLE_MESSAGES, type ExampleKey } from "@/lib/examples";

const EXAMPLE_CHIPS: { key: ExampleKey; label: string }[] = [
  { key: "payment", label: "Payment issue" },
  { key: "delivery", label: "Delivery delay" },
  { key: "return", label: "Return request" },
];

export default function MessageAnalyzer() {
  const [message, setMessage] = useState<string>(EXAMPLE_MESSAGES.payment);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  async function handleAnalyze() {
    const trimmed = message.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setIsDemo(false);

    if (IS_PUBLIC_DEMO_MODE) {
      setResult(analyzeDemoMessage(trimmed));
      setIsDemo(true);
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          data !== null &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Analysis could not be completed. Please try again.";

        if (errorMessage === QUOTA_BILLING_ERROR_MESSAGE) {
          setResult(analyzeDemoMessage(trimmed));
          setIsDemo(true);
          return;
        }

        setError(errorMessage);
        return;
      }

      setResult(data as AnalysisResponse);
    } catch {
      setError("Unable to reach the analysis service. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleExampleClick(key: ExampleKey) {
    setMessage(EXAMPLE_MESSAGES[key]);
    setResult(null);
    setError(null);
    setIsDemo(false);
  }

  const showEscalation = result?.needsHuman ?? false;
  const confidencePercent = result ? formatConfidence(result.confidence) : 0;

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
              setError(null);
              setIsDemo(false);
            }}
            rows={6}
            maxLength={MAX_MESSAGE_LENGTH}
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

          {error && (
            <p className="mt-6 text-sm text-[var(--foreground)]" role="alert">
              {error}
            </p>
          )}

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
          {isAnalyzing ? (
            <div className="flex h-full min-h-[280px] flex-col justify-center">
              <p className="text-sm text-[var(--muted)]">Running analysis…</p>
            </div>
          ) : result ? (
            <AnalysisPanel
              result={result}
              showEscalation={showEscalation}
              confidencePercent={confidencePercent}
              isDemo={isDemo}
            />
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
  confidencePercent,
  isDemo,
}: {
  result: AnalysisResponse;
  showEscalation: boolean;
  confidencePercent: number;
  isDemo: boolean;
}) {
  return (
    <div>
      {isDemo && (
        <div className="mb-6 border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--foreground)]">
            Demo output — deterministic preview
          </p>
        </div>
      )}

      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--muted)]">
          Result
        </p>
        <p className="text-xs text-[var(--muted)]">
          {formatPriority(result.priority)} priority
        </p>
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
            This message should be routed to a support agent for review.
          </p>
        </div>
      )}

      <dl className="space-y-5">
        <ResultRow label="Intent" value={result.intent} mono />
        <ResultRow label="Language" value={formatLanguage(result.language)} />
        <ResultRow label="Priority" value={formatPriority(result.priority)} />
        <ResultRow label="Recommended action" value={result.action} />
      </dl>

      <div className="mt-8">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-[var(--muted)]">Confidence</span>
          <span className="font-mono text-[var(--foreground)]">
            {confidencePercent}%
          </span>
        </div>
        <div className="h-px w-full bg-[var(--border)]">
          <div
            className="h-px bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--muted)]">
          Suggested reply
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
          &ldquo;{result.reply}&rdquo;
        </p>
      </div>

      {isDemo && (
        <p className="mt-8 text-xs leading-relaxed text-[var(--muted)]">
          Live analysis will be available in the research preview.
        </p>
      )}
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
