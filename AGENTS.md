# AGENTS.md

This file is the root operational manual and mandatory entry point for all AI coding agents working on Todo Verde (Jardinería CRM). Its singular purpose is to guide how agents should behave, discover context, and verify changes within this repository before writing any code.

## 1. Source-of-Truth Priority

When documentation or instructions conflict, agents MUST prioritize in the following strict order (1 is highest):

1. **`doc/CURRENT_TASK.md`**: The tactical, immediate objective. Overrides all other constraints for the immediate work scope.
2. **`doc/PROJECT_STATE.md`**: Inflexible architectural rules, stack definitions, and non-negotiable project invariants.
3. **`UI_GUIDELINES.md`**: Semantic color palette, component design consistency, and Tailwind v4 usage rules.
4. **`doc/ROADMAP.md`**: Medium-term project evolution and sequencing. Do not build roadmap features unless explicitly prioritized in your current task.
5. **`.agents/skills/` (or `.agent/skills/`)**: General best practices (Next.js, Tailwind, PostgreSQL) specific to this codebase context.

**Note on Document Separation**: `AGENTS.md` provides agent workflow expectations. Do not duplicate current priorities, active bugs, architecture invariants, or future features here. Those belong exclusively in their respective documents (`CURRENT_TASK.md`, `PROJECT_STATE.md`, or `ROADMAP.md`).

## 2. Required Reading Before Editing

Before making any tool calls to edit code or propose architectural solutions, you MUST:

1. **Read `doc/CURRENT_TASK.md`** to understand exactly what the user wants you to do right now, the affected files, and the active constraints.
2. **Read `doc/PROJECT_STATE.md`** to verify the architectural boundaries and product context for your proposed solution.
3. **Check `schema.sql` or `full_db_types.ts`** when interacting with Supabase to avoid hallucinating nonexistent tables, relations, or column names.
4. **Read `UI_GUIDELINES.md`** if making any visual, layout, or structural UI changes.

## 3. High-Level Implementation Rules

- **Do Not Invent Architecture or Services**: This is a Next.js (App Router) project connecting directly to Supabase via the JS Client. There is NO intermediate Node/Nest backend, nor are there specialized background workers, message queues, caches, or external tools not explicitly defined in the repo (`package.json` / `supabase/`).
- **Strictly Follow `PROJECT_STATE.md`**: All database mutations must use the `createSafeAction` wrapper. All UI components must adhere to the mobile-first "Responsive Data Cards" pattern.
- **Handling Uncertainty**: If a structural element, route, or type definition is missing or unclear, DO NOT hallucinate a solution. Add a `// TODO:` comment in the code or ask the user directly for clarification.
- **Scope Containment**: Do not expand your work beyond the strict boundaries defined in `CURRENT_TASK.md`. Do not refactor unrelated files or attempt to implement `ROADMAP.md` phases prematurely out of "helpfulness."

## 4. Minimum Verification Protocol

Before finishing a task and returning control to the user, ensure the following constraints are met:

1. **Type Safety**: No `any` types were introduced intentionally. Verify your changes against the generated database types (`full_db_types.ts`).
2. **Resilience**: Ensure new data fetches are wrapped by Suspense boundaries (`loading.tsx`) and Error Boundaries (`error.tsx`), especially when handling `useSearchParams`.
3. **Security (RLS)**: Ensure new mutations or RPC calls respect Row Level Security (e.g., verifying `organization_id` usage in Postgres).
4. **Tailwind Verification**: Ensure styling relies strictly on the semantic design tokens defined in `UI_GUIDELINES.md` (e.g., `bg-primary`, `bg-card`, `text-primary-foreground`) rather than arbitrary static utility values.
