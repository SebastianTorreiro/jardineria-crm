-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id),
  CONSTRAINT clients_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  amount numeric NOT NULL,
  category USER-DEFINED NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.organization_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  user_id uuid,
  role text DEFAULT 'owner'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT organization_members_pkey PRIMARY KEY (id),
  CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  visit_id uuid,
  worker_id uuid,
  amount numeric NOT NULL,
  share_percentage numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payouts_pkey PRIMARY KEY (id),
  CONSTRAINT payouts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT payouts_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id),
  CONSTRAINT payouts_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  client_id uuid NOT NULL,
  address text NOT NULL,
  google_maps_link text,
  frequency_days integer DEFAULT 15,
  photos ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT properties_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.supplies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  current_stock numeric DEFAULT 0,
  unit text DEFAULT 'unidades'::text,
  min_stock numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT supplies_pkey PRIMARY KEY (id),
  CONSTRAINT supplies_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  brand text,
  purchase_date date,
  maintenance_limit_uses integer,
  current_uses integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'available'::text CHECK (status = ANY (ARRAY['available'::text, 'maintenance'::text, 'broken'::text])),
  CONSTRAINT tools_pkey PRIMARY KEY (id),
  CONSTRAINT tools_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.visit_attendance (
  organization_id uuid,
  visit_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  CONSTRAINT visit_attendance_pkey PRIMARY KEY (visit_id, worker_id),
  CONSTRAINT visit_attendance_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT visit_attendance_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id),
  CONSTRAINT visit_attendance_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id)
);
CREATE TABLE public.visits (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL,
  property_id uuid NOT NULL,
  scheduled_date date NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::visit_status,
  estimated_income numeric,
  real_income numeric,
  notes text,
  tools_used_summary text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  start_time time without time zone,
  completed_at timestamp with time zone,
  notes_after_visit text,
  total_price numeric DEFAULT 0,
  direct_expenses numeric DEFAULT 0,
  estimated_duration_mins integer DEFAULT 60,
  notes_embedding USER-DEFINED,
  CONSTRAINT visits_pkey PRIMARY KEY (id),
  CONSTRAINT visits_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT visits_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.workers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid,
  name text NOT NULL,
  is_partner boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workers_pkey PRIMARY KEY (id),
  CONSTRAINT workers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);