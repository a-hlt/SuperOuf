import { NextRequest, NextResponse } from "next/server"

const publicRoutes = ["/login", "/register", "/child/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token")

  const childSession = request.cookies.get("child-session")

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith("/api")
  const isChildRoute = pathname.startsWith("/child") && !pathname.startsWith("/child/login")

  // Never intercept API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Child routes: accept child-session cookie
  if (isChildRoute) {
    if (childSession) return NextResponse.next()
    return NextResponse.redirect(new URL("/child/login", request.url))
  }

  // Not authenticated and trying to access protected route → login
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
