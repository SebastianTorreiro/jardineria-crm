'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ClientSchema, PropertySchema, ClientInput, PropertyInput } from '@/lib/validations/schemas'
import { z } from 'zod'
import {
  getClients as getClientsService,
  createClientWithProperty as createClientWithPropertyService,
  getClientDetails as getClientDetailsService,
  updateClientWithProperty as updateClientWithPropertyService,
  createProperty as createPropertyService
} from '@/lib/services/client-service'

export type Client = ClientInput & { id: string, org_id: string }

export async function getClients(query?: string) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
    console.error('getClients: No organization found for user')
    throw new Error('No organization found')
  }

  return getClientsService(supabase, organizationId, query)
}

export const createClientAction = createSafeAction(
  ClientSchema.extend({
      address: z.string().trim().min(1, { message: "Address is required" }),
      frequency: z.coerce.number().int().positive().nullable().optional(),
  }), 
  async (data, ctx) => {
    const result = await createClientWithPropertyService(ctx.supabase, ctx.orgId, data)
    
    if (!result.success) return result

    revalidatePath('/clients')
    return { success: true, message: 'Client created successfully' }
})

export async function getClientDetails(clientId: string) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) return null

  return getClientDetailsService(supabase, organizationId, clientId)
}

const UpdateClientSchema = ClientSchema.extend({
    id: z.string().uuid(),
    property_id: z.string().uuid().optional(),
    address: z.string().trim().min(1, { message: "Address is required" }),
    frequency: z.coerce.number().int().positive().nullable().optional(),
})

export const updateClient = createSafeAction(UpdateClientSchema, async (data, ctx) => {
    const result = await updateClientWithPropertyService(ctx.supabase, ctx.orgId, data)
    
    if (!result.success) return result

    revalidatePath(`/clients/${data.id}`)
    revalidatePath('/clients')
    return { success: true, message: 'Cliente actualizado exitosamente' }
})

const CreatePropertySchema = PropertySchema.extend({
    client_id: z.string().uuid()
})

export const createProperty = createSafeAction(CreatePropertySchema, async (data, ctx) => {
    const result = await createPropertyService(ctx.supabase, ctx.orgId, data)

    if (!result.success) return result

    revalidatePath(`/clients/${data.client_id}`)
    return result
})
