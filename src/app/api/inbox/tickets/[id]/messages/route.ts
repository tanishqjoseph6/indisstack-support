import { NextResponse } from "next/server";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { addMessage } from "@/lib/inbox/repository";
import { isSupabaseConfigured } from "@/lib/supabase/server-config";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (IS_PUBLIC_DEMO_MODE || !isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase persistence is unavailable." },
      { status: 503 },
    );
  }

  try {
    const body: unknown = await request.json();
    const content =
      body !== null &&
      typeof body === "object" &&
      "content" in body &&
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json({ error: "Message content is required." }, { status: 400 });
    }

    const ticket = await addMessage(id, content);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, ticket });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to send reply." },
      { status: 500 },
    );
  }
}
