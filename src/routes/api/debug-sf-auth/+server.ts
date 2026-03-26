import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	// Access env vars the same way hooks.server.ts does
	const env = (platform as any)?.env ?? {};

	const loginUrl = env.SF_LOGIN_URL || 'NOT SET';
	const clientId = env.SF_CLIENT_ID || 'NOT SET';
	const clientSecret = env.SF_CLIENT_SECRET || 'NOT SET';

	// Show partial values for debugging (first 8 chars + length)
	const mask = (val: string) => {
		if (val === 'NOT SET') return val;
		if (val.length < 10) return `[${val.length} chars]`;
		return `${val.substring(0, 8)}...  [${val.length} chars]`;
	};

	// Try the actual auth request and capture the raw response
	let authResult: any = null;
	try {
		const tokenUrl = `${env.SF_LOGIN_URL || 'https://test.salesforce.com'}/services/oauth2/token`;
		const body = new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: env.SF_CLIENT_ID || '',
			client_secret: env.SF_CLIENT_SECRET || ''
		});

		const res = await fetch(tokenUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body
		});

		authResult = {
			status: res.status,
			response: await res.text(),
			url: tokenUrl,
			bodyParams: {
				grant_type: 'client_credentials',
				client_id: mask(env.SF_CLIENT_ID || ''),
				client_secret: mask(env.SF_CLIENT_SECRET || '')
			}
		};
	} catch (err: any) {
		authResult = { error: err.message };
	}

	return json({
		env: {
			SF_LOGIN_URL: mask(loginUrl),
			SF_CLIENT_ID: mask(clientId),
			SF_CLIENT_SECRET: mask(clientSecret),
			SF_GATEWAY_ID: mask(env.SF_GATEWAY_ID || 'NOT SET')
		},
		authResult
	});
};
