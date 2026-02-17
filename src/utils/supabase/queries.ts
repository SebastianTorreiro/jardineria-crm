
import { createClient } from './server'

export async function getUserOrganization() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('getUserOrganization: Error getting user', userError)
      return null
    }

    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (membershipError) {
      console.error(
        'getUserOrganization: Error fetching membership',
        membershipError
      )
      return null
    }

    return membership ? membership.organization_id : null
  } catch (error) {
    console.error('getUserOrganization: Unexpected error', error)
    return null
  }
}
