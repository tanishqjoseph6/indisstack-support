"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  countTicketsForFilter,
  formatInboxLanguage,
  formatInboxStatus,
  getInitials,
  INBOX_TICKETS,
  type InboxFilter,
  type InboxStatus,
  type InboxTicket,
  matchesFilter,
} from "@/lib/inboxData";
import {
  addMessageRemote,
  fetchTicket,
  fetchTickets,
  updateTicketStatusRemote,
  type InboxDataSource,
} from "@/lib/inbox/api";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { fetchSession, logout } from "@/lib/auth/client";
import type { SessionInfo } from "@/lib/auth/client";
import {
  cloneTickets,
  createReplyMessage,
  loadTicketsFromStorage,
  saveTicketsToStorage,
} from "@/lib/inboxState";
import { formatConfidence, formatPriority } from "@/lib/analysis";

const FILTER_TABS: { id: InboxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_attention", label: "Needs attention" },
  { id: "resolved", label: "Resolved" },
];

const NOTICE_DURATION_MS = 3200;

export default function SupportInbox() {
  const [tickets, setTickets] = useState(() => cloneTickets(INBOX_TICKETS));
  const [selectedId, setSelectedId] = useState(INBOX_TICKETS[0].id);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [dataSource, setDataSource] = useState<InboxDataSource>("local");
  const [session, setSession] = useState<SessionInfo | null>(null);

  const filteredTickets = useMemo(
    () => tickets.filter((ticket) => matchesFilter(ticket, filter)),
    [tickets, filter],
  );

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) ?? null;

  const showNotice = useCallback((message: string) => {
    setNotice(message);
  }, []);

  useEffect(() => {
    if (IS_PUBLIC_DEMO_MODE) return;

    let cancelled = false;

    async function loadSession() {
      const info = await fetchSession();
      if (!cancelled) {
        setSession(info);
      }
    }

    void loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      if (IS_PUBLIC_DEMO_MODE) {
        const stored = loadTicketsFromStorage();
        if (!cancelled) {
          setTickets(stored ?? cloneTickets(INBOX_TICKETS));
          setDataSource("local");
          setHydrated(true);
        }
        return;
      }

      const response = await fetchTickets();

      if (!cancelled) {
        if (response.unauthorized) {
          window.location.href = "/login";
          return;
        }

        if (response.source === "supabase") {
          const nextTickets = response.tickets ?? [];
          setTickets(nextTickets);
          setSelectedId(nextTickets[0]?.id ?? "");
          setDataSource("supabase");
        } else {
          const stored = loadTicketsFromStorage();
          setTickets(stored ?? cloneTickets(INBOX_TICKETS));
          setDataSource("local");
        }
        setHydrated(true);
      }
    }

    void loadTickets();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || dataSource !== "local") return;
    saveTicketsToStorage(tickets);
  }, [tickets, hydrated, dataSource]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    setReplyOpen(false);
  }, [selectedId]);

  useEffect(() => {
    if (!tickets.some((ticket) => ticket.id === selectedId)) {
      setSelectedId(tickets[0]?.id ?? "");
    }
  }, [tickets, selectedId]);

  useEffect(() => {
    if (!hydrated || dataSource !== "supabase" || !selectedId) return;

    let cancelled = false;

    async function loadTicketDetail() {
      const ticket = await fetchTicket(selectedId);
      if (!cancelled && ticket) {
        setTickets((current) =>
          current.map((item) => (item.id === selectedId ? ticket : item)),
        );
      }
    }

    void loadTicketDetail();
    return () => {
      cancelled = true;
    };
  }, [selectedId, dataSource, hydrated]);

  function updateTicket(
    ticketId: string,
    updater: (ticket: InboxTicket) => InboxTicket,
  ) {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === ticketId ? updater(ticket) : ticket)),
    );
  }

  function updateTicketStatus(ticketId: string, status: InboxStatus) {
    updateTicket(ticketId, (ticket) => ({ ...ticket, status }));
  }

  async function persistStatus(ticketId: string, status: InboxStatus) {
    if (dataSource !== "supabase") return true;

    const ticket = await updateTicketStatusRemote(ticketId, status);
    if (!ticket) {
      showNotice("Unable to save change. Please try again.");
      return false;
    }

    setTickets((current) =>
      current.map((item) => (item.id === ticketId ? ticket : item)),
    );
    return true;
  }

  async function handleApproveAndResolve(ticketId: string) {
    const previous = tickets;
    updateTicketStatus(ticketId, "resolved");
    showNotice("Ticket resolved.");

    const ok = await persistStatus(ticketId, "resolved");
    if (!ok) setTickets(previous);
  }

  async function handleEscalate(ticketId: string) {
    const previous = tickets;
    updateTicketStatus(ticketId, "escalated");
    showNotice("Escalated to human review.");

    const ok = await persistStatus(ticketId, "escalated");
    if (!ok) setTickets(previous);
  }

  async function handleKeepOpen(ticketId: string) {
    const previous = tickets;
    updateTicketStatus(ticketId, "unresolved");
    showNotice("Ticket kept open.");

    const ok = await persistStatus(ticketId, "unresolved");
    if (!ok) setTickets(previous);
  }

  async function handleReopen(ticketId: string) {
    const previous = tickets;
    updateTicketStatus(ticketId, "unresolved");
    showNotice("Ticket reopened.");

    const ok = await persistStatus(ticketId, "unresolved");
    if (!ok) setTickets(previous);
  }

  async function handleSendReply(ticketId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const previous = tickets;
    const newMessage = createReplyMessage(trimmed);

    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      messages: [...ticket.messages, newMessage],
    }));
    setReplyOpen(false);
    showNotice("Reply sent.");

    if (dataSource === "supabase") {
      const updatedTicket = await addMessageRemote(ticketId, trimmed);
      if (!updatedTicket) {
        setTickets(previous);
        showNotice("Unable to send reply. Please try again.");
        return;
      }
      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === ticketId ? updatedTicket : ticket,
        ),
      );
    }
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
              {IS_PUBLIC_DEMO_MODE || dataSource === "local"
                ? "Demo workspace"
                : session?.workspaceName ?? "Workspace"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {!IS_PUBLIC_DEMO_MODE && session?.email ? (
              <div className="hidden items-center gap-3 sm:flex">
                <span className="max-w-[12rem] truncate text-xs text-[var(--muted)]">
                  {session.email}
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                  Logout
                </button>
              </div>
            ) : null}
            <Link
              href="/"
              className="shrink-0 text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
          {FILTER_TABS.map((tab) => {
            const count = countTicketsForFilter(tickets, tab.id);
            return (
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
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="grid min-h-[640px] flex-1 gap-px border border-[var(--border)] bg-[var(--border)] lg:grid-cols-[280px_minmax(0,1fr)_300px]">
          <InboxList
            tickets={filteredTickets}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {selectedTicket ? (
            <>
              <ConversationPanel
                ticket={selectedTicket}
                replyOpen={replyOpen}
                onCancelReply={() => setReplyOpen(false)}
                onSendReply={(text) => handleSendReply(selectedTicket.id, text)}
              />
              <AnalysisPanel
                ticket={selectedTicket}
                notice={notice}
                showDemoLabel={IS_PUBLIC_DEMO_MODE || dataSource === "local"}
                onApproveAndResolve={() =>
                  handleApproveAndResolve(selectedTicket.id)
                }
                onEscalate={() => handleEscalate(selectedTicket.id)}
                onSendReply={() => setReplyOpen(true)}
                onKeepOpen={() => handleKeepOpen(selectedTicket.id)}
                onReopen={() => handleReopen(selectedTicket.id)}
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

function ConversationPanel({
  ticket,
  replyOpen,
  onCancelReply,
  onSendReply,
}: {
  ticket: InboxTicket;
  replyOpen: boolean;
  onCancelReply: () => void;
  onSendReply: (text: string) => void;
}) {
  const [replyText, setReplyText] = useState(ticket.analysis.reply);

  useEffect(() => {
    setReplyText(ticket.analysis.reply);
  }, [ticket.id, ticket.analysis.reply]);

  function handleSend() {
    onSendReply(replyText);
    setReplyText(ticket.analysis.reply);
  }

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

      {replyOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 sm:px-6">
          <p className="text-[0.8125rem] font-medium text-[var(--foreground)]">
            Send reply
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
            className="mt-3 w-full resize-none border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            placeholder="Write your reply…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={!replyText.trim()}
              className="border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send Reply
            </button>
            <button
              type="button"
              onClick={onCancelReply}
              className="border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function AnalysisPanel({
  ticket,
  notice,
  showDemoLabel,
  onApproveAndResolve,
  onEscalate,
  onSendReply,
  onKeepOpen,
  onReopen,
}: {
  ticket: InboxTicket;
  notice: string | null;
  showDemoLabel: boolean;
  onApproveAndResolve: () => void;
  onEscalate: () => void;
  onSendReply: () => void;
  onKeepOpen: () => void;
  onReopen: () => void;
}) {
  const { analysis } = ticket;
  const confidencePercent = formatConfidence(analysis.confidence);
  const isResolved = ticket.status === "resolved";
  const isEscalated = ticket.status === "escalated";
  const isClosed = isResolved || isEscalated;
  const needsEscalation = analysis.needsHuman;

  return (
    <aside className="flex flex-col border-t border-[var(--border)] bg-[var(--surface)] lg:border-t-0 lg:border-l">
      <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <p className="text-[0.8125rem] font-medium text-[var(--foreground)]">
          IndisStack analysis
        </p>
        {showDemoLabel && (
          <p className="mt-2 border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[0.75rem] font-medium text-[var(--foreground)]">
            Demo output — deterministic preview
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        {notice && (
          <p
            className="mb-4 border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)]"
            role="status"
          >
            {notice}
          </p>
        )}

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
        {!isClosed && needsEscalation && (
          <button
            type="button"
            onClick={onEscalate}
            className="w-full border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)]"
          >
            Escalate to Human
          </button>
        )}

        {!isClosed && !needsEscalation && (
          <button
            type="button"
            onClick={onApproveAndResolve}
            className="w-full border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:bg-transparent hover:text-[var(--foreground)]"
          >
            Approve &amp; Resolve
          </button>
        )}

        <button
          type="button"
          onClick={onSendReply}
          className="w-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
        >
          Send Reply
        </button>

        {!isClosed && (
          <button
            type="button"
            onClick={onKeepOpen}
            className="w-full px-4 py-2 text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
          >
            Keep Open
          </button>
        )}

        {isClosed && (
          <button
            type="button"
            onClick={onReopen}
            className="w-full px-4 py-2 text-sm text-[var(--muted)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
          >
            Reopen
          </button>
        )}
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
