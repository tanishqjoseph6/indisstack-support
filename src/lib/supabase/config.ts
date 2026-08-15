/**
 * Public Supabase configuration — safe to import from client or server code.
 * Only NEXT_PUBLIC_* environment variables are referenced here.
 */

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

/** Browser/client: Supabase anon credentials are present. */
export function isSupabaseClientConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
