/**
 * Salesforce OAuth 2.0 Client Credentials + REST API helper for Deno Edge Functions.
 * Ported from src/lib/salesforce.ts — uses Deno.env instead of SvelteKit env.
 */

interface SFToken {
  access_token: string;
  instance_url: string;
  issued_at: number;
  expires_in: number;
}

let cachedToken: SFToken | null = null;

function getConfig() {
  return {
    loginUrl: Deno.env.get("SF_LOGIN_URL") || "https://test.salesforce.com",
    clientId: Deno.env.get("SF_CLIENT_ID") || "",
    clientSecret: Deno.env.get("SF_CLIENT_SECRET") || "",
  };
}

async function fetchToken(): Promise<SFToken> {
  const config = getConfig();
  if (!config.clientId || !config.clientSecret) {
    throw new Error("SF_CLIENT_ID and SF_CLIENT_SECRET required");
  }

  const res = await fetch(`${config.loginUrl}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SF auth failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    instance_url: data.instance_url,
    issued_at: Date.now(),
    expires_in: data.expires_in ?? 7200,
  };
}

export async function getSFToken(): Promise<SFToken> {
  if (cachedToken) {
    const elapsed = (Date.now() - cachedToken.issued_at) / 1000;
    if (elapsed < cachedToken.expires_in - 300) {
      return cachedToken;
    }
  }
  cachedToken = await fetchToken();
  return cachedToken;
}

/**
 * Execute a SOQL query. Returns all records, following queryMore pagination.
 */
export async function sfQuery<T = Record<string, unknown>>(
  soql: string
): Promise<T[]> {
  const token = await getSFToken();
  const url = `${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`;

  let allRecords: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`SF query failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    allRecords = allRecords.concat(data.records ?? []);

    // Follow queryMore URL for next batch
    if (data.nextRecordsUrl) {
      nextUrl = `${token.instance_url}${data.nextRecordsUrl}`;
    } else {
      nextUrl = null;
    }
  }

  return allRecords;
}

/**
 * Execute a SOQL query with a callback per batch (for large datasets).
 * Uses Salesforce queryMore pagination (2,000 records per batch).
 * Returns total record count.
 */
export async function sfQueryBatched(
  soql: string,
  onBatch: (records: Record<string, unknown>[], batchIndex: number) => Promise<void>
): Promise<number> {
  const token = await getSFToken();
  const url = `${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`;

  let nextUrl: string | null = url;
  let totalRecords = 0;
  let batchIndex = 0;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`SF query failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    const records = data.records ?? [];
    totalRecords += records.length;

    if (records.length > 0) {
      await onBatch(records, batchIndex);
      batchIndex++;
    }

    nextUrl = data.nextRecordsUrl
      ? `${token.instance_url}${data.nextRecordsUrl}`
      : null;
  }

  return totalRecords;
}
