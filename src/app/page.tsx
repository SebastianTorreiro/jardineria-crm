
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUserOrganization } from '@/utils/supabase/queries'

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const organizationId = await getUserOrganization()

  if (!organizationId) {
    redirect('/onboarding')
  }

  redirect('/home')
}
