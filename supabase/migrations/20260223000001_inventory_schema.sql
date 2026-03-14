-- Legacy inventory migration.
-- The baseline now creates the final remote-aligned shape for `tools` and `supplies`.
-- Keep this migration idempotent so old local history does not break resets.

ALTER TABLE public.tools
ADD COLUMN IF NOT EXISTS status text DEFAULT 'available'::text;

CREATE TABLE IF NOT EXISTS public.supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  current_stock numeric DEFAULT 0,
  unit text DEFAULT 'unidades'::text,
  min_stock numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_publication p
    JOIN pg_publication_rel pr ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'supplies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.supplies;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;
