import type { InboxStatus, InboxTicket } from "@/lib/inboxData";

export type InboxDataSource = "local" | "supabase";

export type InboxTicketsResponse = {
  source: InboxDataSource;
  tickets: InboxTicket[] | null;
  error?: string;
};

export type InboxTicketResponse = {
  source: InboxDataSource;
  ticket: InboxTicket | null;
  error?: string;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchTickets(): Promise<InboxTicketsResponse> {
  try {
    const response = await fetch("/api/inbox/tickets", {
      method: "GET",
      cache: "no-store",
    });

    const data = await parseJson<InboxTicketsResponse>(response);
    if (!response.ok || !data) {
      return { source: "local", tickets: null };
    }

    return data;
  } catch {
    return { source: "local", tickets: null };
  }
}

export async function fetchTicket(ticketId: string): Promise<InboxTicket | null> {
  try {
    const response = await fetch(`/api/inbox/tickets/${ticketId}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await parseJson<InboxTicketResponse>(response);
    if (!response.ok || !data?.ticket) {
      return null;
    }

    return data.ticket;
  } catch {
    return null;
  }
}

export async function updateTicketStatusRemote(
  ticketId: string,
  status: InboxStatus,
): Promise<InboxTicket | null> {
  try {
    const response = await fetch(`/api/inbox/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await parseJson<{ ok: boolean; ticket?: InboxTicket; error?: string }>(
      response,
    );

    if (!response.ok || !data?.ok || !data.ticket) {
      return null;
    }

    return data.ticket;
  } catch {
    return null;
  }
}

export async function addMessageRemote(
  ticketId: string,
  content: string,
): Promise<InboxTicket | null> {
  try {
    const response = await fetch(`/api/inbox/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) return null;

    const data = await parseJson<{ ok: boolean; ticket?: InboxTicket }>(response);
    return data?.ticket ?? null;
  } catch {
    return null;
  }
}
