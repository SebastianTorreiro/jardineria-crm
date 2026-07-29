import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { createClient } from './server'
import { getUserOrganization } from './queries'

export type SupabaseWithOrg = {
  supabase: SupabaseClient<Database>
  organizationId: string | null
  error: unknown | null
}

// Server-only: centralizes createClient() + getUserOrganization() resolution.
// Does not redirect, throw, or render — callers own the reaction to `organizationId`/`error`.
export async function getSupabaseWithOrg(): Promise<SupabaseWithOrg> {
  const supabase = await createClient()

  try {
    const organizationId = await getUserOrganization(supabase)
    return { supabase, organizationId, error: null }
  } catch (error) {
    console.error('getSupabaseWithOrg: failed to resolve organization', error)
    return { supabase, organizationId: null, error }
  }
}
