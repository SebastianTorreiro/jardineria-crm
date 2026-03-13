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
    // 1. Backend Collision Detection on the EXACT same local date to prevent timezone drift
    const { data: dayVisits, error: fetchError } = await supabase
        .from('visits')
        .select('id, scheduled_date, start_time, estimated_duration_mins')
        .eq('organization_id', organizationId)
        .eq('scheduled_date', data.date)

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
        scheduled_date: data.date, // Exact YYYY-MM-DD
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
    // 1. Fetch current visit to get its duration
    const { data: currentVisit, error: currentVisitError } = await supabase
        .from('visits')
        .select('estimated_duration_mins')
        .eq('id', data.id)
        .eq('organization_id', organizationId)
        .single()
        
    if (currentVisitError) throw currentVisitError
    const durationMins = currentVisit.estimated_duration_mins || 60

    // 2. Fetch other visits on the same exact date for collision detection
    const { data: dayVisits, error: fetchError } = await supabase
        .from('visits')
        .select('id, start_time, estimated_duration_mins')
        .eq('organization_id', organizationId)
        .eq('scheduled_date', data.date)
        .neq('id', data.id)

    if (fetchError) throw fetchError

    const [newHours, newMinutes] = data.time.split(':').map(Number)
    const newStartMins = newHours * 60 + newMinutes
    const newEndMins = newStartMins + durationMins

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

    const { error } = await supabase
        .from('visits')
        .update({
            property_id: data.property_id,
            notes: data.notes,
            scheduled_date: data.date,
            start_time: data.time
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
