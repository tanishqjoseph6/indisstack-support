import "server-only";

import type { User } from "@supabase/supabase-js";
import type { WorkspaceSummary } from "@/lib/auth/guards";
import { ensureDemoTicketsForWorkspace } from "@/lib/workspace/demoTickets";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function getWorkspaceName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const firstName =
    (typeof metadata?.first_name === "string" && metadata.first_name.trim()) ||
    (typeof metadata?.full_name === "string" &&
      metadata.full_name.trim().split(/\s+/)[0]) ||
    null;

  return firstName ? `${firstName}'s Workspace` : "My Workspace";
}

async function getUserWorkspaceFromAdmin(
  userId: string,
): Promise<WorkspaceSummary | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await admin
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data?.workspaces) return null;

  const workspace = Array.isArray(data.workspaces)
    ? data.workspaces[0]
    : data.workspaces;

  if (!workspace) return null;

  return {
    id: workspace.id,
    name: workspace.name,
    role: data.role,
  };
}

/**
 * Creates a default workspace + owner membership using the service-role client.
 * Must only be called from trusted server routes after the user session is verified.
 */
export async function ensureDefaultWorkspace(user: User): Promise<WorkspaceSummary> {
  const existing = await getUserWorkspaceFromAdmin(user.id);
  if (existing) {
    await ensureDemoTicketsForWorkspace(existing.id, user.id);
    return existing;
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error("Supabase is not configured");
  }

  const name = getWorkspaceName(user);

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .insert({ name })
    .select("id, name")
    .single();

  if (workspaceError) throw workspaceError;

  const { error: memberError } = await admin.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    await admin.from("workspaces").delete().eq("id", workspace.id);
    throw memberError;
  }

  await ensureDemoTicketsForWorkspace(workspace.id, user.id);

  return {
    id: workspace.id,
    name: workspace.name,
    role: "owner",
  };
}
