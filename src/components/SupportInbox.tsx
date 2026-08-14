"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  formatInboxLanguage,
  formatInboxStatus,
  getInitials,
  INBOX_TICKETS,
  type InboxFilter,
  type InboxStatus,
  type InboxTicket,
  matchesFilter,
} from "@/lib/inboxData";
import { formatConfidence, formatPriority } from "@/lib/analysis";

const FILTER_TABS: { id: InboxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_attention", label: "Needs attention" },
  { id: "resolved", label: "Resolved" },
];

function cloneTickets(tickets: InboxTicket[]): InboxTicket[] {
  return tickets.map((ticket) => ({
    ...ticket,
    messages: [...ticket.messages],
    analysis: { ...ticket.analysis },
  }));
}

export default function SupportInbox() {
  const [tickets, setTickets] = useState(() => cloneTickets(INBOX_TICKETS));
  const [selectedId, setSelectedId] = useState(INBOX_TICKETS[0].id);
  const [filter, setFilter] = useState<InboxFilter>("all");

  const filteredTickets = useMemo(
    () => tickets.filter((ticket) => matchesFilter(ticket, filter)),
    [tickets, filter],
  );

  useEffect(() => {
    if (
      filteredTickets.length > 0 &&
      !filteredTickets.some((ticket) => ticket.id === selectedId)
    ) {
      setSelectedId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedId]);

  const selectedTicket =
    filteredTickets.find((ticket) => ticket.id === selectedId) ??
    filteredTickets[0] ??
    null;

  function updateTicketStatus(ticketId: string, status: InboxStatus) {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket,
      ),
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="shrink-0 text-[0.9375rem] font-medium tracking-tight text-[var(--foreground)]"
            >
              IndisStack
            </Link>
            <span className="hidden text-[var(--border)] sm:inline">/</span>
            <h1 className="truncate text-sm font-medium text-[var(--foreground)] sm:text-base">
              Support Inbox
            </h1>
            <span className="hidden shrink-0 border border-[var(--border)] px-2 py-0.5 text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--muted)] sm:inline">
              Demo workspace
            </span>
          </div>
          <Link
            href="/"
            className="shrink-0 text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
          >
            Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`border px-3 py-1.5 text-xs font-medium transition ${
                filter === tab.id
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid min-h-[640px] flex-1 gap-px border border-[var(--border)] bg-[var(--border)] lg:grid-cols-[280px_minmax(0,1fr)_300px]">
          <InboxList
            tickets={filteredTickets}
            selectedId={selectedTicket?.id ?? ""}
            onSelect={setSelectedId}
          />

          {selectedTicket ? (
            <>
              <ConversationPanel ticket={selectedTicket} />
              <AnalysisPanel
                ticket={selectedTicket}
                onApprove={() => updateTicketStatus(selectedTicket.id, "approved")}
                onEscalate={() =>
                  updateTicketStatus(selectedTicket.id, "escalated")
                }
                onResolve={() =>
                  updateTicketStatus(selectedTicket.id, "resolved")
                }
              />
            </>
          ) : (
            <div className="col-span-2 flex items-center justify-center bg-[var(--surface)] p-8 text-sm text-[var(--muted)]">
              No tickets in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InboxList({
  tickets,
  selectedId,
  onSelect,
}: {
  tickets: InboxTicket[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="max-h-[70vh] overflow-y-auto bg-[var(--surface)] lg:max-h-none">
      {tickets.length === 0 ? (
        <p className="p-4 text-sm text-[var(--muted)]">No tickets match this filter.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => {
            const isSelected = ticket.id === selectedId;
            return (
              <li key={ticket.id} className="border-b border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => onSelect(ticket.id)}
                  className={`w-full px-4 py-4 text-left transition ${
                    isSelected ? "bg-[var(--background)]" : "hover:bg-[var(--background)]/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--background)] text-[0.6875rem] font-medium text-[var(--muted)]">
                      {getInitials(ticket.customerName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">
                          {ticket.customerName}
                        </p>
                        <span className="shrink-0 text-[0.6875rem] text-[var(--muted)]">
                          {ticket.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">
                        {ticket.preview}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.6875rem] text-[var(--muted)]">
                        <span>{ticket.channel}</span>
                        <span>·</span>
                        <span className="capitalize">{ticket.priority}</span>
                        <span>·</span>
                        <span>{formatInboxStatus(ticket.status)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

function ConversationPanel({ ticket }: { ticket: InboxTicket }) {
  return (
    <section className="flex flex-col bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
        <h2 className="text-sm font-medium text-[var(--foreground)]">
          {ticket.customerName}
        </h2>
        <dl className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-3">
          <div>
            <dt className="uppercase tracking-[0.1em]">Order ID</dt>
            <dd className="mt-0.5 font-mono text-[var(--foreground)]">
              {ticket.orderId}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.1em]">Channel</dt>
            <dd className="mt-0.5 text-[var(--foreground)]">{ticket.channel}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.1em]">Language</dt>
            <dd className="mt-0.5 text-[var(--foreground)]">
              {formatInboxLanguage(ticket.language)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] border px-4 py-3 ${
                message.role === "customer"
                  ? "border-[var(--border)] bg-[var(--background)]"
                  : "border-[var(--foreground)]/10 bg-[var(--foreground)] text-[var(--background)]"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`mt-2 text-[0.6875rem] ${
                  message.role === "customer"
                    ? "text-[var(--muted)]"
                    : "text-[var(--background)]/70"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalysisPanel({
  ticket,
  onApprove,
  onEscalate,
  onResolve,
}: {
  ticket: InboxTicket;
  onApprove: () => void;
  onEscalate: () => void;
  onResolve: () => void;
}) {
  const { analysis } = ticket;
  const confidencePercent = formatConfidence(analysis.confidence);
  const isResolved = ticket.status === "resolved";

  return (
    <aside className="flex flex-col border-t border-[var(--border)] bg-[var(--surface)] lg:border-t-0 lg:border-l">
      <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <p className="text-[0.8125rem] font-medium text-[var(--foreground)]">
          IndisStack analysis
        </p>
        <p className="mt-2 border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[0.75rem] font-medium text-[var(--foreground)]">
          Demo output — deterministic preview
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        {analysis.needsHuman && (
          <div
            className="mb-5 border-l-2 border-[var(--accent)] py-1 pl-3"
            role="status"
          >
            <p className="text-sm font-medium text-[var(--foreground)]">
              Human escalation recommended
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              Review before approving any customer-facing action.
            </p>
          </div>
        )}

        <dl className="space-y-4">
          <AnalysisRow label="Intent" value={analysis.intent} mono />
          <AnalysisRow
            label="Language"
            value={formatInboxLanguage(analysis.language)}
          />
          <AnalysisRow
            label="Priority"
            value={formatPriority(analysis.priority)}
          />
          <AnalysisRow label="Recommended action" value={analysis.action} />
        </dl>

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="text-[var(--muted)]">Confidence</span>
            <span className="font-mono text-[var(--foreground)]">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-px w-full bg-[var(--border)]">
            <div
              className="h-px bg-[var(--accent)]"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="text-[0.8125rem] font-medium text-[var(--muted)]">
            Suggested reply
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
            &ldquo;{analysis.reply}&rdquo;
          </p>
        </div>

        <p className="mt-5 text-xs text-[var(--muted)]">
          Status: {formatInboxStatus(ticket.status)}
        </p>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] p-4 sm:p-5">
        <button
          type="button"
          onClick={onApprove}
          disabled={isResolved}
          className="w-full border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Approve suggestion
        </button>
        <button
          type="button"
          onClick={onEscalate}
          disabled={isResolved}
          className="w-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Escalate to human
        </button>
        <button
          type="button"
          onClick={onResolve}
          disabled={isResolved}
          className="w-full px-4 py-2 text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark resolved
        </button>
      </div>
    </aside>
  );
}

function AnalysisRow({
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
