import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types' // O la ruta donde tengas tus tipos

export const getUserOrganization = async (supabase: SupabaseClient<Database>) => {
  try {
    // 1. Obtener el usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('getUserOrganization: No user found', userError)
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
      // Si no encuentra fila, no es necesariamente un error crítico, 
      // significa que el usuario no tiene org todavía.
      if (error.code !== 'PGRST116') { // PGRST116 es "No rows returned"
          console.error('getUserOrganization: Error fetching membership', error)
      }
      return null
    }

    return data?.organization_id

  } catch (error) {
    console.error('getUserOrganization: Unexpected error', error)
    return null
  }
}