import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" })

  response.cookies.delete("authToken")

  return response
}
