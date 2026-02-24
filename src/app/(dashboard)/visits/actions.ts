'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { CreateVisitSchema, CompleteVisitSchema } from '@/lib/validations/schemas'
import { calculateProfitSplit } from '@/lib/services/profit-service'

// Actions

export const createVisit = createSafeAction(CreateVisitSchema, async (data, ctx) => {
    // Combine date/time
    const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString()

    const { error } = await ctx.supabase.from('visits').insert({
        property_id: data.property_id,
        notes: data.notes,
        scheduled_date: scheduledDate,
        status: 'pending',
        organization_id: ctx.orgId
    })

    if (error) throw error

    revalidatePath('/visits')
    revalidatePath('/')
    return { success: true, message: 'Visita creada correctamente' }
})

export const completeVisit = createSafeAction(CompleteVisitSchema, async (data, ctx) => {
    // 1. Calculate profit split
    const breakdown = await calculateProfitSplit(
        ctx.supabase,
        data.id,
        data.total_price,
        data.direct_expenses,
        data.attendees
    )

    // 2. Execute ATOMIC RPC Transaction
    const payoutsPayload = breakdown.map(item => ({
        worker_id: item.worker_id,
        amount: item.amount,
        share_percentage: item.percentage,
        type: 'share'
    }))

    const { error: rpcError } = await ctx.supabase.rpc('complete_visit_with_payouts', {
        p_visit_id: data.id,
        p_org_id: ctx.orgId,
        p_income: data.total_price,
        p_expenses: data.direct_expenses,
        p_payouts: payoutsPayload as any
    })

    if (rpcError) {
        console.error('RPC Error securing financial records:', rpcError)
        return {
            success: false,
            message: "Error asegurando los registros financieros de esta visita"
        }
    }

    revalidatePath('/visits')
    revalidatePath('/')
    revalidatePath('/finances')

    return { 
        success: true, 
        message: 'Visita completada y ganancias registradas' 
    }
})
export async function getWorkers() {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)

    console.log('🔴 [DEBUG getWorkers] 1. Org ID recuperado:', organizationId)

    if (!organizationId) {
        console.log('🔴 [DEBUG getWorkers] 2. FALLA: No hay organizationId. Retornando [].')
        return []
    }

    const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name')

    console.log('🔴 [DEBUG getWorkers] 3. Datos crudos de Supabase:', data)
    
    if (error) {
        console.error('🔴 [DEBUG getWorkers] 4. ERROR SQL:', error)
        return []
    }

    return data
}
export async function previewVisitProfit(visitId: string, totalPrice: number, directExpenses: number, workerIds: string[]) {
    const supabase = await createClient()
    const breakdown = await calculateProfitSplit(supabase, visitId, totalPrice, directExpenses, workerIds)
    return breakdown
}

export async function getVisits(start: Date, end: Date) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
    console.warn('getVisits: No organization found for user')
    return []
  }

  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      properties (
        address,
        clients (
          name
        )
      )
    `)
    .eq('organization_id', organizationId)
    .gte('scheduled_date', start.toISOString())
    .lte('scheduled_date', end.toISOString())
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching visits:', error)
    return []
  }

  return data
}
