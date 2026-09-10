import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import {
  getWorkers as getWorkersRepo,
  createWorker as createWorkerRepo,
  updateWorker as updateWorkerRepo,
} from '../repositories/worker-repository'

export async function getWorkers(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  includeInactive: boolean = false
) {
  const { data, error } = await getWorkersRepo(supabase, organizationId, includeInactive)
  if (error) throw error
  return data || []
}

export async function createWorker(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    name: string
    is_partner: boolean
  }
) {
  const { error } = await createWorkerRepo(supabase, organizationId, data)
  if (error) throw error
  return { success: true, message: 'Trabajador agregado correctamente' }
}

export async function updateWorker(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  workerId: string,
  data: {
    share_percentage?: number
    is_active?: boolean
  }
) {
  const { error } = await updateWorkerRepo(supabase, organizationId, workerId, data)
  if (error) throw error
  return { success: true, message: 'Trabajador actualizado correctamente' }
}
