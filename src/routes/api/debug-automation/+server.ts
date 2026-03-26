import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSFToken } from '$lib/salesforce';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const token = await getSFToken();
		const obj = url.searchParams.get('obj') || 'OrderApi__EPayment__c';

		// Query Apex Triggers
		let triggers: any[] = [];
		try {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Name, TableEnumOrId, Body, Status FROM ApexTrigger WHERE TableEnumOrId = '${obj}' AND Status = 'Active'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (res.ok) {
				const data = await res.json();
				triggers = (data.records || []).map((t: any) => ({
					name: t.Name,
					object: t.TableEnumOrId,
					status: t.Status,
					bodyPreview: t.Body?.substring(0, 500)
				}));
			}
		} catch (e: any) { triggers = [{ error: e.message }]; }

		// Query Workflow Rules
		let workflows: any[] = [];
		try {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Name, TableEnumOrId FROM WorkflowRule WHERE TableEnumOrId = '${obj}'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (res.ok) {
				const data = await res.json();
				workflows = (data.records || []).map((w: any) => ({ name: w.Name, object: w.TableEnumOrId }));
			}
		} catch (e: any) { workflows = [{ error: e.message }]; }

		// Query Process Builder / Flows
		let flows: any[] = [];
		try {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, Definition.DeveloperName, Status, ProcessType, TriggerType, TriggerObjectOrEventLabel FROM Flow WHERE Status = 'Active' AND TriggerObjectOrEventLabel != null`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (res.ok) {
				const data = await res.json();
				flows = (data.records || [])
					.filter((f: any) => {
						const label = (f.TriggerObjectOrEventLabel || '').toLowerCase();
						const search = obj.toLowerCase().replace('__c', '');
						return label.includes('epayment') || label.includes('receipt') ||
						       label.includes('sales_order') || label.includes('sales order') ||
						       label.includes(search);
					})
					.map((f: any) => ({
						name: f.Definition?.DeveloperName,
						status: f.Status,
						processType: f.ProcessType,
						triggerType: f.TriggerType,
						triggerObject: f.TriggerObjectOrEventLabel
					}));
			}
		} catch (e: any) { flows = [{ error: e.message }]; }

		// Query Validation Rules
		let validationRules: any[] = [];
		try {
			const res = await fetch(
				`${token.instance_url}/services/data/v62.0/tooling/query?q=${encodeURIComponent(
					`SELECT Id, ValidationName, Active, ErrorMessage, EntityDefinition.QualifiedApiName FROM ValidationRule WHERE Active = true AND EntityDefinition.QualifiedApiName = '${obj}'`
				)}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			if (res.ok) {
				const data = await res.json();
				validationRules = (data.records || []).map((v: any) => ({
					name: v.ValidationName,
					errorMessage: v.ErrorMessage,
					object: v.EntityDefinition?.QualifiedApiName
				}));
			}
		} catch (e: any) { validationRules = [{ error: e.message }]; }

		return json({
			object: obj,
			triggers,
			workflows,
			flows,
			validationRules
		});
	} catch (err: any) {
		return json({ error: err.message }, { status: 500 });
	}
};
