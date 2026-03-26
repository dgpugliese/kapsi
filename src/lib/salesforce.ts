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
	expires_in: number;
}

let cachedToken: SFToken | null = null;

// Environment config — set once at startup via initSalesforce()
let sfConfig = {
	loginUrl: '',
	clientId: '',
	clientSecret: ''
};

/**
 * Initialize Salesforce config from environment variables.
 * Call this from hooks.server.ts or before any SF calls.
 */
export function initSalesforce(env: Record<string, string | undefined>) {
	sfConfig.loginUrl = env.SF_LOGIN_URL || 'https://test.salesforce.com';
	sfConfig.clientId = env.SF_CLIENT_ID || '';
	sfConfig.clientSecret = env.SF_CLIENT_SECRET || '';
}

/**
 * Fetch a fresh access token using Client Credentials flow.
 */
async function fetchToken(): Promise<SFToken> {
	if (!sfConfig.clientId || !sfConfig.clientSecret) {
		throw new Error('Salesforce not configured — SF_CLIENT_ID and SF_CLIENT_SECRET required');
	}

	const res = await fetch(`${sfConfig.loginUrl}/services/oauth2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: sfConfig.clientId,
			client_secret: sfConfig.clientSecret
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
		{ headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' } }
	);
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`SF query failed (${res.status}): ${body}`);
	}
	const data = await res.json();
	return data.records ?? [];
}

/**
 * Create a Salesforce record via REST API. Returns the new record ID.
 */
export async function sfCreate(sobject: string, fields: Record<string, any>): Promise<string> {
	const token = await getSFToken();
	const res = await fetch(
		`${token.instance_url}/services/data/v62.0/sobjects/${sobject}`,
		{
			method: 'POST',
			headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
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
			headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
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
			headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
			...(body ? { body: JSON.stringify(body) } : {})
		}
	);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`SF Apex REST ${path} failed (${res.status}): ${text}`);
	}
	const contentType = res.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) return res.json();
	return res.text();
}

/**
 * Describe a Salesforce object — returns field metadata (name, type, writable, etc.)
 */
export async function sfDescribe(sobject: string): Promise<any> {
	const token = await getSFToken();
	const res = await fetch(
		`${token.instance_url}/services/data/v62.0/sobjects/${sobject}/describe`,
		{ headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' } }
	);
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`SF describe ${sobject} failed (${res.status}): ${body}`);
	}
	return res.json();
}

/**
 * Look up a Salesforce Contact by email address.
 */
export async function findContactByEmail(email: string): Promise<Record<string, any> | null> {
	const escaped = email.replace(/'/g, "\\'");
	const records = await sfQuery<any>(
		`SELECT
			Id, FirstName, LastName, AccountId, Email, Phone, MobilePhone,
			MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,
			Birthdate, Title,
			FON_Membership_Number__c,
			FON_Member_Status__c,
			FON_Member_Type__c,
			FON_Chapter_Initiation_Name__c,
			FON_Chapter_Name__c,
			FON_Initiation_Date1__c,
			FON_Is_Life_Member__c,
			FON_Life_ID_Number__c,
			FON_Directory_Status__c,
			FON_Employer_Name__c,
			FON_Profession__c,
			FON_Professional_Title__c,
			FON_University_College__c,
			FON_Show_Address__c,
			FON_Show_Email__c,
			FON_Show_Phone__c,
			FON_Facebook__c,
			FON_Instagram__c,
			FON_LinkedIn__c,
			FON_Twitter__c,
			FON_Image_URL__c,
			FON_Outstanding_Debt__c,
			Date_Membership_Expires__c,
			Membership_End_Date__c,
			Chapter_Id__c,
			Province_of_Initiation__c,
			Province_Name__c,
			Year_of_Initiation__c,
			OrderApi__Badges__c
		FROM Contact
		WHERE Email = '${escaped}'
			OR OrderApi__Personal_Email__c = '${escaped}'
			OR OrderApi__Preferred_Email__c = '${escaped}'
		LIMIT 1`
	);
	return records.length > 0 ? records[0] : null;
}
