# Operational Roadmap: Jardinería CRM (Todo Verde)

**Last Updated:** July 2026

## Status Legend
- 🟢 **Completed:** Deployed, merged, and verified in production.
- 🟡 **In Progress:** Actively being worked on according to `CURRENT_TASK.md`.
- ⚪ **Up Next:** Ready for implementation, blocking dependencies resolved.
- 🔴 **Blocked:** Waiting on upstream changes, decisions, or core bug fixes.

---

## Current Focus
**🟡 Centralizing Session/Org Resolution & Repository Pattern Rollout**
Consolidating the repeated `createClient() + getUserOrganization()` pair into a single `getSupabaseWithOrg()` helper, and finishing the Repository pattern rollout across `dashboard` and `finances` modules.

---

## 🟢 Completed Phases

### Phase 3: Client Profiles (The Source of Truth)
- [x] **3.1:** Enforce navigation patterns.
- [x] **3.2:** Build Client Dashboard.
- [x] **3.3:** Client CRUD (Base Engine).
- [x] **3.4:** CRUD Unification (Schema & UI forms).
- [x] **3.5:** Passive Geolocation: Implement zero-friction Google Maps routing.

### Phase 4.1–4.2: Collision Math & Dashboard UI Unification
- [x] Robust collision math using absolute minutes from midnight instead of string comparison.
- [x] Dashboard unified to use `VisitCard` for pending visits, with visible `start_time`.

### Foundational Setup
- [x] Base Next.js App Router & Tailwind CSS v4 environment.
- [x] Direct Supabase connection (RLS, Auto-generated Types, Safe Actions).
- [x] Robust CRUD flows using React Hook Form + Zod + BaseDrawer composition.
- [x] AI Embedding Sidecar setup (store vector embeddings of visit observations).
- [x] Local Supabase development environment (CLI + Docker), migrations reconstructed from remote baseline.
- [x] Repository pattern applied to `dashboard` module (`dashboard-repository.ts` / `dashboard-service.ts`), `page.tsx` fully delegates to the service.

## 🟡 In Progress

### Phase 4.3: Session/Tenancy Centralization
- [ ] Create `getSupabaseWithOrg()` helper (see `CURRENT_TASK.md`).
- [ ] Migrate `dashboard`, `finances`, `clients` modules to use it.
- [ ] Finish Repository pattern for `finances` module (`finance-repository.ts`), currently mid-migration.

---

## ⚪ Next Phases

### Phase 4: Operations & Scheduling Solidification
- [ ] **4.4: State Separation.** Ensure strict segregation of pending visits (editable Agenda) vs. completed visits (read-only Historial receipts).

### Phase 5: Applied Intelligence
- [ ] **5.1: Semantic Search.** Expose the `/api/v1/upsert-visit-embedding` capability on the frontend, allowing operators to search past visit notes via natural language queries.
- [ ] **5.2: Automated Summaries.** Use AI models to summarize long histories of visit notes for specific returning clients.

---

## ⚪ Later Phases
*These require further schema definitions and product validation before coding begins.*

### Phase 6: Team Expansion & Financials
- [ ] **6.1: Multi-Technician Dispatch.** Support assigning disjoint users to visits simultaneously.
- [ ] **6.2: Basic Analytics.** Display top-level organizational KPIs, such as generated revenue or average visit duration per week.
- [ ] **6.3: Client Notifications.** Auto-generated WhatsApp dispatch reminders.

---

## Dependencies
- **Type Safety:** All future phases depend on the Supabase local schema. After adding tables, `generate-types` must be run to update `full_db_types.ts` before frontend implementation starts.
- **Server Actions:** Any new backend flow must use `createSafeAction` located in `src/lib/safe-action.ts` to uphold architectural invariants.
- **Session Resolution:** Any new backend flow needing `organizationId` must use `getSupabaseWithOrg()` once implemented, not ad-hoc `createClient() + getUserOrganization()` calls.

## Blockers / Risks
- **Timezone Drift:** Date objects submitted via forms vs. native Supabase `timestamp`/`date` types can cause collision and scheduling errors if not properly normalized.

## Notes
- Do not build speculative roadmap items (e.g., Phase 6 Features) without explicit instruction in `CURRENT_TASK.md`.
- Read `PROJECT_STATE.md` to ensure any new feature proposed here adheres to the immutable architectural boundaries.