'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  // 1. Get current user (still good to checking session existence rapidly)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Call RPC create_organization_for_user
  // Note: RPC creates the org and links the user as owner in a single transaction/function
  // avoiding Race Conditions with RLS.
  const { error } = await supabase.rpc('create_organization_for_user', {
    org_name: name,
  })

  if (error) {
    console.error('Error creating organization:', error)
    return { error: 'Failed to create organization. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
