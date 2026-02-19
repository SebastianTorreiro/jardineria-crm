'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getClients(query?: string) {
  const supabase = await createClient()
  
  // Use the robust helper
  const organizationId = await getUserOrganization(supabase)
  console.log('Server Action - Org ID:', organizationId)

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

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  
  const organizationId = await getUserOrganization(supabase)
  
  if (!organizationId) {
    console.error('createClientAction: No organization found')
    throw new Error('No organization found')
  }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const frequency = formData.get('frequency') as string

  if (!name || !address) {
    return { error: 'Name and Address are required' }
  }

  // 1. Create Client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      organization_id: organizationId,
      name,
      phone,
    })
    .select()
    .single()

  if (clientError) {
    console.error('Error creating client:', JSON.stringify(clientError, null, 2))
    return { error: 'Failed to create client' }
  }

  // 2. Create Property for the Client
  const { error: propertyError } = await supabase.from('properties').insert({
    organization_id: organizationId,
    client_id: client.id,
    address,
    frequency_days: frequency ? parseInt(frequency) : null,
  })

  if (propertyError) {
    console.error('Error creating property:', JSON.stringify(propertyError, null, 2))
    // Optional: Delete the client if property creation fails (manual rollback)
    await supabase.from('clients').delete().eq('id', client.id)
    return { error: 'Failed to create property' }
  }

  revalidatePath('/clients')
  return { success: true }
}

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
  const { data: visits } = await supabase
    .from('visits')
    .select(`
      *,
      properties (
        address
      )
    `)
    // We can't filter by client_id directly on visits easily without a join or if we don't have client_id on visits
    // But visits are linked to properties, which are linked to clients.
    // So we need to filter visits where property.client_id = clientId.
    // Supabase supports this via nested filtering!
    .eq('organization_id', organizationId)
    .eq('properties.client_id', clientId) 
    .order('scheduled_date', { ascending: false })

  // Note: .eq('properties.client_id', clientId) works if we join!
  // But strictly standard is:
  // .select('*, properties!inner(*)')
  // .eq('properties.client_id', clientId)

  // Let's retry the visits query with referencing inner join to be safe
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

export async function updateClient(formData: FormData) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)
    
    if (!organizationId) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const notes = formData.get('notes') as string

    const { error } = await supabase
        .from('clients')
        .update({
            name,
            phone,
            email,
            notes
        })
        .eq('id', id)
        .eq('organization_id', organizationId)

    if (error) {
        console.error('Error updating client:', error)
        return { error: 'Failed to update client' }
    }

    revalidatePath(`/clients/${id}`)
    revalidatePath('/clients')
    return { success: true }
}

export async function createProperty(formData: FormData) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)

    if (!organizationId) return { error: 'Unauthorized' }

    const clientId = formData.get('client_id') as string
    const address = formData.get('address') as string
    const frequency = formData.get('frequency') as string

    if (!clientId || !address) {
        return { error: 'Address is required' }
    }

    const { error } = await supabase.from('properties').insert({
        organization_id: organizationId,
        client_id: clientId,
        address,
        frequency_days: frequency ? parseInt(frequency) : null,
    })

    if (error) {
        console.error('Error creating property:', error)
        return { error: 'Failed to create property' }
    }

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
}
