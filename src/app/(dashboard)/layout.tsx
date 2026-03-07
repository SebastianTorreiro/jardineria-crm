
import { Home, Users, Calendar, DollarSign, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/90 backdrop-blur pb-safe">
        <div className="flex justify-around py-3">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Inicio</span>
          </Link>
          <Link
            href="/clients"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Clientes</span>
          </Link>
          <Link
            href="/visits"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs font-medium">Agenda</span>
          </Link>
          <Link
            href="/inventory"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Briefcase className="h-6 w-6" />
            <span className="text-xs font-medium">Inventario</span>
          </Link>
          <Link
            href="/finances"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs font-medium">Finanzas</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
