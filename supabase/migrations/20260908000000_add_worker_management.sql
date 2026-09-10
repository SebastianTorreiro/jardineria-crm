-- Migration: Add worker management support
-- Resolves: workers table has no INSERT/UPDATE policy, no share_percentage column,
-- no soft-delete mechanism. See investigation doc for full diagnosis.
--
-- Scope: Paso 1 (schema) + Paso 2 (RLS) del plan de implementación.
-- Roles completos quedan fuera de esta migración a propósito (Frente 2, a futuro).

-- =========================================================
-- 1. SCHEMA CHANGES
-- =========================================================

ALTER TABLE public.workers
  ADD COLUMN share_percentage numeric(5,2) NOT NULL DEFAULT 0
    CHECK (share_percentage >= 0 AND share_percentage <= 100),
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.workers.share_percentage IS
  'Porcentaje de reparto de ganancias del worker. Reemplaza el hardcodeo por nombre en profit-service.ts.';
COMMENT ON COLUMN public.workers.is_active IS
  'Soft delete. Un worker inactivo no aparece en formularios de alta de visita, pero se conserva para no romper integridad referencial con payouts/visit_attendance.';

-- =========================================================
-- 2. RLS POLICIES
-- =========================================================

-- INSERT: cualquier miembro de la organización puede dar de alta un worker.
-- No se distingue rol acá a propósito — el sistema de roles queda para una
-- migración aparte. Esto solo habilita lo mínimo para que el bug se resuelva.
CREATE POLICY "Users can insert workers in their own organization"
ON public.workers
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE user_id = auth.uid()
  )
);

-- UPDATE: restringido a owners.
-- Razón: share_percentage es un dato sensible (afecta reparto de dinero real).
-- Si cualquier member pudiera editarlo, un worker podría modificar su propio
-- porcentaje o el de otro. Se usa el role='owner' que YA EXISTE en
-- organization_members — no requiere construir el sistema de roles completo,
-- solo aprovechar esta única columna que ya está en producción.
CREATE POLICY "Only owners can update workers in their organization"
ON public.workers
FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE user_id = auth.uid() AND role = 'owner'
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Nota: no se agrega política de DELETE.
-- Con RLS en modo default-deny, esto bloquea cualquier intento de hard delete
-- desde el cliente de sesión normal, forzando el patrón de soft delete
-- (UPDATE is_active = false) como único camino posible. Es una barrera extra,
-- no solo una convención de código.
