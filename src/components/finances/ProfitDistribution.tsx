import { Wallet, Users, Landmark, TrendingUp } from 'lucide-react'

interface PartnerSummary {
    name: string
    amount: number
}

interface ProfitDistributionProps {
    summary: {
        worker_id: string
        worker_name: string
        total_amount: number
    }[] | null
}

export function ProfitDistribution({ summary }: ProfitDistributionProps) {
    if (!summary) return null

    return (
        <div className="mt-8 space-y-6">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <Users size={20} className="text-emerald-600" />
                Distribución de Utilidades
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Partner Earnings */}
                {summary.map((partner) => (
                    <div 
                        key={partner.worker_id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                <Wallet size={20} className="text-emerald-600" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-full">
                                Socio
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{partner.worker_name}</p>
                        <p className="text-2xl font-black text-emerald-950">
                            ${partner.total_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
