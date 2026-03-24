/**
 * Sync logging helper — writes run status to the sync_log table.
 */

import { getSupabaseAdmin } from "./supabase-admin.ts";

export interface SyncLogEntry {
  id?: string;
  sync_type: string;
  status: "running" | "completed" | "failed" | "partial";
  records_processed?: number;
  records_upserted?: number;
  records_failed?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
}

export async function createSyncLog(syncType: string): Promise<string> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("sync_log")
    .insert({ sync_type: syncType, status: "running" })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create sync log:", error.message);
    throw error;
  }

  return data.id;
}

export async function updateSyncLog(
  id: string,
  update: Partial<SyncLogEntry>
): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db.from("sync_log").update(update).eq("id", id);

  if (error) {
    console.error("Failed to update sync log:", error.message);
  }
}

export async function completeSyncLog(
  id: string,
  result: {
    status: "completed" | "failed" | "partial";
    records_processed?: number;
    records_upserted?: number;
    records_failed?: number;
    error_message?: string;
    started_at: number; // Date.now() at start
  }
): Promise<void> {
  await updateSyncLog(id, {
    status: result.status,
    records_processed: result.records_processed ?? 0,
    records_upserted: result.records_upserted ?? 0,
    records_failed: result.records_failed ?? 0,
    error_message: result.error_message,
    completed_at: new Date().toISOString(),
    duration_ms: Date.now() - result.started_at,
  });
}
