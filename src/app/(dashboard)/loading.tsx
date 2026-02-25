export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 p-4 pb-24 md:p-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 rounded-lg bg-slate-200 mb-2"></div>
        <div className="h-5 w-80 rounded bg-slate-200 mt-2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 rounded bg-slate-200"></div>
              <div className="h-4 w-4 rounded-full bg-slate-200"></div>
            </div>
            <div className="h-8 w-16 rounded bg-slate-200 mt-2"></div>
            <div className="h-3 w-32 rounded bg-slate-200 mt-3"></div>
          </div>
        ))}
      </div>
    
      <div className="grid gap-8 md:grid-cols-2">
          {/* Today's Agenda */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                  <div className="h-6 w-36 rounded bg-slate-200"></div>
              </div>
              <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                          <div>
                              <div className="h-5 w-32 rounded bg-slate-200 mb-1"></div>
                              <div className="h-4 w-40 rounded bg-slate-200"></div>
                          </div>
                          <div className="h-6 w-20 rounded-full bg-slate-200"></div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                  <div className="h-6 w-40 rounded bg-slate-200"></div>
              </div>
              <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-slate-100">
                          <div className="h-5 w-24 rounded bg-slate-200"></div>
                          <div className="h-5 w-24 rounded bg-slate-200"></div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="h-6 w-36 rounded bg-slate-200 mb-4"></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                    <div className="h-4 w-24 rounded bg-slate-200 mt-2"></div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
