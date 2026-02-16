
import { Home, Users, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white pb-safe">
        <div className="flex justify-around py-3">
          <Link
            href="/home"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            href="/clients"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Clientes</span>
          </Link>
          <Link
            href="/visits"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs font-medium">Agenda</span>
          </Link>
          <Link
            href="/finances"
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600"
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs font-medium">Finanzas</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
