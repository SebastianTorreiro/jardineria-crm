# Estado del Proyecto: Jardinería CRM (Todo Verde)

## Stack Tecnológico Estricto
- **Framework:** Next.js 15 (App Router) / React 19.
- **Estilos:** Tailwind CSS (Sistema Emerald/Slate).
- **Backend/DB:** Supabase (PostgreSQL) directo. NO existe backend intermedio de Node/NestJS.
- **Validación:** Zod + React Hook Form.

## Reglas Arquitectónicas Inflexibles
1. **Mutaciones de Datos (RPC):** Toda escritura a Supabase se hace a través de Server Actions usando el wrapper de seguridad `createSafeAction` en `src/lib/safe-action.ts`.
2. **Seguridad (RLS):** Todas las tablas tienen Row Level Security. No se inserta código que eluda el `organization_id` del usuario activo.
3. **UI Mobile-First:** El entorno de producción es la calle (teléfonos móviles). Quedan estrictamente prohibidas las tablas (`<table>`) en vistas móviles. Se usa el patrón "Responsive Data Cards".
4. **Resiliencia (Suspense):** Toda carga de datos debe estar protegida por `loading.tsx` (Skeletons) y `error.tsx` (Error Boundaries) para evitar bloqueos de renderizado.
5. **Composición de Modales:** Los formularios nunca se hardcodean en la página. Usan `BaseDrawer` y `FloatingActionButton`.