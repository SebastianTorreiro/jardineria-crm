'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { CreateVisitSchema, CompleteVisitSchema, UpdateVisitSchema, DeleteVisitSchema } from '@/lib/validations/schemas'
import { calculateProfitSplit } from '@/lib/services/profit-service'

// Actions

export const createVisit = createSafeAction(CreateVisitSchema, async (data, ctx) => {
    // Combine date/time
    const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString()

    // 1. Backend Collision Detection (Interval Engine)
    const startOfDay = new Date(`${data.date}T00:00:00`).toISOString()
    const endOfDay = new Date(`${data.date}T23:59:59.999`).toISOString()

    const { data: dayVisits, error: fetchError } = await ctx.supabase
        .from('visits')
        .select('id, scheduled_date, start_time, estimated_duration_mins')
        .eq('organization_id', ctx.orgId)
        .gte('scheduled_date', startOfDay)
        .lte('scheduled_date', endOfDay)

    if (fetchError) throw fetchError

    const [newHours, newMinutes] = data.time.split(':').map(Number)
    const newStartMins = newHours * 60 + newMinutes
    const newEndMins = newStartMins + data.estimated_duration_mins

    if (dayVisits) {
        for (const visit of dayVisits) {
            const timeString = visit.start_time || '00:00'
            const [existingHours, existingMinutes] = timeString.split(':').map(Number)
            const existingStartMins = existingHours * 60 + existingMinutes
            const existingDuration = visit.estimated_duration_mins || 60
            const existingEndMins = existingStartMins + existingDuration

            if (newStartMins < existingEndMins && newEndMins > existingStartMins) {
                return { 
                    success: false, 
                    message: "Superposición detectada: Ya hay una visita en ese rango horario." 
                }
            }
        }
    }

    const { error } = await ctx.supabase.from('visits').insert({
        property_id: data.property_id,
        notes: data.notes,
        scheduled_date: scheduledDate,
        start_time: data.start_time,
        estimated_income: data.estimated_income ?? null,
        estimated_duration_mins: data.estimated_duration_mins,
        status: 'pending',
        organization_id: ctx.orgId
    })

    if (error) throw error

    revalidatePath('/visits')
    revalidatePath('/')
    return { success: true, message: 'Visita creada correctamente' }
})

export const updateVisit = createSafeAction(UpdateVisitSchema, async (data, ctx) => {
    const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString()

    const { error } = await ctx.supabase
        .from('visits')
        .update({
            property_id: data.property_id,
            notes: data.notes,
            scheduled_date: scheduledDate
        })
        .match({ id: data.id, organization_id: ctx.orgId, status: 'pending' })

    if (error) throw error

    revalidatePath('/visits')
    revalidatePath('/')
    return { success: true, message: 'Visita actualizada correctamente' }
})

export const deleteVisit = createSafeAction(DeleteVisitSchema, async (data, ctx) => {
    const { error } = await ctx.supabase
        .from('visits')
        .delete()
        .match({ id: data.id, organization_id: ctx.orgId, status: 'pending' })

    if (error) throw error

    revalidatePath('/visits')
    revalidatePath('/')
    return { success: true, message: 'Visita eliminada correctamente' }
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

    if (data.notes_after_visit) {
        const { error: updateError } = await ctx.supabase
            .from('visits')
            .update({ notes_after_visit: data.notes_after_visit })
            .eq('id', data.id)
            .eq('organization_id', ctx.orgId);
            
        if (updateError) {
            console.error('Error saving visit notes:', updateError);
        }
    }

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
