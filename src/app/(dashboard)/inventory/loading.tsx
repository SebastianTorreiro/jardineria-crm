export default function InventoryLoading() {
  return (
    <div className="flex h-full flex-col gap-6 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <div className="h-8 w-32 rounded-md bg-slate-200 mb-2"></div>
           <div className="h-4 w-48 rounded bg-slate-200"></div>
        </div>
        <div className="h-14 w-14 rounded-full bg-slate-200 shadow-sm fixed bottom-6 right-6"></div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <div className="border-b-2 border-emerald-500 py-4 px-1 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200"></div>
            <div className="h-4 w-24 rounded bg-slate-200"></div>
          </div>
          <div className="border-b-2 border-transparent py-4 px-1 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200"></div>
            <div className="h-4 w-20 rounded bg-slate-200"></div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="pb-24">
            {/* Desktop View (Table) */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3"><div className="h-3 w-24 bg-slate-200 rounded"></div></th>
                            <th className="px-6 py-3"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                            <th className="px-6 py-3"><div className="h-3 w-32 bg-slate-200 rounded"></div></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                                        <div className="h-8 w-32 bg-slate-200 rounded-md ml-auto"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mb-2">
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-5 w-32 bg-slate-200 rounded"></div>
                            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col">
                        <div className="h-3 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-8 w-full bg-slate-200 rounded-md"></div>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  )
}
