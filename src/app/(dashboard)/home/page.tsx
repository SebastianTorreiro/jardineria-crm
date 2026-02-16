
import UserMenu from '@/components/UserMenu'

export default function HomePage() {
  return (
    <div className="p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <UserMenu />
      </header>

      <div className="grid gap-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Bienvenido</h3>
          <p className="mt-2 text-gray-600">
            Este es tu panel de control. Aquí verás el resumen de tu actividad.
          </p>
        </div>
        {/* Placeholder specific for dashboard widgets */}
        <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">0</p>
                <p className="text-sm text-green-600">Visitas Hoy</p>
            </div>
             <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">0</p>
                <p className="text-sm text-blue-600">Clientes</p>
            </div>
        </div>
      </div>
    </div>
  )
}
