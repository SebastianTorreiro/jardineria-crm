
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react'

type ViewState = 'sign-in' | 'magic-link' | 'update-password'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [viewState, setViewState] = useState<ViewState>('sign-in')
  
  // Magic Link Toggle (only for sign-in view)
  const [isMagicLink, setIsMagicLink] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Check for recovery flow via query param or auth event
    const type = searchParams.get('type')
    if (type === 'recovery') {
      setViewState('update-password')
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            setViewState('update-password')
        }
    })

    return () => {
        authListener.subscription.unsubscribe()
    }
  }, [searchParams, supabase.auth])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (viewState === 'update-password') {
        const { error } = await supabase.auth.updateUser({ password: password })
        if (error) throw error
        setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' })
        setTimeout(() => {
            router.push('/')
            router.refresh()
        }, 2000)
        return
      }

      if (isMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false, 
            emailRedirectTo: `${location.origin}/auth/confirm`,
          },
        })

        if (error) throw error
        setMessage({ type: 'success', text: 'Check your email for the magic link!' })
        setViewState('magic-link')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      console.error(error)
      setMessage({ type: 'error', text: error.message || 'Authentication failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {viewState === 'update-password' ? 'Update Password' : 'Jardinería CRM'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {viewState === 'update-password' 
            ? 'Enter your new password below' 
            : viewState === 'magic-link' 
                ? 'We sent a magic link to your email' 
                : 'Sign in to your account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {viewState === 'sign-in' && (
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-green-500 focus:ring-green-500 sm:text-sm py-2"
                    placeholder="you@example.com"
                    />
                </div>
                </div>
            )}

            {/* Password Field: Shown for normal login OR update password */}
            {(!isMagicLink || viewState === 'update-password') && viewState !== 'magic-link' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {viewState === 'update-password' ? 'New Password' : 'Password'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={viewState === 'update-password' ? 'new-password' : 'current-password'}
                    required
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-green-500 focus:ring-green-500 sm:text-sm py-2"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {message && (
              <div className={`rounded-md p-4 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                </div>
              </div>
            )}

            {viewState !== 'magic-link' && (
                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        viewState === 'update-password' ? <KeyRound className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    {viewState === 'update-password' 
                        ? 'Update Password' 
                        : isMagicLink ? 'Send Magic Link' : 'Sign in'}
                </button>
                </div>
            )}
          </form>

            {viewState === 'sign-in' && (
                <div className="mt-6">
                    <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setIsMagicLink(!isMagicLink)
                            setMessage(null)
                        }}
                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                    >
                        {isMagicLink ? 'Sign in with Password' : 'Sign in with Magic Link'}
                    </button>
                    </div>
                </div>
          )}
          
          {viewState === 'magic-link' && (
              <div className="mt-6 text-center">
                  <button 
                    onClick={() => {
                        setViewState('sign-in')
                        setMessage(null)
                    }}
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                      Back to Sign In
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

