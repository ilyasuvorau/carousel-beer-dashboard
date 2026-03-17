import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n middleware for API routes
  const isApi = pathname.startsWith('/api')
  if (!isApi) {
    const intlResponse = intlMiddleware(request)
    // If intl wants to redirect (locale prefix change), return it
    if (intlResponse.status !== 200 || intlResponse.headers.get('x-middleware-rewrite')) {
      // Let it handle if it's a redirect
      if (
        intlResponse.status === 301 ||
        intlResponse.status === 302 ||
        intlResponse.status === 307 ||
        intlResponse.status === 308
      ) {
        return intlResponse
      }
    }
  }

  // Supabase auth check
  let supabaseResponse = NextResponse.next({ request })

  // biome-ignore lint/style/noNonNullAssertion: always set in production
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // biome-ignore lint/style/noNonNullAssertion: always set in production
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        supabaseResponse = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Strip locale prefix to get the clean path
  const localePrefix = routing.locales.find(
    (l) => l !== routing.defaultLocale && pathname.startsWith(`/${l}/`),
  )
  const cleanPath = localePrefix ? pathname.slice(`/${localePrefix}`.length) : pathname
  const prefix = localePrefix ? `/${localePrefix}` : ''

  const isDashboard = cleanPath.startsWith('/dashboard')
  const isLogin = cleanPath === '/login'

  if (!user && (isDashboard || isApi)) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = `${prefix}/login`
    return NextResponse.redirect(loginUrl)
  }

  if (user && isLogin) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = `${prefix}/dashboard`
    return NextResponse.redirect(dashboardUrl)
  }

  // For non-API routes, merge cookies from intl response if it set any
  if (!isApi) {
    const intlResponse = intlMiddleware(request)
    // Copy cookies from supabaseResponse back to intlResponse
    for (const cookie of supabaseResponse.cookies.getAll()) {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie)
    }
    return intlResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
