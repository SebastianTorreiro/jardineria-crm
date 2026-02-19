
import { getClientDetails } from '../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Edit } from 'lucide-react'
import { ClientEditDrawer } from '@/components/clients/ClientEditDrawer' // NEW
import { AddPropertyDrawer } from '@/components/properties/AddPropertyDrawer' // NEW (we need to make this)

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getClientDetails(id)

  if (!data) {
    notFound()
  }

  const { client, properties, visits } = data

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="mb-4">
          <Link href="/clients" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a Clientes
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <div className="mt-2 flex flex-col gap-1 text-gray-500 sm:flex-row sm:gap-4">
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{client.email}</span>
                </div>
              )}
            </div>
            {client.notes && (
                <p className="mt-2 text-sm text-gray-500 italic">"{client.notes}"</p>
            )}
          </div>
          
          <ClientEditDrawer client={client}>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Edit size={16} />
                Editar
            </button>
          </ClientEditDrawer>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="text-blue-600" />
                Propiedades
             </h2>
             <AddPropertyDrawer clientId={client.id} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {properties.map((prop: any) => (
                <div key={prop.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="font-medium text-gray-900">{prop.address}</p>
                    {prop.frequency_days && (
                        <p className="text-sm text-gray-500 mt-1">Frecuencia: Cada {prop.frequency_days} días</p>
                    )}
                </div>
            ))}
            {properties.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                    <p>No hay propiedades registradas.</p>
                </div>
            )}
          </div>
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-green-600" />
            Historial de Visitas
          </h2>
          
          {visits.length > 0 ? (
               <div className="flex flex-col gap-4">
                  {visits.map((visit: any) => (
                      <div key={visit.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                          <div>
                              <p className="font-medium text-gray-900">
                                  {new Date(visit.scheduled_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">{visit.properties?.address}</p>
                          </div>
                           <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  visit.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  visit.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                  {visit.status === 'pending' ? 'Pendiente' : visit.status === 'completed' ? 'Completada' : visit.status}
                              </span>
                      </div>
                  ))}
               </div>
          ) : (
                <p className="text-gray-500 text-sm">No hay visitas registradas.</p>
          )}
        </section>
      </div>
    </div>
  )
}
