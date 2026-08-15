import { NextResponse } from "next/server";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { getTickets } from "@/lib/inbox/repository";
import { isSupabaseConfigured } from "@/lib/supabase/server-config";

export async function GET() {
  if (IS_PUBLIC_DEMO_MODE || !isSupabaseConfigured()) {
    return NextResponse.json({ source: "local", tickets: null });
  }

  try {
    const tickets = await getTickets();
    return NextResponse.json({ source: "supabase", tickets });
  } catch {
    return NextResponse.json({
      source: "local",
      tickets: null,
      error: "Unable to load tickets.",
    });
  }
}
