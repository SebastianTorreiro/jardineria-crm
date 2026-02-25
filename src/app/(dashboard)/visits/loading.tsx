export default function VisitsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20 animate-pulse">
      <div className="p-4">
        <div className="mb-4 h-8 w-32 rounded-md bg-slate-200"></div>
        
        {/* Fake Calendar */}
        <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="h-4 w-24 rounded bg-slate-200"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-slate-200"></div>
              <div className="h-8 w-8 rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 p-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-2 gap-1">
                 <div className="h-3 w-6 rounded bg-slate-200"></div>
                 <div className="h-8 w-8 rounded-full bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="pb-24">
            <div className="mb-3 h-5 w-28 rounded bg-slate-200"></div>

            {/* Desktop View Skeleton */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                            <th className="px-6 py-3"><div className="h-3 w-20 bg-slate-200 rounded"></div></th>
                            <th className="px-6 py-3"><div className="h-3 w-24 bg-slate-200 rounded"></div></th>
                            <th className="px-6 py-3"><div className="h-3 w-16 bg-slate-200 rounded ml-auto"></div></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {[...Array(3)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                                <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                                <td className="px-6 py-4 text-right"><div className="h-6 w-24 bg-slate-200 rounded-full ml-auto"></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-24 rounded bg-slate-200"></div>
                      <div className="h-6 w-20 rounded-full bg-slate-200"></div>
                    </div>
                    <div>
                      <div className="h-5 w-32 rounded bg-slate-200 mb-2"></div>
                      <div className="h-4 w-48 rounded bg-slate-200"></div>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
