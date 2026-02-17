import { Calendar } from '@/components/visits/Calendar'
import { VisitList } from '@/components/visits/VisitList'
import { NewVisitDrawer } from '@/components/visits/NewVisitDrawer'
import { getVisits } from './actions'
import { startOfMonth, endOfMonth } from 'date-fns'
import { parseLocalDate } from '@/utils/date-helpers'

export const dynamic = 'force-dynamic'

// Definimos los props como Promesa (Next.js 15 Standard)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VisitsPage({ searchParams }: PageProps) {
  // PASO CRÍTICO: Esperamos a que la promesa se resuelva
  const resolvedParams = await searchParams
  
  // Ahora sí leemos 'date' del objeto ya resuelto
  const dateParam = typeof resolvedParams.date === 'string' ? resolvedParams.date : undefined
  
  // El resto sigue igual...
  const selectedDate = dateParam ? parseLocalDate(dateParam) : new Date()
  const start = startOfMonth(selectedDate)
  const end = endOfMonth(selectedDate)

  // Fetch de datos
  const visits = await getVisits(start, end)
  
  // Dividimos las visitas para la UI (Pendientes vs Completadas)
  const pending = visits ? visits.filter((v: any) => v.status === 'pending') : []
  const completed = visits ? visits.filter((v: any) => v.status === 'completed') : []

  // Fechas con puntos para el calendario
  const datesWithVisits = visits ? visits.map((v: any) => parseLocalDate(v.scheduled_date)) : []

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Agenda</h1>
        
        <Calendar 
            selectedDate={selectedDate} 
            datesWithVisits={datesWithVisits}
        />

        <div className="mt-6">
            <VisitList visits={visits || []} selectedDate={selectedDate} />
        </div>
      </div>

      <NewVisitDrawer defaultDate={selectedDate} />
    </div>
  )
}