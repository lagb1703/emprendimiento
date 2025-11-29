import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getUserById } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const user = await getUserById(payload.id)

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    delete user.password_hash;

    return NextResponse.json({
      authenticated: true,
      user: user,
    })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
