'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ClientSchema, PropertySchema, ClientInput, PropertyInput } from '@/lib/validations/schemas'
import { z } from 'zod'

export type Client = ClientInput & { id: string, org_id: string }

export async function getClients(query?: string) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
    console.error('getClients: No organization found for user')
    throw new Error('No organization found')
  }

  let dbQuery = supabase
    .from('clients')
    .select(`
      *,
      properties!inner(*)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error fetching clients:', JSON.stringify(error, null, 2))
    throw new Error('Failed to fetch clients')
  }

  return data
}

export const createClientAction = createSafeAction(
  ClientSchema.extend({
      // Extra fields for the property creation in the same transaction logic if needed
      // But the schema matches the form input.
      // Wait, the original action also mapped properties.
      // The prompt said "createClientAction" takes name, phone, address, frequency.
      // So we need a combined schema or just extend it here.
      address: z.string().trim().min(1, { message: "Address is required" }),
      frequency: z.coerce.number().int().positive().nullable().optional(),
  }), 
  async (data, ctx) => {
    // 1. Create Client
    const { data: client, error: clientError } = await ctx.supabase
        .from('clients')
        .insert({
        organization_id: ctx.orgId,
        name: data.name,
        phone: data.phone,
        notes: data.notes, // Note: email removed based on schema alignment
        })
        .select()
        .single()

    if (clientError) {
        console.error('Error creating client:', clientError)
        return { success: false, message: 'Failed to create client' }
    }

    // 2. Create Property
    const { error: propertyError } = await ctx.supabase.from('properties').insert({
        organization_id: ctx.orgId,
        client_id: client.id,
        address: data.address,
        frequency_days: data.frequency,
    })

    if (propertyError) {
        // Rollback
        await ctx.supabase.from('clients').delete().eq('id', client.id)
        console.error('Error creating property:', propertyError)
        return { success: false, message: 'Failed to create property' }
    }

    revalidatePath('/clients')
    return { success: true, message: 'Client created successfully' }
})

export async function getClientDetails(clientId: string) {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) return null

  // 1. Get Client Info
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .eq('organization_id', organizationId)
    .single()

  if (clientError || !client) {
    console.error('Error fetching client:', clientError)
    return null
  }

  // 2. Get Properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('client_id', clientId)
    .eq('organization_id', organizationId)

  // 3. Get Visits (History)
  const { data: visitsSafe, error: visitsError } = await supabase
     .from('visits')
     .select(`
        *,
        properties!inner (
           address,
           client_id
        )
     `)
     .eq('organization_id', organizationId)
     .eq('properties.client_id', clientId)
     .order('scheduled_date', { ascending: false })

  return {
    client,
    properties: properties || [],
    visits: visitsSafe || []
  }
}

const UpdateClientSchema = ClientSchema.extend({
    id: z.string().uuid(),
    property_id: z.string().uuid().optional(), // Needed to know which property to update
    address: z.string().trim().min(1, { message: "Address is required" }),
    frequency: z.coerce.number().int().positive().nullable().optional(),
})

export const updateClient = createSafeAction(UpdateClientSchema, async (data, ctx) => {
    // 1. Update Client
    const { error: clientError } = await ctx.supabase
        .from('clients')
        .update({
            name: data.name,
            phone: data.phone,
            notes: data.notes
        })
        .eq('id', data.id)
        .eq('organization_id', ctx.orgId)

    if (clientError) {
        console.error('Error updating client:', clientError)
        return { success: false, message: 'Failed to update client' }
    }

    // 2. Update Property (if property_id is provided, assuming we edit index 0)
    if (data.property_id) {
        const { error: propertyError } = await ctx.supabase
            .from('properties')
            .update({
                address: data.address,
                frequency_days: data.frequency
            })
            .eq('id', data.property_id)
            .eq('organization_id', ctx.orgId)

        if (propertyError) {
             console.error('Error updating property:', propertyError)
             return { success: false, message: 'Failed to update property' }
        }
    } else {
        // If they didn't have a property, we should create one since address is required in the unified form
        const { error: propertyError } = await ctx.supabase.from('properties').insert({
            organization_id: ctx.orgId,
            client_id: data.id,
            address: data.address,
            frequency_days: data.frequency,
        })
        if (propertyError) {
             console.error('Error creating property during client update:', propertyError)
             return { success: false, message: 'Failed to create property' }
        }
    }

    revalidatePath(`/clients/${data.id}`)
    revalidatePath('/clients')
    return { success: true, message: 'Cliente actualizado exitosamente' }
})

const CreatePropertySchema = PropertySchema.extend({
    client_id: z.string().uuid()
})

export const createProperty = createSafeAction(CreatePropertySchema, async (data, ctx) => {
    const { error } = await ctx.supabase.from('properties').insert({
        organization_id: ctx.orgId,
        client_id: data.client_id,
        address: data.address,
        frequency_days: data.frequency,
    })

    if (error) throw error

    revalidatePath(`/clients/${data.client_id}`)
    return { success: true, message: 'Property created' }
})
