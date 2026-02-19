-- Add status to tools if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_status') THEN
        CREATE TYPE tool_status AS ENUM ('available', 'maintenance', 'broken');
    END IF;
END $$;

ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS status tool_status DEFAULT 'available';

-- Create supplies table
CREATE TABLE IF NOT EXISTS supplies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;

-- Policies for supplies
DROP POLICY IF EXISTS "Enable all for organization members" ON supplies;

CREATE POLICY "Enable all for organization members"
ON supplies FOR ALL
USING (
  auth.is_member(organization_id)
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE supplies;
