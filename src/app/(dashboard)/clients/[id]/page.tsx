
import { getClientDetails } from '../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Edit } from 'lucide-react'
import { ClientEditDrawer } from '@/components/clients/ClientEditDrawer'
import { AddPropertyDrawer } from '@/components/properties/AddPropertyDrawer'
import { VisitCard } from '@/components/visits/VisitCard'

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

  const visitsWithClient = visits.map((v: any) => ({
    ...v,
    properties: {
      ...v.properties,
      clients: { name: client.name }
    }
  }))

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-8 shadow-sm border-b border-slate-200">
        <div className="mb-6">
          <Link href="/clients" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a Clientes
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <div className="mt-3 flex flex-col gap-2 text-slate-600 sm:flex-row sm:gap-6">
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-600" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600" />
                  <span>{client.email}</span>
                </div>
              )}
            </div>
            {client.notes && (
                <div className="mt-4 inline-block rounded-md bg-slate-100 px-3 py-2 text-sm italic text-slate-600 border border-slate-200">
                  <span className="font-semibold not-italic text-slate-700">Notas: </span>
                  {client.notes}
                </div>
            )}
          </div>
          
          <ClientEditDrawer client={client}>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-200 transition-colors">
                <Edit size={16} />
                Editar
            </button>
          </ClientEditDrawer>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-3xl mx-auto w-full">
        {/* Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="text-emerald-600" />
                Propiedades
             </h2>
             <AddPropertyDrawer clientId={client.id} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {properties.map((prop: any) => (
                <div key={prop.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="font-semibold text-slate-800">{prop.address}</p>
                        {prop.frequency_days && (
                            <p className="text-sm text-slate-500 mt-1">Frecuencia: Cada {prop.frequency_days} días</p>
                        )}
                    </div>
                    {prop.address && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors self-start"
                        >
                            <MapPin size={16} />
                            Ver en Google Maps
                        </a>
                    )}
                </div>
            ))}
            {properties.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                    <p>No hay propiedades registradas.</p>
                </div>
            )}
          </div>
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="text-emerald-600" />
            Historial de Visitas
          </h2>
          
          {visitsWithClient.length > 0 ? (
               <div className="flex flex-col gap-4">
                  {visitsWithClient.map((visit: any) => (
                      <VisitCard key={visit.id} visit={visit} />
                  ))}
               </div>
          ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-slate-500 font-medium">Este cliente aún no tiene visitas registradas.</p>
                </div>
          )}
        </section>
      </div>
    </div>
  )
}
