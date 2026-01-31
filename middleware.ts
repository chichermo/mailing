import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = process.env.AUTH_TOKEN
  if (!authToken) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (token === authToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!token || token !== authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)']
}
