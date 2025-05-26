import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected and auth routes
const PROTECTED_ROUTES = ["/dashboard", "/reality-check", "/roadmap", "/quests", "/reports"]

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req, res })

    // Get session with error handling
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Middleware session error:", error)
      // Clear potentially corrupted session
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.delete("redirectTo") // Clear any existing redirects
      redirectUrl.searchParams.set("error", "session_error")
      return NextResponse.redirect(redirectUrl)
    }

    // Get the pathname
    const { pathname } = req.nextUrl

    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

    // Check if the route is an auth route
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

    // If the route is protected and the user is not logged in, redirect to login
    if (isProtectedRoute && !session) {
      console.log(`Redirecting unauthenticated user from ${pathname} to login`)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is logged in and trying to access an auth route, redirect to dashboard
    if (isAuthRoute && session) {
      console.log(`Redirecting authenticated user from ${pathname} to dashboard`)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/dashboard"
      return NextResponse.redirect(redirectUrl)
    }

    // Add session info to headers for debugging
    if (session) {
      res.headers.set("x-user-id", session.user.id)
      res.headers.set("x-session-active", "true")
    }

    return res
  } catch (err) {
    console.error("Middleware error:", err)
    // In case of unexpected errors, allow the request to continue
    // but log the error for debugging
    return res
  }
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
