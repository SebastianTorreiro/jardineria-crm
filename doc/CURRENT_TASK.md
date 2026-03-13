# Current Task: Fix Collision Math & Unify Dashboard UI

## Status
**In Progress**

## Priority
**High (Bug/Regression Fix)**

## Why this matters
The system is currently failing to prevent double-booking because the collision engine incorrectly compares raw time strings instead of actual mathematical time values. Furthermore, the main dashboard UI is rendering an ugly, fragmented list of pending visits instead of using the unified, modern `VisitCard` component, and critical information (the visit time) is hidden from the user.

## Problem summary
1. **Collision Logic Flaw**: Comparing strings like `"09:00"` and `"10:30"` leads to edge-case failures. The engine must convert string times to absolute minutes from midnight to accurately apply an overlap check (`new_start < existing_end && new_end > existing_start`).
2. **Dashboard UI Fragmentation**: `/page.tsx` uses custom HTML to map pending visits, ignoring the established UI component library.
3. **VisitCard Weakness**: The `VisitCard` component hides the start time, which is critical for field workers needing to know their schedule at a glance.

## Target files / affected areas
- `src/app/(dashboard)/visits/actions.ts` (Collision engine logic)
- `src/app/(dashboard)/page.tsx` (Main Dashboard view)
- `src/components/visits/VisitCard.tsx` (Card UI redesign)

## Required changes

### 1. Robust Collision Math (`actions.ts`)
- Stop comparing raw time strings.
- Parse `start_time` into absolute minutes from midnight (formula: `hours * 60 + minutes`, e.g., `"09:00"` -> `9 * 60 + 0 = 540`).
- Calculate `new_start_minutes` and `new_end_minutes` (`start_minutes + estimated_duration_mins`).
- Parse every existing visit fetched from the database on that particular date in the exact same manner.
- Implement the mathematical overlap condition: 
  `if ((new_start_minutes < existing_end_minutes) && (new_end_minutes > existing_start_minutes)) { throw collision_error; }`

### 2. Dashboard Unification (`page.tsx`)
- Open the main dashboard file.
- Delete the custom HTML blocks currently rendering the pending visits list.
- Import `VisitCard` and map over the pending visits using `<VisitCard key={visit.id} visit={visit} />`.

### 3. VisitCard Redesign (`VisitCard.tsx`)
- Redesign the card to display the `start_time` prominently rather than hiding it.
- Create a bold visual badge or dedicate a left-column block specifically for the time (e.g., `09:00`).
- If `start_time` is null/missing, explicitly show `"Sin horario"`.
- Preserve the existing Emerald/Slate premium feel defined in `UI_GUIDELINES.md`.

## Constraints
- **Do not** build a "tabbed view" or add completely new features. This task is strictly a regression fix and UI cleanup.
- Ensure the Date fetched from the DB matches the Date submitted from the UI exactly to prevent timezone shifts from bypassing the collision check entirely.

## Out of scope
- Database schema changes.
- Creating new routes.
- Writing generalized testing suites.
- Updating `PROJECT_STATE.md`, `ROADMAP.md` or `AGENTS.md`.

## Acceptance criteria
1. Attempting to book an overlapping visit on the same date via the UI throws the correct collision error.
2. The Dashboard (`/page.tsx`) seamlessly displays pending visits utilizing the `VisitCard` component.
3. `VisitCard.tsx` clearly and prominently renders the start time (or "Sin horario").
4. The application builds successfully without type errors (`npm run build`).

## Verification steps
1. Inspect `actions.ts` to confirm `new_start` and `new_end` are derived mathematically (absolute minutes).
2. Load the main dashboard to verify the UI does not look broken, and the styled `VisitCard`s appear.
3. Trigger a form submission (or write a mock test) for a visit that overlaps an existing one, verifying that the action accurately returns an error state instead of inserting the row.

## Risks / watchouts
- Timezone parsing differences between the client submission and the Supabase database. Treat all dates strictly as local date segments (YYYY-MM-DD) if possible.