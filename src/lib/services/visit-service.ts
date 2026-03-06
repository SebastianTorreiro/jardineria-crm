import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function createVisit(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    property_id: string
    date: string
    time: string
    start_time: string
    estimated_income?: number | null
    estimated_duration_mins: number
    notes?: string | null
  }
) {
    const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString()

    // 1. Backend Collision Detection
    const startOfDay = new Date(`${data.date}T00:00:00`).toISOString()
    const endOfDay = new Date(`${data.date}T23:59:59.999`).toISOString()

    const { data: dayVisits, error: fetchError } = await supabase
        .from('visits')
        .select('id, scheduled_date, start_time, estimated_duration_mins')
        .eq('organization_id', organizationId)
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

    const { error } = await supabase.from('visits').insert({
        property_id: data.property_id,
        notes: data.notes,
        scheduled_date: scheduledDate,
        start_time: data.start_time,
        estimated_income: data.estimated_income ?? null,
        estimated_duration_mins: data.estimated_duration_mins,
        status: 'pending',
        organization_id: organizationId
    })

    if (error) throw error
    return { success: true, message: 'Visita creada correctamente' }
}

export async function updateVisit(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    id: string
    property_id: string
    date: string
    time: string
    notes?: string | null
  }
) {
    const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString()

    const { error } = await supabase
        .from('visits')
        .update({
            property_id: data.property_id,
            notes: data.notes,
            scheduled_date: scheduledDate
        })
        .match({ id: data.id, organization_id: organizationId, status: 'pending' })

    if (error) throw error
    return { success: true, message: 'Visita actualizada correctamente' }
}

export async function deleteVisit(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  id: string
) {
    const { error } = await supabase
        .from('visits')
        .delete()
        .match({ id, organization_id: organizationId, status: 'pending' })

    if (error) throw error
    return { success: true, message: 'Visita eliminada correctamente' }
}

export async function completeVisit(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    id: string
    total_price: number
    direct_expenses: number
    notes_after_visit?: string | null
  },
  payoutsPayload: any[]
) {
    if (data.notes_after_visit) {
        const { error: updateError } = await supabase
            .from('visits')
            .update({ notes_after_visit: data.notes_after_visit })
            .eq('id', data.id)
            .eq('organization_id', organizationId);
            
        if (updateError) {
            console.error('Error saving visit notes:', updateError);
        }
    }

    const { error: rpcError } = await supabase.rpc('complete_visit_with_payouts', {
        p_visit_id: data.id,
        p_org_id: organizationId,
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

    return { 
        success: true, 
        message: 'Visita completada y ganancias registradas' 
    }
}

export async function getWorkers(supabase: SupabaseClient<Database>, organizationId: string) {
    const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name')
    if (error) return []
    return data || []
}

export async function getVisits(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  start: Date,
  end: Date
) {
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
  
    return data || []
}
