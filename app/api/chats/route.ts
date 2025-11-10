import { type NextRequest, NextResponse } from "next/server"
import { createChat, getChats } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/auth
    const userId = request.headers.get("x-user-id") || "test-user"
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

    // TODO: Get user ID from session/auth
    const userId = request.headers.get("x-user-id") || "test-user"

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
