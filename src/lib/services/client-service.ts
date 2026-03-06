import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function getClients(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  query?: string | null
) {
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

export async function createClientWithProperty(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    name: string
    phone?: string | null
    notes?: string | null
    address: string
    frequency?: number | null
  }
) {
  // 1. Create Client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      organization_id: organizationId,
      name: data.name,
      phone: data.phone,
      notes: data.notes,
    })
    .select()
    .single()

  if (clientError) {
    console.error('Error creating client:', clientError)
    return { success: false, message: 'Failed to create client' }
  }

  // 2. Create Property
  const { error: propertyError } = await supabase.from('properties').insert({
    organization_id: organizationId,
    client_id: client.id,
    address: data.address,
    frequency_days: data.frequency,
  })

  if (propertyError) {
    await supabase.from('clients').delete().eq('id', client.id)
    console.error('Error creating property:', propertyError)
    return { success: false, message: 'Failed to create property' }
  }

  return { success: true, message: 'Client created successfully' }
}

export async function getClientDetails(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  clientId: string
) {
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

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('client_id', clientId)
    .eq('organization_id', organizationId)

  const { data: visitsSafe } = await supabase
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

export async function updateClientWithProperty(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    id: string
    name: string
    phone?: string | null
    notes?: string | null
    property_id?: string | null
    address: string
    frequency?: number | null
  }
) {
  const { error: clientError } = await supabase
    .from('clients')
    .update({
      name: data.name,
      phone: data.phone,
      notes: data.notes
    })
    .eq('id', data.id)
    .eq('organization_id', organizationId)

  if (clientError) {
    console.error('Error updating client:', clientError)
    return { success: false, message: 'Failed to update client' }
  }

  if (data.property_id) {
    const { error: propertyError } = await supabase
      .from('properties')
      .update({
        address: data.address,
        frequency_days: data.frequency
      })
      .eq('id', data.property_id)
      .eq('organization_id', organizationId)

    if (propertyError) {
      console.error('Error updating property:', propertyError)
      return { success: false, message: 'Failed to update property' }
    }
  } else {
    const { error: propertyError } = await supabase.from('properties').insert({
      organization_id: organizationId,
      client_id: data.id,
      address: data.address,
      frequency_days: data.frequency,
    })
    if (propertyError) {
      console.error('Error creating property during client update:', propertyError)
      return { success: false, message: 'Failed to create property' }
    }
  }

  return { success: true, message: 'Client updated successfully' }
}

export async function createProperty(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  data: {
    client_id: string
    address: string
    frequency?: number | null
  }
) {
  const { error } = await supabase.from('properties').insert({
    organization_id: organizationId,
    client_id: data.client_id,
    address: data.address,
    frequency_days: data.frequency,
  })

  if (error) return { success: false, message: 'Failed to create property' }
  return { success: true, message: 'Property created' }
}
