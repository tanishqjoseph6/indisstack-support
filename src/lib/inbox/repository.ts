import type { SupabaseClient } from "@supabase/supabase-js";
import "server-only";

import type { InboxStatus, InboxTicket } from "@/lib/inboxData";
import {
  agentMessageToDbRow,
  mapTicketRow,
  type DbAnalysisRow,
  type DbMessageRow,
  type DbTicketRow,
} from "@/lib/inbox/mappers";

async function fetchTicketBundle(supabase: SupabaseClient, id: string) {
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (ticketError) throw ticketError;
  if (!ticket) return null;

  const [{ data: messages, error: messageError }, { data: analysis, error: analysisError }] =
    await Promise.all([
      supabase
        .from("messages")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("analyses")
        .select("*")
        .eq("ticket_id", id)
        .maybeSingle(),
    ]);

  if (messageError) throw messageError;
  if (analysisError) throw analysisError;

  return mapTicketRow(
    ticket as DbTicketRow,
    (messages as DbMessageRow[] | null) ?? [],
    (analysis as DbAnalysisRow | null) ?? null,
  );
}

export async function getTickets(supabase: SupabaseClient): Promise<InboxTicket[]> {
  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (ticketError) throw ticketError;
  if (!tickets?.length) return [];

  const ticketIds = tickets.map((ticket) => ticket.id);

  const { data: analyses, error: analysisError } = await supabase
    .from("analyses")
    .select("*")
    .in("ticket_id", ticketIds);

  if (analysisError) throw analysisError;

  const analysisByTicket = new Map(
    (analyses as DbAnalysisRow[] | null)?.map((row) => [row.ticket_id, row]) ?? [],
  );

  return (tickets as DbTicketRow[]).map((ticket) =>
    mapTicketRow(ticket, [], analysisByTicket.get(ticket.id) ?? null),
  );
}

export async function getTicket(
  supabase: SupabaseClient,
  id: string,
): Promise<InboxTicket | null> {
  return fetchTicketBundle(supabase, id);
}

export async function getMessages(supabase: SupabaseClient, ticketId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAnalysis(supabase: SupabaseClient, ticketId: string) {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("ticket_id", ticketId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateTicketStatus(
  supabase: SupabaseClient,
  id: string,
  status: InboxStatus,
): Promise<InboxTicket | null> {
  const { error } = await supabase.from("tickets").update({ status }).eq("id", id);

  if (error) throw error;
  return fetchTicketBundle(supabase, id);
}

export async function addMessage(
  supabase: SupabaseClient,
  ticketId: string,
  content: string,
  senderName = "Support",
): Promise<InboxTicket | null> {
  const { error } = await supabase
    .from("messages")
    .insert(agentMessageToDbRow(ticketId, content, senderName));

  if (error) throw error;

  return fetchTicketBundle(supabase, ticketId);
}

export async function saveAnalysis(
  supabase: SupabaseClient,
  ticketId: string,
  analysis: InboxTicket["analysis"],
): Promise<void> {
  const confidence =
    analysis.confidence <= 1
      ? Math.round(analysis.confidence * 100)
      : Math.round(analysis.confidence);

  const row = {
    ticket_id: ticketId,
    intent: analysis.intent,
    priority: analysis.priority,
    recommended_action: analysis.action,
    confidence,
    escalation_required: analysis.needsHuman,
    suggested_reply: analysis.reply,
  };

  const { error } = await supabase.from("analyses").upsert(row, {
    onConflict: "ticket_id",
  });

  if (error) throw error;
}
