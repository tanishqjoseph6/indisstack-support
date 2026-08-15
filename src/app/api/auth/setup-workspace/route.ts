import { NextResponse } from "next/server";
import { getInboxAuthContext } from "@/lib/auth/guards";
import { ensureDefaultWorkspace } from "@/lib/workspace/setup";

export async function POST() {
  const ctx = await getInboxAuthContext();

  if (ctx.kind !== "authenticated") {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const workspace = await ensureDefaultWorkspace(ctx.user);
    return NextResponse.json({ ok: true, workspace });
  } catch {
    return NextResponse.json(
      { error: "Unable to set up workspace." },
      { status: 500 },
    );
  }
}
