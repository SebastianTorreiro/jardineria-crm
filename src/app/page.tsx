import { getUserOrganization } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'

// Forzamos dinamismo para evitar caché viejo
export const dynamic = 'force-dynamic'

export default async function Index() {
  const organizationId = await getUserOrganization()

  if (organizationId) {
    redirect('/home')
  } else {
    redirect('/onboarding')
  }
}