import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types' // O la ruta donde tengas tus tipos

export const getUserOrganization = async (supabase: SupabaseClient<Database>) => {
  // 1. Obtener el usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  // 2. Buscar en la tabla CORRECTA (organization_members)
  // Antes esto decía .from('memberships') -> ESO ERA EL ERROR
  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // PGRST116 = "No rows returned": el usuario genuinamente no tiene org todavía.
    if (error.code === 'PGRST116') {
      return null
    }
    // Cualquier otro error es una falla técnica real: se propaga, no se traga.
    throw error
  }

  return data?.organization_id ?? null
}