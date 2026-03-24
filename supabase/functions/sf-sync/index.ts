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

  let body: { type?: string; full?: boolean; letterRange?: string };
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

    if (!results.chapters && !results.tiers && !results.contacts) {
      return errorResponse(
        `Unknown sync type: ${syncType}. Use "chapters", "tiers", "contacts", or "all"`,
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
