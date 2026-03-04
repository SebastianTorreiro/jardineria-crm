# Current Task: Fix Collision Math & Unify Dashboard UI

**Target Files:**
- `src/app/(dashboard)/visits/actions.ts` (Collision engine logic)
- `src/app/(dashboard)/page.tsx` (Main Dashboard view)
- `src/components/visits/VisitCard.tsx` (Card UI redesign)

**Objective:** The collision engine is failing to prevent double-booking due to string-comparison flaws. The Dashboard UI is fragmented, ugly, and missing the time. We must fix the math using absolute minutes and unify the UI to use a single, redesigned `VisitCard`.

**Execution Requirements:**
1. **Robust Collision Math (`actions.ts`):** Stop comparing raw time strings. Parse `start_time` into absolute minutes from midnight (e.g., "09:00" -> 9 * 60 + 0 = 540). 
   - Calculate `new_start_minutes` and `new_end_minutes` (start + estimated_duration_mins).
   - Do the same parsing for every existing visit fetched from the database on that date.
   - The overlap condition MUST be mathematical: `if ((new_start_minutes < existing_end_minutes) && (new_end_minutes > existing_start_minutes)) { throw collision_error; }`.
2. **Dashboard Unification (`page.tsx`):** Open the main dashboard file. Delete the custom, ugly HTML rendering the pending visits. Import `VisitCard` and map over the pending visits using `<VisitCard key={visit.id} visit={visit} />`.
3. **VisitCard Redesign (`VisitCard.tsx`):** Stop hiding the time in a subtle string. Redesign the card to display the `start_time` prominently. Create a bold visual badge or a dedicated left-column block for the time (e.g., `09:00`). If the time is missing, show "Sin horario". Keep the Emerald/Slate premium feel.

**Constraints:**
- Do NOT build a "tabbed view" or add new features. Fix the current regressions.
- Ensure the Date fetched from the DB matches the Date submitted from the UI exactly to prevent timezone shifts bypassing the collision check.