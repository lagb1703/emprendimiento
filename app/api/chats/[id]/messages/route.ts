import { type NextRequest, NextResponse } from "next/server"
import { addMessage, getMessages } from "@/lib/db"
import { streamText } from "ai"

type Params = Promise<{ id: string }>

export const maxDuration = 30

export async function GET(request: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params
    const messages = await getMessages(params.id)
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("[v0] Get messages error:", error)
    return NextResponse.json({ success: false, message: "Error fetching messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params
    const body = await request.json()
    const { content, role, isStreaming } = body

    const userId = request.headers.get("x-user-id") || "test-user"

    if (!content && !isStreaming) {
      return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 })
    }

    // If it's a streaming AI request, generate response
    if (isStreaming && role === "assistant") {
      try {
        // Get chat history for context
        const messages = await getMessages(params.id)
        const chatMessages = messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))

        const result = streamText({
          model: "openai/gpt-4-turbo",
          messages: chatMessages,
          system:
            "Eres un asistente de IA amable y útil especializado en salud mental. Proporciona respuestas empáticas, informativas y basadas en evidencia.",
          temperature: 0.7,
          maxOutputTokens: 1024,
        })

        return result.toUIMessageStreamResponse()
      } catch (streamError) {
        console.error("[v0] Streaming error:", streamError)
        return NextResponse.json({ success: false, message: "Streaming error" }, { status: 500 })
      }
    }

    // Regular message save
    const message = await addMessage(params.id, userId, content, role)
    return NextResponse.json({ success: true, data: message }, { status: 201 })
  } catch (error) {
    console.error("[v0] Add message error:", error)
    return NextResponse.json({ success: false, message: "Error processing message" }, { status: 500 })
  }
}
