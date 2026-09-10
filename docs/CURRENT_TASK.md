# CURRENT_TASK

## Registro de lo ejecutado (no es el plan original — ver historial de git para el plan)

Alta/gestión mínima de trabajadores, sobre el schema ya migrado
(`share_percentage`, `is_active`, políticas RLS —
`supabase/migrations/20260908000000_add_worker_management.sql`, aplicada
en un commit previo de esta misma rama).

## Paso 0 — hallazgos de la investigación previa a escribir código

- Patrón de referencia usado: `dashboard-repository.ts` + `dashboard-service.ts`
  (repository devuelve `{ data, error }` crudo sin interpretar ni lanzar;
  service interpreta y es la única capa que lanza).
- `getWorkers()` (antes en `visit-service.ts`) **no** seguía ese patrón: hacía
  la query a Supabase directo desde la capa service, sin repository
  intermedio, y tragaba el error devolviendo `[]` en silencio. No es un caso
  aislado — `getExpenses`/`getMonthlyFinancialSummary` en `finance-service.ts`
  hacen lo mismo — pero no es el patrón completo que sí tiene `dashboard`. Se
  usó el patrón de `dashboard` para el código nuevo, no el atajo existente.
- **Corrección a la premisa original**: la tarea asumía "3 imports existentes
  de `getWorkers()`" a actualizar (`CompleteVisitDrawer.tsx`,
  `finance-service.ts`, `profit-service.ts`). Verificado con grep: solo
  `CompleteVisitDrawer.tsx` (vía el wrapper en `visits/actions.ts`) llama a
  `getWorkers()` realmente. `finance-service.ts` y `profit-service.ts`
  consultan la tabla `workers` directo, con sus propias queries — no pasan
  por `getWorkers()` y no se tocaron.
- `full_db_types.ts`: confirmado sin ningún importador en `src/` (ni
  siquiera tenía la tabla `workers` — quedó de un snapshot más viejo que
  `src/types/database.types.ts`, que sí está actualizado). **Eliminado.**
- `schema.sql` sigue desactualizado (no refleja `share_percentage`/
  `is_active`). No se tocó — no estaba en el alcance — pero se usó
  `database.types.ts` como fuente real en vez de `schema.sql` para no
  hallucinar el shape de `workers`.

## Decisiones tomadas en el camino (confirmadas con Sebastián antes de implementar)

1. `getWorkers()` trae por default solo `is_active = true`, con parámetro
   `includeInactive` (default `false`) para incluir inactivos.
2. Alcance recortado explícitamente:
   - Construido: `updateWorker()` en repository + service (misma firma que
     `createWorker`), **sin ninguna UI que lo llame todavía** — queda listo
     para la siguiente tarea (edición de `share_percentage`/`is_active`).
   - Construido: página mínima `/workers` — listado en cards responsivas
     (nombre, badge Socio, badge Activo/Inactivo) + botón para abrir el
     drawer de alta. Sin edición, sin checkbox de mostrar inactivos.
   - `WorkerSchema` cubre solo alta (`name`, `is_partner`). No incluye
     `share_percentage`/`is_active` — eso lo valida el schema de la tarea
     de edición.

## Archivos tocados

**Nuevos:**
- `src/lib/repositories/worker-repository.ts`
- `src/lib/services/worker-service.ts`
- `src/app/(dashboard)/workers/actions.ts` (`getWorkers`, `createWorker`)
- `src/app/(dashboard)/workers/page.tsx`, `loading.tsx`, `error.tsx`
- `src/components/workers/WorkerForm.tsx`, `NewWorkerDrawer.tsx`, `WorkerCard.tsx`
- `WorkerSchema` en `src/lib/validations/schemas.ts`

**Editados:**
- `src/lib/services/visit-service.ts` — se quitó `getWorkers()`.
- `src/app/(dashboard)/visits/actions.ts` — se quitó el wrapper `getWorkers()`.
- `src/components/visits/CompleteVisitDrawer.tsx` — el import dinámico de
  `getWorkers` ahora apunta a `@/app/(dashboard)/workers/actions`.

**Eliminados:**
- `full_db_types.ts` (raíz).

## Decisión no resuelta, señalada para revisión

La ruta `/workers` **no está enlazada** desde el nav inferior
(`layout.tsx`) — solo es alcanzable por URL directa. No se agregó el link
para no tocar un archivo compartido fuera del alcance explícito de esta
tarea ni asumir una decisión de UX/navegación sin consultar. Pendiente de
decidir en una próxima tarea.

## Verificación realizada

- `tsc --noEmit`: limpio en todos los archivos de esta tarea. **Se encontraron
  6 errores de TypeScript preexistentes, no relacionados**, en
  `finances/page.tsx`, `inventory/actions.ts` (x2), `dashboard-service.ts`
  (x2) y `finance-service.ts` (x2) — causados por la regeneración de
  `database.types.ts` del commit de la migración (nullability más estricta
  en columnas que antes no la tenían). Confirmado con `git stash` que ya
  existían antes de esta tarea. No se tocaron — fuera de alcance — pero
  quedan señalados acá porque rompen el build de tipos del proyecto entero.
- `eslint`: limpio en los archivos nuevos/editados de esta tarea (aparte del
  warning esperado de `exhaustive-deps` en `WorkerForm.tsx`, igual al patrón
  ya aprobado en la tarea del toast en cascada). Los demás errores que
  aparecen al lintear `CompleteVisitDrawer.tsx`/`visit-service.ts` son
  preexistentes (`any` sin relación a esta tarea).
- Prueba manual end-to-end en navegador (Supabase local + usuario de prueba
  creado y luego borrado): alta de trabajador (single toast, sin
  duplicados) → creación de cliente/visita → **completar la visita
  seleccionando el trabajador recién creado — funciona, ya no está
  bloqueado** → visita pasa a Historial como "Cobrado" → `/finances`
  muestra el ingreso y la distribución de utilidades correcta con el
  trabajador real. Confirma que los dos consumidores reales de la tabla
  `workers` (`profit-service.ts`, `finance-service.ts`) siguen funcionando
  después de la mudanza.
- **No verificado** (queda para la tarea de edición): rechazo de RLS al
  intentar `updateWorker()` como member no-owner — no hay UI en esta tarea
  que ejercite ese camino.
- Sin framework de testing instalado (ítem 003 de `AUDIT_BACKLOG.md`), no
  aplica test automatizado de regresión.

## Flujo git

Rama `feat/worker-management`. Commit de este trabajo, push, PR abierto.
**No mergeado** — queda para revisión de Sebastián.
