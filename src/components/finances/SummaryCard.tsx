import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react'

interface SummaryCardProps {
  summary: {
    totalRevenue: number
    totalDirectExpenses: number
    totalGeneralExpenses: number
    netMargin: number
  } | null
}

export function SummaryCard({ summary }: SummaryCardProps) {
  if (!summary) return null

  const { totalRevenue, totalDirectExpenses, totalGeneralExpenses, netMargin } = summary
  const isProfitPositive = netMargin >= 0
  const totalCost = totalDirectExpenses + totalGeneralExpenses

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Ingresos */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <ArrowUpCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Costos Operativos</p>
            <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ganancia Neta */}
      <div className={`rounded-xl p-6 shadow-sm border ${isProfitPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-3 ${isProfitPositive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isProfitPositive ? 'text-green-700' : 'text-red-700'}`}>
              Ganancia Neta
            </p>
            <p className={`text-2xl font-bold ${isProfitPositive ? 'text-green-900' : 'text-red-900'}`}>
              ${netMargin.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
