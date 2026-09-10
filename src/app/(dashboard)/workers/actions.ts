'use server'

import { getSupabaseWithOrg } from '@/utils/supabase/session'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { WorkerSchema } from '@/lib/validations/schemas'
import {
  getWorkers as getWorkersService,
  createWorker as createWorkerService,
} from '@/lib/services/worker-service'

export async function getWorkers(includeInactive: boolean = false) {
  const { supabase, organizationId, error } = await getSupabaseWithOrg()

  if (error) throw error

  if (!organizationId) return []

  return getWorkersService(supabase, organizationId, includeInactive)
}

export const createWorker = createSafeAction(WorkerSchema, async (data, ctx) => {
  await createWorkerService(ctx.supabase, ctx.orgId, data)

  revalidatePath('/workers')
  return { success: true, message: 'Trabajador agregado correctamente' }
})
