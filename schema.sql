-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM Types
CREATE TYPE visit_status AS ENUM ('pending', 'completed', 'canceled');
CREATE TYPE expense_category AS ENUM ('fuel', 'equipment', 'maintenance', 'other');

-- Trigger Function for updating 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

--------------------------------------------------------------------------------
-- 1. Organizations (Root Table)
--------------------------------------------------------------------------------
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 2. Clients
--------------------------------------------------------------------------------
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clients_organization_id ON clients(organization_id);

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 3. Properties
--------------------------------------------------------------------------------
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    google_maps_link TEXT,
    frequency_days INTEGER DEFAULT 15,
    photos TEXT[], -- Array of text for URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_properties_client_id ON properties(client_id);

-- RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 4. Visits
--------------------------------------------------------------------------------
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    status visit_status NOT NULL DEFAULT 'pending',
    estimated_income NUMERIC(15, 2), -- Using NUMERIC for currency
    real_income NUMERIC(15, 2),
    notes TEXT,
    tools_used_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visits_organization_id ON visits(organization_id);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduled_date);
-- Composite index might be useful for querying by organization and date
CREATE INDEX idx_visits_org_date ON visits(organization_id, scheduled_date);

-- RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 5. Tools (Inventario)
--------------------------------------------------------------------------------
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    purchase_date DATE,
    maintenance_limit_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tools_organization_id ON tools(organization_id);

-- RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- 6. Expenses (Gastos)
--------------------------------------------------------------------------------
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL, -- Using NUMERIC for currency
    category expense_category NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL, -- Link expense to a specific visit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_expenses_organization_id ON expenses(organization_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_visit_id ON expenses(visit_id);

-- RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Trigger
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
--------------------------------------------------------------------------------
-- 7. Memberships (Vincula Usuarios con Organizaciones)
--------------------------------------------------------------------------------
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner', -- 'owner', 'member'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id) -- Un usuario no puede estar 2 veces en la misma org
);

-- Index para búsquedas rápidas al loguearse
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 8. Workers & Attendance
--------------------------------------------------------------------------------
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_partner BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    daily_wage NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workers_organization_id ON workers(organization_id);
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON workers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE visit_attendance (
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    PRIMARY KEY (visit_id, worker_id)
);

CREATE INDEX idx_visit_attendance_visit_id ON visit_attendance(visit_id);
CREATE INDEX idx_visit_attendance_worker_id ON visit_attendance(worker_id);
ALTER TABLE visit_attendance ENABLE ROW LEVEL SECURITY;

CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    share_percentage NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(visit_id, worker_id)
);

CREATE INDEX idx_payouts_visit_id ON payouts(visit_id);
CREATE INDEX idx_payouts_worker_id ON payouts(worker_id);
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 9. RPC Functions
--------------------------------------------------------------------------------

-- Complete Visit with Attendance and Payouts (Transactional)
CREATE OR REPLACE FUNCTION complete_visit_v2(
    p_visit_id UUID,
    p_real_income NUMERIC,
    p_notes TEXT,
    p_worker_ids UUID[],
    p_payouts JSONB -- Array of {worker_id, amount, share_percentage}
)
RETURNS VOID AS $$
DECLARE
    v_payout JSONB;
BEGIN
    -- 1. Update Visit
    UPDATE visits
    SET 
        status = 'completed',
        real_income = p_real_income,
        notes = p_notes,
        updated_at = NOW()
    WHERE id = p_visit_id;

    -- 2. Insert Attendance
    DELETE FROM visit_attendance WHERE visit_id = p_visit_id;
    INSERT INTO visit_attendance (visit_id, worker_id)
    SELECT p_visit_id, unnest(p_worker_ids);

    -- 3. Insert Payouts
    DELETE FROM payouts WHERE visit_id = p_visit_id;
    FOR v_payout IN SELECT * FROM jsonb_array_elements(p_payouts)
    LOOP
        INSERT INTO payouts (visit_id, worker_id, amount, share_percentage)
        VALUES (
            p_visit_id, 
            (v_payout->>'worker_id')::UUID, 
            (v_payout->>'amount')::NUMERIC, 
            (v_payout->>'share_percentage')::NUMERIC
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create an organization and link the current user as owner
CREATE OR REPLACE FUNCTION create_organization_for_user(org_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert Organization
  INSERT INTO organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;
  
  -- Insert Membership (Owner)
  INSERT INTO memberships (user_id, organization_id, role)
  VALUES (current_user_id, new_org_id, 'owner');
  
  RETURN new_org_id;
END;
$$;
