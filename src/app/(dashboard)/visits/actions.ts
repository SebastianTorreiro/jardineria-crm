'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserOrganization } from '@/utils/supabase/queries'

export async function createVisit(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Obtener la organización pasando el cliente
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
    return { error: 'No se encontró la organización' }
  }

  const propertyId = formData.get('property_id') as string
  const notes = formData.get('notes') as string
  const dateStr = formData.get('date') as string // YYYY-MM-DD
  const timeStr = formData.get('time') as string // HH:mm

  // Combinar fecha y hora en un timestamp ISO
  const scheduledDate = new Date(`${dateStr}T${timeStr}:00`).toISOString()

  const { error } = await supabase.from('visits').insert({
    property_id: propertyId,
    notes: notes,
    scheduled_date: scheduledDate,
    status: 'pending',
    organization_id: organizationId // Usamos el ID obtenido
  })

  if (error) {
    console.error('Error creating visit:', error)
    return { error: 'Error al crear la visita' }
  }

  revalidatePath('/visits')
  revalidatePath('/')
  return { success: true }
}

export async function completeVisit(formData: FormData) {
  const supabase = await createClient()
  
  // Validamos organización también aquí por seguridad
  const organizationId = await getUserOrganization(supabase)
  if (!organizationId) return { error: 'Unauthorized' }

  const id = formData.get('id') as string
  const realIncome = formData.get('real_income')
  const notes = formData.get('notes') as string

  const { error } = await supabase
    .from('visits')
    .update({
      status: 'completed',
      real_income: parseFloat(realIncome as string),
      notes: notes, // Podrías concatenar si quisieras conservar la nota anterior
      completed_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('organization_id', organizationId) // Seguridad extra

  if (error) {
    console.error('Error completing visit:', error)
    return { error: 'Failed to complete' }
  }

  revalidatePath('/visits')
  revalidatePath('/')
  return { success: true }
}

export async function getVisits(start: Date, end: Date) {
  const supabase = await createClient()

  // 1. AQUÍ ESTABA EL ERROR: Pasamos 'supabase' como argumento
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
    // Si no hay org, devolvemos array vacío en vez de romper todo
    console.warn('getVisits: No organization found for user')
    return []
  }

  const { data, error } = await supabase
    .from('visits')
    .select('*')
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