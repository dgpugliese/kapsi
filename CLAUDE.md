# Membership Portal – Claude Code Project Prompt

## Project Overview

You are helping build a **headless membership portal** for a large membership organization with ~150,000 members across 770 chapters. The portal is frontend-driven and connects to Salesforce (with Fonteva) as the system of record.

This is an **active, in-progress project in sandbox phase.** Do not suggest starting over or switching to a simpler architecture. Work within the decisions already made.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (headless, component-driven) |
| Backend Middleware | Node.js / Express (or equivalent) |
| Database / Cache | Supabase (selective caching only — NOT a Salesforce replica) |
| CRM / System of Record | Salesforce + Fonteva (ebMS) |
| Auth | OAuth 2.0 Client Credentials via Salesforce Connected App |
| Payments | Stripe.js (frontend token) → Fonteva Order (backend) |
| Mobile Payments Goal | Google Pay / Apple Pay via Stripe |

---

## Authentication Flow

- Auth uses **Client Credentials OAuth flow** via a Salesforce Connected App
- An **integration user** with a dedicated Permission Set handles all API access
- After login, the member's Salesforce **Contact ID** is stored in a **JWT**
- All subsequent API calls use that Contact ID to scope queries

---

## Salesforce / Fonteva Data Model

These are the primary objects in use:

| Object | Purpose |
|---|---|
| `Contact` | Member identity and profile |
| `Account` | Organization / chapter affiliation |
| `ebMS__Membership__c` | Membership record and status |
| `ebSF__Order__c` | Dues / purchase orders |
| `ebSF__Order_Line_Item__c` | Line items on an order |
| `ebSF__Receipt__c` | Payment receipts |

### Dues Payment Flow
1. Frontend collects card info via **Stripe.js** → generates a token (card never touches your server)
2. Backend receives token → creates a **Fonteva Order** via Salesforce REST API
3. Fonteva processes the payment and generates a Receipt record
4. Frontend confirms success and updates member's displayed status

---

## Caching Strategy (Critical)

**Supabase is a cache layer, NOT a replica of Salesforce.**

| Data Type | Source | Rationale |
|---|---|---|
| Chapter list (770 chapters) | Supabase (sync weekly) | Slow-changing, read-heavy |
| Membership tier definitions | Supabase (sync on change) | Reference data |
| Event catalog / listings | Supabase (sync on schedule) | High read volume |
| Member profile | Salesforce live call | Sensitive, personal |
| Dues / membership status | Salesforce live call | Must be real-time accurate |
| Payment / receipt history | Salesforce live call | Financial data, must be live |

### Middleware Caching Rules
- Cache Salesforce API responses in middleware with a **short TTL (60–300 seconds)** for high-read, low-change endpoints (e.g., chapter detail pages)
- Use **Salesforce Composite API** to batch multiple SF calls into a single HTTP request when loading a member's dashboard
- Use **Salesforce Bulk API 2.0** for aggregate data, rosters, and reporting — never row-by-row for large datasets
- Monitor Salesforce daily API limits (depends on org edition: Enterprise = 150k/day, Unlimited = 1M/day)

---

## API Design Principles

- All Salesforce access goes through the **middleware** — never expose SF credentials or make direct SF calls from the frontend
- Middleware exposes clean REST endpoints to the frontend (e.g., `GET /api/member/profile`, `POST /api/dues/pay`)
- JWT validation happens at the middleware layer before any SF query is executed
- Errors from Salesforce should be caught, normalized, and returned as standard HTTP error responses — do not expose raw SF error messages to the frontend

---

## Coding Standards & Preferences

- **Node.js / Express** for middleware unless an alternative is already established in the repo
- **Async/await** over promise chains
- Environment variables via `.env` — never hardcode credentials
- Salesforce tokens should be cached in memory (or Redis if available) and refreshed before expiry — do not re-authenticate on every request
- Supabase client should be initialized once and reused
- Write modular, single-responsibility functions — avoid monolithic route handlers
- Comment non-obvious logic, especially around Salesforce query construction and token management

---

## Project Status (Sandbox Phase)

- [ ] OAuth / Connected App authentication — in progress
- [ ] Member login → JWT with Contact ID — in progress
- [ ] Middleware scaffolding — in progress
- [ ] Member profile endpoint (`GET /api/member/profile`) — not started
- [ ] Membership status endpoint — not started
- [ ] Dues payment flow (Stripe → Fonteva) — not started
- [ ] Supabase cache layer for chapters/tiers — not started
- [ ] Google Pay / Apple Pay integration — future milestone

---

## What To Avoid

- Do NOT suggest storing sensitive member data (PII, payment info, dues status) in Supabase
- Do NOT make direct Salesforce API calls from the React frontend
- Do NOT re-authenticate to Salesforce on every middleware request — cache the access token
- Do NOT use Salesforce SOQL row-by-row for bulk data operations
- Do NOT expose raw Salesforce/Fonteva error messages to the client

---

## Context on the Organization

- ~150,000 members, 770 chapters
- Uses **Fonteva** (ebMS package) on top of Salesforce for membership management
- Organization branding: currently in sandbox — branding details TBD for portal UI
- This is a **national fraternal organization** — data privacy and accurate dues status are critical

---

## When Starting a New Task

1. Ask for the specific feature or endpoint being built
2. Confirm which Salesforce objects are involved
3. Identify whether the data is live-from-SF or cache-eligible
4. Scaffold middleware route → SF query → response normalization → frontend contract
5. Write tests for auth validation and error handling paths
