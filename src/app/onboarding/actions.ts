'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUser, createOrganizationForUser } from '@/lib/services/auth-service'

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  // 1. Get current user
  const { user } = await getCurrentUser(supabase)

  if (!user) {
    redirect('/login')
  }
  
  

  // 2. Call RPC create_organization_for_user
  const { error } = await createOrganizationForUser(supabase, name)

  if (error) {
    console.error('Error creating organization:', error)
    return { error: 'Failed to create organization. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
