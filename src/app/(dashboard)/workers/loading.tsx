export default function WorkersLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 animate-pulse">
      <div className="sticky top-0 z-40 border-b border-border bg-card p-4 shadow-sm">
        <div className="h-8 w-40 rounded-md bg-accent"></div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="h-12 w-12 rounded-full bg-accent"></div>
              <div className="flex-1">
                <div className="mb-2 h-4 w-24 rounded bg-accent"></div>
                <div className="h-3 w-12 rounded bg-accent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
