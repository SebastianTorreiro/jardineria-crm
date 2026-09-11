'use server'

import { getSupabaseWithOrg } from '@/utils/supabase/session'
import { getUserRole } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { WorkerSchema, EditWorkerSchema } from '@/lib/validations/schemas'
import {
  getWorkers as getWorkersService,
  createWorker as createWorkerService,
  updateWorker as updateWorkerService,
} from '@/lib/services/worker-service'

export async function getWorkers(includeInactive: boolean = false) {
  const { supabase, organizationId, error } = await getSupabaseWithOrg()

  if (error) throw error

  if (!organizationId) return []

  return getWorkersService(supabase, organizationId, includeInactive)
}

export async function getCurrentUserRole() {
  const { supabase, organizationId, error } = await getSupabaseWithOrg()

  if (error) throw error

  if (!organizationId) return null

  return getUserRole(supabase, organizationId)
}

export const createWorker = createSafeAction(WorkerSchema, async (data, ctx) => {
  await createWorkerService(ctx.supabase, ctx.orgId, data)

  revalidatePath('/workers')
  return { success: true, message: 'Trabajador agregado correctamente' }
})

export const updateWorker = createSafeAction(EditWorkerSchema, async (data, ctx) => {
  await updateWorkerService(ctx.supabase, ctx.orgId, data.id, {
    name: data.name,
    share_percentage: data.share_percentage,
    is_active: data.is_active,
    is_partner: data.is_partner,
  })

  revalidatePath('/workers')
  return { success: true, message: 'Trabajador actualizado correctamente' }
})
