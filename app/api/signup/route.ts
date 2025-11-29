import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/jwt"
import { createUser } from "@/lib/db"
import bcrypt from "bcryptjs"

interface SignupPayload {
  fullName: string
  birthDate: string
  email: string
  username: string
  title: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const fullName = formData.get("fullName") as string
    const birthDate = formData.get("birthDate") as string
    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const title = formData.get("title") as string
    const pdfFile = formData.get("pdfFile") as File | null
    const password = formData.get("password") as string
    console.log("Received signup data:", { fullName, birthDate, email, username, title, pdfFile, password })

    // Validation
    if (!fullName || !birthDate || !email || !username || !title || !pdfFile || !password) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Formato de correo inválido" }, { status: 400 })
    }

    // Validate username
    if (username.length < 3) {
      return NextResponse.json({ message: "El nombre de usuario debe tener al menos 3 caracteres" }, { status: 400 })
    }

    // Validate PDF file
    if (pdfFile.type !== "application/pdf") {
      return NextResponse.json({ message: "El archivo debe ser un PDF" }, { status: 400 })
    }

    if (pdfFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "El archivo no debe superar 5MB" }, { status: 400 })
    }

    // Validate password
    if (!password || password.length < 8) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    try {
      const newUser = await createUser(fullName, email, username, passwordHash, birthDate, title)

      const jwtToken = await generateToken({
        id: newUser.id,
        email: newUser.email,
      })

      const response = NextResponse.json(
        {
          success: true,
          message: "Usuario registrado exitosamente",
          user: {
            id: newUser.id,
            fullName: newUser.full_name,
            email: newUser.email,
            username: newUser.username,
            title: newUser.professional_title,
          },
          token: jwtToken,
        },
        { status: 201 },
      )

      response.cookies.set("authToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      })

      return response
    } catch (dbError: any) {
      return NextResponse.json({ message: dbError.message }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
