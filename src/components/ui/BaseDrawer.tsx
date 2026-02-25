'use client'

import { Drawer } from 'vaul'
import { ReactNode, useEffect } from 'react'

interface BaseDrawerProps {
  isOpen: boolean
  onClose: (isOpen: boolean) => void
  title: string
  children: ReactNode
}

export function BaseDrawer({ isOpen, onClose, title, children }: BaseDrawerProps) {
  // Explicit ESC listener for bulletproof modal closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay 
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-all" 
            onClick={() => onClose(false)}
        />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-3xl bg-zinc-50 outline-none z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex-1 overflow-y-auto rounded-t-3xl bg-white p-5 sm:p-8">
            <div className="mx-auto mb-6 h-1.5 w-14 flex-shrink-0 rounded-full bg-slate-200" />
            <div className="mx-auto max-w-md w-full">
              <Drawer.Title className="mb-6 text-2xl font-black text-emerald-950 tracking-tight">
                {title}
              </Drawer.Title>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
