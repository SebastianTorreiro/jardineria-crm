import { getFinancialSummary, getExpenses } from './actions'
import { SummaryCard } from '@/components/finances/SummaryCard'
import { ExpenseList } from '@/components/finances/ExpenseList'
import { NewExpenseDrawer } from '@/components/finances/NewExpenseDrawer'
import { format, subMonths, addMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Force dynamic to ensure fresh metrics on every load
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function FinancesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  
  const now = new Date()
  const monthParam = resolvedParams.month
  const yearParam = resolvedParams.year

  // Default to current month/year if not provided
  // Math: Parse int, default to now.getMonth() (0-11)
  const selectedMonth = monthParam ? parseInt(monthParam as string) : now.getMonth()
  const selectedYear = yearParam ? parseInt(yearParam as string) : now.getFullYear()

  // Create Date object for display/navigation logic
  // Note: Month in date-fns/JS is 0-indexed (Jan=0, Dec=11)
  const currentDate = new Date(selectedYear, selectedMonth, 1)

  // Fetch Data in Parallel
  const [summary, expenses] = await Promise.all([
    getFinancialSummary(selectedMonth, selectedYear),
    getExpenses(selectedMonth, selectedYear)
  ])

  // Navigation Links
  const prevDate = subMonths(currentDate, 1)
  const nextDate = addMonths(currentDate, 1)

  const prevLink = `/finances?month=${prevDate.getMonth()}&year=${prevDate.getFullYear()}`
  const nextLink = `/finances?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header with Navigation */}
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
            
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <Link href={prevLink} className="p-2 hover:bg-gray-50 rounded-md text-gray-600">
                    <ChevronLeft size={20} />
                </Link>
                <span className="w-32 text-center font-medium text-gray-900 capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </span>
                <Link href={nextLink} className="p-2 hover:bg-gray-50 rounded-md text-gray-600">
                    <ChevronRight size={20} />
                </Link>
            </div>
        </div>

        {/* Summary Cards */}
        <SummaryCard summary={summary} />

        {/* Expense List */}
        <ExpenseList expenses={expenses || []} />
      </div>

      <NewExpenseDrawer />
    </div>
  )
}
