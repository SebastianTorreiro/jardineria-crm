'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Briefcase, UserCog } from 'lucide-react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'

export function MoreMenuDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
      >
        <MoreHorizontal className="h-6 w-6" />
        <span className="text-xs font-medium">Más</span>
      </button>

      <BaseDrawer isOpen={open} onClose={setOpen} title="Más opciones">
        <div className="flex flex-col gap-3">
          <Link
            href="/inventory"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
              <Briefcase size={20} />
            </div>
            <span className="text-base font-bold text-foreground">Inventario</span>
          </Link>

          <Link
            href="/workers"
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
              <UserCog size={20} />
            </div>
            <span className="text-base font-bold text-foreground">Trabajadores</span>
          </Link>
        </div>
      </BaseDrawer>
    </>
  )
}
