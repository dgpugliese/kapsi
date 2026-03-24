/**
 * Chapter sync handler — fetches ~770 chapter accounts from Salesforce
 * and upserts into directory_chapters.
 */

import { sfQuery } from "./salesforce.ts";
import { batchUpsert } from "./supabase-admin.ts";
import { createSyncLog, completeSyncLog } from "./logger.ts";

export async function syncChapters(): Promise<{
  status: string;
  records: number;
}> {
  const logId = await createSyncLog("chapters");
  const startTime = Date.now();

  try {
    const records = await sfQuery(`
      SELECT Id, Name, Type, Chapter_Id__c, FON_Chapter_Status__c,
        FON_Chapter_Type__c, BillingCity, BillingState,
        FON_Chapter_Meeting_Day__c, FON_Chapter_Meeting_Location__c,
        Website, ParentId, Parent.Name
      FROM Account
      WHERE Type IN ('CHAP-A','CHAP-UG')
      ORDER BY Name ASC
    `);

    const rows = records.map((r: Record<string, unknown>) => ({
      sf_account_id: r.Id,
      name: r.Name || "",
      chapter_id: r.Chapter_Id__c,
      chapter_type: r.FON_Chapter_Type__c || r.Type,
      chapter_status: r.FON_Chapter_Status__c,
      billing_city: r.BillingCity,
      billing_state: r.BillingState,
      province: (r.Parent as Record<string, unknown>)?.Name ?? null,
      meeting_day: r.FON_Chapter_Meeting_Day__c,
      meeting_location: r.FON_Chapter_Meeting_Location__c,
      website: r.Website,
      last_synced_at: new Date().toISOString(),
    }));

    const { upserted, failed } = await batchUpsert(
      "directory_chapters",
      rows,
      "sf_account_id"
    );

    await completeSyncLog(logId, {
      status: failed > 0 ? "partial" : "completed",
      records_processed: records.length,
      records_upserted: upserted,
      records_failed: failed,
      started_at: startTime,
    });

    return { status: "completed", records: upserted };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await completeSyncLog(logId, {
      status: "failed",
      error_message: message,
      started_at: startTime,
    });
    throw err;
  }
}
