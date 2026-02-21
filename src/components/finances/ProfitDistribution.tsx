import { Wallet, Users, Landmark, TrendingUp } from 'lucide-react'

interface PartnerSummary {
    name: string
    amount: number
}

interface ProfitDistributionProps {
    summary: {
        partners: PartnerSummary[]
        totalWages: number
        caixaEmpresa: number
        totalIncome: number
        totalExpenses: number
    } | null
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
                {summary.partners.map((partner) => (
                    <div 
                        key={partner.name}
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
                        <p className="text-sm font-medium text-slate-500 mb-1">{partner.name}</p>
                        <p className="text-2xl font-black text-emerald-950">
                            ${partner.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                ))}

                {/* Caja de Empresa */}
                <div className="bg-emerald-900 p-6 rounded-2xl shadow-lg shadow-emerald-900/20 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-800 rounded-lg group-hover:bg-emerald-700 transition-colors">
                            <Landmark size={20} className="text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter bg-emerald-800 px-2 py-1 rounded-full">
                            Empresa
                        </span>
                    </div>
                    <p className="text-sm font-medium text-emerald-100/70 mb-1">Caja de Empresa</p>
                    <p className="text-2xl font-black text-white">
                        ${summary.caixaEmpresa.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <TrendingUp size={14} />
                        Acumulado del mes
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            {summary.totalWages > 0 && (
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
                    <span className="text-sm font-bold text-slate-600">Sueldos Pagados (Colaboradores)</span>
                    <span className="text-sm font-black text-slate-900">
                        ${summary.totalWages.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            )}
        </div>
    )
}
