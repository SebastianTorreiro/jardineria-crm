
'use client'

import { login, signup } from '@/app/auth/actions'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(errorMsg)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(event.currentTarget)
    const action = (event.nativeEvent as any).submitter.name // 'login' or 'signup'

    let result
    if (action === 'signup') {
        result = await signup(formData)
    } else {
        result = await login(formData)
    }

    if (result?.error) {
        setMessage(result.error)
        setLoading(false)
    }
    // If success, the action redirects, so we don't need to unset loading
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Jardinería CRM
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inicia sesión para gestionar tus clientes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>

            {message && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{message}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                name="login"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
              
              <button
                type="submit"
                name="signup"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
