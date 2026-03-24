/**
 * Supabase admin client for Edge Functions.
 * Uses the service_role key to bypass RLS for sync operations.
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  }

  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return client;
}

/**
 * Batch upsert rows into a table. Splits into chunks of 500 to avoid
 * hitting Supabase/PostgREST payload limits.
 */
export async function batchUpsert(
  table: string,
  rows: Record<string, unknown>[],
  conflictColumn: string
): Promise<{ upserted: number; failed: number }> {
  const db = getSupabaseAdmin();
  const chunkSize = 500;
  let upserted = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await db
      .from(table)
      .upsert(chunk, { onConflict: conflictColumn });

    if (error) {
      console.error(`Upsert chunk ${i}-${i + chunk.length} failed:`, error.message);
      failed += chunk.length;
    } else {
      upserted += chunk.length;
    }
  }

  return { upserted, failed };
}
