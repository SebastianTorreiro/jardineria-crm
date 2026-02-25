export default function ClientsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20 animate-pulse">
      <div className="sticky top-0 z-40 bg-white p-4 shadow-sm">
        <div className="mb-4 h-8 w-32 rounded-md bg-slate-200"></div>
        <div className="h-12 w-full rounded-lg bg-slate-200"></div>
      </div>

      <div className="p-4">
        <div className="pb-24">
          {/* Desktop View Skeleton */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                  <th className="px-6 py-3"><div className="h-3 w-32 bg-slate-200 rounded"></div></th>
                  <th className="px-6 py-3"><div className="h-3 w-24 bg-slate-200 rounded ml-auto"></div></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-5 w-32 bg-slate-200 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-200 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 mb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                    <div>
                      <div className="h-5 w-32 rounded bg-slate-200 mb-2"></div>
                      <div className="h-4 w-40 rounded bg-slate-200"></div>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
