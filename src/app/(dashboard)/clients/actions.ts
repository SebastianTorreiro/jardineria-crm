'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getClients(query?: string) {
  const supabase = await createClient()
  
  // Use the robust helper
  const organizationId = await getUserOrganization()
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
  
  const organizationId = await getUserOrganization()
  
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
