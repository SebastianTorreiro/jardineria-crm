'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfMonth, endOfMonth, parseISO } from 'date-fns'

export async function getVisits(start: Date, end: Date) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization()

  if (!organizationId) {
    throw new Error('No organization found')
  }

  // Convert dates to ISO strings for Supabase comparison
  const startIso = start.toISOString()
  const endIso = end.toISOString()

  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      properties!inner (
        address,
        clients!inner (
          name,
          phone
        )
      )
    `)
    .eq('organization_id', organizationId)
    .gte('scheduled_date', startIso)
    .lte('scheduled_date', endIso)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('getVisits Error:', JSON.stringify(error, null, 2))
    throw new Error('Failed to fetch visits')
  }

  return data
}

export async function createVisit(formData: FormData) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization()

  if (!organizationId) {
    throw new Error('No organization found')
  }

  const propertyId = formData.get('property_id') as string
  const dateStr = formData.get('date') as string
  const notes = formData.get('notes') as string

  if (!propertyId || !dateStr) {
    return { error: 'Propiedad y fecha son requeridas' }
  }

  const { error } = await supabase.from('visits').insert({
    organization_id: organizationId,
    property_id: propertyId,
    scheduled_date: dateStr,
    start_time: (formData.get('time') as string) || null,
    status: 'pending',
    notes: notes || null,
  })

  if (error) {
    console.error('createVisit Error:', JSON.stringify(error, null, 2))
    return { error: 'Failed to create visit' }
  }

  revalidatePath('/visits')
  return { success: true }
}
