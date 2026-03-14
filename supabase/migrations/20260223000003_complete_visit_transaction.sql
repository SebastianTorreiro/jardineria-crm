-- Transactional RPC for atomic completion of a visit.
-- Aligned with the real remote schema: payouts has no `type` column.

CREATE OR REPLACE FUNCTION public.complete_visit_with_payouts(
    p_visit_id uuid,
    p_org_id uuid,
    p_income numeric,
    p_expenses numeric,
    p_payouts jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_visit public.visits%ROWTYPE;
    v_payout_item jsonb;
BEGIN
    SELECT *
    INTO v_visit
    FROM public.visits
    WHERE id = p_visit_id
      AND organization_id = p_org_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Visit not found or does not belong to your organization';
    END IF;

    IF p_payouts IS NULL OR jsonb_typeof(p_payouts) <> 'array' THEN
        RAISE EXCEPTION 'p_payouts must be a JSON array';
    END IF;

    UPDATE public.visits
    SET
        status = 'completed'::public.visit_status,
        total_price = p_income,
        direct_expenses = p_expenses,
        completed_at = COALESCE(completed_at, now()),
        updated_at = now()
    WHERE id = p_visit_id
      AND organization_id = p_org_id;

    -- Re-submitting completion data should replace prior attendance/payout rows
    DELETE FROM public.visit_attendance
    WHERE visit_id = p_visit_id;

    DELETE FROM public.payouts
    WHERE visit_id = p_visit_id;

    FOR v_payout_item IN
        SELECT value
        FROM jsonb_array_elements(p_payouts)
    LOOP
        INSERT INTO public.visit_attendance (
            organization_id,
            visit_id,
            worker_id
        )
        VALUES (
            p_org_id,
            p_visit_id,
            (v_payout_item->>'worker_id')::uuid
        )
        ON CONFLICT (visit_id, worker_id) DO NOTHING;

        INSERT INTO public.payouts (
            organization_id,
            visit_id,
            worker_id,
            amount,
            share_percentage
        )
        VALUES (
            p_org_id,
            p_visit_id,
            (v_payout_item->>'worker_id')::uuid,
            (v_payout_item->>'amount')::numeric,
            (v_payout_item->>'share_percentage')::numeric
        )
        ON CONFLICT (visit_id, worker_id) DO UPDATE
        SET
            amount = EXCLUDED.amount,
            share_percentage = EXCLUDED.share_percentage;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'visit_id', p_visit_id
    );
END;
$$;
