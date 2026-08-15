"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseClientConfigured,
} from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

/**
 * Browser Supabase client — anon/publishable key only.
 * Not used by the inbox yet; API routes handle persistence server-side.
 */
export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseClientConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return browserClient;
}
