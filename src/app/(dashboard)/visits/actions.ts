'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { CreateVisitSchema, CompleteVisitSchema, UpdateVisitSchema, DeleteVisitSchema } from '@/lib/validations/schemas'
import { calculateProfitSplit } from '@/lib/services/profit-service'
import {
  createVisit as createVisitService,
  updateVisit as updateVisitService,
  deleteVisit as deleteVisitService,
  completeVisit as completeVisitService,
  getWorkers as getWorkersService,
  getVisits as getVisitsService
} from '@/lib/services/visit-service'

// Actions

export const createVisit = createSafeAction(CreateVisitSchema, async (data, ctx) => {
    const result = await createVisitService(ctx.supabase, ctx.orgId, data)
    
    if (!result.success) return result

    revalidatePath('/visits')
    revalidatePath('/')
    return result
})

export const updateVisit = createSafeAction(UpdateVisitSchema, async (data, ctx) => {
    const result = await updateVisitService(ctx.supabase, ctx.orgId, data)
    
    revalidatePath('/visits')
    revalidatePath('/')
    return result
})

export const deleteVisit = createSafeAction(DeleteVisitSchema, async (data, ctx) => {
    const result = await deleteVisitService(ctx.supabase, ctx.orgId, data.id)

    revalidatePath('/visits')
    revalidatePath('/')
    return result
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

    // 2. Prepare Payload
    const payoutsPayload = breakdown.map(item => ({
        worker_id: item.worker_id,
        amount: item.amount,
        share_percentage: item.percentage,
        type: 'share'
    }))

    const result = await completeVisitService(ctx.supabase, ctx.orgId, data, payoutsPayload)

    if (!result.success) return result

    revalidatePath('/visits')
    revalidatePath('/')
    revalidatePath('/finances')

    return result
})
export async function getWorkers() {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)

    if (!organizationId) {
        return []
    }

    return getWorkersService(supabase, organizationId)
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

  return getVisitsService(supabase, organizationId, start, end)
}
