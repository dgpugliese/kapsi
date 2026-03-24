import { sfQuery } from "./salesforce.ts";
import { batchUpsert } from "./supabase-admin.ts";
import { createSyncLog, completeSyncLog } from "./logger.ts";

export async function syncEvents(): Promise<{ status: string; events: number; tickets: number }> {
  const logId = await createSyncLog("events");
  const startTime = Date.now();

  try {
    const events = await sfQuery(`
      SELECT Id, Name, EventApi__Display_Name__c, EventApi__Description__c,
        EventApi__Start_Date__c, EventApi__End_Date__c, EventApi__Status__c,
        EventApi__Is_Published__c, EventApi__Is_Active__c, EventApi__Capacity__c,
        EventApi__Attendees__c, EventApi__Image_URL__c, EventApi__Venue_HTML__c,
        EventApi__Overview_HTML__c, EventApi__Free_Event__c,
        EventApi__When_and_Where_Summary__c
      FROM EventApi__Event__c
      WHERE EventApi__Is_Active__c = true
      ORDER BY EventApi__Start_Date__c DESC
    `);

    const eventRows = events.map((e: Record<string, unknown>) => ({
      sf_event_id: e.Id,
      name: e.Name || "",
      display_name: e.EventApi__Display_Name__c,
      description: e.EventApi__Description__c,
      start_date: e.EventApi__Start_Date__c,
      end_date: e.EventApi__End_Date__c,
      location: e.EventApi__When_and_Where_Summary__c,
      event_type: e.EventApi__Status__c,
      is_active: e.EventApi__Is_Active__c === true,
      is_published: e.EventApi__Is_Published__c === true,
      capacity: e.EventApi__Capacity__c ?? 0,
      attendees: e.EventApi__Attendees__c ?? 0,
      image_url: e.EventApi__Image_URL__c,
      venue_html: e.EventApi__Venue_HTML__c,
      overview_html: e.EventApi__Overview_HTML__c,
      is_free: e.EventApi__Free_Event__c === true,
      last_synced_at: new Date().toISOString(),
    }));

    const eventResult = await batchUpsert("sync_events", eventRows, "sf_event_id");

    // Sync ticket types for all active events
    const tickets = await sfQuery(`
      SELECT Id, Name, EventApi__Event__c, EventApi__Price__c,
        EventApi__Is_Active__c, EventApi__Quantity_Sold__c
      FROM EventApi__Ticket_Type__c
      WHERE EventApi__Is_Active__c = true
      ORDER BY EventApi__Event__c, Name
    `);

    const ticketRows = tickets.map((t: Record<string, unknown>) => ({
      sf_ticket_type_id: t.Id,
      sf_event_id: t.EventApi__Event__c,
      name: t.Name || "",
      price: t.EventApi__Price__c ?? 0,
      capacity: 0,
      quantity_sold: t.EventApi__Quantity_Sold__c ?? 0,
      is_active: t.EventApi__Is_Active__c === true,
      last_synced_at: new Date().toISOString(),
    }));

    const ticketResult = await batchUpsert("sync_ticket_types", ticketRows, "sf_ticket_type_id");

    const totalUpserted = eventResult.upserted + ticketResult.upserted;
    const totalFailed = eventResult.failed + ticketResult.failed;

    await completeSyncLog(logId, {
      status: totalFailed > 0 ? "partial" : "completed",
      records_processed: events.length + tickets.length,
      records_upserted: totalUpserted,
      records_failed: totalFailed,
      started_at: startTime,
    });

    return { status: "completed", events: eventResult.upserted, tickets: ticketResult.upserted };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await completeSyncLog(logId, { status: "failed", error_message: message, started_at: startTime });
    throw err;
  }
}
