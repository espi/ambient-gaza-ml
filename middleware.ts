import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to the embed route
  if (request.nextUrl.pathname === '/map/embed') {
    const response = NextResponse.next()

    // Set X-Frame-Options header
    // Option 1: Allow all origins (less secure but more flexible)
    response.headers.set('X-Frame-Options', 'ALLOWALL')

    // Option 2: Allow specific origins (more secure)
    // Uncomment and modify the lines below to restrict to specific origins
    // const allowedOrigins = ['https://yourdomain.com', 'https://anotherdomain.com']
    // const origin = request.headers.get('origin')
    // if (origin && allowedOrigins.includes(origin)) {
    //   response.headers.set('X-Frame-Options', `ALLOW-FROM ${origin}`)
    // } else {
    //   response.headers.set('X-Frame-Options', 'DENY')
    // }

    // Additional security headers for embed
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
