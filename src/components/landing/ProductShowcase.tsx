"use client";

import Link from "next/link";
import { useState } from "react";
import { useInView } from "@/components/landing/useInView";
import {
  formatInboxLanguage,
  formatInboxStatus,
  getInitials,
  INBOX_TICKETS,
  type InboxTicket,
} from "@/lib/inboxData";
import { formatConfidence, formatPriority } from "@/lib/analysis";

export default function ProductShowcase() {
  const [selectedId, setSelectedId] = useState(INBOX_TICKETS[0].id);
  const frameRef = useInView<HTMLDivElement>();
  const ticket =
    INBOX_TICKETS.find((item) => item.id === selectedId) ?? INBOX_TICKETS[0];

  return (
    <div
      ref={frameRef}
      className="product-showcase-frame overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] lg:min-h-[540px]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
        <p className="ml-3 min-w-0 truncate font-mono text-[0.6875rem] tracking-[0.02em] text-[var(--muted)]">
          app.indisstack.in/inbox
        </p>
        <Link
          href="/inbox"
          className="ml-auto shrink-0 text-xs tracking-[-0.01em] text-[var(--accent)] transition hover:underline"
        >
          Open full demo →
        </Link>
      </div>

      <div className="grid min-h-[480px] lg:min-h-[540px] lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="showcase-panel showcase-panel-1 max-h-[360px] overflow-y-auto border-b border-[var(--border)] lg:max-h-none lg:border-b-0 lg:border-r">
          <ul>
            {INBOX_TICKETS.slice(0, 5).map((item) => (
              <li key={item.id} className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full px-3 py-3 text-left transition ${
                    item.id === selectedId
                      ? "bg-[var(--background)]"
                      : "hover:bg-[var(--background)]/70"
                  }`}
                >
                  <span className="flex gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[0.625rem] font-medium text-[var(--muted)]">
                      {getInitials(item.customerName)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-[var(--foreground)]">
                        {item.customerName}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.6875rem] text-[var(--muted)]">
                        {item.preview}
                      </span>
                      <span className="mt-1 block text-[0.625rem] text-[var(--muted)]">
                        {item.channel} · {formatPriority(item.priority)}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="showcase-panel showcase-panel-2">
          <ConversationPreview ticket={ticket} />
        </div>
        <div className="showcase-panel showcase-panel-3">
          <AnalysisPreview ticket={ticket} />
        </div>
      </div>
    </div>
  );
}

function ConversationPreview({ ticket }: { ticket: InboxTicket }) {
  return (
    <div className="flex min-h-[280px] flex-col border-b border-[var(--border)] lg:min-h-0 lg:border-b-0 lg:border-r">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {ticket.customerName}
        </p>
        <p className="mt-1 font-mono text-[0.6875rem] text-[var(--muted)]">
          {ticket.orderId} · {ticket.channel} ·{" "}
          {formatInboxLanguage(ticket.language)}
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[88%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                message.role === "customer"
                  ? "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  : "bg-[var(--foreground)] text-[var(--background)]"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisPreview({ ticket }: { ticket: InboxTicket }) {
  const { analysis } = ticket;
  const confidence = formatConfidence(analysis.confidence);

  return (
    <div className="flex flex-col bg-[var(--background)]/40 px-4 py-4">
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
        IndisStack analysis
      </p>
      <p className="mt-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[0.6875rem] font-medium text-[var(--foreground)]">
        Demo output — deterministic preview
      </p>

      {analysis.needsHuman && (
        <div className="mt-4 border-l-2 border-[var(--accent)] pl-3">
          <p className="text-xs font-medium text-[var(--foreground)]">
            Escalate to human
          </p>
          <p className="mt-0.5 text-[0.6875rem] text-[var(--muted)]">
            Sensitive case — review before acting
          </p>
        </div>
      )}

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-[var(--muted)]">
            Intent
          </dt>
          <dd className="mt-0.5 font-mono text-[0.6875rem] text-[var(--foreground)]">
            {analysis.intent}
          </dd>
        </div>
        <div>
          <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-[var(--muted)]">
            Recommended action
          </dt>
          <dd className="mt-0.5 text-xs leading-relaxed text-[var(--foreground)]">
            {analysis.action}
          </dd>
        </div>
        <div>
          <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-[var(--muted)]">
            Confidence
          </dt>
          <dd className="mt-1 font-mono text-xs text-[var(--foreground)]">
            {confidence}%
          </dd>
          <div className="mt-1.5 h-px bg-[var(--border)]">
            <div
              className="h-px bg-[var(--accent)]"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </dl>

      <div className="mt-auto space-y-2 pt-5">
        <p className="text-[0.625rem] text-[var(--muted)]">
          Status: {formatInboxStatus(ticket.status)}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <span className="rounded-md border border-[var(--foreground)] bg-[var(--foreground)] px-2 py-1.5 text-center text-[0.6875rem] font-medium text-[var(--background)]">
            Approve
          </span>
          <span className="rounded-md border border-[var(--border)] px-2 py-1.5 text-center text-[0.6875rem] font-medium text-[var(--foreground)]">
            Escalate
          </span>
        </div>
      </div>
    </div>
  );
}
