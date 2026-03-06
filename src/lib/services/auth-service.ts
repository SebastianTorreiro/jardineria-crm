import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function loginWithPassword(supabase: SupabaseClient, email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error }
}

export async function signupWithPassword(supabase: SupabaseClient, email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password })
  return { error }
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function createOrganizationForUser(supabase: SupabaseClient, orgName: string) {
  const { error } = await supabase.rpc('create_organization_for_user', { org_name: orgName })
  return { error }
}
