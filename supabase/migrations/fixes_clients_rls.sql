-- Drop existing policies to start fresh
-- Note: Adjust policy names if they differ in your database. These are generic names based on standard Supabase patterns.
DROP POLICY IF EXISTS "Enable all for organization members" ON clients;
DROP POLICY IF EXISTS "Enable read access for organization members" ON clients;
DROP POLICY IF EXISTS "Enable insert for organization members" ON clients;
DROP POLICY IF EXISTS "Enable update for organization members" ON clients;
DROP POLICY IF EXISTS "Enable delete for organization members" ON clients;

-- Ensure RLS is enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy
CREATE POLICY "Enable read access for organization members"
ON clients FOR SELECT
USING (
  auth.is_member(organization_id)
);

-- 2. INSERT Policy (Fixes RLS Error 42501)
-- The crucial part is adding valid WITH CHECK clause
CREATE POLICY "Enable insert for organization members"
ON clients FOR INSERT
WITH CHECK (
  auth.is_member(organization_id)
);

-- 3. UPDATE Policy
CREATE POLICY "Enable update for organization members"
ON clients FOR UPDATE
USING (
  auth.is_member(organization_id)
);

-- 4. DELETE Policy
CREATE POLICY "Enable delete for organization members"
ON clients FOR DELETE
USING (
  auth.is_member(organization_id)
);
