import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for a protected route
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/reality-check") ||
    req.nextUrl.pathname.startsWith("/roadmap") ||
    req.nextUrl.pathname.startsWith("/quests") ||
    req.nextUrl.pathname.startsWith("/reports")

  // Check if the request is for an auth route
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname.startsWith("/forgot-password")

  // If the route is protected and the user is not logged in, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is logged in and trying to access an auth route, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reality-check/:path*",
    "/roadmap/:path*",
    "/quests/:path*",
    "/reports/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
}
