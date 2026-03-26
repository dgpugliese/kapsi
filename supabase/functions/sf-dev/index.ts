/**
 * sf-dev — Supabase Edge Function for Salesforce development
 *
 * General-purpose SF query tool for development and exploration.
 * Supports: query, describe, create, update, delete, search, global describe
 *
 * POST /functions/v1/sf-dev
 * Body: { "action": "query" | "describe" | "create" | "update" | "delete" | "search" | "objects", ... }
 *
 * Auth: Requires SYNC_SECRET header or valid Supabase admin session.
 */

import { getSFToken, sfQuery, sfDescribe, sfCreate, sfUpdate } from "./salesforce.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-sync-secret, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyAuth(req: Request): Promise<boolean> {
  const syncSecret = Deno.env.get("SYNC_SECRET");
  const headerSecret = req.headers.get("x-sync-secret");
  if (syncSecret && headerSecret === syncSecret) return true;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseKey) return false;

    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey },
    });
    if (res.ok) {
      const user = await res.json();
      return user?.role === "authenticated";
    }
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "POST required" }, 405);
  }

  if (!(await verifyAuth(req))) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await req.json();
    const action = body.action;

    switch (action) {
      // Run a SOQL query
      case "query": {
        if (!body.soql) return jsonResponse({ error: "soql required" }, 400);
        const records = await sfQuery(body.soql);
        return jsonResponse({ totalSize: records.length, records });
      }

      // Describe an object — get all fields, types, picklist values
      case "describe": {
        if (!body.object) return jsonResponse({ error: "object required" }, 400);
        const desc = await sfDescribe(body.object);
        const skip = ["Id", "IsDeleted", "CurrencyIsoCode", "LastActivityDate", "LastViewedDate",
          "LastReferencedDate", "OwnerId", "CreatedById", "CreatedDate", "LastModifiedById",
          "LastModifiedDate", "SystemModstamp"];
        const fields = desc.fields
          .filter((f: any) => !skip.includes(f.name))
          .map((f: any) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            updateable: f.updateable,
            createable: f.createable,
            referenceTo: f.referenceTo?.length > 0 ? f.referenceTo : undefined,
            picklistValues: f.picklistValues?.length > 0
              ? f.picklistValues.filter((p: any) => p.active).map((p: any) => p.value)
              : undefined,
          }));
        return jsonResponse({
          object: body.object,
          label: desc.label,
          fieldCount: fields.length,
          fields,
        });
      }

      // List all SF objects (global describe) — optionally filter by keyword
      case "objects": {
        const token = await getSFToken();
        const res = await fetch(
          `${token.instance_url}/services/data/v62.0/sobjects`,
          { headers: { Authorization: `Bearer ${token.access_token}` } }
        );
        const data = await res.json();

        let objects = data.sobjects.map((o: any) => ({
          name: o.name,
          label: o.label,
          custom: o.custom,
          queryable: o.queryable,
        }));

        if (body.filter) {
          const f = body.filter.toLowerCase();
          objects = objects.filter(
            (o: any) => o.name.toLowerCase().includes(f) || o.label.toLowerCase().includes(f)
          );
        }

        return jsonResponse({ count: objects.length, objects });
      }

      // Search across objects using SOSL
      case "search": {
        if (!body.term) return jsonResponse({ error: "term required" }, 400);
        const token = await getSFToken();
        const sosl = `FIND {${body.term}} IN ALL FIELDS RETURNING ${body.objects || "Contact(Id, Name), Account(Id, Name)"} LIMIT ${body.limit || 20}`;
        const res = await fetch(
          `${token.instance_url}/services/data/v62.0/search/?q=${encodeURIComponent(sosl)}`,
          { headers: { Authorization: `Bearer ${token.access_token}` } }
        );
        if (!res.ok) {
          const err = await res.text();
          return jsonResponse({ error: err }, res.status);
        }
        return jsonResponse(await res.json());
      }

      // Create a record
      case "create": {
        if (!body.object || !body.fields) {
          return jsonResponse({ error: "object and fields required" }, 400);
        }
        const id = await sfCreate(body.object, body.fields);
        return jsonResponse({ success: true, id });
      }

      // Update a record
      case "update": {
        if (!body.object || !body.id || !body.fields) {
          return jsonResponse({ error: "object, id, and fields required" }, 400);
        }
        await sfUpdate(body.object, body.id, body.fields);
        return jsonResponse({ success: true });
      }

      // Delete a record
      case "delete": {
        if (!body.object || !body.id) {
          return jsonResponse({ error: "object and id required" }, 400);
        }
        const token2 = await getSFToken();
        const delRes = await fetch(
          `${token2.instance_url}/services/data/v62.0/sobjects/${body.object}/${body.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token2.access_token}` },
          }
        );
        if (!delRes.ok) {
          const err = await delRes.text();
          return jsonResponse({ error: err }, delRes.status);
        }
        return jsonResponse({ success: true, deleted: body.id });
      }

      // Get record by ID
      case "get": {
        if (!body.object || !body.id) {
          return jsonResponse({ error: "object and id required" }, 400);
        }
        const token3 = await getSFToken();
        const getRes = await fetch(
          `${token3.instance_url}/services/data/v62.0/sobjects/${body.object}/${body.id}`,
          { headers: { Authorization: `Bearer ${token3.access_token}` } }
        );
        if (!getRes.ok) {
          const err = await getRes.text();
          return jsonResponse({ error: err }, getRes.status);
        }
        return jsonResponse(await getRes.json());
      }

      // Get API limits
      case "limits": {
        const token4 = await getSFToken();
        const limRes = await fetch(
          `${token4.instance_url}/services/data/v62.0/limits`,
          { headers: { Authorization: `Bearer ${token4.access_token}` } }
        );
        return jsonResponse(await limRes.json());
      }

      default:
        return jsonResponse({
          error: "Unknown action",
          available: [
            "query    — { soql: 'SELECT ...' }",
            "describe — { object: 'Contact' }",
            "objects  — { filter: 'ticket' }  (optional keyword filter)",
            "search   — { term: 'John', objects: 'Contact(Id,Name)' }",
            "create   — { object: 'Account', fields: { Name: 'Test' } }",
            "update   — { object: 'Contact', id: '003...', fields: { Phone: '555' } }",
            "delete   — { object: 'Account', id: '001...' }",
            "get      — { object: 'Contact', id: '003...' }",
            "limits   — {} (API usage limits)",
          ],
        }, 400);
    }
  } catch (err: any) {
    return jsonResponse({ error: err.message || String(err) }, 500);
  }
});
