# Jardinería CRM

Operational CRM for a small gardening services business.

This project is a **mobile-first internal CRM** built to manage the real day-to-day workflow of a gardening operation: clients, properties, scheduled visits, workers, inventory, expenses, and service completion.

It is currently being developed as an **MVP**, with the main goal of becoming genuinely useful in a real business before adding extra complexity.

---

## Overview

Small field-service businesses usually do not need a bloated CRM. They need a tool that answers practical operational questions quickly:

- Which visits are scheduled for today?
- Which client owns this property?
- Who attended a visit?
- What was earned, spent, and paid out?
- Which tools and supplies are available?
- What still needs to be completed?

**Jardinería CRM** is being built to solve those problems for a gardening business with a simple, focused, and mobile-friendly workflow.

---

## Current Product Direction

This is not a generic SaaS dashboard. It is an **operational CRM** centered on real field work.

Current priorities are:

- stabilize local-first development
- harden the Supabase schema and migrations
- improve auth and onboarding flow
- improve visit creation and completion flow
- improve client/property editing consistency
- keep the UI clear, practical, and mobile-first

Multi-organization complexity, advanced user roles, and broader team management are intentionally deferred until they are actually needed.

---

## Current Scope

The project already includes the foundation for:

- authentication and login
- organization onboarding
- protected dashboard area
- client management
- property management
- visit scheduling
- visit completion flow
- worker records
- inventory tracking
- expenses and financial tracking

The source structure currently includes:

- `src/app/(dashboard)`
- `src/app/auth`
- `src/app/login`
- `src/app/onboarding`
- `src/components`
- `src/lib`
- `src/types`
- `src/utils`
- `src/middleware.ts`

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### UI / UX Utilities
- `lucide-react`
- `react-day-picker`
- `sonner`
- `vaul`
- `clsx`
- `tailwind-merge`
- `date-fns`

### Backend / Data
- Supabase
- `@supabase/supabase-js`
- `@supabase/ssr`

### Validation
- Zod

---

## Package Scripts

Available npm scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

At the moment, there is **no test script configured** in `package.json`.

---

## Core Domain Model

The current database model revolves around these main entities:

- `organizations`
- `organization_members`
- `clients`
- `properties`
- `workers`
- `visits`
- `visit_attendance`
- `payouts`
- `expenses`
- `tools`
- `supplies`

### Important modeling note

A logged-in user is **not automatically the same thing** as a worker.

Current separation of responsibilities:

- **Auth user** → can sign in
- **Organization member** → belongs to an organization
- **Worker** → operational person assigned to visits

That separation is intentional for the current MVP.

---

## Auth and Onboarding Flow

The intended flow is:

1. A user signs in
2. If the user does not belong to an organization yet, the app redirects them to onboarding
3. Onboarding creates:
   - the organization
   - the owner membership in `organization_members`
4. Operational data is then managed inside the dashboard

At the current stage of development, depending on environment and implementation status, the first auth user may still need to be created manually in Supabase before signing in.

---

## Project Structure

```text
.
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router routes and layouts
│   │   ├── (dashboard)/    # Protected dashboard area
│   │   ├── auth/           # Auth-related routes / handlers
│   │   ├── login/          # Login page
│   │   └── onboarding/     # Organization onboarding flow
│   ├── components/         # Reusable UI and feature components
│   ├── lib/                # Core logic, services, Supabase helpers, utilities
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Utility helpers
│   └── middleware.ts       # Route protection / session flow
├── supabase/               # Local Supabase config, migrations, SQL scripts
├── doc/                    # Project documentation (recommended future rename: docs/)
├── AGENTS.md               # Entry point for coding agents
├── UI_GUIDELINES.md        # UI and interaction guidance
├── README.md               # Project overview and setup
└── package.json            # Project manifest
```

---

## Local Development

### Requirements

- Node.js
- npm
- Docker
- Supabase CLI (usable through `npx`)

### 1. Install dependencies

```bash
npm install
```

### 2. Start local Supabase

```bash
npx supabase start
```

### 3. Rebuild the local database

```bash
npx supabase db reset
```

### 4. Configure local environment variables

Create a local environment file and point the app to your local Supabase stack.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_LOCAL_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_LOCAL_SECRET_KEY
```

Use the values printed by:

```bash
npx supabase status
```

### 5. Run the application

```bash
npm run dev
```

---

## Local Database Strategy

This project is meant to remain workable in local development even when the cloud project is paused.

### Source of truth

The database source of truth should be:

```text
supabase/migrations/
```

Not:

- one-off manual edits in Studio
- temporary exported schema files in the root
- ad-hoc fixes that never make it back into migrations

### Recommended workflow

When schema changes are made:

1. create or update the appropriate migration
2. run `npx supabase db reset`
3. verify the schema in local Studio
4. test the affected flow in the app

---

## Demo / Development Data

For local development, the recommended approach is:

1. start local Supabase
2. run the app
3. create or sign in with a local auth user
4. complete onboarding
5. load demo operational data after onboarding

This keeps the auth flow and organization ownership consistent with the actual app model.

---

## Documentation Map

Documentation is currently split by role:

- `README.md` → project overview and setup
- `AGENTS.md` → how coding agents should operate in this repository
- `CURRENT_TASK.md` → active implementation task
- `PROJECT_STATE.md` → durable technical constraints and invariants
- `ROADMAP.md` → medium-term project direction
- `UI_GUIDELINES.md` → UI and interaction rules

---

## Development Principles

This project follows a practical approach:

- build for real operational use, not abstract SaaS aesthetics
- keep the UI mobile-first and task-oriented
- add complexity only when the business actually needs it
- keep local development first-class
- keep schema and migrations reproducible
- separate auth users from operational workers unless the model truly requires merging them

---

## Current Status

This project is in **active MVP development**.

That means:

- core flows already exist
- local execution is possible
- schema and infra are being stabilized
- UX is still being refined through real usage
- some flows are incomplete and still evolving

This is not a polished public product yet. It is a focused internal tool under construction.

---

## Near-Term Priorities

- stabilize local Supabase workflow
- improve onboarding and registration flow
- fix client/property editing inconsistencies
- improve worker handling in visit completion
- strengthen visit completion and payout logic
- continue reducing friction in day-to-day operational flows

---

## Notes for Contributors / Agents

Before making changes:

1. Read `AGENTS.md`
2. Read `PROJECT_STATE.md`
3. Read `CURRENT_TASK.md`
4. Do not invent architecture that is not present in the repository
5. Keep changes small, reviewable, and grounded in the current MVP

---

## License

Private / internal project for now.

Add a formal license later if the repository is made public.