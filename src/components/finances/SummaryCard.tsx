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
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <ArrowUpCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Costos Operativos</p>
            <p className="text-2xl font-bold text-foreground">${totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ganancia Neta */}
      <div className={`rounded-xl p-6 shadow-sm border ${isProfitPositive ? 'bg-secondary border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-3 ${isProfitPositive ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isProfitPositive ? 'text-primary' : 'text-destructive'}`}>
              Ganancia Neta
            </p>
            <p className={`text-2xl font-bold ${isProfitPositive ? 'text-foreground' : 'text-destructive'}`}>
              ${netMargin.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
