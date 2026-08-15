import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-user";
import { ensureDefaultWorkspace } from "@/lib/workspace/setup";
import { isSupabaseClientConfigured } from "@/lib/supabase/config";

export async function GET(request: Request) {
  if (!isSupabaseClientConfigured()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/inbox";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await ensureDefaultWorkspace(user);
    } catch {
      return NextResponse.redirect(new URL("/login?error=workspace", request.url));
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
