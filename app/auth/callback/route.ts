import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[v0] Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
    }
  }

  // Redirect to dashboard after successful authentication
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
