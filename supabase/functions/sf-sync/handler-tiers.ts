/**
 * Membership tiers sync handler — fetches dues items and subscription plans
 * from Fonteva and upserts into sync_membership_tiers and sync_subscription_plans.
 */

import { sfQuery } from "./salesforce.ts";
import { batchUpsert } from "./supabase-admin.ts";
import { createSyncLog, completeSyncLog } from "./logger.ts";

export async function syncTiers(): Promise<{
  status: string;
  items: number;
  plans: number;
}> {
  const logId = await createSyncLog("tiers");
  const startTime = Date.now();

  try {
    // Fetch dues items
    const items = await sfQuery(`
      SELECT Id, Name, OrderApi__Price__c, OrderApi__Description__c,
        OrderApi__Display_Name__c, OrderApi__Is_Subscription__c,
        OrderApi__Item_Class__r.Name, OrderApi__Is_Active__c
      FROM OrderApi__Item__c
      WHERE OrderApi__Is_Active__c = true
        AND OrderApi__Item_Class__r.Name LIKE '%Dues%'
      ORDER BY OrderApi__Price__c ASC
    `);

    const itemRows = items.map((i: Record<string, unknown>) => ({
      sf_item_id: i.Id,
      name: i.Name || "",
      display_name: i.OrderApi__Display_Name__c,
      description: i.OrderApi__Description__c,
      price: i.OrderApi__Price__c ?? 0,
      is_subscription: i.OrderApi__Is_Subscription__c === true,
      item_class: (i.OrderApi__Item_Class__r as Record<string, unknown>)?.Name ?? null,
      is_active: i.OrderApi__Is_Active__c === true,
      last_synced_at: new Date().toISOString(),
    }));

    // Fetch subscription plans
    const plans = await sfQuery(`
      SELECT Id, Name, OrderApi__Is_Active__c, OrderApi__Type__c
      FROM OrderApi__Subscription_Plan__c
      WHERE OrderApi__Is_Active__c = true
      ORDER BY Name
    `);

    const planRows = plans.map((p: Record<string, unknown>) => ({
      sf_plan_id: p.Id,
      name: p.Name || "",
      type: p.OrderApi__Type__c,
      is_active: p.OrderApi__Is_Active__c === true,
      last_synced_at: new Date().toISOString(),
    }));

    // Upsert both
    const itemResult = await batchUpsert(
      "sync_membership_tiers",
      itemRows,
      "sf_item_id"
    );
    const planResult = await batchUpsert(
      "sync_subscription_plans",
      planRows,
      "sf_plan_id"
    );

    const totalUpserted = itemResult.upserted + planResult.upserted;
    const totalFailed = itemResult.failed + planResult.failed;

    await completeSyncLog(logId, {
      status: totalFailed > 0 ? "partial" : "completed",
      records_processed: items.length + plans.length,
      records_upserted: totalUpserted,
      records_failed: totalFailed,
      started_at: startTime,
    });

    return {
      status: "completed",
      items: itemResult.upserted,
      plans: planResult.upserted,
    };
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
