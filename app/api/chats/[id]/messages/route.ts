import { type NextRequest, NextResponse } from "next/server"
import { addMessage, getMessages } from "@/lib/db"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

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
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if (!OPENAI_API_KEY) {
          console.error("[v0] Missing OPENAI_API_KEY env var")
          return NextResponse.json({ success: false, message: "Server misconfigured" }, { status: 500 })
        }
        // Get chat history for context
        const messages = await getMessages(params.id)
        const chatMessages = messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))

        const result = streamText({
          model: openai('gpt-4.1'),
          messages: chatMessages,
          system:
            "Eres un asistente de IA amable y útil especializado en salud mental. Proporciona respuestas empáticas, informativas y basadas en evidencia.",
          temperature: 0.7,
          maxOutputTokens: 1024,
          providerOptions: {
            openai: {
              apiKey: OPENAI_API_KEY,
            },
          },
        })

        return result.toUIMessageStreamResponse({
          onFinish: async (finish) => {
            try {
              const extractText = (f: any): string | undefined => {
                if (!f) return undefined

                // direct text property
                if (typeof f.text === 'string' && f.text.length) return f.text

                // content array on the finish object
                if (Array.isArray(f.content)) {
                  return f.content
                    .map((c: any) => (c && (c.type === 'text' || c.type === 'reasoning') ? c.text : ''))
                    .join('')
                }

                // responseMessage shape (common for some UI helpers)
                const resp = f.responseMessage ?? f.response ?? null
                if (resp) {
                  if (typeof resp.text === 'string' && resp.text.length) return resp.text
                  if (Array.isArray(resp.content)) {
                    return resp.content
                      .map((c: any) => (c && (c.type === 'text' || c.type === 'reasoning') ? c.text : ''))
                      .join('')
                  }
                }

                // messages array: aggregate possible message contents
                if (Array.isArray(f.messages)) {
                  return f.messages
                    .map((m: any) => {
                      if (typeof m.text === 'string') return m.text
                      if (Array.isArray(m.content)) {
                        return m.content
                          .map((c: any) => (c && (c.type === 'text' || c.type === 'reasoning') ? c.text : ''))
                          .join('')
                      }
                      return ''
                    })
                    .join('')
                }

                return undefined
              }

              const generatedText = extractText(finish)

              if (generatedText) {
                // save assistant message to DB
                await addMessage(params.id, 'assistant', generatedText, 'assistant')
              }
            } catch (saveErr) {
              console.error('[v0] Error saving generated assistant message:', saveErr)
            }
          },
        })
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
