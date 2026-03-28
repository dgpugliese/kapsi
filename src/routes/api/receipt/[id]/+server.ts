import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();
	if (!session || !user) throw error(401, 'Not authenticated');

	const { id } = params;

	// Load the order with line items and member
	const { data: order } = await locals.supabase
		.from('orders')
		.select('*, order_lines(*), members:member_id(first_name, last_name, email, membership_number, address_line1, address_line2, city, state, zip)')
		.eq('id', id)
		.single();

	if (!order) throw error(404, 'Order not found');

	// Verify access: must be the member OR an admin
	const { data: caller } = await locals.supabase
		.from('members')
		.select('id, role')
		.eq('auth_user_id', user.id)
		.single();

	const isAdmin = caller && ['super_admin', 'ihq_staff', 'national_officer'].includes(caller.role);
	const isOwner = caller && caller.id === order.member_id;

	if (!isAdmin && !isOwner) throw error(403, 'Access denied');

	const member = order.members;
	const lines = order.order_lines ?? [];
	const orderNum = order.order_number || order.id.slice(0, 8).toUpperCase();
	const paidDate = order.paid_at ? new Date(order.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending';
	const createdDate = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Receipt ${orderNum}</title>
<style>
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 700px; margin: 0 auto; }
	.header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #8b0000; }
	.org-name { font-size: 18px; font-weight: 700; color: #8b0000; }
	.org-sub { font-size: 11px; color: #888; margin-top: 2px; }
	.receipt-label { font-size: 28px; font-weight: 700; color: #8b0000; text-align: right; }
	.receipt-num { font-size: 12px; color: #888; text-align: right; margin-top: 4px; }
	.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
	.info-block h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
	.info-block p { font-size: 13px; line-height: 1.6; }
	table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
	th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #fff; background: #8b0000; padding: 10px 14px; }
	td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
	.total-row td { font-weight: 700; font-size: 15px; border-top: 2px solid #8b0000; border-bottom: none; }
	.status { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; }
	.status--paid { background: #ecfdf5; color: #065f46; }
	.status--pending { background: #fef3c7; color: #92400e; }
	.status--refunded { background: #fef2f2; color: #991b1b; }
	.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
	@media print { body { padding: 20px; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="no-print" style="text-align:right; margin-bottom:20px;">
	<button onclick="window.print()" style="padding:8px 20px; background:#8b0000; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;">Print / Save PDF</button>
</div>

<div class="header">
	<div>
		<div class="org-name">Kappa Alpha Psi Fraternity, Inc.</div>
		<div class="org-sub">International Headquarters &middot; Philadelphia, PA</div>
	</div>
	<div>
		<div class="receipt-label">RECEIPT</div>
		<div class="receipt-num">#${orderNum}</div>
	</div>
</div>

<div class="info-grid">
	<div class="info-block">
		<h3>Billed To</h3>
		<p>
			<strong>${member?.first_name || ''} ${member?.last_name || ''}</strong><br>
			${member?.email || ''}<br>
			${member?.membership_number ? `Member #${member.membership_number}` : ''}
			${member?.address_line1 ? `<br>${member.address_line1}` : ''}
			${member?.city ? `<br>${member.city}, ${member.state || ''} ${member.zip || ''}` : ''}
		</p>
	</div>
	<div class="info-block">
		<h3>Payment Details</h3>
		<p>
			<strong>Date:</strong> ${paidDate}<br>
			<strong>Method:</strong> ${(order.payment_method || 'N/A').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
			${order.card_brand ? `<br><strong>Card:</strong> ${order.card_brand} ending ${order.card_last4}` : ''}
			<br><strong>Status:</strong> <span class="status status--${order.status}">${(order.status || 'pending').toUpperCase()}</span>
		</p>
	</div>
</div>

<table>
	<thead><tr><th>Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th><th style="text-align:right;">Total</th></tr></thead>
	<tbody>
		${lines.map((l: any) => `
		<tr>
			<td>${l.name}</td>
			<td style="text-align:center;">${l.quantity}</td>
			<td style="text-align:right;">$${Number(l.unit_price).toFixed(2)}</td>
			<td style="text-align:right;">$${Number(l.total).toFixed(2)}</td>
		</tr>`).join('')}
		${order.surcharge && Number(order.surcharge) > 0 ? `
		<tr>
			<td>Processing Fee</td>
			<td style="text-align:center;">1</td>
			<td style="text-align:right;">$${Number(order.surcharge).toFixed(2)}</td>
			<td style="text-align:right;">$${Number(order.surcharge).toFixed(2)}</td>
		</tr>` : ''}
		<tr class="total-row">
			<td colspan="3" style="text-align:right;">Total</td>
			<td style="text-align:right;">$${Number(order.total).toFixed(2)}</td>
		</tr>
	</tbody>
</table>

${order.notes ? `<p style="font-size:12px; color:#666; margin-bottom:20px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}

<div class="footer">
	<p>Kappa Alpha Psi Fraternity, Inc. &middot; 2322-24 N. Broad Street &middot; Philadelphia, PA 19132</p>
	<p style="margin-top:4px;">This receipt was generated electronically. No signature required.</p>
</div>
</body>
</html>`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html; charset=utf-8' }
	});
};
