-- Recreate clients RLS with the correct helper function reference.

DROP POLICY IF EXISTS "Enable read access for organization members" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for organization members" ON public.clients;
DROP POLICY IF EXISTS "Enable update for organization members" ON public.clients;
DROP POLICY IF EXISTS "Enable delete for organization members" ON public.clients;
DROP POLICY IF EXISTS "Enable all for organization members" ON public.clients;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for organization members"
ON public.clients
FOR SELECT
TO public
USING (public.is_member(organization_id));

CREATE POLICY "Enable insert for organization members"
ON public.clients
FOR INSERT
TO public
WITH CHECK (public.is_member(organization_id));

CREATE POLICY "Enable update for organization members"
ON public.clients
FOR UPDATE
TO public
USING (public.is_member(organization_id))
WITH CHECK (public.is_member(organization_id));

CREATE POLICY "Enable delete for organization members"
ON public.clients
FOR DELETE
TO public
USING (public.is_member(organization_id));
