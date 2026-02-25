'use client'

import { useEffect, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the actual error to the console for developers, not to UI
    console.error('Unhandled error caught in Dashboard boundary:', error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6 bg-slate-50">
      <div className="flex max-w-md flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200/60">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner">
          <AlertTriangle size={32} strokeWidth={2.5} />
        </div>
        <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
          No pudimos cargar esta información
        </h2>
        <p className="mb-8 text-sm text-slate-500 leading-relaxed">
          Ha ocurrido un error inesperado al intentar conectarnos con el servidor. 
          Por favor, intentá nuevamente.
        </p>
        <button
          onClick={() => {
            startTransition(() => {
              router.refresh()
              reset()
            })
          }}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
