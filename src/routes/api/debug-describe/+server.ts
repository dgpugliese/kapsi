import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sfDescribe, sfQuery } from '$lib/salesforce';
import { env } from '$env/dynamic/private';

/**
 * GET /api/debug-describe?object=OrderApi__EPayment__c
 * Describes a Salesforce object's fields — shows which are writable,
 * their types, and picklist values. Also optionally fetches a recent
 * record to show current field values.
 *
 * Query params:
 *   object  — SF object API name (default: OrderApi__EPayment__c)
 *   sample  — if "true", fetch a recent record for comparison
 *   pi      — Stripe PaymentIntent ID to retrieve details from Stripe
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Unauthorized');

	const sobject = url.searchParams.get('object') || 'OrderApi__EPayment__c';
	const wantSample = url.searchParams.get('sample') === 'true';
	const paymentIntentId = url.searchParams.get('pi');

	try {
		const describe = await sfDescribe(sobject);

		// Categorize fields
		const fields = describe.fields.map((f: any) => ({
			name: f.name,
			label: f.label,
			type: f.type,
			writable: f.createable,
			updatable: f.updateable,
			nillable: f.nillable,
			defaultValue: f.defaultValue,
			calculated: f.calculated,
			autoNumber: f.autoNumber,
			...(f.type === 'picklist' || f.type === 'multipicklist'
				? { picklistValues: f.picklistValues?.filter((v: any) => v.active).map((v: any) => v.value) }
				: {}),
			...(f.referenceTo?.length ? { referenceTo: f.referenceTo } : {})
		}));

		const writableFields = fields.filter((f: any) => f.writable);
		const readOnlyFields = fields.filter((f: any) => !f.writable);

		// Optionally fetch a recent record
		let sampleRecord = null;
		if (wantSample) {
			const fieldNames = writableFields.map((f: any) => f.name).join(', ');
			const records = await sfQuery<any>(
				`SELECT Id, ${fieldNames} FROM ${sobject} ORDER BY CreatedDate DESC LIMIT 1`
			);
			sampleRecord = records.length > 0 ? records[0] : null;
		}

		// Optionally retrieve Stripe PaymentIntent
		let stripePaymentIntent = null;
		if (paymentIntentId) {
			const stripeKey = env.STRIPE_SECRET_KEY;
			if (stripeKey) {
				const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
					headers: { 'Authorization': `Bearer ${stripeKey}` }
				});
				if (res.ok) {
					const pi = await res.json();
					// Extract the useful bits
					const charge = pi.latest_charge;
					stripePaymentIntent = {
						id: pi.id,
						status: pi.status,
						amount: pi.amount,
						currency: pi.currency,
						paymentMethod: pi.payment_method,
						metadata: pi.metadata,
						chargeId: typeof charge === 'string' ? charge : charge?.id
					};

					// If there's a charge, get card details
					if (stripePaymentIntent.chargeId && stripeKey) {
						const chargeRes = await fetch(
							`https://api.stripe.com/v1/charges/${stripePaymentIntent.chargeId}`,
							{ headers: { 'Authorization': `Bearer ${stripeKey}` } }
						);
						if (chargeRes.ok) {
							const chargeData = await chargeRes.json();
							stripePaymentIntent.cardDetails = {
								brand: chargeData.payment_method_details?.card?.brand,
								last4: chargeData.payment_method_details?.card?.last4,
								expMonth: chargeData.payment_method_details?.card?.exp_month,
								expYear: chargeData.payment_method_details?.card?.exp_year,
								funding: chargeData.payment_method_details?.card?.funding,
								network: chargeData.payment_method_details?.card?.network,
								type: chargeData.payment_method_details?.type
							};
						}
					}
				}
			}
		}

		return json({
			object: sobject,
			totalFields: fields.length,
			writableCount: writableFields.length,
			readOnlyCount: readOnlyFields.length,
			writableFields,
			readOnlyFields,
			...(sampleRecord ? { sampleRecord } : {}),
			...(stripePaymentIntent ? { stripePaymentIntent } : {})
		});
	} catch (err: any) {
		console.error('Debug describe error:', err);
		throw error(500, err.message);
	}
};
