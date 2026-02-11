import { NextRequest, NextResponse } from "next/server"

const publicRoutes = ["/login", "/register", "/child/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token")

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith("/api")

  // Never intercept API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Not authenticated and trying to access protected route → login
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Authenticated and on a public route (login/register) → home for role routing
  // Removed to prevent infinite redirect loop if session is invalid but cookie exists
  // if (sessionToken && isPublicRoute) {
  //   return NextResponse.redirect(new URL("/", request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
