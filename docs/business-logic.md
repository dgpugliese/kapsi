# Business Logic — Kappa Alpha Psi Membership Portal

## 1. Membership Status & Standing

### Status Values
- `active` — In Good Standing (IGS)
- `not_in_good_standing` — Not In Good Standing (NIGS)
- `chapter_invisible` — Chapter Invisible
- `suspended` — Suspended
- `expelled` — Expelled
- `deceased` — Deceased

### Membership Types
- `alumni` — Alumni dues-paying member
- `undergraduate` — Undergraduate member
- `life` — Life Member (permanent, no dues)
- `subscribing_life` — Subscribing Life Member (in progress toward Life)

### NIGS Portal Restrictions
Members not in good standing can only access:
- Dashboard (with warning banner)
- My Info (update profile)
- Pay Grand Chapter Dues
- Events (view only, cannot register)
- Chapter Locator
- Kappa Store
- Documents

Blocked from: Membership Card, Member Directory, Announcements, My Primary Chapter, Chapter Management, Event Registration.

Enforcement: client-side nav hiding + server-side redirect + API-level 403.

---

## 2. Fraternal Year & Dues Cycle

### Fraternal Year
- Runs **October 1 → September 30**
- FY2026 = Oct 1, 2025 → Sep 30, 2026

### Payment Windows
- **Before September 1**: Payment counts toward the **current** fraternal year. Membership expires September 30 of that FY.
- **September 1 – September 30**: Payment counts toward the **next** fraternal year (starting Oct 1).
- **October 1**: Members who have not paid for the prior year become Not In Good Standing.

### Alumni Dues
- Annual payment required (currently $200/year per fiscal_years table)
- On payment: `membership_status` → `active`, `dues_paid_through` → Sep 30 of paid FY
- If unpaid past Sep 30 → automatically set to `not_in_good_standing`

### Life Membership
- No expiration date
- No annual dues
- Permanently In Good Standing
- `is_life_member = true`, `membership_type = 'life'`

### Subscribing Life Membership (SLM)
- 4 annual payments of $1,250
- Payment schedule based on anniversary of first SLM payment (not fraternal year)
- After all 4 payments: automatically converts to Life Member (`is_life_member = true`, `membership_type = 'life'`)
- If 60 days past due on any SLM payment:
  - Automatically reverts to `alumni` dues-paying member
  - All prior SLM payments are forfeited (no refund/credit)
  - `slm_start_date` cleared, `slm_payments_completed` reset to 0
  - All `slm_payments` records marked as `forfeited`
  - If they want SLM again later, they start over from payment 1 of 4

### Undergraduate Dues
- More complex, based on chapter designation
- Logic TBD

### Scheduled Checks
Admin endpoint `POST /api/admin/dues-check` runs:
1. **SLM overdue check**: finds pending SLM payments 60+ days past due, reverts members to alumni
2. **Expired membership check**: finds members with `dues_paid_through < today` and `is_life_member = false`, sets to NIGS

---

## 3. Access Control & Badges

### Global Roles (members.role)
- `member` — default, no special access
- `chapter_officer` — informational only (actual access via badges)
- `province_officer` — informational only
- `national_officer` — full admin access
- `ihq_staff` — full admin access
- `super_admin` — full admin access

### Badge System
Badges are stored in `badges` table with categories: `membership`, `chapter_role`, `province_role`, `national_role`, `recognition`, `program`.

`member_badges` junction table has `chapter_id` and `province_id` columns for scoping.

### Chapter Officer Badges (grant chapter management access)
- Chapter Polemarch
- Chapter Vice Polemarch
- Chapter Keeper of Records
- Chapter Keeper of Records/Exchequer
- Chapter Keeper of Exchequer
- Chapter Strategus
- Chapter Lieutenant Strategus
- Chapter MTA Chairman
- Chapter Historian
- Chapter Reporter
- Chapter Advisor
- Undergraduate Chapter Advisor

### Badge Scoping Rules
- A badge with `chapter_id = X` only grants access to chapter X
- A badge with `province_id = Y` grants access to ALL chapters in province Y
- Global admins bypass all badge checks
- Non-officer badges (e.g., "Chapter Invisible", "Chapter Board Member", "Chapter Guide Right Director") do NOT grant chapter management access

### Permission Matrix

| Action | Required Role |
|--------|--------------|
| View chapter management | Any officer badge for that chapter |
| Add/remove roster members | KOR or global admin |
| Assign officers | Polemarch, Vice Polemarch, or global admin |
| Confirm reports | Polemarch, Vice Polemarch, or global admin |
| Submit reports | KOR, Polemarch, Vice Polemarch, or global admin |
| Sign reports | Any officer with matching badge |
| Mark members financially current (chapter level) | KOE or global admin |
| Create/sign EIC submissions | Any chapter officer |
| Admin dashboard access | national_officer, ihq_staff, super_admin |
| Review/approve chapter reports | national_officer, ihq_staff, super_admin |

### Vice Polemarch
- Has identical permissions to Polemarch (can confirm reports, assign officers, etc.)

### Province Officers
- Province Polemarch, Province Vice Polemarch, Province Keeper of Records, Province Board Member
- Can perform all chapter-level functions for ANY chapter in their province
- Access resolved by joining `chapters.province_id` to badge's `province_id`

---

## 4. Chapter Management Workflows

