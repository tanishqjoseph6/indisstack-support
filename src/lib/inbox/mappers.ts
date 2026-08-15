import type { AnalysisPriority } from "@/lib/analysis";
import type {
  ConversationMessage,
  InboxAnalysis,
  InboxChannel,
  InboxStatus,
  InboxTicket,
} from "@/lib/inboxData";
import { formatReplyTime } from "@/lib/inboxState";

export type DbTicketRow = {
  id: string;
  customer_name: string;
  customer_initials: string | null;
  preview: string | null;
  channel: string | null;
  language: string | null;
  priority: string | null;
  status: InboxStatus;
  created_at: string;
  updated_at: string;
};

export type DbMessageRow = {
  id: string;
  ticket_id: string;
  sender_type: "customer" | "agent" | "system";
  sender_name: string | null;
  content: string;
  created_at: string;
};

export type DbAnalysisRow = {
  id: string;
  ticket_id: string;
  intent: string | null;
  priority: string | null;
  recommended_action: string | null;
  confidence: number | null;
  escalation_required: boolean;
  suggested_reply: string | null;
  created_at: string;
};

function parseLanguage(value: string | null): InboxAnalysis["language"] {
  if (
    value === "hindi" ||
    value === "hinglish" ||
    value === "english" ||
    value === "other"
  ) {
    return value;
  }
  return "other";
}

function parsePriority(value: string | null): AnalysisPriority {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return "medium";
}

function parseChannel(value: string | null): InboxChannel {
  if (value === "WhatsApp" || value === "Email" || value === "Web chat") {
    return value;
  }
  return "Email";
}

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return formatReplyTime(date);
}

export function formatTicketTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60_000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hr ago" : `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function mapSenderToRole(
  senderType: DbMessageRow["sender_type"],
): ConversationMessage["role"] {
  return senderType === "customer" ? "customer" : "support";
}

function normalizeConfidence(value: number | null): number {
  if (value === null || Number.isNaN(value)) return 0;
  if (value > 1) return Math.min(1, Math.max(0, value / 100));
  return Math.min(1, Math.max(0, value));
}

export function mapMessageRow(row: DbMessageRow): ConversationMessage {
  return {
    id: row.id,
    role: mapSenderToRole(row.sender_type),
    text: row.content,
    time: formatMessageTime(row.created_at),
  };
}

export function mapAnalysisRow(
  row: DbAnalysisRow | null,
  ticketLanguage: InboxAnalysis["language"],
  ticketPriority: AnalysisPriority,
): InboxAnalysis {
  if (!row) {
    return {
      intent: "unknown",
      language: ticketLanguage,
      priority: ticketPriority,
      confidence: 0,
      action: "",
      reply: "",
      needsHuman: false,
    };
  }

  return {
    intent: row.intent ?? "unknown",
    language: ticketLanguage,
    priority: parsePriority(row.priority),
    confidence: normalizeConfidence(row.confidence),
    action: row.recommended_action ?? "",
    reply: row.suggested_reply ?? "",
    needsHuman: row.escalation_required,
  };
}

export function mapTicketRow(
  ticket: DbTicketRow,
  messages: DbMessageRow[],
  analysis: DbAnalysisRow | null,
): InboxTicket {
  const language = parseLanguage(ticket.language);
  const priority = parsePriority(ticket.priority);

  return {
    id: ticket.id,
    customerName: ticket.customer_name,
    preview: ticket.preview ?? "",
    channel: parseChannel(ticket.channel),
    timestamp: formatTicketTimestamp(ticket.created_at),
    priority,
    status: ticket.status,
    orderId: "—",
    language,
    messages: messages
      .filter((message) => message.ticket_id === ticket.id)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map(mapMessageRow),
    analysis: mapAnalysisRow(analysis, language, priority),
  };
}

export function agentMessageToDbRow(
  ticketId: string,
  content: string,
  senderName = "Support",
) {
  return {
    ticket_id: ticketId,
    sender_type: "agent" as const,
    sender_name: senderName,
    content,
  };
}
