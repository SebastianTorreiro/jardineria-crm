# Tarea Actual: Refactor del Dashboard (Fase 1)

**Archivo a modificar:** `src/app/(dashboard)/page.tsx`

**Objetivo:** Adaptar el dashboard para que sirva como panel táctico en el teléfono, haciendo la información de la visita hiper-legible.

**Requisitos de Ejecución:**
1. Leer el `user_metadata.name` del usuario logueado en Supabase (o tabla workers) y cambiar el saludo genérico "Bienvenido a Jardinería CRM" a "Hola, [Nombre]".
2. Rediseñar la sección de renderizado "Visitas de Hoy":
   - Las tarjetas de visita deben usar el 100% del ancho del contenedor en móvil (`w-full`).
   - El campo de la base de datos `notes` (observaciones de la poda) debe ser el elemento textual más grande/destacado de la tarjeta.
   - Si `notes` está vacío o es null, mostrar en texto atenuado "Sin observaciones previas".
   - Mantener el botón de completar visita altamente accesible.

**Restricciones:** - NO romper ni alterar los tres cuadros de resumen superior (Métricas).