# Current Task: Centralize Session/Org Resolution (`getSupabaseWithOrg`)

## Status
**In Progress**

## Priority
**High (Architectural debt — duplication across ~10+ files)**

## Why this matters
The pair `createClient()` + `getUserOrganization(supabase)` is repeated ad-hoc across most `page.tsx` and `actions.ts` files. If the resolution logic changes (e.g., how `organizationId` is derived), every one of those files needs to be touched individually. Additionally, current call sites collapse three distinct situations — "no organization", "resolution failed", and (not yet supported) "removed from organization" — into a single falsy check, silently mishandling errors as "no org".

## Problem summary
1. **Duplication**: `createClient()` + `getUserOrganization(supabase)` repeated per file instead of centralized.
2. **Lost error information**: existing guard clauses (`if (!organizationId) ...`) cannot distinguish a real "no organization" state from a technical failure resolving it. A technical error should never be treated as "send to onboarding".
3. **Inconsistent reactions**: today the same condition (`!organizationId`) triggers four different behaviors across the codebase (`redirect`, `throw`, `return null`, `return []`/hardcoded empty shapes) with no single owned rule.

## Target files / affected areas
- New: `src/utils/supabase/session.ts` (or equivalent) — the centralized helper.
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/finances/page.tsx`, `src/app/(dashboard)/finances/actions.ts`
- `src/app/(dashboard)/clients/**` (page.tsx + actions.ts wherever the pair appears)
- Any other file matching the `createClient()` + `getUserOrganization()` pair (grep the whole repo first, do not assume the list above is exhaustive).

## Required changes

### 1. Create `getSupabaseWithOrg()`
- Server-side only (uses `createClient()` from `utils/supabase/server`, never `/client`).
- Returns `{ supabase, organizationId, error }`.
  - `error` present → a technical failure resolving the organization. This is NOT the same as "no organization" and must never be treated as such by callers.
  - `organizationId === null` with no `error` → genuinely no organization associated with the user. The caller decides the reaction (typically redirect to onboarding), not this helper.
- Does not redirect, throw, or render anything itself — it only resolves and returns. Navigation/rendering decisions belong to the caller (Server Component or Server Action), consistent with the layering rule in `PROJECT_STATE.md`.

### 2. Migrate call sites one at a time
- Start with `dashboard/page.tsx` (lowest risk, already fully migrated to Repository pattern).
- Replace the `createClient()` + `getUserOrganization()` pair with a single call to `getSupabaseWithOrg()`.
- Preserve each file's existing reaction to "no organization" (e.g., dashboard already redirects to `/onboarding` — keep that), but now guarded correctly: only redirect when `organizationId === null` AND `error` is absent. If `error` is present, do not redirect — surface it as a technical failure (bubble up so `error.tsx` can catch it, or an explicit message, per file context).
- Server Actions (`actions.ts`) must call `getSupabaseWithOrg()` independently — they do NOT receive `supabase`/`organizationId` from `page.tsx`, since Server Actions run as independent invocations with their own request/cookies.

### 3. Finish `finance-repository.ts` migration (in progress)
- `createExpense` repository function already correctly uses `{ error }` only (no `.select()` needed), no try/catch, and receives `supabase` as a parameter (never instantiate a new client inside the repository, and never use `SUPABASE_SERVICE_ROLE_KEY` here).
- Ensure `getFinancialSummary`, `getProfitDistributionSummary`, `getExpenses` in `finances/actions.ts` follow the same repository → service → action chain already established for `createExpense` and for the `dashboard` module.

### 4. Reinstate `createSafeAction` for `createExpense`
- Wrap `createExpenseAction` with `createSafeAction(ExpenseSchema, ...)` from `src/lib/safe-action.ts`, consistent with the non-negotiable invariant in `PROJECT_STATE.md`.
- Confirm whether `safe-action.ts`'s `ctx` can/should be extended to provide `supabase`/`organizationId` via `getSupabaseWithOrg()` internally — if so, this may remove the need for actions to call the helper manually. Flag this as an open design question in the PR description rather than deciding unilaterally.

## Constraints
- Do not touch Collision Math or `VisitCard` — that phase is already completed (see `ROADMAP.md`).
- Do not introduce a third "removed from organization" case — the schema does not support distinguishing it today; do not add new columns/tables to work around this.
- Do not add try/catch inside any repository function.
- Do not use `SUPABASE_SERVICE_ROLE_KEY` anywhere in this task.

## Out of scope
- Database schema changes.
- Any UI redesign.
- VenturePulseAI (separate project, not in scope).
- Security/OWASP audit work (planned for a future quincenal, not now).

## Acceptance criteria
1. `getSupabaseWithOrg()` exists, is server-only, and returns `{ supabase, organizationId, error }` with the semantics described above.
2. `dashboard/page.tsx`, `finances/page.tsx`, `finances/actions.ts`, and `clients` call sites use it instead of the ad-hoc pair.
3. No call site treats a resolution `error` as "no organization".
4. `finance-repository.ts` fully implements the 4 finance functions following the repository/service/action layering already used in `dashboard`.
5. `createExpenseAction` uses `createSafeAction` again.
6. `npm run build` succeeds with no type errors.

## Verification steps
1. Run locally against the local Supabase instance (Docker) — confirm dashboard and finances load correctly for a real seeded user.
2. Manually simulate a resolution error (e.g., temporarily break `getUserOrganization`) and confirm the app does NOT redirect to onboarding, but instead surfaces an error state.
3. Confirm no repository file contains a try/catch or a `SUPABASE_SERVICE_ROLE_KEY` reference.

## Risks / watchouts
- Server Actions cannot reuse a `supabase` client created during a Server Component render — each Server Action must resolve its own via `getSupabaseWithOrg()`.
- Migrate one file at a time and verify the app still runs after each one; do not do a bulk find-replace across the whole repo in one pass.