### Roster Report
1. **KOR** adds/removes members from roster (updates `members.chapter_id`)
2. **KOR** submits roster report → status becomes `submitted` with snapshot of current roster
3. **Polemarch** reviews and confirms → status becomes `confirmed`
4. **Officers sign** the report (Polemarch, VP, KOR, KOE, Strategus)
5. **KOR or Polemarch** submits for Province/IHQ review
6. **IHQ admin** approves or returns the report

Report statuses: `draft` → `confirmed` → `submitted` → `approved` / `returned`

When returned, chapter must re-confirm and re-submit.

### Officer Report
1. **Polemarch** assigns officers to roles (searches chapter roster members who are IGS)
2. **KOR** submits officer report → snapshot of officer assignments
3. **Polemarch** confirms
4. Officers sign
5. Submit for review
6. **On submission**: system automatically creates scoped `member_badges` with correct `chapter_id`, deactivating old badges for that chapter

This is the mechanism that grants chapter management access — the officer report is what creates the badges.

### Event Insurance Checklist (EIC)
- Any chapter officer can create a new EIC submission
- Collects: event type, name, date, time, location, venue info, planner info
- Officers sign based on their badge (Polemarch, VP, KOR, KOE, Advisor)
- Statuses: `draft` → `pending_signatures` → `submitted` → `province_approved`/`province_denied` → `ihq_approved`/`ihq_denied`
- Must be submitted 21 days prior to event

### Financial Status (3 Levels)
- **National Level**: based on `membership_status === 'active'` (paid national dues)
- **Province Level**: TBD (placeholder)
- **Chapter Level**: KOE marks individual members as financially current via `chapter_financial_status` table (per fiscal year)

---

## 5. Event Registration

### Flow
1. Member views event listing (from `sync_events` cache)
2. Views event detail with ticket types (from Salesforce, read-only)
3. Fills registration form (hazing statement, dietary, likeness, elected official) → saved to `registration_form_responses`
4. Selects tickets (one registration + optional a la carte items)
5. For paid events: selects payment method (card/ACH) → Stripe PaymentIntent created → pays
6. Registration saved to `event_registrations` in Supabase
7. Attendee count incremented on `sync_events`

### Restrictions
- NIGS members can view events but cannot register
- API enforces `membership_status === 'active'` check
- Ticket filtering based on member type and badges (from SF)

### Data Storage
- All registrations in Supabase `event_registrations` table
- No Salesforce writes
- Stripe webhook updates `payment_status` on registration records

---

## 6. Dues Payment Flow

### Payment Process
1. Member clicks "Pay Dues" on `/portal/dues`
2. System determines target fiscal year via `getTargetFiscalYear()`
3. Checks if already paid for that FY
4. Creates Supabase order + Stripe PaymentIntent
5. Member pays via Stripe Elements (card or ACH)
6. On success: `processDuesPayment()` handles:
   - Alumni/UG: updates `member_dues`, sets `membership_status = active`, sets `dues_paid_through = Sep 30 of FY`
   - SLM: tracks payment number, schedules next, converts to Life after 4th payment

### Surcharge
- Card payments: 4% surcharge (configurable per fiscal year in `card_surcharge_pct`)
- ACH: no surcharge

---

## 7. Store

### Product Management
- Products stored in `store_products` table
- Admin CRUD at `/admin/store`
- Fields: name, description, category, price, image_url, is_active, is_in_stock, stock_quantity, sort_order, requires_contact
- Categories: pins, membership, accessories, books, other
- Products with no price show "Contact IHQ"
- Out of stock products shown dimmed with badge

### Access
- Store is behind portal login (not public)
- Available to both IGS and NIGS members

---

## 8. Member Directory

### Search
- Full-text search via GIN-indexed `search_vector` on `members` table
- Searches: name, chapter, city, state, profession, employer, university, membership number
- Email search: detected by `@` symbol, uses ILIKE
- Membership number search: detected by pure digits

### Filters
- State (dropdown)
- Membership status (IGS, NIGS, Chapter Invisible)
- Membership type (Alumni, Undergraduate, Life Member)

### Privacy
- Only shows members where `show_in_directory = true`
- Email/phone only shown if member has opted in (`show_email`, `show_phone`)

### Access
- IGS members only (NIGS members blocked)

---

## 9. Salesforce Integration

### Read-Only
Salesforce is used strictly as a data source — NO writes back to SF from the portal.

### What We Read from SF
- Chapter roster (Contact records by AccountId)
- Officer badges (OrderApi__Badge__c)
- Account officer name fields
- Ticket types for events (EventApi__Ticket_Type__c)
- Chapter data via sync endpoints

### What Lives in Supabase
- All member data (synced from SF, managed locally)
- All payment/order records
- Event registrations
- Chapter reports, signatures
- EIC submissions
- Officer badge assignments (for portal access)
- Store products
- Financial status tracking

---

## 10. Data Sync

### SF → Supabase (Pull Only)
- **Members**: synced via edge function `handler-contacts.ts`
- **Chapters**: synced via `/api/admin/sync-chapters` + edge function `handler-chapters.ts`
- **Events**: synced via edge function `handler-events.ts` to `sync_events`
- **Ticket types**: synced to `sync_ticket_types`

### Key Sync Notes
- `directory_chapters` table is separate from `chapters` — used for public chapter locator only
- `university` field on members was storing SF lookup IDs — backfill endpoint resolves to names
- Sync does NOT write back to SF
