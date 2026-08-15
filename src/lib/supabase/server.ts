import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getServerSupabaseUrl,
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
} from "@/lib/supabase/server-config";

let adminClient: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!adminClient) {
    adminClient = createClient(
      getServerSupabaseUrl()!,
      getSupabaseServiceRoleKey()!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return adminClient;
}
