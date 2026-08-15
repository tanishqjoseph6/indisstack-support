import {
  INBOX_TICKETS,
  type ConversationMessage,
  type InboxStatus,
  type InboxTicket,
} from "@/lib/inboxData";

const STORAGE_KEY = "indisstack-inbox-state-v1";

type PersistedTicketState = {
  status?: string;
  messages?: ConversationMessage[];
};

type PersistedInboxState = {
  version: 1;
  tickets: Record<string, PersistedTicketState>;
};

const VALID_STATUSES = new Set<InboxStatus>([
  "unresolved",
  "resolved",
  "escalated",
]);

function normalizeStatus(status: string | undefined): InboxStatus | undefined {
  if (!status) return undefined;
  if (status === "approved") return "resolved";
  if (VALID_STATUSES.has(status as InboxStatus)) {
    return status as InboxStatus;
  }
  return undefined;
}

function isValidMessage(value: unknown): value is ConversationMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as ConversationMessage;
  return (
    typeof message.id === "string" &&
    (message.role === "customer" || message.role === "support") &&
    typeof message.text === "string" &&
    typeof message.time === "string"
  );
}

function parsePersistedState(raw: string): PersistedInboxState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("tickets" in parsed) ||
      typeof (parsed as PersistedInboxState).tickets !== "object"
    ) {
      return null;
    }

    const tickets: Record<string, PersistedTicketState> = {};
    for (const [id, state] of Object.entries(
      (parsed as PersistedInboxState).tickets,
    )) {
      if (!state || typeof state !== "object") continue;

      const normalizedStatus = normalizeStatus(
        typeof state.status === "string" ? state.status : undefined,
      );

      const messages = Array.isArray(state.messages)
        ? state.messages.filter(isValidMessage)
        : undefined;

      if (normalizedStatus || messages) {
        tickets[id] = {
          ...(normalizedStatus ? { status: normalizedStatus } : {}),
          ...(messages ? { messages } : {}),
        };
      }
    }

    return { version: 1, tickets };
  } catch {
    return null;
  }
}

export function cloneTickets(tickets: InboxTicket[]): InboxTicket[] {
  return tickets.map((ticket) => ({
    ...ticket,
    messages: [...ticket.messages],
    analysis: { ...ticket.analysis },
  }));
}

export function applyPersistedState(
  baseTickets: InboxTicket[],
  persisted: PersistedInboxState,
): InboxTicket[] {
  const knownIds = new Set(baseTickets.map((ticket) => ticket.id));

  return baseTickets.map((ticket) => {
    const saved = persisted.tickets[ticket.id];
    if (!saved || !knownIds.has(ticket.id)) {
      return { ...ticket, messages: [...ticket.messages], analysis: { ...ticket.analysis } };
    }

    const status = normalizeStatus(saved.status) ?? ticket.status;
    const baseMessageIds = new Set(ticket.messages.map((message) => message.id));
    const extraMessages =
      saved.messages?.filter((message) => !baseMessageIds.has(message.id)) ?? [];

    return {
      ...ticket,
      status,
      messages: [...ticket.messages, ...extraMessages],
      analysis: { ...ticket.analysis },
    };
  });
}

export function loadTicketsFromStorage(): InboxTicket[] | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const persisted = parsePersistedState(raw);
  if (!persisted) return null;

  return applyPersistedState(cloneTickets(INBOX_TICKETS), persisted);
}

export function saveTicketsToStorage(tickets: InboxTicket[]): void {
  if (typeof window === "undefined") return;

  const baseById = new Map(INBOX_TICKETS.map((ticket) => [ticket.id, ticket]));
  const persisted: PersistedInboxState = { version: 1, tickets: {} };

  for (const ticket of tickets) {
    const base = baseById.get(ticket.id);
    if (!base) continue;

    const statusChanged = ticket.status !== base.status;
    const baseMessageIds = new Set(base.messages.map((message) => message.id));
    const addedMessages = ticket.messages.filter(
      (message) => !baseMessageIds.has(message.id),
    );

    if (statusChanged || addedMessages.length > 0) {
      persisted.tickets[ticket.id] = {
        ...(statusChanged ? { status: ticket.status } : {}),
        ...(addedMessages.length > 0 ? { messages: addedMessages } : {}),
      };
    }
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function formatReplyTime(date = new Date()): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

let replyIdCounter = 0;

export function createReplyMessage(text: string): ConversationMessage {
  replyIdCounter += 1;
  return {
    id: `reply-${Date.now()}-${replyIdCounter}`,
    role: "support",
    text,
    time: formatReplyTime(),
  };
}
