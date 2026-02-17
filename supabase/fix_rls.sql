-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Reset RLS Policies (Idempotent)
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
-- Also drop any other potential policies to ensure a clean slate
DROP POLICY IF EXISTS "Enable read access for own memberships" ON memberships;
DROP POLICY IF EXISTS "Enable read access for organizations" ON organizations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON organizations;

-- 2. Enable RLS on both tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- 3. Create the "Golden" Policies

-- Policy 1: SELECT Memberships (Own rows - auth.uid() = user_id)
CREATE POLICY "Users can view their own membersips"
ON memberships
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Policy 2: SELECT Organizations (via membership)
CREATE POLICY "Users can view organizations they belong to"
ON organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id 
    FROM memberships 
    WHERE user_id = auth.uid()
  )
);

-- Policy 3: INSERT Organizations (Authenticated)
CREATE POLICY "Authenticated users can create organizations"
ON organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Optional: Grant usage on sequence if needed (not strictly RLS but good for robustness)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON TABLE organizations TO authenticated;
GRANT ALL ON TABLE memberships TO authenticated;
