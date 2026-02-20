-- 1. Tools: Ensure status column is correct
ALTER TABLE tools 
DROP CONSTRAINT IF EXISTS tools_status_check;

ALTER TABLE tools 
ADD CONSTRAINT tools_status_check 
CHECK (status IN ('available', 'maintenance', 'broken'));

-- 2. Visits: Add columns if they don't exist
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes_after_visit TEXT;

-- 3. Finances: Ensure expense_category constraint
ALTER TABLE expenses 
DROP CONSTRAINT IF EXISTS expenses_category_check;

-- If it's a native enum type, we might need to recreate it, but a CHECK constraint is safer for hot updates
-- Assuming 'expense_category' is a text column with a check, or strictly an enum. 
-- If it is an ENUM type, we can't easily alter values without recreating. 
-- Let's assume a CHECK constraint approach for flexibility as requested for lowercase values.
ALTER TABLE expenses
ADD CONSTRAINT expenses_category_check
CHECK (category IN ('combustible', 'repuestos', 'sueldos', 'herramientas', 'otros'));

-- 4. Data Cleanup (Lowercase conversion)
UPDATE tools SET status = lower(status);
UPDATE expenses SET category = lower(category);
-- Also ensure visits status is lowercase if applicable
UPDATE visits SET status = lower(status);
