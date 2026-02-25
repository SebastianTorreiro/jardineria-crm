export default function FinancesLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-20 animate-pulse">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
            <div className="h-10 w-40 rounded-lg bg-slate-200"></div>
            
            <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200 h-10 w-48">
                <div className="h-full w-full rounded bg-slate-200/50"></div>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
                    <div className="h-5 w-24 rounded bg-slate-200"></div>
                </div>
                <div className="mt-2 text-3xl h-8 w-32 rounded bg-slate-200 font-bold"></div>
             </div>
          ))}
        </div>

        {/* Profit Distribution */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 p-4">
                <div className="h-5 w-40 rounded bg-slate-200"></div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100">
                       <div className="h-4 w-20 rounded bg-slate-200"></div>
                       <div className="h-6 w-24 rounded bg-slate-200 mb-1"></div>
                       <div className="h-3 w-full rounded bg-slate-200 mt-2"></div>
                       <div className="h-3 w-16 rounded bg-slate-200 ml-auto"></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Expense List */}
        <div className="mt-8">
            {/* Desktop View Skeleton */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                        <th className="px-6 py-3"><div className="h-3 w-32 bg-slate-200 rounded"></div></th>
                        <th className="px-6 py-3"><div className="h-3 w-20 bg-slate-200 rounded"></div></th>
                        <th className="px-6 py-3"><div className="h-3 w-20 bg-slate-200 rounded ml-auto"></div></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                    {[...Array(4)].map((_, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                            <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                        <div className="flex items-start justify-between">
                            <div className="w-full">
                                <div className="h-5 w-16 rounded-full bg-slate-200 mb-2"></div>
                                <div className="h-4 w-3/4 rounded bg-slate-200 mb-2"></div>
                                <div className="h-3 w-20 rounded bg-slate-200"></div>
                            </div>
                            <div className="h-8 w-20 rounded-lg bg-slate-200 ml-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
