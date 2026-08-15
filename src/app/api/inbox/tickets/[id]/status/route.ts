import { NextResponse } from "next/server";
import type { InboxStatus } from "@/lib/inboxData";
import { getInboxAuthContext } from "@/lib/auth/guards";
import { updateTicketStatus } from "@/lib/inbox/repository";

const VALID_STATUSES = new Set<InboxStatus>([
  "unresolved",
  "resolved",
  "escalated",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const ctx = await getInboxAuthContext();

  if (ctx.kind === "demo" || ctx.kind === "unconfigured") {
    return NextResponse.json(
      { ok: false, error: "Supabase persistence is unavailable." },
      { status: 503 },
    );
  }

  if (ctx.kind === "unauthenticated") {
    return NextResponse.json(
      { ok: false, error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();
    const status =
      body !== null &&
      typeof body === "object" &&
      "status" in body &&
      typeof body.status === "string"
        ? body.status
        : null;

    if (!status || !VALID_STATUSES.has(status as InboxStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const ticket = await updateTicketStatus(
      ctx.supabase,
      id,
      status as InboxStatus,
    );
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, ticket });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to update ticket status." },
      { status: 500 },
    );
  }
}
