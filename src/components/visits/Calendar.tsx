'use client'

import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface CalendarProps {
  selectedDate: Date
  datesWithVisits: Date[]
}

export function Calendar({ selectedDate, datesWithVisits }: CalendarProps) {
  const router = useRouter()

  const handleSelect = (date: Date | undefined) => {
    if (date) {
        const dateStr = format(date, 'yyyy-MM-dd')
        router.push(`?date=${dateStr}`)
    }
  }

  return (
    <div className="flex justify-center rounded-xl bg-card text-card-foreground p-4 shadow-sm border border-border">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        locale={es}
        modifiers={{
          hasVisit: datesWithVisits,
        }}
        modifiersClassNames={{
          hasVisit: 'after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full',
          selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        }}
        styles={{
          head_cell: { width: '40px', color: '#6b7280' },
          cell: { width: '40px' },
          day: { margin: 'auto', borderRadius: '8px' }, // Fix button style
        }}
        classNames={{
             caption: 'flex justify-center py-2 relative items-center',
             caption_label: 'text-sm font-medium text-foreground',
             nav: 'flex items-center',
             nav_button: 'h-7 w-7 bg-transparent hover:bg-accent p-1 rounded-md text-muted-foreground transition-colors',
             nav_button_previous: 'absolute left-1',
             nav_button_next: 'absolute right-1',
             head_row: 'flex',
             row: 'flex w-full mt-2',
        }}
      />
    </div>
  )
}
