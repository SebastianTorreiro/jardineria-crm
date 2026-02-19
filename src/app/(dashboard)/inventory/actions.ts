'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'

// --- INTERFACES ---

export interface Tool {
  id: string
  name: string
  brand: string | null
  status: 'ok' | 'service' | 'broken'
  org_id: string
}

export interface Supply {
  id: string
  name: string
  current_stock: number
  min_stock: number
  unit: string
  org_id: string
}

// --- TOOLS ---

export async function getTools(query?: string): Promise<Tool[]> {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)
  
  if (!organizationId) return []

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

  // Map database fields to interface
  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    status: mapDbStatusToToolStatus(item.status),
    org_id: item.organization_id 
  }))
}

function mapDbStatusToToolStatus(dbStatus: string): 'ok' | 'service' | 'broken' {
    switch (dbStatus) {
        case 'available': return 'ok'
        case 'maintenance': return 'service'
        case 'broken': return 'broken'
        default: return 'ok'
    }
}

function mapToolStatusToDbStatus(status: 'ok' | 'service' | 'broken'): 'available' | 'maintenance' | 'broken' {
    switch (status) {
        case 'ok': return 'available'
        case 'service': return 'maintenance'
        case 'broken': return 'broken'
        default: return 'available'
    }
}

export async function createTool(formData: FormData) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)
  
  if (!organizationId) {
      return { error: 'Organization not found' }
  }

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const rawStatus = formData.get('status') as string
  
  // Map input status to DB status
  let dbStatus: 'available' | 'maintenance' | 'broken' = 'available'
  if (rawStatus === 'ok' || rawStatus === 'available') dbStatus = 'available'
  else if (rawStatus === 'service' || rawStatus === 'maintenance') dbStatus = 'maintenance'
  else if (rawStatus === 'broken') dbStatus = 'broken'

  if (!name) {
    return { error: 'Name is required' }
  }

  const { error } = await supabase.from('tools').insert({
    organization_id: organizationId,
    name,
    brand,
    status: dbStatus,
  })

  if (error) {
    console.error('Error creating tool:', error)
    return { error: 'Failed to create tool' }
  }

  revalidatePath('/inventory')
  return { success: true }
}

export async function updateToolStatus(id: string, status: 'ok' | 'service' | 'broken') {
  const supabase = await createClient()
  
  const dbStatus = mapToolStatusToDbStatus(status)

  const { error } = await supabase
    .from('tools')
    .update({ status: dbStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating tool status:', error)
    return { error: 'Failed to update tool status' }
  }

  revalidatePath('/inventory')
  return { success: true }
}

// --- SUPPLIES ---

export async function getSupplies(query?: string): Promise<Supply[]> {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)
    
    if (!organizationId) return []
  
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
  
    return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        current_stock: item.current_stock,
        min_stock: item.min_stock,
        unit: item.unit,
        org_id: item.organization_id
    }))
  }

export async function createSupply(formData: FormData) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)
    
    if (!organizationId) {
        return { error: 'Organization not found' }
    }
  
    const name = formData.get('name') as string
    const current_stock = parseInt(formData.get('current_stock') as string)
    const min_stock = parseInt(formData.get('min_stock') as string)
    const unit = formData.get('unit') as string
  
    if (!name) {
      return { error: 'Name is required' }
    }
  
    const { error } = await supabase.from('supplies').insert({
      organization_id: organizationId,
      name,
      current_stock: isNaN(current_stock) ? 0 : current_stock,
      min_stock: isNaN(min_stock) ? 0 : min_stock,
      unit: unit || 'units',
    })
  
    if (error) {
      console.error('Error creating supply:', error)
      return { error: 'Failed to create supply' }
    }
  
    revalidatePath('/inventory')
    return { success: true }
  }

  export async function updateSupplyStock(id: string, quantity: number) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('supplies')
      .update({ current_stock: quantity })
      .eq('id', id)
  
    if (error) {
      console.error('Error updating supply stock:', error)
      return { error: 'Failed to update stock' }
    }
  
    revalidatePath('/inventory')
    return { success: true }
  }
