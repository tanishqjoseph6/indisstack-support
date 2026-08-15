import { NextResponse } from "next/server";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { getTicket } from "@/lib/inbox/repository";
import { isSupabaseConfigured } from "@/lib/supabase/server-config";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (IS_PUBLIC_DEMO_MODE || !isSupabaseConfigured()) {
    return NextResponse.json({ source: "local", ticket: null });
  }

  try {
    const ticket = await getTicket(id);
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
