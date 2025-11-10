import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/jwt"
import { getUserByEmail } from "@/lib/db"
import bcrypt from "bcryptjs"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    email: string
    name?: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email y contraseña son requeridos",
        },
        { status: 400 },
      )
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario o contraseña incorrectos",
        },
        { status: 401 },
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario o contraseña incorrectos",
        },
        { status: 401 },
      )
    }

    const jwtToken = await generateToken({
      id: user.id,
      email: user.email,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: "Sesión iniciada correctamente",
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
        },
      },
      { status: 200 },
    )

    response.cookies.set("authToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("[v0] Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
