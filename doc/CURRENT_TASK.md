# Current Task: VisitCard UX Polish (Phase 2.4)

**Target File:** `src/components/visits/VisitCard.tsx`

**Objective:** Expose critical operational data (time of the appointment and contextual notes) directly on the visit card to eliminate the need for users to open the details view.

**Execution Requirements:**
1. **Time Extraction:** Parse the `scheduled_date` string/timestamp to extract and display the specific time (e.g., "14:30" or "02:30 PM"). Render this prominently next to or below the calendar date icon.
2. **Notes Visibility:** Map the `notes` field into the card layout. 
   - It MUST be visually distinct (e.g., an italicized slate text or a slightly tinted background block inside the card).
   - It MUST span the full width of the card's inner content so long instructions are readable.
   - If `notes` is null or empty, do not render an empty block; render a subtle fallback like "Sin observaciones previas".
3. **Component Reusability:** Ensure these additions look correct regardless of whether the card is rendering action buttons (Pending) or functioning as a read-only receipt (Completed).

**Constraints:**
- Strictly maintain the Emerald/Slate Tailwind design system. Use native `Intl.DateTimeFormat` or `date-fns` (if already installed) for time parsing.