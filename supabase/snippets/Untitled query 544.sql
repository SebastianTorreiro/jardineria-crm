SELECT
    schemaname,
    tablename,
    policyname,
    cmd AS operation,        -- SELECT, INSERT, UPDATE, DELETE, ALL
    qual AS using_expression,       -- condición para leer/filtrar filas existentes
    with_check AS with_check_expression  -- condición para validar filas nuevas (INSERT/UPDATE)
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('properties', 'visits', 'clients')
ORDER BY tablename, cmd;