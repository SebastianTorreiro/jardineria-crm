import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
            // Handle Password Recovery Redirect
            if (type === 'recovery') {
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('type', 'recovery')
                // Keep the token_hash in url if needed by client, but usually session is enough
                // However, for update password, we just need the session active.
                return NextResponse.redirect(url)
            }

      // redirect user to specified redirect URL or root of app
      const url = request.nextUrl.clone()
      url.pathname = next
      url.searchParams.delete('token_hash')
      url.searchParams.delete('type')
      url.searchParams.delete('next')
      return NextResponse.redirect(url)
    }
  }

  // return the user to an error page with some instructions
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('error', 'Invalid or expired token')
  return NextResponse.redirect(url)
}
