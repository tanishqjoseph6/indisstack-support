import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-user";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json({ error: "Unable to sign out." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
