# Project State: Jardinería CRM (Todo Verde)

## Strict Tech Stack
- **Framework:** Next.js 15 (App Router) / React 19.
- **Styling:** Tailwind CSS (Emerald/Slate Design System).
- **Backend/DB:** Supabase (PostgreSQL) direct connection. NO intermediate Node/NestJS backend exists.
- **Validation:** Zod + React Hook Form.

## Inflexible Architectural Rules
1. **Data Mutations (RPC):** All Supabase writes MUST execute through Server Actions using the `createSafeAction` wrapper in `src/lib/safe-action.ts`.
2. **Security (RLS):** All tables strictly enforce Row Level Security. Never bypass the active user's `organization_id`.
3. **Mobile-First UI:** The production environment is mobile (field workers). Native `<table>` elements are strictly forbidden on mobile views. Enforce the "Responsive Data Cards" pattern.
4. **Resilience (Suspense):** All data fetching MUST be wrapped by `loading.tsx` (Skeletons) and `error.tsx` (Error Boundaries) to prevent blocking renders.
5. **Modal Composition:** Forms are never hardcoded into pages. Use `BaseDrawer` and `FloatingActionButton` composition.

## Agent Skills & Best Practices
Before writing code, the agent MUST review the relevant skill files located in the `.agent/skills/` directory (or `.agents/skills/`):
- For Next.js/React patterns: Read `.agent/skills/nextjs-best-practices/SKILL.md`
- For styling: Read `.agent/skills/tailwind-design-system/SKILL.md`
- For database updates: Read `.agent/skills/postgresql-table-design/SKILL.md`