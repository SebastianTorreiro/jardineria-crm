'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { CreateVisitSchema, CompleteVisitSchema, CreateVisitInput, CompleteVisitInput } from '@/lib/validations/schemas'

export type Visit = { id: string } // Minimal type, usually visits are part of a view

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
    return { success: true, message: 'Visit created' }
})

export const completeVisit = createSafeAction(CompleteVisitSchema, async (data, ctx) => {
    const { error } = await ctx.supabase
        .from('visits')
        .update({
            status: 'completed',
            real_income: data.real_income,
            notes: data.notes,
            completed_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .eq('organization_id', ctx.orgId)

    if (error) throw error

    revalidatePath('/visits')
    revalidatePath('/')
    return { success: true, message: 'Visit completed' }
})


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
