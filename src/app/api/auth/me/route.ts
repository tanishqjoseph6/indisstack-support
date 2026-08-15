import { NextResponse } from "next/server";
import { getInboxAuthContext } from "@/lib/auth/guards";
import { ensureDefaultWorkspace } from "@/lib/workspace/setup";

export async function GET() {
  const ctx = await getInboxAuthContext();

  if (ctx.kind === "demo") {
    return NextResponse.json({ demo: true });
  }

  if (ctx.kind === "unconfigured") {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  if (ctx.kind === "unauthenticated") {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: ctx.user.id,
      email: ctx.user.email ?? "",
    },
    workspace: ctx.workspace,
  });
}

export async function POST() {
  const ctx = await getInboxAuthContext();

  if (ctx.kind !== "authenticated") {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const workspace = await ensureDefaultWorkspace(ctx.user);
    return NextResponse.json({ workspace });
  } catch {
    return NextResponse.json(
      { error: "Unable to create workspace." },
      { status: 500 },
    );
  }
}
