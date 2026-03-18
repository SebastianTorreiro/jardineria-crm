# Project State: Jardinería CRM (Todo Verde)

This document defines the durable product context, technology stack, and strict architectural invariants for the Todo Verde / Jardinería CRM repository. These rules apply equally to human developers and coding agents.

## 1. Product Context
- **Application:** A mobile-first, operational CRM built for field workers providing gardening services.
- **Environment Focus:** The primary production environment is mobile devices used in the field. 
- **Core Value:** Efficiency, zero-friction operation, and highly readable tactical information for rapid field execution.

## 2. Technology Stack
- **Framework:** Next.js 15 (App Router) / React 19.
- **Styling:** Tailwind CSS v4 (Emerald/Slate Design System).
- **Backend/Database:** Supabase (PostgreSQL) direct connection via Supabase JS Client.
- **Validation & Forms:** Zod + React Hook Form.

## 3. Architectural Invariants
Directives in this section are non-negotiable and ensure system resilience, security, and scalability.

- **No Intermediate Sub-Backend:** The Next.js application connects directly to Supabase. There is *no* intermediate Node.js, NestJS, Express, or traditional REST backend layer governing requests.
- **Data Mutations (RPC):** All database writes MUST execute through React Server Actions using the `createSafeAction` wrapper located in `src/lib/safe-action.ts`. Direct Supabase `insert/update/delete` payload execution from Client Components is strictly prohibited.
- **Security & Tenancy (RLS):** All Supabase tables strictly enforce Row Level Security (RLS). You must never bypass the active user's `organization_id`. Data access is horizontally isolated per-tenant.
- **Resilience (Suspense & Errors):** All initial data fetching within Server Components MUST be wrapped by `loading.tsx` (React Suspense/Skeletons) and `error.tsx` (Error Boundaries) to prevent broken/blocking renders for field workers with poor connections.
- **Type Safety via Generation:** The database schema is the ultimate source of truth. Use the generated `full_db_types.ts` for typing Supabase queries over broad inference.

## 4. UI Constraints
- **Mobile-First Exclusivity:** Ensure routing, spacing, and font sizes are legible on small screens. Hover-dependent interactions are forbidden for primary actions.
- **Data Presentation:** Native HTML `<table>` elements are strictly forbidden on mobile views due to overflow issues. Always default to the "Responsive Data Cards" pattern (e.g., `VisitCard`).
- **Modal Composition:** Avoid hardcoding forms into dedicated standalone pages (e.g., `/create-visit`). Utilize nested layout composition with `BaseDrawer` and Floating Action Buttons (`FAB`) to present contextual capture forms cleanly over the current active view.

## 5. What NOT to Do (Anti-Patterns)
- **DO NOT** introduce an ORM (like Prisma, Drizzle, Sequelize). Use the Supabase client specifically created in the `supabase/` directory and leverage raw SQL functions/RPC parameters when necessary.
- **DO NOT** query or write data globally bypassing the RLS policies—always handle `organization_id` tenancy checks. 
- **DO NOT** use generic `any` types or skip Zod payload validation in Server Actions. Input shapes must strictly conform to schemas before hitting DB constraints.
- **DO NOT** use arbitrary static Tailwind color classes (e.g., `bg-blue-500`, `text-red-400`). Always fallback to semantic tokens from the design system defined in `UI_GUIDELINES.md` (`bg-primary`, `bg-card`, etc.).
- **DO NOT** build complex desktop-exclusive layouts bridging multiple panels. Keep navigation simple, unified, and stack-based.

## 6. Agent Workflow Expectations
- Review `AGENTS.md` in the repository root for source-of-truth priority, strict operational constraints, and minimum verification protocols before opening a PR or making edits.
- Review `CURRENT_TASK.md` for immediate tactical objectives or regressions; do not solve generic issues unguided.
- Do not modify *this* file (`PROJECT_STATE.md`) with short-lived task lists, bugs, or temporary implementation notes. Its scope is exclusively durable project architecture.