import { NextResponse } from "next/server";
import { getInboxAuthContext } from "@/lib/auth/guards";
import { getTickets } from "@/lib/inbox/repository";
import { ensureDemoTicketsForWorkspace } from "@/lib/workspace/demoTickets";

export async function GET() {
  const ctx = await getInboxAuthContext();

  if (ctx.kind === "demo" || ctx.kind === "unconfigured") {
    return NextResponse.json({ source: "local", tickets: null });
  }

  if (ctx.kind === "unauthenticated") {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  if (!ctx.workspace) {
    return NextResponse.json({
      source: "supabase",
      tickets: [],
      workspace: null,
    });
  }

  try {
    await ensureDemoTicketsForWorkspace(ctx.workspace.id, ctx.user.id);
    const tickets = await getTickets(ctx.supabase);
    return NextResponse.json({
      source: "supabase",
      tickets,
      workspace: ctx.workspace,
    });
  } catch {
    return NextResponse.json({
      source: "local",
      tickets: null,
      error: "Unable to load tickets.",
    });
  }
}
