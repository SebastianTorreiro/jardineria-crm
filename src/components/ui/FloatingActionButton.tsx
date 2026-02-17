import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Add new item"
    >
      <Plus size={24} />
    </button>
  )
}
