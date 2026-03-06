import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function getTools(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  query?: string | null
) {
  let dbQuery = supabase
    .from('tools')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name', { ascending: true })

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error fetching tools:', error)
    return []
  }
  return data || []
}

export async function createTool(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    name: string
    brand?: string | null
    status: 'available' | 'maintenance' | 'broken'
  }
) {
  const { error } = await supabase.from('tools').insert({
    organization_id: organizationId,
    name: data.name,
    brand: data.brand,
    status: data.status
  })

  if (error) throw error
  return { success: true, message: 'Tool created successfully' }
}

export async function updateToolStatus(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  toolId: string,
  status: 'available' | 'maintenance' | 'broken'
) {
  const { error } = await supabase
    .from('tools')
    .update({ status })
    .eq('id', toolId)
    .eq('organization_id', organizationId)

  if (error) throw error
  return { success: true, message: 'Status updated' }
}

export async function getSupplies(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  query?: string | null
) {
  let dbQuery = supabase
    .from('supplies')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name', { ascending: true })

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error fetching supplies:', error)
    return []
  }

  return data || []
}

export async function createSupply(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    name: string
    current_stock: number
    min_stock: number
    unit: string
  }
) {
  const { error } = await supabase.from('supplies').insert({
    organization_id: organizationId,
    name: data.name,
    current_stock: data.current_stock,
    min_stock: data.min_stock,
    unit: data.unit
  })

  if (error) throw error
  return { success: true, message: 'Supply created successfully' }
}

export async function updateSupplyStock(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  supplyId: string,
  quantity: number
) {
  const { error } = await supabase
    .from('supplies')
    .update({ current_stock: quantity })
    .eq('id', supplyId)
    .eq('organization_id', organizationId)

  if (error) throw error
  return { success: true, message: 'Stock updated' }
}
