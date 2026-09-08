# Audit Backlog — Jardinería CRM

Lista corrida de hallazgos de auditoría (bugs y mejoras). No es lectura obligatoria
para agentes de código (ver nota abajo) — es el tablero de seguimiento entre vos,
el chat de diseño y los distintos agentes de ejecución.

## Estados
- 🔴 Pendiente
- 🟡 En progreso (CURRENT_TASK.md activo)
- 🟢 Resuelto

## Items

| ID | Módulo | Descripción | Estado | PR/Commit |
|----|--------|-------------|--------|-----------|
| 001 | Visits/Clients/Finances/Inventory | Toast duplicado/triplicado en 6 formularios de alta (dependencia inestable en useEffect) | 🔴 Pendiente | (completar) |
| 002 | AGENTS.md | Ruta `doc/` vs `docs/` inconsistente en jerarquía de fuentes de verdad | 🟢 Resuelto | Completo |
| 003 | Infra | Setup de framework de testing (Vitest + React Testing Library) — prerequisito para poder cumplir la regla 5 de AGENTS.md en cualquier bug fix | 🔴 Pendiente | - |
| 004 | Auth/getSupabaseWithOrg | AuthSessionMissingError sin manejar explícitamente al perder sesión en /inventory — falta confirmar si el error se atrapa y redirige a login o se propaga sin control | 🔴 Pendiente | - |
| 005 | Clients/EditForm | Al editar un cliente, el formulario no se autocompleta con los datos actuales | 🔴 Pendiente | - |
| 006 | Visits/VisitForm | Campo de año en visita nueva acepta más de 4 dígitos y rompe la app — error crudo en pantalla, sin validación ni manejo | 🔴 Pendiente | - |
| 007 | Visits/EditVisitForm | Al editar una visita con horario ya ocupado, el mensaje de error dice "formato de horario inválido" en vez de indicar el conflicto real | 🔴 Pendiente | - |