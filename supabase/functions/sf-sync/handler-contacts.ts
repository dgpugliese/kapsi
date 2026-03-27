/**
 * Contacts sync handler — fetches member contacts from Salesforce
 * and upserts into directory_contacts.
 *
 * Supports full sync (all ~150K) and delta sync (modified since yesterday).
 * Uses sfQueryBatched with queryMore pagination to handle large datasets
 * within Edge Function timeout limits.
 */

import { sfQueryBatched } from "./salesforce.ts";
import { batchUpsert } from "./supabase-admin.ts";
import { createSyncLog, completeSyncLog, updateSyncLog } from "./logger.ts";

function transformContact(c: Record<string, unknown>) {
  return {
    sf_contact_id: c.Id,
    first_name: c.FirstName || "",
    last_name: c.LastName || "",
    email: c.Email,
    phone: c.Phone,
    mobile_phone: c.MobilePhone,
    mailing_city: c.MailingCity,
    mailing_state: c.MailingState,
    mailing_postal_code: c.MailingPostalCode,
    mailing_country: c.MailingCountry,
    membership_number: c.FON_Membership_Number__c,
    member_status: c.FON_Member_Status__c,
    member_type: c.FON_Member_Type__c,
    directory_status: c.FON_Directory_Status__c,
    chapter_name: c.FON_Chapter_Name__c,
    chapter_id: c.Chapter_Id__c,
    chapter_of_initiation: c.FON_Chapter_Initiation_Name__c,
    initiation_date: c.FON_Initiation_Date1__c,
    year_of_initiation: c.Year_of_Initiation__c,
    province: c.Province_Name__c,
    province_of_initiation: c.Province_of_Initiation__c,
    is_life_member: c.FON_Is_Life_Member__c === true,
    employer: c.FON_Employer_Name__c,
    profession: c.FON_Profession__c,
    professional_title: c.FON_Professional_Title__c,
    university: c.FON_University_College__r?.Name || null,
    photo_url: c.FON_Public_Image_Url__c || c.FON_Image_URL__c,
    badges: c.OrderApi__Badges__c,
    show_email: c.FON_Show_Email__c !== false,
    show_phone: c.FON_Show_Phone__c !== false,
    show_address: c.FON_Show_Address__c !== false,
    last_synced_at: new Date().toISOString(),
  };
}

const CONTACT_FIELDS = `
  Id, FirstName, LastName, Email, Phone, MobilePhone,
  MailingCity, MailingState, MailingPostalCode, MailingCountry,
  FON_Membership_Number__c, FON_Member_Status__c, FON_Member_Type__c,
  FON_Directory_Status__c, FON_Chapter_Name__c, Chapter_Id__c,
  FON_Chapter_Initiation_Name__c, FON_Initiation_Date1__c,
  Year_of_Initiation__c, Province_Name__c, Province_of_Initiation__c,
  FON_Is_Life_Member__c, FON_Employer_Name__c, FON_Profession__c,
  FON_Professional_Title__c, FON_University_College__r.Name,
  FON_Image_URL__c, FON_Public_Image_Url__c,
  OrderApi__Badges__c,
  FON_Show_Email__c, FON_Show_Phone__c, FON_Show_Address__c
`;

/**
 * For full syncs, pass a letter range (e.g. "A-F") to chunk the work
 * across multiple invocations. Delta syncs don't need this.
 */
export async function syncContacts(
  full = false,
  letterRange?: string
): Promise<{
  status: string;
  records: number;
}> {
  const label = full
    ? `contacts-full${letterRange ? `-${letterRange}` : ""}`
    : "contacts-delta";
  const logId = await createSyncLog(label);
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalUpserted = 0;
  let totalFailed = 0;

  try {
    let whereClause =
      "WHERE FON_Membership_Number__c != null AND FON_Chapter_Initiation_Name__c != null AND Year_of_Initiation__c != null";

    if (!full) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      whereClause += ` AND LastModifiedDate >= ${yesterday}`;
    }

    // Letter range filter for chunked full syncs (e.g. "A-F", "G-M", "N-S", "T-Z")
    if (letterRange && full) {
      const [start, end] = letterRange.split("-");
      if (start && end) {
        // LastName >= 'A' AND LastName < chr(ord('F')+1) = 'G'
        const endNext = String.fromCharCode(end.charCodeAt(0) + 1);
        whereClause += ` AND LastName >= '${start}' AND LastName < '${endNext}'`;
      }
    }

    const soql = `
      SELECT ${CONTACT_FIELDS}
      FROM Contact
      ${whereClause}
      ORDER BY LastName ASC
    `;

    totalProcessed = await sfQueryBatched(soql, async (records, batchIndex) => {
      const rows = records.map(transformContact);
      const { upserted, failed } = await batchUpsert(
        "directory_contacts",
        rows,
        "sf_contact_id"
      );
      totalUpserted += upserted;
      totalFailed += failed;

      // Update progress every batch
      if (batchIndex % 5 === 0) {
        await updateSyncLog(logId, {
          records_processed: totalProcessed + records.length,
          records_upserted: totalUpserted,
        });
      }
    });

    const status = totalFailed > 0 ? "partial" : "completed";
    await completeSyncLog(logId, {
      status,
      records_processed: totalProcessed,
      records_upserted: totalUpserted,
      records_failed: totalFailed,
      started_at: startTime,
    });

    return { status, records: totalUpserted };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await completeSyncLog(logId, {
      status: "failed",
      records_processed: totalProcessed,
      records_upserted: totalUpserted,
      records_failed: totalFailed,
      error_message: message,
      started_at: startTime,
    });
    throw err;
  }
}
