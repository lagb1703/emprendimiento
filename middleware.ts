import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/jwt"

// Rutas que requieren autenticación
// const protectedRoutes = ["/chats", "/admin", "/payment", "/home"]

// SOLO PARA ENTORNO DE FRONT
const protectedRoutes = ["/lol"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Revisar si la ruta requiere autenticación
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const token = request.cookies.get("authToken")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const response = NextResponse.next()
    response.headers.set("x-user-id", payload.id)
    response.headers.set("x-user-email", payload.email)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
