# CURRENT_TASK

## Objetivo
Dejar operativa la metodología de documentación cross-agente. Esta tarea es
exclusivamente de documentación/configuración: no toca código de src/, supabase/
ni ningún archivo de producto.

## Alcance (archivos permitidos)
- AGENTS.md (editar)
- CLAUDE.md, GEMINI.md, docs/AUDIT_BACKLOG.md (ya existen sin trackear — agregar a git)
- docs/CURRENT_TASK.md (este archivo, se commitea como parte del cambio)

No toques ningún otro archivo. Si creés que algo más necesita cambiar, no lo hagas:
anotalo como comentario en la descripción del PR para revisión posterior.

## Cambios requeridos en AGENTS.md

1. Corregir las 4 apariciones de la ruta `doc/` a `docs/` (typo real: la carpeta
   del repo se llama `docs/`, no `doc/`). Estas rutas aparecen en la sección
   "1. Source-of-Truth Priority" y en "2. Required Reading Before Editing".

2. En la sección "4. Minimum Verification Protocol", agregar un punto 5:
   "5. **Testing**: any bug fix must include a regression test covering the
   failure mode that was fixed."

No cambies nada más del contenido de AGENTS.md.

## Flujo git
1. Crear rama `chore/cross-agent-docs-setup` desde main.
2. Aplicar los dos cambios de AGENTS.md.
3. `git add` de CLAUDE.md, GEMINI.md, docs/AUDIT_BACKLOG.md, docs/CURRENT_TASK.md
   y AGENTS.md.
4. Commit con mensaje: `docs: fix doc/docs path typo, add testing rule, add
   cross-agent instruction files`.
5. Push de la rama.
6. Abrir Pull Request hacia main con la descripción de qué se cambió y por qué.

## Detenerse acá
No mergear el PR. Dejarlo abierto para revisión humana. Esto aplica siempre,
no solo a esta tarea — está definido como regla del proyecto.

## Verificación antes de abrir el PR
- Confirmar que no quedó ninguna ocurrencia de `doc/` (singular) en AGENTS.md
  (buscar el string exacto).
- Confirmar que CLAUDE.md y GEMINI.md quedaron agregados al PR (estaban
  untracked antes de esta tarea).