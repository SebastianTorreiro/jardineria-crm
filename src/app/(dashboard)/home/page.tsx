
import UserMenu from '@/components/UserMenu'
import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'

export default async function HomePage() {
  const supabase = await createClient()
  const organizationId = await getUserOrganization()

  let visitsToday = 0
  let totalClients = 0

  if (organizationId) {
    // Current Date in Argentina Timezone (YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })

    const { count: visitsCount } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('scheduled_date', today)

    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    visitsToday = visitsCount || 0
    totalClients = clientsCount || 0
  }

  return (
    <div className="p-4">
      <header className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <UserMenu />
      </header>

      <div className="grid gap-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Bienvenido</h3>
          <p className="mt-2 text-gray-600">
            Este es tu panel de control. Aquí verás el resumen de tu actividad.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{visitsToday}</p>
                <p className="text-sm text-green-600">Visitas Hoy</p>
            </div>
             <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{totalClients}</p>
                <p className="text-sm text-blue-600">Clientes</p>
            </div>
        </div>
      </div>
    </div>
  )
}
