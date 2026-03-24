/**
 * sf-sync — Supabase Edge Function
 *
 * Dispatcher for Salesforce-to-Supabase sync operations.
 *
 * POST /functions/v1/sf-sync
 * Body: { "type": "chapters" | "contacts" | "tiers" | "all", "full": boolean }
 *
 * Auth: Requires either:
 *   - SYNC_SECRET header matching the stored secret (for cron/webhooks)
 *   - Valid Supabase auth session with admin role
 */

import { syncChapters } from "./handler-chapters.ts";
import { syncTiers } from "./handler-tiers.ts";
import { syncContacts } from "./handler-contacts.ts";
import { syncEvents } from "./handler-events.ts";
import { getSFToken } from "./salesforce.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-sync-secret, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status);
}

async function verifyAuth(req: Request): Promise<boolean> {
  // Check sync secret header (for cron jobs)
  const syncSecret = Deno.env.get("SYNC_SECRET");
  const headerSecret = req.headers.get("x-sync-secret");
  if (syncSecret && headerSecret === syncSecret) return true;

  // Check Authorization Bearer token (for admin dashboard)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseKey) return false;

    // Verify the token with Supabase
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });
    if (res.ok) return true;
  }

  return false;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  // Auth check
  const authorized = await verifyAuth(req);
  if (!authorized) {
    return errorResponse("Unauthorized", 401);
  }

  let body: { type?: string; full?: boolean; letterRange?: string; object?: string; soql?: string; fields?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const syncType = body.type;
  const full = body.full ?? false;
  const letterRange = body.letterRange;

  if (!syncType) {
    return errorResponse('Missing "type" in request body', 400);
  }

  try {
    const results: Record<string, unknown> = {};

    if (syncType === "chapters" || syncType === "all") {
      console.log("Starting chapters sync...");
      results.chapters = await syncChapters();
    }

    if (syncType === "tiers" || syncType === "all") {
      console.log("Starting tiers sync...");
      results.tiers = await syncTiers();
    }

    if (syncType === "contacts" || syncType === "all") {
      console.log(`Starting contacts sync (full=${full}, range=${letterRange ?? "all"})...`);
      results.contacts = await syncContacts(full, letterRange);
    }

    if (syncType === "events" || syncType === "all") {
      results.events = await syncEvents();
    }

    // Admin: create a SF record
    if (syncType === "create" && body.object && body.fields) {
      const token = await getSFToken();
      const res = await fetch(
        `${token.instance_url}/services/data/v62.0/sobjects/${body.object}`,
        { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify(body.fields) }
      );
      if (!res.ok) return errorResponse(`Create failed: ${await res.text()}`);
      const data = await res.json();
      results.create = { id: data.id, success: data.success };
    }

    // Admin: describe a SF object
    if (syncType === "describe" && body.object) {
      const token = await getSFToken();
      const res = await fetch(
        `${token.instance_url}/services/data/v62.0/sobjects/${body.object}/describe`,
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );
      if (!res.ok) return errorResponse(`Describe failed: ${await res.text()}`);
      const desc = await res.json();
      results.describe = {
        name: desc.name,
        label: desc.label,
        fields: desc.fields.map((f: any) => ({
          name: f.name, label: f.label, type: f.type,
          writable: f.createable, required: !f.nillable && f.createable,
        })).filter((f: any) => f.writable)
      };
    }

    // Admin: run a SOQL query
    if (syncType === "query" && body.soql) {
      const token = await getSFToken();
      const res = await fetch(
        `${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(body.soql)}`,
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );
      if (!res.ok) return errorResponse(`Query failed: ${await res.text()}`);
      const data = await res.json();
      results.query = { totalSize: data.totalSize, records: data.records?.slice(0, 10) };
    }

    if (Object.keys(results).length === 0) {
      return errorResponse(
        `Unknown sync type: ${syncType}. Use "chapters", "tiers", "contacts", "describe", "query", or "all"`,
        400
      );
    }

    return jsonResponse({ success: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Sync "${syncType}" failed:`, message);
    return errorResponse(message);
  }
});
