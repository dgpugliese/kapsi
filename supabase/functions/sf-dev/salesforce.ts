/**
 * Salesforce OAuth 2.0 Client Credentials + full REST API helper for Deno Edge Functions.
 * Extended from sf-sync version with describe, create, update support.
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

/** Execute a SOQL query with queryMore pagination. */
export async function sfQuery<T = Record<string, unknown>>(soql: string): Promise<T[]> {
  const token = await getSFToken();
  let allRecords: T[] = [];
  let nextUrl: string | null = `${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`SF query failed (${res.status}): ${body}`);
    }
    const data = await res.json();
    allRecords = allRecords.concat(data.records ?? []);
    nextUrl = data.nextRecordsUrl ? `${token.instance_url}${data.nextRecordsUrl}` : null;
  }

  return allRecords;
}

/** Describe an object — returns full metadata including fields. */
export async function sfDescribe(sobject: string): Promise<any> {
  const token = await getSFToken();
  const res = await fetch(
    `${token.instance_url}/services/data/v62.0/sobjects/${sobject}/describe`,
    { headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" } }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SF describe ${sobject} failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Create a record. Returns the new record ID. */
export async function sfCreate(sobject: string, fields: Record<string, any>): Promise<string> {
  const token = await getSFToken();
  const res = await fetch(
    `${token.instance_url}/services/data/v62.0/sobjects/${sobject}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SF create ${sobject} failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.id;
}

/** Update a record. */
export async function sfUpdate(sobject: string, id: string, fields: Record<string, any>): Promise<void> {
  const token = await getSFToken();
  const res = await fetch(
    `${token.instance_url}/services/data/v62.0/sobjects/${sobject}/${id}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SF update ${sobject}/${id} failed (${res.status}): ${body}`);
  }
}
