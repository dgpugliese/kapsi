/**
 * Salesforce OAuth 2.0 Client Credentials Flow + REST API helper
 *
 * Uses the integration user's connected app to authenticate.
 * Token is cached in-memory and refreshed before expiry.
 * Compatible with Cloudflare Workers (no Node.js APIs).
 */

interface SFToken {
	access_token: string;
	instance_url: string;
	issued_at: number;
	expires_in: number; // we'll default to 7200s (2h) if not returned
}

let cachedToken: SFToken | null = null;

function getEnv(key: string): string {
	// Cloudflare Workers: globalThis has env bindings at runtime
	// Local dev: process.env
	const val =
		(globalThis as any).__env?.[key] ??
		(typeof process !== 'undefined' ? process.env?.[key] : undefined) ??
		'';
	return val;
}

/**
 * Fetch a fresh access token using Client Credentials flow.
 */
async function fetchToken(): Promise<SFToken> {
	const loginUrl = getEnv('SF_LOGIN_URL') || 'https://test.salesforce.com';
	const clientId = getEnv('SF_CLIENT_ID');
	const clientSecret = getEnv('SF_CLIENT_SECRET');

	if (!clientId || !clientSecret) {
		throw new Error('SF_CLIENT_ID and SF_CLIENT_SECRET must be set');
	}

	const res = await fetch(`${loginUrl}/services/oauth2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret
		})
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Salesforce auth failed (${res.status}): ${body}`);
	}

	const data = await res.json();

	return {
		access_token: data.access_token,
		instance_url: data.instance_url,
		issued_at: Date.now(),
		expires_in: data.expires_in ?? 7200
	};
}

/**
 * Get a valid Salesforce access token, refreshing if expired.
 */
export async function getSFToken(): Promise<SFToken> {
	if (cachedToken) {
		const elapsed = (Date.now() - cachedToken.issued_at) / 1000;
		// Refresh 5 minutes before expiry
		if (elapsed < cachedToken.expires_in - 300) {
			return cachedToken;
		}
	}

	cachedToken = await fetchToken();
	return cachedToken;
}

/**
 * Execute a SOQL query against Salesforce REST API.
 */
export async function sfQuery<T = any>(soql: string): Promise<T[]> {
	const token = await getSFToken();

	const res = await fetch(
		`${token.instance_url}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`,
		{
			headers: {
				Authorization: `Bearer ${token.access_token}`,
				'Content-Type': 'application/json'
			}
		}
	);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`SF query failed (${res.status}): ${body}`);
	}

	const data = await res.json();
	return data.records ?? [];
}

/**
 * Create a Salesforce record via REST API.
 * Returns the new record ID.
 */
export async function sfCreate(sobject: string, fields: Record<string, any>): Promise<string> {
	const token = await getSFToken();

	const res = await fetch(
		`${token.instance_url}/services/data/v62.0/sobjects/${sobject}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fields)
		}
	);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`SF create ${sobject} failed (${res.status}): ${body}`);
	}

	const data = await res.json();
	return data.id;
}

/**
 * Update a Salesforce record via REST API.
 */
export async function sfUpdate(sobject: string, id: string, fields: Record<string, any>): Promise<void> {
	const token = await getSFToken();

	const res = await fetch(
		`${token.instance_url}/services/data/v62.0/sobjects/${sobject}/${id}`,
		{
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fields)
		}
	);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`SF update ${sobject}/${id} failed (${res.status}): ${body}`);
	}
}

/**
 * Call an Apex REST endpoint.
 */
export async function sfApexRest(path: string, method: string = 'POST', body?: any): Promise<any> {
	const token = await getSFToken();

	const res = await fetch(
		`${token.instance_url}/services/apexrest${path}`,
		{
			method,
			headers: {
				Authorization: `Bearer ${token.access_token}`,
				'Content-Type': 'application/json'
			},
			...(body ? { body: JSON.stringify(body) } : {})
		}
	);

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`SF Apex REST ${path} failed (${res.status}): ${text}`);
	}

	const contentType = res.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		return res.json();
	}
	return res.text();
}

/**
 * Look up a Salesforce Contact by email address.
 * Returns null if not found.
 */
export async function findContactByEmail(email: string): Promise<{
	Id: string;
	FirstName: string;
	LastName: string;
	AccountId: string;
} | null> {
	const escaped = email.replace(/'/g, "\\'");
	const records = await sfQuery<any>(
		`SELECT Id, FirstName, LastName, AccountId FROM Contact WHERE Email = '${escaped}' LIMIT 1`
	);
	return records.length > 0 ? records[0] : null;
}
