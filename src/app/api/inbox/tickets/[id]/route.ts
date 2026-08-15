import { NextResponse } from "next/server";
import { getInboxAuthContext } from "@/lib/auth/guards";
import { getTicket } from "@/lib/inbox/repository";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const ctx = await getInboxAuthContext();

  if (ctx.kind === "demo" || ctx.kind === "unconfigured") {
    return NextResponse.json({ source: "local", ticket: null });
  }

  if (ctx.kind === "unauthenticated") {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const ticket = await getTicket(ctx.supabase, id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }
    return NextResponse.json({ source: "supabase", ticket });
  } catch {
    return NextResponse.json({
      source: "local",
      ticket: null,
      error: "Unable to load ticket.",
    });
  }
}
