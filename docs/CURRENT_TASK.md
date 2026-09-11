# CURRENT_TASK

## Registro de lo ejecutado (no es el plan original — ver historial de git para el plan)

Workflow de trabajadores completado de punta a punta: cálculo de reparto
real (ya no hardcodeado), edición completa (`name`, `share_percentage`,
`is_active`, `is_partner`) con gate de owner, toggle de inactivos, y
entrada de navegación alcanzable.

## Paso 0 — hallazgos de la investigación previa a escribir código

1. `profit-service.ts` seguía **100% hardcodeado por nombre** (`"theo"`→60,
   `"sebastian"/"sebastián"`→40, resto→50 puntos), nunca leía
   `share_percentage` a pesar de que la columna existe específicamente
   para reemplazar ese hardcodeo (según el propio comentario de la
   migración). Por regla explícita de esta tarea, migrarlo pasó a ser
   alcance obligatorio.
2. `is_partner` tiene uso real y activo, no vestigial: gate de alta
   (`WorkerForm.tsx`), badge de listado (`WorkerCard.tsx`), **filtro de
   elegibilidad para el reparto** (`profit-service.ts` — solo partners
   reciben algo, sin importar `share_percentage`), y preselección de
   asistentes al completar visita (`CompleteVisitDrawer.tsx`). Se incluyó
   en el mismo formulario de edición — editar `share_percentage` sin
   poder ver/tocar `is_partner` sería una UI engañosa, dado que ambos
   campos están acoplados en el cálculo real.
3. Hallazgo no anticipado por la tarea: no existía ningún mecanismo para
   conocer el `role` del usuario actual (`getUserOrganization()` solo
   trae `organization_id`). Se agregó `getUserRole()` en
   `utils/supabase/queries.ts`, contenido a ese único uso — no se tocó
   `getSupabaseWithOrg()` (usado por toda la app) para no ampliar el
   blast radius de este cambio.

## Decisión de diseño confirmada: semántica de `share_percentage`

Se trata como **peso relativo, renormalizado a 100% entre los partners
seleccionados de esa visita puntual** — mismo comportamiento que el
hardcodeo anterior, solo cambia la fuente del número (ahora
`workers.share_percentage` en vez de un `if/else` por nombre). No se
agregó concepto de remanente sin asignar: si los porcentajes cargados no
suman 100 entre sí, el algoritmo existente (`calculateVisitDistribution`,
sin cambios) los renormaliza igual que siempre hizo con los puntos
hardcodeados.

## Alcance ejecutado

1. **`profit-service.ts`**: `calculateProfitSplit` ahora selecciona
   `share_percentage` de `workers` y lo usa directo como "puntos" en
   `calculateVisitDistribution` — se eliminó el bloque de
   `if (nameLower.includes(...))`.
2. **`getUserRole()`** nuevo en `utils/supabase/queries.ts`, expuesto vía
   `getCurrentUserRole()` en `workers/actions.ts`.
3. **`updateWorker`** como Server Action (`workers/actions.ts`, con
   `createSafeAction` + `EditWorkerSchema`), y extendido en
   `worker-repository.ts`/`worker-service.ts` para aceptar `name`,
   `share_percentage`, `is_active`, `is_partner`.
4. **`EditWorkerForm.tsx`** + **`EditWorkerDrawer.tsx`** (nuevos): mismo
   patrón `useActionState` + `useEffect([state])` que el resto de la app.
   Incluye los 4 campos — `name` se agregó en una segunda pasada, pedido
   explícito para poder corregir un nombre mal cargado después del alta
   (no estaba en el plan original de este drawer).
5. **`WorkerCard.tsx`**: botón de editar (ícono lápiz) envuelto en
   `EditWorkerDrawer`, **oculto por completo si `isOwner` es `false`**
   (no solo deshabilitado) — la UI no ofrece una acción que el backend
   va a rechazar igual.
6. **`workers/page.tsx`**: toggle "Mostrar inactivos"/"Ocultar inactivos"
   vía query param `includeInactive`, resolviendo `getCurrentUserRole()`
   en paralelo con `getWorkers()` para pasar `isOwner` a cada card.
7. **Navegación**: `/workers` ahora es alcanzable. Se investigó primero
   si existía algún componente de menú/overflow en el proyecto — no
   existía ninguno (ni completo ni parcial), y no hay ninguna librería
   de dropdown instalada (`package.json` solo tiene `vaul`, la que ya
   usa `BaseDrawer` en toda la app). `UI_GUIDELINES.md` no define ningún
   patrón de menú secundario. Se descartó agregar una dependencia nueva
   o inventar un dropdown desde cero: **`MoreMenuDrawer.tsx`** (nuevo,
   en `components/ui/`) reutiliza `BaseDrawer` para un 6to ítem "Más" en
   el bottom nav, con 2 links (Inventario, Trabajadores) — mismo
   mecanismo ya instalado en toda la app, coherente con el lenguaje
   visual existente. `layout.tsx`: se sacó el link directo de
   "Inventario" de la barra principal (quedó dentro de "Más" junto con
   "Trabajadores"), quedan en la barra: Inicio, Clientes, Agenda,
   Finanzas, Más.

## Hallazgo de seguridad — NO corregido en esta tarea, derivado a backlog

**La política RLS de `INSERT` en `workers` no restringe el valor de
`share_percentage` por rol**, solo valida `organization_id`. Evidencia
exacta (`supabase/migrations/20260908000000_add_worker_management.sql:29-38`):

```sql
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
```

El único `CHECK` sobre `share_percentage` es el de rango de la columna
(`>= 0 AND <= 100`), sin relación a permisos. La política de `UPDATE` sí
exige `role = 'owner'`, pero un member no-owner **puede crear un worker
nuevo con el `share_percentage` que quiera**, directo por API, sin pasar
por ningún owner — el gate de owner que se construyó en esta tarea
protege la edición, no el alta. No se corrige acá: queda como ítem nuevo
de `docs/AUDIT_BACKLOG.md`, para tratarlo con más cuidado del que
amerita resolverlo apurado al cierre de esta tarea (probablemente
requiere una política de INSERT separada según rol, o mover la
validación de rango/rol a nivel de RPC).

## Verificación

- `tsc --noEmit`: limpio en todas las pasadas (feature completo + campo
  `name` + menú "Más").
- `eslint`: limpio en todos los archivos tocados (mismos 2 warnings
  preexistentes ya documentados en tareas anteriores —
  `exhaustive-deps` intencional en los forms, `emptyToNull` sin uso en
  `schemas.ts` —, nada nuevo).
- **Prueba manual: pendiente de confirmación de Sebastián.** La
  herramienta de navegador de la sesión quedó bloqueada (timeouts),
  igual que en una tarea anterior — se le pasó la guía de prueba
  (edición como owner con impacto real en Finanzas, toggle de
  inactivos, rechazo como member no-owner) para que la corra él mismo
  con su propio servidor, pero no llegó a confirmar el resultado antes
  de pedir los 3 ajustes de esta última vuelta (`name`, RLS, menú
  "Más"). Se abre el PR igual, por pedido explícito, dejando esto
  marcado como no confirmado en vez de darlo por probado.
- Sin framework de testing (ítem 003 de `AUDIT_BACKLOG.md`), no aplica
  test automatizado.

## Flujo git

Rama `feat/worker-management-edit`, creada desde `main` actualizado.
Commit, push, PR. No mergear.
