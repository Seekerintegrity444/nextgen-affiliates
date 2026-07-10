import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookieValue } from '@/lib/utils/helpers'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/stats']
  const isPublicPath = publicPaths.some(p => path.startsWith(p))

  // Check for auth token
  const cookieHeader = request.headers.get('cookie') || ''
  const token = getCookieValue(cookieHeader, 'auth-token')

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login with token
  if (path === '/login' && token) {
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}