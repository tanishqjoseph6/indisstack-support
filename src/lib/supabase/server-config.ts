import "server-only";

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getServerSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

/** Server-side: Supabase admin client can be created. */
export function isSupabaseConfigured(): boolean {
  return Boolean(getServerSupabaseUrl() && getSupabaseServiceRoleKey());
}
