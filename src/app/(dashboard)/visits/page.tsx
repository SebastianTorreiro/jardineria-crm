import { Calendar } from '@/components/visits/Calendar'
import { VisitList } from '@/components/visits/VisitList'
import { NewVisitDrawer } from '@/components/visits/NewVisitDrawer'
import { getVisits } from './actions'
import { startOfMonth, endOfMonth } from 'date-fns'
import { parseLocalDate } from '@/utils/date-helpers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Definimos los props como Promesa (Next.js 15 Standard)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VisitsPage({ searchParams }: PageProps) {
  // PASO CRÍTICO: Esperamos a que la promesa se resuelva
  const resolvedParams = await searchParams
  
  // Ahora sí leemos 'date' y 'tab' del objeto ya resuelto
  const dateParam = typeof resolvedParams.date === 'string' ? resolvedParams.date : undefined
  const currentTab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'agenda'
  
  // El resto sigue igual...
  const selectedDate = dateParam ? parseLocalDate(dateParam) : new Date()
  const start = startOfMonth(selectedDate)
  const end = endOfMonth(selectedDate)

  // Fetch de datos
  const visits = await getVisits(start, end)
  
  // Dividimos las visitas para la UI (Pendientes vs Completadas)
  const pending = visits ? visits.filter((v: any) => v.status === 'pending') : []
  const completed = visits ? visits.filter((v: any) => v.status === 'completed') : []

  // Fechas con puntos para el calendario (sólo mostramos puntos para pendientes y completadas de manera combinada, o podríamos separar, 
  // pero dejémoslo que muestre puntos para cualquier visita en el mes)
  const datesWithVisits = visits ? visits.map((v: any) => parseLocalDate(v.scheduled_date)) : []

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      {/* Sticky Tabs UI */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 pb-2 pt-4 px-4 border-b border-gray-200">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Visitas</h1>
        
        <div className="flex space-x-1 rounded-xl bg-gray-200/60 p-1">
          <Link
            href={`/visits?tab=agenda${dateParam ? `&date=${dateParam}` : ''}`}
            className={`flex w-full items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-all ${
              currentTab === 'agenda'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗓 Agenda
          </Link>
          <Link
            href={`/visits?tab=history${dateParam ? `&date=${dateParam}` : ''}`}
            className={`flex w-full items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-all ${
              currentTab === 'history'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Historial
          </Link>
        </div>
      </div>

      <div className="p-4">
        {currentTab === 'agenda' && (
            <Calendar 
                selectedDate={selectedDate} 
                datesWithVisits={datesWithVisits}
            />
        )}

        <div className={currentTab === 'agenda' ? "mt-6" : "mt-2"}>
            <VisitList visits={visits || []} selectedDate={selectedDate} tab={currentTab} />
        </div>
      </div>

      <NewVisitDrawer defaultDate={selectedDate} />
    </div>
  )
}