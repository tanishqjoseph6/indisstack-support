import "server-only";

import { createHash } from "node:crypto";
import {
  DEMO_PROBE_SEED_KEY,
  DEMO_TICKET_SEEDS,
} from "@/lib/workspace/demoSeedData";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const DEMO_ID_NAMESPACE = "indisstack-demo-v1";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/**
 * Deterministic UUID derived from workspace + entity + stable demo seed key.
 * Each workspace gets isolated ticket/message/analysis IDs.
 */
export function deriveDemoUuid(
  workspaceId: string,
  entity: "ticket" | "message" | "analysis",
  seedKey: string,
): string {
  const digest = createHash("sha256")
    .update(`${DEMO_ID_NAMESPACE}:${workspaceId}:${entity}:${seedKey}`)
    .digest();

  const bytes = Buffer.from(digest.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

async function assertWorkspaceMembership(workspaceId: string, userId: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error("Supabase is not configured");
  }

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .select("id")
    .eq("id", workspaceId)
    .maybeSingle();

  if (workspaceError) throw workspaceError;
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const { data: membership, error: membershipError } = await admin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membership) {
    throw new Error("User is not a member of this workspace");
  }

  return admin;
}

export type DemoProvisionResult = {
  provisioned: boolean;
  ticketCount: number;
};

/**
 * Provisions the 7 canonical demo tickets into a workspace (server-only).
 * Idempotent: safe to call multiple times.
 */
export async function ensureDemoTicketsForWorkspace(
  workspaceId: string,
  userId: string,
): Promise<DemoProvisionResult> {
  const admin = await assertWorkspaceMembership(workspaceId, userId);

  const probeTicketId = deriveDemoUuid(
    workspaceId,
    "ticket",
    DEMO_PROBE_SEED_KEY,
  );

  const { data: existingTicket, error: existingError } = await admin
    .from("tickets")
    .select("id")
    .eq("id", probeTicketId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingTicket) {
    return { provisioned: false, ticketCount: DEMO_TICKET_SEEDS.length };
  }

  const ticketRows = DEMO_TICKET_SEEDS.map((seed) => {
    const createdAt = minutesAgo(seed.minutesAgo);
    return {
      id: deriveDemoUuid(workspaceId, "ticket", seed.seedKey),
      workspace_id: workspaceId,
      customer_name: seed.customerName,
      customer_initials: seed.customerInitials,
      preview: seed.preview,
      channel: seed.channel,
      language: seed.language,
      priority: seed.priority,
      status: seed.status,
      created_at: createdAt,
      updated_at: createdAt,
    };
  });

  const messageRows = DEMO_TICKET_SEEDS.flatMap((seed) => {
    const ticketId = deriveDemoUuid(workspaceId, "ticket", seed.seedKey);
    return seed.messages.map((message) => ({
      id: deriveDemoUuid(workspaceId, "message", message.seedKey),
      ticket_id: ticketId,
      sender_type: message.senderType,
      sender_name: message.senderName,
      content: message.content,
      created_at: minutesAgo(message.minutesAgo),
    }));
  });

  const analysisRows = DEMO_TICKET_SEEDS.map((seed) => {
    const ticketId = deriveDemoUuid(workspaceId, "ticket", seed.seedKey);
    return {
      id: deriveDemoUuid(workspaceId, "analysis", `${seed.seedKey}-analysis`),
      ticket_id: ticketId,
      intent: seed.analysis.intent,
      priority: seed.analysis.priority,
      recommended_action: seed.analysis.recommendedAction,
      confidence: seed.analysis.confidence,
      escalation_required: seed.analysis.escalationRequired,
      suggested_reply: seed.analysis.suggestedReply,
      created_at: minutesAgo(seed.analysis.minutesAgo),
    };
  });

  const { error: ticketError } = await admin.from("tickets").insert(ticketRows);
  if (ticketError) throw ticketError;

  const { error: messageError } = await admin.from("messages").insert(messageRows);
  if (messageError) throw messageError;

  const { error: analysisError } = await admin
    .from("analyses")
    .insert(analysisRows);
  if (analysisError) throw analysisError;

  return { provisioned: true, ticketCount: DEMO_TICKET_SEEDS.length };
}
