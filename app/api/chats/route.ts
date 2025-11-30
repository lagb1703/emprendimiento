import { type NextRequest, NextResponse } from "next/server"
import { createChat, getChats } from "@/lib/db"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value
    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: "Token inválido o expirado" }, { status: 401 })
    }
    const userId = payload.id
    const chats = await getChats(userId)
    return NextResponse.json({ success: true, data: chats })
  } catch (error) {
    console.error("[v0] Get chats error:", error)
    return NextResponse.json({ success: false, message: "Error fetching chats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body
    const token = request.cookies.get("authToken")?.value
    if (!token) {
      return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, message: "Token inválido o expirado" }, { status: 401 })
    }
    const userId = payload.id

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 })
    }

    const chat = await createChat(userId, title, description)
    return NextResponse.json({ success: true, data: chat }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create chat error:", error)
    return NextResponse.json({ success: false, message: "Error creating chat" }, { status: 500 })
  }
}
