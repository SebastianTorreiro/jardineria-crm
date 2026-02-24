-- Migration: complete_visit_with_payouts
-- Description: Transactional RPC for atomic completion of a visit, including updating the status, managing attendance, and recording payouts.

CREATE OR REPLACE FUNCTION complete_visit_with_payouts(
    p_visit_id UUID,
    p_org_id UUID,
    p_income NUMERIC,
    p_expenses NUMERIC,
    p_payouts JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_visit visits%ROWTYPE;
    v_payout_item JSONB;
BEGIN
    -- 1. Ensure the visit exists and belongs to the org
    SELECT * INTO v_visit 
    FROM visits 
    WHERE id = p_visit_id AND organization_id = p_org_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Visit not found or does not belong to your organization';
    END IF;

    -- 2. Update the visit details
    UPDATE visits 
    SET 
        status = 'completed',
        total_price = p_income,
        direct_expenses = p_expenses,
        updated_at = now()
    WHERE id = p_visit_id AND organization_id = p_org_id;

    -- 3. Clear existing attendance for this visit to avoid duplicates if re-submitting
    DELETE FROM visit_attendance WHERE visit_id = p_visit_id;

    -- 4. Process the incoming payouts array
    FOR v_payout_item IN SELECT * FROM jsonb_array_elements(p_payouts)
    LOOP
        -- Re-insert attendance for the workers involved
        INSERT INTO visit_attendance (organization_id, visit_id, worker_id)
        VALUES (
            p_org_id,
            p_visit_id,
            (v_payout_item->>'worker_id')::UUID
        );

        -- Insert the concrete payout details
        INSERT INTO payouts (
            organization_id,
            visit_id, 
            worker_id, 
            amount, 
            share_percentage,
            type
        )
        VALUES (
            p_org_id,
            p_visit_id,
            (v_payout_item->>'worker_id')::UUID,
            (v_payout_item->>'amount')::NUMERIC,
            (v_payout_item->>'share_percentage')::NUMERIC,
            (v_payout_item->>'type')::TEXT
        );
    END LOOP;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    -- If any error occurs, PL/pgSQL will automatically ROLLBACK all inserts and updates above.
    RAISE;
END;
$$;
