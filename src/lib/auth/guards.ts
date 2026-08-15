import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { IS_PUBLIC_DEMO_MODE } from "@/lib/demoMode";
import { createSupabaseServerClient } from "@/lib/supabase/server-user";
import { isSupabaseClientConfigured } from "@/lib/supabase/config";

export type WorkspaceSummary = {
  id: string;
  name: string;
  role: string;
};

export type InboxAuthContext =
  | { kind: "demo" }
  | { kind: "unconfigured" }
  | { kind: "unauthenticated" }
  | {
      kind: "authenticated";
      supabase: SupabaseClient;
      user: User;
      workspace: WorkspaceSummary | null;
    };

type WorkspaceMemberRow = {
  workspace_id: string;
  role: string;
  workspaces: { id: string; name: string } | { id: string; name: string }[] | null;
};

function mapWorkspace(member: WorkspaceMemberRow | null): WorkspaceSummary | null {
  if (!member?.workspaces) return null;

  const workspace = Array.isArray(member.workspaces)
    ? member.workspaces[0]
    : member.workspaces;

  if (!workspace) return null;

  return {
    id: workspace.id,
    name: workspace.name,
    role: member.role,
  };
}

export async function getUserWorkspace(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceSummary | null> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return mapWorkspace(data as WorkspaceMemberRow | null);
}

export async function getInboxAuthContext(): Promise<InboxAuthContext> {
  if (IS_PUBLIC_DEMO_MODE) {
    return { kind: "demo" };
  }

  if (!isSupabaseClientConfigured()) {
    return { kind: "unconfigured" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { kind: "unconfigured" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { kind: "unauthenticated" };
  }

  const workspace = await getUserWorkspace(supabase, user.id);

  return {
    kind: "authenticated",
    supabase,
    user,
    workspace,
  };
}
