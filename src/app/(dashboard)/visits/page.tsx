'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/visits/Calendar'
import { VisitList } from '@/components/visits/VisitList'
import { NewVisitDrawer } from '@/components/visits/NewVisitDrawer'
import { getVisits } from './actions'
import { startOfMonth, endOfMonth } from 'date-fns'
import { parseLocalDate } from '@/utils/date-helpers'

export default function VisitsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [visits, setVisits] = useState<any[]>([])
  
  // We fetch a larger range to show dots (e.g., current month +/- 1 month)
  // For simplicity MVP: fetch current month of selected date
  useEffect(() => {
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    
    getVisits(start, end).then(data => {
        if (data) setVisits(data)
    })
  }, [selectedDate]) // Re-fetch if month changes (selectedDate changes)
  // Optimization: Only re-fetch if MONTH changes. For MVP, fetching on date change is ok but chattier.
  // Better: separate month state.

  const datesWithVisits = visits.map(v => parseLocalDate(v.scheduled_date))

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Agenda</h1>
        
        <Calendar 
            selectedDate={selectedDate} 
            onSelect={setSelectedDate} 
            datesWithVisits={datesWithVisits}
        />

        <div className="mt-6">
            <VisitList visits={visits} selectedDate={selectedDate} />
        </div>
      </div>

      <NewVisitDrawer defaultDate={selectedDate} />
    </div>
  )
}
