import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function getWorkers(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  includeInactive: boolean = false
) {
  let query = supabase
    .from('workers')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name')

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  return { data, error }
}

export async function createWorker(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    name: string
    is_partner: boolean
  }
) {
  const { error } = await supabase.from('workers').insert({
    organization_id: organizationId,
    name: data.name,
    is_partner: data.is_partner,
  })

  return { error }
}

export async function updateWorker(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  workerId: string,
  data: {
    name?: string
    share_percentage?: number
    is_active?: boolean
    is_partner?: boolean
  }
) {
  const { error } = await supabase
    .from('workers')
    .update(data)
    .eq('id', workerId)
    .eq('organization_id', organizationId)

  return { error }
}
