# Current Task: Visits Module Routing & History (Phase 2.3)

**Target File:** `src/app/(dashboard)/visits/page.tsx` (and related components).

**Objective:** Implement a Tabs architecture to separate future operations (Agenda) from past operations (History), solving the "black hole" of completed visits.

**Execution Requirements:**
1. **Tabs UI:** Refactor the main `/visits` view to include a sticky or prominent Tabs selector at the top with two options: "Agenda" (Default) and "Historial" (History/Completed).
2. **Data Filtering:** - The "Agenda" tab MUST render ONLY visits with `status = 'pending'`. Ensure the `VisitList` component displays the newly created Edit/Delete action buttons here.
   - The "Historial" tab MUST render ONLY visits with `status = 'completed'`.
3. **Historical Data Display:** In the "Historial" tab, the `VisitCard` (or equivalent) MUST NOT show Edit, Delete, or Complete buttons. It should act as a read-only receipt (showing the client, address, final date, and notes).
4. **Resilience:** Ensure this routing change does not break the existing `loading.tsx` or `error.tsx` boundaries for the `/visits` module.

**Constraints:**
- Strictly maintain the Emerald/Slate Tailwind design system.