'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ToolSchema, SupplySchema, ToolInput, SupplyInput } from '@/lib/validations/schemas'
import { Database } from '@/types/database.types'
import { z } from 'zod'

// --- INTERFACES (Mapped from Schema) ---
export type Tool = ToolInput & { id: string, org_id: string }
export type Supply = SupplyInput & { id: string, org_id: string }

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
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    status: mapDbStatusToToolStatus(item.status),
    org_id: item.organization_id 
  }))
}

// Mappers
function mapDbStatusToToolStatus(dbStatus: string): 'ok' | 'service' | 'broken' {
    switch (dbStatus) {
        case 'available': return 'ok'
        case 'maintenance': return 'service'
        case 'broken': return 'broken'
        default: return 'ok'
    }
}

function mapToolStatusToDbStatus(status: string): 'available' | 'maintenance' | 'broken' {
    switch (status) {
        case 'ok': return 'available'
        case 'service': return 'maintenance'
        case 'broken': return 'broken'
        case 'available': return 'available'
        case 'maintenance': return 'maintenance'
        default: return 'available'
    }
}

// Actions
export const createTool = createSafeAction(ToolSchema, async (data, ctx) => {
    const dbStatus = mapToolStatusToDbStatus(data.status)
    
    const { error } = await ctx.supabase.from('tools').insert({
        organization_id: ctx.orgId,
        name: data.name,
        brand: data.brand,
        status: dbStatus
    })

    if (error) throw error

    revalidatePath('/inventory')
    return { success: true, message: 'Tool created successfully' }
})

const UpdateToolStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['ok', 'service', 'broken', 'available', 'maintenance'])
})

export const updateToolStatus = createSafeAction(UpdateToolStatusSchema, async (data, ctx) => {
    const dbStatus = mapToolStatusToDbStatus(data.status)

    const { error } = await ctx.supabase
        .from('tools')
        .update({ status: dbStatus })
        .eq('id', data.id)
        .eq('organization_id', ctx.orgId) // Security check

    if (error) throw error

    revalidatePath('/inventory')
    return { success: true, message: 'Status updated' }
})


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
  
    return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        current_stock: item.current_stock,
        min_stock: item.min_stock,
        unit: item.unit,
        org_id: item.organization_id
    }))
}

export const createSupply = createSafeAction(SupplySchema, async (data, ctx) => {
    const { error } = await ctx.supabase.from('supplies').insert({
        organization_id: ctx.orgId,
        name: data.name,
        current_stock: data.current_stock,
        min_stock: data.min_stock,
        unit: data.unit
    })

    if (error) throw error

    revalidatePath('/inventory')
    return { success: true, message: 'Supply created successfully' }
})

const UpdateSupplyStockSchema = z.object({
    id: z.string().uuid(),
    quantity: z.coerce.number().int().min(0)
})

export const updateSupplyStock = createSafeAction(UpdateSupplyStockSchema, async (data, ctx) => {
    const { error } = await ctx.supabase
        .from('supplies')
        .update({ current_stock: data.quantity })
        .eq('id', data.id)
        .eq('organization_id', ctx.orgId)

    if (error) throw error

    revalidatePath('/inventory')
    return { success: true, message: 'Stock updated' }
})

