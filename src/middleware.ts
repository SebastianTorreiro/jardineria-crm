
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Refresh Session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 2. Security Logic
  
  // A. Authenticated User
  if (user) {
      // Prevent access to Login/Auth pages (unless specific flows like recovery)
      if (path.startsWith('/login') || path.startsWith('/auth')) {
          const type = request.nextUrl.searchParams.get('type')
          // Allow recovery flow to proceed to /login
          if (type === 'recovery') {
              return supabaseResponse
          }
          // Redirect valid users to Root Dashboard
          return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow access to everything else
      return supabaseResponse
  }

  // B. Unauthenticated User
  // Allow access to Login, Auth, and public assets (handled by matcher)
  if (path === '/login' || path.startsWith('/auth') || path.startsWith('/onboarding')) {
      return supabaseResponse
  }

  // Strictly Protect Everything Else (Dashboard, Root, etc)
  // Redirect to Login
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  // Optional: Add ?next=path to redirect back after login
  url.searchParams.set('next', path)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
