import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // TODO: Verify Wompy webhook signature
    const body = await request.json()

    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Update payment status based on Wompy webhook
    await sql`UPDATE payments
      SET status = ${body.event === "transaction.success" ? "completed" : "failed"}, transaction_id = ${body.data?.id}, updated_at = NOW()
      WHERE wompy_reference = ${body.data?.reference}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
