import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes that don't require authentication
    const publicRoutes = ["/auth/signin"]
    if (publicRoutes.includes(path)) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Role-based route protection
    const adminOnlyRoutes = ["/users"]
    const vendorRoutes = ["/commission"]
    const guideRoutes = ["/expenses"]

    if (adminOnlyRoutes.includes(path) && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (vendorRoutes.includes(path) && token.role !== "VENDEDOR" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (guideRoutes.includes(path) && 
        token.role !== "GUIA" && 
        token.role !== "TRANSPORTISTA" && 
        token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }: { token: any | null }) => !!token
    },
  }
)

// Specify which routes should be protected by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
