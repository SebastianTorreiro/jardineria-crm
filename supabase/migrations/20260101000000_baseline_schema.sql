-- Baseline schema reconstructed from the remote Supabase project.
-- Purpose: make local development reproducible without depending on the paused cloud project.

-- 1) Required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2) Public enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
    CREATE TYPE public.expense_category AS ENUM (
      'fuel',
      'equipment',
      'maintenance',
      'other',
      'combustible',
      'repuestos',
      'sueldos',
      'herramientas',
      'otros'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visit_status') THEN
    CREATE TYPE public.visit_status AS ENUM (
      'pending',
      'completed',
      'canceled'
    );
  END IF;
END $$;

-- 3) Helper functions
CREATE OR REPLACE FUNCTION public.is_member(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 4) Core tables
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid,
  role text DEFAULT 'owner'::text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT organization_members_organization_id_user_id_key UNIQUE (organization_id, user_id)
);

create or replace function public.create_organization_for_user(org_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'User must be authenticated';
  end if;

  if org_name is null or btrim(org_name) = '' then
    raise exception 'Organization name is required';
  end if;

  insert into public.organizations (name)
  values (btrim(org_name))
  returning id into v_org_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (v_org_id, v_user_id, 'owner')
  on conflict (organization_id, user_id) do nothing;

  return v_org_id;
end;
$$;

grant execute on function public.create_organization_for_user(text) to authenticated;
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  address text NOT NULL,
  google_maps_link text,
  frequency_days integer DEFAULT 15,
  photos text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_partner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.visits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status public.visit_status NOT NULL DEFAULT 'pending'::public.visit_status,
  estimated_income numeric,
  real_income numeric,
  notes text,
  tools_used_summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  start_time time,
  completed_at timestamptz,
  notes_after_visit text,
  total_price numeric DEFAULT 0,
  direct_expenses numeric DEFAULT 0,
  estimated_duration_mins integer DEFAULT 60,
  notes_embedding vector
);

CREATE TABLE IF NOT EXISTS public.visit_attendance (
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  visit_id uuid NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  CONSTRAINT visit_attendance_pkey PRIMARY KEY (visit_id, worker_id)
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES public.visits(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES public.workers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  share_percentage numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT payouts_visit_id_worker_id_key UNIQUE (visit_id, worker_id)
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  category public.expense_category NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  brand text,
  purchase_date date,
  maintenance_limit_uses integer,
  current_uses integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'available'::text
);

CREATE TABLE IF NOT EXISTS public.supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  current_stock numeric DEFAULT 0,
  unit text DEFAULT 'unidades'::text,
  min_stock numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5) Indexes
CREATE UNIQUE INDEX IF NOT EXISTS unique_organization_name ON public.organizations USING btree (name);

CREATE INDEX IF NOT EXISTS idx_clients_organization_id ON public.clients USING btree (organization_id);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses USING btree (date);
CREATE INDEX IF NOT EXISTS idx_expenses_organization_id ON public.expenses USING btree (organization_id);

CREATE INDEX IF NOT EXISTS idx_properties_client_id ON public.properties USING btree (client_id);
CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON public.properties USING btree (organization_id);

CREATE INDEX IF NOT EXISTS idx_tools_organization_id ON public.tools USING btree (organization_id);

CREATE INDEX IF NOT EXISTS idx_visits_date ON public.visits USING btree (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_visits_org_date ON public.visits USING btree (organization_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_visits_organization_id ON public.visits USING btree (organization_id);
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON public.visits USING btree (property_id);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_date ON public.visits USING btree (scheduled_date);

-- 6) Triggers
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON public.visits;
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7) RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- 8) Policies
-- organizations
DROP POLICY IF EXISTS "Public access for MVP" ON public.organizations;
CREATE POLICY "Public access for MVP"
ON public.organizations
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "View own organization" ON public.organizations;
CREATE POLICY "View own organization"
ON public.organizations
FOR SELECT
TO public
USING (
  id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
);

-- organization_members
DROP POLICY IF EXISTS "Public members for MVP" ON public.organization_members;
CREATE POLICY "Public members for MVP"
ON public.organization_members
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- clients
DROP POLICY IF EXISTS "Enable read access for organization members" ON public.clients;
CREATE POLICY "Enable read access for organization members"
ON public.clients
FOR SELECT
TO public
USING (public.is_member(organization_id));

DROP POLICY IF EXISTS "Enable insert for organization members" ON public.clients;
CREATE POLICY "Enable insert for organization members"
ON public.clients
FOR INSERT
TO public
WITH CHECK (public.is_member(organization_id));

DROP POLICY IF EXISTS "Enable update for organization members" ON public.clients;
CREATE POLICY "Enable update for organization members"
ON public.clients
FOR UPDATE
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

DROP POLICY IF EXISTS "Enable delete for organization members" ON public.clients;
CREATE POLICY "Enable delete for organization members"
ON public.clients
FOR DELETE
TO public
USING (public.is_member(organization_id));

-- expenses
DROP POLICY IF EXISTS "Access expenses" ON public.expenses;
CREATE POLICY "Access expenses"
ON public.expenses
FOR ALL
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

DROP POLICY IF EXISTS "Users can insert expenses for their organization" ON public.expenses;
CREATE POLICY "Users can insert expenses for their organization"
ON public.expenses
FOR INSERT
TO public
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view expenses of their organization" ON public.expenses;
CREATE POLICY "Users can view expenses of their organization"
ON public.expenses
FOR SELECT
TO public
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
);

-- properties
DROP POLICY IF EXISTS "Access properties" ON public.properties;
CREATE POLICY "Access properties"
ON public.properties
FOR ALL
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

-- supplies
DROP POLICY IF EXISTS "Access supplies" ON public.supplies;
CREATE POLICY "Access supplies"
ON public.supplies
FOR ALL
TO public
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
);

-- tools
DROP POLICY IF EXISTS "Access tools" ON public.tools;
CREATE POLICY "Access tools"
ON public.tools
FOR ALL
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

-- visits
DROP POLICY IF EXISTS "Access visits" ON public.visits;
CREATE POLICY "Access visits"
ON public.visits
FOR ALL
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

-- workers
DROP POLICY IF EXISTS "Users can view workers of their own organization" ON public.workers;
CREATE POLICY "Users can view workers of their own organization"
ON public.workers
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_members.organization_id = workers.organization_id
      AND organization_members.user_id = auth.uid()
  )
);
