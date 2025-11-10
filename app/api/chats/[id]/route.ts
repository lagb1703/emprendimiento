import { type NextRequest, NextResponse } from "next/server"
import { getChatById, updateChat, deleteChat } from "@/lib/db"

type Params = Promise<{ id: string }>

export async function GET(request: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params
    const chat = await getChatById(params.id)

    if (!chat) {
      return NextResponse.json({ success: false, message: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: chat })
  } catch (error) {
    console.error("[v0] Get chat error:", error)
    return NextResponse.json({ success: false, message: "Error fetching chat" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params
    const body = await request.json()
    const { title, description } = body

    const chat = await updateChat(params.id, title, description)
    return NextResponse.json({ success: true, data: chat })
  } catch (error) {
    console.error("[v0] Update chat error:", error)
    return NextResponse.json({ success: false, message: "Error updating chat" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params
    await deleteChat(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete chat error:", error)
    return NextResponse.json({ success: false, message: "Error deleting chat" }, { status: 500 })
  }
}
