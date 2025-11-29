import { type NextRequest, NextResponse } from "next/server"
import { addMessage, getMessages, addAttachment } from "@/lib/db"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import fs from 'fs/promises'
import path from 'path'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { verifyToken } from "@/lib/jwt"

type Params = Promise<{ id: string }>

export const maxDuration = 30

export async function GET(request: NextRequest, props: { params: Params }) {
  try {
    const token = request.cookies.get("authToken")?.value
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }
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
    console.log('[v0] Received add message request')
    const params = await props.params
    const token = request.cookies.get("authToken")?.value
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }
    const form = await request.formData()
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.mkdir(tempDir, { recursive: true })

    const content = form.get('content')?.toString() || ''
    const role = form.get('role')?.toString() || 'user'
    const isStreaming = form.get('isStreaming')?.toString() === 'true'

    let extractedTextFromFile: string | undefined = undefined
    let extractedTextFromSound: string | undefined = undefined

    const saveFormFile = async (f: File) => {
      const buf = Buffer.from(await f.arrayBuffer())
      const safeName = `${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
      const dest = path.join(tempDir, safeName)
      await fs.writeFile(dest, buf)
      try {
        await addAttachment(params.id, payload.id, f.name, f.type || 'application/octet-stream', dest, buf.length)
      } catch (dbErr) {
        console.error('[v0] Error saving attachment metadata:', dbErr)
      }
      // intentar extraer texto según tipo
      const extracted = await processFileToText(dest, buf, f.name, f.type)
      return { dest, buf, extracted }
    }

    const fileEntry = form.get('file')
    if (fileEntry && typeof (fileEntry as any).arrayBuffer === 'function') {
      const f: File = fileEntry as any
      const { dest, buf, extracted } = await saveFormFile(f)
      console.log(`${extracted}`)
      if (extracted && extracted.trim().length) {
        extractedTextFromFile = extracted
      } else if ((f.type || '').startsWith('text/') || f.name.endsWith('.txt') || f.type === 'application/json') {
        extractedTextFromFile = buf.toString('utf8')
      } else {
        extractedTextFromFile = `[Archivo guardado: ${dest} | mime: ${f.type || 'unknown'}]`
      }
    }

    // Procesar campo 'sound' (audio)
    const soundEntry = form.get('sound')
    if (soundEntry && typeof (soundEntry as any).arrayBuffer === 'function') {
      // @ts-ignore
      const s: File = soundEntry as any
      const { dest } = await saveFormFile(s)
      // intentar transcribir usando OpenAI Whisper si está disponible
      try {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if (!OPENAI_API_KEY) {
          console.warn('[v0] OPENAI_API_KEY missing; skipping transcription')
          extractedTextFromSound = `[Audio guardado: ${dest} | transcription unavailable]`
        } else {
          // llamar endpoint de transcripción de OpenAI
          const formData = new FormData()
          const fileBuf = await fs.readFile(dest)
          // Node/Next permite utilizar Blob
          const blob = new Blob([fileBuf])
          formData.append('file', blob, path.basename(dest))
          formData.append('model', 'whisper-1')

          const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: formData as any,
          })

          if (resp.ok) {
            const j = await resp.json()
            extractedTextFromSound = j.text || j.transcription || undefined
          } else {
            console.error('[v0] Transcription failed', await resp.text())
            extractedTextFromSound = `[Audio guardado: ${dest} | transcription failed]`
          }
        }
      } catch (transErr) {
        console.error('[v0] Error transcribing audio:', transErr)
        extractedTextFromSound = `[Audio guardado: ${dest} | transcription error]`
      }
    }

    // --- Extractor helpers ---
    async function processFileToText(filePath: string, buffer: Buffer, filename: string, mime: string | undefined): Promise<string | undefined> {
      const ext = path.extname(filename).toLowerCase()

      try {
        // PDF
        if (mime === 'application/pdf' || ext === '.pdf') {
          try {
            const data = await pdfParse(buffer)
            return data?.text?.toString() || undefined
          } catch (e) {
            console.error('[v0] PDF parse error:', e)
            return undefined
          }
        }

        // DOCX (Word)
        if (ext === '.docx' || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          try {
            const res = await mammoth.extractRawText({ buffer })
            return res?.value || undefined
          } catch (e) {
            console.error('[v0] DOCX parse error:', e)
            return undefined
          }
        }

        // Plain text
        if ((mime || '').startsWith('text/') || ['.txt', '.md', '.csv', '.json'].includes(ext)) {
          return buffer.toString('utf8')
        }

        // Otros tipos: por ahora no extraemos (puedes añadir OCR, video->audio->transcription, etc.)
        return undefined
      } catch (err) {
        console.error('[v0] processFileToText error:', err)
        return undefined
      }
    }
    
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

        // Si se enviaron archivos/audio, adjuntarlos al prompt de usuario
        const extraParts: string[] = []
        if (extractedTextFromFile) extraParts.push(extractedTextFromFile)
        if (extractedTextFromSound) extraParts.push(extractedTextFromSound)
        const combinedUserContent = [content, ...extraParts].filter(Boolean).join('\n\n')
        if (combinedUserContent.length) {
          chatMessages.push({ role: 'user' as const, content: combinedUserContent })
        }

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
    const saveContent = [content, extractedTextFromFile, extractedTextFromSound].filter(Boolean).join('\n\n')
    const message = await addMessage(params.id, payload.id, saveContent ?? '', role as any)
    return NextResponse.json({ success: true, data: message }, { status: 201 })
  } catch (error) {
    console.error("[v0] Add message error:", error)
    return NextResponse.json({ success: false, message: "Error processing message" }, { status: 500 })
  }
}
