import { getClients } from './actions'
import { ClientList } from '@/components/clients/ClientList'
import { NewClientDrawer } from '@/components/clients/NewClientDrawer'
// import { FloatingActionButton } from '@/components/ui/FloatingActionButton' // Not used directly, inside Drawer
import { Search } from 'lucide-react'

// Allow search params
export const dynamic = 'force-dynamic'

export default async function ClientsPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''
  const clients = await getClients(query)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      <div className="sticky top-0 z-40 bg-white p-4 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Clients</h1>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <form action="/clients" method="get">
             <input
                type="search"
                name="q"
                defaultValue={query}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search clients..."
             />
          </form>
        </div>
      </div>

      <div className="p-4">
        <ClientList clients={clients || []} />
      </div>

      <NewClientDrawer />
    </div>
  )
}
